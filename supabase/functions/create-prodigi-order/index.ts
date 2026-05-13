import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map frame colour ids to Prodigi attribute values
const FRAME_COLOR_ATTR: Record<string, string> = {
  "black":          "black",
  "white":          "white",
  "natural":        "natural",
  "antique-silver": "antiqueSilver",
  "antique-gold":   "antiqueGold",
  "dark-grey":      "darkGrey",
  "light-grey":     "lightGrey",
  "brown":          "brown",
};

const CANVAS_EDGE_ATTR: Record<string, string> = {
  "mirror":       "mirror",
  "museum-black": "black",
  "museum-white": "white",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const {
      sessionId,
      portraitUrl,
      sku,
      productType,
      frameColor,
      canvasEdge,
      mountColor = "snow-white",
      shippingName,
      shippingEmail,
      shippingLine1,
      shippingCity,
      shippingZip,
      shippingCountry = "US",
    } = await req.json();

    if (!portraitUrl || !sku || !shippingLine1) {
      throw new Error("portraitUrl, sku, and shipping address are required");
    }

    const isSandbox = Deno.env.get("PRODIGI_SANDBOX") !== "false";
    const baseUrl = isSandbox
      ? "https://api.sandbox.prodigi.com/v4.0"
      : "https://api.prodigi.com/v4.0";

    const apiKey = Deno.env.get("PRODIGI_API_KEY");
    if (!apiKey) throw new Error("PRODIGI_API_KEY secret not set");

    // Build per-product attributes
    const attributes: Record<string, string> = {};
    if ((productType === "classic-frame" || productType === "box-frame") && frameColor) {
      attributes.color = FRAME_COLOR_ATTR[frameColor] || frameColor;
    }
    // Mount/mat colour for CFPM and BOXM
    if ((productType === "classic-frame" || productType === "box-frame") && mountColor) {
      const mountAttr: Record<string,string> = {
        "snow-white": "snowWhite", "hayseed": "hayseed", "black": "black",
      };
      attributes.mount = mountAttr[mountColor] || "snowWhite";
    }
    if (productType === "canvas" && canvasEdge) {
      attributes.wrap = CANVAS_EDGE_ATTR[canvasEdge] || canvasEdge;
    }

    const orderPayload = {
      merchantReference: sessionId || `dp-${Date.now()}`,
      shippingMethod: "Budget",
      recipient: {
        name: shippingName || "REAL ART Customer",
        email: shippingEmail || "",
        address: {
          line1: shippingLine1,
          postalOrZipCode: shippingZip,
          countryCode: shippingCountry,
          townOrCity: shippingCity,
        },
      },
      items: [
        {
          merchantReference: "portrait-print-1",
          sku,
          copies: 1,
          sizing: "fillPrintArea",
          ...(Object.keys(attributes).length ? { attributes } : {}),
          assets: [{ printArea: "default", url: portraitUrl }],
        },
      ],
    };

    const prodigiRes = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(orderPayload),
    });

    const prodigiData = await prodigiRes.json();
    if (!prodigiRes.ok) {
      console.error("Prodigi error:", JSON.stringify(prodigiData));
      throw new Error(prodigiData?.detail || "Prodigi order creation failed");
    }

    const prodigiOrderId = prodigiData?.order?.id;

    if (sessionId) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase
        .from("sessions")
        .update({
          prodigi_order_id: prodigiOrderId,
          prodigi_status: "submitted",
          shipping_name: shippingName,
          shipping_email: shippingEmail,
          shipping_line1: shippingLine1,
          shipping_city: shippingCity,
          shipping_zip: shippingZip,
          shipping_country: shippingCountry,
          print_sku: sku,
          print_frame: frameColor || canvasEdge || productType,
        })
        .eq("id", sessionId);
    }

    return new Response(
      JSON.stringify({ success: true, prodigiOrderId, sku, sandbox: isSandbox }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-prodigi-order error:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
