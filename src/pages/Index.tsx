// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate }  from "react-router-dom";
import { useSession }   from "@/context/SessionContext";
import { useUpload }    from "@/hooks/useUpload";
import { createSession } from "@/lib/supabaseHelpers";
import { supabase }     from "@/integrations/supabase/client";
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
  const { preview: photo, uploadedUrl, uploading, uploadErr, loadFile, clearPhoto } = useUpload();
  const [cat,     setCat]     = useState("");
  const [styles,  setStyles]  = useState([]);
  const [drag,    setDrag]    = useState(false);
  const err = uploadErr;
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
        <div className="hid" style={{ display:"flex", gap:22, alignItems:"center",
          position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => {
                setCat(c.id);
                heroRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
              }}
              style={{ background:"none", border:"none", cursor:"pointer",
                fontSize:11, letterSpacing:".14em", textTransform:"uppercase",
                color: cat===c.id ? T.gold : T.muted, fontFamily:"'DM Sans',sans-serif",
                transition:"color .2s" }}
              onMouseOver={e => { if(cat!==c.id) e.currentTarget.style.color = T.cream; }}
              onMouseOut={e => { if(cat!==c.id) e.currentTarget.style.color = T.muted; }}>
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <a href="/auth" style={{ fontSize:11, color:T.muted, textDecoration:"none", letterSpacing:".08em", textTransform:"uppercase",
            padding:"6px 14px", border:`1px solid ${T.border}`, transition:"all .25s" }}
            onMouseOver={e => { e.target.style.borderColor="rgba(196,150,58,.4)"; e.target.style.color=T.cream; }}
            onMouseOut={e => { e.target.style.borderColor=T.border; e.target.style.color=T.muted; }}>
            Sign In
          </a>
        </div>
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
          display:"flex", flexDirection:"column", alignItems:"center", gap:36 }} className="hg">

          {/* TOP — Headline + Teaser (centered) */}
          <div style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", maxWidth:880 }}>

            <h1 className="fu" style={{ animationDelay:".07s", fontFamily:"'Cormorant Garamond',serif",
              fontWeight:700, lineHeight:.9, marginBottom:16 }}>
              <span style={{ fontSize:"clamp(42px,6.4vw,78px)", color:T.cream, display:"block" }}>Upload A Photo.</span>
              <span style={{ fontSize:"clamp(42px,6.4vw,78px)", display:"block", fontStyle:"italic" }}>
                <span style={{ color:T.cream }}>Get Back A </span><span className="gold-text">Portrait Masterpiece.</span>
              </span>
            </h1>

            <p className="fu" style={{ animationDelay:".15s", fontSize:14, color:T.muted,
              lineHeight:1.8, marginBottom:18, maxWidth:"none", whiteSpace:"nowrap" }}>
              Turn photos of your pets, babies, people, or precious memories into timeless AI portraits in seconds.
            </p>

            <div className="fu" style={{ animationDelay:".22s", display:"flex", alignItems:"center",
              justifyContent:"center", gap:9, flexWrap:"wrap", marginBottom:6 }}>
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

          {/* BOTTOM — BUILDER CARD (centered) */}
          <div className="si" style={{ animationDelay:".1s", width:"100%", maxWidth:680 }}>
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
                    <button onClick={() => clearPhoto()} style={{ position:"absolute", top:6, right:6,
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
                onClick={() => onGenerate({ cat, photo, styles, uploadedUrl })}>
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
   GENERATING SCREEN — Real AI generation
═══════════════════════════════════════════════════════════ */
function GenScreen({ selectedStyles, sessionId, photoUrl, category, onDone }) {
  const [pct,  setPct]  = useState(0);
  const [msg,  setMsg]  = useState(0);
  const [done, setDone] = useState([]);
  const [error, setError] = useState(null);
  const active = STYLES.filter(s => selectedStyles.includes(s.id));
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Start a progress animation that ticks slowly
    let fakePct = 0;
    const total = active.length;
    const iv = setInterval(() => {
      // Slowly increment but never reach 100 until real completion
      fakePct = Math.min(fakePct + 0.3, 92);
      setPct(fakePct);
      setMsg(Math.min(Math.floor((fakePct/100) * GEN_MSGS.length), GEN_MSGS.length-1));
    }, 200);

    // Call the edge function
    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-portraits", {
          body: { sessionId, photoUrl, styles: selectedStyles, category },
        });

        clearInterval(iv);

        if (fnError) throw new Error(fnError.message || "Generation failed");
        if (!data?.portraits?.length) throw new Error("No portraits were generated");

        // Show completion
        setPct(100);
        setMsg(GEN_MSGS.length - 1);
        setDone(active);

        setTimeout(() => onDone(data.portraits), 700);
      } catch (err) {
        clearInterval(iv);
        console.error("Generation error:", err);
        setError(err.message || "Something went wrong generating your portraits.");
      }
    })();

    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, marginBottom:42, fontWeight:600 }}>
        Digital<span style={{ color:T.gold }}>Photos</span><sup style={{ fontSize:8, color:T.dim }}>™</sup>
      </div>

      {error ? (
        <div style={{ textAlign:"center", maxWidth:440 }}>
          <AlertCircle size={42} color="#E06060" style={{ marginBottom:16 }}/>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:T.cream, marginBottom:12 }}>Generation Failed</h2>
          <p style={{ color:T.muted, fontSize:14, marginBottom:24, lineHeight:1.7 }}>{error}</p>
          <button className="btn-gold" style={{ padding:"14px 36px", borderRadius:6, fontSize:13 }}
            onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <>
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

          <p style={{ fontSize:11, color:T.dim, textAlign:"center", maxWidth:360 }}>
            AI is generating {active.length} unique portrait{active.length>1?"s":""} from your photo. This may take 1–3 minutes.
          </p>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREVIEW PAGE  — Gallery Unlock Model
