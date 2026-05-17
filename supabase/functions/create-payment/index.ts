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
    const {
      product,
      lineItems,
      email,
      sessionId,
      portraitUrl = "",
      printSize = "",
      printFrame = "",
      printSku = "",
      printMount = "snow-white",
      printGlaze = "perspex",
      vipPurchased = false,
      productType = "",
    } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://id-preview--7e013cac-1946-4adb-80ef-76aea633d9d1.lovable.app";

    // Build line_items: prefer dynamic cart `lineItems`, fall back to single `product`
    let stripeLineItems: any[] = [];
    let isPhysical = false;
    let primaryProduct = product || "digital";

    if (Array.isArray(lineItems) && lineItems.length > 0) {
      stripeLineItems = lineItems.map((li: any) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.max(50, Math.round(li.unitAmount)),
          product_data: {
            name: String(li.name || "Item").slice(0, 250),
            description: li.description ? String(li.description).slice(0, 500) : undefined,
            images: li.image && typeof li.image === "string" && li.image.startsWith("http")
              ? [li.image]
              : undefined,
            // Required by Afterpay/Klarna for product categorisation
            metadata: {
              product_type: "art_print",
              category:   "home_decor",
            },
          },
        },
        quantity: Math.max(1, Math.min(99, parseInt(li.quantity) || 1)),
      }));
      // Treat as physical if any item name suggests a print/canvas/frame
      isPhysical = lineItems.some((li: any) =>
        /print|canvas|frame/i.test(String(li.name || ""))
      );
      primaryProduct = isPhysical ? "bundle" : "digital";
    } else {
      const priceId = PRICE_IDS[product];
      if (!priceId) throw new Error(`Unknown product: ${product}`);
      stripeLineItems = [{ price: priceId, quantity: 1 }];
      isPhysical = product === "print" || product === "canvas" || product === "bundle";
    }

    const sessionParams: any = {
      payment_method_types: ["card"],
      line_items: stripeLineItems,
      mode: "payment",
      success_url: `${origin}/delivery?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/customize`,
      metadata: {
        app_session_id: sessionId || "",
        portraitUrl,
        printSize,
        printFrame,
        printSku,
        printMount,
        printGlaze,
        productType: productType || primaryProduct || "",
      },
    };

    if (isPhysical) {
      sessionParams.shipping_address_collection = {
        allowed_countries: [
          "US","CA","GB","AU","DE","FR","NL","SE","NO","DK","FI",
          "BE","AT","CH","ES","IT","PT","IE","NZ","SG","JP",
        ],
      };
    }

    if (email) {
      sessionParams.customer_email = email;
    }

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

    // Store stripe_session_id + print details in our DB session
    if (sessionId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase
        .from("sessions")
        .update({
          stripe_session_id: checkoutSession.id,
          order_product: primaryProduct,
          print_product_type: productType || primaryProduct || null,
          print_size: printSize || null,
          print_frame: printFrame || null,
          print_sku: printSku || null,
          vip_purchased: vipPurchased,
        })
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
