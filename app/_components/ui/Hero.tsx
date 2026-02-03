"use client";

import { motion } from "motion/react";
import { ArrowRight, Store, Package, Users } from "lucide-react";

export function Hero() {
  const stats = [
    { label: "متجر نشط", value: "+50", icon: Store },
    { label: "منتج", value: "+800", icon: Package },
    { label: "بائع موثوق", value: "+45", icon: Users },
  ];

  const scrollToStores = () => {
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      /* Using 'dark:' to handle border and background transitions */
      className="relative overflow-hidden border-b py-24 px-6 transition-colors duration-300
        bg-white border-gray-200 
        dark:bg-[#1a1a1a] dark:border-[#2a2a2a]"
    >
      {/* Decorative Gradient Background (CSS Variables based) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background:
            "linear-gradient(180deg, var(--marketplace-card-bg) 0%, var(--marketplace-bg) 100%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[var(--marketplace-text-primary)] tracking-tight">
            اكتشف المتاجر المميزة
          </h1>
          <p className="text-xl text-[var(--marketplace-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            تسوق من مجموعات منتقاة من تجار موثوقين. منتجات عالية الجودة، بائعون
            معتمدون.
          </p>

          <motion.button
            onClick={scrollToStores}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--marketplace-accent)] text-white rounded-xl font-semibold hover:bg-[#00d4e8] transition-all hover:shadow-lg hover:shadow-[var(--marketplace-accent)]/30 mb-12"
          >
            تصفح المتاجر
            <ArrowRight className="w-5 h-5 rotate-180" />
          </motion.button>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-[var(--marketplace-accent)]/10">
                    <Icon className="w-5 h-5 text-[var(--marketplace-accent)]" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--marketplace-text-primary)]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-[var(--marketplace-text-secondary)]">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Decorative blur element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--marketplace-accent)] opacity-[0.05] dark:opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
    </motion.section>
  );
}
