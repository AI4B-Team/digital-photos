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
  ArrowRight, Shield, Star, Instagram, Facebook,
  PawPrint, Baby, Users, Flower2
} from "lucide-react";
import scenePets from "@/assets/scene-pets.jpg";
import sceneBabies from "@/assets/scene-babies.jpg";
import scenePeople from "@/assets/scene-people.jpg";
import sceneMemorial from "@/assets/scene-memorial.jpg";
import sceneGifts from "@/assets/scene-gifts.jpg";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  bg:"#FFFFFF",sur:"#FFFFFF",card:"#FFFFFF",
  border:"rgba(0,0,0,0.1)",bGold:"rgba(230,25,25,.4)",
  cream:"#0A0A0A",muted:"#8C8C8C",dim:"#BFBFBF",
  gold:"#E61919",goldLt:"#FF3333",goldBg:"rgba(230,25,25,.07)",
  teal:"#2DD4BF",purple:"#8B5CF6",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#FFFFFF;color:#0A0A0A;font-family:'Poppins',sans-serif;font-weight:400;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,.18);border-radius:3px}

@keyframes fadeUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn  {from{opacity:0}to{opacity:1}}
@keyframes scaleIn {from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer {0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes spinR   {from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes drift   {0%{transform:translateX(0) rotate(-20deg)}100%{transform:translateX(-50%) rotate(-20deg)}}
@keyframes floatY  {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes glow    {0%,100%{box-shadow:0 0 0 0 rgba(230,25,25,.4)}50%{box-shadow:0 0 0 13px rgba(230,25,25,0)}}
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

.gold-text{color:#E61919}

/* Buttons — REAL CREATOR style */
.btn-gold{background:#E61919;color:#FFFFFF;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:600;letter-spacing:.01em;text-transform:none;border-radius:999px;transition:all .2s}
.btn-gold:hover{background:#CC1414;transform:translateY(-1px);box-shadow:0 6px 18px rgba(230,25,25,.25)}
.btn-gold:active{transform:translateY(0)}
.btn-gold:disabled{opacity:.35;cursor:not-allowed;transform:none!important;box-shadow:none!important;animation:none!important}
.btn-ghost{background:transparent;border:1px solid rgba(0,0,0,.12);color:#0A0A0A;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:500;letter-spacing:.01em;text-transform:none;border-radius:999px;transition:all .2s}
.btn-ghost:hover{border-color:rgba(0,0,0,.3);background:rgba(0,0,0,.03)}
.btn-outline{background:transparent;border:1px solid #E61919;color:#E61919;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:600;letter-spacing:.01em;text-transform:none;border-radius:999px;transition:all .2s}
.btn-outline:hover{background:rgba(230,25,25,.08)}

/* Chips */
.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;cursor:pointer;font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;transition:all .18s;white-space:nowrap;border:1px solid rgba(0,0,0,.1);background:#FFFFFF;color:#525252;user-select:none}
.chip:hover{border-color:rgba(0,0,0,.2);color:#0A0A0A}
.chip.on{border-color:#E61919;background:rgba(230,25,25,.08);color:#E61919;font-weight:600}
.chip.cat.on{border-color:#E61919;background:rgba(230,25,25,.08);color:#E61919}

/* Drop zone */
.dz{border:1.5px dashed rgba(0,0,0,.18);text-align:center;cursor:pointer;transition:all .25s;background:#FAFAFA;position:relative;overflow:hidden;border-radius:20px}
.dz:hover,.dz.drag{border-color:#E61919;background:rgba(230,25,25,.04)}

/* Cards */
.ptile{position:relative;overflow:hidden;border-radius:20px;transition:transform .38s cubic-bezier(.23,1,.32,1)}
.ptile:hover{transform:translateY(-4px)}
.ptile img{width:100%;height:100%;object-fit:cover;display:block;transition:filter .38s}
.ptile:hover img{filter:brightness(1.04)}
.pcard{border:1px solid rgba(0,0,0,.1);background:#FFFFFF;border-radius:20px;transition:all .25s cubic-bezier(.23,1,.32,1);cursor:pointer;position:relative;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.pcard:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08)}
.pcard.sel{border-color:#E61919;background:rgba(230,25,25,.04)}
.pcard.featured{border-color:#E61919;background:rgba(230,25,25,.05)}
.pcard.featured:hover{border-color:#CC1414}

/* Watermark */
.wml{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.wmr{position:absolute;white-space:nowrap;font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.4);animation:drift 22s linear infinite;width:200%}

/* Thumb strip */
.tstrip{display:flex;gap:7px;overflow-x:auto;padding-bottom:3px}
.tstrip::-webkit-scrollbar{height:2px}
.tstrip::-webkit-scrollbar-thumb{background:#E61919}

/* Size button */
.szb{padding:6px 12px;font-size:12px;font-family:'Poppins',sans-serif;font-weight:500;cursor:pointer;border-radius:999px;transition:all .18s}
.szon{border:1px solid #E61919;background:rgba(230,25,25,.08);color:#E61919}
.szoff{border:1px solid rgba(0,0,0,.1);background:transparent;color:#525252}
.szoff:hover{border-color:rgba(0,0,0,.25);color:#0A0A0A}

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
  { id:"pets",     label:"Pets",     icon:"🐾", Icon: PawPrint },
  { id:"babies",   label:"Babies",   icon:"🍼", Icon: Baby     },
  { id:"people",   label:"People",   icon:"👤", Icon: Users    },
  { id:"memorial", label:"Memorial", icon:"✦",  Icon: Flower2  },
  { id:"gifts",    label:"Gifts",    icon:"🎁", Icon: Gift     },
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
  { cat:"Pets",     catId:"pets",     style:"Royal",       before:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=380&fit=crop&q=80", after:scenePets    },
  { cat:"Babies",   catId:"babies",   style:"Storybook",   before:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&h=380&fit=crop&q=80", after:sceneBabies  },
  { cat:"People",   catId:"people",   style:"Cinematic",   before:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=380&fit=crop&q=80", after:scenePeople  },
  { cat:"Memorial", catId:"memorial", style:"Minimal",     before:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=300&h=380&fit=crop&q=80", after:sceneMemorial},
  { cat:"Gifts",    catId:"gifts",    style:"Renaissance", before:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=380&fit=crop&q=80", after:sceneGifts   },
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
    <div style={{ padding:"0 0 24px" }}>
      <div style={{ textAlign:"center", fontSize:11, letterSpacing:".32em",
        textTransform:"uppercase", color:T.gold, marginBottom:18 }}>
        What Your Photo Becomes
      </div>

      {/* Scene with corner inset of original */}
      <div style={{ maxWidth:480, margin:"0 auto" }}>
        <div style={{ position:"relative", aspectRatio:"1/1", borderRadius:14, overflow:"hidden",
          border:`1px solid ${T.bGold}`, boxShadow:"0 12px 40px rgba(0,0,0,.08)" }}>
          <img src={cur.after} alt="Portrait scene"
            style={{ width:"100%", height:"100%", objectFit:"cover",
              opacity:fading?0:1, transition:"opacity .3s" }}/>

          {/* watermark */}
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
            justifyContent:"center", pointerEvents:"none" }}>
            <span style={{ fontSize:9, color:"rgba(255,255,255,.22)", letterSpacing:".26em",
              textTransform:"uppercase", transform:"rotate(-20deg)", whiteSpace:"nowrap" }}>
              DIGITAL PHOTOS
            </span>
          </div>

          {/* corner inset — original photo */}
          <div style={{ position:"absolute", bottom:16, left:16, width:84, height:84,
            borderRadius:14, overflow:"hidden", border:"3px solid #FFFFFF",
            boxShadow:"0 6px 18px rgba(0,0,0,.25)" }}>
            <img src={cur.before} alt="Original"
              style={{ width:"100%", height:"100%", objectFit:"cover",
                opacity:fading?0:1, transition:"opacity .3s" }}/>
          </div>

          {/* "Your Photo" badge with doodle arrow pointing to inset */}
          <div style={{ position:"absolute", bottom:104, left:88, pointerEvents:"none",
            display:"flex", flexDirection:"column", alignItems:"flex-start", gap:2 }}>
            <span style={{
              fontFamily:"'Caveat', 'Patrick Hand', cursive",
              fontSize:22, fontWeight:700, color:"#FFFFFF",
              background:T.gold, padding:"4px 12px", borderRadius:20,
              boxShadow:"0 4px 12px rgba(0,0,0,.25)", whiteSpace:"nowrap",
              transform:"rotate(-6deg)" }}>
              Your Photo
            </span>
            <svg width="58" height="44" viewBox="0 0 58 44" fill="none"
              style={{ marginLeft:6, marginTop:-2 }}>
              <path d="M48 4 C40 14, 28 22, 14 34" stroke={T.gold} strokeWidth="2.2"
                strokeLinecap="round" fill="none"
                strokeDasharray="0" />
              <path d="M14 34 L22 30 M14 34 L18 26" stroke={T.gold} strokeWidth="2.2"
                strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          {/* style badge */}
          <div style={{ position:"absolute", bottom:18, right:18,
            fontSize:11, letterSpacing:".18em", textTransform:"uppercase", color:T.bg,
            background:T.gold, padding:"7px 16px", borderRadius:8, fontWeight:600 }}>
            {cur.style}
          </div>
        </div>
      </div>

      {/* Category dots */}
      <div style={{ display:"flex", gap:8, marginTop:18, alignItems:"center", justifyContent:"center" }}>
        {TEASERS.map((t, i) => (
          <button key={i} onClick={() => { onCatClick(t.catId); setFading(true); setTimeout(()=>{setIdx(i);setFading(false);},260); }}
            style={{ padding:0, border:"none", background:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:i===idx?22:7, height:7, borderRadius:4,
              background:i===idx?T.gold:T.dim, transition:"all .3s" }}/>
            {i===idx && <span style={{ fontSize:11, color:T.muted, letterSpacing:".12em" }}>{t.cat}</span>}
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

      {/* ── ANNOUNCEMENT STRIP ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:201, height:30,
        background:`linear-gradient(90deg, ${T.gold} 0%, #E0B65A 50%, ${T.gold} 100%)`,
        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        fontFamily:"'Poppins',sans-serif", fontSize:11, letterSpacing:".14em",
        textTransform:"uppercase", color:T.bg, fontWeight:600 }}>
        <Truck size={13} strokeWidth={2}/>
        <span>Free Worldwide Shipping On All Prints</span>
        <span style={{ opacity:.55 }}>·</span>
        <span>Limited Time</span>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:50,
        display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 26px",
        background:scrolled?"rgba(7,6,10,.97)":"transparent",
        backdropFilter:scrolled?"blur(22px)":"none",
        borderBottom:scrolled?`1px solid ${T.border}`:"none",
        transition:"all .4s" }}>
        <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:20, color:T.cream, fontWeight:600 }}>
          Digital<span style={{ color:T.gold }}>Photos</span>
          <sup style={{ fontSize:8, color:T.dim, marginLeft:2 }}>™</sup>
        </div>
        <div className="hid" style={{ display:"flex", gap:44, alignItems:"center",
          position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}>
          {CATS.map(c => {
            const NavIcon = c.Icon;
            return (
              <button key={c.id} onClick={() => {
                  setCat(c.id);
                  heroRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
                }}
                style={{ background:"none", border:"none", cursor:"pointer",
                  fontSize:11, letterSpacing:".14em", textTransform:"uppercase",
                  color: cat===c.id ? T.gold : T.muted, fontFamily:"'Poppins',sans-serif",
                  transition:"color .2s",
                  display:"flex", alignItems:"center", gap:7 }}
                onMouseOver={e => { if(cat!==c.id) e.currentTarget.style.color = T.cream; }}
                onMouseOut={e => { if(cat!==c.id) e.currentTarget.style.color = T.muted; }}>
                <NavIcon size={14} strokeWidth={1.8}/>
                {c.label}
              </button>
            );
          })}
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
      <section ref={heroRef} style={{ paddingTop:56, paddingBottom:40, display:"flex", alignItems:"center",
        position:"relative", overflow:"hidden",
        background: T.bg }}>

        {/* grid overlay */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:.022,
          backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
          backgroundSize:"62px 62px" }}/>

        <div style={{ maxWidth:"100%", margin:"0 auto", padding:"24px 32px", width:"100%",
          display:"flex", flexDirection:"column", gap:16 }}>

          {/* FULL-WIDTH HEADLINE + SUBHEADLINE */}
          <div style={{ display:"flex", flexDirection:"column", gap:14, textAlign:"center", alignItems:"center" }}>
            <div className="fu" style={{ animationDelay:".05s", display:"flex", alignItems:"center",
              gap:9, flexWrap:"wrap", justifyContent:"center" }}>
              <Stars n={5}/>
              <span style={{ fontSize:12, color:T.muted }}>
                <strong style={{ color:T.cream }}>4.9★ Rated</strong> · Thousands Of Portraits Created
              </span>
            </div>

            <h1 className="fu" style={{ animationDelay:".07s", fontFamily:"'Poppins',sans-serif",
              fontWeight:700, lineHeight:1.05, marginBottom:0, color:T.cream,
              fontSize:"clamp(28px,4.4vw,56px)" }}>
              Upload A Photo. Receive A Masterpiece.
            </h1>

            <p className="fu" style={{ animationDelay:".15s", fontSize:21, color:T.muted,
              lineHeight:1.6, marginBottom:0, maxWidth:"none", whiteSpace:"nowrap" }}>
              Turn Photos Of Your Pets, Babies, People, Or Precious Memories Into Timeless Portraits In Seconds.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start" }} className="hg hero-grid">

          {/* LEFT PANEL — teaser */}
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

            {/* LIVE TEASER moved into left panel */}
            <div className="fu" style={{ animationDelay:".3s", width:"100%", maxWidth:560 }}>
              <LiveTeaser activeCat={cat} onCatClick={setCat}/>
            </div>
          </div>

          {/* RIGHT PANEL — BUILDER CARD */}
          <div className="si" style={{ animationDelay:".1s", width:"100%", justifySelf:"end" }}>
            <div style={{ background:T.sur, border:`1px solid ${T.gold}`, padding:"22px 20px",
              position:"relative",
              boxShadow:"inset 0 1px 0 rgba(196,150,58,.08)" }}>

              {/* gold top accent */}
              <div style={{ position:"absolute", top:0, left:"16%", right:"16%", height:1,
                background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

              {/* ── WHO IS THIS FOR ── */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, letterSpacing:".24em", color:T.gold, textTransform:"uppercase",
                  fontWeight:500, marginBottom:8 }}>Who Is This For?</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {CATS.map(c => {
                    const CIcon = c.Icon;
                    return (
                      <button key={c.id} className={`chip cat ${cat===c.id?"on":""}`} onClick={() => setCat(c.id)}>
                        <CIcon size={14} strokeWidth={1.8}/>{c.label}
                      </button>
                    );
                  })}
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
                    <p style={{ fontSize:12, color:T.cream, marginBottom:3 }}>Drop Your Photo Here Or Click To Upload</p>
                    <p style={{ fontSize:10, color:T.muted, lineHeight:1.55 }}>
                      Upload A Clear Photo · Good Lighting · Visible Faces For Best Results
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
                      letterSpacing:".12em", textTransform:"uppercase", fontFamily:"'Poppins',sans-serif", transition:"color .2s" }}>
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

              <p style={{ textAlign:"center", fontSize:12, color:T.muted, marginTop:9, letterSpacing:".03em" }}>
                No Subscription · Free Watermarked Preview Before Purchase
              </p>
            </div>
          </div>
          </div>
        </div>

      </section>

      <footer style={{ padding:"26px 24px", borderTop:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1240, margin:"0 auto", display:"flex",
          justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:11 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, color:T.cream, fontWeight:600 }}>
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
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:20, color:T.cream, marginBottom:42, fontWeight:600 }}>
        Digital<span style={{ color:T.gold }}>Photos</span><sup style={{ fontSize:8, color:T.dim }}>™</sup>
      </div>

      {error ? (
        <div style={{ textAlign:"center", maxWidth:440 }}>
          <AlertCircle size={42} color="#E06060" style={{ marginBottom:16 }}/>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:28, color:T.cream, marginBottom:12 }}>Generation Failed</h2>
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

          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(24px,5vw,42px)",
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
    navigate(`/customize?style=${encodeURIComponent(featured?.id || selectedStyles[0] || "")}`);
  };
  const buyCanvas = () => {
    setSession({ selectedPlan:"canvas", cat, photo, styles: selectedStyles, canvasSize });
    navigate(`/customize?style=${encodeURIComponent(featured?.id || selectedStyles[0] || "")}`);
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
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:22, color:T.cream, fontWeight:600, lineHeight:1 }}>
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
        <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(30px,5vw,46px)",
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
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:"clamp(22px,3.5vw,32px)",
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
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:8 }}>
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
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:8 }}>
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
                  fontFamily:"'Poppins',sans-serif" }}>
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
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:20, color:T.cream, fontWeight:700, marginBottom:8 }}>
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
                  fontFamily:"'Poppins',sans-serif" }}>
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
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:22, color:T.cream, marginBottom:10 }}>
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
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:24, color:T.cream,
          textAlign:"center", marginBottom:14 }}>
          Send to Friends &amp; Family
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }} className="plangrid">
          <button onClick={handleCopy} style={{ padding:"14px", borderRadius:7,
            background:"transparent", border:`1px solid ${T.border}`, color:T.cream,
            display:"flex", gap:8, alignItems:"center", justifyContent:"center", cursor:"pointer",
            fontSize:12, fontFamily:"'Poppins',sans-serif" }}>
            <Copy size={13}/> {shareCopied ? "Copied!" : "Save for Later"}
          </button>
          <button style={{ padding:"14px", borderRadius:7, background:T.teal,
            border:"none", color:"#062019", display:"flex", gap:8, alignItems:"center",
            justifyContent:"center", cursor:"pointer", fontSize:12, fontWeight:600,
            fontFamily:"'Poppins',sans-serif" }}>
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
                  textAlign:"left", color:T.cream, fontFamily:"'Poppins',sans-serif" }}>
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
                fontStyle:"italic", fontFamily:"'Poppins',sans-serif" }}>{p}</span>
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
