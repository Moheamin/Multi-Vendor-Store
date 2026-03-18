"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  LogIn,
  Mail,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { verifyEmail } from "@/app/_lib/data-services/auth-service";
import Link from "next/link";

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(!!token);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && email) {
      const autoVerify = async () => {
        try {
          await verifyEmail(email, token);
          setIsSuccess(true);
        } catch (err) {
          setError("انتهت صلاحية الرابط أو تم استخدامه مسبقاً");
        } finally {
          setLoading(false);
        }
      };
      autoVerify();
    }
  }, [token, email]);

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-marketplace-bg"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-marketplace-card border border-marketplace-border p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden backdrop-blur-md"
      >
        {/* Cinematic Background Blurs */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-marketplace-accent/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-marketplace-accent/10 rounded-full blur-3xl" />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center gap-6"
            >
              <div className="relative">
                <Loader2 className="w-14 h-14 text-marketplace-accent animate-spin" />
                <div className="absolute inset-0 blur-xl bg-marketplace-accent/30 animate-pulse" />
              </div>
              <p className="text-marketplace-text-secondary font-medium tracking-wide">
                جاري تأكيد حسابك...
              </p>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 text-marketplace-accent"
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-black text-marketplace-text-primary">
                  تم التفعيل!
                </h1>
                <p className="text-marketplace-text-secondary text-sm sm:text-base leading-relaxed">
                  حسابك الآن نشط بالكامل. انضم إلى مجتمعنا وابدأ رحلة البيع
                  والشراء.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/login"
                  className="group flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg transition-all hover:bg-primary/90"
                >
                  <LogIn className="w-5 h-5" />
                  تسجيل الدخول
                  <ArrowRight className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="prompt" className="space-y-8">
              <div className="w-20 h-20 bg-marketplace-accent/5 rounded-[2rem] flex items-center justify-center mx-auto mb-2 border border-marketplace-accent/10 rotate-3">
                <Mail className="w-10 h-10 text-marketplace-accent" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-marketplace-text-primary">
                  تفقد بريدك الإلكتروني
                </h2>
                <div className="inline-block px-4 py-2 bg-marketplace-accent/5 rounded-full border border-marketplace-accent/10">
                  <p className="text-marketplace-accent text-sm font-semibold truncate max-w-[250px]">
                    {email}
                  </p>
                </div>
                <p className="text-marketplace-text-secondary text-sm leading-relaxed">
                  لقد أرسلنا إليك رابط التحقق. يرجى الضغط عليه لتفعيل حسابك.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <div className="pt-6 border-t border-marketplace-border text-xs text-marketplace-text-secondary/70">
                لم تجد الرسالة؟ تحقق من{" "}
                <span className="text-marketplace-text-primary font-medium">
                  البريد العشوائي
                </span>{" "}
                أو حاول مجدداً.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div
      className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-marketplace-bg"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-marketplace-card border border-marketplace-border p-8 sm:p-12 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden backdrop-blur-md">
        <div className="py-12 flex flex-col items-center gap-6">
          <Loader2 className="w-14 h-14 text-marketplace-accent animate-spin" />
          <p className="text-marketplace-text-secondary font-medium tracking-wide">
            جاري التحميل...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
