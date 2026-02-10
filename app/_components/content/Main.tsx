"use client";

import { motion } from "motion/react";
import { SearchBar } from "../reuseable/SearchBar";
import { Filters } from "../reuseable/Filters";
import { StoreCard } from "../ui/store/StoreCard";
import { useState } from "react";
import { mockStores, categories } from "@/app/_lib/Dummy";
import { Hero } from "./Hero";
import Footer from "./Footer";
import Link from "next/link"; // Import Link for routing

export default function Main() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter and Sort Logic (Keep this here)
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[var(--marketplace-text-primary)] tracking-tight text-right flex items-center">
                {activeCategory === "all"
                  ? "جميع المتاجر"
                  : `متاجر ${activeCategory}`}
                <span className="text-[var(--marketplace-text-secondary)] mr-3 text-lg font-normal">
                  ({sortedStores.length})
                </span>
              </h2>
            </div>

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
                  {/* WRAP StoreCard with Link */}
                  <Link href={`/store/${store.id}`}>
                    <StoreCard store={store} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
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
