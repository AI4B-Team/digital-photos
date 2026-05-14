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
    const { sessionId, photoUrl, extraPhotoUrls = [], styles, category, templatePrompt = "", templatePrompts = [], styleRefUrl = "" } = await req.json();

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

    // Pre-fetch style reference image and convert to base64 data URL
    // (Gemini cannot fetch from arbitrary preview URLs that may return HTML)
    let styleRefDataUrl = "";
    if (styleRefUrl) {
      try {
        if (typeof styleRefUrl === "string" && styleRefUrl.startsWith("data:image/")) {
          styleRefDataUrl = styleRefUrl;
        } else {
        const refRes = await fetch(styleRefUrl);
        if (refRes.ok) {
          const ct = refRes.headers.get("content-type") || "image/jpeg";
          if (ct.startsWith("image/")) {
            const buf = new Uint8Array(await refRes.arrayBuffer());
            let bin = "";
            for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
            styleRefDataUrl = `data:${ct};base64,${btoa(bin)}`;
          } else {
            console.warn("Style ref URL did not return an image:", ct);
          }
        } else {
          console.warn("Failed to fetch style ref:", refRes.status);
        }
        }
      } catch (e) {
        console.warn("Style ref fetch error:", e);
      }
    }

    // Generate portraits for each style — IN PARALLEL to avoid 150s edge function timeout
    const GENERIC_PHOTO_PROMPT = "Create a high-quality hyper-realistic photograph portrait of the subject in the scene described. Preserve the subject's likeness, fur/skin/eye features. Natural lighting, sharp detail, professional photography quality.";

    const generateOne = async (style: string, idx: number): Promise<{ style: string; url: string; url_hd: string } | null> => {
      const prompt = STYLE_PROMPTS[style] || GENERIC_PHOTO_PROMPT;
      const perVariantPrompt = (Array.isArray(templatePrompts) && templatePrompts[idx]) || templatePrompt;

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
              model: "google/gemini-3.1-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: styleRefDataUrl
                        ? (category === "babies" || category === "people" || category === "memorial" || category === "gifts" || category === "couples"
                          ? `TASK: Recreate the reference scene from IMAGE 1 exactly, but use the PEOPLE from the SUBJECT IMAGES (IMAGE 2 and any further images) as the subjects.\n\nIMAGE 1 = REFERENCE SCENE TEMPLATE. Copy from it:\n- Exact same composition, camera angle, framing, crop\n- Exact same poses, body positions, gestures, expressions\n- Exact same costumes, wardrobe, accessories, props\n- Exact same background, setting, floor, wall\n- Exact same lighting, color grading, photographic style\n\nSUBJECT IMAGES (IMAGE 2 onward) = SUBJECT SOURCES. Each subject image may contain one or more people. CRITICAL identity rules:\n- Preserve the IDENTITY (face, skin tone, hair color, hair style, distinctive features) of EVERY person across all subject images.\n- For couples: there will typically be TWO subject images, one per partner. Map partner A (from IMAGE 2) onto one person in the reference scene and partner B (from IMAGE 3) onto the other person. Both partners' faces must be clearly recognizable.\n- For solo subjects: preserve that single person's identity.\n- Do NOT invent or replace any person. Do NOT drop any subject.\n- Do NOT copy the subject images' clothing, background, or lighting — only their facial identities.\n\n${categoryContext}${perVariantPrompt ? `\n\n>>> SCENE / VARIATION INSTRUCTION: ${perVariantPrompt} <<<` : ""}\n\nCRITICAL OUTPUT RULES:\n1. Output ONLY the photo content at full-bleed. NO frame, NO mat/border, NO mockup chrome.\n2. Hyper-realistic photograph matching the reference scene 1:1.\n3. Every person from the subject images must appear with their real face preserved.\n4. Wardrobe/scene/props/lighting come from IMAGE 1 ONLY.`
                          : `TASK: Pick the SPECIFIC framed picture indicated in the variation instruction below from IMAGE 1 (a wall mockup containing multiple framed pet pictures). Recreate that ONE framed scene exactly, but replace the pet inside it with the pet from IMAGE 2.\n\nIMAGE 1 = REFERENCE TEMPLATE — a room/wall mockup containing 4 framed pet portraits in a 2x2 layout. You must look INSIDE the specific frame named in the variation instruction and copy the scene that is inside that frame:\n- Exact same pose, body position, head angle, and expression\n- Exact same costume, accessories, props (shower cap, newspaper, hairdryer, bathtub, soap, etc.)\n- Exact same background setting (tiled wall, toilet, plain backdrop, tub interior, etc.)\n- Exact same lighting, color grading, and photographic style\n- Exact same camera angle, framing, and crop\nThe output must look IDENTICAL to that one framed photo, just with a different pet breed/identity.\n\nIMAGE 2 = SUBJECT SOURCE. Use ONLY for identity: face/head shape, fur color/pattern, markings, eye color, breed/species. Do NOT copy IMAGE 2's background, lighting, or photo style.\n\n${categoryContext}${perVariantPrompt ? `\n\n>>> VARIATION INSTRUCTION (which frame to copy): ${perVariantPrompt} <<<` : ""}\n\nCRITICAL OUTPUT RULES:\n1. Output ONLY the artwork content INSIDE the chosen frame at full-bleed. NO frame, NO mat/border, NO wall, NO room, NO other frames, NO mockup chrome.\n2. The result must be a standalone hyper-realistic photograph that matches the chosen scene's style 1:1.\n3. Pet identity = IMAGE 2. Everything else (pose, props, scene, lighting, costume) = the chosen frame in IMAGE 1.\n4. Do not invent a new scene. Do not blend frames. Copy the chosen frame's scene exactly.`)
                        : `${prompt}\n\n${categoryContext}${perVariantPrompt ? `\n\nScene Direction: ${perVariantPrompt}` : ""}\n\nCreate a high-quality portrait transformation of the provided photo. Maintain the subject's likeness and key features while applying the artistic style described. The result should look like a professional portrait painting or artwork.`,
                    },
                    ...(styleRefDataUrl ? [{ type: "image_url", image_url: { url: styleRefDataUrl } }] : []),
                    {
                      type: "image_url",
                      image_url: { url: photoUrl },
                    },
                    ...(Array.isArray(extraPhotoUrls) ? extraPhotoUrls.filter((u: string) => typeof u === "string" && u.length > 0).map((u: string) => ({
                      type: "image_url" as const,
                      image_url: { url: u },
                    })) : []),
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
            await new Promise((r) => setTimeout(r, 5000));
            return null;
          }
          if (response.status === 402) {
            throw new Error("AI credits exhausted. Please add funds to continue.");
          }
          return null;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (!imageUrl) return null;

        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        const filePath = `generated/${sessionId || "anon"}/${style}-${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("portraits")
          .upload(filePath, imageBytes, { contentType: "image/png", upsert: true });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          return { style, url: imageUrl, url_hd: imageUrl };
        }
        const { data: { publicUrl } } = supabase.storage.from("portraits").getPublicUrl(filePath);
        return { style, url: publicUrl, url_hd: publicUrl };
      } catch (styleErr) {
        console.error(`Error generating ${style}:`, styleErr);
        return null;
      }
    };

    const settled = await Promise.all((styles as string[]).map((s, i) => generateOne(s, i)));
    const results = settled.filter((r): r is { style: string; url: string; url_hd: string } => !!r);

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
