import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import tokenReducer from "./slices/tokenSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["tokens"], // Only persist tokens
};

const persistedTokenReducer = persistReducer(persistConfig, tokenReducer);

export const store = configureStore({
  reducer: {
    tokens: persistedTokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




