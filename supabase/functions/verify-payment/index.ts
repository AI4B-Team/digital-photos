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

    const lineItem = checkoutSession.line_items?.data?.[0];
    const priceId = lineItem?.price?.id;

    // Update the session record in our DB
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Determine product — read from session record first (most reliable),
    // then fall back to Stripe metadata, then to hardcoded price IDs (legacy).
    const { data: earlySession } = await supabase
      .from("sessions")
      .select("print_product_type, id")
      .eq("stripe_session_id", stripe_session_id)
      .maybeSingle();

    let orderProduct: string =
      earlySession?.print_product_type ||
      (checkoutSession.metadata as any)?.productType ||
      "digital";

    if (orderProduct === "digital") {
      if (priceId === "price_1TB24sGOIj3eWyeWGmDUKN07") orderProduct = "print";
      if (priceId === "price_1TB257GOIj3eWyeWKYJ7HFpn") orderProduct = "canvas";
    }

    // Find the session by stripe_session_id or update matching records
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id")
      .eq("stripe_session_id", stripe_session_id)
      .limit(1);

    let sessionId = sessions?.[0]?.id;

    let sessionRecord: any = null;
    if (sessionId) {
      await supabase
        .from("sessions")
        .update({
          status: "purchased",
          order_product: orderProduct,
          order_id: checkoutSession.id,
          customer_email: checkoutSession.customer_details?.email || "",
        })
        .eq("id", sessionId);

      const { data: rec } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      sessionRecord = rec;
    }

    // Fetch portraits for this session
    let portraits: any[] = [];
    if (sessionId) {
      const { data: portraitData } = await supabase
        .from("portraits")
        .select("*")
        .eq("session_id", sessionId);
      portraits = portraitData || [];
    }

    // ── Trigger Prodigi fulfillment for physical orders ──────
    let prodigiOrderId: string | null = sessionRecord?.prodigi_order_id || null;
    const NON_PHYSICAL = ["digital", "vip"];
    const isPhysical = !NON_PHYSICAL.includes(orderProduct);

    if (isPhysical && sessionId && !prodigiOrderId) {
      try {
        const portraitUrl =
          portraits?.[0]?.url_hd ||
          portraits?.[0]?.url ||
          checkoutSession.metadata?.portraitUrl ||
          null;

        const shipping: any = (checkoutSession as any).shipping_details?.address
          || (checkoutSession as any).customer_details?.address;
        const shippingName =
          (checkoutSession as any).shipping_details?.name ||
          checkoutSession.customer_details?.name || "";
        const shippingEmail = checkoutSession.customer_details?.email || "";

        if (portraitUrl && shipping?.line1) {
          const { data: prodigiData, error: prodigiErr } = await supabase.functions.invoke(
            "create-prodigi-order",
            {
              body: {
                sessionId,
                portraitUrl,
                sku: sessionRecord?.print_sku || checkoutSession.metadata?.printSku || "",
                productType: sessionRecord?.order_product || orderProduct,
                frameColor: sessionRecord?.print_frame || checkoutSession.metadata?.printFrame || "",
                canvasEdge: sessionRecord?.print_canvas_edge || "mirror",
                mountColor: checkoutSession.metadata?.printMount || "snow-white",
                glazeType: checkoutSession.metadata?.printGlaze || "perspex",
                shippingName,
                shippingEmail,
                shippingLine1: shipping.line1,
                shippingCity: shipping.city || "",
                shippingZip: shipping.postal_code || "",
                shippingCountry: shipping.country || "US",
                vipPurchased: sessionRecord?.vip_purchased || false,
              },
            }
          );
          if (prodigiErr) {
            console.error("Prodigi invoke error:", prodigiErr);
          } else {
            console.log("Prodigi order result:", prodigiData);
            prodigiOrderId = prodigiData?.prodigiOrderId || null;
          }
        } else {
          console.warn("Skipping Prodigi: missing portraitUrl or shipping address");
        }
      } catch (prodigiErr) {
        console.error("Prodigi trigger failed (non-fatal):", prodigiErr);
      }
    }

    return new Response(
      JSON.stringify({
        verified: true,
        orderProduct,
        sessionId,
        portraits,
        prodigiOrderId,
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
