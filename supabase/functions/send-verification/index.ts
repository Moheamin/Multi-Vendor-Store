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
            <div dir="rtl" style="font-family: 'Segoe UI', sans-serif; padding: 40px 20px; background-color: #f4f7f9; text-align: center;">
              <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; padding: 48px; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #eef2f6;">
                <div style="margin-bottom: 32px;">
                  <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
                  <h1 style="color: #030213; font-size: 26px; font-weight: 800; margin: 0;">تأكيد حالة الطلب</h1>
                </div>
                
                <p style="color: #64748b; font-size: 16px; line-height: 1.8; margin-bottom: 32px;">
                  مرحباً <strong>${order.profiles?.full_name || "عزيزي الزبون"}</strong>،<br>
                  نود التأكد من وصول طلبك بشكل سليم لضمان حقوقك وحقوق التاجر. يرجى اختيار الحالة أدناه:
                </p>

                <div style="margin-bottom: 16px;">
                  <a href="${APP_URL}/api/confirm-order?id=${order.id}&type=confirm" 
                     style="display: block; background-color: #00bcd4; color: #ffffff; padding: 18px; text-decoration: none; border-radius: 18px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 188, 212, 0.2);">
                    نعم، تم الاستلام بنجاح ✅
                  </a>
                </div>

                <div>
                  <a href="${APP_URL}/api/confirm-order?id=${order.id}&type=dispute" 
                     style="display: block; background-color: #ffffff; color: #ef4444; padding: 16px; text-decoration: none; border-radius: 18px; font-weight: bold; font-size: 15px; border: 2px solid #fee2e2;">
                    لم أستلم الطلب بعد ❌
                  </a>
                </div>

                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                  <p style="font-size: 12px; color: #94a3b8; margin: 0;">إذا قمت بالتأكيد مسبقاً، يرجى تجاهل هذا البريد.</p>
                </div>
              </div>
            </div>`,
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
