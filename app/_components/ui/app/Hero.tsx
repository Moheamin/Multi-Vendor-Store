"use client";

import { ArrowLeft, Package, Store, Users } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const stats = [
    { label: "متجر نشط", value: "+50", icon: Store },
    { label: "منتج", value: "+800", icon: Package },
    { label: "بائع موثوق", value: "+45", icon: Users },
  ];

  return (
    <motion.section
      dir="rtl" // Force RTL flow for this section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden border-b py-24 px-6 transition-colors duration-300
        bg-[var(--background)] border-[var(--border)]"
    >
      {/* Dynamic Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20"
        style={{
          background:
            "linear-gradient(180deg, var(--marketplace-card-bg) 0%, var(--marketplace-bg) 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 text-[var(--marketplace-text-primary)] tracking-tight leading-tight"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          اكتشف المتاجر المميزة
        </motion.h1>

        <p className="text-xl text-[var(--marketplace-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          تسوق من مجموعات منتقاة من تجار موثوقين بمنتجات عالية الجودة.
        </p>

        <motion.button
          onClick={() =>
            document
              .getElementById("stores")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--marketplace-accent)] text-white rounded-xl font-bold shadow-lg shadow-[var(--marketplace-accent)]/20 hover:bg-[#00d4e8] transition-all mb-16"
        >
          تصفح المتاجر
          {/* Changed ArrowRight to ArrowLeft for RTL "Forward" action */}
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        {/* Stats Section - flex-row handles the order naturally under dir="rtl" */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--marketplace-accent)]/10 text-[var(--marketplace-accent)]">
                  <Icon className="w-6 h-6" />
                </div>
                {/* Text alignment is right-aligned for the stat labels */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-[var(--marketplace-text-primary)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--marketplace-text-secondary)]">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--marketplace-accent)] opacity-[0.08] dark:opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />
    </motion.section>
  );
}
