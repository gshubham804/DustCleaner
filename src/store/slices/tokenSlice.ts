import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Token } from "../../types";

interface TokenState {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TokenState = {
  tokens: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.error = null;
      state.lastFetched = Date.now();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTokens: (state) => {
      state.tokens = [];
      state.error = null;
      state.lastFetched = null;
    },
    updateToken: (state, action: PayloadAction<{ mint: string; updates: Partial<Token> }>) => {
      const index = state.tokens.findIndex((t) => t.mint === action.payload.mint);
      if (index !== -1) {
        state.tokens[index] = { ...state.tokens[index], ...action.payload.updates };
      }
    },
  },
});

export const { setTokens, setLoading, setError, clearTokens, updateToken } = tokenSlice.actions;
export default tokenSlice.reducer;

