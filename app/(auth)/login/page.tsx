"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { signIn } from "@/app/_lib/data-services/auth-service";
import { supabase } from "@/app/_lib/supabase/client"; // Ensure you import your client

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signIn({ email, password });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery session ready");
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("يرجى إدخال بريدك الإلكتروني أولاً");
      return;
    }
    setResetLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    }
    setResetLoading(false);
  };

  return (
    <div
      className="bg-marketplace-card border border-border p-8 rounded-3xl shadow-2xl"
      dir="rtl"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-marketplace-accent to-[#0097a7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-marketplace-accent/20">
          <span className="text-3xl font-bold text-white">س</span>
        </div>
        <h1 className="text-2xl font-bold text-marketplace-text-primary">
          تسجيل الدخول
        </h1>
        <p className="text-marketplace-text-secondary mt-2">
          أهلاً بك مجدداً في السوق الإلكتروني
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl text-center">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 p-3 bg-green-500/10 border border-green-500/50 text-green-500 text-sm rounded-xl text-center">
          {message}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-marketplace-text-secondary mb-2 mr-1">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary"
              placeholder="example@mail.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 mr-1">
            <label className="block text-sm font-medium text-marketplace-text-secondary">
              كلمة المرور
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="cursor-pointer text-xs text-marketplace-accent hover:underline disabled:opacity-50"
            >
              {resetLoading ? "جاري الإرسال..." : "نسيت كلمة المرور؟"}
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-marketplace-bg border border-border rounded-xl py-3 pr-11 pl-4 outline-none focus:ring-2 focus:ring-marketplace-accent/50 transition-all text-marketplace-text-primary"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex cursor-pointer items-center justify-center gap-2 bg-gradient-to-r from-marketplace-accent to-[#0097a7] text-white font-bold py-3 rounded-xl shadow-lg shadow-marketplace-accent/20 hover:opacity-90 transition-opacity mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "دخول"}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-border pt-6">
        <p className="text-marketplace-text-secondary">
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="text-marketplace-accent font-bold hover:underline"
          >
            أنشئ حساباً جديداً
          </Link>
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-marketplace-text-primary mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
