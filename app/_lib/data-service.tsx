import { notFound } from "next/navigation";
import { supabase } from "./supabase";

export async function uploadProductImage(file: File) {
  const fileName = `${Math.random()}-${file.name}`.replace(/\s/g, "-");
  const path = `product-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from("products") // Make sure you have a bucket named 'products'
    .upload(path, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("products").getPublicUrl(path);

  return publicUrl;
}

export async function updateStoreData(storeId: string, updates: any) {
  if (!storeId) throw new Error("Store ID is missing");

  const { data, error } = await supabase
    .from("stores")
    .update(updates)
    .eq("id", storeId)
    .select()
    .maybeSingle(); // <--- Change .single() to .maybeSingle()

  if (error) {
    console.error("Database Error:", error.message);
    throw error;
  }

  if (!data) {
    console.error("No store found with ID:", storeId);
    throw new Error("Store not found in database");
  }

  return data;
}
// Fetch the owner's phone specifically from their profile
export async function getOwnerPhone(ownerId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", ownerId)
    .single();
  return data?.phone || "";
}

export async function updateStore(storeId: string, updates: any) {
  const { data, error } = await supabase
    .from("stores")
    .update(updates)
    .eq("id", storeId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(productData: {
  name: string;
  price: number; // Ensure this is a number
  description: string;
  store_id: string; // This is usually why it fails
}) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }
  return data;
}

export async function getPendingRequests() {
  const { data, error } = await supabase
    .from("stores")
    .select(
      `
      *,
      profiles:seller_id (id, full_name, email, phone)
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function handleRequestDecision(
  storeId: string,
  ownerId: string,
  decision: "approve" | "reject",
) {
  if (decision === "approve") {
    // Update Profile to seller and Store to active
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "seller" })
      .eq("id", ownerId);

    const { error: storeError } = await supabase
      .from("stores")
      .update({ is_active: true })
      .eq("id", storeId);

    if (profileError || storeError) throw new Error("فشل التحديث");
  } else {
    // Remove the pending store record
    const { error } = await supabase.from("stores").delete().eq("id", storeId);

    if (error) throw new Error("فشل الحذف");
  }
}

/**
 * DASHBOARD: Updated Stats
 */

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(), // Change this line
    })
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function uploadAvatar(
  userId: string,
  file: File,
  oldImageUrl?: string,
) {
  try {
    // 1. حذف الملف القديم إذا وُجد
    if (oldImageUrl && oldImageUrl.includes("galary/")) {
      const fileName = oldImageUrl.split("galary/").pop();
      if (fileName) {
        await supabase.storage.from("galary").remove([fileName]);
      }
    }

    // 2. رفع الملف الجديد باسم فريد (بصمة زمنية) لمنع التخزين المؤقت
    const fileExt = file.name.split(".").pop();
    const newFileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("galary")
      .upload(newFileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("galary").getPublicUrl(newFileName);
    return data.publicUrl;
  } catch (error) {
    throw error;
  }
}
export async function signUp({
  email,
  password,
  fullName,
  role,
  storeName,
  storeDescription,
}: any) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (authError) throw new Error(authError.message);

  if (authData.user) {
    // 1. Create Profile - Matches columns in image_adbb5f.png
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        full_name: fullName,
        role: role, // 'guest' or 'buyer'
      },
    ]);

    if (profileError) throw new Error(profileError.message);

    // 2. Create Store Request - Uses 'owner_id' and 'is_active' from image_acc39a.png
    if (role === "guest" && storeName) {
      const { error: storeError } = await supabase.from("stores").insert([
        {
          owner_id: authData.user.id, // Updated from seller_id
          name: storeName,
          slug: storeName.toLowerCase().replace(/ /g, "-"), // Basic slug generation
          description: storeDescription,
          is_active: false, // Set to false for pending requests
          is_official: false,
        },
      ]);

      if (storeError) throw new Error(storeError.message);
    }
  }

  return authData;
}

/**
 * SIGN IN: Authenticates the user
 */
export async function signIn({ email, password }: any) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * SIGN OUT
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * GET SESSION: Helper to check if someone is logged in
 */
export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// app/_lib/data-service.ts
export async function getStorePageData(storeId: string) {
  if (!storeId) return { store: null, products: [] };

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      storeId,
    );

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("*")
    .eq(isUuid ? "id" : "slug", storeId)
    .maybeSingle(); // <--- This is the key fix for the "coercion" error

  if (storeError || !store) return { store: null, products: [] };

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  return { store, products: products || [] };
}

