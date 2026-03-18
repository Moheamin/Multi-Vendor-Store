import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const VERIFICATION_DELAY_MS = 24 * 60 * 60 * 1000;

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`id, status, created_at, profiles!inner (email, full_name)`)
    .eq("status", "pending_verification")
    .or("verification_email_sent.is.null,verification_email_sent.eq.false")
    .lt(
      "created_at",
      new Date(Date.now() - VERIFICATION_DELAY_MS).toISOString(),
    );

  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  if (!orders || orders.length === 0)
    return new Response(JSON.stringify({ message: "No orders" }), {
      status: 200,
    });

  const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
  const APP_URL =
    Deno.env.get("NEXT_PUBLIC_APP_URL") || "https://www.sinaal.ink";

  const emailPromises = orders.map(async (order: any) => {
    const email = order.profiles?.email;
    if (!email) return null;

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Sinaa Link", email: "orders@sinaal.ink" },
          to: [{ email: email }],
          subject: "Confirm your delivery | تأكيد استلام الطلب",
          htmlContent: `
            <div style="direction: rtl; font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background-color: #0a0a0a; border-radius: 24px; border: 1px solid #1f1f1f; text-align: center;">
  
  <div style="margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
    <div style="display: inline-block; letter-spacing: 1px;">
      <span style="color: #ffffff; font-size: 14px; font-weight: 300; text-transform: uppercase; letter-spacing: 2px;">Sina Link</span>
      <span style="color: #00bcd4; margin: 0 12px; font-size: 18px; font-weight: 200;">|</span>
      <span style="color: #ffffff; font-size: 18px; font-weight: 800;">لنك الصناعة</span>
    </div>
  </div>

  <h3 style="color: #ffffff; margin-bottom: 24px; font-size: 18px; font-weight: 600;">تأكيد استلام الطلب</h3>

  <div style="margin-bottom: 16px;">
    <a href="${APP_URL}/api/confirm-order?id=${order.id}&type=confirm" 
       style="display: block; background: #00bcd4; color: #ffffff; padding: 18px; text-decoration: none; border-radius: 16px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 188, 212, 0.2);">
      نعم، تم الاستلام بنجاح ✅
    </a>
  </div>

  <a href="${APP_URL}/api/confirm-order?id=${order.id}&type=dispute" 
     style="display: block; background-color: transparent; color: #94a3b8; padding: 16px; text-decoration: none; border-radius: 16px; font-weight: 500; font-size: 14px; border: 1px solid #1f1f1f;">
    لم أستلم الطلب بعد ❌
  </a>
</div>
`,
        }),
      });
      return res.ok ? order.id : null;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(emailPromises);
  const successfulIds = results.filter((id) => id !== null);
  if (successfulIds.length > 0) {
    await supabase
      .from("orders")
      .update({ verification_email_sent: true })
      .in("id", successfulIds);
  }

  return new Response(
    JSON.stringify({ message: `Sent ${successfulIds.length} emails` }),
    { status: 200 },
  );
});
