import { DEFAULT_RPC_ENDPOINT } from "../constants";

// Get the RPC endpoint based on environment
export const getRpcEndpoint = (): string => {
  // Use environment variable or fallback to default
  return import.meta.env.VITE_PUBLIC_SOLANA_RPC_URL || DEFAULT_RPC_ENDPOINT;
};