export async function getGrowthMetrics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Fetch counts for two periods
  const [currentUsers, previousUsers, currentRev, previousRev] =
    await Promise.all([
      // Users current 30 days
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("created_at", thirtyDaysAgo.toISOString()),
      // Users previous 30 days
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gt("created_at", sixtyDaysAgo.toISOString())
        .lt("created_at", thirtyDaysAgo.toISOString()),
      // Revenue current 30 days
      supabase
        .from("orders")
        .select("product_price_at_click")
        .eq("status", "verified_sold")
        .gt("created_at", thirtyDaysAgo.toISOString()),
      // Revenue previous 30 days
      supabase
        .from("orders")
        .select("product_price_at_click")
        .eq("status", "verified_sold")
        .gt("created_at", sixtyDaysAgo.toISOString())
        .lt("created_at", thirtyDaysAgo.toISOString()),
    ]);

  const calcGrowth = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return parseFloat((((curr - prev) / prev) * 100).toFixed(1));
  };

  const currentRevTotal =
    currentRev.data?.reduce(
      (acc, row) => acc + row.product_price_at_click,
      0,
    ) || 0;
  const previousRevTotal =
    previousRev.data?.reduce(
      (acc, row) => acc + row.product_price_at_click,
      0,
    ) || 0;

  return {
    userGrowth: calcGrowth(currentUsers.count || 0, previousUsers.count || 0),
    revGrowth: calcGrowth(currentRevTotal, previousRevTotal),
  };
}

export async function getDashboardStats() {
  const [users, stores, products, revenue] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("stores")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("product_price_at_click")
      .eq("status", "verified_sold"),
  ]);

  return {
    usersCount: users.count || 0,
    storesCount: stores.count || 0,
    productsCount: products.count || 0,
    totalRevenue:
      revenue.data?.reduce(
        (acc, curr) => acc + curr.product_price_at_click,
        0,
      ) || 0,
  };
}

export async function getRecentUsers() {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export async function getTopStores() {
  const { data } = await supabase
    .from("view_store_analytics") // The view we created in SQL
    .select("*")
    .order("total_revenue", { ascending: false })
    .limit(5);
  return data || [];
}

export async function getRevenueChartData() {
  const { data } = await supabase
    .from("view_monthly_revenue") // The view we created in SQL
    .select("*");
  return data || [];
}

export async function getInventoryWarnings() {
  const { data } = await supabase
    .from("products")
    .select("*, stores(name)")
    .lt("stock_quantity", 5) // Fetch low stock items
    .limit(5);
  return data || [];
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

/////////////
// STORES

// Add to your service file
export async function getTotalCounts() {
  const [stores, products, sellers] = await Promise.all([
    supabase.from("stores").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "seller"),
  ]);

  return {
    stores: stores.count || 0,
    products: products.count || 0,
    sellers: sellers.count || 0,
  };
}
export async function getStores(
  sortBy: string = "all",
  currentUserId?: string,
) {
  let query = supabase.from("stores").select("*").eq("is_active", true);

  // Apply basic sorting
  if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Logic to put the logged-in user's store at the top
  if (currentUserId && data) {
    return [...data].sort((a, b) => {
      if (a.owner_id === currentUserId) return -1; // Move user's store to front
      if (b.owner_id === currentUserId) return 1;
      return 0; // Keep original order for others
    });
  }

  return data;
}

export async function getStoreBySlug(slug: string) {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) notFound();
  return data;
}

/////////////
// PRODUCTS

export async function getProducts(storeId?: string, categoryId?: number) {
  let query = supabase.from("products").select("*, stores(name, logo_url)");

  if (storeId) query = query.eq("store_id", storeId);
  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw new Error("Products could not be loaded");
  return data;
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, stores(*)")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  return data;
}

export async function createOrderLead(newOrder: {
  buyer_id: string;
  store_id: string;
  product_id: string;
  product_price_at_click: number;
  admin_commission_at_click: number;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert([newOrder])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Lead could not be recorded");
  }

  return data;
}

/**
 * Used by the Seller Dashboard to see potential customers
 */
export async function getStoreOrders(storeId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name), profiles(full_name, phone)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Orders could not be loaded");
  return data;
}

/**
 * CRITICAL: The Verification Step.
 * Called when the buyer clicks "YES" in the follow-up message.
 */
export async function verifyPurchase(orderId: string, isConfirmed: boolean) {
  const status = isConfirmed ? "verified_sold" : "verified_not_sold";

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      buyer_confirmed_at: isConfirmed ? new Date().toISOString() : null,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw new Error("Verification failed");
  return data;
}

/////////////
// ADMIN & ANALYTICS

export async function getAdminInvoices() {
  const { data, error } = await supabase
    .from("monthly_store_invoices")
    .select("*");

  if (error) throw new Error("Could not fetch invoices");
  return data;
}
