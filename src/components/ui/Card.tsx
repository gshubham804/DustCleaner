import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "gradient" | "glass";
  hover?: boolean;
}

const Card = ({
  children,
  variant = "default",
  hover = false,
  className = "",
  ...props
}: CardProps) => {
  const variants = {
    default: "bg-white/80 backdrop-blur-xl border border-gray-200/50",
    gradient: "bg-gradient-to-br from-[#93DEFF]/20 to-[#606470]/10 backdrop-blur-xl border border-[#93DEFF]/30",
    glass: "bg-white/90 backdrop-blur-2xl border border-white/20",
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      className={`rounded-2xl p-6 shadow-xl ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
