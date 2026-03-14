// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate }  from "react-router-dom";
import { useSession }   from "@/context/SessionContext";
import {
  Upload, X, Check, ChevronRight, ChevronDown, Download,
  Printer, FrameIcon, Share2, Heart, Truck, RefreshCw,
  Lock, Wand2, Sparkles, AlertCircle, Copy, Gift,
  ArrowRight, Shield, Star, Instagram, Facebook
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  bg:"#07060A",sur:"#0D0C11",card:"#111019",
  border:"#1E1A22",bGold:"rgba(196,150,58,.36)",
  cream:"#EAE6DF",muted:"#7A7068",dim:"#38342E",
  gold:"#C4963A",goldLt:"#DDB04E",goldBg:"rgba(196,150,58,.07)",
  teal:"#2DD4BF",purple:"#8B5CF6",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#07060A;color:#EAE6DF;font-family:'DM Sans',sans-serif;font-weight:300;overflow-x:hidden}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:#C4963A}

@keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn  {from{opacity:0}to{opacity:1}}
@keyframes scaleIn {from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer {0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes spinR   {from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes drift   {0%{transform:translateX(0) rotate(-20deg)}100%{transform:translateX(-50%) rotate(-20deg)}}
@keyframes floatY  {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes glow    {0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,.5)}50%{box-shadow:0 0 0 13px rgba(196,150,58,0)}}
@keyframes buildIn {from{opacity:0;transform:scale(.86) translateY(9px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes slideIn {from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse   {0%,100%{opacity:1}50%{opacity:.6}}

.fu {animation:fadeUp  .58s ease both}
.fi {animation:fadeIn  .38s ease both}
.si {animation:scaleIn .52s cubic-bezier(.23,1,.32,1) both}
.flt{animation:floatY  5s ease-in-out infinite}
.spn{animation:spinR   1.1s linear infinite}
.bi {animation:buildIn .4s cubic-bezier(.23,1,.32,1) both}
.sl {animation:slideIn .4s cubic-bezier(.23,1,.32,1) both}

.gold-text{
  background:linear-gradient(90deg,#C4963A 0%,#F0D070 35%,#C4963A 60%,#A07828 80%,#DDB04E 100%);
  background-size:300% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 5s linear infinite;
}

/* Buttons */
.btn-gold{background:linear-gradient(135deg,#C4963A,#E0B44A 50%,#C4963A);color:#07060A;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;letter-spacing:.07em;text-transform:uppercase;transition:all .28s}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(196,150,58,.45)}
.btn-gold:active{transform:translateY(0)}
.btn-gold:disabled{opacity:.28;cursor:not-allowed;transform:none!important;box-shadow:none!important;animation:none!important}
.btn-ghost{background:transparent;border:1px solid #1E1A22;color:#7A7068;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.07em;text-transform:uppercase;transition:all .25s}
.btn-ghost:hover{border-color:rgba(196,150,58,.45);color:#EAE6DF}
.btn-outline{background:transparent;border:1px solid rgba(196,150,58,.4);color:#C4963A;cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.07em;text-transform:uppercase;transition:all .25s}
.btn-outline:hover{background:rgba(196,150,58,.09);border-color:#C4963A}

/* Chips */
.chip{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:5px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;transition:all .18s;white-space:nowrap;border:1px solid #1E1A22;background:#0D0C11;color:#7A7068;user-select:none}
.chip:hover{border-color:rgba(196,150,58,.4);color:#EAE6DF}
.chip.on{border-color:#C4963A;background:rgba(196,150,58,.1);color:#C4963A;font-weight:500}
.chip.cat.on{border-color:#C4963A;background:rgba(196,150,58,.12);color:#C4963A}

/* Drop zone */
.dz{border:1.5px dashed #2A2322;text-align:center;cursor:pointer;transition:all .28s;background:#09080D;position:relative;overflow:hidden}
.dz:hover,.dz.drag{border-color:rgba(196,150,58,.6);background:rgba(196,150,58,.04)}

/* Cards */
.ptile{position:relative;overflow:hidden;transition:transform .38s cubic-bezier(.23,1,.32,1)}
.ptile:hover{transform:translateY(-5px)}
.ptile img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.76);transition:filter .38s}
.ptile:hover img{filter:brightness(.94)}
.pcard{border:1.5px solid #1E1A22;transition:all .28s cubic-bezier(.23,1,.32,1);cursor:pointer;position:relative;overflow:hidden}
.pcard:hover{transform:translateY(-3px)}
.pcard.sel{border-color:#C4963A;background:rgba(196,150,58,.06)}
.pcard.featured{border-color:rgba(196,150,58,.55);background:rgba(196,150,58,.07)}
.pcard.featured:hover{border-color:#C4963A}

/* Watermark */
.wml{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.wmr{position:absolute;white-space:nowrap;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.2);animation:drift 22s linear infinite;width:200%}

/* Thumb strip */
.tstrip{display:flex;gap:7px;overflow-x:auto;padding-bottom:3px}
.tstrip::-webkit-scrollbar{height:2px}
.tstrip::-webkit-scrollbar-thumb{background:#C4963A}

/* Size button */
.szb{padding:5px 11px;font-size:11px;font-family:'DM Sans',sans-serif;cursor:pointer;border-radius:4px;transition:all .18s}
.szon{border:1px solid #C4963A;background:rgba(196,150,58,.1);color:#C4963A}
.szoff{border:1px solid #1E1A22;background:transparent;color:#7A7068}
.szoff:hover{border-color:rgba(196,150,58,.35);color:#EAE6DF}

/* Teaser */
.teaser-img{width:100%;height:100%;object-fit:cover;transition:opacity .5s ease}

/* Responsive */
@media(max-width:960px){
  .hg{grid-template-columns:1fr!important}
  .hid{display:none!important}
  .sg3{grid-template-columns:repeat(2,1fr)!important}
  .pg3{grid-template-columns:repeat(2,1fr)!important}
  .plangrid{grid-template-columns:1fr!important}
}
@media(max-width:600px){
  .sg3{grid-template-columns:1fr!important}
  .pg3{grid-template-columns:1fr!important}
  .trust4{grid-template-columns:repeat(2,1fr)!important}
}
`;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const CATS = [
  { id:"pets",     label:"Pets",     icon:"🐾" },
  { id:"babies",   label:"Babies",   icon:"🍼" },
  { id:"people",   label:"People",   icon:"👤" },
  { id:"memorial", label:"Memorial", icon:"✦"  },
  { id:"gifts",    label:"Gifts",    icon:"🎁" },
];

const STYLES = [
  { id:"royal",       label:"Royal",       desc:"Regal · Golden Era",       preview:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=520&h=650&fit=crop&q=80" },
  { id:"renaissance", label:"Renaissance", desc:"Old Masters · Rich Tones",  preview:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=520&h=650&fit=crop&q=80" },
  { id:"storybook",   label:"Storybook",   desc:"Whimsical · Illustrated",   preview:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=520&h=650&fit=crop&q=80" },
  { id:"fantasy",     label:"Fantasy",     desc:"Ethereal · Otherworldly",   preview:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=520&h=650&fit=crop&q=80" },
  { id:"cinematic",   label:"Cinematic",   desc:"Moody · Film Quality",      preview:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=520&h=650&fit=crop&q=80" },
  { id:"minimal",     label:"Minimal",     desc:"Clean · Modern Fine Art",   preview:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=520&h=650&fit=crop&q=80" },
];

// Live teaser — one per category, cycles automatically
const TEASERS = [
  { cat:"Pets",     catId:"pets",     style:"Royal",       before:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=380&fit=crop&q=80", after:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=380&fit=crop&q=80"  },
  { cat:"Babies",   catId:"babies",   style:"Storybook",   before:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=380&fit=crop&q=80", after:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=380&fit=crop&q=80"   },
  { cat:"People",   catId:"people",   style:"Cinematic",   before:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=380&fit=crop&q=80", after:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=380&fit=crop&q=80"   },
  { cat:"Memorial", catId:"memorial", style:"Minimal",     before:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=300&h=380&fit=crop&q=80", after:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=300&h=380&fit=crop&q=80"   },
  { cat:"Gifts",    catId:"gifts",    style:"Renaissance", before:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=380&fit=crop&q=80", after:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=380&fit=crop&q=80"   },
];

const PLANS = [
  {
    id:"digital",
    label:"Digital Collection",
    price:29, orig:99,
    badge:null,
    desc:"Instant download, all portraits",
    features:["All portraits · high resolution","Instant digital download","Personal & commercial license","Print-ready files"],
    cta:"Download Now", featured:false,
  },
  {
    id:"bundle",
    label:"Digital + Fine Art Print",
    price:79, orig:149,
    badge:"★ Most Popular",
    desc:"Most customers choose this",
    features:["All portraits · high resolution","Instant digital download","Museum-quality archival print","Fade-resistant inks · gallery paper","Free shipping included"],
    cta:"Get the Bundle", featured:true,
  },
  {
    id:"canvas",
    label:"Gallery Canvas Bundle",
    price:149, orig:299,
    badge:null,
    desc:"The ultimate gift or keepsake",
    features:["All portraits · high resolution","Instant digital download","Gallery-wrapped canvas on wood","Ready to hang · arrives framed","Free shipping included"],
    cta:"Order Canvas", featured:false,
  },
];

const GEN_MSGS = [
  "Analyzing your photo…",
  "Training your personal AI model…",
  "Generating Royal portrait…",
  "Crafting Renaissance composition…",
  "Building Storybook illustration…",
  "Rendering Fantasy atmosphere…",
  "Creating Cinematic mood…",
  "Finishing Minimal fine art…",
  "Adding final details…",
];

/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */
function Stars({ n = 5, size = 14 }) {
  return (
    <span style={{ display:"inline-flex", gap:2 }}>
      {Array(n).fill(0).map((_,i) => (
        <span key={i} style={{ width:size, height:size, background:"#00B67A", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
          <svg viewBox="0 0 12 12" width={size*.58} height={size*.58} fill="#fff"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>
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
          {Array(10).fill("DIGITAL PHOTOS  ·  ").join("")}
        </div>
      ))}
    </div>
  );
}

function SLabel({ children, align="center" }) {
  return <p style={{ fontSize:10, letterSpacing:".32em", textTransform:"uppercase", color:T.gold, fontWeight:500, textAlign:align, marginBottom:9 }}>{children}</p>;
}

function Rule() {
  return <div style={{ width:44, height:1, background:`linear-gradient(90deg,transparent,${T.gold},transparent)`, margin:"0 auto" }}/>;
}

function CheckRow({ label, gold }) {
  return (
    <div style={{ display:"flex", gap:7, alignItems:"flex-start", fontSize:11, color:T.muted, marginBottom:6 }}>
      <Check size={10} color={gold ? T.gold : T.teal} style={{ marginTop:2, flexShrink:0 }}/>
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LIVE TEASER  (animated before→after carousel)
═══════════════════════════════════════════════════════════ */
function LiveTeaser({ activeCat, onCatClick }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  // When user picks a category, jump to matching teaser
  useEffect(() => {
    if (!activeCat) return;
    const match = TEASERS.findIndex(t => t.catId === activeCat);
    if (match >= 0 && match !== idx) { setFading(true); setTimeout(() => { setIdx(match); setFading(false); }, 260); }
  }, [activeCat]);

  // Auto-rotate when no category selected
  useEffect(() => {
    if (activeCat) return;
    const iv = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(p => (p+1) % TEASERS.length); setFading(false); }, 260);
    }, 3200);
    return () => clearInterval(iv);
  }, [activeCat]);

  const cur = TEASERS[idx];

  return (
    <div style={{ marginTop:20 }}>
      <div style={{ fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:T.gold, marginBottom:10 }}>
        What Your Photo Becomes
      </div>

      {/* Before → After */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 28px 1fr", gap:0, alignItems:"center" }}>
        <div style={{ position:"relative", height:148, borderRadius:6, overflow:"hidden", border:`1px solid ${T.border}` }}>
          <img src={cur.before} alt="Before" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.72)", opacity:fading?0:1, transition:"opacity .26s" }}/>
          <div style={{ position:"absolute", bottom:6, left:8, fontSize:9, letterSpacing:".18em", textTransform:"uppercase", color:"rgba(255,255,255,.5)", background:"rgba(7,6,10,.72)", padding:"3px 8px", borderRadius:2 }}>Your Photo</div>
        </div>

        <div style={{ display:"flex", justifyContent:"center" }}>
          <ArrowRight size={14} color={T.gold}/>
        </div>

        <div style={{ position:"relative", height:148, borderRadius:6, overflow:"hidden", border:`1px solid ${T.bGold}` }}>
          <img src={cur.after} alt="After" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(.84) saturate(1.12)", opacity:fading?0:1, transition:"opacity .26s" }}/>
          {/* mini watermark */}
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <span style={{ fontSize:7, color:"rgba(255,255,255,.22)", letterSpacing:".22em", textTransform:"uppercase", transform:"rotate(-20deg)", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>DIGITAL PHOTOS</span>
          </div>
          <div style={{ position:"absolute", bottom:6, right:8, fontSize:9, letterSpacing:".12em", textTransform:"uppercase", color:T.bg, background:`rgba(196,150,58,.9)`, padding:"3px 8px", borderRadius:2, fontWeight:600 }}>{cur.style}</div>
        </div>
      </div>

      {/* Category dots */}
      <div style={{ display:"flex", gap:6, marginTop:10, alignItems:"center" }}>
        {TEASERS.map((t, i) => (
          <button key={i} onClick={() => { onCatClick(t.catId); setFading(true); setTimeout(()=>{setIdx(i);setFading(false);},260); }}
            style={{ padding:0, border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            <div style={{ width:i===idx?18:5, height:5, borderRadius:3, background:i===idx?T.gold:T.dim, transition:"all .3s" }}/>
            {i===idx && <span style={{ fontSize:9, color:T.muted, letterSpacing:".1em" }}>{t.cat}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
function HomePage({ onGenerate }) {
  const [cat,     setCat]     = useState("");
  const [photo,   setPhoto]   = useState(null);
  const [styles,  setStyles]  = useState([]);
  const [drag,    setDrag]    = useState(false);
  const [err,     setErr]     = useState("");
  const [scrolled,setScrolled]= useState(false);
  const [baX,     setBaX]     = useState(50);
  const [baDown,  setBaDown]  = useState(false);

  const heroRef = useRef();
  const fileRef = useRef();
  const baRef   = useRef();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const loadFile = useCallback(f => {
    if (!f?.type?.startsWith("image/")) { setErr("Please upload an image file."); return; }
    setErr("");
    const r = new FileReader();
    r.onload = e => setPhoto(e.target.result);
    r.readAsDataURL(f);
  }, []);

  const toggleStyle = id => setStyles(p => p.includes(id) ? p.filter(s=>s!==id) : [...p, id]);
  const allOn = styles.length === STYLES.length;
  const canGo = cat && photo && styles.length > 0;

  const pickStyleScroll = id => {
    if (!styles.includes(id)) setStyles(p => [...p, id]);
    heroRef.current?.scrollIntoView({ behavior:"smooth" });
  };

  const scrollToHero = () => heroRef.current?.scrollIntoView({ behavior:"smooth" });

  const moveBA = clientX => {
    if (!baRef.current) return;
    const r = baRef.current.getBoundingClientRect();
    setBaX(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };

  const genLabel = () => {
    if (!cat)          return "CREATE MY PORTRAITS";
    if (!photo)        return "Upload a Photo";
    if (!styles.length)return "Select at Least One Style";
    const c = CATS.find(c=>c.id===cat);
    return `Generate My ${c?.label} Portraits`;
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:50,
        display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 26px",
        background:scrolled?"rgba(7,6,10,.97)":"transparent",
        backdropFilter:scrolled?"blur(22px)":"none",
        borderBottom:scrolled?`1px solid ${T.border}`:"none",
        transition:"all .4s" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, fontWeight:600 }}>
          Digital<span style={{ color:T.gold }}>Photos</span>
          <sup style={{ fontSize:8, color:T.dim, marginLeft:2 }}>™</sup>
        </div>
        <div className="hid" style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Stars n={5}/><span style={{ fontSize:12, color:T.muted }}>4.9 · 50,000+ portraits created</span>
        </div>
        <div style={{ width:110 }}/>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO + BUILDER
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{ minHeight:"100vh", paddingTop:50, display:"flex", alignItems:"center",
        position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse 85% 65% at 62% 48%, rgba(100,70,8,.18) 0%, transparent 66%), ${T.bg}` }}>

        {/* grid overlay */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.022,
          backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
          backgroundSize:"62px 62px" }}/>
        {/* ambient orb */}
        <div style={{ position:"absolute", width:580, height:580, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(196,150,58,.07) 0%,transparent 72%)",
          top:"-12%", right:"-7%", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1240, margin:"0 auto", padding:"52px 24px", width:"100%",
          display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:44, alignItems:"center" }} className="hg">

          {/* LEFT — Headline + Teaser */}
          <div>
            <div className="fu" style={{ display:"inline-flex", gap:7, alignItems:"center",
              border:`1px solid rgba(196,150,58,.2)`, padding:"5px 14px", marginBottom:20,
              fontSize:10, letterSpacing:".28em", color:T.gold, textTransform:"uppercase" }}>
              <Sparkles size={10}/> AI Portrait Studio
            </div>

            <h1 className="fu" style={{ animationDelay:".07s", fontFamily:"'Cormorant Garamond',serif",
              fontWeight:700, lineHeight:.9, marginBottom:16 }}>
              <span style={{ fontSize:"clamp(42px,6.4vw,78px)", color:T.cream, display:"block" }}>Upload a Photo.</span>
              <span style={{ fontSize:"clamp(42px,6.4vw,78px)", color:T.cream, display:"block" }}>Get Back a</span>
              <span style={{ fontSize:"clamp(42px,6.4vw,78px)", display:"block", fontStyle:"italic", whiteSpace:"nowrap" }}>
                <span className="gold-text">Portrait Masterpiece.</span>
              </span>
            </h1>

            <p className="fu" style={{ animationDelay:".15s", fontSize:14, color:T.muted,
              lineHeight:1.8, marginBottom:18, maxWidth:380 }}>
              Turn photos of your pets, babies, people, or precious memories into timeless AI portraits in seconds.
            </p>

            <div className="fu" style={{ animationDelay:".22s", display:"flex", alignItems:"center",
              gap:9, flexWrap:"wrap", marginBottom:6 }}>
              <Stars n={5}/>
              <span style={{ fontSize:12, color:T.muted }}>
                <strong style={{ color:T.cream }}>4.9★ rated</strong> · Thousands of portraits created · Digital + gift prints
              </span>
            </div>

            {/* LIVE TEASER */}
            <div className="fu" style={{ animationDelay:".3s" }}>
              <LiveTeaser activeCat={cat} onCatClick={setCat}/>
            </div>
          </div>

          {/* RIGHT — BUILDER CARD */}
          <div className="si" style={{ animationDelay:".1s" }}>
            <div style={{ background:T.sur, border:`1px solid ${T.border}`, padding:"22px 20px",
              position:"relative",
              boxShadow:"0 44px 110px rgba(0,0,0,.72), inset 0 1px 0 rgba(196,150,58,.08)" }}>

              {/* gold top accent */}
              <div style={{ position:"absolute", top:0, left:"16%", right:"16%", height:1,
                background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

              {/* ── WHO IS THIS FOR ── */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, letterSpacing:".24em", color:T.gold, textTransform:"uppercase",
                  fontWeight:500, marginBottom:8 }}>Who Is This For?</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {CATS.map(c => (
                    <button key={c.id} className={`chip cat ${cat===c.id?"on":""}`} onClick={() => setCat(c.id)}>
                      <span style={{ fontSize:11 }}>{c.icon}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── UPLOAD PHOTO ── */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, letterSpacing:".24em", color:cat?T.gold:T.dim,
                  textTransform:"uppercase", fontWeight:500, marginBottom:8, transition:"color .28s" }}>
                  Upload Your Photo
                </div>
                {!photo ? (
                  <div className={`dz ${drag?"drag":""}`} style={{ borderRadius:6, padding:"20px 16px" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}>
                    <div style={{ width:38, height:38, background:"rgba(255,255,255,.04)", border:`1px solid ${T.border}`,
                      borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"0 auto 9px", position:"relative" }}>
                      <Upload size={15} color={T.muted}/>
                      <div style={{ position:"absolute", top:-5, right:-5, width:15, height:15, background:T.gold,
                        borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:12, fontWeight:700, color:T.bg, lineHeight:1 }}>+</div>
                    </div>
                    <p style={{ fontSize:12, color:T.cream, marginBottom:3 }}>Drop your photo here or click to upload</p>
                    <p style={{ fontSize:10, color:T.muted, lineHeight:1.55 }}>
                      Upload a clear photo · Good lighting · Visible faces for best results
                    </p>
                    {err && (
                      <div style={{ marginTop:8, display:"flex", gap:5, alignItems:"center",
                        justifyContent:"center", color:"#E06060", fontSize:10 }}>
                        <AlertCircle size={10}/>{err}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ position:"relative", borderRadius:6, overflow:"hidden", height:100, border:`1px solid ${T.bGold}` }}>
                    <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(7,6,10,.82) 0%,transparent 55%)" }}/>
                    <div style={{ position:"absolute", bottom:7, left:10, display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#5CB87A" }}/>
                      <span style={{ fontSize:11, color:T.cream }}>Photo ready</span>
                    </div>
                    <button onClick={() => setPhoto(null)} style={{ position:"absolute", top:6, right:6,
                      width:22, height:22, background:"rgba(7,6,10,.9)", border:`1px solid ${T.border}`,
                      borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <X size={9} color={T.muted}/>
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
                  onChange={e => loadFile(e.target.files[0])}/>
              </div>

              {/* ── CHOOSE STYLES ── */}
              <div style={{ marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:".24em", color:cat&&photo?T.gold:T.dim,
                    textTransform:"uppercase", fontWeight:500, transition:"color .28s" }}>Choose Styles</div>
                  <button onClick={() => setStyles(allOn ? [] : STYLES.map(s=>s.id))}
                    style={{ fontSize:9, color:allOn?T.gold:T.dim, background:"none", border:"none", cursor:"pointer",
                      letterSpacing:".12em", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", transition:"color .2s" }}>
                    {allOn ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {STYLES.map(s => (
                    <button key={s.id} className={`chip ${styles.includes(s.id)?"on":""}`} onClick={() => toggleStyle(s.id)}>
                      {styles.includes(s.id) && <Check size={9} color={T.gold}/>}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── GENERATE ── */}
              <button className="btn-gold" disabled={!canGo}
                style={{ width:"100%", padding:"15px", fontSize:13, borderRadius:6,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                  animation:canGo?"glow 2s infinite":"none" }}
                onClick={() => onGenerate({ cat, photo, styles })}>
                <Wand2 size={15}/>{genLabel()}
              </button>

              <p style={{ textAlign:"center", fontSize:10, color:T.dim, marginTop:9, letterSpacing:".05em" }}>
                No subscription · Free watermarked preview before purchase
              </p>
            </div>
          </div>
        </div>

        <div className="flt" style={{ position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)" }}>
          <ChevronDown size={13} color={T.dim}/>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STYLE EXAMPLES
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:"84px 24px", background:T.sur }}>
        <div style={{ maxWidth:1240, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <SLabel>The Styles</SLabel>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,56px)",
              fontWeight:700, color:T.cream, lineHeight:1, marginBottom:12 }}>
              Six Styles. One Upload. <em style={{ fontStyle:"italic", color:T.gold }}>All Yours.</em>
            </h2>
            <p style={{ color:T.muted, fontSize:13, maxWidth:380, margin:"0 auto 18px", lineHeight:1.8 }}>
              Every session generates all selected styles simultaneously. Click any style to add it to your creation.
            </p>
            <Rule/>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9 }} className="sg3">
            {STYLES.map((s, i) => (
              <div key={s.id} className="ptile"
                style={{ height:i===0||i===3 ? 390 : 320, borderRadius:6, cursor:"pointer" }}
                onClick={() => pickStyleScroll(s.id)}>
                <img src={s.preview} alt={s.label}/>
                {/* watermark */}
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
                  justifyContent:"center", pointerEvents:"none" }}>
                  <span style={{ fontSize:9, color:"rgba(255,255,255,.17)", letterSpacing:".26em",
                    textTransform:"uppercase", transform:"rotate(-20deg)", whiteSpace:"nowrap",
                    fontFamily:"'DM Sans',sans-serif" }}>DIGITAL PHOTOS</span>
                </div>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(7,6,10,.93) 0%,transparent 52%)", borderRadius:6 }}/>
                {/* selected badge */}
                {styles.includes(s.id) && (
                  <div style={{ position:"absolute", top:10, right:10, width:21, height:21, background:T.gold,
                    borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Check size={10} color={T.bg}/>
                  </div>
                )}
                <div style={{ position:"absolute", bottom:13, left:15, right:15 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:20, color:T.cream, marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:10, color:T.muted, marginBottom:5 }}>{s.desc}</div>
                  <div style={{ fontSize:9, color:T.gold, letterSpacing:".1em" }}>Click to select →</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:32 }}>
            <button className="btn-gold" style={{ padding:"13px 36px", fontSize:12, borderRadius:6 }} onClick={scrollToHero}>
              Create With All 6 Styles — Free Preview
            </button>
            <p style={{ color:T.dim, fontSize:11, marginTop:8 }}>Watermark removed on purchase · Ready in 2–5 minutes</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BEFORE / AFTER
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:"84px 24px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:42 }}>
            <SLabel>Transformations</SLabel>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(26px,5vw,52px)",
              fontWeight:700, color:T.cream, lineHeight:1 }}>
              Real Photos. <em style={{ fontStyle:"italic", color:T.gold }}>Real Results.</em>
            </h2>
            <p style={{ color:T.muted, fontSize:13, marginTop:9 }}>
              Drag the slider · One upload unlocks multiple portrait styles
            </p>
          </div>

          <div ref={baRef} style={{ height:450, borderRadius:8, position:"relative", overflow:"hidden",
            cursor:"ew-resize", userSelect:"none", border:`1px solid ${T.border}` }}
            onMouseDown={() => setBaDown(true)}
            onMouseUp={() => setBaDown(false)}
            onMouseLeave={() => setBaDown(false)}
            onMouseMove={e => { if (baDown) moveBA(e.clientX); }}
            onTouchMove={e => moveBA(e.touches[0].clientX)}>
            <img src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=900&h=450&fit=crop&q=80" alt="Before"
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, clipPath:`inset(0 ${100-baX}% 0 0)` }}>
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=450&fit=crop&q=80" alt="After"
                style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <div style={{ position:"absolute", top:0, bottom:0, left:`${baX}%`, width:2, background:T.gold }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                width:34, height:34, borderRadius:"50%", background:T.gold,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 4px 14px rgba(0,0,0,.55)" }}>
                <ChevronRight size={10} color={T.bg} style={{ marginLeft:1 }}/>
              </div>
            </div>
            <div style={{ position:"absolute", top:11, left:12, fontSize:9, letterSpacing:".18em",
              textTransform:"uppercase", background:"rgba(7,6,10,.78)", color:T.muted, padding:"3px 10px", borderRadius:2 }}>
              Original
            </div>
            <div style={{ position:"absolute", top:11, right:12, fontSize:9, letterSpacing:".18em",
              textTransform:"uppercase", background:"rgba(196,150,58,.88)", color:T.bg, padding:"3px 10px", fontWeight:600, borderRadius:2 }}>
              Royal Portrait
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:"42px 24px", background:T.sur,
        borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid",
          gridTemplateColumns:"repeat(4,1fr)", gap:14, textAlign:"center" }} className="trust4">
          {[
            { v:"4.9 / 5.0", l:"Average Rating",    i:"★" },
            { v:"10,000+",   l:"Portraits Created",  i:"✦" },
            { v:"Secure",    l:"Checkout",            i:"🔒" },
            { v:"Digital + Print", l:"Delivery Options", i:"📦" },
          ].map((t,i) => (
            <div key={i} style={{ padding:"16px 10px", border:`1px solid ${T.border}`, borderRadius:5 }}>
              <div style={{ fontSize:17, marginBottom:5 }}>{t.i}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:3 }}>{t.v}</div>
              <div style={{ fontSize:10, color:T.muted, letterSpacing:".1em" }}>{t.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:"84px 24px", textAlign:"center",
        background:`linear-gradient(135deg, rgba(196,150,58,.09) 0%, rgba(60,40,5,.05) 100%)`,
        borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <SLabel>Start Creating</SLabel>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,6vw,66px)",
            fontWeight:700, fontStyle:"italic", color:T.cream, lineHeight:.95, marginBottom:14 }}>
            Ready to See<br/>Your Portrait?
          </h2>
          <p style={{ color:T.muted, fontSize:14, lineHeight:1.8, maxWidth:390, margin:"0 auto 34px" }}>
            From unforgettable gifts to timeless keepsakes, your masterpiece starts with one photo.
          </p>
          <button className="btn-gold" onClick={scrollToHero}
            style={{ padding:"17px 52px", fontSize:13, borderRadius:6, display:"inline-flex", alignItems:"center", gap:9 }}>
            <Upload size={14}/> Upload a Photo
          </button>
          <div style={{ display:"flex", gap:20, justifyContent:"center", marginTop:16, flexWrap:"wrap" }}>
            {[[Lock,"No subscription"],[RefreshCw,"30-day guarantee"],[Truck,"Ships worldwide"]].map(([Icon,l]) => (
              <div key={l} style={{ display:"flex", gap:5, alignItems:"center", fontSize:11, color:T.dim }}>
                <Icon size={10}/>{l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"26px 24px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1240, margin:"0 auto", display:"flex",
          justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:11 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.cream, fontWeight:600 }}>
            Digital<span style={{ color:T.gold }}>Photos</span><sup style={{ fontSize:8, color:T.dim, marginLeft:2 }}>™</sup>
          </div>
          <div style={{ fontSize:11, color:T.dim }}>© 2025 Digital Photos™. All rights reserved.</div>
          <div style={{ fontSize:11, color:T.dim }}>AI-Powered · Fine Art Quality · Yours Forever</div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GENERATING SCREEN
═══════════════════════════════════════════════════════════ */
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
      if (p >= 100) { clearInterval(iv); setTimeout(onDone, 700); }
    }, tick);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, marginBottom:42, fontWeight:600 }}>
        Digital<span style={{ color:T.gold }}>Photos</span><sup style={{ fontSize:8, color:T.dim }}>™</sup>
      </div>

      <div style={{ position:"relative", width:62, height:62, marginBottom:24 }}>
        <div style={{ position:"absolute", inset:0, border:`1.5px solid ${T.border}`, borderRadius:"50%" }}/>
        <div className="spn" style={{ position:"absolute", inset:0, border:"2px solid transparent", borderTopColor:T.gold, borderRadius:"50%" }}/>
        <div style={{ position:"absolute", inset:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Wand2 size={18} color={T.gold}/>
        </div>
      </div>

      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(24px,5vw,42px)",
        fontWeight:700, fontStyle:"italic", color:T.cream, textAlign:"center", marginBottom:8 }}>
        Creating Your Portrait Collection
      </h2>
      <p style={{ color:T.muted, fontSize:13, marginBottom:34, textAlign:"center", minHeight:20 }}>{GEN_MSGS[msg]}</p>

      <div style={{ width:"100%", maxWidth:400, height:2, background:T.border,
        borderRadius:2, overflow:"hidden", marginBottom:6 }}>
        <div style={{ height:"100%", background:`linear-gradient(90deg,${T.gold},${T.goldLt})`,
          width:`${pct}%`, transition:"width .15s ease" }}/>
      </div>
      <p style={{ fontSize:12, color:T.gold, marginBottom:38 }}>{Math.round(pct)}%</p>

      {done.length > 0 && (
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", maxWidth:520 }}>
          {done.map((s, i) => (
            <div key={i} className="bi" style={{ animationDelay:`${i*.07}s`, width:70, height:90,
              borderRadius:5, overflow:"hidden", border:`1px solid ${T.border}`, position:"relative", flexShrink:0 }}>
              <img src={s.preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:.44, display:"block" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(7,6,10,.9)",
                padding:"3px 4px", textAlign:"center", fontSize:7, color:"rgba(255,255,255,.44)" }}>{s.label}</div>
              <div style={{ position:"absolute", top:4, right:4, width:13, height:13, background:T.gold,
                borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Check size={7} color={T.bg}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREVIEW PAGE  — Gallery Unlock Model
═══════════════════════════════════════════════════════════ */
function PreviewScreen({ cat, photo, selectedStyles, onBack }) {
  const navigate              = useNavigate();
  const { setSession }        = useSession();
  const [planSel,    setPlanSel]    = useState("bundle");

  const handlePlanSelect = (id) => {
    setPlanSel(id);
    setSession({ selectedPlan: id });
  };

  const goToCheckout = () => {
    setSession({ selectedPlan: planSel, cat, photo, styles: selectedStyles });
    navigate("/checkout");
  };
  const [timer,      setTimer]      = useState(23 * 60 + 47);
  const [focusedPort,setFocusedPort]= useState(null);
  const [showShare,  setShowShare]  = useState(false);
  const [shareCopied,setShareCopied]= useState(false);
  const [shareUnlocked,setShareUnlocked] = useState(false);
  const [upsellAdded,setUpsellAdded]= useState(false);
  const [openFaq,    setOpenFaq]    = useState(null);

  const catLabel = CATS.find(c => c.id===cat)?.label || "Portrait";
  const active   = STYLES.filter(s => selectedStyles.includes(s.id));
  const plan     = PLANS.find(p => p.id===planSel);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => Math.max(0, p-1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s =>
    `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleShare = type => {
    if (type === "copy") {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    }
    if (!shareUnlocked) {
      setTimeout(() => setShareUnlocked(true), 600);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, paddingBottom:100 }}>

      {/* STICKY HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:100,
        background:"rgba(7,6,10,.97)", backdropFilter:"blur(22px)",
        borderBottom:`1px solid ${T.border}` }}>
        <div style={{ padding:"5px 18px", borderBottom:`1px solid ${T.border}`,
          display:"flex", gap:16, alignItems:"center", justifyContent:"center",
          fontSize:10, color:T.muted, flexWrap:"wrap" }}>
          <span style={{ display:"flex", gap:4, alignItems:"center" }}><Truck size={10} color={T.gold}/>Free Shipping on Prints</span>
          <span>·</span>
          <span style={{ display:"flex", gap:4, alignItems:"center" }}><Stars n={5} size={12}/> Rated 4.9</span>
          <span>·</span>
          <span>Secure Checkout · 30-Day Guarantee</span>
        </div>
        <div style={{ padding:"8px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:T.cream, fontWeight:600 }}>
            Digital<span style={{ color:T.gold }}>Photos</span>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center", fontSize:11, color:T.dim }}>
            {["Upload","Preview","Unlock & Download"].map((s,i) => (
              <span key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ color:i===1?T.cream:T.dim, fontWeight:i===1?400:300 }}>{s}</span>
                {i<2 && <ChevronRight size={9} color={T.dim}/>}
              </span>
            ))}
          </div>
          <button className="btn-ghost" style={{ padding:"5px 12px", borderRadius:4, fontSize:10 }} onClick={onBack}>
            ← Retry
          </button>
        </div>
      </header>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 18px 70px" }}>

        {/* HEADLINE */}
        <div style={{ textAlign:"center", marginBottom:26 }}>
          <div style={{ display:"inline-flex", gap:7, alignItems:"center",
            background:T.goldBg, border:`1px solid rgba(196,150,58,.25)`,
            padding:"5px 14px", borderRadius:50, marginBottom:14, fontSize:10,
            color:T.gold, letterSpacing:".22em", textTransform:"uppercase" }}>
            <Sparkles size={9}/> Your Collection Is Ready
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,52px)",
            fontWeight:700, color:T.cream, marginBottom:9, lineHeight:1 }}>
            Your Portrait Collection Is Ready
          </h1>
          <p style={{ color:T.muted, fontSize:13, lineHeight:1.75, maxWidth:440, margin:"0 auto" }}>
            {active.length} portrait styles generated from your {catLabel.toLowerCase()} photo.
            Remove watermarks to unlock your full collection.
          </p>
        </div>

        {/* ── GALLERY GRID (watermarked) ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:11 }} className="pg3">
          {active.map((s, i) => (
            <div key={s.id}
              onMouseEnter={() => setFocusedPort(i)}
              onMouseLeave={() => setFocusedPort(null)}
              style={{ position:"relative", borderRadius:7, overflow:"hidden",
                height:i===0||i===1 ? 270 : 220,
                border:`1.5px solid ${focusedPort===i ? T.bGold : T.border}`,
                cursor:"pointer", transition:"border-color .22s" }}>
              <img src={photo || s.preview} alt={s.label}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
                  filter:"brightness(.8) saturate(1.08)" }}/>
              <Watermark/>
              {/* lock overlay */}
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(to top,rgba(7,6,10,.88) 0%,rgba(7,6,10,.15) 55%,transparent 100%)",
                display:"flex", alignItems:"flex-end", justifyContent:"center", padding:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:9,
                  color:"rgba(255,255,255,.55)", letterSpacing:".1em" }}>
                  <Lock size={9}/>Watermark locked
                </div>
              </div>
              {/* style label */}
              <div style={{ position:"absolute", top:9, left:10,
                background:"rgba(7,6,10,.82)", border:`1px solid rgba(196,150,58,.18)`,
                padding:"3px 9px", borderRadius:3, backdropFilter:"blur(8px)" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                  fontSize:12, color:T.cream }}>{s.label}</span>
              </div>
              {/* hover heart */}
              {focusedPort===i && (
                <button style={{ position:"absolute", top:9, right:9, width:26, height:26,
                  background:"rgba(7,6,10,.82)", border:`1px solid ${T.border}`,
                  borderRadius:"50%", display:"flex", alignItems:"center",
                  justifyContent:"center", cursor:"pointer" }}>
                  <Heart size={11} color={T.muted}/>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* gallery meta + share cta */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:22, flexWrap:"wrap", gap:10 }}>
          <p style={{ fontSize:11, color:T.dim }}>
            {active.length} portraits · All watermarks removed on purchase
          </p>
          <div style={{ display:"flex", gap:7 }}>
            <button className="btn-ghost" style={{ padding:"6px 12px", borderRadius:4,
              display:"flex", gap:5, alignItems:"center", fontSize:11 }}
              onClick={() => setShowShare(v => !v)}>
              <Share2 size={11}/>Share Free Preview
            </button>
            <button className="btn-ghost" style={{ padding:"6px 12px", borderRadius:4, fontSize:11 }} onClick={onBack}>
              <RefreshCw size={10}/> Retry
            </button>
          </div>
        </div>

        {/* ── SHARE PANEL ── */}
        {showShare && (
          <div className="fi" style={{ background:T.sur, border:`1px solid ${T.bGold}`,
            borderRadius:8, padding:"18px 20px", marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
              <div>
                <div style={{ fontSize:13, color:T.cream, fontWeight:400, marginBottom:4 }}>
                  Share Your Watermarked Preview
                </div>
                <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:14 }}>
                  {shareUnlocked
                    ? <span style={{ color:T.gold }}>✓ 2 bonus styles unlocked! They'll appear in your download.</span>
                    : <span>Share your preview and <strong style={{ color:T.gold }}>unlock 2 extra styles free.</strong></span>
                  }
                </p>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {[
                    { label:"Instagram", icon:<svg viewBox="0 0 24 24" width={12} fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>, color:"#E1306C" },
                    { label:"Facebook",  icon:<svg viewBox="0 0 24 24" width={12} fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>, color:"#1877F2" },
                    { label:shareCopied?"Copied!":"Copy Link", icon:<Copy size={11}/>, color:T.gold },
                    { label:"Download Preview", icon:<Download size={11}/>, color:T.muted },
                  ].map(b => (
                    <button key={b.label} onClick={() => handleShare(b.label==="Copy Link"||b.label==="Copied!"?"copy":"social")}
                      style={{ display:"flex", gap:6, alignItems:"center", padding:"7px 13px",
                        borderRadius:5, border:`1px solid ${T.border}`, background:T.card,
                        color:b.color, cursor:"pointer", fontSize:11,
                        fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}>
                      {b.icon}{b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── UNLOCK SECTION ── */}
        <div style={{ textAlign:"center", marginBottom:18 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,4.5vw,38px)",
            fontWeight:700, color:T.cream, marginBottom:6 }}>
            Unlock Your Portrait Collection
          </h2>
          <p style={{ color:T.muted, fontSize:12 }}>
            Remove watermarks · Download all portraits in high resolution · Order prints
          </p>
          {/* countdown */}
          <div style={{ display:"inline-flex", gap:6, alignItems:"center", marginTop:10,
            background:"rgba(196,150,58,.08)", border:`1px solid rgba(196,150,58,.22)`,
            padding:"6px 16px", borderRadius:50, fontSize:11, color:T.gold }}>
            ⏱ Special pricing expires in {fmt(timer)}
          </div>
        </div>

        {/* ── PRICING CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9, marginBottom:14 }} className="plangrid">
          {PLANS.map(p => (
            <div key={p.id} className={`pcard ${p.featured?"featured":""} ${planSel===p.id?"sel":""}`}
              style={{ borderRadius:8, padding:"20px 16px", background:p.featured?T.goldBg:T.sur }}
              onClick={() => handlePlanSelect(p.id)}>
              {p.badge ? (
                <div style={{ background:T.gold, color:T.bg, fontSize:9, fontWeight:700,
                  letterSpacing:".14em", padding:"3px 10px", borderRadius:50,
                  display:"inline-block", marginBottom:10 }}>{p.badge}</div>
              ) : (
                <div style={{ height:22, marginBottom:10 }}/>
              )}

              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:T.cream,
                fontWeight:700, marginBottom:5 }}>{p.label}</div>

              <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.dim, textDecoration:"line-through" }}>${p.orig}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38,
                  fontWeight:700, color:p.featured?T.gold:T.cream, lineHeight:1 }}>${p.price}</span>
              </div>

              {p.desc && <p style={{ fontSize:11, color:p.featured?T.gold:T.dim, fontStyle:"italic", marginBottom:12 }}>{p.desc}</p>}

              <div style={{ height:1, background:T.border, marginBottom:12 }}/>

              {p.features.map(f => <CheckRow key={f} label={f} gold={p.featured}/>)}

              <button className="btn-gold" style={{ width:"100%", padding:"12px", borderRadius:5, fontSize:12, marginTop:14 }}>
                {p.cta}
              </button>

              {p.featured && (
                <p style={{ textAlign:"center", fontSize:10, color:T.teal, marginTop:8 }}>
                  Most customers choose this ·{" "}
                  <span style={{ color:T.dim }}>Cancel anytime</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── UPSELL: Fantasy Pack ── */}
        <div style={{ background:T.sur, border:`1px solid ${upsellAdded?T.bGold:T.border}`,
          borderRadius:7, padding:"14px 18px", display:"flex",
          alignItems:"center", justifyContent:"space-between", marginBottom:20,
          flexWrap:"wrap", gap:11, transition:"border-color .3s" }}>
          <div>
            <div style={{ fontSize:13, color:T.cream, marginBottom:3 }}>
              🎨 Add Fantasy Style Pack
            </div>
            <div style={{ fontSize:11, color:T.muted }}>
              +4 additional fantasy-themed portrait variations · One-click add · Delivered instantly
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:T.gold, fontWeight:700 }}>$12</span>
            <button
              onClick={() => setUpsellAdded(v => !v)}
              className={upsellAdded ? "btn-ghost" : "btn-outline"}
              style={{ padding:"8px 16px", borderRadius:5, fontSize:11 }}>
              {upsellAdded ? "✓ Added" : "Add to Order"}
            </button>
          </div>
        </div>

        {/* TRUST ROW */}
        <div style={{ display:"flex", gap:18, justifyContent:"center", flexWrap:"wrap", marginBottom:22 }}>
          {[[Shield,"Secure checkout"],[Lock,"256-bit encrypted"],[Gift,"Gift messaging"],[Truck,"Free shipping on prints"]].map(([Icon,l]) => (
            <div key={l} style={{ display:"flex", gap:5, alignItems:"center", fontSize:11, color:T.dim }}>
              <Icon size={9}/>{l}
            </div>
          ))}
        </div>

        {/* SOCIAL PROOF */}
        <div style={{ textAlign:"center", padding:"14px 16px", border:`1px solid ${T.border}`,
          borderRadius:7, background:T.sur, marginBottom:18 }}>
          <p style={{ fontSize:13, color:T.muted }}>
            Chosen by <strong style={{ color:T.cream }}>10,000+</strong> {catLabel.toLowerCase()} portrait owners
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:7, alignItems:"center" }}>
            <Stars n={5}/>
            <span style={{ fontSize:11, color:T.dim }}>Rated Excellent on Trustpilot</span>
          </div>
        </div>

        {/* COMPACT REVIEWS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:20 }}>
          {[
            { n:"Sarah M.", t:`The ${catLabel} portrait is absolutely stunning. More compliments than any art I own.` },
            { n:"Marcus T.", t:"Ordered three canvases for the holidays. Everyone was floored. Best gift I've ever given." },
          ].map(r => (
            <div key={r.n} style={{ background:T.sur, border:`1px solid ${T.border}`, padding:"14px", borderRadius:6 }}>
              <Stars n={5} size={12}/>
              <p style={{ fontSize:11, color:T.muted, fontStyle:"italic", margin:"6px 0 5px", lineHeight:1.7 }}>"{r.t}"</p>
              <p style={{ fontSize:10, color:T.dim }}>— {r.n}</p>
            </div>
          ))}
        </div>

        {/* PRESS */}
        <div style={{ textAlign:"center", padding:"20px 0 0" }}>
          <p style={{ fontSize:9, letterSpacing:".28em", color:T.dim, textTransform:"uppercase", marginBottom:13 }}>As Seen On</p>
          <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
            {["The New York Times","Forbes","ELLE","Vogue"].map(p => (
              <span key={p} style={{ fontSize:12, color:T.dim, letterSpacing:".1em",
                fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0,
        background:"rgba(7,6,10,.97)", backdropFilter:"blur(22px)",
        borderTop:`1px solid ${T.border}`, padding:"9px 20px",
        display:"flex", gap:10, alignItems:"center", zIndex:50 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, color:T.muted, marginBottom:1 }}>{plan?.label}</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:T.cream, fontWeight:700, lineHeight:1.1 }}>
            ${plan?.price}
            <span style={{ fontSize:12, color:T.dim, textDecoration:"line-through",
              fontFamily:"'DM Sans',sans-serif", fontWeight:300, marginLeft:8 }}>${plan?.orig}</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <button className="btn-ghost" style={{ padding:"10px 13px", borderRadius:6, fontSize:11,
            display:"flex", gap:5, alignItems:"center" }}
            onClick={() => setShowShare(v => !v)}>
            <Share2 size={12}/>
          </button>
          <button className="btn-gold" style={{ padding:"12px 22px", borderRadius:7, fontSize:13,
            display:"flex", gap:7, alignItems:"center", animation:"glow 2s infinite" }}>
            <Lock size={13}/>Unlock Collection
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
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
