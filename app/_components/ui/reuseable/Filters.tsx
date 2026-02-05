"use client";

import { TrendingUp, Clock, Grid3x3 } from "lucide-react";
import { motion } from "motion/react";

interface FiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function Filters({
  activeFilter,
  onFilterChange,
  activeCategory,
  onCategoryChange,
  categories,
}: FiltersProps) {
  const filters = [
    { id: "all", label: "الكل", icon: Grid3x3 },
    { id: "popular", label: "الأكثر شعبية", icon: TrendingUp },
    { id: "newest", label: "الأحدث", icon: Clock },
  ];

  // Updated to use var(--border) and proper RTL gap handling
  const getButtonClass = (isActive: boolean) => `
    flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium
    ${
      isActive
        ? "bg-[var(--marketplace-accent)] text-white border-[var(--marketplace-accent)] shadow-md shadow-[var(--marketplace-accent)]/20"
        : "bg-[var(--marketplace-card-bg)] text-[var(--marketplace-text-secondary)] border-[var(--border)] hover:border-[var(--marketplace-accent)]/50 hover:bg-[var(--marketplace-card-hover)] hover:text-[var(--marketplace-text-primary)]"
    }
  `;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Sort filters */}
      <div>
        <h3 className="text-sm font-bold text-[var(--marketplace-text-secondary)] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--marketplace-accent)]" />
          ترتيب حسب
        </h3>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onFilterChange(filter.id)}
                className={getButtonClass(activeFilter === filter.id)}
              >
                {/* Icon naturally appears to the right of text in RTL flex */}
                <Icon className="w-4 h-4" />
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div>
        <h3 className="text-sm font-bold text-[var(--marketplace-text-secondary)] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--marketplace-accent)]" />
          الفئات
        </h3>
        <div className="relative">
          <div
            className="flex gap-2 overflow-x-auto pb-4 no-scrollbar
            /* Custom scrollbar styling using theme variables */
            scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange("all")}
              className={`flex-shrink-0 ${getButtonClass(activeCategory === "all")}`}
            >
              الكل
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category)}
                className={`flex-shrink-0 ${getButtonClass(activeCategory === category)}`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
