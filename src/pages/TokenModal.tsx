import { motion } from "framer-motion";
import { AlertCircle, CheckSquare, Loader2, Sparkles, Square, X } from "lucide-react";
import TokenCard from "../components/ui/TokenCard";
import { useState, useEffect, useRef } from "react";
import { solanaService } from "../services/solana.service";
import { VersionedTransaction } from "@solana/web3.js";
import { jupiterService } from "../services/jupiter.service";
import { SOL_MINT } from "../constants";

const TokenModal = ({ tokens, onClose, onConvert, wallet }: { tokens: any[], onClose: () => void, onConvert: (results: any[]) => void, wallet: any }) => {
  const [selectedTokens, setSelectedTokens] = useState(new Set(tokens.map(t => t.mint)));
  const [converting, setConverting] = useState(false);
  const allSelected = selectedTokens.size === tokens.length;
  
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Save currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // 2. Focus the modal container
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // 3. Trap focus logic
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // 4. Cleanup: Restore focus
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose]);

  const toggleToken = (mint: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(mint)) newSelected.delete(mint);
    else newSelected.add(mint);
    setSelectedTokens(newSelected);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTokens(new Set());
    } else {
      setSelectedTokens(new Set(tokens.map(t => t.mint)));
    }
  };

const handleConvert = async () => {
  try {
    setConverting(true);

    const selected = tokens.filter(t => selectedTokens.has(t.mint));

    if (!selected.length) return;

    const results = [];

    for (const token of selected) {
      try {
        // 1) Convert balance to raw amount (integer)
        const rawAmount = Math.floor(token.balance * 10 ** token.decimals);

        // 2) Get quote from Jupiter
        const quote = await jupiterService.getQuote(
          token.mint,
          SOL_MINT,
          rawAmount
        );

        // 3) Create swap transaction
        const swapTx = await jupiterService.createSwapTransaction(
          wallet.publicKey.toBase58(),
          quote
        );

        // 4) Deserialize & sign transaction
        const txBuffer = Buffer.from(swapTx.swapTransaction, "base64");
        const transaction = VersionedTransaction.deserialize(txBuffer);

        const signedTx = await wallet.signTransaction(transaction);

        // 5) Send & confirm
        const signature = await solanaService.sendAndConfirmTransaction(signedTx);

        results.push({
          mint: token.mint,
          symbol: token.symbol,
          signature,
          status: "success",
        });

      } catch (innerErr) {
        console.error(`Swap failed for ${token.symbol}:`, innerErr);
        results.push({
          mint: token.mint,
          symbol: token.symbol,
          status: "failed",
          error: innerErr instanceof Error ? innerErr.message : "Unknown error",
        });
      }
    }

    setConverting(false);
    onConvert(results);

  } catch (err) {
    console.error("Conversion error:", err);
    setConverting(false);
  }
};

  const selectedValue = tokens
    .filter(t => selectedTokens.has(t.mint))
    .reduce((sum, t) => sum + (t.valueUSDT || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#323643]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden outline-none"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#93DEFF]/20 to-[#606470]/10 px-6 py-5 border-b border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-[#93DEFF]/10 to-transparent"></div>
          <div className="relative flex items-start justify-between">
            <div>
              <h2 id="modal-title" className="text-2xl font-black text-[#323643] mb-1">Select Tokens to Convert</h2>
              <p className="text-sm text-[#606470]">
                <span className="font-bold text-[#93DEFF]">{selectedTokens.size}</span> of {tokens.length} selected • 
                <span className="font-bold text-[#323643]"> ${selectedValue.toFixed(2)}</span> total value
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-[#606470]" />
            </button>
          </div>
        </div>

        {/* Select All */}
        <div className="px-6 py-4 bg-[#F7F7F7] border-b border-gray-200">
          <button
            onClick={toggleSelectAll}
            className="group flex items-center gap-3 text-[#323643] hover:text-[#93DEFF] transition-colors font-bold"
          >
            <div className="p-2 rounded-xl bg-white group-hover:bg-[#93DEFF]/20 transition-all border border-gray-200">
              {allSelected ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </div>
            <span>{allSelected ? "Deselect All" : "Select All"}</span>
          </button>
        </div>

        {/* Info Banner */}
        {selectedTokens.size > 0 && (
          <div className="mx-6 mt-4 p-4 bg-[#93DEFF]/10 border border-[#93DEFF]/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#93DEFF] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#323643]">
              <p className="font-bold text-[#93DEFF] mb-1">Conversion Info</p>
              <p className="text-[#606470]">Selected tokens will be converted to SOL using Jupiter. Each conversion is a separate transaction.</p>
            </div>
          </div>
        )}

        {/* Token List */}
        <div className="p-6 space-y-3 max-h-[50vh] overflow-y-auto">
          {tokens.map((token) => (
            <TokenCard
              key={token.mint}
              token={token}
              selected={selectedTokens.has(token.mint)}
              showCheckbox={true}
              onClick={() => toggleToken(token.mint)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-[#F7F7F7] border-t border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#606470] text-sm">Selected:</span>
                <span className="text-[#323643] font-black text-2xl">{selectedTokens.size}</span>
                <span className="text-[#606470] text-sm">token(s)</span>
              </div>
              {selectedValue > 0 && (
                <p className="text-xs text-[#606470]">
                  Total value: <span className="text-[#93DEFF] font-bold">${selectedValue.toFixed(2)}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={converting}
                className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-[#323643] font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConvert}
                disabled={converting || selectedTokens.size === 0}
                className="relative px-8 py-3 bg-gradient-to-r from-[#93DEFF] to-[#606470] hover:from-[#93DEFF]/90 hover:to-[#606470]/90 text-[#323643] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2 overflow-hidden group"
              >
                {converting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Convert to SOL
                  </>
                )}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TokenModal;