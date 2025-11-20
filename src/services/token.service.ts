import { PublicKey, Connection } from "@solana/web3.js";
import { solanaService } from "./solana.service";
import { jupiterService } from "./jupiter.service";
import { getRpcEndpoint } from "../utils/rpc";
import type { Token } from "../types";

// Metaplex Token Metadata Program ID
const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

class TokenService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(getRpcEndpoint(), "confirmed");
  }

  /**
   * Fetch token metadata from Solana Token List (community-maintained)
   */
  async fetchTokenListMetadata(mintAddress: string): Promise<{ name?: string; symbol?: string }> {
    try {
      // Try to fetch from Solana Token List
      const response = await fetch(
        "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json",
        { signal: AbortSignal.timeout(5000) } // 5 second timeout
      );
      
      if (!response.ok) {
        return {};
      }

      const tokenList = await response.json();
      const tokenInfo = tokenList.tokens?.find(
        (token: any) => token.address === mintAddress
      );

      if (tokenInfo) {
        return {
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
        };
      }

      return {};
    } catch (error) {
      console.error(`Error fetching token list metadata for ${mintAddress}:`, error);
      return {};
    }
  }

  /**
   * Fetch token metadata from Metaplex Token Metadata program
   */
  async fetchTokenMetadata(mintAddress: string): Promise<{ name?: string; symbol?: string }> {
    try {
      const mintPubkey = new PublicKey(mintAddress);
      
      // Derive the metadata PDA (Program Derived Address)
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintPubkey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      // Fetch the metadata account
      const accountInfo = await this.connection.getAccountInfo(metadataPDA);
      
      if (!accountInfo) {
        return {};
      }

      // Parse the metadata account data
      // Metaplex metadata structure: https://docs.metaplex.com/programs/token-metadata/accounts
      const data = accountInfo.data;
      
      // Skip the first bytes (key, update authority, mint, etc.)
      // Metadata structure: key(1) + update_authority(32) + mint(32) + data + ...
      let offset = 1 + 32 + 32; // key + update_authority + mint
      
      // Skip data struct: name_len(4) + name(name_len) + symbol_len(4) + symbol(symbol_len) + uri_len(4) + uri(uri_len)
      // Read name length (u32)
      const nameLength = data.readUInt32LE(offset);
      offset += 4;
      
      // Read name (string)
      const name = data.slice(offset, offset + nameLength).toString('utf8').replace(/\0/g, '').trim();
      offset += nameLength;
      
      // Read symbol length (u32)
      const symbolLength = data.readUInt32LE(offset);
      offset += 4;
      
      // Read symbol (string)
      const symbol = data.slice(offset, offset + symbolLength).toString('utf8').replace(/\0/g, '').trim();
      
      return { name, symbol };
    } catch (error) {
      console.error(`Error fetching metadata for ${mintAddress}:`, error);
      return {};
    }
  }

  /**
   * Fetch all tokens with prices for a wallet
   */
  async fetchTokensWithPrices(publicKey: PublicKey): Promise<Token[]> {
    try {
      // Get token accounts from Solana
      const tokenAccounts = await solanaService.getTokenAccounts(publicKey);

      if (tokenAccounts.length === 0) {
        return [];
      }

      // Get prices from Jupiter
      const mints = tokenAccounts.map((acc) => acc.mint);
      const priceData = await jupiterService.getTokenPrices(mints);

      // Fetch metadata for tokens that don't have it from Jupiter
      // First, try to get metadata from Token List (faster, cached)
      const tokenListMetadataCache: { [mint: string]: { name?: string; symbol?: string } } = {};
      
      // Batch fetch from token list for tokens missing metadata
      const tokensNeedingMetadata = tokenAccounts.filter(
        (acc) => !priceData[acc.mint]?.mintSymbol
      );
      
      if (tokensNeedingMetadata.length > 0) {
        // Fetch token list once and cache results
        try {
          const tokenListResponse = await fetch(
            "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json",
            { signal: AbortSignal.timeout(5000) }
          );
          if (tokenListResponse.ok) {
            const tokenList = await tokenListResponse.json();
            tokensNeedingMetadata.forEach((acc) => {
              const tokenInfo = tokenList.tokens?.find(
                (token: any) => token.address === acc.mint
              );
              if (tokenInfo) {
                tokenListMetadataCache[acc.mint] = {
                  name: tokenInfo.name,
                  symbol: tokenInfo.symbol,
                };
              }
            });
          }
        } catch (error) {
          console.error("Error fetching token list:", error);
        }
      }

      // Now process all tokens with metadata from various sources
      const tokensWithMetadata = await Promise.all(
        tokenAccounts.map(async (acc) => {
          const priceInfo = priceData[acc.mint];
          const price = priceInfo?.price || 0;
          const valueUSDT = acc.balance * price;

          let symbol: string | undefined = priceInfo?.mintSymbol;
          let name: string | undefined = priceInfo?.mintSymbol;

          // If Jupiter doesn't have metadata, try token list
          if (!symbol || !name) {
            const tokenListMeta = tokenListMetadataCache[acc.mint];
            if (tokenListMeta) {
              symbol = symbol || tokenListMeta.symbol;
              name = name || tokenListMeta.name;
            }
          }

          // If still no metadata, try fetching from blockchain (Metaplex)
          if (!symbol || !name) {
            const metadata = await this.fetchTokenMetadata(acc.mint);
            symbol = symbol || metadata.symbol;
            name = name || metadata.name;
          }

          // Final fallback: use shortened mint address
          if (!symbol) {
            symbol = this.formatMintAddress(acc.mint, 4, 4);
          }
          if (!name) {
            name = symbol;
          }

          return {
            mint: acc.mint,
            balance: acc.balance,
            decimals: acc.decimals,
            price,
            valueUSDT,
            symbol,
            name,
          };
        })
      );

      return tokensWithMetadata;
    } catch (error) {
      console.error("Error fetching tokens with prices:", error);
      throw error;
    }
  }

  /**
   * Calculate total value of tokens
   */
  calculateTotalValue(tokens: Token[]): number {
    return tokens.reduce((sum, token) => sum + (token.valueUSDT || 0), 0);
  }

  /**
   * Format token amount
   */
  formatTokenAmount(amount: number, decimals: number = 4): string {
    if (amount === 0) return "0";
    if (amount < 0.0001) return "<0.0001";
    return amount.toFixed(decimals);
  }

  /**
   * Format USD value
   */
  formatUSDValue(value: number): string {
    if (value === 0) return "$0.00";
    if (value < 0.01) return "<$0.01";
    return `$${value.toFixed(2)}`;
  }

  /**
   * Format mint address for display
   */
  formatMintAddress(mint: string, startChars: number = 6, endChars: number = 4): string {
    if (mint.length <= startChars + endChars) return mint;
    return `${mint.slice(0, startChars)}...${mint.slice(-endChars)}`;
  }
}

export const tokenService = new TokenService();




