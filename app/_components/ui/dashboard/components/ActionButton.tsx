import { motion } from "motion/react";

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function ActionButton({ onClick, children }: ActionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-4 py-2 cursor-pointer rounded-lg font-semibold transition-colors 
                 bg-marketplace-accent text-white hover:brightness-110"
    >
      {children}
    </motion.button>
  );
}
