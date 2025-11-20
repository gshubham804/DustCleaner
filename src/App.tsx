import { useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

import { store, persistor } from "./store";
import { DEFAULT_RPC_ENDPOINT } from "./constants";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages
const Welcome = lazy(() => import("./pages/Welcome"));
const UserTokenList = lazy(() => import("./pages/UserTokenList"));
import { SnackbarProvider } from "notistack";

const App = () => {
  // --- Solana RPC endpoint ---
  const endpoint = import.meta.env.VITE_PUBLIC_SOLANA_RPC_URL || DEFAULT_RPC_ENDPOINT;

  // --- Supported Wallets ---
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <BrowserRouter>
                  <Suspense 
                    fallback={
                      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
                        <Loader2 className="w-10 h-10 animate-spin text-[#93DEFF]" />
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<Welcome />} />
                      <Route path="/user-token-list" element={<UserTokenList />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
