// Safe for client components - only uses browser Supabase client
import { supabase } from "../supabase/client";

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getOwnerPhone(ownerId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", ownerId)
    .single();
  return data?.phone || "";
}

export async function uploadAvatar(
  userId: string,
  file: File,
  oldImageUrl?: string,
) {
  if (oldImageUrl && oldImageUrl.includes("galary/")) {
    const fileName = oldImageUrl.split("galary/").pop();
    if (fileName) await supabase.storage.from("galary").remove([fileName]);
  }

  const fileExt = file.name.split(".").pop();
  const newFileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("galary")
    .upload(newFileName, file);
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("galary").getPublicUrl(newFileName);
  return data.publicUrl;
}
