// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Image as ImageIcon, LogOut, Truck } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

function fmtDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  catch { return "—"; }
}

function statusLabel(s) {
  const k = String(s || "").toLowerCase();
  if (k.includes("deliver")) return "Delivered";
  if (k.includes("ship")) return "Shipped";
  if (k.includes("paid") || k.includes("complete")) return "In Production";
  if (k.includes("submit")) return "Submitted To Print";
  return "Processing";
}

export default function Account() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [portraits, setPortraits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: sessions } = await supabase
        .from("sessions")
        .select("id, created_at, status, order_id, order_product, print_size, print_frame, tracking_url, photo_url, category")
        .order("created_at", { ascending: false })
        .limit(50);
      const all = sessions || [];
      // Only real orders belong in Order History — plain preview sessions don't.
      const rows = all.filter(
        s => s.order_id || ["purchased", "paid", "complete", "completed", "shipped", "delivered"]
          .includes(String(s.status || "").toLowerCase())
      );
      let pics = [];
      if (all.length) {
        const { data: p } = await supabase
          .from("portraits")
          .select("id, url, style, session_id, created_at")
          .in("session_id", all.map(r => r.id))
          .order("created_at", { ascending: false })
          .limit(60);
        pics = p || [];
      }
      if (cancelled) return;
      setOrders(rows);
      setPortraits(pics);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>
      <LandingHeader />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 22px 80px" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", margin: 0 }}>My Account</h1>
            <p style={{ color: MUTED, fontFamily: "'Poppins',sans-serif", fontSize: 13, margin: "6px 0 0" }}>{user.email}</p>
          </div>
          <button onClick={async () => { await signOut(); navigate("/"); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: `1px solid ${BORDER}`,
              borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 13, color: INK }}>
            <LogOut size={15} /> Sign Out
          </button>
        </header>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: 9 }}>
            <Package size={18} color={RED} /> Order History
          </h2>
          {loading ? (
            <p style={{ color: MUTED, fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>Loading…</p>
          ) : orders.length === 0 ? (
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: 28, background: "#fff" }}>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: MUTED, marginTop: 0 }}>You haven't placed an order yet.</p>
              <button onClick={() => navigate("/")}
                style={{ background: RED, color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px",
                  cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13 }}>
                Create A Portrait
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {orders.map(o => (
                <div key={o.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, background: "#fff",
                  display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  {o.photo_url ? (
                    <img src={o.photo_url} alt="Order source photo" loading="lazy"
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                  ) : null}
                  <div style={{ flex: 1, minWidth: 200, fontFamily: "'Poppins',sans-serif" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{o.order_product || o.category || "Portrait Order"}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>
                      {fmtDate(o.created_at)} · Order {o.order_id || o.id.slice(0, 8)}
                      {o.print_size ? ` · ${o.print_size}` : ""}{o.print_frame ? ` · ${o.print_frame}` : ""}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase",
                    border: `1px solid ${BORDER}`, borderRadius: 999, padding: "6px 12px" }}>{statusLabel(o.status)}</span>
                  {o.tracking_url ? (
                    <a href={o.tracking_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 6, color: RED, fontFamily: "'Poppins',sans-serif", fontSize: 12, textDecoration: "none" }}>
                      <Truck size={14} /> Track
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", display: "flex", alignItems: "center", gap: 9 }}>
            <ImageIcon size={18} color={RED} /> My Portraits
          </h2>
          {loading ? (
            <p style={{ color: MUTED, fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>Loading…</p>
          ) : portraits.length === 0 ? (
            <p style={{ color: MUTED, fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>Portraits you generate will appear here.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
              {portraits.map(p => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", background: "#fff", textDecoration: "none" }}>
                  <img src={p.url} alt={`${p.style || "Portrait"} style portrait`} loading="lazy"
                    style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "9px 11px", fontFamily: "'Poppins',sans-serif", fontSize: 12, color: INK }}>{p.style || "Portrait"}</div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
