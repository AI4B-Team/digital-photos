import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Map size IDs → Prodigi Fine Art Print SKUs
const SIZE_TO_SKU: Record<string, string> = {
  '8" x 8"':   "GLOBAL-FAP-8X8",
  '8" x 11"':  "GLOBAL-FAP-8X11",
  '11" x 8"':  "GLOBAL-FAP-11X8",
  '12" x 12"': "GLOBAL-FAP-12X12",
  '12" x 16"': "GLOBAL-FAP-12X16",
  '16" x 12"': "GLOBAL-FAP-16X12",
  '20" x 20"': "GLOBAL-FAP-20X20",
  '20" x 27"': "GLOBAL-FAP-20X27",
  '27" x 20"': "GLOBAL-FAP-27X20",
  '27" x 36"': "GLOBAL-FAP-27X36",
  '36" x 27"': "GLOBAL-FAP-36X27",
  '22" x 44"': "GLOBAL-FAP-22X44",
  '44" x 22"': "GLOBAL-FAP-44X22",
};

const CANVAS_SIZE_TO_SKU: Record<string, string> = {
  '8" x 8"':   "GLOBAL-CFPM-8X8",
  '12" x 12"': "GLOBAL-CFPM-12X12",
  '12" x 16"': "GLOBAL-CFPM-12X16",
  '16" x 12"': "GLOBAL-CFPM-16X12",
  '20" x 20"': "GLOBAL-CFPM-20X20",
  '20" x 27"': "GLOBAL-CFPM-20X27",
  '27" x 36"': "GLOBAL-CFPM-27X36",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const {
      sessionId,
      portraitUrl,
      size,
      frame,
      shippingName,
      shippingEmail,
      shippingLine1,
      shippingCity,
      shippingZip,
      shippingCountry = "US",
    } = await req.json();

    if (!portraitUrl || !size || !shippingLine1) {
      throw new Error("portraitUrl, size, and shipping address are required");
    }

    const isCanvas = frame === "canvas";
    const skuMap = isCanvas ? CANVAS_SIZE_TO_SKU : SIZE_TO_SKU;
    const sku = skuMap[size];
    if (!sku) throw new Error(`No Prodigi SKU found for size: ${size}`);

    const isSandbox = Deno.env.get("PRODIGI_SANDBOX") !== "false";
    const baseUrl = isSandbox
      ? "https://api.sandbox.prodigi.com/v4.0"
      : "https://api.prodigi.com/v4.0";

    const apiKey = Deno.env.get("PRODIGI_API_KEY");
    if (!apiKey) throw new Error("PRODIGI_API_KEY secret not set");

    const orderPayload = {
      merchantReference: sessionId || `dp-${Date.now()}`,
      shippingMethod: "Budget",
      recipient: {
        name: shippingName || "DigitalPhotos Customer",
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
          print_size: size,
          print_frame: frame,
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
