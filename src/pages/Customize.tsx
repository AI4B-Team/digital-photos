// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";

/* ── Tokens ── */
const RED = "#E61919";
const RED_DK = "#CC1414";
const TXT = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#F4F1EC";        // warm gallery off-white
const SURFACE = "#FFFFFF";
const INK = "#1A1614";
const BORDER = "rgba(0,0,0,0.08)";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box}
.cz-root{font-family:'Poppins',sans-serif;background:${BG};min-height:100vh;color:${TXT}}
.cz-serif{font-family:'Poppins',sans-serif;font-weight:700;letter-spacing:-.01em}
.cz-btn-red{background:${RED};color:#fff;border:none;border-radius:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Poppins',sans-serif}
.cz-btn-red:hover{background:${RED_DK};transform:translateY(-1px);box-shadow:0 10px 24px rgba(230,25,25,.28)}
.cz-chip{padding:8px 14px;border-radius:999px;border:1px solid ${BORDER};background:#fff;cursor:pointer;font-family:'Poppins',sans-serif;font-size:12.5px;font-weight:500;color:${TXT};transition:all .15s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.cz-chip:hover{border-color:rgba(0,0,0,.25)}
.cz-chip.on{background:${INK};color:#fff;border-color:${INK}}
.cz-chip.on .cz-chip-meta{color:rgba(255,255,255,.65)}
.cz-chip-meta{font-size:11px;color:${MUTED};font-weight:500}
.cz-section{background:#fff;border-radius:18px;padding:18px 18px 20px;border:1px solid ${BORDER}}
.cz-label{font-size:10.5px;letter-spacing:.18em;font-weight:600;color:${MUTED};text-transform:uppercase;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.cz-value{font-family:'Poppins',sans-serif;font-size:15px;color:${INK};letter-spacing:0;text-transform:none}
.cz-step{display:flex;align-items:center;gap:6px;color:${MUTED};font-size:12.5px;font-weight:500;cursor:pointer;background:none;border:none;font-family:inherit;padding:6px 10px;border-radius:8px;transition:all .15s}
.cz-step:hover{color:${TXT};background:rgba(0,0,0,.04)}
.cz-step.on{color:${INK};font-weight:600}
.cz-step .cz-step-num{width:22px;height:22px;border-radius:50%;background:#EFE9DF;color:${MUTED};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Poppins',sans-serif}
.cz-step.on .cz-step-num{background:${RED};color:#fff}
.cz-swatch{width:38px;height:38px;border-radius:10px;cursor:pointer;padding:0;transition:transform .15s,box-shadow .15s}
.cz-swatch:hover{transform:translateY(-1px)}
.cz-swatch.on{box-shadow:0 0 0 2px ${RED},0 0 0 4px #fff}
.cz-row{display:flex;gap:8px;flex-wrap:wrap}
.cz-size-scroll{display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;padding:4px 2px 10px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#cfc7bd transparent}
.cz-size-scroll::-webkit-scrollbar{height:6px}
.cz-size-scroll::-webkit-scrollbar-thumb{background:#cfc7bd;border-radius:3px}
.cz-size-scroll::-webkit-scrollbar-track{background:transparent}
.cz-size-card{flex:0 0 auto;scroll-snap-align:start;background:#fff;border:1px solid ${BORDER};border-radius:12px;padding:12px 14px 10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;font-family:'Poppins',sans-serif;transition:all .15s;min-width:88px}
.cz-size-card:hover{border-color:rgba(0,0,0,.25);transform:translateY(-1px)}
.cz-size-card.on{border-color:${RED};box-shadow:0 0 0 1px ${RED}}
@keyframes czFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.cz-fade{animation:czFade .35s cubic-bezier(.23,1,.32,1) both}
@media (max-width: 1100px){
  .cz-grid{grid-template-columns:1fr !important}
  .cz-stage{min-height:46vh !important;padding:28px 16px !important}
  .cz-side{padding:0 16px 24px !important;position:static !important;max-height:none !important}
}
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
  { id: '8" x 8"',   label: '8 × 8',   sub: "Square",    price: 15, w: 1,    h: 1    },
  { id: '8" x 10"',  label: '8 × 10',  sub: "Petite",    price: 19, w: 0.8,  h: 1    },
  { id: '10" x 8"',  label: '10 × 8',  sub: "Petite",    price: 19, w: 1,    h: 0.8  },
  { id: '11" x 14"', label: '11 × 14', sub: "Classic",   price: 29, w: 0.79, h: 1    },
  { id: '14" x 11"', label: '14 × 11', sub: "Classic",   price: 29, w: 1,    h: 0.79 },
  { id: '16" x 20"', label: '16 × 20', sub: "Statement", price: 45, w: 0.8,  h: 1    },
  { id: '20" x 16"', label: '20 × 16', sub: "Statement", price: 45, w: 1,    h: 0.8  },
  { id: '20" x 30"', label: '20 × 30', sub: "Grand",     price: 69, w: 0.67, h: 1    },
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
  { id: "shallow", label: "Slim",    px: 24 },
  { id: "medium",  label: "Medium",  px: 48 },
  { id: "deep",    label: "Deep",    px: 72 },
];

const BORDER_COLORS = [
  "#FFFFFF", "#EFE6D2", "#F5DCDC", "#DCD8B8",
  "#7A7A7A", "#9E8669", "#9C5757", "#3F5F8A", "#3F6B5C",
];

/* ── Frame swatch (mini) ── */
function FrameSwatch({ frame, on }) {
  const wood = frame.wood;
  let inner = (
    <div style={{ width: 22, height: 18, background: "linear-gradient(135deg,#a4b6c8,#7390ad)", borderRadius: 1 }} />
  );
  if (frame.id === "frameless") {
    return (
      <div style={{
        width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#fff", border: on ? `2px solid ${RED}` : `1px solid ${BORDER}`,
      }}>
        {inner}
      </div>
    );
  }
  if (frame.id === "canvas") {
    return (
      <div style={{
        width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#fff", border: on ? `2px solid ${RED}` : `1px solid ${BORDER}`,
      }}>
        <div style={{ width: 22, height: 18, background: "linear-gradient(135deg,#b8c4d2,#869fb8)", boxShadow: "inset 0 0 0 3px #e8e2d4" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
      background: wood, border: on ? `2px solid ${RED}` : "1px solid rgba(0,0,0,.1)",
      padding: 4,
    }}>
      {inner}
    </div>
  );
}

/* ── Page ── */
export default function Customize() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();

  const params = new URLSearchParams(window.location.search);
  const styleId = params.get("style") || session.generatedPortraits?.[0]?.style || "";
  const PLACEHOLDER = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80";
  const portraitUrl = useMemo(() => {
    const found = session.generatedPortraits?.find(p => p.style === styleId);
    return found?.url || session.generatedPortraits?.[0]?.url || session.photo || PLACEHOLDER;
  }, [styleId, session.generatedPortraits, session.photo]);

  const [frame,       setFrame]       = useState(session.customization?.frame       || "black");
  const [size,        setSize]        = useState(session.customization?.size        || '11" x 14"');
  const [effect,      setEffect]      = useState(session.customization?.effect      || "original");
  const [border,      setBorder]      = useState(session.customization?.border      || "shallow");
  const [borderColor, setBorderColor] = useState(session.customization?.borderColor || "#FFFFFF");

  useEffect(() => { if (!portraitUrl) navigate("/"); }, [portraitUrl, navigate]);

  const frameDef  = FRAMES.find(f => f.id === frame)  || FRAMES[1];
  const sizeDef   = SIZES.find(s => s.id === size)    || SIZES[2];
  const effectDef = EFFECTS.find(e => e.id === effect) || EFFECTS[0];
  const borderDef = BORDERS.find(b => b.id === border) || BORDERS[1];

  const total = sizeDef.price + frameDef.add;

  /* ── Preview ── */
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
        boxShadow: isFrameless ? "none" : "0 30px 60px -20px rgba(0,0,0,.28), 0 8px 18px rgba(0,0,0,.08)",
        display: "inline-block",
        maxWidth: "100%",
      }}>
        <div style={{
          background: borderColor,
          padding: innerBorder,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isFrameless ? "0 12px 28px rgba(0,0,0,.14)" : "inset 0 0 14px rgba(0,0,0,.06)",
        }}>
          <img src={portraitUrl} alt="Your portrait"
            style={{ display:"block", maxWidth:"100%", maxHeight:"58vh", filter: effectDef.filter, objectFit:"contain" }}/>
        </div>
      </div>
    );
  };

  const handleContinue = () => {
    setSession({
      customization: { portraitUrl, style: styleId, frame, size, effect, border, borderColor },
      selectedPlan: frameDef.id === "canvas" ? "canvas" : "bundle",
      printSize: size,
    });
    navigate("/checkout");
  };

  if (!portraitUrl) return null;

  const STEPS = [
    { id:"upload",    label:"Upload",    to:"/" },
    { id:"customize", label:"Customize", to:"/customize" },
    { id:"print",     label:"Print",     to:"/checkout" },
  ];

  return (
    <div className="cz-root">
      <style>{G}</style>

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20, background: "rgba(244,241,236,.85)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BORDER}`, padding: "14px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => navigate(-1)} style={{
          background:"transparent", border:"none", cursor:"pointer", color: TXT,
          display:"flex", alignItems:"center", gap:6, fontFamily:"Poppins", fontWeight:500, fontSize:13.5,
        }}>
          <ArrowLeft size={16}/> Back
        </button>

        <nav style={{ display:"flex", alignItems:"center", gap:2 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:2 }}>
              <button className={`cz-step ${s.id==="customize"?"on":""}`} onClick={() => navigate(s.to)}>
                <span className="cz-step-num">{i+1}</span>{s.label}
              </button>
              {i < STEPS.length-1 && <ChevronRight size={14} color={MUTED}/>}
            </div>
          ))}
        </nav>

        <div style={{
          display:"flex", alignItems:"baseline", gap:6,
          padding:"7px 14px", borderRadius:999, background:"#fff", border:`1px solid ${BORDER}`,
        }}>
          <span style={{ fontSize:10.5, letterSpacing:".14em", color:MUTED, fontWeight:600 }}>TOTAL</span>
          <span className="cz-serif" style={{ fontSize:18, fontWeight:700, color:INK }}>${total}</span>
        </div>
      </header>

      {/* Three-column layout */}
      <div className="cz-grid" style={{
        display:"grid", gridTemplateColumns:"300px 1fr 320px", gap:0,
        maxWidth:1500, margin:"0 auto",
      }}>
        {/* Customize controls (left) */}
        <aside className="cz-side" style={{
          padding:"32px 12px 32px 24px",
          position:"sticky", top:70, alignSelf:"start",
          maxHeight:"calc(100vh - 70px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:14,
        }}>
          {/* Size */}
          <div className="cz-section">
            <div className="cz-label"><span>Size</span><span className="cz-value">{sizeDef.label}″</span></div>
            <div className="cz-size-scroll">
              {SIZES.map(s => {
                const on = size === s.id;
                const SHAPE_BOX = 44;
                return (
                  <button key={s.id} onClick={() => setSize(s.id)} className={`cz-size-card ${on?"on":""}`}>
                    <div style={{
                      width: SHAPE_BOX, height: SHAPE_BOX,
                      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:8,
                    }}>
                      <div style={{
                        width: SHAPE_BOX * s.w,
                        height: SHAPE_BOX * s.h,
                        border: `1.5px solid ${on ? RED : "#B8B0A8"}`,
                        borderRadius: 3,
                        background: on ? "rgba(230,25,25,0.06)" : "transparent",
                      }}/>
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:INK, lineHeight:1.1, whiteSpace:"nowrap" }}>{s.label}″</div>
                    <div style={{ fontSize:10.5, color:MUTED, marginTop:2, whiteSpace:"nowrap" }}>From ${s.price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frame */}
          <div className="cz-section">
            <div className="cz-label"><span>Frame</span><span className="cz-value">{frameDef.label}{frameDef.add?` · +$${frameDef.add}`:""}</span></div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(38px, 1fr))", gap:10, marginBottom:10 }}>
              {FRAMES.map(f => (
                <button key={f.id} onClick={() => setFrame(f.id)} title={f.label}
                  style={{ border:"none", background:"transparent", padding:0, cursor:"pointer" }}>
                  <FrameSwatch frame={f} on={frame===f.id}/>
                </button>
              ))}
            </div>
            <div style={{ fontSize:11.5, color:MUTED }}>Tap a swatch to switch frame style.</div>
          </div>

          {/* Effect */}
          <div className="cz-section">
            <div className="cz-label"><span>Effect</span><span className="cz-value">{effectDef.label}</span></div>
            <div className="cz-row">
              {EFFECTS.map(e => (
                <button key={e.id} className={`cz-chip ${effect===e.id?"on":""}`} onClick={() => setEffect(e.id)}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mat / Border */}
          <div className="cz-section">
            <div className="cz-label"><span>Mat</span><span className="cz-value">{borderDef.label}</span></div>
            <div className="cz-row" style={{ marginBottom:14 }}>
              {BORDERS.map(b => (
                <button key={b.id} className={`cz-chip ${border===b.id?"on":""}`} onClick={() => setBorder(b.id)}>
                  {b.label}
                </button>
              ))}
            </div>
            <div className="cz-label" style={{ marginBottom:8 }}><span>Mat color</span></div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {BORDER_COLORS.map(c => (
                <button key={c} aria-label={`Mat color ${c}`} onClick={() => setBorderColor(c)}
                  className={`cz-swatch ${borderColor===c?"on":""}`}
                  style={{ background:c, border: c==="#FFFFFF"?"1px solid rgba(0,0,0,.12)":"none" }}/>
              ))}
            </div>
          </div>
        </aside>

        {/* Preview (middle) */}
        <div className="cz-stage cz-fade" style={{
          padding:"56px 24px",
          minHeight:"calc(100vh - 70px)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:24,
          background:`radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, ${BG} 70%)`,
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, letterSpacing:".24em", color:MUTED, fontWeight:600 }}>YOUR PORTRAIT · LIVE PREVIEW</div>
            <h1 className="cz-serif" style={{ fontSize:28, margin:"6px 0 0", color:INK, fontWeight:600 }}>
              Make It Yours.
            </h1>
          </div>
          {renderPreview()}
          <div style={{ display:"flex", gap:10, alignItems:"center", color:MUTED, fontSize:12.5 }}>
            <span>{sizeDef.label}″</span>
            <span style={{ width:3, height:3, borderRadius:"50%", background:MUTED }}/>
            <span>{frameDef.label}</span>
            <span style={{ width:3, height:3, borderRadius:"50%", background:MUTED }}/>
            <span>{effectDef.label}</span>
          </div>
        </div>

        {/* Cart + pricing (right) */}
        <aside className="cz-side" style={{
          padding:"32px 24px 32px 12px",
          position:"sticky", top:70, alignSelf:"start",
          maxHeight:"calc(100vh - 70px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:14,
        }}>
          <div className="cz-section">
            <div className="cz-label" style={{ marginBottom:14 }}><span>Your Cart</span></div>

            {/* Mini preview */}
            <div style={{
              background:BG, borderRadius:12, padding:14,
              display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14,
              border:`1px solid ${BORDER}`,
            }}>
              <img src={portraitUrl} alt="" style={{
                maxWidth:"100%", maxHeight:120, objectFit:"contain",
                filter: effectDef.filter,
                boxShadow:"0 4px 12px rgba(0,0,0,.15)",
              }}/>
            </div>

            <div className="cz-serif" style={{ fontSize:15, fontWeight:600, color:INK, marginBottom:2 }}>
              Custom Portrait
            </div>
            <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>
              {sizeDef.label}″ · {frameDef.label} · {effectDef.label}
            </div>

            {/* Line items */}
            <div style={{ display:"flex", flexDirection:"column", gap:8, fontSize:13, paddingTop:12, borderTop:`1px solid ${BORDER}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", color:TXT }}>
                <span>{sizeDef.label}″ Print</span><span>${sizeDef.price}</span>
              </div>
              {frameDef.add > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", color:TXT }}>
                  <span>{frameDef.label} Frame</span><span>+${frameDef.add}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", color:MUTED, fontSize:12 }}>
                <span>Shipping</span><span>Free</span>
              </div>
            </div>

            {/* Total */}
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"baseline",
              paddingTop:14, marginTop:14, borderTop:`1px solid ${BORDER}`,
            }}>
              <span style={{ fontSize:13, fontWeight:600, color:INK }}>Total</span>
              <span className="cz-serif" style={{ fontSize:24, fontWeight:700, color:INK }}>${total}</span>
            </div>
          </div>

          <button onClick={handleContinue} className="cz-btn-red" style={{
            padding:"16px 18px", fontSize:14.5,
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          }}>
            <Check size={18}/> Continue to Checkout
          </button>

          <div style={{ textAlign:"center", color:MUTED, fontSize:11.5 }}>
            Free Shipping · 100-Day Happiness Guarantee
          </div>
        </aside>
      </div>
    </div>
  );
}
