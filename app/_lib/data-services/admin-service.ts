// Safe for client components - only uses browser Supabase client
import { supabase } from "../supabase/client";

// ─── USERS ────────────────────────────────────────────────────

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminUpdateUser(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: updates.full_name,
      phone: updates.phone,
      email: updates.email,
      role: updates.role,
      status: updates.status === "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminCreateUser(userData: {
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        full_name: userData.full_name,
        role: userData.role || "buyer",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminDeleteUser(userId: string) {
  if (!userId) throw new Error("معرّف المستخدم مطلوب");
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_deleted: true })
    .eq("id", userId)
    .select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("لم يتم العثور على المستخدم");
  return data;
}

export async function getAvailableOwners() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("role", ["buyer", "seller"])
    .eq("is_deleted", false);
  if (error) throw new Error(error.message);
  return data || [];
}

// ─── STORES ───────────────────────────────────────────────────

export async function adminToggleStoreActive(
  storeId: string,
  isActive: boolean,
) {
  const { data, error } = await supabase
    .from("stores")
    .update({ is_active: isActive })
    .eq("id", storeId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function adminDeleteStore(storeId: string) {
  const { data, error } = await supabase
    .from("stores")
    .update({ is_deleted: true })
    .eq("id", storeId)
    .select();
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("لم يتم العثور على المتجر");
}

export async function updateStore(storeId: string, updates: any) {
  const { data, error } = await supabase
    .from("stores")
    .update({
      owner_id: updates.owner_id,
      name: updates.name,
      slug: updates.slug,
      phone: updates.phone,
      logo_url: updates.logo_url,
      monthly_hosting_fee: parseFloat(updates.monthly_hosting_fee),
      commission_fee_per_sale: parseFloat(updates.commission_fee_per_sale),
      address: updates.address,
      description: updates.description,
      is_active: updates.is_active,
    })
    .eq("id", storeId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function uploadStoreLogo(file: File) {
  const { supabase: client } = await import("../supabase/client");
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await client.storage
    .from("stores")
    .upload(fileName, file);
  if (uploadError) throw new Error(uploadError.message);

  const { data } = client.storage.from("stores").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function adminUpsertStore(
  storeId: string | undefined,
  storeData: any,
) {
  if (storeId) {
    const { data, error } = await supabase
      .from("stores")
      .update(storeData)
      .eq("id", storeId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("stores")
      .insert([storeData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export async function getPendingRequests() {
  const { data, error } = await supabase
    .from("stores")
    .select(`*, profiles:seller_id (id, full_name, email, phone)`)
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
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "seller" })
      .eq("id", ownerId);
    const { error: storeError } = await supabase
      .from("stores")
      .update({ is_active: true, status: "approved" })
      .eq("id", storeId);
    if (profileError || storeError) throw new Error("فشل التحديث");
  } else {
    const { error } = await supabase
      .from("stores")
      .update({ is_deleted: true, status: "rejected" })
      .eq("id", storeId);
    if (error) throw new Error("فشل الحذف");
  }
}

// ─── PRODUCTS ─────────────────────────────────────────────────

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`*, stores (id, name), categories (id, name)`)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function adminUpsertProduct(
  productId: string | undefined,
  productData: any,
) {
  if (productId) {
    const { data, error } = await supabase
      .from("products")
      .update(productData)
      .eq("id", productId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}

export async function adminDeleteProduct(productId: string) {
  const { error } = await supabase
    .from("products")
    .update({ is_deleted: true })
    .eq("id", productId);
  if (error) throw new Error(error.message);
}

// ─── SELECT HELPERS ───────────────────────────────────────────

export async function getStoresForSelect() {
  const { data, error } = await supabase
    .from("stores")
    .select("id, name")
    .eq("is_active", true)
    .order("name");
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCategoriesForSelect() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  if (error) throw new Error(error.message);
  return data || [];
}
// 5️⃣ Admin Stores
export async function getAdminStores() {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}
