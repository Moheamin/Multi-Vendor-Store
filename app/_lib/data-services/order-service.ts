// Safe for client components - only uses browser Supabase client
import { supabase } from "../supabase/client";

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
  if (error) throw new Error("Lead could not be recorded");
  return data;
}

export async function getStoreOrders(storeId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name), profiles(full_name, phone)")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Orders could not be loaded");
  return data;
}

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
