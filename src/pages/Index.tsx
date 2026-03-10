import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, X, Check, ChevronRight, ChevronDown, Download,
  Printer, FrameIcon, Share2, Heart, Truck, RefreshCw,
  Clock, Lock, Wand2, Shield, Sparkles, AlertCircle, Copy
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const T = {
  bg:      "#07060A",
  sur:     "#0D0C10",
  card:    "#111019",
  border:  "#1E1A14",
  bGold:   "rgba(196,150,58,.35)",
  cream:   "#EAE6DF",
  muted:   "#7A7060",
  dim:     "#3A3428",
  gold:    "#C4963A",
  goldLt:  "#DDB04E",
};

/* ─────────────────────────────────────────────────────────────
   GLOBAL CSS  (inline styles only — Lovable compatible)
───────────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,700;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; }
body { background:#07060A; color:#EAE6DF; font-family:'DM Sans',sans-serif; font-weight:300; overflow-x:hidden; }
::-webkit-scrollbar { width:2px; } ::-webkit-scrollbar-thumb { background:#C4963A; }

@keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn  { from{opacity:0} to{opacity:1} }
@keyframes scaleIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
@keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
@keyframes spinR   { from{transform:rotate(0)} to{transform:rotate(360deg)} }
@keyframes drift   { 0%{transform:translateX(0) rotate(-20deg)} 100%{transform:translateX(-50%) rotate(-20deg)} }
@keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,.4)} 50%{box-shadow:0 0 0 14px rgba(196,150,58,0)} }
@keyframes buildIn { from{opacity:0;transform:scale(.88) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }

.fu  { animation:fadeUp  .65s ease both; }
.fi  { animation:fadeIn  .45s ease both; }
.si  { animation:scaleIn .6s  cubic-bezier(.23,1,.32,1) both; }
.flt { animation:floatY  5s   ease-in-out infinite; }
.spn { animation:spinR   1.1s linear infinite; }
.bi  { animation:buildIn .45s cubic-bezier(.23,1,.32,1) both; }

.gold-text {
  background: linear-gradient(90deg,#C4963A 0%,#F0D070 35%,#C4963A 60%,#A07828 80%,#DDB04E 100%);
  background-size:300% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation:shimmer 5s linear infinite;
}

/* Buttons */
.btn-gold {
  background:linear-gradient(135deg,#C4963A,#E0B44A 50%,#C4963A);
  color:#07060A; border:none; cursor:pointer;
  font-family:'DM Sans',sans-serif; font-weight:500; letter-spacing:.08em; text-transform:uppercase;
  transition:all .3s;
}
.btn-gold:hover   { transform:translateY(-2px); box-shadow:0 10px 32px rgba(196,150,58,.45); }
.btn-gold:active  { transform:translateY(0); }
.btn-gold:disabled{ opacity:.3; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-ghost {
  background:transparent; border:1px solid #1E1A14; color:#7A7060; cursor:pointer;
  font-family:'DM Sans',sans-serif; font-size:12px; letter-spacing:.08em; text-transform:uppercase;
  transition:all .3s;
}
.btn-ghost:hover { border-color:rgba(196,150,58,.35); color:#EAE6DF; }

/* Builder chips */
.chip {
  display:inline-flex; align-items:center; gap:7px; padding:9px 16px;
  border-radius:6px; cursor:pointer; font-family:'DM Sans',sans-serif;
  font-size:12px; font-weight:400; transition:all .22s; white-space:nowrap;
  border:1px solid #1E1A14; background:#0D0C10; color:#7A7060;
}
.chip:hover { border-color:rgba(196,150,58,.35); color:#EAE6DF; }
.chip.on    { border-color:#C4963A; background:rgba(196,150,58,.09); color:#C4963A; font-weight:500; }

/* Drop zone */
.dz {
  border:1.5px dashed #2A2318; text-align:center; cursor:pointer;
  transition:all .3s; background:#09080C; position:relative; overflow:hidden;
}
.dz:hover,.dz.drag { border-color:rgba(196,150,58,.55); background:rgba(196,150,58,.04); }

/* Step indicator */
.sdot { width:7px; height:7px; border-radius:50%; transition:all .35s; flex-shrink:0; }
.sdot.done   { background:#C4963A; }
.sdot.active { background:#C4963A; box-shadow:0 0 0 5px rgba(196,150,58,.2); }
.sdot.todo   { background:#252018; }

/* Portrait tile */
.ptile { position:relative; overflow:hidden; transition:transform .4s cubic-bezier(.23,1,.32,1); }
.ptile:hover { transform:translateY(-6px); }
.ptile img   { width:100%; height:100%; object-fit:cover; display:block; filter:brightness(.8); transition:filter .4s; }
.ptile:hover img { filter:brightness(.96); }

/* Price card */
.pcard { border:1.5px solid #1E1A14; transition:all .35s cubic-bezier(.23,1,.32,1); cursor:pointer; position:relative; overflow:hidden; }
.pcard:hover { border-color:rgba(196,150,58,.4); transform:translateY(-4px); }
.pcard.sel   { border-color:#C4963A; background:rgba(196,150,58,.05); }

/* Watermark */
.wml { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
.wmr { position:absolute; white-space:nowrap; font-family:'DM Sans',sans-serif; font-size:14px;
       font-weight:500; letter-spacing:.32em; text-transform:uppercase;
       color:rgba(255,255,255,.22); animation:drift 22s linear infinite; width:200%; }

/* Thumb strip */
.tstrip { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; }
.tstrip::-webkit-scrollbar { height:2px; }
.tstrip::-webkit-scrollbar-thumb { background:#C4963A; }

/* Sz btn */
.szb { padding:6px 13px; font-size:12px; font-family:'DM Sans',sans-serif; cursor:pointer; border-radius:5px; transition:all .2s; }
.szon  { border:1px solid #C4963A; background:rgba(196,150,58,.1); color:#C4963A; }
.szoff { border:1px solid #1E1A14; background:transparent; color:#7A7060; }
.szoff:hover { border-color:rgba(196,150,58,.35); color:#EAE6DF; }

@media(max-width:900px) {
  .hgrid { grid-template-columns:1fr !important; }
  .hid   { display:none !important; }
  .stgrid{ grid-template-columns:repeat(2,1fr) !important; }
}
`;

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const CATS = [
  { id:"pets",     label:"Pets",     emoji:"🐾" },
  { id:"babies",   label:"Babies",   emoji:"🍼" },
  { id:"adults",   label:"Adults",   emoji:"👤" },
  { id:"couples",  label:"Couples",  emoji:"💑" },
  { id:"families", label:"Families", emoji:"🏡" },
  { id:"memorial", label:"Memorial", emoji:"✦"  },
];

const STYLES = [
  { id:"royal",       label:"Royal",       preview:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=520&h=650&fit=crop", desc:"Regal, majestic, golden era" },
  { id:"renaissance", label:"Renaissance", preview:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=520&h=650&fit=crop", desc:"Old masters, rich tones" },
  { id:"storybook",   label:"Storybook",   preview:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=520&h=650&fit=crop", desc:"Whimsical, illustrated" },
  { id:"fantasy",     label:"Fantasy",     preview:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=520&h=650&fit=crop", desc:"Ethereal, otherworldly" },
  { id:"cinematic",   label:"Cinematic",   preview:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=520&h=650&fit=crop", desc:"Moody, film-quality" },
  { id:"minimal",     label:"Minimal",     preview:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=520&h=650&fit=crop", desc:"Clean, modern fine art" },
];

const GEN_MSGS = [
  "Analyzing your photo…",
  "Training your personal AI model…",
  "Applying portrait styles…",
  "Rendering Royal composition…",
  "Crafting Renaissance details…",
  "Building Cinematic atmosphere…",
  "Adding finishing touches…",
  "Almost ready…",
];

/* ─────────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────────── */
function Stars({ n = 5 }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {Array(n).fill(0).map((_,i) => (
        <span key={i} style={{ width:15, height:15, background:"#00B67A", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
          <svg viewBox="0 0 12 12" width={8} height={8} fill="#fff"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>
        </span>
      ))}
    </span>
  );
}

function Watermark() {
  return (
    <div className="wml">
      {[-5, 30, 65, 100].map((top, i) => (
        <div key={i} className="wmr" style={{ top:`${top}%`, animationDelay:`${i * -5.5}s` }}>
          {Array(9).fill("DIGITAL PHOTOS  ·  ").join("")}
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize:10, letterSpacing:".32em", textTransform:"uppercase", color:T.gold, fontWeight:500, textAlign:"center", marginBottom:12 }}>
      {children}
    </p>
  );
}

function Rule() {
  return <div style={{ width:48, height:1, background:`linear-gradient(90deg,transparent,${T.gold},transparent)`, margin:"0 auto" }}/>;
}

/* ─────────────────────────────────────────────────────────────
   SCREEN: HOME PAGE
   Sections: Hero+Builder · Styles · Before/After · Trust · CTA
───────────────────────────────────────────────────────────── */
function HomePage({ onGenerate }) {
  /* ── builder state ── */
  const [cat,    setCat]    = useState("");
  const [photo,  setPhoto]  = useState(null);
  const [styles, setStyles] = useState([]);
  const [drag,   setDrag]   = useState(false);
  const [err,    setErr]    = useState("");

  /* ── before/after ── */
  const [baX,    setBaX]    = useState(50);
  const [baDown, setBaDown] = useState(false);
  const baRef = useRef();

  /* ── nav scroll ── */
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 56);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── photo loader ── */
  const loadFile = useCallback(f => {
    if (!f?.type?.startsWith("image/")) { setErr("Please upload an image file."); return; }
    setErr("");
    const r = new FileReader();
    r.onload = e => setPhoto(e.target.result);
    r.readAsDataURL(f);
  }, []);

  const fileRef = useRef();

  /* ── style toggle ── */
  const toggleStyle = id =>
    setStyles(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);

  /* ── builder step ── */
  const step = !cat ? 1 : !photo ? 2 : styles.length === 0 ? 3 : 4;

  /* ── canGenerate ── */
  const canGo = cat && photo && styles.length > 0;

  /* ── style card → auto-select + scroll ── */
  const pickStyleAndScroll = id => {
    if (!styles.includes(id)) setStyles(p => [...p, id]);
    heroRef.current?.scrollIntoView({ behavior:"smooth" });
  };

  /* ── BA slider ── */
  const moveBA = clientX => {
    if (!baRef.current) return;
    const r = baRef.current.getBoundingClientRect();
    setBaX(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  /* ── scroll to hero ── */
  const scrollToHero = () => heroRef.current?.scrollIntoView({ behavior:"smooth" });

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200, height:54,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 28px",
        background: scrolled ? "rgba(7,6,10,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition:"all .4s",
      }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, fontWeight:500 }}>
          Digital<span style={{ color:T.gold }}>Photos</span>
          <sup style={{ fontSize:8, color:T.dim, marginLeft:2 }}>™</sup>
        </div>
        <div className="hid" style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Stars n={5}/>
          <span style={{ fontSize:12, color:T.muted }}>4.9 · 50k+ portraits created</span>
        </div>
        <div style={{ width:120 }}/>
      </nav>

      {/* ══ HERO + BUILDER ═══════════════════════════════════ */}
      <section ref={heroRef} style={{
        minHeight:"100vh", paddingTop:54, display:"flex", alignItems:"center",
        position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse 90% 70% at 65% 50%, rgba(100,70,10,.18) 0%, transparent 68%), ${T.bg}`,
      }}>
        {/* grid texture */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.025,
          backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
          backgroundSize:"60px 60px" }}/>
        {/* ambient orb */}
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(196,150,58,.07) 0%,transparent 70%)",
          top:"-10%", right:"-8%", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1260, margin:"0 auto", padding:"64px 28px", width:"100%",
          display:"grid", gridTemplateColumns:"1fr 1.08fr", gap:52, alignItems:"center" }} className="hgrid">

          {/* ── LEFT: Headline ── */}
          <div>
            <div className="fu" style={{ display:"inline-flex", gap:7, alignItems:"center",
              border:`1px solid rgba(196,150,58,.2)`, padding:"6px 16px", marginBottom:24,
              fontSize:10, letterSpacing:".28em", color:T.gold, textTransform:"uppercase" }}>
              <Sparkles size={10}/> AI Portrait Studio
            </div>

            <h1 className="fu" style={{ animationDelay:".08s",
              fontFamily:"'Cormorant Garamond',serif", fontWeight:700, lineHeight:.9, marginBottom:20 }}>
              <span style={{ fontSize:"clamp(46px,6.5vw,82px)", color:T.cream, display:"block" }}>
                Upload a Photo.
              </span>
              <span style={{ fontSize:"clamp(46px,6.5vw,82px)", display:"block" }}>
                <span className="gold-text">Get Back a</span>
              </span>
              <span style={{ fontSize:"clamp(46px,6.5vw,82px)", color:T.cream, display:"block", fontStyle:"italic" }}>
                Masterpiece.
              </span>
            </h1>

            <p className="fu" style={{ animationDelay:".18s", fontSize:15, color:T.muted,
              lineHeight:1.8, marginBottom:28, maxWidth:400 }}>
              Turn photos of your pets, babies, couples, or family into timeless AI portraits in seconds.
            </p>

            {/* trust micro-line */}
            <div className="fu" style={{ animationDelay:".28s",
              display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:36 }}>
              <Stars n={5}/>
              <span style={{ fontSize:12, color:T.muted }}>
                <strong style={{ color:T.cream }}>4.9★ rated</strong>
                {" · "}Thousands of portraits created
                {" · "}Digital downloads + gift-ready prints
              </span>
            </div>

            {/* style preview row */}
            <div className="fu" style={{ animationDelay:".38s", display:"flex", gap:6, alignItems:"center" }}>
              {STYLES.slice(0,5).map(s => (
                <div key={s.id} style={{ width:46, height:58, overflow:"hidden",
                  borderRadius:4, border:`1px solid ${T.border}`, flexShrink:0, position:"relative", cursor:"pointer" }}
                  onClick={() => pickStyleAndScroll(s.id)}>
                  <img src={s.preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover",
                    opacity: styles.includes(s.id) ? 1 : .55, transition:"opacity .25s" }}/>
                  {styles.includes(s.id) && (
                    <div style={{ position:"absolute", top:3, right:3, width:12, height:12,
                      background:T.gold, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Check size={7} color={T.bg}/>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ width:46, height:58, borderRadius:4, border:`1px solid ${T.border}`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }}
                onClick={scrollToHero}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.muted }}>+1</span>
              </div>
              <span style={{ fontSize:11, color:T.dim, paddingLeft:4 }}>6 styles at once</span>
            </div>
          </div>

          {/* ── RIGHT: BUILDER CARD ── */}
          <div className="si" style={{ animationDelay:".1s" }}>
            <div style={{
              background:T.sur, border:`1px solid ${T.border}`, padding:"28px 24px",
              position:"relative",
              boxShadow:"0 48px 120px rgba(0,0,0,.7), inset 0 1px 0 rgba(196,150,58,.08)",
            }}>
              {/* gold top accent */}
              <div style={{ position:"absolute", top:0, left:"18%", right:"18%", height:1,
                background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

              {/* Step progress */}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:22 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div className={`sdot ${step>n?"done":step===n?"active":"todo"}`}/>
                    {n<4 && <div style={{ width:22, height:1, background:step>n?T.gold:T.border, transition:"background .4s" }}/>}
                  </div>
                ))}
                <span style={{ fontSize:10, letterSpacing:".14em", color:T.muted, marginLeft:6, textTransform:"uppercase" }}>
                  {["Category","Upload","Styles","Generate"][step-1]}
                </span>
              </div>

              {/* ─ STEP 1: CATEGORY ─ */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:".2em", color:step>=1?T.gold:T.dim,
                  textTransform:"uppercase", fontWeight:500, marginBottom:10, transition:"color .3s" }}>
                  01 — Who is this for?
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {CATS.map(c => (
                    <button key={c.id} className={`chip ${cat===c.id?"on":""}`} onClick={() => setCat(c.id)}>
                      <span style={{ fontSize:13 }}>{c.emoji}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ STEP 2: UPLOAD ─ */}
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:".2em", color:cat?T.gold:T.dim,
                  textTransform:"uppercase", fontWeight:500, marginBottom:10, transition:"color .3s" }}>
                  02 — Upload a Photo
                </div>
                {!photo ? (
                  <div className={`dz ${drag?"drag":""}`} style={{ borderRadius:8, padding:"30px 20px" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}>
                    <div style={{ width:44, height:44, background:"rgba(255,255,255,.04)",
                      border:`1px solid ${T.border}`, borderRadius:9, display:"flex", alignItems:"center",
                      justifyContent:"center", margin:"0 auto 12px", position:"relative" }}>
                      <Upload size={18} color={T.muted}/>
                      <div style={{ position:"absolute", top:-6, right:-6, width:17, height:17,
                        background:T.gold, borderRadius:"50%", display:"flex", alignItems:"center",
                        justifyContent:"center", fontSize:13, fontWeight:700, color:T.bg, lineHeight:1 }}>+</div>
                    </div>
                    <p style={{ fontSize:13, color:T.cream, marginBottom:5 }}>Drop your photo here</p>
                    <p style={{ fontSize:11, color:T.muted, lineHeight:1.6 }}>
                      Upload a clear photo · Best results with good lighting and visible faces
                    </p>
                    {err && (
                      <div style={{ marginTop:10, display:"flex", gap:6, alignItems:"center",
                        justifyContent:"center", color:"#E06060", fontSize:12 }}>
                        <AlertCircle size={12}/>{err}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ position:"relative", borderRadius:8, overflow:"hidden", height:120,
                    border:`1px solid ${T.bGold}` }}>
                    <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <div style={{ position:"absolute", inset:0,
                      background:"linear-gradient(to top,rgba(7,6,10,.8) 0%,transparent 55%)" }}/>
                    <div style={{ position:"absolute", bottom:9, left:12,
                      display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background:"#5CB87A" }}/>
                      <span style={{ fontSize:12, color:T.cream }}>Photo ready</span>
                    </div>
                    <button onClick={() => setPhoto(null)} style={{ position:"absolute", top:8, right:8,
                      width:26, height:26, background:"rgba(7,6,10,.85)", border:`1px solid ${T.border}`,
                      borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                      cursor:"pointer" }}>
                      <X size={11} color={T.muted}/>
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
                  onChange={e => loadFile(e.target.files[0])}/>
              </div>

              {/* ─ STEP 3: STYLES ─ */}
              <div style={{ marginBottom:22 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ fontSize:10, letterSpacing:".2em",
                    color:cat&&photo?T.gold:T.dim, textTransform:"uppercase", fontWeight:500, transition:"color .3s" }}>
                    03 — Choose Styles
                  </div>
                  <button onClick={() => setStyles(styles.length===STYLES.length?[]:STYLES.map(s=>s.id))}
                    style={{ fontSize:10, color:T.muted, background:"none", border:"none", cursor:"pointer",
                      letterSpacing:".08em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>
                    {styles.length===STYLES.length?"Deselect All":"Select All"}
                  </button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {STYLES.map(s => (
                    <button key={s.id} className={`chip ${styles.includes(s.id)?"on":""}`}
                      onClick={() => toggleStyle(s.id)}>
                      {styles.includes(s.id) && <Check size={9} color={T.gold}/>}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ GENERATE ─ */}
              <button className="btn-gold" disabled={!canGo}
                style={{ width:"100%", padding:"17px", fontSize:13, borderRadius:6,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                  animation: canGo ? "glow 2s infinite" : "none" }}
                onClick={() => onGenerate({ cat, photo, styles })}>
                <Wand2 size={15}/>
                {!cat     ? "Choose a Category to Begin"
                : !photo  ? "Upload a Photo"
                : styles.length===0 ? "Select at Least One Style"
                : `Generate My ${CATS.find(c=>c.id===cat)?.label} Portraits`}
              </button>

              <p style={{ textAlign:"center", fontSize:11, color:T.dim, marginTop:12 }}>
                No subscription. Free watermarked preview before purchase.
              </p>
            </div>
          </div>
        </div>

        <div className="flt" style={{ position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)" }}>
          <ChevronDown size={14} color={T.dim}/>
        </div>
      </section>

      {/* ══ STYLE EXAMPLES ═══════════════════════════════════ */}
      <section style={{ padding:"100px 28px", background:T.sur }}>
        <div style={{ maxWidth:1260, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <SectionLabel>The Styles</SectionLabel>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,5vw,58px)",
              fontWeight:700, color:T.cream, lineHeight:1, marginBottom:14 }}>
              Six Styles. One Upload. <em style={{ fontStyle:"italic", color:T.gold }}>All Yours.</em>
            </h2>
            <p style={{ color:T.muted, fontSize:14, maxWidth:420, margin:"0 auto 20px", lineHeight:1.8 }}>
              Every session generates all selected styles simultaneously.
              Click any style to add it to your creation.
            </p>
            <Rule/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }} className="stgrid">
            {STYLES.map((s, i) => (
              <div key={s.id} className="ptile"
                style={{ height: i===0||i===3 ? 420 : 340, borderRadius:6, cursor:"pointer" }}
                onClick={() => pickStyleAndScroll(s.id)}>
                <img src={s.preview} alt={s.label}/>
                {/* sample watermark */}
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                  justifyContent:"center", pointerEvents:"none" }}>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,.18)", letterSpacing:".26em",
                    textTransform:"uppercase", transform:"rotate(-20deg)", whiteSpace:"nowrap",
                    fontFamily:"'DM Sans',sans-serif" }}>DIGITAL PHOTOS</span>
                </div>
                <div style={{ position:"absolute", inset:0,
                  background:"linear-gradient(to top,rgba(7,6,10,.92) 0%,transparent 52%)", borderRadius:6 }}/>
                {/* selected indicator */}
                {styles.includes(s.id) && (
                  <div style={{ position:"absolute", top:10, right:10, width:22, height:22,
                    background:T.gold, borderRadius:"50%", display:"flex", alignItems:"center",
                    justifyContent:"center" }}>
                    <Check size={11} color={T.bg}/>
                  </div>
                )}
                <div style={{ position:"absolute", bottom:14, left:16, right:16 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                    fontSize:22, color:T.cream, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{s.desc}</div>
                  <div style={{ fontSize:10, color:T.gold, marginTop:6, letterSpacing:".1em" }}>
                    Click to add this style →
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:40 }}>
            <button className="btn-gold" style={{ padding:"15px 40px", fontSize:12, borderRadius:6 }}
              onClick={scrollToHero}>
              Start Creating — All 6 Styles Free Preview
            </button>
            <p style={{ color:T.dim, fontSize:12, marginTop:10 }}>
              Watermark removed on purchase · Preview in 2–5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* ══ BEFORE / AFTER ══════════════════════════════════ */}
      <section style={{ padding:"100px 28px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <SectionLabel>Transformations</SectionLabel>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,54px)",
              fontWeight:700, color:T.cream, lineHeight:1 }}>
              Real Photos. <em style={{ fontStyle:"italic", color:T.gold }}>Real Results.</em>
            </h2>
            <p style={{ color:T.muted, fontSize:13, marginTop:10 }}>
              Drag the slider · One upload unlocks multiple portrait styles
            </p>
          </div>

          <div ref={baRef} style={{ height:480, borderRadius:8, position:"relative",
            overflow:"hidden", cursor:"ew-resize", userSelect:"none",
            border:`1px solid ${T.border}` }}
            onMouseDown={() => setBaDown(true)}
            onMouseUp={() => setBaDown(false)}
            onMouseLeave={() => setBaDown(false)}
            onMouseMove={e => { if(baDown) moveBA(e.clientX); }}
            onTouchMove={e => moveBA(e.touches[0].clientX)}>
            {/* Before */}
            <img src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=900&h=480&fit=crop"
              alt="Before" style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:"cover", borderRadius:8 }}/>
            {/* After */}
            <div style={{ position:"absolute", inset:0, clipPath:`inset(0 ${100-baX}% 0 0)` }}>
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=480&fit=crop"
                alt="After" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }}/>
            </div>
            {/* Handle */}
            <div style={{ position:"absolute", top:0, bottom:0, left:`${baX}%`,
              width:2, background:T.gold }}>
              <div style={{ position:"absolute", top:"50%", left:"50%",
                transform:"translate(-50%,-50%)", width:38, height:38, borderRadius:"50%",
                background:T.gold, display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
                <ChevronRight size={11} color={T.bg} style={{ marginLeft:1 }}/>
              </div>
            </div>
            <div style={{ position:"absolute", top:12, left:14, fontSize:10,
              letterSpacing:".2em", textTransform:"uppercase",
              background:"rgba(7,6,10,.75)", color:T.muted, padding:"4px 12px", borderRadius:2 }}>
              Original
            </div>
            <div style={{ position:"absolute", top:12, right:14, fontSize:10,
              letterSpacing:".2em", textTransform:"uppercase",
              background:`rgba(196,150,58,.85)`, color:T.bg,
              padding:"4px 12px", fontWeight:600, borderRadius:2 }}>
              Royal Portrait
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══════════════════════════════════════ */}
      <section style={{ padding:"56px 28px", background:T.sur,
        borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:920, margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, textAlign:"center" }}
          className="stgrid">
          {[
            { icon:"★", value:"4.9 / 5.0", label:"Average Rating" },
            { icon:"✦", value:"10,000+",   label:"Portraits Created" },
            { icon:"🔒", value:"Secure",    label:"Checkout" },
            { icon:"📦", value:"Digital + Print", label:"Delivery Options" },
          ].map((t,i) => (
            <div key={i} style={{ padding:"20px 12px", border:`1px solid ${T.border}`, borderRadius:6 }}>
              <div style={{ fontSize:20, marginBottom:8 }}>{t.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22,
                color:T.cream, fontWeight:700, marginBottom:4 }}>{t.value}</div>
              <div style={{ fontSize:11, color:T.muted, letterSpacing:".1em" }}>{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════ */}
      <section style={{ padding:"100px 28px", textAlign:"center",
        background:`linear-gradient(135deg, rgba(196,150,58,.09) 0%, rgba(60,40,5,.06) 100%)`,
        borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:620, margin:"0 auto" }}>
          <SectionLabel>Start Creating</SectionLabel>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(36px,6vw,72px)", fontWeight:700, fontStyle:"italic",
            color:T.cream, lineHeight:.95, marginBottom:18 }}>
            Ready to See<br/>Your Portrait?
          </h2>
          <p style={{ color:T.muted, fontSize:15, lineHeight:1.8, maxWidth:420,
            margin:"0 auto 40px" }}>
            From unforgettable gifts to timeless keepsakes, your masterpiece starts with one photo.
          </p>
          <button className="btn-gold" onClick={scrollToHero}
            style={{ padding:"19px 58px", fontSize:13, borderRadius:6,
              display:"inline-flex", alignItems:"center", gap:10 }}>
            <Upload size={15}/> Upload a Photo
          </button>
          <div style={{ display:"flex", gap:22, justifyContent:"center", marginTop:20, flexWrap:"wrap" }}>
            {[[Lock,"No subscription"],[RefreshCw,"30-day guarantee"],[Truck,"Ships worldwide"]].map(([Icon,l]) => (
              <div key={l} style={{ display:"flex", gap:5, alignItems:"center",
                fontSize:11, color:T.dim }}><Icon size={10}/>{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"32px 28px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1260, margin:"0 auto",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:14 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.cream }}>
            Digital<span style={{ color:T.gold }}>Photos</span>
            <sup style={{ fontSize:8, color:T.dim, marginLeft:2 }}>™</sup>
          </div>
          <div style={{ fontSize:11, color:T.dim }}>© 2025 Digital Photos™. All rights reserved.</div>
          <div style={{ fontSize:11, color:T.dim }}>AI-Powered · Fine Art Quality · Yours Forever</div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCREEN: GENERATING
───────────────────────────────────────────────────────────── */
function GenScreen({ selectedStyles, onDone }) {
  const [pct,  setPct]  = useState(0);
  const [msg,  setMsg]  = useState(0);
  const [done, setDone] = useState([]);
  const active = STYLES.filter(s => selectedStyles.includes(s.id));

  useEffect(() => {
    const total = 9000, tick = 85; let t = 0;
    const iv = setInterval(() => {
      t += tick;
      const p = Math.min((t / total) * 100, 100);
      setPct(p);
      setMsg(Math.min(Math.floor((p/100) * GEN_MSGS.length), GEN_MSGS.length-1));
      setDone(active.slice(0, Math.floor((p/100) * active.length)));
      if (p >= 100) { clearInterval(iv); setTimeout(onDone, 600); }
    }, tick);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, marginBottom:48 }}>
        Digital<span style={{ color:T.gold }}>Photos</span>
        <sup style={{ fontSize:8, color:T.dim }}>™</sup>
      </div>

      <div style={{ position:"relative", width:68, height:68, marginBottom:28 }}>
        <div style={{ position:"absolute", inset:0, border:`1.5px solid ${T.border}`, borderRadius:"50%" }}/>
        <div className="spn" style={{ position:"absolute", inset:0,
          border:"2px solid transparent", borderTopColor:T.gold, borderRadius:"50%" }}/>
        <div style={{ position:"absolute", inset:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Wand2 size={20} color={T.gold}/>
        </div>
      </div>

      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(26px,5vw,44px)",
        fontWeight:700, fontStyle:"italic", color:T.cream, textAlign:"center", marginBottom:10 }}>
        Creating Your Masterpiece
      </h2>
      <p style={{ color:T.muted, fontSize:14, marginBottom:38, textAlign:"center", minHeight:22 }}>
        {GEN_MSGS[msg]}
      </p>

      <div style={{ width:"100%", maxWidth:420, height:2, background:T.border,
        borderRadius:2, overflow:"hidden", marginBottom:8 }}>
        <div style={{ height:"100%", background:`linear-gradient(90deg,${T.gold},${T.goldLt})`,
          width:`${pct}%`, transition:"width .15s ease" }}/>
      </div>
      <p style={{ fontSize:12, color:T.gold, marginBottom:44 }}>{Math.round(pct)}%</p>

      {done.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", maxWidth:520 }}>
          {done.map((s, i) => (
            <div key={i} className="bi" style={{ animationDelay:`${i*.07}s`, width:76, height:96,
              borderRadius:5, overflow:"hidden", border:`1px solid ${T.border}`,
              position:"relative", flexShrink:0 }}>
              <img src={s.preview} alt="" style={{ width:"100%", height:"100%",
                objectFit:"cover", opacity:.45, display:"block" }}/>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                justifyContent:"center" }}>
                <span style={{ fontSize:8, color:"rgba(255,255,255,.22)", letterSpacing:".2em",
                  textTransform:"uppercase", transform:"rotate(-20deg)", whiteSpace:"nowrap",
                  fontFamily:"'DM Sans',sans-serif" }}>DP™</span>
              </div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0,
                background:"rgba(7,6,10,.88)", padding:"4px", textAlign:"center",
                fontSize:8, color:"rgba(255,255,255,.45)" }}>{s.label}</div>
              <div style={{ position:"absolute", top:5, right:5, width:15, height:15,
                background:T.gold, borderRadius:"50%", display:"flex",
                alignItems:"center", justifyContent:"center" }}>
                <Check size={8} color={T.bg}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCREEN: PREVIEW PAGE  (monetization)
───────────────────────────────────────────────────────────── */
function PreviewScreen({ cat, photo, selectedStyles, onBack }) {
  const [sel,      setSel]      = useState(0);
  const [priceSel, setPriceSel] = useState("digital");
  const [printSz,  setPrintSz]  = useState('8"×10"');
  const [canvSz,   setCanvSz]   = useState('12"×16"');
  const [timer,    setTimer]    = useState(19*60+18);
  const [liked,    setLiked]    = useState([]);
  const [openAc,   setOpenAc]   = useState(null);

  const catLabel  = CATS.find(c=>c.id===cat)?.label || "Portrait";
  const active    = STYLES.filter(s => selectedStyles.includes(s.id));
  const mainStyle = active[sel] || STYLES[0];

  useEffect(() => {
    const t = setInterval(() => setTimer(p => Math.max(0, p-1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s =>
    `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, paddingBottom:100 }}>

      {/* ── sticky header ── */}
      <header style={{ position:"sticky", top:0, zIndex:100,
        background:"rgba(7,6,10,.97)", backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${T.border}` }}>
        <div style={{ padding:"6px 20px", borderBottom:`1px solid ${T.border}`,
          display:"flex", gap:20, alignItems:"center", justifyContent:"center",
          fontSize:11, color:T.muted, flexWrap:"wrap" }}>
          <span style={{ display:"flex", gap:5, alignItems:"center" }}>
            <Truck size={10} color={T.gold}/>Free Shipping on Prints
          </span>
          <span>·</span>
          <span style={{ display:"flex", gap:5, alignItems:"center" }}>
            <Stars n={5}/> Rated 4.9
          </span>
          <span>·</span>
          <span>#1 on Trustpilot</span>
        </div>
        <div style={{ padding:"9px 22px", display:"flex",
          alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.cream }}>
            Digital<span style={{ color:T.gold }}>Photos</span>
          </div>
          <div style={{ display:"flex", gap:5, alignItems:"center", fontSize:12, color:T.dim }}>
            {["Upload","Preview","Download or Order Print"].map((s,i) => (
              <span key={s} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ color:i===1?T.cream:T.muted }}>{s}</span>
                {i<2 && <ChevronRight size={10} color={T.dim}/>}
              </span>
            ))}
          </div>
          <button className="btn-ghost" style={{ padding:"7px 14px", borderRadius:4, fontSize:11 }}
            onClick={onBack}>← Retry</button>
        </div>
      </header>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"24px 18px 60px" }}>

        <h1 className="fu" style={{ fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(26px,5vw,50px)", fontWeight:700, textAlign:"center",
          color:T.cream, marginBottom:24 }}>
          Your Portraits Are Ready
        </h1>

        {/* ── watermarked portrait ── */}
        <div style={{ position:"relative", borderRadius:10, overflow:"hidden",
          marginBottom:10, background:T.sur, border:`1px solid ${T.border}` }}>
          <img src={photo || mainStyle.preview} alt="Preview"
            style={{ width:"100%", maxHeight:520, objectFit:"cover", display:"block",
              filter:"brightness(.84) saturate(1.1)" }}/>
          <Watermark/>
          <button onClick={onBack} style={{ position:"absolute", top:12, right:12,
            background:"rgba(7,6,10,.82)", border:`1px solid ${T.border}`, padding:"7px 14px",
            borderRadius:6, cursor:"pointer", display:"flex", gap:6, alignItems:"center",
            fontSize:11, color:T.cream, backdropFilter:"blur(8px)", fontFamily:"'DM Sans',sans-serif" }}>
            <RefreshCw size={11}/> Retry or Edit
          </button>
          <button onClick={() => setLiked(p=>p.includes(sel)?p.filter(i=>i!==sel):[...p,sel])}
            style={{ position:"absolute", top:12, left:12, width:36, height:36,
              background:"rgba(7,6,10,.82)", border:`1px solid ${T.border}`, borderRadius:"50%",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Heart size={14} color={liked.includes(sel)?T.gold:T.muted}
              fill={liked.includes(sel)?T.gold:"none"}/>
          </button>
          <div style={{ position:"absolute", bottom:12, left:14,
            background:"rgba(7,6,10,.82)", border:`1px solid rgba(196,150,58,.22)`,
            padding:"5px 12px", borderRadius:4, backdropFilter:"blur(8px)" }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
              fontSize:15, color:T.cream }}>{mainStyle.label} Portrait</span>
          </div>
        </div>

        {/* style thumbs */}
        <div className="tstrip" style={{ marginBottom:8 }}>
          {active.map((s,i) => (
            <div key={i} onClick={() => setSel(i)} style={{ width:68, height:86, borderRadius:5,
              overflow:"hidden", cursor:"pointer", flexShrink:0, position:"relative",
              border:`2px solid ${sel===i?T.gold:T.border}`,
              opacity:sel===i?1:.5, transition:"all .2s" }}>
              <img src={s.preview} alt="" style={{ width:"100%", height:"100%",
                objectFit:"cover", display:"block" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, right:0,
                background:"rgba(7,6,10,.88)", padding:"3px 4px",
                fontSize:7, color:"rgba(255,255,255,.55)", textAlign:"center" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:11, color:T.dim, textAlign:"center", marginBottom:28 }}>
          {active.length} styles generated · Watermark removed on purchase
        </p>

        {/* ── format header ── */}
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(20px,4vw,34px)", fontWeight:700,
          textAlign:"center", color:T.cream, marginBottom:16 }}>
          Choose Your Format
        </h2>

        {/* ── 3 price cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>

          {/* Digital */}
          <div className={`pcard${priceSel==="digital"?" sel":""}`}
            style={{ borderRadius:8, padding:"20px 16px" }} onClick={() => setPriceSel("digital")}>
            <div style={{ background:"#2DD4BF", color:T.bg, fontSize:9, fontWeight:700,
              letterSpacing:".14em", padding:"3px 10px", borderRadius:50,
              display:"inline-block", marginBottom:12 }}>Most Popular</div>
            <Download size={15} color={T.muted} style={{ display:"block", marginBottom:10 }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20,
              color:T.cream, fontWeight:700, marginBottom:6 }}>Instant Download</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:13, color:T.dim, textDecoration:"line-through" }}>$99</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",
                fontSize:36, fontWeight:700, color:T.cream }}>$29</span>
            </div>
            <div style={{ display:"flex", gap:5, alignItems:"center",
              fontSize:11, color:T.gold, marginBottom:12 }}>
              <Clock size={10}/>Expires {fmt(timer)}
            </div>
            <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:12 }}>
              High-resolution files delivered to your inbox instantly.
            </p>
            <div style={{ height:1, background:T.border, marginBottom:12 }}/>
            {["No Watermark","Instant Delivery",`All ${active.length} Styles`,"Personal License"].map(f => (
              <div key={f} style={{ display:"flex", gap:7, alignItems:"flex-start",
                fontSize:11, color:T.muted, marginBottom:7 }}>
                <Check size={10} color="#2DD4BF" style={{ marginTop:2, flexShrink:0 }}/>{f}
              </div>
            ))}
            <button className="btn-gold" style={{ width:"100%", padding:"13px",
              borderRadius:5, fontSize:12, marginTop:14 }}>
              Download Now
            </button>
          </div>

          {/* Print */}
          <div className={`pcard${priceSel==="print"?" sel":""}`}
            style={{ borderRadius:8, padding:"20px 16px" }} onClick={() => setPriceSel("print")}>
            <div style={{ height:22, marginBottom:12 }}/>
            <Printer size={15} color={T.muted} style={{ display:"block", marginBottom:10 }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20,
              color:T.cream, fontWeight:700, marginBottom:6 }}>Fine Art Print</div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36,
              fontWeight:700, color:T.cream, display:"block", marginBottom:12 }}>$89</span>
            <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:12 }}>
              Museum-quality archival paper. Fade-resistant inks. Made to last.
            </p>
            <div style={{ fontSize:10, letterSpacing:".12em", color:T.muted,
              textTransform:"uppercase", marginBottom:7 }}>Choose Size</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
              {['8"×10"','11"×14"'].map(sz => (
                <button key={sz} className={`szb ${printSz===sz?"szon":"szoff"}`}
                  onClick={e=>{e.stopPropagation();setPrintSz(sz)}}>{sz}</button>
              ))}
            </div>
            <div style={{ height:1, background:T.border, marginBottom:12 }}/>
            {["Archival paper","Fade-resistant inks","Lasts decades"].map(f => (
              <div key={f} style={{ display:"flex", gap:7, alignItems:"flex-start",
                fontSize:11, color:T.muted, marginBottom:7 }}>
                <Check size={10} color="#2DD4BF" style={{ marginTop:2, flexShrink:0 }}/>{f}
              </div>
            ))}
            <div style={{ display:"flex", gap:5, alignItems:"center",
              fontSize:11, color:"#2DD4BF", margin:"4px 0 12px" }}>
              <Truck size={10}/>Free Shipping
            </div>
            <button className="btn-gold" style={{ width:"100%", padding:"13px",
              borderRadius:5, fontSize:12 }}>Order Print</button>
            <p style={{ fontSize:10, color:"#2DD4BF", textAlign:"center", marginTop:8 }}>
              + Digital download included
            </p>
          </div>

          {/* Canvas */}
          <div className={`pcard${priceSel==="canvas"?" sel":""}`}
            style={{ borderRadius:8, padding:"20px 16px",
              borderColor:"rgba(196,150,58,.28)", background:"rgba(196,150,58,.03)" }}
            onClick={() => setPriceSel("canvas")}>
            <div style={{ background:"linear-gradient(135deg,#7C3AED,#9F6BE3)", color:"#fff",
              fontSize:9, fontWeight:700, letterSpacing:".12em", padding:"3px 10px",
              borderRadius:50, display:"inline-block", marginBottom:12 }}>
              🎁 Perfect Gift
            </div>
            <FrameIcon size={15} color={T.muted} style={{ display:"block", marginBottom:10 }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20,
              color:T.cream, fontWeight:700, marginBottom:6 }}>Canvas Print</div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36,
              fontWeight:700, color:T.cream, display:"block", marginBottom:12 }}>$299</span>
            <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:12 }}>
              Gallery-quality canvas on wood. Arrives ready to hang.
            </p>
            <div style={{ fontSize:10, letterSpacing:".12em", color:T.muted,
              textTransform:"uppercase", marginBottom:7 }}>Choose Size</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
              {['12"×16"','16"×20"','24"×30"'].map(sz => (
                <button key={sz} className={`szb ${canvSz===sz?"szon":"szoff"}`}
                  style={{ borderColor:canvSz===sz?T.gold:T.border,
                    color:canvSz===sz?T.gold:T.muted,
                    background:canvSz===sz?"rgba(196,150,58,.1)":"transparent" }}
                  onClick={e=>{e.stopPropagation();setCanvSz(sz)}}>{sz}</button>
              ))}
            </div>
            <div style={{ height:1, background:T.border, marginBottom:12 }}/>
            {["Ready to hang","1.25\" cotton canvas","Mounting included"].map(f => (
              <div key={f} style={{ display:"flex", gap:7, alignItems:"flex-start",
                fontSize:11, color:T.muted, marginBottom:7 }}>
                <Check size={10} color={T.gold} style={{ marginTop:2, flexShrink:0 }}/>{f}
              </div>
            ))}
            <div style={{ display:"flex", gap:5, alignItems:"center",
              fontSize:11, color:T.gold, margin:"4px 0 12px" }}>
              <Truck size={10}/>Free Shipping
            </div>
            <button className="btn-gold" style={{ width:"100%", padding:"13px",
              borderRadius:5, fontSize:12 }}>Order Canvas</button>
            <p style={{ fontSize:10, color:T.gold, textAlign:"center", marginTop:8 }}>
              + Digital download included
            </p>
          </div>
        </div>

        {/* social proof */}
        <div style={{ textAlign:"center", padding:"14px", border:`1px solid ${T.border}`,
          borderRadius:8, background:T.sur, marginBottom:20 }}>
          <p style={{ fontSize:13, color:T.muted }}>
            Chosen by <strong style={{ color:T.cream }}>10,000+</strong> {catLabel.toLowerCase()} owners
          </p>
          <div style={{ display:"flex", justifyContent:"center", marginTop:8 }}><Stars n={5}/></div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
          <button className="btn-ghost" style={{ padding:"12px", borderRadius:6,
            display:"flex", gap:8, alignItems:"center", justifyContent:"center", fontSize:13 }}>
            <Copy size={14}/>Save for Later
          </button>
          <button className="btn-ghost" style={{ padding:"12px", borderRadius:6,
            display:"flex", gap:8, alignItems:"center", justifyContent:"center", fontSize:13,
            borderColor:"rgba(196,150,58,.3)", color:T.gold }}>
            <Share2 size={14}/>Share
          </button>
        </div>

        {/* accordion */}
        {[
          { title:"What Customers Say", sub:"Rated Excellent on Trustpilot ★★★★★",
            body: <div>{[
              { n:"Sarah M.", t:`The ${catLabel} portrait is absolutely stunning. More compliments than any real art I own.` },
              { n:"Marcus T.", t:"Ordered 3 canvases for the holidays. Everyone was floored." },
            ].map(r => (
              <div key={r.n} style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <Stars n={5}/>
                <p style={{ fontSize:12, color:T.muted, fontStyle:"italic", margin:"6px 0 4px" }}>"{r.t}"</p>
                <p style={{ fontSize:11, color:T.dim }}>— {r.n}</p>
              </div>
            ))}</div>
          },
          { title:"Need Support?", sub:"We respond within 2 hours.",
            body: <p style={{ fontSize:13, color:T.muted, paddingTop:8, lineHeight:1.7 }}>
              Email us at support@digitalphotos.app — we're here to help.
            </p>
          },
        ].map((ac, idx) => (
          <div key={idx} style={{ borderBottom:`1px solid ${T.border}` }}>
            <button onClick={() => setOpenAc(openAc===idx?null:idx)}
              style={{ width:"100%", background:"none", border:"none", cursor:"pointer",
                padding:"17px 0", display:"flex", justifyContent:"space-between",
                alignItems:"center", fontFamily:"'DM Sans',sans-serif" }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:14, color:T.cream, fontWeight:400 }}>{ac.title}</div>
                {ac.sub && <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{ac.sub}</div>}
              </div>
              <ChevronDown size={14} color={T.muted} style={{ transform:openAc===idx?"rotate(180deg)":"none",
                transition:"transform .3s", flexShrink:0 }}/>
            </button>
            {openAc===idx && <div className="fi" style={{ paddingBottom:16 }}>{ac.body}</div>}
          </div>
        ))}

        <div style={{ textAlign:"center", padding:"28px 0 0" }}>
          <p style={{ fontSize:10, letterSpacing:".25em", color:T.dim,
            textTransform:"uppercase", marginBottom:16 }}>As Seen On</p>
          <div style={{ display:"flex", gap:28, justifyContent:"center", flexWrap:"wrap" }}>
            {["The New York Times","Forbes","ELLE","Vogue"].map(p => (
              <span key={p} style={{ fontSize:12, color:T.dim, letterSpacing:".12em",
                fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* sticky purchase CTA */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0,
        background:"rgba(7,6,10,.97)", backdropFilter:"blur(20px)",
        borderTop:`1px solid ${T.border}`, padding:"10px 20px",
        display:"flex", gap:10, alignItems:"center", zIndex:50 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:T.muted }}>Instant Digital Download</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif",
            fontSize:24, color:T.cream, fontWeight:700, lineHeight:1.1 }}>
            $29{" "}
            <span style={{ fontSize:13, color:T.dim, textDecoration:"line-through",
              fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>$99</span>
          </div>
        </div>
        <button className="btn-gold" style={{ padding:"14px 26px", borderRadius:7,
          fontSize:13, flexShrink:0, display:"flex", gap:8, alignItems:"center",
          animation:"glow 2s infinite" }}>
          <Lock size={13}/>Unlock My Portraits
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────── */
export default function App() {
  const [screen,  setScreen]  = useState("home");
  const [session, setSession] = useState({ cat:"", photo:null, styles:[] });

  const handleGenerate = useCallback(({ cat, photo, styles }) => {
    setSession({ cat, photo, styles });
    setScreen("gen");
  }, []);

  return (
    <>
      <style>{G}</style>
      {screen==="home"    && <HomePage    onGenerate={handleGenerate}/>}
      {screen==="gen"     && <GenScreen   selectedStyles={session.styles} onDone={() => setScreen("preview")}/>}
      {screen==="preview" && <PreviewScreen cat={session.cat} photo={session.photo}
                               selectedStyles={session.styles} onBack={() => setScreen("home")}/>}
    </>
  );
}
