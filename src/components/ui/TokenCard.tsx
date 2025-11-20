import { motion } from "framer-motion";
import { Coins, ExternalLink } from "lucide-react";
import type { Token } from "../../types";
import { tokenService } from "../../services/token.service";
import Card from "./Card";

interface TokenCardProps {
  token: Token;
  onClick?: () => void;
  selected?: boolean;
  showCheckbox?: boolean;
}

const TokenCard = ({ token, onClick, selected = false, showCheckbox = false }: TokenCardProps) => {
  const formattedMint = tokenService.formatMintAddress(token.mint, 8, 8);

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
      onClick={onClick}
      className={`group transition-all ${onClick ? "cursor-pointer" : ""}`}
    >
      <Card
        variant={selected ? "gradient" : "default"}
        hover={!!onClick}
        className={`${
          selected
            ? "border-[#93DEFF] shadow-lg shadow-[#93DEFF]/20 bg-[#93DEFF]/10"
            : "border-gray-200/50 hover:border-[#93DEFF]/50 hover:shadow-md bg-white/80 backdrop-blur-xl"
        } border transition-all`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {showCheckbox && (
              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    selected
                      ? "bg-[#93DEFF]/20 border border-[#93DEFF]"
                      : "bg-gray-100 border border-gray-200 group-hover:bg-[#93DEFF]/10"
                  }`}
                >
                  {selected && (
                    <div className="w-3 h-3 bg-[#93DEFF] rounded-sm" />
                  )}
                </div>
              </div>
            )}
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#93DEFF]/30 to-[#606470]/20 border border-[#93DEFF]/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Coins className="w-8 h-8 text-[#323643]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-bold text-xl text-[#323643] truncate">
                  {token.symbol || "Unknown Token"}
                </p>
                {token.valueUSDT && token.valueUSDT > 0 && (
                  <span className="px-2 py-1 bg-[#93DEFF]/20 border border-[#93DEFF]/30 rounded-lg text-xs font-bold text-[#323643]">
                    ${token.valueUSDT.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm mb-2">
                <span className="text-[#606470]">
                  Balance:{" "}
                  <span className="text-[#323643] font-bold">
                    {tokenService.formatTokenAmount(token.balance)}
                  </span>
                </span>
                {token.price && token.price > 0 && (
                  <span className="text-[#606470]">
                    Price: <span className="text-[#323643] font-bold">${token.price.toFixed(6)}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#606470] font-mono truncate">
                  {formattedMint}
                </p>
                <a
                  href={`https://solscan.io/token/${token.mint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View ${token.symbol} on Solscan (opens in a new tab)`}
                  className="text-[#93DEFF] hover:text-[#323643] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {!showCheckbox && (
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default TokenCard;
