"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Store,
  Link as LinkIcon,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UserCircle2,
  ChevronDown,
  Phone,
  Camera,
  Check,
  Loader2,
} from "lucide-react";
import {
  uploadStoreLogo,
  adminUpsertStore,
  updateStore,
} from "@/app/_lib/data-services/admin-service";

export function StoreModal({
  isOpen,
  onClose,
  store,
  profiles = [],
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!store;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    owner_id: "",
    name: "",
    slug: "",
    phone: "",
    logo_url: "",
    monthly_hosting_fee: "",
    commission_fee_per_sale: "",
    address: "",
    description: "",
    is_active: true,
    is_deleted: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (store && isOpen) {
      setFormData({
        owner_id: store.ownerId || "",
        name: store.name || "",
        slug: store.slug || "",
        phone: store.phone || "",
        logo_url: store.logoUrl || "",
        monthly_hosting_fee: store.monthlyHostingFee?.toString() || "",
        commission_fee_per_sale: store.commissionFeePerSale?.toString() || "",
        address: store.address || "",
        description: store.description || "",
        is_active: store.isActive ?? true,
        is_deleted: store.isDeleted ?? false,
      });
      setPreviewUrl(store.logoUrl || "");
      setSelectedFile(null);
    } else {
      setFormData({
        owner_id: "",
        name: "",
        slug: "",
        phone: "",
        logo_url: "",
        monthly_hosting_fee: "",
        commission_fee_per_sale: "",
        address: "",
        description: "",
        is_active: true,
        is_deleted: false,
      });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [store, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let finalLogoUrl = formData.logo_url;
      if (selectedFile) finalLogoUrl = await uploadStoreLogo(selectedFile);

      const submissionData = { ...formData, logo_url: finalLogoUrl };

      if (isEdit) {
        await updateStore(store.id, submissionData);
      } else {
        await adminUpsertStore(undefined, submissionData);
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Operation failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-l from-marketplace-accent/5 to-transparent flex-shrink-0">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <div className="p-2 bg-marketplace-accent/20 rounded-xl text-marketplace-accent">
                <Store size={20} />
              </div>
              {isEdit ? "تعديل بيانات المتجر" : "إضافة متجر جديد"}
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
                  شعار المتجر
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 w-full border-2 border-dashed border-white/10 rounded-[2.5rem] overflow-hidden group bg-white/[0.02] hover:border-marketplace-accent/40 transition-all cursor-pointer flex items-center justify-center"
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
                        alt="Logo"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
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
                        اضغط لرفع الشعار
                      </span>
                    </div>
                  )}
                </div>
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-marketplace-accent/10 border border-marketplace-accent/20 rounded-xl"
                  >
                    <Check size={14} className="text-marketplace-accent" />
                    <span className="text-[10px] font-bold text-marketplace-accent">
                      صورة جديدة بانتظار الحفظ
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase tracking-wider">
                  المالك المرتبط
                </label>
                <div className="relative group">
                  <UserCircle2
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-marketplace-accent"
                  />
                  <select
                    value={formData.owner_id}
                    onChange={(e) =>
                      setFormData({ ...formData, owner_id: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 focus:border-marketplace-accent/50 rounded-2xl py-3.5 pr-11 pl-10 outline-none text-white font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0f1115]">
                      اختر حساباً...
                    </option>
                    {profiles.map((p: any) => (
                      <option key={p.id} value={p.id} className="bg-[#0f1115]">
                        {p.full_name || "بدون اسم"}
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
                  اسم المتجر
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white font-bold focus:border-marketplace-accent/50 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  (بالإنجليزية حصرًا) الرابط المختصر
                </label>
                <div className="relative">
                  <LinkIcon
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    dir="ltr"
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-4 pl-10 text-white font-bold text-left outline-none focus:border-marketplace-accent/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  رسوم الاستضافة (د.ع)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={formData.monthly_hosting_fee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_hosting_fee: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white font-black outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  رسوم بيع كل منتج (د.ع)
                </label>
                <input
                  type="number"
                  value={formData.commission_fee_per_sale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission_fee_per_sale: e.target.value,
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white font-black outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />
                  <input
                    dir="ltr"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-4 pl-10 text-white font-bold text-left outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-bold text-marketplace-text-secondary uppercase">
                  العنوان
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute right-4 top-4 text-white/20"
                  />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pr-11 pl-4 text-white font-medium outline-none resize-none focus:border-marketplace-accent/50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4">
              <ToggleCard
                label="حالة المتجر"
                sub={formData.is_active ? "نشط حالياً" : "معطل مؤقتاً"}
                active={formData.is_active}
                icon={<AlertCircle size={18} />}
                color="green"
                onClick={() =>
                  setFormData({ ...formData, is_active: !formData.is_active })
                }
              />
            </div>
          </div>

          <div className="p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.01] flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-3 font-bold text-marketplace-text-secondary hover:text-white transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[160px] flex items-center justify-center gap-3 px-10 py-3 bg-marketplace-accent text-black rounded-xl font-black shadow-lg shadow-marketplace-accent/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isEdit ? (
                "تحديث البيانات"
              ) : (
                "إنشاء المتجر"
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ToggleCard({ label, sub, active, icon, color, onClick }: any) {
  const activeStyles = { blue: "bg-blue-500", green: "bg-green-500" }[
    color as "blue" | "green"
  ];
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${active ? `bg-${color}-500/20 text-${color}-400` : "bg-white/5 text-white/20"}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="text-[10px] text-marketplace-text-secondary">{sub}</p>
        </div>
      </div>
      <div
        className={`w-10 h-5 rounded-full relative transition-colors ${active ? activeStyles : "bg-white/10"}`}
      >
        <div
          className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${active ? "left-1" : "left-6"}`}
        />
      </div>
    </div>
  );
}
