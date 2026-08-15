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
  // Generate the id client-side so guests don't need SELECT access on sessions.
  const id = crypto.randomUUID();

  // Link the session to the signed-in user (if any) so it shows up in My Account.
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("sessions")
    .insert({
      id,
      category:   params.category,
      styles:     params.styles,
      photo_url:  params.photoUrl,
      user_email: params.email ?? user?.email ?? null,
      user_id:    user?.id ?? null,
      status:     "pending",
    });

  if (error) throw error;
  return id;
}

/* NOTE: Portrait persistence and session status updates happen server-side in
   the `generate-portraits` edge function (service role). Client-side helpers for
   those were removed: RLS denies anon INSERT on `portraits` and guest UPDATE on
   `sessions`, so they failed silently. */
