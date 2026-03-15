import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STYLE_PROMPTS: Record<string, string> = {
  royal:
    "Transform this photo into a majestic royal portrait painting in the style of 18th century European court painters. Rich golden tones, velvet robes, ornate crown or tiara, dramatic lighting, oil painting texture, regal pose, baroque frame elements visible at edges.",
  renaissance:
    "Transform this photo into a Renaissance masterpiece in the style of Leonardo da Vinci or Raphael. Soft sfumato technique, warm earth tones, classical composition, subtle chiaroscuro lighting, period-appropriate clothing, oil on canvas texture.",
  storybook:
    "Transform this photo into a whimsical storybook illustration. Soft watercolor style, dreamy pastel colors, magical sparkles and fairy-tale elements, gentle lighting, enchanted forest or castle background, illustrated children's book quality.",
  fantasy:
    "Transform this photo into an ethereal fantasy portrait. Otherworldly glow, magical aura, mystical elements like floating lights or ethereal mist, vibrant jewel tones mixed with soft pastels, dramatic celestial background, digital art masterpiece quality.",
  cinematic:
    "Transform this photo into a cinematic portrait with dramatic film-quality lighting. Moody atmosphere, rich contrast, film grain texture, golden hour or dramatic side lighting, shallow depth of field effect, movie poster quality, color graded like a premium film.",
  minimal:
    "Transform this photo into a clean minimal fine art portrait. Modern aesthetic, limited color palette, elegant simplicity, soft neutral background, precise linework, gallery-quality contemporary art, sophisticated and understated beauty.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, photoUrl, styles, category } = await req.json();

    if (!photoUrl || !styles?.length) {
      throw new Error("photoUrl and styles are required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Update session status to generating
    if (sessionId) {
      await supabase
        .from("sessions")
        .update({ status: "generating" })
        .eq("id", sessionId);
    }

    const categoryContext =
      category === "pets"
        ? "The subject is a pet animal."
        : category === "babies"
        ? "The subject is a baby/infant."
        : category === "memorial"
        ? "This is a memorial portrait, treat with dignity and warmth."
        : category === "gifts"
        ? "This is being created as a gift portrait."
        : "The subject is a person.";

    // Generate portraits for each style
    const results: { style: string; url: string; url_hd: string }[] = [];

    for (const style of styles) {
      const prompt = STYLE_PROMPTS[style];
      if (!prompt) continue;

      try {
        const response = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: `${prompt}\n\n${categoryContext}\n\nCreate a high-quality portrait transformation of the provided photo. Maintain the subject's likeness and key features while applying the artistic style described. The result should look like a professional portrait painting or artwork.`,
                    },
                    {
                      type: "image_url",
                      image_url: { url: photoUrl },
                    },
                  ],
                },
              ],
              modalities: ["image", "text"],
            }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          console.error(`AI generation failed for style ${style}:`, response.status, errText);
          
          if (response.status === 429) {
            // Rate limited - wait and retry once
            await new Promise((r) => setTimeout(r, 5000));
            continue;
          }
          if (response.status === 402) {
            throw new Error("AI credits exhausted. Please add funds to continue.");
          }
          continue;
        }

        const data = await response.json();
        const imageUrl =
          data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
          // Upload the base64 image to Supabase Storage
          const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
          const imageBytes = Uint8Array.from(atob(base64Data), (c) =>
            c.charCodeAt(0)
          );
          const filePath = `generated/${sessionId || "anon"}/${style}-${Date.now()}.png`;

          const { error: uploadError } = await supabase.storage
            .from("portraits")
            .upload(filePath, imageBytes, {
              contentType: "image/png",
              upsert: true,
            });

          if (uploadError) {
            console.error("Storage upload error:", uploadError);
            // Fall back to base64 URL
            results.push({ style, url: imageUrl, url_hd: imageUrl });
          } else {
            const {
              data: { publicUrl },
            } = supabase.storage.from("portraits").getPublicUrl(filePath);
            results.push({ style, url: publicUrl, url_hd: publicUrl });
          }
        }
      } catch (styleErr) {
        console.error(`Error generating ${style}:`, styleErr);
      }
    }

    // Save portraits to DB
    if (sessionId && results.length > 0) {
      const rows = results.map((r) => ({
        session_id: sessionId,
        style: r.style,
        url: r.url,
        url_hd: r.url_hd,
      }));
      await supabase.from("portraits").insert(rows);
      await supabase
        .from("sessions")
        .update({ status: "ready" })
        .eq("id", sessionId);
    }

    return new Response(JSON.stringify({ portraits: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("generate-portraits error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
