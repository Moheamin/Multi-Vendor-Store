// Safe for client components - only uses browser Supabase client
import { supabase } from "../supabase/client";

export async function getProducts(storeId?: string, categoryId?: number) {
  let query = supabase
    .from("products")
    .select("*, stores(name, logo_url)")
    .eq("is_deleted", false);

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
    .eq("is_deleted", false)
    .single();
  if (error || !data) {
    throw new Error("Product not found");
  }
  return data;
}

export async function createProduct(productData: {
  name: string;
  price: number;
  description: string;
  store_id: string;
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function uploadProductImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`.replace(/\s/g, "-");
  const path = `product-images/${fileName}`;

  const { error } = await supabase.storage.from("products").upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}

export async function getInventoryWarnings() {
  const { data } = await supabase
    .from("products")
    .select("*, stores(name)")
    .lt("stock_quantity", 5)
    .limit(5);
  return data || [];
}
