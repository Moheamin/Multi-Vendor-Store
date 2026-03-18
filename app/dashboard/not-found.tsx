// app/dashboard/not-found.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Home, RotateCcw, ShieldAlert, Lock } from "lucide-react";

export default function Forbidden() {
  // Exported as default
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center p-6 min-h-[70vh]"
      dir="rtl"
    >
      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <span className="text-[10rem] font-black text-destructive/10 leading-none select-none">
            403
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="w-20 h-20 text-destructive drop-shadow-[0_0_15px_var(--color-destructive)]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-marketplace-card/40 backdrop-blur-2xl p-8 rounded-[var(--radius)] border border-marketplace-border shadow-2xl"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <Lock className="w-6 h-6 text-destructive" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-marketplace-text-primary mb-4">
            منطقة محظورة!
          </h2>
          <p className="text-marketplace-text-secondary mb-8 text-lg">
            عذراً، لا تملك الصلاحيات الكافية. هذه المنطقة مخصصة للمسؤولين فقط.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <button className="w-full py-4 cursor-pointer bg-marketplace-accent text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <Home className="w-5 h-5" /> الرئيسية
              </button>
            </Link>
            <button
              onClick={() => router.back()}
              className="flex-1 py-4 cursor-pointer bg-marketplace-card/80 text-marketplace-text-primary border border-marketplace-border rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> الرجوع
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
