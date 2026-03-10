"use client";

import { useState, useEffect, useMemo } from "react"; // Added useMemo for performance
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Share2,
  Info,
  LayoutGrid,
  ArrowRight,
  Settings2,
  Save,
  Plus,
  Check,
  Camera,
  Loader2,
  X,
  Search,
  ShoppingBag, // Added Search and ShoppingBag icons
} from "lucide-react";
import Link from "next/link";
import { InfoItem } from "@/app/_components/ui/product/InfoItem";
import { AddProductModal } from "@/app/_components/ui/product/AddProductModal";
import { ProductModal } from "@/app/_components/ui/product/ProductModal";
import { updateStoreData } from "@/app/_lib/data-services/store-service";
import {
  getOwnerPhone,
  uploadAvatar,
} from "@/app/_lib/data-services/profile-service";
import { supabase } from "@/app/_lib/supabase/client";
import { ProductCard } from "../product/ProductCard";

export default function StoreClientWrapper({
  store: initialStore,
  initialProducts,
}: any) {
  const [store, setStore] = useState(initialStore);
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState(""); // 1. Search State

  // Modal & Edit States
  const [isOwner, setIsOwner] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [copied, setCopied] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialStore });

  // 2. Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id === store.owner_id) {
        setIsOwner(true);
        if (!store.phone) {
          const profilePhone = await getOwnerPhone(store.owner_id);
          setEditForm((prev: any) => ({ ...prev, phone: profilePhone }));
        }
      }
    }
    init();
  }, [store.owner_id, store.phone]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateStoreData(store.id, editForm);
      setStore(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...store });
    setIsEditing(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen bg-marketplace-bg text-marketplace-text-primary pb-32 transition-all duration-700"
      dir="rtl"
    >
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            src={store.logo_url}
            className="w-full h-full object-cover blur-[80px] saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-marketplace-bg/60 to-marketplace-bg" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative group mb-6"
          >
            <div className="absolute -inset-1 bg-marketplace-accent rounded-[3rem] blur opacity-20 animate-pulse" />
            <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-[2.8rem] bg-marketplace-card border border-marketplace-border p-2 shadow-2xl overflow-hidden">
              <img
                src={store.logo_url}
                className="w-full h-full object-cover rounded-[2.4rem]"
                alt="Logo"
              />
              {isOwner && (
                <label className="absolute inset-0 bg-marketplace-bg/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Camera className="text-marketplace-text-primary" size={32} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadAvatar(store.owner_id, file);
                        const updated = await updateStoreData(store.id, {
                          logo_url: url,
                        });
                        setStore(updated);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.input
                key="editing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="text-4xl md:text-6xl font-black bg-transparent border-b-2 border-marketplace-accent/50 text-center outline-none px-4"
              />
            ) : (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-5xl md:text-7xl font-black text-marketplace-text-primary tracking-tight"
              >
                {store.name}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute top-0 w-full p-8 flex justify-between items-center z-50">
          <Link
            href="/"
            className="p-3 rounded-xl bg-marketplace-card/50 border border-marketplace-border backdrop-blur-md hover:bg-marketplace-card-hover transition-all"
          >
            <ArrowRight className="text-marketplace-text-primary" />
          </Link>
          <div className="flex gap-3">
            <AnimatePresence>
              {isEditing && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-destructive/10 text-destructive rounded-xl font-bold border border-destructive/20 hover:bg-destructive/20 transition-all"
                >
                  <X size={18} /> <span>إلغاء</span>
                </motion.button>
              )}
            </AnimatePresence>
            {isOwner && (
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="flex items-center gap-2 px-6 py-3 bg-marketplace-accent text-primary-foreground rounded-xl font-bold shadow-xl shadow-marketplace-accent/20 hover:scale-105 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : isEditing ? (
                  <Save size={18} />
                ) : (
                  <Settings2 size={18} />
                )}
                <span>{isEditing ? "حفظ" : "تعديل المتجر"}</span>
              </button>
            )}
            <button
              onClick={copyUrl}
              className="p-3 rounded-xl bg-marketplace-card/50 border border-marketplace-border backdrop-blur-md hover:bg-marketplace-card-hover transition-all"
            >
              {copied ? (
                <Check size={20} className="text-marketplace-accent" />
              ) : (
                <Share2 size={20} />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. INFO STRIP */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <motion.div className="bg-marketplace-card/50 backdrop-blur-2xl border border-marketplace-border rounded-xl p-8 shadow-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-marketplace-accent font-bold text-[10px] uppercase tracking-[0.2em]">
                <Info size={14} /> <span>عن المتجر</span>
              </div>
              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full bg-marketplace-bg/50 p-4 rounded-xl border border-marketplace-border outline-none text-marketplace-text-primary h-24 resize-none"
                />
              ) : (
                <p className="text-marketplace-text-secondary text-lg leading-relaxed font-medium">
                  {store.description || "أهلاً بكم في متجرنا المتميز."}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-5 border-r border-marketplace-border pr-10">
              <InfoItem
                isEditing={isEditing}
                icon={<MapPin size={18} />}
                label="الموقع"
                value={editForm.address}
                onChange={(v: string) =>
                  setEditForm({ ...editForm, address: v })
                }
              />
              <InfoItem
                isEditing={isEditing}
                icon={<Phone size={18} />}
                label="الهاتف"
                value={editForm.phone}
                onChange={(v: string) => setEditForm({ ...editForm, phone: v })}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. PREMIUM COMMAND BAR (Now with Search) */}
      <div className="sticky top-6 z-40 container mx-auto px-6 mt-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-marketplace-card/80 backdrop-blur-2xl border border-marketplace-border rounded-2xl p-3 flex flex-col md:flex-row items-center gap-4 shadow-2xl"
        >
          {/* Label Section */}
          <div className="flex items-center gap-4 px-4 border-l border-marketplace-border/50 hidden md:flex">
            <div className="p-3 bg-marketplace-accent/10 rounded-xl text-marketplace-accent">
              <LayoutGrid size={22} />
            </div>
            <div className="flex flex-col min-w-[120px]">
              <span className="text-[10px] text-marketplace-accent/60 font-bold uppercase tracking-widest leading-none mb-1">
                القائمة
              </span>
              <span className="text-xl font-bold text-marketplace-text-primary leading-none">
                المنتجات
              </span>
            </div>
          </div>

          {/* 3. Search Input Field */}
          <div className="relative flex-1 w-full group">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-marketplace-text-secondary group-focus-within:text-marketplace-accent transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-marketplace-bg/40 border border-marketplace-border rounded-xl py-4 pr-12 pl-4 text-marketplace-text-primary outline-none focus:border-marketplace-accent/50 focus:bg-marketplace-bg/60 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-marketplace-text-secondary hover:text-destructive transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="group relative overflow-hidden bg-marketplace-accent text-primary-foreground flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black transition-all active:scale-95 w-full md:w-auto"
            >
              <Plus
                size={20}
                className="transition-transform group-hover:rotate-90"
              />
              <span>إضافة منتج</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* 4. PRODUCT GRID */}
      <main className="container mx-auto px-6 mt-16">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product: any) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer transition-transform active:scale-95"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* 4. Empty Search State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-24 h-24 bg-marketplace-card border border-marketplace-border rounded-full flex items-center justify-center mb-6 text-marketplace-text-secondary/20">
                <ShoppingBag size={48} />
              </div>
              <h3 className="text-2xl font-bold text-marketplace-text-primary mb-2">
                لا توجد نتائج لـ "{searchQuery}"
              </h3>
              <p className="text-marketplace-text-secondary">
                جرب البحث بكلمات أخرى أو تحقق من الإملاء.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 text-marketplace-accent font-bold hover:underline"
              >
                عرض جميع المنتجات
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 5. MODALS */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        storeId={store?.id}
        onProductAdded={(newP: any) => setProducts([newP, ...products])}
      />
    </div>
  );
}
