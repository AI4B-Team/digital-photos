import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const orderId = String(body?.orderId || "").trim();

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "A valid email is required." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    if (orderId.length > 120) {
      return new Response(JSON.stringify({ error: "Invalid order number." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const safeEmail = email.replace(/[,()"']/g, "");

    let q = supabase
      .from("sessions")
      .select(
        "id, created_at, status, order_id, prodigi_order_id, prodigi_status, shipped_at, tracking_url, print_size, print_frame, order_product",
      )
      .or(`customer_email.eq.${safeEmail},user_email.eq.${safeEmail},shipping_email.eq.${safeEmail}`)
      .order("created_at", { ascending: false })
      .limit(1);

    // Only real orders are trackable — preview-only sessions have no order_id.
    if (!orderId) {
      q = q.not("order_id", "is", null);
    }

    if (orderId) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      const safe = orderId.replace(/[,()"']/g, "");
      q = isUuid
        ? q.eq("id", orderId)
        : q.or(`order_id.eq.${safe},stripe_session_id.eq.${safe},prodigi_order_id.eq.${safe}`);
    }

    const { data, error } = await q;
    if (error) throw error;

    return new Response(JSON.stringify({ order: data?.[0] ?? null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
