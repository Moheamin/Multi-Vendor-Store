"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { ModeToggle } from "@/app/_lib/ModeToggle";

export default function Header() {
  return (
    <header
      // Added dir="rtl" to ensure the entire header follows RTL flow
      dir="rtl"
      className="sticky top-0 z-40 backdrop-blur-lg border-b transition-colors duration-300 
      bg-[var(--background)]/95 border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* flex-row-reverse ensures the logo stays on the right and buttons on the left */}
        <div className="flex items-center justify-between">
          {/* 1. Logo Section - Now Right-Aligned */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--marketplace-accent)] to-[#0097a7] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-xl font-bold text-white">س</span>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-[var(--marketplace-text-primary)] leading-tight">
                السوق الإلكتروني
              </h1>
              <p className="text-xs text-[var(--marketplace-text-secondary)]">
                سوق المتاجر
              </p>
            </div>
          </div>

          {/* 2. Actions Section - Now Left-Aligned */}
          <div className="flex items-center gap-3">
            {/* Swapped order: Admin button first, then Toggle, to match image flow */}
            <ModeToggle />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--marketplace-accent)] to-[#0097a7] text-white rounded-lg font-semibold shadow-md shadow-[var(--marketplace-accent)]/10 hover:shadow-lg transition-all"
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
