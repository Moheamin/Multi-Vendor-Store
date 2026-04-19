"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "../data-services/dashboard-service";

// Define a type based on your Supabase Enum for safety
export type OrderStatus =
  | "verified_sold"
  | "pending_verification"
  | "verified_not_sold";

export async function updateOrderVerificationAction(
  id: string,
  newStatus: OrderStatus, // Pass the explicit status from the UI
) {
  try {
    console.log(`Updating order ${id} to status: ${newStatus}`);

    // Call your service to update the database
    // Because of the trigger we set up earlier,
    // the 'revenue' table status column will update automatically!
    await updateOrderStatus(id, newStatus);

    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Database Error:", error.message);
    return { success: false, error: error.message };
  }
}
