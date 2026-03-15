import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stripe_session_id } = await req.json();
    if (!stripe_session_id) throw new Error("stripe_session_id is required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(stripe_session_id, {
      expand: ["line_items"],
    });

    if (checkoutSession.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ verified: false, status: checkoutSession.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Determine product from line items
    const lineItem = checkoutSession.line_items?.data?.[0];
    const priceId = lineItem?.price?.id;
    
    let orderProduct = "digital";
    if (priceId === "price_1TB24sGOIj3eWyeWGmDUKN07") orderProduct = "print";
    if (priceId === "price_1TB257GOIj3eWyeWKYJ7HFpn") orderProduct = "canvas";

    // Update the session record in our DB
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find the session by stripe_session_id or update matching records
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id")
      .eq("stripe_session_id", stripe_session_id)
      .limit(1);

    let sessionId = sessions?.[0]?.id;

    if (sessionId) {
      await supabase
        .from("sessions")
        .update({
          status: "purchased",
          order_product: orderProduct,
          order_id: checkoutSession.id,
        })
        .eq("id", sessionId);
    }

    // Fetch portraits for this session
    let portraits = [];
    if (sessionId) {
      const { data: portraitData } = await supabase
        .from("portraits")
        .select("*")
        .eq("session_id", sessionId);
      portraits = portraitData || [];
    }

    return new Response(
      JSON.stringify({
        verified: true,
        orderProduct,
        sessionId,
        portraits,
        customerEmail: checkoutSession.customer_details?.email,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("verify-payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
