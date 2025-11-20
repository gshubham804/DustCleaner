import { motion } from "framer-motion";

const Background = () => {
  return (
    <>
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed w-[900px] h-[900px] bg-blue-500/25 rounded-full blur-[140px] top-[-200px] left-[-200px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="fixed w-[800px] h-[800px] bg-purple-500/25 rounded-full blur-[140px] bottom-[-200px] right-[-200px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
      />
    </>
  );
};

export default Background;
