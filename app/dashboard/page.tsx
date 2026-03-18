import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getDashboardData } from "@/app/_components/data/data";
import { supabaseCookiesServer } from "@/app/_lib/supabase/cookiesServer"; // Ensure path is correct
import DashboardClientWrapper from "@/app/_components/ui/dashboard/DashboardClientWrapper";
import DashboardLoadingSkeleton from "./loading";
import Forbidden from "./not-found"; // Import the notFound function to handle unauthorized access

export const metadata: Metadata = {
  title: "لوحة التحكم | إدارة المنصة",
  description: "نظرة عامة على أداء المتجر، المستخدمين، والإيرادات",
};

// 2. The Data Layer (Server Component) - Now with Security
async function DashboardDataLayer() {
  const supabase = await supabaseCookiesServer();

  // A. Check Authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // B. Check Authorization (Role-based access)
  // We check 'profiles' table for a role of 'admin'
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    // If not an admin, boot them to the home page or a 403 page
    return <Forbidden />; // This will render the 403 Forbidden page we created in app/dashboard/not-found.tsx
  }

  // C. Fetch Data (Only happens if authorized)
  const allData = await getDashboardData();

  return <DashboardClientWrapper initialData={allData} />;
}

// 3. The Main Page Entry
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-marketplace-bg selection:bg-marketplace-accent/20">
      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <DashboardDataLayer />
      </Suspense>
    </div>
  );
}
