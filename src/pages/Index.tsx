// ============================================================
// DIGITAL PHOTOS™ — PHASE 1: HOMEPAGE
// Copy this entire file into Lovable as: src/pages/Index.jsx
// Fonts loaded via index.html or main.jsx:
//   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
// ============================================================

import { useState, useEffect, useRef } from "react";
import {
  Camera, Star, ChevronRight, ChevronDown, Check, ArrowRight,
  Heart, Users, Baby, Sparkles, Crown, Gift, Sun, Snowflake,
  Image, Package, Truck, Globe, Lock, Shield, RefreshCw,
  Play, Instagram, Twitter, Facebook, Wand2, Upload, ZoomIn,
  FrameIcon, Award, Plus, Minus, ChevronUp, Menu, X,
  Palette, Layers, Clock, MapPin, Mail
} from "lucide-react";

// ── DESIGN TOKENS ──────────────────────────────────────────
const C = {
  bg:          "#080705",
  bgCard:      "#0F0D0A",
  bgLight:     "#141109",
  cream:       "#F2EDE4",
  creamMuted:  "#B8B09A",
  gold:        "#C4963A",
  goldLight:   "#D4AE5C",
  goldDim:     "#7A5C22",
  goldBg:      "rgba(196,150,58,0.07)",
  border:      "#1E1B14",
  borderLight: "#2A261D",
  white:       "#FAF8F5",
};

