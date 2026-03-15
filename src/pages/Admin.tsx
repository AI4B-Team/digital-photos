// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3, Users, Image, DollarSign, Eye, Clock,
  ChevronRight, Search, Filter, Download, RefreshCw,
  Shield, LogOut, Home, Loader2
} from "lucide-react";

const C = {
  bg: "#080705", bgCard: "#0F0D0A", bgLight: "#141109",
  cream: "#F2EDE4", creamMuted: "#B8B09A",
  gold: "#C4963A", goldLight: "#D4AE5C", goldDim: "#7A5C22", goldBg: "rgba(196,150,58,0.07)",
  border: "#1E1B14",
  success: "#4CAF77", error: "#E06060",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Outfit:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#080705; color:#F2EDE4; font-family:'Outfit',sans-serif; font-weight:300; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .fade-in { animation:fadeIn 0.5s ease forwards; }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
`;

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, background: C.goldBg, border: `1px solid rgba(196,150,58,0.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={C.gold} />
        </div>
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.creamMuted }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: C.cream, fontWeight: 600, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.creamMuted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [portraits, setPortraits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!isAdmin) { navigate("/"); return; }

    fetchData();
  }, [user, isAdmin, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [sessRes, portRes] = await Promise.all([
      supabase.from("sessions").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("portraits").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    setSessions(sessRes.data || []);
    setPortraits(portRes.data || []);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={32} color={C.gold} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      </>
    );
  }

  if (!isAdmin) return null;

  const totalSessions = sessions.length;
  const purchased = sessions.filter(s => s.status === "purchased").length;
  const generating = sessions.filter(s => s.status === "generating").length;
  const ready = sessions.filter(s => s.status === "ready").length;
  const totalPortraits = portraits.length;

  const revenue = sessions.filter(s => s.status === "purchased").reduce((sum, s) => {
    if (s.order_product === "canvas") return sum + 149;
    if (s.order_product === "print") return sum + 89;
    return sum + 29;
  }, 0);

  const filteredSessions = sessions.filter(s => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search && !s.user_email?.toLowerCase().includes(search.toLowerCase()) &&
        !s.id?.toLowerCase().includes(search.toLowerCase()) &&
        !s.category?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = (status) => {
    if (status === "purchased") return C.success;
    if (status === "ready") return C.gold;
    if (status === "generating") return "#60A5FA";
    return C.creamMuted;
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: C.bg, minHeight: "100vh" }} className="fade-in">
        {/* Header */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(8,7,5,0.97)", backdropFilter: "blur(18px)", borderBottom: `1px solid ${C.border}`, padding: "0 40px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: C.cream, fontWeight: 600 }}>
                Digital<span style={{ color: C.gold }}>Photos</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.goldBg, border: `1px solid rgba(196,150,58,0.3)`, padding: "4px 12px", fontSize: 10, letterSpacing: "0.15em", color: C.gold, textTransform: "uppercase" }}>
                <Shield size={10} /> Admin
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={() => navigate("/")} style={{ background: "none", border: `1px solid ${C.border}`, color: C.creamMuted, padding: "8px 16px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                <Home size={12} /> Home
              </button>
              <button onClick={signOut} style={{ background: "none", border: `1px solid ${C.border}`, color: C.creamMuted, padding: "8px 16px", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 40px" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: C.cream, fontWeight: 300, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ color: C.creamMuted, fontSize: 14, marginBottom: 32 }}>Overview of all sessions, portraits, and revenue.</p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
            <StatCard icon={BarChart3} label="Total Sessions" value={totalSessions} sub={`${generating} generating · ${ready} ready`} />
            <StatCard icon={DollarSign} label="Revenue" value={`$${revenue.toLocaleString()}`} sub={`${purchased} purchases`} />
            <StatCard icon={Image} label="Portraits" value={totalPortraits} sub="AI-generated portraits" />
            <StatCard icon={Users} label="Conversion" value={totalSessions > 0 ? `${Math.round((purchased / totalSessions) * 100)}%` : "0%"} sub="Sessions → purchases" />
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
              <Search size={14} color={C.creamMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email, ID, or category..."
                style={{ width: "100%", padding: "10px 16px 10px 36px", background: C.bgCard, border: `1px solid ${C.border}`, color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 13, outline: "none" }} />
            </div>
            {["all", "pending", "generating", "ready", "purchased"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: "8px 16px", background: filter === f ? C.goldBg : "transparent",
                  border: `1px solid ${filter === f ? C.gold : C.border}`,
                  color: filter === f ? C.gold : C.creamMuted, cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                {f}
              </button>
            ))}
            <button onClick={fetchData} style={{ background: "none", border: `1px solid ${C.border}`, color: C.creamMuted, padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Sessions table */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["ID", "Email", "Category", "Styles", "Status", "Product", "Created"].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.creamMuted, fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(s => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", color: C.creamMuted, fontFamily: "monospace", fontSize: 11 }}>{s.id?.slice(0, 8)}</td>
                    <td style={{ padding: "12px 16px", color: C.cream }}>{s.user_email || "—"}</td>
                    <td style={{ padding: "12px 16px", color: C.creamMuted, textTransform: "capitalize" }}>{s.category || "—"}</td>
                    <td style={{ padding: "12px 16px", color: C.creamMuted }}>{s.styles?.length || 0} styles</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: statusColor(s.status), border: `1px solid ${statusColor(s.status)}30`, background: `${statusColor(s.status)}10` }}>
                        {s.status || "pending"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: C.creamMuted, textTransform: "capitalize" }}>{s.order_product || "—"}</td>
                    <td style={{ padding: "12px 16px", color: C.creamMuted, fontSize: 11 }}>{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredSessions.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", color: C.creamMuted }}>No sessions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
