// Delete a preview gallery row. Requires matching email for authorization.
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
