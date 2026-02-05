"use client";

import { motion } from "motion/react";
import { ArrowRight, Mail, Phone, Globe } from "lucide-react";
import { ProductCard } from "../product/ProductCard";
import { useState } from "react";

interface StorePageProps {
  store: {
    id: string;
    name: string;
    description: string;
    category: string;
    logo?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  }>;
  onBack: () => void;
  onProductClick: (product: any) => void;
}

export function StorePage({
  store,
  products,
  onBack,
  onProductClick,
}: StorePageProps) {
  const [sortBy, setSortBy] = useState("newest");

  return (
    <motion.div
      dir="rtl" // Force RTL for the store view
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[var(--background)] transition-colors duration-300"
    >
      {/* Back button header */}
      <div className="border-b border-[var(--border)] bg-[var(--marketplace-card-bg)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--marketplace-text-secondary)] hover:text-[var(--marketplace-accent)] transition-colors font-medium"
          >
            {/* ArrowRight points Right in RTL, which means "Back" */}
            <ArrowRight className="w-5 h-5" />
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>

      {/* Store header section */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--marketplace-card-bg)] to-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Store logo */}
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-[var(--border)] flex-shrink-0 bg-[var(--marketplace-bg)] shadow-sm">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[var(--marketplace-accent)]/10 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Store info */}
            <div className="flex-1 text-right">
              <h1 className="text-4xl font-bold text-[var(--marketplace-text-primary)] mb-3 tracking-tight">
                {store.name}
              </h1>
              <p className="text-lg text-[var(--marketplace-text-secondary)] mb-6 max-w-3xl leading-relaxed">
                {store.description}
              </p>

              {/* Contact info grid */}
              <div className="flex flex-wrap gap-6">
                {store.email && (
                  <div className="flex items-center gap-2 text-[var(--marketplace-text-secondary)]">
                    <Mail className="w-4 h-4 text-[var(--marketplace-accent)]" />
                    <span className="text-sm font-medium">{store.email}</span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center gap-2 text-[var(--marketplace-text-secondary)]">
                    <Phone className="w-4 h-4 text-[var(--marketplace-accent)]" />
                    <span className="text-sm font-medium">{store.phone}</span>
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center gap-2 text-[var(--marketplace-text-secondary)]">
                    <Globe className="w-4 h-4 text-[var(--marketplace-accent)]" />
                    <span className="text-sm font-medium">{store.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Header & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[var(--marketplace-text-primary)] mb-1">
              المنتجات
            </h2>
            <p className="text-[var(--marketplace-text-secondary)]">
              يوجد {products.length} منتج متاح حالياً
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--marketplace-text-secondary)] hidden sm:inline">
              ترتيب حسب:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[var(--marketplace-card-bg)] border border-[var(--border)] rounded-xl text-[var(--marketplace-text-primary)] focus:border-[var(--marketplace-accent)] focus:ring-2 focus:ring-[var(--marketplace-accent)]/10 outline-none text-sm transition-all"
            >
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="popular">الأكثر رواجاً</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-[var(--border)] rounded-3xl">
            <p className="text-[var(--marketplace-text-secondary)] text-lg">
              لا توجد منتجات متاحة في هذا المتجر حالياً.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
