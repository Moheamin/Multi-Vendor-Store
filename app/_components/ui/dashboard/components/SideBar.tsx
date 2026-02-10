"use client";

import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Sun,
  Moon,
  Shield,
  TrendingUp,
  Users,
  Store,
  Package,
  DollarSign,
} from "lucide-react";
import type { TabType } from "../types";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onBack: () => void;
}

const navigationItems = [
  { id: "overview" as const, label: "نظرة عامة", icon: TrendingUp },
  { id: "users" as const, label: "المستخدمين", icon: Users },
  { id: "stores" as const, label: "المتاجر", icon: Store },
  { id: "products" as const, label: "المنتجات", icon: Package },
  { id: "revenue" as const, label: "الإيرادات", icon: DollarSign },
];

export function Sidebar({ activeTab, onTabChange, onBack }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="fixed right-0 top-0 h-full w-64 border-l transition-colors duration-300 p-6 
                 bg-sidebar border-sidebar-border"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-colors text-sidebar-foreground hover:text-marketplace-accent"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">العودة للسوق</span>
        </button>

        {/* Theme Toggle using next-themes */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg transition-all bg-sidebar-accent text-sidebar-primary hover:opacity-80"
        >
          {/* We show the icon based on the current active theme */}
          <Sun className="w-4 h-4 hidden dark:block" />
          <Moon className="w-4 h-4 block dark:hidden" />
        </button>
      </div>

      <div
        className="flex items-center gap-3 mb-8 p-3 rounded-lg border transition-colors 
                   bg-gradient-to-l from-marketplace-accent/10 to-transparent border-marketplace-accent/30"
      >
        <Shield className="w-6 h-6 text-marketplace-accent" />
        <div>
          <div className="font-semibold text-sidebar-foreground">
            لوحة الإدارة
          </div>
          <div className="text-xs text-marketplace-text-secondary">
            مالك المنصة
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
