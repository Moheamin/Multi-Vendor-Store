"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  Tag,
  Store,
  Hash,
  Camera,
  Upload,
  Check,
  Loader2,
  DollarSign,
  AlignLeft,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  adminUpsertProduct,
  getStoresForSelect,
  getCategoriesForSelect,
} from "@/app/_lib/data-services/admin-service";
import { uploadProductImage } from "@/app/_lib/data-services/product-service";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any | null;
  onSuccess: () => void;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductModalProps) {
  const isEdit = !!product;
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock_quantity: "",
    store_id: "",
    category_id: "",
    image_url: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadSelectData();
      if (product) {
        setForm({
          name: product.name || "",
          price: String(product.price || ""),
          description: product.description || "",
          stock_quantity: String(product.stock_quantity || ""),
          store_id: product.store_id || "",
          category_id: String(product.category_id || ""),
          image_url: product.image_url || "",
        });
        setPreviewUrl(product.image_url || "");
      } else {
        resetForm();
      }
    }
  }, [product, isOpen]);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      stock_quantity: "",
      store_id: "",
      category_id: "",
      image_url: "",
    });
    setPreviewUrl("");
    setSelectedFile(null);
  };

  async function loadSelectData() {
    try {
      const [s, c] = await Promise.all([
        getStoresForSelect(),
        getCategoriesForSelect(),
      ]);
      setStores(s);
      setCategories(c);
    } catch {
      toast.error("فشل تحميل القوائم");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.store_id) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }
    setIsLoading(true);
    try {
      let finalImageUrl = form.image_url;
      if (selectedFile) finalImageUrl = await uploadProductImage(selectedFile);

      await adminUpsertProduct(product?.id, {
        ...form,
        image_url: finalImageUrl,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity) || 0,
        category_id: form.category_id ? Number(form.category_id) : null,
      });

      toast.success(isEdit ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0f1115] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          dir="rtl"
        >
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-l from-marketplace-accent/5 to-transparent">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <div className="p-2 bg-marketplace-accent/20 rounded-xl text-marketplace-accent">
                <Package size={20} />
              </div>
              {isEdit ? "تعديل بيانات المنتج" : "إضافة منتج جديد"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-marketplace-text-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-3">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase tracking-widest px-1">
                  صورة المنتج
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-56 w-full border-2 border-dashed border-white/10 rounded-[2.5rem] overflow-hidden group bg-white/[0.02] hover:border-marketplace-accent/40 transition-all cursor-pointer flex items-center justify-center"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Product"
                        className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                        <Camera className="text-marketplace-accent" size={28} />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                          تغيير الصورة
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-white/5 rounded-full text-marketplace-text-secondary group-hover:text-marketplace-accent transition-colors">
                        <Upload size={24} />
                      </div>
                      <span className="text-xs font-bold text-white/40">
                        اضغط لرفع صورة المنتج
                      </span>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-marketplace-accent/10 border border-marketplace-accent/20 rounded-xl w-fit"
                  >
                    <Check size={14} className="text-marketplace-accent" />
                    <span className="text-[10px] font-bold text-marketplace-accent">
                      صورة جديدة بانتظار الحفظ
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  اسم المنتج
                </label>
                <div className="relative group">
                  <Tag
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-marketplace-accent"
                  />
                  <input
                    type="text"
                    placeholder="مثال: آيفون 15 برو"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-11 pl-4 text-white font-bold focus:border-marketplace-accent/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  السعر (د.ع)
                </label>
                <div className="relative group">
                  <DollarSign
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-marketplace-accent"
                  />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-11 pl-4 text-white font-black outline-none focus:border-marketplace-accent/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  الكمية المتوفرة
                </label>
                <div className="relative group">
                  <Hash
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-marketplace-accent"
                  />
                  <input
                    type="number"
                    placeholder="0"
                    value={form.stock_quantity}
                    onChange={(e) =>
                      setForm({ ...form, stock_quantity: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-11 pl-4 text-white font-bold outline-none focus:border-marketplace-accent/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  المتجر
                </label>
                <div className="relative group">
                  <Store
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-marketplace-accent"
                  />
                  <select
                    value={form.store_id}
                    onChange={(e) =>
                      setForm({ ...form, store_id: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-marketplace-accent/50 rounded-2xl py-3.5 pr-11 pl-10 outline-none text-white font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0f1115]">
                      اختر متجراً...
                    </option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0f1115]">
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  الفئة
                </label>
                <div className="relative group">
                  <AlignLeft
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-marketplace-accent"
                  />
                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({ ...form, category_id: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-marketplace-accent/50 rounded-2xl py-3.5 pr-11 pl-10 outline-none text-white font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0f1115]">
                      بدون فئة
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0f1115]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  وصف المنتج
                </label>
                <textarea
                  rows={4}
                  placeholder="اكتب تفاصيل المنتج هنا..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 px-5 text-white font-medium outline-none resize-none focus:border-marketplace-accent/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.01]">
            <button
              onClick={onClose}
              className="px-6 py-3 font-bold text-marketplace-text-secondary hover:text-white transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="min-w-[180px] flex items-center justify-center gap-3 px-10 py-3 bg-marketplace-accent text-black rounded-xl font-black shadow-lg shadow-marketplace-accent/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isEdit ? (
                "حفظ التعديلات"
              ) : (
                "إضافة المنتج"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
