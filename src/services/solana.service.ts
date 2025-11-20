import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getRpcEndpoint } from "../utils/rpc";
import type { TokenAccount } from "../types";

class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(getRpcEndpoint(), "confirmed");
  }

  /**
   * Get all token accounts for a wallet
   */
  async getTokenAccounts(publicKey: PublicKey): Promise<TokenAccount[]> {
    try {
      const accounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      return accounts.value
        .map((acc) => {
          const info = acc.account.data.parsed.info;
          return {
            mint: info.mint,
            balance: parseFloat(info.tokenAmount.uiAmountString || "0"),
            decimals: info.tokenAmount.decimals,
            address: acc.pubkey.toBase58(),
          };
        })
        .filter((acc) => acc.balance > 0);
    } catch (error) {
      console.error("Error fetching token accounts:", error);
      throw error;
    }
  }

  /**
   * Send and confirm transaction
   */
  async sendAndConfirmTransaction(
    signedTransaction: VersionedTransaction
  ): Promise<string> {
    try {
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
        }
      );

      await this.connection.confirmTransaction(signature, "processed");
      return signature;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(signature: string): Promise<boolean> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      return status.value?.err === null;
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return false;
    }
  }

  /**
   * Get SOL balance
   */
  async getSOLBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error getting SOL balance:", error);
      throw error;
    }
  }
}

export const solanaService = new SolanaService();




