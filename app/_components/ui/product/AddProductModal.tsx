"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Loader2,
  DollarSign,
  Edit3,
  AlignRight,
} from "lucide-react";
import { createProduct, uploadProductImage } from "@/app/_lib/data-service";

export function AddProductModal({
  isOpen,
  onClose,
  storeId,
  onProductAdded,
}: any) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;
    setLoading(true);
    try {
      const newProduct = await createProduct({
        ...formData,
        price: parseFloat(formData.price) || 0,
        store_id: storeId,
      });
      if (imageFile) {
        await uploadProductImage(imageFile);
      }
      onProductAdded(newProduct);
      onClose();
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
      onClick={onClose}
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-marketplace-card w-full max-w-lg rounded-xl border border-marketplace-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-8 border-b border-marketplace-border/10">
          <h2 className="text-2xl font-bold text-marketplace-text-primary">
            إضافة منتج جديد
          </h2>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer text-marketplace-text-secondary hover:text-marketplace-text-primary hover:bg-marketplace-card-hover rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group h-52 w-full rounded-xl border-2 border-dashed border-marketplace-border bg-marketplace-bg/50 flex flex-col items-center justify-center cursor-pointer hover:border-marketplace-accent transition-all overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-marketplace-accent" size={32} />
                <span className="text-sm text-marketplace-text-secondary font-medium">
                  رفع صورة المنتج
                </span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Edit3
                className="absolute right-4 top-1/2 -translate-y-1/2 text-marketplace-text-secondary"
                size={18}
              />
              <input
                required
                placeholder="اسم المنتج"
                className="w-full bg-marketplace-bg/50 pr-12 pl-4 py-4 rounded-xl border border-marketplace-border outline-none focus:border-marketplace-accent transition-all text-marketplace-text-primary placeholder:text-marketplace-text-secondary"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <DollarSign
                className="absolute right-4 top-1/2 -translate-y-1/2 text-marketplace-text-secondary"
                size={18}
              />
              <input
                required
                type="number"
                placeholder="السعر"
                className="w-full bg-marketplace-bg/50 pr-12 pl-4 py-4 rounded-xl border border-marketplace-border outline-none focus:border-marketplace-accent transition-all text-marketplace-text-primary placeholder:text-marketplace-text-secondary"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <textarea
              placeholder="وصف المنتج..."
              className="w-full bg-marketplace-bg/50 p-6 rounded-xl border border-marketplace-border outline-none focus:border-marketplace-accent h-32 resize-none transition-all text-marketplace-text-primary placeholder:text-marketplace-text-secondary"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-marketplace-accent text-primary-foreground py-5 rounded-xl font-black hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "نشر المنتج"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