═══════════════════════════════════════════════════════════ */
function PreviewScreen({ cat, photo, selectedStyles, generatedPortraits = [], onBack }) {
  const navigate       = useNavigate();
  const { setSession } = useSession();

  const catLabel = CATS.find(c => c.id===cat)?.label || "Portrait";
  const active   = STYLES.filter(s => selectedStyles.includes(s.id));

  // Build display list — one tile per generated style, fallback to selected style preview
  const tiles = active.map(s => {
    const gen = generatedPortraits.find(p => p.style === s.id);
    return { id: s.id, label: s.label, src: gen ? gen.url : (photo || s.preview) };
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [timer,     setTimer]     = useState(20 * 60 + 18);
  const [printSize, setPrintSize] = useState('8" x 10"');
  const [canvasSize,setCanvasSize]= useState('12" x 16"');
  const [openFaq,   setOpenFaq]   = useState(null);
  const [shareCopied,setShareCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => Math.max(0, p-1)), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTimer = s =>
    `${String(Math.floor(s/3600)).padStart(1,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const featured = tiles[activeIdx] || { src: photo, label:"Portrait" };

  const buyDigital = () => {
    setSession({ selectedPlan:"digital", cat, photo, styles: selectedStyles });
    navigate("/checkout");
  };
  const buyPrint = () => {
    setSession({ selectedPlan:"bundle", cat, photo, styles: selectedStyles, printSize });
    navigate("/checkout");
  };
  const buyCanvas = () => {
    setSession({ selectedPlan:"canvas", cat, photo, styles: selectedStyles, canvasSize });
    navigate("/checkout");
  };

  const handleCopy = () => {
    try { navigator.clipboard?.writeText(window.location.href); } catch {}
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1800);
  };

  const FAQS = [
    { id:"reviews", title:"What Customers Say", sub:<>Rated <strong style={{color:T.cream}}>Excellent</strong> on Trustpilot ★★★★★</>,
      body:(
        <div style={{ display:"grid", gap:10 }}>
          <p style={{ fontSize:12, color:T.muted, fontStyle:"italic", lineHeight:1.7 }}>
            "The {catLabel.toLowerCase()} portrait is absolutely stunning. More compliments than any art I own." — Sarah M.
          </p>
          <p style={{ fontSize:12, color:T.muted, fontStyle:"italic", lineHeight:1.7 }}>
            "Ordered three canvases for the holidays. Everyone was floored. Best gift I've ever given." — Marcus T.
          </p>
        </div>
      ) },
    { id:"support", title:"Need Support?", sub:"We're happy to help!",
      body:<p style={{ fontSize:12, color:T.muted, lineHeight:1.7 }}>Email <span style={{color:T.gold}}>support@digitalphotos.art</span> any time. We respond within a few hours and back every order with a 30-day satisfaction guarantee.</p> },
    { id:"artists", title:"Supporting Real Artists", sub:"DigitalPhotos, crafted by our atelier.",
      body:<p style={{ fontSize:12, color:T.muted, lineHeight:1.7 }}>Every portrait is reviewed and refined by our in-house artists before delivery — AI is the brush, our team is the painter.</p> },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, paddingBottom:60 }}>
      {/* TOP UTILITY BAR */}
      <div style={{ borderBottom:`1px solid ${T.border}`, padding:"7px 18px",
        display:"flex", gap:18, alignItems:"center", justifyContent:"center",
        fontSize:11, color:T.muted, flexWrap:"wrap" }}>
        <span style={{ display:"flex", gap:5, alignItems:"center" }}><Truck size={11} color={T.gold}/>Free Shipping on Prints</span>
        <span style={{ color:T.dim }}>·</span>
        <span>Rated 4.9 ★</span>
        <span style={{ color:T.dim }}>·</span>
        <span>#1 on Trustpilot</span>
      </div>

      {/* HEADER */}
      <header style={{ padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between",
        borderBottom:`1px solid ${T.border}` }}>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:T.cream, fontWeight:600, lineHeight:1 }}>
            Digital<span style={{ color:T.gold }}>Photos</span>
          </div>
          <div style={{ fontSize:9, letterSpacing:".28em", color:T.dim, textTransform:"uppercase", marginTop:3 }}>
            By the Atelier
          </div>
        </div>
        <button className="btn-ghost" style={{ padding:"7px 13px", borderRadius:5, fontSize:11 }} onClick={onBack}>
          ← New Portrait
        </button>
      </header>

      <div style={{ maxWidth:980, margin:"0 auto", padding:"32px 18px 60px" }}>

        {/* BREADCRUMB */}
        <div style={{ display:"flex", gap:8, alignItems:"center", justifyContent:"center",
          fontSize:12, color:T.dim, marginBottom:22 }}>
          <span style={{ cursor:"pointer" }} onClick={onBack}>Upload</span>
          <ChevronRight size={11}/>
          <span style={{ color:T.cream }}>Preview</span>
          <ChevronRight size={11}/>
          <span>Download or Order Print</span>
        </div>

        {/* HEADLINE */}
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,5vw,46px)",
          fontWeight:700, color:T.cream, textAlign:"center", marginBottom:22, lineHeight:1.1 }}>
          Your Masterpiece is Ready!
        </h1>

        {/* FEATURED PORTRAIT */}
        <div style={{ position:"relative", maxWidth:520, margin:"0 auto 18px",
          aspectRatio:"4/5", borderRadius:8, overflow:"hidden",
          border:`1px solid ${T.border}`, background:T.card }}>
          <img src={featured.src} alt={featured.label}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          <Watermark/>
          <button className="btn-ghost" onClick={onBack}
            style={{ position:"absolute", top:12, right:12, padding:"6px 11px", borderRadius:4,
              fontSize:10, display:"flex", gap:5, alignItems:"center",
              background:"rgba(7,6,10,.8)", backdropFilter:"blur(6px)" }}>
            <RefreshCw size={10}/> Retry or Edit
          </button>
        </div>

        {/* THUMB STRIP */}
        {tiles.length > 1 && (
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
            {tiles.map((t, i) => (
              <button key={t.id} onClick={() => setActiveIdx(i)}
                style={{ width:62, height:78, borderRadius:5, overflow:"hidden",
                  border:`1.5px solid ${i===activeIdx ? T.gold : T.border}`,
                  cursor:"pointer", padding:0, background:"transparent",
                  position:"relative", transition:"border-color .2s" }}>
                <img src={t.src} alt={t.label}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
                    filter:i===activeIdx ? "none" : "brightness(.7)" }}/>
              </button>
            ))}
          </div>
        )}

        {/* CHOOSE YOUR FORMAT */}
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,3.5vw,32px)",
          fontWeight:700, color:T.cream, textAlign:"center", marginBottom:18 }}>
          Choose Your Format
        </h2>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:40 }} className="plangrid">

          {/* ── CARD 1: INSTANT MASTERPIECE ── */}
          <div style={{ position:"relative", background:T.sur, border:`1px solid ${T.border}`,
            borderRadius:10, padding:"26px 18px 20px", textAlign:"center" }}>
            <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)",
              background:T.teal, color:"#062019", fontSize:10, fontWeight:600,
              letterSpacing:".14em", padding:"4px 12px", borderRadius:50, textTransform:"uppercase" }}>
              Most Popular
            </div>
            <Download size={20} color={T.cream} style={{ margin:"0 auto 10px", display:"block" }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:8 }}>
              Instant Masterpiece
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, justifyContent:"center", marginBottom:4 }}>
              <span style={{ fontSize:13, color:T.dim, textDecoration:"line-through" }}>$39</span>
              <span style={{ fontSize:32, color:T.cream, fontWeight:700, lineHeight:1 }}>$29</span>
            </div>
            <div style={{ fontSize:10, color:T.gold, marginBottom:14 }}>
              Expires in <strong>{fmtTimer(timer)}</strong>
            </div>
            <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:14 }}>
              Instant high-resolution download — perfect for sharing or saving.
            </p>
            <div style={{ textAlign:"left", marginBottom:16 }}>
              {["No Watermark","Instant Download","High-Resolution Portrait"].map(f => (
                <CheckRow key={f} label={f}/>
              ))}
            </div>
            <button onClick={buyDigital} style={{ width:"100%", padding:"12px", borderRadius:6,
              background:T.cream, color:T.bg, fontSize:12, fontWeight:600, border:"none",
              cursor:"pointer", letterSpacing:".07em", textTransform:"uppercase" }}>
              Download Now
            </button>
            <div style={{ borderTop:`1px solid ${T.border}`, marginTop:16, paddingTop:12 }}>
              <p style={{ fontSize:10, color:T.dim, marginBottom:4 }}>Want more styles & masterpieces?</p>
              <button onClick={buyPrint} style={{ background:"none", border:"none", color:T.cream,
                fontSize:11, cursor:"pointer", textDecoration:"underline" }}>
                View Packs & Pricing
              </button>
            </div>
          </div>

          {/* ── CARD 2: FINE ART PRINT ── */}
          <div style={{ background:T.sur, border:`1px solid ${T.border}`,
            borderRadius:10, padding:"26px 18px 20px", textAlign:"center" }}>
            <FrameIcon size={20} color={T.cream} style={{ margin:"0 auto 10px", display:"block" }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:8 }}>
              Fine Art Print
            </div>
            <div style={{ fontSize:32, color:T.cream, fontWeight:700, lineHeight:1, marginBottom:14 }}>$89</div>
            <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:14 }}>
              Printed on museum-quality archival paper with fade-resistant inks.
            </p>
            <div style={{ textAlign:"left", marginBottom:14 }}>
              <label style={{ fontSize:10, color:T.dim, letterSpacing:".18em", textTransform:"uppercase" }}>Choose Size</label>
              <select value={printSize} onChange={e => setPrintSize(e.target.value)}
                style={{ width:"100%", marginTop:5, padding:"8px 10px", background:T.card,
                  border:`1px solid ${T.border}`, borderRadius:5, color:T.cream, fontSize:12,
                  fontFamily:"'DM Sans',sans-serif" }}>
                {['8" x 10"','11" x 14"','16" x 20"'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ textAlign:"left", marginBottom:12 }}>
              {["Museum-quality archival paper","Fade-resistant inks","Made to last decades"].map(f => (
                <CheckRow key={f} label={f}/>
              ))}
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:5,
              padding:"8px 10px", marginBottom:14, textAlign:"left" }}>
              <div style={{ fontSize:11, color:T.cream, display:"flex", gap:6, alignItems:"center" }}>
                <Truck size={11} color={T.gold}/> Free Shipping <span style={{ color:T.dim }}>($20 value)</span>
              </div>
              <div style={{ fontSize:10, color:T.dim, marginTop:2 }}>Delivery: 7–9 days</div>
            </div>
            <p style={{ fontSize:10, color:T.teal, marginBottom:12 }}>+ Includes digital download</p>
            <button onClick={buyPrint} style={{ width:"100%", padding:"12px", borderRadius:6,
              background:T.cream, color:T.bg, fontSize:12, fontWeight:600, border:"none",
              cursor:"pointer", letterSpacing:".07em", textTransform:"uppercase" }}>
              Order Print
            </button>
          </div>

          {/* ── CARD 3: LARGE CANVAS ── */}
          <div style={{ position:"relative", background:"rgba(139,92,246,.08)",
            border:`1px solid rgba(139,92,246,.45)`, borderRadius:10, padding:"26px 18px 20px", textAlign:"center" }}>
            <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)",
              background:T.purple, color:"#fff", fontSize:10, fontWeight:600,
              letterSpacing:".14em", padding:"4px 12px", borderRadius:50, textTransform:"uppercase" }}>
              The Perfect Gift 🎁
            </div>
            <Gift size={20} color={T.cream} style={{ margin:"0 auto 10px", display:"block" }}/>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:8 }}>
              Large Canvas
            </div>
            <div style={{ fontSize:32, color:T.cream, fontWeight:700, lineHeight:1, marginBottom:14 }}>$299</div>
            <p style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:14 }}>
              Gallery-quality canvas on wood — arrives ready to hang.
            </p>
            <div style={{ textAlign:"left", marginBottom:14 }}>
              <label style={{ fontSize:10, color:T.dim, letterSpacing:".18em", textTransform:"uppercase" }}>Choose Size</label>
              <select value={canvasSize} onChange={e => setCanvasSize(e.target.value)}
                style={{ width:"100%", marginTop:5, padding:"8px 10px", background:T.card,
                  border:`1px solid ${T.border}`, borderRadius:5, color:T.cream, fontSize:12,
                  fontFamily:"'DM Sans',sans-serif" }}>
                {['12" x 16"','18" x 24"','24" x 36"'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ textAlign:"left", marginBottom:12 }}>
              {["Ready to hang","Cotton-blend canvas, 1.25\" thick","Mounting included"].map(f => (
                <CheckRow key={f} label={f}/>
              ))}
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:5,
              padding:"8px 10px", marginBottom:14, textAlign:"left" }}>
              <div style={{ fontSize:11, color:T.cream, display:"flex", gap:6, alignItems:"center" }}>
                <Truck size={11} color={T.gold}/> Free Shipping <span style={{ color:T.dim }}>($20 value)</span>
              </div>
              <div style={{ fontSize:10, color:T.dim, marginTop:2 }}>Delivery: 7–9 days</div>
            </div>
            <p style={{ fontSize:10, color:T.teal, marginBottom:12 }}>+ Includes digital download</p>
            <button onClick={buyCanvas} style={{ width:"100%", padding:"12px", borderRadius:6,
              background:T.cream, color:T.bg, fontSize:12, fontWeight:600, border:"none",
              cursor:"pointer", letterSpacing:".07em", textTransform:"uppercase" }}>
              Order Canvas
            </button>
          </div>
        </div>

        {/* SOCIAL PROOF */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:T.cream, marginBottom:10 }}>
            Chosen by 10,000+ {catLabel} Owners
          </p>
          <div style={{ display:"inline-flex", gap:8, alignItems:"center", padding:"6px 14px",
            background:T.sur, border:`1px solid ${T.border}`, borderRadius:5 }}>
            <strong style={{ color:"#00B67A", fontSize:13 }}>Excellent</strong>
            <Stars n={5} size={13}/>
            <span style={{ fontSize:11, color:T.muted }}>★ Trustpilot</span>
          </div>
        </div>

        {/* SHARE */}
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:T.cream,
          textAlign:"center", marginBottom:14 }}>
          Send to Friends &amp; Family
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }} className="plangrid">
          <button onClick={handleCopy} style={{ padding:"14px", borderRadius:7,
            background:"transparent", border:`1px solid ${T.border}`, color:T.cream,
            display:"flex", gap:8, alignItems:"center", justifyContent:"center", cursor:"pointer",
            fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
            <Copy size={13}/> {shareCopied ? "Copied!" : "Save for Later"}
          </button>
          <button style={{ padding:"14px", borderRadius:7, background:T.teal,
            border:"none", color:"#062019", display:"flex", gap:8, alignItems:"center",
            justifyContent:"center", cursor:"pointer", fontSize:12, fontWeight:600,
            fontFamily:"'DM Sans',sans-serif" }}>
            <Share2 size={13}/> Share
          </button>
        </div>

        {/* ACCORDIONS */}
        <div style={{ border:`1px solid ${T.border}`, borderRadius:8, marginBottom:36, background:T.sur }}>
          {FAQS.map((f, i) => (
            <div key={f.id} style={{ borderTop: i===0 ? "none" : `1px solid ${T.border}` }}>
              <button onClick={() => setOpenFaq(openFaq===f.id ? null : f.id)}
                style={{ width:"100%", padding:"16px 18px", background:"transparent", border:"none",
                  display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer",
                  textAlign:"left", color:T.cream, fontFamily:"'DM Sans',sans-serif" }}>
                <div>
                  <div style={{ fontSize:13, color:T.cream, marginBottom:3 }}>{f.title}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{f.sub}</div>
                </div>
                <ChevronDown size={15} color={T.muted} style={{
                  transform: openFaq===f.id ? "rotate(180deg)" : "none", transition:"transform .25s" }}/>
              </button>
              {openFaq===f.id && (
                <div className="fi" style={{ padding:"0 18px 18px" }}>{f.body}</div>
              )}
            </div>
          ))}
        </div>

        {/* PRESS */}
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <p style={{ fontSize:9, letterSpacing:".28em", color:T.dim, textTransform:"uppercase", marginBottom:14 }}>As Seen On</p>
          <div style={{ display:"flex", gap:30, justifyContent:"center", flexWrap:"wrap" }}>
            {["The New York Times","Forbes","ELLE","Vogue"].map(p => (
              <span key={p} style={{ fontSize:13, color:T.dim, letterSpacing:".1em",
                fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen,      setScreen]   = useState("home");
  const [localSession, setLocal]   = useState({ cat:"", photo:null, photoUrl:null, styles:[], sessionId:null, generatedPortraits:[] });
  const { setSession }             = useSession();

  const handleGenerate = useCallback(async ({ cat, photo, styles, uploadedUrl }) => {
    let sessionId = null;
    setLocal(prev => ({ ...prev, cat, photo, photoUrl: uploadedUrl, styles }));
    setSession({ cat, photo, styles });

    // Create a Supabase session record to track generation
    try {
      sessionId = await createSession({ category: cat, styles, photoUrl: uploadedUrl || photo || "" });
      setSession({ cat, photo, styles, orderId: sessionId });
      setLocal(prev => ({ ...prev, sessionId }));
    } catch (err) {
      console.warn("Could not create session record:", err);
    }

    setScreen("gen");
  }, [setSession]);

  const handleGenDone = useCallback((portraits) => {
    setLocal(prev => ({ ...prev, generatedPortraits: portraits }));
    setSession({ generatedPortraits: portraits.map(p => ({ style: p.style, url: p.url })) });
    setScreen("preview");
  }, [setSession]);

  return (
    <>
      <style>{G}</style>
      {screen==="home"    && <HomePage    onGenerate={handleGenerate}/>}
      {screen==="gen"     && <GenScreen   selectedStyles={localSession.styles}
                                sessionId={localSession.sessionId}
                                photoUrl={localSession.photoUrl || localSession.photo}
                                category={localSession.cat}
                                onDone={handleGenDone}/>}
      {screen==="preview" && <PreviewScreen cat={localSession.cat} photo={localSession.photo}
                                selectedStyles={localSession.styles}
                                generatedPortraits={localSession.generatedPortraits}
                                onBack={() => setScreen("home")}/>}
    </>
  );
}
