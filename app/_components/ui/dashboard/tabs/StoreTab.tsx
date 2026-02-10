"use client";

import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { ActionButton } from "../components/ActionButton";
import { TableActions, storeActions } from "../components/TableActions";
import { storesData } from "@/app/_lib/Dummy";

// Removed the interface and prop - pure variable-based styling
export function StoresTab() {
  const [hoveredStoreId, setHoveredStoreId] = useState<number | null>(null);

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-colors duration-300 bg-marketplace-card shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="البحث عن المتاجر..."
          />
          <ActionButton onClick={() => console.log("Add store")}>
            إضافة متجر
          </ActionButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right" dir="rtl">
          <thead className="bg-marketplace-bg/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                اسم المتجر
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                التاجر
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                المنتجات
              </th>
              <th className="px-6 py-4 text-marketplace-text-secondary font-semibold">
                الإيرادات
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
            {storesData.map((store) => (
              <tr
                key={store.id}
                className="transition-colors group hover:bg-marketplace-card-hover"
                onMouseEnter={() => setHoveredStoreId(store.id)}
                onMouseLeave={() => setHoveredStoreId(null)}
              >
                <td className="px-6 py-4 text-marketplace-text-primary font-medium">
                  {store.name}
                </td>
                <td className="px-6 py-4 text-marketplace-text-secondary">
                  {store.dealer}
                </td>
                <td className="px-6 py-4 text-marketplace-text-secondary">
                  {store.products}
                </td>
                <td className="px-6 py-4 text-marketplace-accent font-bold">
                  {store.revenue}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      store.status === "نشط"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {store.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-left">
                  <TableActions
                    isHovered={hoveredStoreId === store.id}
                    actions={storeActions}
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
