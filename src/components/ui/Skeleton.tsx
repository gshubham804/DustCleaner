import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  className = "",
  ...props
}: SkeletonProps) => {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: width || "100%",
    height: height || "1rem",
  };

  return (
    <div
      className={`bg-white/10 animate-pulse ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;




