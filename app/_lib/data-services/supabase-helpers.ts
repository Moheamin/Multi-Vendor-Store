// ⚠️ SERVER ONLY - Do NOT import this in any "use client" file or any file
// imported by a client component. Add 'server-only' to enforce this.
import "server-only";
import { supabaseServer } from "../supabase/server";

export { supabaseServer as getServerSupabase };
