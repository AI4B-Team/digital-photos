// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { ArrowLeft, Check, Plus } from "lucide-react";

/* ── Tokens (match Index.tsx light/red theme) ── */
const RED = "#E61919";
const RED_DK = "#CC1414";
const TXT = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAFAFA";
const CARD = "#FFFFFF";
const BORDER = "rgba(0,0,0,0.1)";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box}
.cz-root{font-family:'Poppins',sans-serif;background:${BG};min-height:100vh;color:${TXT}}
.cz-btn-red{background:${RED};color:#fff;border:none;border-radius:999px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Poppins',sans-serif}
.cz-btn-red:hover{background:${RED_DK};transform:translateY(-1px);box-shadow:0 6px 18px rgba(230,25,25,.25)}
.cz-tile{background:#fff;border:2px solid ${BORDER};border-radius:14px;padding:10px;cursor:pointer;transition:all .15s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}
.cz-tile:hover{border-color:rgba(0,0,0,.25)}
.cz-tile.on{border-color:${RED};color:${RED}}
.cz-tab{padding:14px 8px;border:none;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;color:${MUTED};font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;transition:color .15s;flex:1}
.cz-tab.on{color:${RED}}
.cz-fab{width:46px;height:46px;border-radius:999px;background:${RED};color:#fff;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;transition:all .2s}
.cz-fab:hover{background:${RED_DK};transform:scale(1.05)}
@keyframes czPanel{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.cz-panel{animation:czPanel .25s cubic-bezier(.23,1,.32,1) both}
`;

/* ── Options ── */
const FRAMES = [
  { id: "frameless",   label: "Frameless",   add: 0,  wood: null },
  { id: "black",       label: "Black",       add: 0,  wood: "#1a1a1a", w: 14 },
  { id: "white",       label: "White",       add: 0,  wood: "#f4f4f4", w: 14 },
  { id: "oak",         label: "Oak",         add: 2,  wood: "#c89968", w: 14 },
  { id: "wide-black",  label: "Wide Black",  add: 4,  wood: "#1a1a1a", w: 28 },
  { id: "wide-white",  label: "Wide White",  add: 4,  wood: "#f4f4f4", w: 28 },
  { id: "wide-walnut", label: "Wide Walnut", add: 4,  wood: "#5a3a24", w: 28 },
  { id: "canvas",      label: "Canvas",      add: 15, wood: null },
];

const SIZES = [
  { id: '8" x 8"',   label: '8" x 8"',   price: 15 },
  { id: '8" x 10"',  label: '8" x 10"',  price: 19 },
  { id: '11" x 14"', label: '11" x 14"', price: 29 },
  { id: '16" x 20"', label: '16" x 20"', price: 45 },
  { id: '20" x 30"', label: '20" x 30"', price: 69 },
];

const EFFECTS = [
  { id: "original", label: "Original", filter: "none" },
  { id: "silver",   label: "Silver",   filter: "grayscale(0.6) contrast(1.05)" },
  { id: "noir",     label: "Noir",     filter: "grayscale(1) contrast(1.15)" },
  { id: "vivid",    label: "Vivid",    filter: "saturate(1.4) contrast(1.1)" },
  { id: "dramatic", label: "Dramatic", filter: "contrast(1.25) saturate(1.15) brightness(.95)" },
];

const BORDERS = [
  { id: "none",    label: "None",    px: 0 },
  { id: "shallow", label: "Shallow", px: 24 },
  { id: "medium",  label: "Medium",  px: 48 },
  { id: "deep",    label: "Deep",    px: 72 },
];

const BORDER_COLORS = [
  "#FFFFFF", "#EFE6D2", "#F5DCDC", "#DCD8B8",
  "#7A7A7A", "#9E8669", "#9C5757", "#3F5F8A", "#3F6B5C",
];

/* ── Frame icon (mini preview for tile) ── */
function FrameIcon({ frame }) {
  const wood = frame.wood;
  const w = frame.w || 0;
  if (frame.id === "frameless") {
    return <div style={{ width: 56, height: 42, background: "linear-gradient(135deg,#a4b6c8,#7390ad)", borderRadius: 4 }} />;
  }
  if (frame.id === "canvas") {
    return <div style={{ width: 56, height: 42, background: "linear-gradient(135deg,#b8c4d2,#869fb8)", borderRadius: 2, boxShadow: "inset 0 0 0 6px #e8e2d4" }} />;
  }
  return (
    <div style={{ background: wood, padding: Math.max(4, w / 3), borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,.15)" }}>
      <div style={{ width: 44, height: 32, background: "linear-gradient(135deg,#a4b6c8,#7390ad)" }} />
    </div>
  );
}

/* ── Main page ── */
export default function Customize() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();

  // Pull source portrait — prefer ?style= from query, else first generated, else uploaded photo
  const params = new URLSearchParams(window.location.search);
  const styleId = params.get("style") || session.generatedPortraits?.[0]?.style || "";
  const portraitUrl = useMemo(() => {
    const found = session.generatedPortraits?.find(p => p.style === styleId);
    return found?.url || session.generatedPortraits?.[0]?.url || session.photo || "";
  }, [styleId, session.generatedPortraits, session.photo]);

  const [frame,       setFrame]       = useState(session.customization?.frame       || "black");
  const [size,        setSize]        = useState(session.customization?.size        || '11" x 14"');
  const [effect,      setEffect]      = useState(session.customization?.effect      || "original");
  const [border,      setBorder]      = useState(session.customization?.border      || "shallow");
  const [borderColor, setBorderColor] = useState(session.customization?.borderColor || "#FFFFFF");
  const [tab, setTab] = useState<"frame" | "size" | "effect" | "border" | null>("frame");

  // Redirect home if no photo to customize
  useEffect(() => {
    if (!portraitUrl) navigate("/");
  }, [portraitUrl, navigate]);

  const frameDef  = FRAMES.find(f => f.id === frame)  || FRAMES[1];
  const sizeDef   = SIZES.find(s => s.id === size)    || SIZES[2];
  const effectDef = EFFECTS.find(e => e.id === effect) || EFFECTS[0];
  const borderDef = BORDERS.find(b => b.id === border) || BORDERS[1];

  const total = sizeDef.price + frameDef.add;

  /* ── Preview render ── */
  const renderPreview = () => {
    const woodPad = frameDef.w || 0;
    const innerBorder = borderDef.px;
    const isFrameless = frameDef.id === "frameless";
    const isCanvas    = frameDef.id === "canvas";

    return (
      <div style={{
        background: isCanvas ? "#fff" : (isFrameless ? "transparent" : frameDef.wood),
        padding: isFrameless ? 0 : woodPad,
        borderRadius: isFrameless ? 0 : 3,
        boxShadow: isFrameless ? "none" : "0 18px 44px rgba(0,0,0,.18), 0 4px 10px rgba(0,0,0,.08)",
        display: "inline-block",
        maxWidth: "100%",
      }}>
        <div style={{
          background: borderColor,
          padding: innerBorder,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isFrameless ? "0 8px 24px rgba(0,0,0,.12)" : "inset 0 0 14px rgba(0,0,0,.06)",
        }}>
          <img
            src={portraitUrl}
            alt="Your portrait"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "52vh",
              filter: effectDef.filter,
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    );
  };

  /* ── Continue ── */
  const handleContinue = () => {
    setSession({
      customization: { portraitUrl, style: styleId, frame, size, effect, border, borderColor },
      selectedPlan: frameDef.id === "canvas" ? "canvas" : "bundle",
      printSize: size,
    });
    navigate("/checkout");
  };

  if (!portraitUrl) return null;

  return (
    <div className="cz-root">
      <style>{G}</style>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20, background: "#fff",
        borderBottom: `1px solid ${BORDER}`, padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => navigate(-1)} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: TXT, display: "flex", alignItems: "center", gap: 6, fontFamily: "Poppins", fontWeight: 500,
        }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ fontFamily: "Poppins", fontWeight: 700, letterSpacing: ".18em", fontSize: 14 }}>
          CUSTOMIZE
        </div>
        <div style={{
          background: RED, color: "#fff", padding: "8px 16px", borderRadius: 999,
          fontWeight: 600, fontSize: 14, fontFamily: "Poppins",
        }}>
          ${total}
        </div>
      </header>

      {/* Step nav: Upload | Customize | Print */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        padding:"14px 20px", background:"#fff", borderBottom:`1px solid ${BORDER}`,
      }}>
        {[
          { id:"upload",    label:"Upload",    to:"/" },
          { id:"customize", label:"Customize", to:"/customize" },
          { id:"print",     label:"Print",     to:"/checkout" },
        ].map((s, i, arr) => {
          const active = s.id === "customize";
          return (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button onClick={() => navigate(s.to)}
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"8px 16px", borderRadius:999,
                  background: active ? RED : "transparent",
                  color: active ? "#fff" : TXT,
                  border: active ? "none" : `1px solid ${BORDER}`,
                  fontFamily:"Poppins", fontWeight:600, fontSize:13, cursor:"pointer",
                  transition:"all .15s",
                }}>
                <span style={{
                  width:20, height:20, borderRadius:"50%",
                  background: active ? "rgba(255,255,255,.25)" : "#F0F0F0",
                  color: active ? "#fff" : MUTED,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:700,
                }}>{i+1}</span>
                {s.label}
              </button>
              {i < arr.length-1 && (
                <div style={{ width:24, height:1, background:BORDER }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview area */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px 20px", minHeight: "60vh",
      }}>
        {renderPreview()}
      </div>

      {/* Selected size badge */}
      <div style={{ textAlign: "center", color: MUTED, fontSize: 13, marginBottom: 20 }}>
        {sizeDef.label} · {frameDef.label} · {effectDef.label}
      </div>

      {/* Bottom toolbar / panel */}
      <div style={{
        position: "sticky", bottom: 0, background: "#fff",
        borderTop: `1px solid ${BORDER}`, padding: "16px 16px 20px",
      }}>
        {/* Active panel */}
        {tab === "frame" && (
          <div className="cz-panel" style={{ marginBottom: 14 }}>
            <PanelHead title="Select Frame" onDone={() => setTab(null)} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 10 }}>
              {FRAMES.map(f => (
                <button key={f.id} className={`cz-tile ${frame === f.id ? "on" : ""}`} onClick={() => setFrame(f.id)}>
                  <FrameIcon frame={f} />
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: "Poppins", marginTop: 4 }}>{f.label}</div>
                  {f.add > 0 && <div style={{ fontSize: 10, color: MUTED }}>+${f.add} per tile</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "size" && (
          <div className="cz-panel" style={{ marginBottom: 14 }}>
            <PanelHead title="Select Size" onDone={() => setTab(null)} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
              {SIZES.map(s => (
                <button key={s.id} className={`cz-tile ${size === s.id ? "on" : ""}`} onClick={() => setSize(s.id)} style={{ padding: "16px 8px" }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>${s.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "effect" && (
          <div className="cz-panel" style={{ marginBottom: 14 }}>
            <PanelHead title="Select Effect" onDone={() => setTab(null)} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 10 }}>
              {EFFECTS.map(e => (
                <button key={e.id} className={`cz-tile ${effect === e.id ? "on" : ""}`} onClick={() => setEffect(e.id)}>
                  <div style={{ width: 56, height: 42, borderRadius: 4, overflow: "hidden", background: "#eee" }}>
                    <img src={portraitUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: e.filter }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{e.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "border" && (
          <div className="cz-panel" style={{ marginBottom: 14 }}>
            <PanelHead title="Select Border" onDone={() => setTab(null)} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
              {BORDERS.map(b => (
                <button key={b.id} className={`cz-tile ${border === b.id ? "on" : ""}`} onClick={() => setBorder(b.id)}>
                  <div style={{ width: 56, height: 42, background: borderColor, padding: Math.min(b.px / 6, 10), border: "1px solid rgba(0,0,0,.08)" }}>
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#a4b6c8,#7390ad)" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{b.label}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {BORDER_COLORS.map(c => (
                <button key={c} onClick={() => setBorderColor(c)} aria-label={`Border color ${c}`} style={{
                  width: 32, height: 32, borderRadius: 999, background: c,
                  border: borderColor === c ? `2px solid ${RED}` : "1px solid rgba(0,0,0,.15)",
                  cursor: "pointer", padding: 0,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: "#fff", borderRadius: 14, border: `1px solid ${BORDER}`, padding: 6,
        }}>
          <TabBtn icon="▭" label="Frame"  on={tab === "frame"}  onClick={() => setTab(tab === "frame"  ? null : "frame")} />
          <TabBtn icon="⤢" label="Size"   on={tab === "size"}   onClick={() => setTab(tab === "size"   ? null : "size")} />
          <TabBtn icon="✦" label="Effect" on={tab === "effect"} onClick={() => setTab(tab === "effect" ? null : "effect")} />
          <TabBtn icon="◳" label="Border" on={tab === "border"} onClick={() => setTab(tab === "border" ? null : "border")} />
          <button onClick={handleContinue} className="cz-fab" aria-label="Continue to checkout" title="Continue to checkout">
            <Check size={20} />
          </button>
        </div>

        {/* Continue button (full width, always visible) */}
        <button onClick={handleContinue} className="cz-btn-red" style={{
          width: "100%", marginTop: 14, padding: "16px", fontSize: 15,
        }}>
          Continue to Checkout · ${total}
        </button>
      </div>
    </div>
  );
}

function PanelHead({ title, onDone }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
      <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "Poppins" }}>{title}</div>
      <button onClick={onDone} style={{
        background: "transparent", border: "none", color: RED,
        fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "Poppins",
      }}>
        Done
      </button>
    </div>
  );
}

function TabBtn({ icon, label, on, onClick }) {
  return (
    <button className={`cz-tab ${on ? "on" : ""}`} onClick={onClick}>
      <div style={{ fontSize: 18, lineHeight: 1 }}>{icon}</div>
      <div>{label}</div>
    </button>
  );
}
