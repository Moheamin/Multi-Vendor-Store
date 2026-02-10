"use client";
import { motion } from "motion/react";
import { ArrowRight, Mail, Phone, Globe } from "lucide-react";
import { ProductCard } from "@/app/_components/ui/product/ProductCard";
import { useState, use } from "react"; // Added 'use' to handle params
import { mockStores, mockProducts } from "@/app/_lib/Dummy";
import Link from "next/link";
import { ProductModal } from "@/app/_components/ui/product/ProductModal";

// 1. Next.js dynamic routes pass 'params' as a Promise
export default function StorePage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.storeId;

  // 3. Find the data based on that ID
  const store = mockStores.find((s) => String(s.id) === String(id));
  const products = mockProducts[id] || [];
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--marketplace-text-primary)] mb-4">
          المتجر غير موجود
        </p>
        <Link href="/" className="text-[var(--marketplace-accent)] underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }
  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[var(--background)] transition-colors duration-300"
    >
      {/* Back button header - Changed button to Link */}
      <div className="border-b border-[var(--border)] bg-[var(--marketplace-card-bg)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--marketplace-text-secondary)] hover:text-[var(--marketplace-accent)] transition-colors font-medium"
          >
            <ArrowRight className="w-5 h-5" />
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>

      {/* Store header section */}
      <div className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--marketplace-card-bg)] to-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
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

            <div className="flex-1 text-right">
              <h1 className="text-4xl font-bold text-[var(--marketplace-text-primary)] mb-3 tracking-tight">
                {store.name}
              </h1>
              <p className="text-lg text-[var(--marketplace-text-secondary)] mb-6 max-w-3xl leading-relaxed">
                {store.description}
              </p>

              <div className="flex flex-wrap gap-6">
                {store.email && (
                  <div className="flex items-center gap-2 text-[var(--marketplace-text-secondary)]">
                    <Mail className="w-4 h-4 text-[var(--marketplace-accent)]" />
                    <span className="text-sm font-medium">{store?.email}</span>
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[var(--marketplace-card-bg)] border border-[var(--border)] rounded-xl text-[var(--marketplace-text-primary)] outline-none text-sm transition-all"
            >
              <option value="newest">الأحدث</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
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

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
      />
    </motion.div>
  );
}
