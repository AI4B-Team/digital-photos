import { supabase } from "@/integrations/supabase/client";

/* ── Upload a photo to Supabase Storage ─────────────────────── */
export async function uploadPhoto(file: File): Promise<string> {
  const path = `uploads/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  const { data, error } = await supabase.storage
    .from("portraits")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("portraits")
    .getPublicUrl(data.path);

  return publicUrl;
}

/* ── Create a session record in the DB ─────────────────────── */
export async function createSession(params: {
  category:  string;
  styles:    string[];
  photoUrl:  string;
  email?:    string;
}): Promise<string> {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      category:   params.category,
      styles:     params.styles,
      photo_url:  params.photoUrl,
      user_email: params.email ?? null,
      status:     "pending",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

/* ── Update session status ──────────────────────────────────── */
export async function updateSessionStatus(
  sessionId: string,
  status: "pending" | "generating" | "ready" | "purchased",
  extras?: Partial<{ order_id: string; order_product: string; stripe_session_id: string }>
) {
  const { error } = await supabase
    .from("sessions")
    .update({ status, ...extras })
    .eq("id", sessionId);

  if (error) throw error;
}

/* ── Save generated portrait URLs ──────────────────────────── */
export async function savePortraits(sessionId: string, portraits: { style: string; url: string; url_hd: string }[]) {
  const rows = portraits.map(p => ({
    session_id: sessionId,
    style:      p.style,
    url:        p.url,
    url_hd:     p.url_hd,
  }));

  const { error } = await supabase.from("portraits").insert(rows);
  if (error) throw error;
}

/* ── Fetch portraits for a session (post-purchase) ─────────── */
export async function getPortraits(sessionId: string) {
  const { data, error } = await supabase
    .from("portraits")
    .select("*")
    .eq("session_id", sessionId);

  if (error) throw error;
  return data;
}
