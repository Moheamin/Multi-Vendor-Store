import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  // Use service role key for server-side admin actions
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 1. Delete from profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // 2. Delete from auth.users
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.message || "Failed to delete from auth" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
