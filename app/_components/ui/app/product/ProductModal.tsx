"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart } from "lucide-react";

interface ProductModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
    category?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-[var(--marketplace-card-bg)] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[var(--border)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - Moved to the Left for RTL */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 p-2 bg-[var(--marketplace-bg)]/50 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white text-[var(--marketplace-text-primary)] transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-0 overflow-y-auto">
                {/* 1. Product Image - Now on the Right for RTL flow */}
                <div className="relative aspect-square bg-[var(--marketplace-bg)] overflow-hidden md:order-1">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-[var(--marketplace-accent)]/10 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* 2. Product Details - Now on the Left */}
                <div className="flex flex-col p-8 md:p-10 text-right md:order-2">
                  {product.category && (
                    <span className="text-sm font-bold text-[var(--marketplace-accent)] mb-3 px-3 py-1 bg-[var(--marketplace-accent)]/10 rounded-full w-fit">
                      {product.category}
                    </span>
                  )}

                  <h2 className="text-3xl md:text-4xl font-black text-[var(--marketplace-text-primary)] mb-4 leading-tight">
                    {product.name}
                  </h2>

                  <div className="text-4xl font-black text-[var(--marketplace-accent)] mb-6 flex items-center gap-2">
                    <span className="text-xl font-bold">د.إ</span>
                    <span>{product.price.toLocaleString()}</span>
                  </div>

                  <p className="text-[var(--marketplace-text-secondary)] mb-8 leading-relaxed text-lg">
                    {product.description}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto pt-6 border-t border-[var(--border)]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 bg-[var(--marketplace-accent)] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[var(--marketplace-accent)]/20 hover:bg-[#00d4e8] transition-all"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      إضافة إلى السلة
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
