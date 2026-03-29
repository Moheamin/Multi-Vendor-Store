"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

export interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "success";
  disabled?: boolean; // Added disabled property
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
            disabled={action.disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!action.disabled) action.onClick();
            }}
            title={action.label}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all border ${
              action.disabled
                ? "opacity-40 cursor-not-allowed bg-gray-500/10 border-gray-500/20 text-gray-500"
                : "cursor-pointer"
            } ${
              !action.disabled && action.variant === "danger"
                ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                : !action.disabled && action.variant === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                  : !action.disabled
                    ? "bg-marketplace-bg border-marketplace-border text-marketplace-text-secondary hover:text-marketplace-accent hover:border-marketplace-accent/30"
                    : ""
            }`}
          >
            {action.icon}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * UPDATED: Simplified to let UsersTab handle the "Last Admin" toast logic.
 * This ensures clicking always triggers the parent's handleDeletePrompt.
 */
export function buildUserActions(
  user: any,
  onEdit: (user: any) => void,
  onDelete: (user: any) => void,
  options?: { isLastAdmin?: boolean; isSelf?: boolean },
): Action[] {
  return [
    {
      label: "تعديل",
      icon: <Pencil size={14} />,
      onClick: () => onEdit(user),
    },
    {
      label: "حذف",
      icon: <Trash2 size={14} />,
      // We always call onDelete. The UsersTab component's
      // handleDeletePrompt already contains the toast logic.
      onClick: () => onDelete(user),
      variant: "danger",
      // We don't disable it here because we want the user
      // to be able to click it and see the "Why" toast.
      disabled: false,
    },
  ];
}

export function buildStoreActions(
  store: any,
  onEdit: (store: any) => void,
  onDelete: (store: any) => void,
  onToggleActive: (store: any) => void,
): Action[] {
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
