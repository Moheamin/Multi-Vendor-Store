"use client";

import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { ActionButton } from "../components/ActionButton";
import { TableActions, productActions } from "../components/TableActions";
import { productsData } from "@/app/_lib/Dummy";

// No more isDark prop needed
export function ProductsTab() {
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-colors duration-300 bg-marketplace-card shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="البحث عن المنتجات..."
          />
          <ActionButton onClick={() => console.log("Add product")}>
            إضافة منتج
          </ActionButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right" dir="rtl">
          <thead className="bg-marketplace-bg/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                اسم المنتج
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                المتجر
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                الفئة
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                السعر
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                المخزون
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                الحالة
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold text-left">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productsData.map((product) => (
              <tr
                key={product.id}
                className="transition-colors group hover:bg-marketplace-card-hover"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <td className="px-6 py-4 text-marketplace-text-primary font-medium">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-marketplace-text-secondary">
                  {product.store}
                </td>
                <td className="px-6 py-4 text-marketplace-text-secondary">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-marketplace-accent font-bold">
                  {product.price}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock > 20
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : product.stock > 0
                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "متوفر"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : product.status === "مخزون منخفض"
                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <TableActions
                    isHovered={hoveredProductId === product.id}
                    actions={productActions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
