import { PublicKey } from "@solana/web3.js";

export interface Token {
  mint: string;
  balance: number;
  decimals: number;
  price?: number;
  valueUSDT?: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
}

export interface TokenAccount {
  mint: string;
  balance: number;
  decimals: number;
  address: string;
}

export interface JupiterPriceData {
  [mint: string]: {
    id: string;
    mintSymbol: string;
    vsToken: string;
    vsTokenSymbol: string;
    price: number;
  };
}

export interface JupiterQuoteResponse {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  contextSlot: number;
  timeTaken: number;
}

export interface JupiterSwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports?: number;
}

export interface ConversionResult {
  success: boolean;
  tokenMint: string;
  transactionSignature?: string;
  error?: string;
}

export interface WalletState {
  connected: boolean;
  publicKey: PublicKey | null;
  address: string | null;
}




