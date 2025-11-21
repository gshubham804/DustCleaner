import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Coins,
  TrendingUp,
  RefreshCw,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTokens } from "../hooks/useTokens";
import TokenModal from "./TokenModal";
import { useNavigate } from "react-router-dom";

// --------------------------------------------
// TOKEN CARD COMPONENT
// --------------------------------------------
const TokenCard = ({ token, selected, showCheckbox, onClick }: { token: any, selected: boolean, showCheckbox: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full text-left relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 border transition-all cursor-pointer group ${
        selected
          ? "border-[#93DEFF] shadow-lg shadow-[#93DEFF]/20"
          : "border-gray-200/50 hover:border-[#93DEFF]/50 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {showCheckbox && (
            <div
              className={`p-2 rounded-lg transition-all ${
                selected
                  ? "bg-[#93DEFF]/20"
                  : "bg-gray-100 group-hover:bg-[#93DEFF]/10"
              }`}
            >
              {selected ? (
                <CheckSquare className="w-5 h-5 text-[#93DEFF]" />
              ) : (
                <Square className="w-5 h-5 text-[#606470]" />
              )}
            </div>
          )}
          <div className="w-12 h-12 bg-gradient-to-br from-[#93DEFF]/30 to-[#606470]/20 rounded-xl flex items-center justify-center font-bold text-[#323643]">
            {token.symbol?.substring(0, 2) || "??"}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#323643] text-lg">
              {token.symbol || "Unknown"}
            </h3>
            <p className="text-sm text-[#606470] font-medium">
              {token.name || "Unknown Token"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-[#323643] text-lg">
            ${token.valueUSDT?.toFixed(2) || "0.00"}
          </p>
          <p className="text-sm text-[#606470]">
            {token.balance.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
          </p>
        </div>
      </div>
    </button>
  );
};

// --------------------------------------------
// USER TOKEN LIST (PARENT COMPONENT)
// --------------------------------------------
const UserTokenList = () => {
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();

  const { tokens, loading, refetch } = useTokens();

  const [sortBy, setSortBy] = useState("value");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const totalValue = tokens.reduce((sum, t) => sum + (t.valueUSDT || 0), 0);

  const sortedTokens = [...tokens].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return (b.valueUSDT || 0) - (a.valueUSDT || 0);
      case "balance":
        return b.balance - a.balance;
      case "name":
        return (a.symbol || a.mint).localeCompare(b.symbol || b.mint);
      default:
        return 0;
    }
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const formatAddress = (address: string) => {
    if (!address) return "Not connected";
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F7F7F7] to-white relative overflow-hidden">
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-10 w-96 h-96 bg-[#93DEFF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-[#606470]/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navbar */}
      <nav className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button 
            className="flex items-center gap-3 bg-transparent border-none p-0 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
            type="button"
          >
            <img src="/Logo.svg" alt="DustCleaner Logo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover" />
            <span className="text-lg sm:text-xl md:text-2xl font-black text-[#323643] tracking-tight">
              <span className="text-[#93DEFF] text-xl sm:text-2xl md:text-3xl">Dust</span>Cleaner
            </span>
          </motion.button>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#323643] rounded-lg px-3 sm:px-4 py-2 font-medium transition-all shadow-sm text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#323643] mb-2">
            Your Tokens
          </h1>
          <p className="text-[#606470] font-mono text-sm">
            {publicKey ? formatAddress(publicKey.toBase58()) : "Not connected"}
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12"
        >
          {/* Total Tokens */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-200/50 shadow-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#93DEFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[#606470] text-sm font-medium mb-2">
                  Total Tokens
                </p>
                <p className="text-4xl sm:text-5xl font-black text-[#323643]">
                  {tokens.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#93DEFF]/30 to-[#606470]/20 rounded-2xl flex items-center justify-center">
                <Coins className="w-8 h-8 text-[#323643]" />
              </div>
            </div>
          </motion.div>

          {/* Total Value */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-200/50 shadow-lg overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#93DEFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[#606470] text-sm font-medium mb-2">
                  Total Value
                </p>
                <p className="text-4xl sm:text-5xl font-black text-[#323643]">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#93DEFF]/30 to-[#606470]/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-[#323643]" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* SORT BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 mb-6 flex-wrap"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl">
            <Filter className="w-4 h-4 text-[#606470]" />
            <span className="text-sm text-[#606470] font-medium">Sort by:</span>
          </div>

          {["balance", "name"].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                sortBy === option
                  ? "bg-gradient-to-r from-[#93DEFF] to-[#606470] text-[#323643] shadow-lg"
                  : "bg-white/80 backdrop-blur-xl hover:bg-gray-50 border border-gray-200 text-[#606470]"
              }`}
            >
              {option}
            </button>
          ))}
        </motion.div>

        {/* TOKEN LIST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12"
        >
          {loading && tokens.length === 0 ? (
            <div className="text-center py-12" aria-live="polite">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#606470]" aria-hidden="true" />
              <p className="text-[#606470]">Loading tokens...</p>
            </div>
          ) : sortedTokens.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50">
              <Coins className="w-12 h-12 mx-auto mb-4 text-[#606470]" />
              <p className="text-[#606470] text-lg font-medium">
                {connected ? "No tokens found" : "Please connect your wallet"}
              </p>
            </div>
          ) : (
            sortedTokens.map((token, index) => (
              <motion.div
                key={token.mint}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ x: 5 }}
              >
                <TokenCard
                  token={token}
                  selected={false}
                  showCheckbox={false}
                  onClick={() => {}}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* CONVERT BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="relative px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#93DEFF] to-[#606470] text-[#323643] rounded-2xl font-black text-lg sm:text-xl shadow-2xl shadow-[#93DEFF]/30 flex items-center gap-3 overflow-hidden group"
          >
            <Sparkles className="w-6 h-6" />
            Convert Tokens to SOL
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* -------------------------------------------- */}
      {/* MODAL */}
      {/* -------------------------------------------- */}
      {showModal && (
        <TokenModal
          tokens={tokens}
          wallet={wallet} // <--- FIXED: Pass wallet to Modal
          onClose={() => setShowModal(false)}
          onConvert={(results: any[]) => {
            console.log("Swap results:", results);
            setShowModal(false);
            handleRefresh(); // refresh after swaps
          }}
        />
      )}
    </main>
  );
};

export default UserTokenList;
