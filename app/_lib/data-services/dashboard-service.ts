// app/_lib/data-services/dashboard-service.ts
import { supabaseCookiesServer } from "@/app/_lib/supabase/cookiesServer";

// 1️⃣ Dashboard Stats
export async function getDashboardStats() {
  const supabase = await supabaseCookiesServer();

  const [
    { count: usersCount },
    { count: storesCount },
    { count: productsCount },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("stores").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("product_price_at_click"),
  ]);

  const totalRevenue =
    revenueData?.reduce(
      (sum, order) => sum + (order.product_price_at_click || 0),
      0,
    ) || 0;

  return {
    usersCount: usersCount || 0,
    storesCount: storesCount || 0,
    productsCount: productsCount || 0,
    totalRevenue,
  };
}

// 2️⃣ Growth Metrics
export async function getGrowthMetrics() {
  const supabase = await supabaseCookiesServer();

  const now = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(now.getMonth() - 1);

  const [
    { count: usersThisMonth },
    { count: usersLastMonth },
    { data: revenueThisMonth },
    { data: revenueLastMonth },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth.toISOString()),

    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .lt("created_at", lastMonth.toISOString()),

    supabase
      .from("orders")
      .select("product_price_at_click")
      .gte("created_at", lastMonth.toISOString()),

    supabase
      .from("orders")
      .select("product_price_at_click")
      .lt("created_at", lastMonth.toISOString()),
  ]);

  const revenueNow =
    revenueThisMonth?.reduce(
      (s, o) => s + (o.product_price_at_click || 0),
      0,
    ) || 0;

  const revenueBefore =
    revenueLastMonth?.reduce(
      (s, o) => s + (o.product_price_at_click || 0),
      0,
    ) || 0;

  const userGrowth =
    usersLastMonth && usersLastMonth > 0
      ? ((usersThisMonth! - usersLastMonth) / usersLastMonth) * 100
      : 0;

  const revGrowth =
    revenueBefore > 0
      ? ((revenueNow - revenueBefore) / revenueBefore) * 100
      : 0;

  return {
    userGrowth: Math.round(userGrowth),
    revGrowth: Math.round(revGrowth),
  };
}

// 3️⃣ Recent Users
export async function getRecentUsers(limit = 5) {
  const supabase = await supabaseCookiesServer();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data || [];
}

// 4️⃣ Revenue Chart
export async function getRevenueChartData() {
  const supabase = await supabaseCookiesServer();

  const { data, error } = await supabase
    .from("orders")
    .select("created_at,product_price_at_click");

  if (error) throw error;

  const monthly: Record<string, { revenue: number; orders: number }> = {};

  data?.forEach((order) => {
    const date = new Date(order.created_at);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthly[key]) {
      monthly[key] = { revenue: 0, orders: 0 };
    }

    monthly[key].revenue += order.product_price_at_click || 0;
    monthly[key].orders += 1;
  });

  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  return Object.entries(monthly).map(([key, val]) => {
    const [, month] = key.split("-");

    return {
      month_name: months[Number(month)],
      revenue: val.revenue,
      orders: val.orders,
      growth: 0,
    };
  });
}

// 5️⃣ Admin Stores
export async function getAdminStores() {
  const supabase = await supabaseCookiesServer();

  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getProduct(id: string) {
  const { notFound } = await import("next/navigation");
  const supabase = await supabaseCookiesServer();

  const { data, error } = await supabase
    .from("products")
    .select("*, stores(*)")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();
  if (error || !data) notFound();
  return data;
}

export async function getInventoryWarnings() {
  const supabase = await supabaseCookiesServer();

  const { data } = await supabase
    .from("products")
    .select("*, stores(name)")
    .lt("stock_quantity", 5)
    .limit(5);
  return data || [];
}

export async function getTopStores() {
  const supabase = await supabaseCookiesServer();

  const { data } = await supabase
    .from("view_store_analytics")
    .select("*")
    .order("total_revenue", { ascending: false })
    .limit(5);
  return data || [];
}

// ⚠️ Server-only functions below — only call from Server Components or API routes
// These are kept here for convenience but require createServerSupabase when
// cookie-based auth is needed. Import createServerSupabase directly in those files.

export async function getStoreBySlug(slug: string) {
  const supabase = await supabaseCookiesServer();

  const { notFound } = await import("next/navigation");
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) notFound();
  return data;
}

export async function getStorePageData(storeId: string) {
  const supabase = await supabaseCookiesServer();

  if (!storeId) return { store: null, products: [] };
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      storeId,
    );

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("*")
    .eq(isUuid ? "id" : "slug", storeId)
    .eq("is_deleted", false)
    .maybeSingle();

  if (storeError || !store) return { store: null, products: [] };

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_deleted", false)
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  return { store, products: products || [] };
}
