import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { code, subtotal } = await req.json();
    if (!code) throw new Error("code required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("promo_codes")
      .select(
        "code, discount_pct, label, max_uses, used_count, expires_at, is_active",
      )
      .eq("code", String(code).trim().toUpperCase())
      .maybeSingle();

    if (error || !data) {
      return new Response(
        JSON.stringify({ valid: false, error: "Invalid code" }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }
    if (!data.is_active) {
      return new Response(
        JSON.stringify({ valid: false, error: "Code inactive" }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, error: "Code expired" }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }
    if (data.max_uses !== null && data.used_count >= data.max_uses) {
      return new Response(
        JSON.stringify({ valid: false, error: "Code limit reached" }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const discountAmount =
      Math.round((Number(subtotal) || 0) * Number(data.discount_pct) * 100) /
      100;
    return new Response(
      JSON.stringify({
        valid: true,
        code: data.code,
        label: data.label,
        discountAmount,
        discountPct: Number(data.discount_pct),
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ valid: false, error: (err as Error).message }),
      {
        headers: { ...cors, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
