"use client";
import { motion } from "framer-motion";

export function InfoItem({ icon, label, value, isEditing, onChange }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-marketplace-bg border border-marketplace-border flex items-center justify-center text-marketplace-accent group-hover:bg-marketplace-accent group-hover:text-white transition-all duration-300 shadow-inner">
        {icon}
      </div>
      <div className="text-right flex-1">
        <p className="text-[10px] text-marketplace-text-secondary font-bold uppercase tracking-widest mb-0.5">
          {label}
        </p>
        {isEditing ? (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-marketplace-bg/50 border-b border-marketplace-accent/30 outline-none text-sm text-marketplace-text-primary font-bold focus:border-marketplace-accent transition-colors"
          />
        ) : (
          <p className="text-sm text-marketplace-text-primary font-bold truncate">
            {value || "غير متوفر"}
          </p>
        )}
      </div>
    </div>
  );
}
