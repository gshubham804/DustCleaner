import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setTokens, setLoading, setError, clearTokens } from "../store/slices/tokenSlice";
import { tokenService } from "../services/token.service";
import showToast from "../components/Toast";

export const useTokens = () => {
  const dispatch = useAppDispatch();
  const { publicKey, connected } = useWallet();
  const { tokens, loading, error } = useAppSelector((state) => state.tokens);

  const fetchTokens = async () => {
    if (!publicKey || !connected) {
      dispatch(clearTokens());
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const tokenData = await tokenService.fetchTokensWithPrices(publicKey);
      dispatch(setTokens(tokenData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tokens";
      dispatch(setError(errorMessage));
      showToast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchTokens();
    } else {
      dispatch(clearTokens());
    }
  }, [connected, publicKey]);

  return {
    tokens,
    loading,
    error,
    refetch: fetchTokens,
  };
};

