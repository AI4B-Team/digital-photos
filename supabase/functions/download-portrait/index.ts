import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { imageUrl, filename } = await req.json();
    if (!imageUrl) throw new Error("imageUrl is required");

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

    const imageBytes = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    return new Response(imageBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename || "portrait.png"}"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
