import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { jupiterService } from "../services/jupiter.service";
import { solanaService } from "../services/solana.service";
import { tokenService } from "../services/token.service";
import { SOL_MINT } from "../constants";
import type { Token, ConversionResult } from "../types";
import showToast from "../components/Toast";

export const useTokenConversion = () => {
  const { publicKey, signTransaction } = useWallet();
  const [converting, setConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const convertToken = async (
    token: Token
  ): Promise<ConversionResult> => {
    if (!publicKey || !signTransaction) {
      throw new Error("Wallet not connected");
    }

    try {
      const amount = Math.floor(token.balance * 10 ** token.decimals);

      // Get quote
      const quote = await jupiterService.getQuote(
        token.mint,
        SOL_MINT,
        amount
      );

      // Create swap transaction
      const swapData = await jupiterService.createSwapTransaction(
        publicKey.toBase58(),
        quote
      );

      // Deserialize and sign transaction
      const txBuf = Buffer.from(swapData.swapTransaction, "base64");
      const versionedTx = VersionedTransaction.deserialize(txBuf);
      const signedTx = await signTransaction(versionedTx);

      // Send and confirm transaction
      const signature = await solanaService.sendAndConfirmTransaction(signedTx);

      return {
        success: true,
        tokenMint: token.mint,
        transactionSignature: signature,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Conversion failed";
      return {
        success: false,
        tokenMint: token.mint,
        error: errorMessage,
      };
    }
  };

  const convertTokens = async (tokens: Token[]): Promise<ConversionResult[]> => {
    if (!publicKey || !signTransaction) {
      showToast.error("Please connect your wallet first");
      return [];
    }

    if (tokens.length === 0) {
      showToast.error("Please select at least one token");
      return [];
    }

    setConverting(true);
    setConversionProgress({ current: 0, total: tokens.length });

    const results: ConversionResult[] = [];

    try {
      showToast.info(`Converting ${tokens.length} token(s)...`);

      for (let i = 0; i < tokens.length; i++) {
        setConversionProgress({ current: i + 1, total: tokens.length });
        
        const result = await convertToken(tokens[i]);
        results.push(result);

        if (result.success) {
          showToast.success(
            `Converted ${tokenService.formatTokenAmount(tokens[i].balance)} ${tokens[i].symbol || "tokens"} ✅`
          );
        } else {
          showToast.error(
            `Failed to convert ${tokens[i].symbol || tokens[i].mint.slice(0, 6)}: ${result.error}`
          );
        }

        // Small delay between conversions to avoid rate limiting
        if (i < tokens.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      const successCount = results.filter((r) => r.success).length;
      if (successCount > 0) {
        showToast.success(
          `Successfully converted ${successCount} of ${tokens.length} token(s)!`
        );
      }
    } catch (error) {
      console.error("Conversion error:", error);
      showToast.error("Conversion failed");
    } finally {
      setConverting(false);
      setConversionProgress(null);
    }

    return results;
  };

  return {
    converting,
    conversionProgress,
    convertToken,
    convertTokens,
  };
};

