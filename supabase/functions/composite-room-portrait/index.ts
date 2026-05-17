import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function toBase64(url: string): Promise<{ data: string; mime: string } | null> {
  try {
    if (url.startsWith("data:image/")) {
      const [header, data] = url.split(",");
      const mime = header.split(";")[0].replace("data:", "");
      return { data, mime };
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const mime = res.headers.get("content-type") || "image/jpeg";
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    return { data: btoa(bin), mime };
  } catch { return null; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { roomUrl, portraitUrl, frameColor = "black" } = await req.json();
    if (!roomUrl || !portraitUrl) throw new Error("roomUrl and portraitUrl required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const [roomImg, portraitImg] = await Promise.all([
      toBase64(roomUrl),
      toBase64(portraitUrl),
    ]);
    if (!roomImg || !portraitImg) throw new Error("Failed to load images");

    const prompt = `You are given two images.
IMAGE 1: A room interior photo. This is the background scene.
IMAGE 2: A portrait artwork with a ${frameColor} frame.

Your task: Create a photorealistic image showing the portrait artwork from IMAGE 2
naturally hanging on the wall in the room from IMAGE 1.

Requirements:
- The portrait must look like it is physically on the wall, not digitally pasted
- Add a realistic shadow cast by the frame onto the wall
- Match the room's ambient lighting and colour temperature
- The frame should be clearly ${frameColor} coloured
- Size the portrait naturally for the wall space (approx 50-70cm equivalent)
- Preserve the exact room interior from IMAGE 1 unchanged
- Output ONLY the final composited room photo. No borders, no text, no watermarks.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [{
          role: "user",
          content: [
            { type: "text",      text: prompt },
            { type: "image_url", image_url: { url: `data:${roomImg.mime};base64,${roomImg.data}` } },
            { type: "image_url", image_url: { url: `data:${portraitImg.mime};base64,${portraitImg.data}` } },
          ],
        }],
        max_tokens: 4096,
      }),
    });

    const result = await response.json();

    const content = result?.choices?.[0]?.message?.content;
    let imageData: string | null = null;
    if (Array.isArray(content)) {
      const imgBlock = content.find((b: any) => b.type === "image_url");
      imageData = imgBlock?.image_url?.url || null;
    } else if (typeof content === "string" && content.startsWith("data:image")) {
      imageData = content;
    }
    const images = result?.choices?.[0]?.message?.images;
    if (!imageData && Array.isArray(images) && images[0]?.image_url?.url) {
      imageData = images[0].image_url.url;
    }
    if (!imageData) throw new Error("No image returned from AI");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const base64 = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const path = `room-composites/${Date.now()}.jpg`;
    await supabase.storage.from("portraits").upload(path, bytes,
      { contentType: "image/jpeg", upsert: false });
    const { data: { publicUrl } } = supabase.storage
      .from("portraits").getPublicUrl(path);

    return new Response(JSON.stringify({ url: publicUrl }),
      { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }),
      { headers: { ...cors, "Content-Type": "application/json" }, status: 500 });
  }
});
