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

// Prodigi canvas wrap attribute values (per Prodigi API docs)
const CANVAS_EDGE_ATTR: Record<string, string> = {
  "gallery":      "imageWrap",
  "mirror":       "mirrorWrap",
  "museum-black": "black",
  "museum-white": "white",
};

const MOUNT_ATTR: Record<string, string> = {
  "snow-white": "snowWhite",
  "hayseed":    "hayseed",
  "black":      "black",
};

const GLAZE_ATTR: Record<string, string> = {
  "perspex":     "perspex",
  "float-glass": "floatGlass",
  "moth-eye":    "mothEye",
};

function buildItem(opts: {
  portraitUrl: string;
  sku: string;
  productType: string;
  frameColor?: string;
  canvasEdge?: string;
  mountColor?: string;
  glazeType?: string;
  copies?: number;
  ref?: string;
}) {
  const {
    portraitUrl, sku, productType,
    frameColor, canvasEdge,
    mountColor = "snow-white", glazeType = "perspex",
    copies = 1, ref = "portrait-print",
  } = opts;

  const isPhysicalPrint = ["classic-frame","box-frame","print","canvas","acrylic"].includes(productType);
  const attributes: Record<string, string> = {};

  if (isPhysicalPrint && (productType === "classic-frame" || productType === "box-frame")) {
    if (frameColor) attributes.color = FRAME_COLOR_ATTR[frameColor] || frameColor;
    if (mountColor) attributes.mount = MOUNT_ATTR[mountColor] || "snowWhite";
    if (glazeType)  attributes.glaze = GLAZE_ATTR[glazeType] || "perspex";
  }

  if (isPhysicalPrint && productType === "canvas") {
    // Float-frame canvas — SKU prefix GLOBAL-FRA-CAN needs the frame color
    if (sku.startsWith("GLOBAL-FRA-CAN") && frameColor) {
      attributes.color = FRAME_COLOR_ATTR[frameColor] || frameColor;
    } else if (canvasEdge) {
      attributes.wrap = CANVAS_EDGE_ATTR[canvasEdge] || canvasEdge;
    }
  }

  return {
    merchantReference: ref,
    sku,
    copies,
    sizing: "fillPrintArea",
    ...(Object.keys(attributes).length ? { attributes } : {}),
    assets: [{ printArea: "default", url: portraitUrl }],
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      sessionId,
      shippingName,
      shippingEmail,
      shippingLine1,
      shippingCity,
      shippingZip,
      shippingCountry = "US",
      vipPurchased = false,
    } = body;

    if (!shippingLine1) {
      throw new Error("shipping address is required");
    }

    // Build a normalized item list — accept either a single item shape
    // (backward compatible) or an `items` array (BUG-09 multi-item fix).
    let rawItems: any[] = [];
    if (Array.isArray(body.items) && body.items.length > 0) {
      rawItems = body.items;
    } else {
      rawItems = [{
        portraitUrl: body.portraitUrl,
        sku:         body.sku,
        productType: body.productType,
        frameColor:  body.frameColor,
        canvasEdge:  body.canvasEdge,
        mountColor:  body.mountColor,
        glazeType:   body.glazeType,
        copies:      body.copies,
      }];
    }

    const prodigiItems = rawItems
      .filter((it: any) => it && it.portraitUrl && it.sku)
      .map((it: any, i: number) => buildItem({
        portraitUrl: it.portraitUrl,
        sku:         it.sku,
        productType: it.productType,
        frameColor:  it.frameColor,
        canvasEdge:  it.canvasEdge,
        mountColor:  it.mountColor,
        glazeType:   it.glazeType,
        copies:      Math.max(1, parseInt(it.copies || it.qty || 1) || 1),
        ref:         `portrait-print-${i + 1}`,
      }));

    if (prodigiItems.length === 0) {
      throw new Error("at least one item with portraitUrl and sku is required");
    }

    const isSandbox = Deno.env.get("PRODIGI_SANDBOX") !== "false";
    const baseUrl = isSandbox
      ? "https://api.sandbox.prodigi.com/v4.0"
      : "https://api.prodigi.com/v4.0";

    const apiKey = Deno.env.get("PRODIGI_API_KEY");
    if (!apiKey) throw new Error("PRODIGI_API_KEY secret not set");

    const orderPayload = {
      merchantReference: sessionId || `dp-${Date.now()}`,
      // VIP upgrades shipping to Standard (2–3 days faster than Budget)
      shippingMethod: vipPurchased ? "Standard" : "Budget",
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
      items: prodigiItems,
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
    const allSkus = prodigiItems.map(i => i.sku).join(",");

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
          print_sku: allSkus,
        })
        .eq("id", sessionId);
    }

    return new Response(
      JSON.stringify({ success: true, prodigiOrderId, skus: prodigiItems.map(i => i.sku), sandbox: isSandbox }),
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
