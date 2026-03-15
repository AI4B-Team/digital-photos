import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_IDS: Record<string, string> = {
  digital: "price_1TB232GOIj3eWyeW6Y1lBp1T",
  print:   "price_1TB24sGOIj3eWyeWGmDUKN07",
  bundle:  "price_1TB24sGOIj3eWyeWGmDUKN07",
  canvas:  "price_1TB257GOIj3eWyeWKYJ7HFpn",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product, email, sessionId } = await req.json();

    const priceId = PRICE_IDS[product];
    if (!priceId) throw new Error(`Unknown product: ${product}`);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://id-preview--7e013cac-1946-4adb-80ef-76aea633d9d1.lovable.app";

    const sessionParams: any = {
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/delivery?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: { app_session_id: sessionId || "" },
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

    // Store stripe_session_id in our DB session
    if (sessionId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase
        .from("sessions")
        .update({ stripe_session_id: checkoutSession.id, order_product: product })
        .eq("id", sessionId);
    }

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
