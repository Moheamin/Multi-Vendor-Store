import { supabase } from "../supabase/client";

export async function getStores(
  sortBy: string = "all",
  currentUserId?: string,
) {
  let query = supabase.from("stores").select("*").eq("is_active", true);
  getTopStores;
  if (sortBy === "newest")
    query = query.order("created_at", { ascending: false });
  else if (sortBy === "oldest")
    query = query.order("created_at", { ascending: true });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  if (currentUserId && data) {
    return [...data].sort((a, b) => {
      if (a.owner_id === currentUserId) return -1;
      if (b.owner_id === currentUserId) return 1;
      return 0;
    });
  }
  return data;
}

export async function updateStoreData(storeId: string, updates: any) {
  if (!storeId) throw new Error("Store ID is missing");

  const { data, error } = await supabase
    .from("stores")
    .update(updates)
    .eq("id", storeId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Store not found in database");
  return data;
}

export async function getTotalCounts() {
  const [stores, products, sellers] = await Promise.all([
    supabase
      .from("stores")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "seller")
      .eq("is_deleted", false),
  ]);
  return {
    stores: stores.count || 0,
    products: products.count || 0,
    sellers: sellers.count || 0,
  };
}

export async function getTopStores() {
  const { data } = await supabase
    .from("view_store_analytics")
    .select("*")
    .order("total_revenue", { ascending: false })
    .limit(5);
  return data || [];
}
