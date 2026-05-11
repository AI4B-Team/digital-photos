import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STYLE_PROMPTS: Record<string, string> = {
  royal: "Transform this photo into a majestic royal portrait painting in the style of 18th century European court painters. Rich golden tones, velvet robes, ornate crown or tiara, dramatic lighting, oil painting texture, regal pose, baroque frame elements visible at edges.",
  renaissance: "Transform this photo into a Renaissance masterpiece in the style of Leonardo da Vinci or Raphael. Soft sfumato technique, warm earth tones, classical composition, subtle chiaroscuro lighting, period-appropriate clothing, oil on canvas texture.",
  storybook: "Transform this photo into a whimsical storybook illustration. Soft watercolor style, dreamy pastel colors, magical sparkles and fairy-tale elements, gentle lighting, enchanted forest or castle background, illustrated children's book quality.",
  fantasy: "Transform this photo into an ethereal fantasy portrait. Otherworldly glow, magical aura, mystical elements like floating lights or ethereal mist, vibrant jewel tones mixed with soft pastels, dramatic celestial background, digital art masterpiece quality.",
  cinematic: "Transform this photo into a cinematic portrait with dramatic film-quality lighting. Moody atmosphere, rich contrast, film grain texture, golden hour or dramatic side lighting, shallow depth of field effect, movie poster quality, color graded like a premium film.",
  minimal: "Transform this photo into a clean minimal fine art portrait. Modern aesthetic, limited color palette, elegant simplicity, soft neutral background, precise linework, gallery-quality contemporary art, sophisticated and understated beauty.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { sessionId, sourceImageUrl, style, extraPrompt } = await req.json();
    if (!sourceImageUrl) throw new Error("sourceImageUrl is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const stylePrompt = STYLE_PROMPTS[style] || "";
    const userInstr = extraPrompt
      ? `User refinement instructions: ${extraPrompt}\n\nApply these tweaks while keeping the artistic style.`
      : "Generate a fresh new variation — different pose details, lighting nuance, and brushwork while preserving the subject's likeness.";

    const fullPrompt = `${stylePrompt}\n\n${userInstr}\n\nMaintain the subject's facial likeness and key features. Produce a high-quality portrait artwork.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: fullPrompt },
            { type: "image_url", image_url: { url: sourceImageUrl } },
          ],
        }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) throw new Error("No image returned from AI");

    // Upload to storage
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let publicUrl = imageUrl;
    try {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
      const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      const filePath = `generated/${sessionId || "anon"}/${style || "edit"}-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage
        .from("portraits")
        .upload(filePath, imageBytes, { contentType: "image/png", upsert: true });
      if (!upErr) {
        publicUrl = supabase.storage.from("portraits").getPublicUrl(filePath).data.publicUrl;
        if (sessionId && style) {
          await supabase.from("portraits").insert({
            session_id: sessionId, style, url: publicUrl, url_hd: publicUrl,
          });
        }
      }
    } catch (e) {
      console.error("Storage upload skipped:", e);
    }

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (error) {
    console.error("regenerate-portrait error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500,
    });
  }
});
