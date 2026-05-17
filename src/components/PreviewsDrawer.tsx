// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { X, Clock, ImageIcon, Mail, ShoppingBag, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PreviewRow {
  id: string;
  email: string;
  category: string | null;
  portraits: { url: string; style?: string; hd_url?: string | null }[];
  source_photo_url: string | null;
  ordered: boolean;
  created_at: string;
  expires_at: string;
}

const RED = "#E61919";
const INK = "#1a1a1a";
const MUTED = "#6b675f";
const BORDER = "#e8e2d8";
const BG = "#FAFAF7";

function formatCountdown(ms: number) {
  if (ms <= 0) return "Expired";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function PreviewsDrawer({
  open,
  onClose,
  defaultEmail,
}: {
  open: boolean;
  onClose: () => void;
  defaultEmail?: string;
}) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Tick every minute for the countdowns
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [open]);

  // Pre-fill from localStorage if we have it
  useEffect(() => {
    if (!open) return;
    const stored = (() => { try { return localStorage.getItem("dp:previewEmail") || ""; } catch { return ""; } })();
    const e = defaultEmail || stored;
    if (e && !submittedEmail) {
      setEmail(e);
      void load(e);
    }
  }, [open, defaultEmail]); // eslint-disable-line

  async function load(e: string) {
    if (!e || !e.includes("@")) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-client-previews", {
        body: { email: e.trim().toLowerCase() },
      });
      if (!error && data?.previews) {
        setRows(data.previews);
        setSubmittedEmail(e.trim().toLowerCase());
        try { localStorage.setItem("dp:previewEmail", e.trim().toLowerCase()); } catch {}
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!submittedEmail) return;
    if (!confirm("Delete this preview gallery? This cannot be undone.")) return;
    // Optimistic remove
    const prev = rows;
    setRows(r => r.filter(x => x.id !== id));
    try {
      const { error } = await supabase.functions.invoke("delete-client-preview", {
        body: { id, email: submittedEmail },
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      setRows(prev);
      alert("Could not delete preview. Please try again.");
    }
  }

  const totalPhotos = useMemo(
    () => rows.reduce((n, r) => n + (r.portraits?.length || 0), 0),
    [rows],
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
          zIndex: 70, animation: "previewsFadeIn .2s ease",
        }}
      />
      {/* Drawer */}
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(420px, 100vw)", background: "#fff", zIndex: 71,
          display: "flex", flexDirection: "column",
          boxShadow: "-12px 0 40px rgba(0,0,0,.18)",
          animation: "previewsSlideIn .25s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <ImageIcon size={18} color={INK} />
            <span style={{ fontSize: 15, fontWeight: 800, color: INK, fontFamily: "'Poppins',sans-serif" }}>
              My Previews {totalPhotos > 0 && (
                <span style={{ color: MUTED, fontWeight: 600 }}>({totalPhotos})</span>
              )}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close previews"
            style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}>
            <X size={20} />
          </button>
        </header>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
          {!submittedEmail && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.55 }}>
                Enter the email you used when generating previews — we'll pull up
                your gallery. Previews are kept for <strong>7 days</strong>.
              </div>
              <div style={{ position: "relative" }}>
                <Mail size={14} color={MUTED} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && load(email)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%", padding: "11px 12px 11px 34px",
                    border: `1px solid ${BORDER}`, borderRadius: 9,
                    fontSize: 13.5, color: INK, background: "#fff", outline: "none",
                  }}
                />
              </div>
              <button
                onClick={() => load(email)}
                disabled={loading || !email.includes("@")}
                style={{
                  background: RED, color: "#fff", border: "none", borderRadius: 9,
                  padding: "11px 0", fontSize: 13, fontWeight: 700,
                  fontFamily: "'Poppins',sans-serif", letterSpacing: ".04em",
                  textTransform: "uppercase", cursor: loading ? "wait" : "pointer",
                  opacity: !email.includes("@") ? .5 : 1,
                }}
              >
                {loading ? "Loading…" : "Find My Previews"}
              </button>
            </div>
          )}

          {submittedEmail && rows.length === 0 && !loading && (
            <div style={{ textAlign: "center", color: MUTED, fontSize: 13, padding: "40px 10px" }}>
              No Active Previews Found For<br />
              <strong style={{ color: INK }}>{submittedEmail}</strong>
              <div style={{ marginTop: 14 }}>
                <button onClick={() => { setSubmittedEmail(""); setRows([]); }}
                  style={{ background: "none", border: `1px solid ${BORDER}`, color: INK,
                    padding: "8px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>
                  Try A Different Email
                </button>
              </div>
            </div>
          )}

          {rows.map((row) => {
            const expiresMs = new Date(row.expires_at).getTime() - now;
            const expired = expiresMs <= 0;
            const urgent = !expired && expiresMs < 24 * 3_600_000;
            return (
              <section key={row.id} style={{
                marginBottom: 16, border: `1px solid ${BORDER}`, borderRadius: 12,
                background: BG, overflow: "hidden",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", background: "#fff", borderBottom: `1px solid ${BORDER}`,
                }}>
                  <div style={{ fontSize: 12, color: MUTED, fontWeight: 600,
                    letterSpacing: ".06em", textTransform: "uppercase" }}>
                    {row.category || "Portraits"} · {row.portraits.length} {row.portraits.length === 1 ? "image" : "images"}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 11, fontWeight: 700,
                      color: expired ? MUTED : urgent ? RED : "#16a34a",
                      background: expired ? "#f3f1ec" : urgent ? "#FDECEC" : "#ECFDF3",
                      padding: "3px 9px", borderRadius: 999,
                    }}>
                      <Clock size={12} />
                      {formatCountdown(expiresMs)}
                    </div>
                    <button
                      onClick={() => handleDelete(row.id)}
                      aria-label="Delete preview"
                      title="Delete preview"
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: MUTED, padding: 4, display: "inline-flex",
                        alignItems: "center", justifyContent: "center", borderRadius: 6,
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = RED; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, padding: 8,
                }}>
                  {row.portraits.map((p, i) => (
                    <div key={i} style={{
                      aspectRatio: "3/4", background: "#eee", borderRadius: 6,
                      overflow: "hidden", position: "relative",
                      filter: expired ? "grayscale(.8) opacity(.55)" : "none",
                    }}>
                      <img src={p.url} alt={p.style || "preview"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {p.style && (
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          padding: "3px 6px", fontSize: 9, fontWeight: 700,
                          color: "#fff", background: "linear-gradient(to top, rgba(0,0,0,.7), transparent)",
                          textTransform: "uppercase", letterSpacing: ".05em",
                        }}>{p.style}</div>
                      )}
                    </div>
                  ))}
                </div>
                {!expired && (
                  <div style={{ padding: "8px 12px 12px" }}>
                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem(
                            "dp:pendingPortraits",
                            JSON.stringify(
                              row.portraits.map(p => ({
                                url: p.hd_url || p.url,
                                style: p.style || "",
                              }))
                            )
                          );
                          localStorage.setItem("dp:pendingCategory", row.category || "");
                        } catch {}
                        window.location.href = "/customize";
                      }}
                      style={{
                        display: "inline-flex", alignItems: "center",
                        justifyContent: "center", gap: 7,
                        width: "100%", background: RED, color: "#fff",
                        border: "none",
                        padding: "10px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
                        fontFamily: "'Poppins',sans-serif", letterSpacing: ".04em",
                        textTransform: "uppercase", cursor: "pointer",
                      }}
                    >
                      <ShoppingBag size={13} /> Order Prints
                    </button>
                  </div>
                )}
              </section>
            );
          })}

          {submittedEmail && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button onClick={() => { setSubmittedEmail(""); setRows([]); setEmail(""); }}
                style={{ background: "none", border: "none", color: MUTED,
                  fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
                Use A Different Email
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes previewsFadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes previewsSlideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        `}</style>
      </aside>
    </>
  );
}
