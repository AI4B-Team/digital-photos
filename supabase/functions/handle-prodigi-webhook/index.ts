// Prodigi webhook handler: logs every event + sends "on its way" email on dispatch.
// Public endpoint (no JWT verification) — register URL in Prodigi dashboard.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const payload = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const prodigiOrderId = payload?.order?.id || payload?.id;
    const stage = payload?.order?.status?.stage || payload?.status?.stage || "";
    const shipments = payload?.order?.shipments || [];
    const trackingUrl = shipments?.[0]?.tracking?.url || null;

    // Log every webhook for audit
    await supabase.from("webhook_events").insert({
      source: "prodigi",
      event_type: stage,
      prodigi_order_id: prodigiOrderId,
      payload,
    });

    // Only act on dispatched / complete
    if (stage !== "Dispatched" && stage !== "Complete") {
      return new Response(
        JSON.stringify({ received: true, action: "ignored" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: session } = await supabase
      .from("sessions")
      .select("id, customer_email, print_sku, order_product, vip_purchased")
      .eq("prodigi_order_id", prodigiOrderId)
      .maybeSingle();

    if (!session?.customer_email) {
      console.warn("No session/email for Prodigi order:", prodigiOrderId);
      return new Response(
        JSON.stringify({ received: true, action: "no_email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await supabase.from("sessions").update({
      prodigi_status: stage,
      shipped_at: new Date().toISOString(),
      tracking_url: trackingUrl,
    }).eq("id", session.id);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const productLabel =
        session.order_product === "mug" ? "Portrait Mug" :
        session.order_product === "case" ? "Phone Case" :
        session.order_product === "canvas" ? "Canvas Print" :
        "Portrait";

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "REAL ART <hello@realart.com>",
          to: [session.customer_email],
          subject: `Your ${productLabel} is on its way!`,
          html: buildShipEmail({ productLabel, trackingUrl }),
        }),
      });

      await supabase.from("webhook_events")
        .update({ email_sent: true, session_id: session.id })
        .eq("prodigi_order_id", prodigiOrderId)
        .eq("event_type", stage);
    }

    return new Response(
      JSON.stringify({ received: true, action: "email_sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildShipEmail({ productLabel, trackingUrl }: { productLabel: string; trackingUrl: string | null }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F9F7F4;font-family:'Poppins',Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="background:#0A0A0A;color:#fff;padding:18px 24px;border-radius:12px;text-align:center;margin-bottom:24px;font-weight:800;letter-spacing:.04em">
      REAL <span style="opacity:.85">ART</span>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px 32px;margin-bottom:20px">
      <h1 style="font-size:22px;font-weight:800;color:#0A0A0A;margin:0 0 10px">
        Your ${productLabel} is on its way!
      </h1>
      <p style="font-size:14px;color:#3A3A3A;line-height:1.55;margin:0 0 18px">
        Great news — your order has been dispatched and is heading to your door.
        Delivery typically takes 5–8 business days.
      </p>
      ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;background:#E61919;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px;font-size:14px">Track My Order →</a>` : `<p style="font-size:13px;color:#8C8C8C">Tracking information will be updated when available.</p>`}
    </div>
    <div style="background:#fff;border-radius:16px;padding:24px 32px;margin-bottom:20px">
      <h2 style="font-size:17px;font-weight:700;color:#0A0A0A;margin:0 0 8px">
        Love your portrait? Complete your collection.
      </h2>
      <p style="font-size:13px;color:#5A5A5A;line-height:1.55;margin:0 0 12px">
        Your portrait is made to last a hundred years. Here are a few ways to celebrate it even more:
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#0A0A0A;border-bottom:1px solid #F0EDE8">
            <strong>Portrait Mug</strong> — your art on a ceramic mug
          </td>
          <td style="padding:8px 0;text-align:right;border-bottom:1px solid #F0EDE8">
            <a href="https://realart.com" style="font-size:12px;color:#E61919;font-weight:600;text-decoration:none">Add $37 →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 12px 8px 0;font-size:13px;color:#0A0A0A">
            <strong>Phone Case</strong> — carry your portrait everywhere
          </td>
          <td style="padding:8px 0;text-align:right">
            <a href="https://realart.com" style="font-size:12px;color:#E61919;font-weight:600;text-decoration:none">Add $47 →</a>
          </td>
        </tr>
      </table>
    </div>
    <div style="background:#fff;border-radius:16px;padding:24px 32px;text-align:center;margin-bottom:24px">
      <p style="font-size:15px;color:#0A0A0A;font-weight:600;margin:0 0 6px">Did we exceed your expectations?</p>
      <p style="font-size:13px;color:#8C8C8C;margin:0 0 14px">Your review means the world to us and helps other portrait lovers find REAL ART.</p>
      <a href="https://realart.com/review" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;font-weight:700;padding:10px 20px;border-radius:10px;font-size:13px">Leave a Review ★</a>
    </div>
    <p style="text-align:center;font-size:11.5px;color:#BFBFBF;line-height:1.6">
      REAL ART™ · Real Advisors, Inc.
    </p>
  </div>
</body></html>`;
}
