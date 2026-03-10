"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  Store,
  Users,
  FileText,
} from "lucide-react";
import { signUp } from "@/app/_lib/data-services/auth-service";

export default function RegisterPage() {
  const router = useRouter();

  // 1. Updated State Management
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "buyer", // default role
    storeName: "",
    storeDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Handle Form Submission
  // Inside RegisterPage.tsx

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Logic: If they chose "seller" (Dealer), we send them as "guest"
      // If they chose "buyer", they stay "buyer"
      const finalRole = formData.role === "seller" ? "guest" : "buyer";

      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: finalRole, // This maps to your DB roles
        storeName: formData.role === "seller" ? formData.storeName : null,
        storeDescription:
          formData.role === "seller" ? formData.storeDescription : null,
      });

      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 5000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  // Success View
  if (isSuccess) {
    return (
      <div
        className="bg-marketplace-card border border-border p-8 rounded-3xl shadow-2xl text-center"
        dir="rtl"
      >
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-marketplace-text-primary mb-2">
          {formData.role === "seller"
            ? "تم استلام طلب الانضمام!"
            : "تم إنشاء الحساب!"}
        </h2>
        <p className="text-marketplace-text-secondary mb-6 leading-relaxed">
          {formData.role === "seller"
            ? "لقد تم إرسال طلبك للإدارة. يمكنك تصفح الموقع حالياً، وسنقوم بتفعيل متجرك فور مراجعة البيانات."
            : "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول."}
        </p>
        <Link
          href="/login"
          className="text-marketplace-accent font-bold hover:underline"
        >
          الانتقال لصفحة تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div
      className="bg-marketplace-card border border-border p-8 rounded-3xl shadow-2xl"
      dir="rtl"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-marketplace-text-primary">
          إنشاء حساب جديد
        </h1>
        <p className="text-marketplace-text-secondary mt-2">
          انضم إلى مجتمعنا المتنامي
        </p>
      </div>

      {/* Role Selector Toggle */}
      <div className="flex bg-marketplace-bg p-1 rounded-2xl mb-8 border border-border">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, role: "buyer" })}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            formData.role === "buyer"
              ? "bg-marketplace-card text-marketplace-accent shadow-sm"
              : "text-marketplace-text-secondary hover:text-marketplace-text-primary"
          }`}
        >
          <Users size={18} /> مشتري
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, role: "seller" })}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
            formData.role === "seller"
              ? "bg-marketplace-card text-marketplace-accent shadow-sm"
              : "text-marketplace-text-secondary hover:text-marketplace-text-primary"
          }`}
        >
          <Store size={18} /> تاجر
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl text-center">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Standard Fields */}
        <div>
          <label className="block text-sm font-medium text-marketplace-text-secondary mb-2 mr-1">
            الاسم الكامل
          </label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary"
              placeholder="أدخل اسمك الكامل"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-marketplace-text-secondary mb-2 mr-1">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary"
              placeholder="example@mail.com"
            />
          </div>
        </div>

        {/* Conditional Dealer Fields */}
        {formData.role === "seller" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="h-[1px] bg-border my-2" />
            <div>
              <label className="block text-sm font-medium text-marketplace-text-secondary mb-2 mr-1">
                اسم المتجر
              </label>
              <div className="relative">
                <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary border-marketplace-accent/30"
                  placeholder="ما هو اسم متجرك؟"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-marketplace-text-secondary mb-2 mr-1">
                وصف المتجر
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  required
                  rows={3}
                  value={formData.storeDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storeDescription: e.target.value,
                    })
                  }
                  className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary resize-none"
                  placeholder="تحدث قليلاً عن المنتجات التي ستبيعها..."
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-marketplace-text-secondary mb-2 mr-1">
            كلمة المرور
          </label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-marketplace-accent to-[#0097a7] text-white font-bold py-3 rounded-xl shadow-lg shadow-marketplace-accent/20 hover:opacity-90 transition-opacity mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> جاري المعالجة...
            </>
          ) : formData.role === "seller" ? (
            "إرسال طلب الانضمام"
          ) : (
            "إنشاء الحساب"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-marketplace-text-secondary">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="text-marketplace-accent font-bold hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
