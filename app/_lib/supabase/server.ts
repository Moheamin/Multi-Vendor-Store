import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const supabaseServer = function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Key that bypasses RLS
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        persistSession: false, // Don't try to save a session
        autoRefreshToken: false,
      },
    },
  );
};
