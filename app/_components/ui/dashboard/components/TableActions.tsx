"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

export interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "success";
}

interface TableActionsProps {
  actions: Action[];
}

export function TableActions({ actions }: TableActionsProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="flex items-center gap-1.5"
      >
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            title={action.label}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${
              action.variant === "danger"
                ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                : action.variant === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                  : "bg-marketplace-bg border-marketplace-border text-marketplace-text-secondary hover:text-marketplace-accent hover:border-marketplace-accent/30"
            }`}
          >
            {action.icon}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export function buildUserActions(
  user: any,
  onEdit: (user: any) => void,
  onDelete: (user: any) => void,
): Action[] {
  return [
    { label: "تعديل", icon: <Pencil size={14} />, onClick: () => onEdit(user) },
    {
      label: "حذف",
      icon: <Trash2 size={14} />,
      onClick: () => onDelete(user),
      variant: "danger",
    },
  ];
}

export function buildStoreActions(
  store: any,
  onEdit: (store: any) => void,
  onDelete: (store: any) => void,
  onToggleActive: (store: any) => void,
): Action[] {
  // Use 'isActive' instead of 'is_active' to match your row mapping
  const active = store.isActive;

  return [
    {
      label: "تعديل",
      icon: <Pencil size={14} />,
      onClick: () => onEdit(store),
    },
    {
      label: active ? "تعطيل" : "تفعيل",
      icon: active ? <XCircle size={14} /> : <CheckCircle size={14} />,
      onClick: () => onToggleActive(store),
      // This will now correctly toggle the variant color
      variant: active ? "danger" : "success",
    },
    {
      label: "حذف",
      icon: <Trash2 size={14} />,
      onClick: () => onDelete(store),
      variant: "danger",
    },
  ];
}

export function buildProductActions(
  product: any,
  onEdit: (product: any) => void,
  onDelete: (product: any) => void,
): Action[] {
  return [
    {
      label: "تعديل",
      icon: <Pencil size={14} />,
      onClick: () => onEdit(product),
    },
    {
      label: "حذف",
      icon: <Trash2 size={14} />,
      onClick: () => onDelete(product),
      variant: "danger",
    },
  ];
}

// Legacy (keep for backward compat if needed)
export const userActions: Action[] = [];
export const storeActions: Action[] = [];
export const productActions: Action[] = [];
