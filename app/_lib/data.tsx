import {
  getDashboardStats,
  getRevenueChartData,
  getGrowthMetrics,
  getRecentUsers,
  getAdminStores,
  getInventoryWarnings,
  getTopStores,
} from "@/app/_lib/data-services/dashboard-service";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

/**
 * server-side function to fetch and format all dashboard data
 */
export async function getDashboardData() {
  // 1. Fetch Raw Data in Parallel for Performance

  const adminStoreData = await getAdminStores();

  const [
    stats,
    growth,
    recentUsers,
    topStores,
    revenueChart,
    lowStockProducts,
    adminStores,
  ] = await Promise.all([
    getDashboardStats(),
    getGrowthMetrics(),
    getRecentUsers(),
    getTopStores(),
    getRevenueChartData(),
    getInventoryWarnings(),
    getAdminStores(),
  ]);

  // 2. Format Stats Cards with Real Growth
  const statsData = [
    {
      label: "إجمالي المستخدمين",
      value: stats.usersCount.toLocaleString("ar-EG"),
      icon: "Users",
      change: `${growth.userGrowth >= 0 ? "+" : ""}${growth.userGrowth}%`,
      trend: (growth.userGrowth >= 0 ? "up" : "down") as "up" | "down",
      color: "#00bcd4",
    },
    {
      label: "المتاجر النشطة",
      value: stats.storesCount.toLocaleString("ar-EG"),
      icon: "Store",
      change: "+0%", // Stores grow more linearly, keep 0 or add logic
      trend: "up" as const,
      color: "#4caf50",
    },
    {
      label: "المنتجات",
      value: stats.productsCount.toLocaleString("ar-EG"),
      icon: "Package",
      change: "+0%",
      trend: "up" as const,
      color: "#ff9800",
    },
    {
      label: "الإيرادات",
      value: `${(stats.totalRevenue / 1000).toFixed(1)} ألف $`,
      icon: "DollarSign",
      change: `${growth.revGrowth >= 0 ? "+" : ""}${growth.revGrowth}%`,
      trend: (growth.revGrowth >= 0 ? "up" : "down") as "up" | "down",
      color: "#e91e63",
    },
  ];

  // 3. Format Users Table
  const usersData = recentUsers.map((user: any) => ({
    id: user.id,
    name: user.full_name || "مستخدم جديد",
    email: user.email || "بدون بريد",
    phone: user.phone || "بدون رقم هاتف",
    date: user.created_at || new Date().toISOString(),
    role:
      user.role === "seller"
        ? "تاجر"
        : user.role === "admin"
          ? "مدير"
          : user.role === "buyer"
            ? "مشتري"
            : "زائر",
    status: user.status ? "نشط" : "غير نشط",
    joined: formatDistanceToNow(new Date(user.created_at), {
      addSuffix: true,
      locale: ar,
    }),
  }));

  // 4. Format Stores Table
  const storesData = topStores.map((store: any) => ({
    id: store.id,
    name: store.store_name,
    dealer: store.dealer_name,
    products: store.product_count,
    revenue: `${(store.total_revenue / 1000).toFixed(1)} ألف $`,
    status: store.is_active ? "نشط" : "غير نشط",
  }));

  const storeTabData = adminStores.map((store: any) => ({
    id: store.id,
    name: store.name,
    ownerId: store.owner_id,
    dealerName: store.dealer_name,
    productCount: store.product_count,
    totalRevenue: store.total_revenue,
    slug: store.slug,
    phone: store.phone,
    description: store.description,
    isActive: store.is_active,
    createdAt: store.created_at,
    monthlyHostingFee: store.monthly_hosting_fee,
    commissionFeePerSale: store.commission_fee_per_sale,
    address: store.address,
    logoUrl: store.logo_url,
    isOfficial: store.is_official,
  }));

  // 5. Format Products
  const productsData = lowStockProducts.map((prod: any) => {
    let statusLabel = "متوفر";
    if (prod.stock_quantity === 0) statusLabel = "نفذ المخزون";
    else if (prod.stock_quantity < 5) statusLabel = "مخزون منخفض";

    return {
      id: prod.id,
      name: prod.name,
      store: prod.stores?.name,
      category: "عام",
      price: `${prod.price} $`,
      stock: prod.stock_quantity,
      status: statusLabel,
    };
  });

  // 6. Format Revenue Chart (SQL view now provides real growth per month)
  const revenueData = revenueChart.map((item: any) => ({
    month: item.month_name.trim(),
    revenue: item.revenue,
    orders: item.orders,
    growth: item.growth || 0, // Injected from SQL LAG()
  }));

  return {
    statsData,
    usersData,
    storesData,
    productsData,
    revenueData,
    storeTabData,
    adminStoreData,
  };
}
