// products-service.ts
// Safe for client components — only uses the browser Supabase client.

import { supabase } from "../supabase/client";

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────

export async function getProducts(storeId?: string, categoryId?: number) {
  let query = supabase
    .from("products")
    .select("*, stores(name, logo_url)")
    .eq("is_deleted", false); // <--- ONLY fetch active products

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
    .eq("is_deleted", false) // <--- ONLY fetch active products
    .single();
  if (error || !data) throw new Error("Product not found");
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────

export async function createProduct(productData: {
  name: string;
  price: number;
  description: string;
  store_id: string;
  image_url: string[];
  category_id?: number | null;
  stock_quantity?: number;
}) {
  // Ensure we always have an array for 'image_url'
  const image_url = productData.image_url || [];

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        ...productData,
        image_url,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────

export async function updateProduct(
  productId: string,
  payload: {
    name?: string;
    price?: number;
    description?: string;
    stock_quantity?: number;
    category_id?: number | null;
    image_url?: string[];
  },
) {
  const updateData: any = { ...payload };

  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select(`*, categories ( name ), stores ( name )`)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hard-delete a product and its specific storage folder.
 */
/**
 * Soft-delete a product by setting is_deleted to TRUE.
 */
export async function deleteProduct(productId: string) {
  // 1. Perform a soft delete by updating the flag
  const { data, error } = await supabase
    .from("products")
    .update({ is_deleted: true }) // Update the flag instead of deleting the row
    .eq("id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // NOTE: In a soft-delete flow, you usually KEEP the images
  // so the user can still see what they bought in their order history.
  // If you want to keep images, remove the storage cleanup logic below.

  return data;
}
// ─────────────────────────────────────────────────────────────────────────────
// STORAGE — UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload one or more image files and return their public URLs.
 *
 * Path convention:
 *   - With productId  → stores/{storeId}/{productId}/{timestamp}_{rand}.{ext}
 *   - Without         → stores/{storeId}/{timestamp}_{rand}.{ext}
 */
export async function uploadProductImages(
  storeId: string,
  files: File[],
  productId?: string,
): Promise<string[]> {
  const bucket = "products";
  const urls: string[] = [];

  for (const file of files) {
    const folder = productId
      ? `stores/${storeId}/${productId}`
      : `stores/${storeId}`;

    const ext = file.name.split(".").pop() ?? "webp";
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const path = `${folder}/${unique}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    // STORE THIS: Clean URL for the database
    urls.push(data.publicUrl);
  }

  return urls;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE — DELETE (single image)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Remove a single image from the `products` bucket by its public URL.
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  const bucket = "products";

  try {
    // Strip cache-bust query string
    const cleanUrl = imageUrl.split("?")[0];

    // Extract the storage path after /object/public/{bucket}/
    const marker = `/object/public/${bucket}/`;
    const markerIdx = cleanUrl.indexOf(marker);
    if (markerIdx === -1) {
      console.warn("deleteProductImage: unrecognised URL format", imageUrl);
      return;
    }
    const filePath = cleanUrl.slice(markerIdx + marker.length);

    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw new Error(error.message);
  } catch (err) {
    // Re-throw so callers can handle — but don't crash the whole operation
    console.error("deleteProductImage error:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKWARD-COMPAT SHIM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use `uploadProductImages` instead.
 * Kept so existing callers (admin dashboard) don't break until updated.
 */
export async function uploadProductImage(
  storeId: string,
  file: File,
  productId?: string,
): Promise<string | null> {
  const [url] = await uploadProductImages(storeId, [file], productId);
  return url ?? null;
}
