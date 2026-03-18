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

export async function updateProduct(
  productId: string,
  payload: {
    name?: string;
    price?: number;
    description?: string;
    stock_quantity?: number;
    category_id?: number | null;
    image_url?: string;
  },
) {
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", productId)
    .select(
      `
      *,
      categories ( name ),
      stores ( name )
    `,
    )
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Delete a product by ID.
 * Throws if the operation fails.
 */
export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw new Error(error.message);
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
  category_id?: number | null;
  stock_quantity?: number;
}) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function uploadProductImage(userId: string, file: File) {
  const bucket = "products";

  try {
    // 1. List files in the user's product folder
    const { data: existingFiles, error: listError } = await supabase.storage
      .from(bucket)
      .list(userId);

    // 2. Clear the folder if files exist
    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles
        .filter((x) => x.name !== ".emptyFolderPlaceholder")
        .map((x) => `${userId}/${x.name}`);

      if (filesToRemove.length > 0) {
        const { error: removeError } = await supabase.storage
          .from(bucket)
          .remove(filesToRemove);
        if (removeError) {
          console.error(
            "Supabase Remove Error (Check RLS Policies!):",
            removeError,
          );
        }
      }
    }

    // 3. Prepare path: products/USER_ID/TIMESTAMP.ext
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 4. Upload
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 5. Return Public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return `${data.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error("Product upload error:", error);
    throw error;
  }
}
export async function getInventoryWarnings() {
  const { data } = await supabase
    .from("products")
    .select("*, stores(name)")
    .lt("stock_quantity", 5)
    .limit(5);
  return data || [];
}
