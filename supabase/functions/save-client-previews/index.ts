// Save generated portrait previews against the client's email so they can be
// retrieved in the "My Previews" drawer and trigger expiry reminders.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PortraitItem {
  url: string;
  style?: string;
  hd_url?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const email: string = (body.email || "").toString().trim().toLowerCase();
    const sessionId: string | null = body.sessionId || null;
    const category: string | null = body.category || null;
    const sourcePhotoUrl: string | null = body.sourcePhotoUrl || null;
    const portraits: PortraitItem[] = Array.isArray(body.portraits)
      ? body.portraits.filter((p: any) => p && typeof p.url === "string")
      : [];

    if (!email || !email.includes("@") || portraits.length === 0) {
      return new Response(
        JSON.stringify({ error: "email and portraits[] are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // If a row already exists for this session, append/replace its portraits;
    // otherwise insert a new gallery row with a 7-day expiry.
    let row: any = null;
    if (sessionId) {
      const { data: existing } = await supabase
        .from("client_previews")
        .select("id, portraits")
        .eq("session_id", sessionId)
        .maybeSingle();
      if (existing) row = existing;
    }

    if (row) {
      const merged = [...(row.portraits || []), ...portraits];
      // dedupe by url
      const seen = new Set<string>();
      const deduped = merged.filter((p: PortraitItem) => {
        if (seen.has(p.url)) return false;
        seen.add(p.url);
        return true;
      });
      const { error } = await supabase
        .from("client_previews")
        .update({ portraits: deduped, email })
        .eq("id", row.id);
      if (error) throw error;
      return new Response(JSON.stringify({ id: row.id, merged: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from("client_previews")
      .insert({
        email,
        session_id: sessionId,
        category,
        source_photo_url: sourcePhotoUrl,
        portraits,
      })
      .select("id, expires_at")
      .single();
    if (error) throw error;

    return new Response(JSON.stringify({ id: data.id, expires_at: data.expires_at }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("save-client-previews error", err);
    return new Response(JSON.stringify({ error: err?.message || "failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
