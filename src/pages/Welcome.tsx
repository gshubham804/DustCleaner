import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingUp, Coins, CheckCircle, Lock, RefreshCw } from "lucide-react";

const Welcome = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const features = [
    { icon: Zap, text: "Lightning Fast", desc: "Instant conversions" },
    { icon: Shield, text: "Secure", desc: "Non-custodial" },
    { icon: TrendingUp, text: "Best Rates", desc: "Jupiter powered" },
    { icon: Coins, text: "Easy", desc: "One-click swaps" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F7F7F7] to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!shouldReduceMotion && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-20 left-10 w-96 h-96 bg-[#93DEFF]/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#606470]/10 rounded-full blur-3xl"
            />
          </>
        )}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4 sm:py-5 z-10"
      >
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
          
          {/* REAL WALLET BUTTON - This will work with Solana */}
          <WalletMultiButton 
            className="!bg-gradient-to-r !from-[#323643] !to-[#606470] hover:!from-[#606470] hover:!to-[#323643] !text-white !rounded-xl !px-4 sm:!px-6 md:!px-8 !py-2 sm:!py-3 !transition-all !font-bold !shadow-lg !border-0 !text-sm sm:!text-base"
          />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#93DEFF]/20 to-[#93DEFF]/10 px-5 py-2.5 rounded-full border border-[#93DEFF]/40 shadow-lg backdrop-blur-sm"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-[#93DEFF] rounded-full shadow-lg shadow-[#93DEFF]/50"
              />
              <span className="text-sm font-bold text-[#323643]">Non-custodial & Secure</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#323643] mb-6 leading-none tracking-tight">
                Clean Your
                <span className="block bg-gradient-to-r from-[#93DEFF] via-[#606470] to-[#93DEFF] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Solana Dust
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-[#606470] leading-relaxed max-w-xl"
            >
              Transform scattered token balances into clean SOL with a single click. 
              <span className="text-[#323643] font-semibold"> Powered by Jupiter</span> for the best rates.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {["Zero gas fees optimization", "Best market rates guaranteed", "Instant batch conversions"].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-6 h-6 rounded-full bg-[#93DEFF]/20 flex items-center justify-center group-hover:bg-[#93DEFF]/40 transition-all">
                    <CheckCircle className="w-4 h-4 text-[#93DEFF]" />
                  </div>
                  <span className="text-[#323643] font-semibold">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button - Navigate to token list */}
            {connected && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/user-token-list")}
                className="group relative bg-gradient-to-r from-[#93DEFF] to-[#606470] text-[#323643] px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-2xl font-black text-base sm:text-lg md:text-xl transition-all flex items-center gap-3 shadow-2xl shadow-[#93DEFF]/30 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  View Your Tokens
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            )}

          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl border border-gray-200/50 group cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#93DEFF]/0 to-[#93DEFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#93DEFF]/30 to-[#606470]/20 group-hover:from-[#93DEFF] group-hover:to-[#606470] rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                  >
                    <feature.icon className="w-8 h-8 text-[#323643]" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-black text-[#323643] mb-2">{feature.text}</h3>
                  <p className="text-xs sm:text-sm text-[#606470] font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative bg-white/60 backdrop-blur-xl border-y border-gray-200/50 py-12 sm:py-16 md:py-24 mt-8 sm:mt-12 md:mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#323643] mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-[#606470]">Three simple steps to clean your wallet</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "01", title: "Connect Wallet", desc: "Link your Solana wallet securely", icon: Lock },
              { step: "02", title: "Select Tokens", desc: "Choose dust tokens to convert", icon: Coins },
              { step: "03", title: "Convert to SOL", desc: "One-click batch conversion", icon: RefreshCw },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative text-center group"
              >
                <div className="relative inline-block mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-[#93DEFF]/30 to-transparent rounded-full blur-xl"
                  />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#93DEFF]/30 to-white border-4 border-[#93DEFF]/50 rounded-full flex items-center justify-center group-hover:border-[#93DEFF] transition-all shadow-xl">
                    <item.icon className="w-10 h-10 text-[#323643]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#93DEFF] rounded-full flex items-center justify-center text-[#323643] font-black text-lg shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#323643] mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-[#606470] font-medium max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-[#323643] to-[#606470] text-white py-8 sm:py-12 md:py-16 mt-12 sm:mt-16 md:mt-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#93DEFF] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#93DEFF] rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <img src="/Logo.svg" alt="DustCleaner Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            <span className="text-2xl sm:text-3xl font-black">DustCleaner</span>
          </motion.div>
          <p className="text-[#93DEFF] font-bold text-base sm:text-lg mb-6">Powered by Jupiter Protocol</p>
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 flex-wrap">
            <span>© 2024 DustCleaner</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
};

export default Welcome;