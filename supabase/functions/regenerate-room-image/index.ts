import { serve }        from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { roomId, roomImageUrl } = await req.json();
    if (!roomId || !roomImageUrl) throw new Error("roomId and roomImageUrl required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const roomImg = await toBase64(roomImageUrl);
    if (!roomImg) throw new Error("Failed to load room image");

    const prompt = `This is an interior design room photograph. It contains an empty picture frame or canvas placeholder mounted on the wall.

Your task: REMOVE the empty picture frame/canvas completely and replace it with the plain bare wall surface as if no frame was ever there.

Requirements:
- Remove the entire frame structure: frame border, canvas/backing, any mounting hardware
- Fill the removed area naturally with the wall surface — matching the wall texture, color, paint, and any subtle ambient lighting or shadows that belong there
- Do NOT add any new artwork, decorations, or objects
- Keep ALL other room elements exactly as-is: furniture, lighting fixtures, plants, decor, flooring, ceiling, windows, architectural moldings
- The final image should look like a naturally staged empty room with a clean blank wall
- Output ONLY the complete room photo at the same dimensions. No borders, no text, no watermarks.`;

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const base64 = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const bytes  = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const path   = `room-images/${roomId}-v${Date.now()}.jpg`;

    await supabase.storage.from("portraits").upload(path, bytes, {
      contentType: "image/jpeg", upsert: true,
    });

    const { data: { publicUrl } } = supabase.storage
      .from("portraits").getPublicUrl(path);

    await supabase.from("room_images").upsert({
      room_id: roomId,
      url: publicUrl,
      regenerated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ url: publicUrl }),
      { headers: { ...cors, "Content-Type": "application/json" } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }),
      { headers: { ...cors, "Content-Type": "application/json" }, status: 500 });
  }
});
