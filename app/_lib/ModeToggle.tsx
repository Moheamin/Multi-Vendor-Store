"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="w-10 h-10 p-2.5 rounded-lg bg-gray-100 dark:bg-[#2a2a2a]" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2.5 rounded-lg transition-all 
        /* Light Mode Styles */
        bg-gray-100 text-[var(--marketplace-accent)] hover:bg-gray-200
        /* Dark Mode Styles */
        dark:bg-[#2a2a2a] dark:text-[var(--marketplace-accent)] dark:hover:bg-[#323232]
      `}
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
    >
      {/* We use absolute positioning to swap icons smoothly or just conditional rendering */}
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
