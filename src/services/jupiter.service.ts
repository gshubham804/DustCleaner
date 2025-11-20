import {
  JUPITER_PRICE_API,
  JUPITER_QUOTE_API,
  JUPITER_SWAP_API,
  DEFAULT_SLIPPAGE_BPS,
  SOL_MINT,
} from "../constants";
import type {
  JupiterPriceData,
  JupiterQuoteResponse,
  JupiterSwapResponse,
} from "../types";

class JupiterService {
  /**
   * Get token prices from Jupiter API
   */
  async getTokenPrices(mints: string[]): Promise<JupiterPriceData> {
    try {
      const ids = mints.join(",");
      const response = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || {};
    } catch (error) {
      console.error("Error fetching token prices:", error);
      throw error;
    }
  }

  /**
   * Get swap quote from Jupiter
   */
  async getQuote(
    inputMint: string,
    outputMint: string = SOL_MINT,
    amount: number,
    slippageBps: number = DEFAULT_SLIPPAGE_BPS
  ): Promise<JupiterQuoteResponse> {
    try {
      const url = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get quote: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.routePlan) {
        throw new Error("No valid route found for this swap");
      }

      return data;
    } catch (error) {
      console.error("Error getting quote:", error);
      throw error;
    }
  }

  /**
   * Create swap transaction
   */
  async createSwapTransaction(
    userPublicKey: string,
    quoteResponse: JupiterQuoteResponse
  ): Promise<JupiterSwapResponse> {
    try {
      const response = await fetch(JUPITER_SWAP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPublicKey,
          quoteResponse,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create swap: ${errorText}`);
      }

      const data = await response.json();

      if (!data.swapTransaction) {
        throw new Error("Swap transaction missing from response");
      }

      return data;
    } catch (error) {
      console.error("Error creating swap transaction:", error);
      throw error;
    }
  }
}

export const jupiterService = new JupiterService();




