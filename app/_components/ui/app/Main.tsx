"use client";

import { motion } from "motion/react";
import { SearchBar } from "../reuseable/SearchBar";
import { Filters } from "../reuseable/Filters";
import { StoreCard } from "./store/StoreCard";
import { useState } from "react";
import { mockStores, mockProducts, categories } from "@/app/_lib/Dummy";
import { StorePage } from "./store/StorePage";
import { ProductModal } from "./product/ProductModal";
import { Hero } from "./Hero";
import Footer from "./Footer";

export default function Main() {
  const [currentView, setCurrentView] = useState<"home" | "store" | "admin">(
    "home",
  );
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const handleStoreClick = (store: any) => {
    setSelectedStore(store);
    setCurrentView("store");
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedStore(null);
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || store.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // if (currentView === "admin") {
  //   return (
  //     <AdminDashboard
  //       onBack={handleBackToHome}
  //       isDark={isDark}
  //       onToggleTheme={toggleTheme}
  //     />
  //   );
  // }

  if (currentView === "store" && selectedStore) {
    return (
      <>
        <StorePage
          store={selectedStore}
          products={mockProducts[selectedStore.id] || []}
          onBack={handleBackToHome}
          onProductClick={handleProductClick}
        />
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Hero />
      <main
        dir="rtl"
        className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Search Section */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="البحث عن المتاجر، المنتجات أو الفئات..."
            />
          </div>

          {/* Filters Section */}
          <div id="stores" className="mb-12">
            <Filters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categories={categories}
            />
          </div>

          {/* Stores Grid Section */}
          <section>
            {/* 2. Mirrored Header: Text aligned right, counter appears to the left of the title */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[var(--marketplace-text-primary)] tracking-tight text-right flex items-center">
                {activeCategory === "all"
                  ? "جميع المتاجر"
                  : `متاجر ${activeCategory}`}
                {/* ml-3 changed to mr-3 for proper RTL spacing between title and count */}
                <span className="text-[var(--marketplace-text-secondary)] mr-3 text-lg font-normal">
                  ({sortedStores.length})
                </span>
              </h2>
            </div>

            {/* 3. Grid Flow: RTL ensures the first store appears on the top-right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedStores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <StoreCard
                    store={store}
                    onClick={() => handleStoreClick(store)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Empty State - Centered as per Arabic design */}
            {sortedStores.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 border-2 border-dashed border-[var(--border)] rounded-2xl"
              >
                <p className="text-[var(--marketplace-text-secondary)] text-lg">
                  لم يتم العثور على متاجر تطابق معاييرك
                </p>
              </motion.div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
