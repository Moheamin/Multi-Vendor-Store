"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { ModeToggle } from "@/app/_lib/ModeToggle"; // Import your custom button

export default function Header() {
  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-300 
      /* Light Mode Background */
      bg-white/95 border-gray-200
      /* Dark Mode Background */
      dark:bg-[#1a1a1a]/95 dark:border-[#2a2a2a]`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--marketplace-accent)] to-[#0097a7] rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">س</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--marketplace-text-primary)]">
                السوق الإلكتروني
              </h1>
              <p className="text-xs text-[var(--marketplace-text-secondary)]">
                سوق المتاجر
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* 1. The New Modular Toggle Button */}
            <ModeToggle />

            {/* 2. Admin Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--marketplace-accent)] to-[#0097a7] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[var(--marketplace-accent)]/20 transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              لوحة الإدارة
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
