"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 1. Added Next.js router
import {
  ShieldCheck,
  Store,
  User,
  LogIn,
  Clock,
  LogOut,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { ModeToggle } from "@/app/_lib/ModeToggle";
import { supabase } from "@/app/_lib/supabase";
import { getProfile, signOut } from "@/app/_lib/data-service"; // 2. Imported your signOut function
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false); // 3. Added signing out state

  const router = useRouter();

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const profileData = await getProfile(user.id);
      setProfile(profileData);
    } else {
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });
    return () => subscription.unsubscribe();
  }, []);

  // 4. Best Practice Handler: Try/Catch, Loading State, and Redirect
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut(); // Calls your imported function

      router.push("/login"); // Redirect to login
      router.refresh(); // Clears Next.js client-side cache
    } catch (error) {
      console.error("Sign out error:", error);
      // Optional: Add a toast notification here if you use something like sonner or react-hot-toast
    } finally {
      setIsSigningOut(false);
    }
  };

  const config = (() => {
    if (!user)
      return {
        href: "/login",
        label: "تسجيل الدخول",
        icon: LogIn,
        type: "login",
      };

    const role = profile?.role || "buyer";

    if (role === "admin") {
      return {
        href: "/dashboard",
        label: "لوحة الإدارة",
        icon: ShieldCheck,
        type: "admin",
      };
    }

    if (role === "guest") {
      return {
        href: "#",
        label: "طلبك قيد المراجعة",
        icon: Clock,
        type: "guest",
      };
    }

    if (role === "seller") {
      return {
        href: `/profile`,
        label: "متجري",
        icon: Store,
        type: "seller",
      };
    }

    return {
      href: "/profile",
      label: "الملف الشخصي",
      icon: User,
      type: "buyer",
    };
  })();

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-marketplace-accent to-[#0097a7] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              L
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-marketplace-text-primary group-hover:text-marketplace-accent transition-colors">
                لنك الصناعة
              </h1>
              <p className="text-[10px] text-marketplace-text-secondary">
                سوق المتاجر
              </p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {!loading ? (
            <div className="flex items-center gap-2">
              {/* Admin Sign Out Button - Styled with Theme Variables */}
              {config.type === "admin" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  title="تسجيل الخروج"
                >
                  {isSigningOut ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <LogOut size={18} />
                  )}
                </motion.button>
              )}

              {/* Main Profile/Dashboard Button */}
              <Link href={config.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-1 pl-4 py-1 bg-secondary hover:bg-muted border border-border rounded-full transition-all group shadow-sm"
                >
                  {config.type === "guest" ? (
                    <div className="flex items-center gap-2 py-1 pr-3">
                      <div className="w-8 h-8 rounded-full bg-marketplace-accent/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-marketplace-accent animate-pulse" />
                      </div>
                      <span className="text-xs font-bold">
                        {profile?.full_name || "تاجر جديد"}
                      </span>
                    </div>
                  ) : user ? (
                    <>
                      <div className="w-8 h-8 rounded-full border-2 border-marketplace-accent overflow-hidden">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            className="w-full h-full object-cover"
                            alt="avatar"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-bold leading-none">
                          {profile?.full_name || "مستخدم"}
                        </span>
                        <span className="text-[9px] text-marketplace-text-secondary leading-none mt-1">
                          {config.label}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 py-1 pr-3">
                      <config.icon className="w-4 h-4 text-marketplace-accent" />
                      <span className="text-xs font-bold">{config.label}</span>
                    </div>
                  )}
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="w-32 h-10 bg-muted animate-pulse rounded-full" />
          )}
        </div>
      </div>
    </header>
  );
}
