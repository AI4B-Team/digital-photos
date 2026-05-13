// Cron-driven dispatcher that decides which preview rows are due for an
// expiry reminder (day 1 / day 3 / day 6 / day 7-expired) and queues them
// into preview_reminder_log. Email sending is intentionally a no-op for now —
// once the project has an email sender wired up, replace the `sendEmail`
// stub at the bottom with an actual call (e.g. send-transactional-email).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ReminderType = "day1" | "day3" | "day6" | "day7_expired";

interface PreviewRow {
  id: string;
  email: string;
  category: string | null;
  portraits: any[];
  ordered: boolean;
  created_at: string;
  expires_at: string;
}

// Decide which (if any) reminder is due for a row, given the elapsed time
// since creation. We only ever return ONE reminder per call; the cron loop
// will catch the next one on its next pass.
function dueReminder(row: PreviewRow, now: Date, alreadySent: Set<ReminderType>): ReminderType | null {
  const created = new Date(row.created_at).getTime();
  const expires = new Date(row.expires_at).getTime();
  const hours = (now.getTime() - created) / 3_600_000;
  const expired = now.getTime() >= expires;

  if (expired && !alreadySent.has("day7_expired")) return "day7_expired";
  if (!expired) {
    if (hours >= 144 && !alreadySent.has("day6")) return "day6"; // ~24h before expiry
    if (hours >= 72  && !alreadySent.has("day3")) return "day3";
    if (hours >= 24  && !alreadySent.has("day1")) return "day1";
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const now = new Date();
    // Pull active (not yet expired by more than 1 day) and unordered preview rows
    const cutoff = new Date(now.getTime() - 24 * 3_600_000).toISOString();
    const { data: rows, error } = await supabase
      .from("client_previews")
      .select("id, email, category, portraits, ordered, created_at, expires_at")
      .eq("ordered", false)
      .gt("expires_at", cutoff)
      .limit(500);
    if (error) throw error;

    const ids = (rows || []).map((r: PreviewRow) => r.id);
    let sentMap = new Map<string, Set<ReminderType>>();
    if (ids.length) {
      const { data: log } = await supabase
        .from("preview_reminder_log")
        .select("preview_id, reminder_type")
        .in("preview_id", ids);
      (log || []).forEach((l: any) => {
        if (!sentMap.has(l.preview_id)) sentMap.set(l.preview_id, new Set());
        sentMap.get(l.preview_id)!.add(l.reminder_type as ReminderType);
      });
    }

    const queued: any[] = [];
    for (const row of (rows || []) as PreviewRow[]) {
      const sent = sentMap.get(row.id) || new Set<ReminderType>();
      const next = dueReminder(row, now, sent);
      if (!next) continue;

      // Insert log first to claim the slot (UNIQUE prevents dupes if cron overlaps)
      const { error: insErr } = await supabase
        .from("preview_reminder_log")
        .insert({
          preview_id: row.id,
          reminder_type: next,
          email: row.email,
          status: "queued",
        });
      if (insErr) {
        // Likely race / unique violation — skip.
        continue;
      }

      // Hook for actually sending — currently a no-op (logged) until email is wired up.
      await sendReminderEmail(row, next);
      queued.push({ preview_id: row.id, reminder: next, email: row.email });
    }

    return new Response(JSON.stringify({ processed: rows?.length || 0, queued }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("process-preview-reminders error", err);
    return new Response(JSON.stringify({ error: err?.message || "failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendReminderEmail(row: PreviewRow, type: ReminderType) {
  // PLACEHOLDER — email sending is not yet enabled for this project.
  // When the email domain + send infrastructure is set up, replace this
  // function body with a call to the project's transactional email sender,
  // e.g.:
  //
  // await supabase.functions.invoke("send-transactional-email", {
  //   body: {
  //     templateName: `preview-reminder-${type}`,
  //     recipientEmail: row.email,
  //     idempotencyKey: `preview-reminder-${row.id}-${type}`,
  //     templateData: { previewId: row.id, expiresAt: row.expires_at, count: row.portraits.length },
  //   },
  // });
  console.log(`[preview-reminder] would send ${type} to ${row.email} for preview ${row.id}`);
}
