"use client";

import { AlertTriangle, Ban } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    category?: string;
    stock_quantity?: number;
  };
  isOwner?: boolean;
}

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({ product, isOwner = false }: ProductCardProps) {
  const stock = product.stock_quantity ?? null;
  const isOutOfStock = stock !== null && stock === 0;
  const isLowStock =
    stock !== null && stock > 0 && stock <= LOW_STOCK_THRESHOLD;

  return (
    <motion.div
      dir="rtl"
      whileHover={isOutOfStock ? {} : { y: -6 }}
      className={`relative bg-marketplace-card/50 backdrop-blur-sm rounded-3xl overflow-hidden border transition-all duration-300 shadow-md
        ${
          isOutOfStock
            ? "border-border/20 opacity-60 grayscale cursor-not-allowed"
            : isLowStock
              ? "border-amber-500/30 hover:border-amber-400/60 hover:shadow-amber-500/10 hover:shadow-xl cursor-pointer group"
              : "border-border/40 hover:border-marketplace-accent/30 hover:shadow-xl cursor-pointer group"
        }
      `}
    >
      {/* ── Image ── */}
      <div className="relative aspect-square overflow-hidden m-2 rounded-2xl">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              !isOutOfStock ? "group-hover:scale-110" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full bg-muted/10 flex items-center justify-center" />
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-marketplace-bg/60 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
            <Ban size={32} className="text-marketplace-text-secondary/50" />
            <span className="text-xs font-black text-marketplace-text-secondary/70 uppercase tracking-widest">
              نفدت الكمية
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
            <AlertTriangle size={11} className="shrink-0" />
            <span>{isOwner ? `${stock} متبقية فقط` : "كمية محدودة"}</span>
          </div>
        )}

        {/* Owner: show stock count badge (always) */}
        {isOwner && !isLowStock && !isOutOfStock && stock !== null && (
          <div className="absolute top-2 right-2 bg-marketplace-card/80 backdrop-blur-sm border border-marketplace-border text-marketplace-text-secondary text-[10px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {stock} في المخزن
          </div>
        )}

        <div
          className={`absolute inset-0 transition-colors duration-300 ${
            isLowStock
              ? "bg-amber-400/0 group-hover:bg-amber-400/5"
              : "bg-marketplace-accent/0 group-hover:bg-marketplace-accent/5"
          }`}
        />
      </div>

      {/* ── Details ── */}
      <div className="p-5 text-right">
        <h4
          className={`font-bold text-marketplace-text-primary text-lg mb-1 line-clamp-1 transition-colors ${
            isOutOfStock
              ? "text-marketplace-text-secondary"
              : isLowStock
                ? "group-hover:text-amber-400"
                : "group-hover:text-marketplace-accent"
          }`}
        >
          {product.name}
        </h4>
        <p className="text-xs text-marketplace-text-secondary font-medium mb-4">
          {product.category}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-2xl font-black ${
                isOutOfStock
                  ? "text-marketplace-text-secondary/50 line-through"
                  : isLowStock
                    ? "text-amber-400"
                    : "text-marketplace-accent"
              }`}
            >
              {product.price.toLocaleString()}
            </span>
            <span
              className={`text-xs font-bold opacity-80 ${
                isOutOfStock
                  ? "text-marketplace-text-secondary/50"
                  : isLowStock
                    ? "text-amber-400"
                    : "text-marketplace-accent"
              }`}
            >
              د.إ
            </span>
          </div>

          {isOutOfStock && (
            <span className="text-[10px] font-black text-marketplace-text-secondary/50 bg-marketplace-bg/50 border border-marketplace-border px-2 py-1 rounded-lg">
              غير متاح
            </span>
          )}
        </div>
      </div>

      {/* Low stock bottom bar */}
      {isLowStock && !isOutOfStock && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      )}
    </motion.div>
  );
}
