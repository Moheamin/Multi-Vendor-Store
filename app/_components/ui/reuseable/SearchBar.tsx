"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "البحث عن المتاجر، المنتجات أو الفئات...",
}: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto group" dir="rtl">
      {/* 1. Icon moved to the RIGHT (absolute right-4) */}
      <Search
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors duration-300
        text-[var(--marketplace-text-secondary)] group-focus-within:text-[var(--marketplace-accent)]"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        /* 2. Swapped Padding: 
           pr-12 (right padding) makes room for the icon on the right.
           pl-4 (left padding) for standard spacing.
           text-right ensures Arabic text starts from the correct side.
        */
        className="w-full rounded-xl pr-12 pl-4 py-4 text-right outline-none transition-all duration-300
          bg-[var(--marketplace-card-bg)] 
          border border-[var(--border)] 
          text-[var(--marketplace-text-primary)] 
          placeholder:text-[var(--marketplace-text-secondary)]
          
          /* Focus States */
          focus:border-[var(--marketplace-accent)] 
          focus:ring-2 focus:ring-[var(--marketplace-accent)]/10 
          hover:border-[var(--marketplace-accent)]/50
          shadow-sm focus:shadow-md"
      />
    </div>
  );
}
