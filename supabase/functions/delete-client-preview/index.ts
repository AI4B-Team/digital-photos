// Delete a preview gallery row, or a single portrait within one.
// Requires matching email for authorization.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const id: string = (body.id || "").toString();
    const email: string = (body.email || "").toString().trim().toLowerCase();
    const portraitUrl: string = (body.portraitUrl || "").toString();
    if (!id || !email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "id and email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Per-portrait delete: load row, splice, update (or delete row if empty)
    if (portraitUrl) {
      const { data: row, error: selErr } = await supabase
        .from("client_previews")
        .select("portraits")
        .eq("id", id)
        .eq("email", email)
        .maybeSingle();
      if (selErr) throw selErr;
      if (!row) {
        return new Response(JSON.stringify({ error: "not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const portraits = Array.isArray(row.portraits) ? row.portraits : [];
      const next = portraits.filter(
        (p: any) => p?.url !== portraitUrl && p?.hd_url !== portraitUrl,
      );
      if (next.length === 0) {
        const { error: delErr } = await supabase
          .from("client_previews")
          .delete()
          .eq("id", id)
          .eq("email", email);
        if (delErr) throw delErr;
        return new Response(JSON.stringify({ ok: true, removedRow: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error: updErr } = await supabase
        .from("client_previews")
        .update({ portraits: next })
        .eq("id", id)
        .eq("email", email);
      if (updErr) throw updErr;
      return new Response(JSON.stringify({ ok: true, portraits: next }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Full gallery delete
    const { error } = await supabase
      .from("client_previews")
      .delete()
      .eq("id", id)
      .eq("email", email);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("delete-client-preview error", err);
    return new Response(JSON.stringify({ error: err?.message || "failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