// ── GLOBAL STYLES ──────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080705; color: #F2EDE4; font-family: 'Outfit', sans-serif; font-weight: 300; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: #080705; }
  ::-webkit-scrollbar-thumb { background: #C4963A; }
  .serif { font-family: 'Cormorant Garamond', serif; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulseGold{ 0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,0.3)} 50%{box-shadow:0 0 0 14px rgba(196,150,58,0)} }
  @keyframes slideFwd { from{transform:translateX(-16px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes scaleIn  { from{transform:scale(0.94);opacity:0} to{transform:scale(1);opacity:1} }

  .fade-up   { animation: fadeUp 0.75s ease forwards; }
  .fade-in   { animation: fadeIn 1s ease forwards; }
  .float     { animation: float 5s ease-in-out infinite; }
  .pulse-gold{ animation: pulseGold 2s infinite; }

  .gold-shimmer {
    background: linear-gradient(90deg,#C4963A,#F0D080,#C4963A,#A07030,#C4963A);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .btn-gold {
    background: linear-gradient(135deg,#C4963A,#E0B44A,#C4963A);
    color: #080705; border: none; cursor: pointer;
    font-family: 'Outfit',sans-serif; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    transition: all 0.3s;
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(196,150,58,0.45); }

  .btn-outline {
    background: transparent; border: 1px solid #C4963A; color: #C4963A; cursor: pointer;
    font-family: 'Outfit',sans-serif; font-weight: 400;
    letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s;
  }
  .btn-outline:hover { background: rgba(196,150,58,0.08); transform: translateY(-1px); }

  .card-lift { transition: all 0.4s cubic-bezier(0.23,1,0.32,1); cursor: pointer; }
  .card-lift:hover { transform: translateY(-6px); }

  .nav-link {
    font-family: 'Outfit',sans-serif; font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase; color: #B8B09A; cursor: pointer; transition: color 0.3s; text-decoration:none;
  }
  .nav-link:hover { color: #C4963A; }

  .tab-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit',sans-serif; font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase; color: #B8B09A;
    padding: 14px 28px; border-bottom: 2px solid transparent; transition: all 0.3s;
  }
  .tab-btn.active { color: #C4963A; border-bottom-color: #C4963A; }

  .before-after-container { position: relative; overflow: hidden; user-select: none; }
  .before-after-slider { position: absolute; top: 0; bottom: 0; width: 3px; background: #C4963A; cursor: ew-resize; z-index: 10; }
  .before-after-handle {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: 40px; height: 40px; border-radius: 50%; background: #C4963A;
    display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 12px rgba(0,0,0,0.5);
  }

  .faq-item { border-bottom: 1px solid #1E1B14; }
  .faq-question {
    width: 100%; background: none; border: none; cursor: pointer; text-align: left; padding: 20px 0;
    display: flex; justify-content: space-between; align-items: center;
    font-family: 'Outfit',sans-serif; font-size: 15px; color: #F2EDE4; font-weight: 400;
  }
  .faq-answer { overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease; }

  .section-eyebrow {
    font-family: 'Outfit',sans-serif; font-size: 10px; letter-spacing: 0.3em;
    text-transform: uppercase; color: #C4963A; font-weight: 500;
  }
  .divider-gold {
    width: 56px; height: 1px;
    background: linear-gradient(90deg, transparent, #C4963A, transparent);
    margin: 0 auto;
  }
  .grain {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  @media (max-width: 768px) {
    .hide-sm { display: none !important; }
    .sm-col  { flex-direction: column !important; }
    .sm-full { width: 100% !important; }
  }
`;

// ── DATA ────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"pets",     label:"Pets",          sub:"Fur babies deserve fine art",          icon: Heart },
  { id:"babies",   label:"Babies",        sub:"Tiny moments. Eternal memories.",       icon: Baby },
  { id:"adults",   label:"Adults",        sub:"You, reimagined as a masterpiece",      icon: Crown },
  { id:"couples",  label:"Couples",       sub:"Your love story. Painted by AI.",       icon: Heart },
  { id:"families", label:"Families",      sub:"Every face. One beautiful portrait.",   icon: Users },
  { id:"memorial", label:"Memorial",      sub:"Keep them close. Forever in art.",      icon: Star },
  { id:"gifts",    label:"Holiday Gifts", sub:"The gift they'll never throw away",     icon: Gift },
  { id:"fantasy",  label:"Fantasy",       sub:"Step into another world entirely",      icon: Sparkles },
];

const STYLES = [
  { id:"royal",      name:"Royal Portrait",     desc:"Oil painting, regal costume, gold accents",        sample:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=320&h=420&fit=crop" },
  { id:"renaissance",name:"Renaissance",        desc:"Old Masters technique, dramatic lighting",          sample:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&h=420&fit=crop" },
  { id:"storybook",  name:"Storybook Fantasy",  desc:"Fairy tale feel, soft magical lighting",           sample:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=320&h=420&fit=crop" },
  { id:"cinematic",  name:"Cinematic Portrait", desc:"Film-quality color grading, dramatic shadows",      sample:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=320&h=420&fit=crop" },
  { id:"minimal",    name:"Minimal Fine Art",   desc:"Clean studio portrait, editorial aesthetic",        sample:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&h=420&fit=crop" },
  { id:"vintage",    name:"Vintage Portrait",   desc:"Sepia-toned, aged textures, early photography",     sample:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=320&h=420&fit=crop" },
  { id:"holiday",    name:"Holiday Themed",     desc:"Seasonal settings: Christmas, spring, winter",      sample:"https://images.unsplash.com/photo-1554797589-7241bb691973?w=320&h=420&fit=crop" },
  { id:"fairytale",  name:"Children's Fairytale",desc:"Soft magical illustration, pastel palette",         sample:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=320&h=420&fit=crop" },
];

const TESTIMONIALS = [
  { name:"Sarah M.", role:"Pet Owner", cat:"Pets",    stars:5, text:"I ordered the Royal Portrait for my golden retriever and it now hangs as the centerpiece of my living room. I've gotten more compliments on that print than any real art I own.", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=faces" },
  { name:"Jessica T.", role:"New Mom", cat:"Babies",  stars:5, text:"My daughter's newborn photos became the most breathtaking portraits I've ever seen. I cried when I saw them. Ordered three frames before I even checked the price.", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=faces" },
  { name:"Marcus R.", role:"Entrepreneur", cat:"Adults", stars:5, text:"I used the Renaissance style for my headshot and it completely transformed my personal brand online. I get DMs about it every single week.", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces" },
  { name:"Camille D.", role:"Gift Buyer", cat:"Gifts",  stars:5, text:"Gave this to my mom for Christmas. She keeps it on her nightstand. Best gift I've ever given anyone, by a mile. Nothing else comes close.", avatar:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=faces" },
  { name:"The Williams Family", role:"Family Portrait", cat:"Families", stars:5, text:"We've never been able to afford a real family portrait session. This gave us something better than anything a photographer could have done.", avatar:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&crop=faces" },
  { name:"David K.", role:"Memorial", cat:"Memorial",  stars:5, text:"After losing our dog of 14 years, I used the Royal Portrait style. It hangs above our fireplace now. I'm so grateful something like this exists.", avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=faces" },
];

const FAQS = [
  { q:"How does it actually work?", a:"You upload a photo, choose a category and style, and our AI generates 6 stunning portrait versions in minutes. You get a free watermarked preview of all 6 before you decide to pay a single cent." },
  { q:"What photo should I upload?", a:"Any clear photo with a visible subject works. Better lighting and resolution = better results. You can upload up to 5 photos to give the AI more to work with, which improves accuracy significantly." },
  { q:"Do I see the portraits before I pay?", a:"Yes — always. You receive watermarked previews of all 6 styles completely free. You only pay to download the full-resolution, watermark-free files or to order prints." },
  { q:"What do I actually receive?", a:"Digital download: high-resolution files sent immediately by email. Fine art print: professionally printed and shipped in 5–7 days. Canvas: gallery-wrapped and shipped within 7–10 days." },
  { q:"Can I use my portraits commercially?", a:"Standard licenses cover personal use and social media. Commercial licenses (for ads, business branding, etc.) are available as an affordable add-on at checkout." },
  { q:"What's your satisfaction guarantee?", a:"If you're not in love with your portraits, we regenerate them or issue a full refund within 30 days. No questions, no hassle. We stand behind every portrait we create." },
  { q:"Do you ship prints internationally?", a:"Yes. We ship fine art prints and canvases to over 180 countries worldwide. Shipping times and costs vary by destination and are shown at checkout." },
  { q:"How long does AI generation take?", a:"Typically 2–5 minutes for all 6 styles. During peak hours it may take up to 10 minutes. You'll be shown a live progress indicator while your portraits are being created." },
];

const BEFORE_AFTERS = [
  {
    before:"https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=420&h=520&fit=crop",
    after: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=420&h=520&fit=crop",
    style:"Royal Portrait", cat:"Pets"
  },
  {
    before:"https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=420&h=520&fit=crop",
    after: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=420&h=520&fit=crop",
    style:"Renaissance", cat:"Adults"
  },
];

// ── COMPONENTS ──────────────────────────────────────────────

function GoldDivider({ mt=28, mb=0 }) {
  return <div className="divider-gold" style={{ marginTop:mt, marginBottom:mb }} />;
}

function SectionEyebrow({ children, align="center" }) {
  return <p className="section-eyebrow" style={{ textAlign:align, marginBottom:14 }}>{children}</p>;
}

// ── NAV ─────────────────────────────────────────────────────
function Navbar({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      background: scrolled ? "rgba(8,7,5,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition:"all 0.4s ease", padding:"0 40px",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto", height:72, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500, letterSpacing:"0.08em", color:C.cream, cursor:"pointer" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
          Digital<span style={{ color:C.gold }}>Photos</span><span style={{ fontSize:9, verticalAlign:"super", color:C.goldDim, marginLeft:3 }}>™</span>
        </div>
        {/* Desktop links */}
        <div className="hide-sm" style={{ display:"flex", gap:32, alignItems:"center" }}>
          {[["Gallery","gallery"],["Styles","styles"],["How It Works","how-it-works"],["Pricing","pricing"],["FAQ","faq"]].map(([l,id])=>(
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}>{l}</span>
          ))}
        </div>
        {/* CTA */}
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <span className="nav-link hide-sm" style={{ cursor:"pointer" }}>Sign In</span>
          <button className="btn-gold" style={{ padding:"10px 22px", fontSize:11 }} onClick={onStart}>
            Create Now
          </button>
          <button className="hide-sm" style={{ display:"none" }} onClick={() => setMenuOpen(true)}>
            <Menu size={18} color={C.creamMuted} />
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── HERO ────────────────────────────────────────────────────
function HeroSection({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const stats = [["50K+","Portraits Created"],["4.9★","Average Rating"],["180+","Styles & Themes"],["Free","Preview Always"]];

  return (
    <section style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:`radial-gradient(ellipse 90% 70% at 50% 35%, rgba(100,70,15,0.22) 0%, transparent 70%), ${C.bg}`,
    }}>
      {/* Horizontal lines texture */}
      <div style={{
        position:"absolute", inset:0, opacity:0.05,
        backgroundImage:`repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(196,150,58,0.6) 80px, rgba(196,150,58,0.6) 81px)`,
        pointerEvents:"none",
      }}/>
      {/* Ambient orbs */}
      <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(196,150,58,0.07) 0%,transparent 70%)", top:"-10%", left:"-15%", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(120,80,180,0.05) 0%,transparent 70%)", bottom:"5%", right:"-8%", pointerEvents:"none" }}/>
      {/* Grain */}
      <div className="grain" style={{ position:"absolute", inset:0 }}/>

      <div style={{ textAlign:"center", maxWidth:920, padding:"0 24px", position:"relative", zIndex:2 }}>
        {/* Eyebrow badge */}
        <div className={visible?"fade-up":""} style={{ opacity:visible?undefined:0, animationDelay:"0.1s",
          display:"inline-flex", alignItems:"center", gap:10, marginBottom:32,
          border:`1px solid rgba(196,150,58,0.25)`, padding:"8px 20px",
          fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold,
        }}>
          <Sparkles size={10} />
          AI-Powered Fine Art Photography Studio
          <Sparkles size={10} />
        </div>

        {/* Main headline */}
        <div className={visible?"fade-up":""} style={{ opacity:visible?undefined:0, animationDelay:"0.2s" }}>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(50px,9vw,118px)", fontWeight:300, lineHeight:0.92,
            color:C.cream, letterSpacing:"-0.02em", marginBottom:32,
          }}>
            Upload a Photo.<br />
            <span className="gold-shimmer">Get Back a</span><br />
            <em style={{ fontStyle:"italic" }}>Masterpiece.</em>
          </h1>
        </div>

        {/* Subheadline */}
        <div className={visible?"fade-up":""} style={{ opacity:visible?undefined:0, animationDelay:"0.38s" }}>
          <p style={{ fontSize:17, color:C.creamMuted, lineHeight:1.75, maxWidth:560, margin:"0 auto 48px", fontWeight:300 }}>
            AI portrait art in 6 stunning styles. Works for pets, babies, families, couples, and more.{" "}
            <strong style={{ color:C.cream, fontWeight:400 }}>Free watermarked preview before you pay — always.</strong>
          </p>
        </div>

        {/* CTAs */}
        <div className={visible?"fade-up":""} style={{ opacity:visible?undefined:0, animationDelay:"0.52s", display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-gold pulse-gold" style={{ padding:"18px 46px", fontSize:12, letterSpacing:"0.14em" }} onClick={onStart}>
            Create My Portrait — It's Free to Preview
          </button>
          <button className="btn-outline" style={{ padding:"18px 36px", fontSize:12 }} onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior:"smooth" })}>
            View Gallery
          </button>
        </div>

        {/* Trust strip */}
        <div className={visible?"fade-up":""} style={{ opacity:visible?undefined:0, animationDelay:"0.65s", marginTop:24, display:"flex", flexWrap:"wrap", gap:20, justifyContent:"center" }}>
          {[
            [Shield,     "Secure Checkout"],
            [RefreshCw,  "30-Day Guarantee"],
            [Truck,      "Ships Worldwide"],
            [Clock,      "Instant Delivery"],
          ].map(([Icon,label]) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:C.creamMuted }}>
              <Icon size={12} color={C.goldDim} />
              {label}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={visible?"fade-up":""} style={{ opacity:visible?undefined:0, animationDelay:"0.78s", marginTop:60, display:"flex", gap:48, justifyContent:"center", flexWrap:"wrap" }}>
          {stats.map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:300, color:C.cream }}>{n}</div>
              <div style={{ fontSize:10, color:C.creamMuted, letterSpacing:"0.15em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="float" style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)" }}>
        <ChevronDown size={18} color={C.goldDim} />
      </div>
    </section>
  );
}

// ── CATEGORIES ──────────────────────────────────────────────
function CategoriesSection({ onStart }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{ padding:"120px 40px", background:C.bgLight }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:70 }}>
          <SectionEyebrow>Choose Your Subject</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            Every Soul Deserves <em>Fine Art</em>
          </h2>
          <GoldDivider />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isHov = hovered === cat.id;
            return (
              <div
                key={cat.id}
                className="card-lift"
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={onStart}
                style={{
                  background: isHov ? C.goldBg : C.bgCard,
                  border:`1px solid ${isHov ? C.gold : C.border}`,
                  padding:"28px 24px", textAlign:"center",
                  transition:"all 0.35s",
                }}
              >
                <div style={{ width:48, height:48, border:`1px solid ${isHov ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", transition:"border-color 0.3s" }}>
                  <Icon size={18} color={isHov ? C.gold : C.creamMuted} />
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.cream, marginBottom:8 }}>{cat.label}</div>
                <div style={{ fontSize:12, color:C.creamMuted, lineHeight:1.5 }}>{cat.sub}</div>
                {isHov && (
                  <div style={{ marginTop:16, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:11, color:C.gold, letterSpacing:"0.1em" }}>
                    Create Now <ArrowRight size={11} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:"center", marginTop:50 }}>
          <p style={{ fontSize:13, color:C.creamMuted }}>Not sure? You can always create portraits in multiple categories.</p>
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ─────────────────────────────────────────────
function HowItWorksSection({ onStart }) {
  const steps = [
    { num:"01", icon:Upload,   title:"Upload Your Photos",        desc:"Upload 3–10 clear photos from your phone or computer. Better lighting = better portraits." },
    { num:"02", icon:Palette,  title:"Choose a Category & Style", desc:"Pick your subject type and one of 8 stunning AI art styles — or generate all of them at once." },
    { num:"03", icon:Sparkles, title:"AI Creates 6 Masterpieces", desc:"Receive 6 fully rendered portraits across different styles in under 5 minutes." },
    { num:"04", icon:Package,  title:"Download, Print or Frame",  desc:"Preview free. Unlock digital files, order fine art prints, or have a canvas shipped to your door." },
  ];

  return (
    <section id="how-it-works" style={{ padding:"120px 40px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:80 }}>
          <SectionEyebrow>The Process</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            Four Steps to <em>Something Extraordinary</em>
          </h2>
          <GoldDivider />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:48 }}>
          {steps.map((s,i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ position:"relative", width:56, height:56, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                  <Icon size={20} color={C.gold} />
                  <span style={{ position:"absolute", top:-13, right:-13, fontFamily:"'Cormorant Garamond',serif", fontSize:11, color:C.goldDim, letterSpacing:"0.1em" }}>{s.num}</span>
                </div>
                <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.border},transparent)`, marginBottom:24 }}/>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.cream, marginBottom:12 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:C.creamMuted, lineHeight:1.7 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign:"center", marginTop:60 }}>
          <button className="btn-gold" style={{ padding:"16px 42px", fontSize:12 }} onClick={onStart}>
            Start Creating — Free Preview
          </button>
        </div>
      </div>
    </section>
  );
}

// ── STYLE GALLERY ────────────────────────────────────────────
function StyleGallerySection({ onStart }) {
  const [active, setActive] = useState(0);

  return (
    <section id="styles" style={{ padding:"120px 40px", background:C.bgLight }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:70 }}>
          <SectionEyebrow>The Styles</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            Six Styles. One Upload. <em>All Yours.</em>
          </h2>
          <p style={{ color:C.creamMuted, fontSize:15, maxWidth:480, margin:"16px auto 0", lineHeight:1.7 }}>
            Every session generates portraits in multiple artistic styles simultaneously. Preview all of them free.
          </p>
          <GoldDivider />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {STYLES.map((style,i) => (
            <div
              key={style.id}
              className="card-lift"
              onClick={() => { setActive(i); onStart(); }}
              style={{ position:"relative", overflow:"hidden", cursor:"pointer", height: i%3===0 ? 380 : 320 }}
            >
              <img src={style.sample} alt={style.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.6s" }}/>
              {/* Watermark overlay simulation */}
              <div style={{
                position:"absolute", inset:0,
                backgroundImage:`repeating-linear-gradient(45deg, rgba(196,150,58,0.12) 0px, rgba(196,150,58,0.12) 1px, transparent 1px, transparent 36px), repeating-linear-gradient(-45deg, rgba(196,150,58,0.12) 0px, rgba(196,150,58,0.12) 1px, transparent 1px, transparent 36px)`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, color:"rgba(196,150,58,0.4)", letterSpacing:"0.3em", textTransform:"uppercase", transform:"rotate(-30deg)", userSelect:"none" }}>
                  DIGITAL PHOTOS
                </span>
              </div>
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(to top, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.2) 50%, transparent 100%)",
                display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"20px 18px",
              }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.cream, marginBottom:4 }}>{style.name}</div>
                <div style={{ fontSize:11, color:C.creamMuted }}>{style.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:48 }}>
          <button className="btn-gold" style={{ padding:"16px 40px", fontSize:11 }} onClick={onStart}>
            Generate All 8 Styles — Free Preview
          </button>
          <p style={{ color:C.creamMuted, fontSize:12, marginTop:12 }}>Watermark removed on purchase. Takes 2–5 minutes.</p>
        </div>
      </div>
    </section>
  );
}

// ── BEFORE/AFTER ─────────────────────────────────────────────
function BeforeAfterSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  const onMouseMove = (e) => { if (dragging) handleMove(e.clientX); };
  const onTouchMove = (e) => { handleMove(e.touches[0].clientX); };

  const pair = BEFORE_AFTERS[activeIdx];

  return (
    <section style={{ padding:"120px 40px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <SectionEyebrow>Transformations</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            Real Photos. <em>Real Results.</em>
          </h2>
          <p style={{ color:C.creamMuted, fontSize:14, marginTop:14 }}>Drag the slider to see the transformation.</p>
          <GoldDivider />
        </div>
        {/* Toggle */}
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:32 }}>
          {BEFORE_AFTERS.map((p,i) => (
            <button key={i} onClick={() => setActiveIdx(i)} className={i===activeIdx?"tab-btn active":"tab-btn"}>
              {p.cat} — {p.style}
            </button>
          ))}
        </div>
        {/* Slider */}
        <div
          ref={containerRef}
          className="before-after-container"
          style={{ height:520, cursor:"ew-resize" }}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
        >
          {/* Before */}
          <img src={pair.before} alt="Before" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          {/* After (clipped) */}
          <div style={{ position:"absolute", inset:0, clipPath:`inset(0 ${100-sliderPos}% 0 0)` }}>
            <img src={pair.after} alt="After" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
          {/* Slider handle */}
          <div className="before-after-slider" style={{ left:`${sliderPos}%` }}>
            <div className="before-after-handle">
              <ChevronRight size={10} color="#080705" style={{ marginLeft:-1 }}/>
            </div>
          </div>
          {/* Labels */}
          <div style={{ position:"absolute", top:16, left:16, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", background:"rgba(8,7,5,0.75)", color:C.creamMuted, padding:"5px 12px" }}>Original</div>
          <div style={{ position:"absolute", top:16, right:16, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", background:"rgba(196,150,58,0.8)", color:C.bg, padding:"5px 12px", fontWeight:600 }}>{pair.style}</div>
        </div>
      </div>
    </section>
  );
}

// ── GALLERY SECTION ───────────────────────────────────────────
function GallerySection({ onStart }) {
  const imgs = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=320&h=420&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=320&h=380&fit=crop",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=320&h=450&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=320&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=320&h=360&fit=crop",
    "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=320&h=440&fit=crop",
  ];
  return (
    <section id="gallery" style={{ padding:"120px 40px", background:C.bgLight }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <SectionEyebrow>Sample Portraits</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            The Art Speaks <em>for Itself</em>
          </h2>
          <GoldDivider />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
          {imgs.map((src,i) => (
            <div key={i} className="card-lift" onClick={onStart} style={{ position:"relative", overflow:"hidden", height: i%2===0?300:250, cursor:"pointer" }}>
              <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.5s" }}/>
              {/* Watermark */}
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:"0.25em", textTransform:"uppercase", transform:"rotate(-30deg)", userSelect:"none", whiteSpace:"nowrap" }}>DIGITAL PHOTOS</span>
              </div>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(8,7,5,0.8) 0%,transparent 60%)", opacity:0, transition:"opacity 0.4s" }}
                onMouseEnter={e => e.currentTarget.style.opacity="1"}
                onMouseLeave={e => e.currentTarget.style.opacity="0"}
              >
                <div style={{ position:"absolute", bottom:14, left:14, display:"flex", gap:8 }}>
                  <ZoomIn size={14} color={C.cream}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:40 }}>
          <p style={{ color:C.creamMuted, fontSize:13, marginBottom:20 }}>All portraits generated from real uploaded photos. Results are watermarked until purchased.</p>
          <button className="btn-gold" style={{ padding:"15px 40px", fontSize:11 }} onClick={onStart}>Unlock Your Portraits</button>
        </div>
      </div>
    </section>
  );
}

// ── SOCIAL PROOF ─────────────────────────────────────────────
function TestimonialsSection() {
  const [filter, setFilter] = useState("All");
  const cats = ["All","Pets","Babies","Adults","Gifts","Families","Memorial"];
  const filtered = filter==="All" ? TESTIMONIALS : TESTIMONIALS.filter(t=>t.cat===filter);

  return (
    <section style={{ padding:"120px 40px" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:50 }}>
          <SectionEyebrow>Reviews</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            They Ordered One.<br /><em>Then Ordered Ten More.</em>
          </h2>
          <GoldDivider mt={24} mb={32} />
          {/* Filter tabs */}
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding:"7px 18px", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase",
                background: filter===c ? C.gold : "transparent",
                border:`1px solid ${filter===c ? C.gold : C.border}`,
                color: filter===c ? C.bg : C.creamMuted,
                cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all 0.3s",
              }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {filtered.map((t,i) => (
            <div key={i} style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"32px 28px" }}>
              <div style={{ display:"flex", gap:3, marginBottom:18 }}>
                {Array(t.stars).fill(0).map((_,j) => <Star key={j} size={12} fill={C.gold} color={C.gold}/>)}
              </div>
              <p style={{ fontSize:14, color:C.creamMuted, lineHeight:1.8, marginBottom:24, fontStyle:"italic" }}>"{t.text}"</p>
              <div style={{ height:1, background:C.border, marginBottom:20 }}/>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <img src={t.avatar} alt={t.name} style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover", border:`1px solid ${C.border}` }}/>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.cream }}>{t.name}</div>
                  <div style={{ fontSize:10, color:C.creamMuted, letterSpacing:"0.1em" }}>{t.role}</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:10, color:C.gold, border:`1px solid ${C.goldDim}`, padding:"3px 10px", letterSpacing:"0.1em" }}>{t.cat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRICING OVERVIEW ─────────────────────────────────────────
function PricingSection({ onStart }) {
  const tiers = [
    {
      name:"Digital Download", price:29, desc:"All 6 portrait styles as high-resolution digital files. Delivered instantly to your inbox.",
      features:["All 6 AI portrait styles","HD download (print-ready)","Instant email delivery","Share to social media","Personal use license"],
      cta:"Get Digital Files",
    },
    {
      name:"Fine Art Print", price:89, desc:"Your favorite portrait professionally printed on archival paper and shipped to your door.",
      features:["All 6 digital files included","8×10\" or 11×14\" print","Archival 100-year inks","Museum-quality paper","Ships in 5–7 days"],
      cta:"Order Fine Art Print", popular:true,
    },
    {
      name:"Canvas Print", price:299, desc:"Gallery-wrapped canvas ready to hang. The ultimate statement piece for your home.",
      features:["All 6 digital files included","12×16\" to 24×30\" sizes","Gallery-wrapped edges","Ready to hang","Ships in 7–10 days"],
      cta:"Order Canvas Print",
    },
  ];

  return (
    <section id="pricing" style={{ padding:"120px 40px", background:C.bgLight }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:70 }}>
          <SectionEyebrow>Pricing</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,60px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            Choose Your <em>Product</em>
          </h2>
          <p style={{ color:C.creamMuted, fontSize:15, maxWidth:480, margin:"14px auto 0", lineHeight:1.7 }}>
            Always free to preview. Pay only when you love what you see.
          </p>
          <GoldDivider />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {tiers.map((tier,i) => (
            <div key={i} style={{
              background: tier.popular ? C.goldBg : C.bgCard,
              border:`1px solid ${tier.popular ? C.gold : C.border}`,
              padding:"40px 32px", position:"relative",
            }}>
              {tier.popular && (
                <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.bg, fontSize:9, fontWeight:700, letterSpacing:"0.2em", padding:"4px 16px", fontFamily:"'Outfit',sans-serif" }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:8 }}>Digital Photos™ —</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:C.cream, marginBottom:16 }}>{tier.name}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:12 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:56, fontWeight:300, color:C.cream }}>${tier.price}</span>
                <span style={{ color:C.creamMuted, fontSize:13 }}>one-time</span>
              </div>
              <p style={{ color:C.creamMuted, fontSize:13, lineHeight:1.6, marginBottom:28 }}>{tier.desc}</p>
              <div style={{ height:1, background:C.border, marginBottom:24 }}/>
              {tier.features.map(f => (
                <div key={f} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10, fontSize:13, color:C.creamMuted }}>
                  <Check size={12} color={C.gold} style={{ marginTop:2, flexShrink:0 }}/>
                  {f}
                </div>
              ))}
              <button
                className={tier.popular ? "btn-gold" : "btn-outline"}
                style={{ width:"100%", padding:"16px", fontSize:11, letterSpacing:"0.1em", marginTop:28 }}
                onClick={onStart}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", color:C.creamMuted, fontSize:12, marginTop:32 }}>
          All plans include: free watermarked preview · instant digital delivery · 30-day satisfaction guarantee
        </p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" style={{ padding:"120px 40px" }}>
      <div style={{ maxWidth:780, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,56px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
            Everything You <em>Want to Know</em>
          </h2>
          <GoldDivider />
        </div>
        {FAQS.map((faq,i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={() => setOpen(open===i ? null : i)}>
              <span>{faq.q}</span>
              {open===i ? <ChevronUp size={16} color={C.gold}/> : <ChevronDown size={16} color={C.creamMuted}/>}
            </button>
            <div className="faq-answer" style={{ maxHeight: open===i ? "200px" : "0", paddingBottom: open===i ? "20px" : "0" }}>
              <p style={{ color:C.creamMuted, fontSize:14, lineHeight:1.75 }}>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────
function FinalCTASection({ onStart }) {
  return (
    <section style={{
      padding:"120px 40px", textAlign:"center",
      background:`linear-gradient(135deg,rgba(196,150,58,0.1) 0%,rgba(100,70,15,0.06) 100%)`,
      borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth:780, margin:"0 auto" }}>
        <SectionEyebrow>Limited Time · No Subscription Needed</SectionEyebrow>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(40px,6vw,80px)", fontWeight:300, color:C.cream, lineHeight:1.0, marginTop:16, marginBottom:24 }}>
          The Most Beautiful Photo<br />You Own <em>Doesn't Exist Yet.</em>
        </h2>
        <p style={{ color:C.creamMuted, fontSize:16, maxWidth:480, margin:"0 auto 48px", lineHeight:1.7 }}>
          Upload a photo. Get back a masterpiece. See it free before you spend a single dollar.
        </p>
        <button className="btn-gold pulse-gold" style={{ padding:"20px 60px", fontSize:13, letterSpacing:"0.14em" }} onClick={onStart}>
          Create My Portrait — It's Free to Preview
        </button>
        <div style={{ marginTop:24, display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
          {[[Lock,"Secure Checkout"],[RefreshCw,"30-Day Guarantee"],[Truck,"Ships Worldwide"],[Clock,"Instant Digital Delivery"]].map(([Icon,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:C.creamMuted }}>
              <Icon size={11} color={C.goldDim}/>{l}
            </div>
          ))}
        </div>
        <p style={{ color:C.creamMuted, fontSize:12, marginTop:20 }}>
          <strong style={{ color:C.gold }}>2,847 portraits</strong> created in the last 24 hours.
        </p>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer({ onStart }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <footer style={{ padding:"60px 40px", borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:24, marginBottom:40 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.cream }}>
            Digital<span style={{ color:C.gold }}>Photos</span><span style={{ fontSize:9, verticalAlign:"super", color:C.goldDim }}>™</span>
          </div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
            {[["Gallery","gallery"],["Styles","styles"],["How It Works","how-it-works"],["Pricing","pricing"],["FAQ","faq"]].map(([l,id]) => (
              <span key={id} className="nav-link" onClick={() => scrollTo(id)} style={{ fontSize:11 }}>{l}</span>
            ))}
            <span className="nav-link" style={{ fontSize:11 }}>Privacy</span>
            <span className="nav-link" style={{ fontSize:11 }}>Terms</span>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            {[Instagram,Twitter,Facebook].map((Icon,i) => (
              <div key={i} style={{ width:32, height:32, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <Icon size={13} color={C.creamMuted}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, marginBottom:48 }}>
          {[
            { title:"Products", links:["Digital Download","Fine Art Print","Canvas Print","Gift Cards","Commercial License"] },
            { title:"Categories", links:["Pets","Babies","Adults","Couples","Families","Memorial","Gifts","Fantasy"] },
            { title:"Company", links:["About","Blog","Press","Careers","Partners"] },
            { title:"Support", links:["Help Center","Track Order","Refund Policy","Contact Us","Community Gallery"] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:16 }}>{col.title}</div>
              {col.links.map(l => <div key={l} style={{ fontSize:12, color:C.creamMuted, marginBottom:10, cursor:"pointer" }} className="nav-link">{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:28, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <span style={{ fontSize:11, color:C.creamMuted }}>© 2025 Digital Photos™. All rights reserved.</span>
          <span style={{ fontSize:11, color:C.goldDim }}>AI-Powered · Fine Art Quality · Yours Forever</span>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ASSEMBLY ─────────────────────────────────────────────
export default function Homepage() {
  // In Lovable, this would use useNavigate() to go to /create
  const handleStart = () => {
    // Replace with: navigate('/create')
    window.location.href = "/create";
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background:C.bg, minHeight:"100vh" }}>
        <Navbar onStart={handleStart} />
        <HeroSection onStart={handleStart} />
        <CategoriesSection onStart={handleStart} />
        <HowItWorksSection onStart={handleStart} />
        <StyleGallerySection onStart={handleStart} />
        <BeforeAfterSection />
        <GallerySection onStart={handleStart} />
        <TestimonialsSection />
        <PricingSection onStart={handleStart} />
        <FAQSection />
        <FinalCTASection onStart={handleStart} />
        <Footer onStart={handleStart} />
      </div>
    </>
  );
}
