// @ts-nocheck
// ============================================================
// DIGITAL PHOTOS™ — PHASE 2: CREATION FLOW
// This is a single-file multi-step flow.
// Copy this entire file into Lovable as: src/pages/Create.jsx
//
// STEPS:
//   1 → Category Selection
//   2 → Photo Upload
//   3 → Style Selection
//   4 → AI Generation (Loading)
//   5 → Watermarked Preview Results
//
// Navigation: After Step 5, user clicks "Unlock" → goes to /checkout
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Baby, Crown, Users, Star, Gift, Sparkles, Wand2,
  Upload, Camera, Image, X, Check, ChevronRight, ChevronLeft,
  ArrowRight, Lock, Shield, RefreshCw, Clock, ZoomIn,
  FrameIcon, Download, Share2, AlertCircle, Plus, Loader
} from "lucide-react";

// ── DESIGN TOKENS ──────────────────────────────────────────
const C = {
  bg:"#080705", bgCard:"#0F0D0A", bgLight:"#141109",
  cream:"#F2EDE4", creamMuted:"#B8B09A",
  gold:"#C4963A", goldLight:"#D4AE5C", goldDim:"#7A5C22", goldBg:"rgba(196,150,58,0.07)",
  border:"#1E1B14", borderLight:"#2A261D",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#080705; color:#F2EDE4; font-family:'Outfit',sans-serif; font-weight:300; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#C4963A; }
  .serif { font-family:'Cormorant Garamond',serif; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulseGold{ 0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,0.35)} 50%{box-shadow:0 0 0 16px rgba(196,150,58,0)} }
  @keyframes buildIn  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .fade-up  { animation:fadeUp 0.6s ease forwards; }
  .fade-in  { animation:fadeIn 0.6s ease forwards; }
  .spin     { animation:spin 1.2s linear infinite; }
  .pulse-gold { animation:pulseGold 2s infinite; }
  .build-in { animation:buildIn 0.5s ease forwards; }

  .gold-shimmer {
    background:linear-gradient(90deg,#C4963A,#F0D080,#C4963A,#A07030,#C4963A);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    animation:shimmer 3.5s linear infinite;
  }

  .btn-gold {
    background:linear-gradient(135deg,#C4963A,#E0B44A,#C4963A);
    color:#080705; border:none; cursor:pointer;
    font-family:'Outfit',sans-serif; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s;
  }
  .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(196,150,58,0.4); }
  .btn-gold:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }

  .btn-outline {
    background:transparent; border:1px solid #C4963A; color:#C4963A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-weight:400; letter-spacing:0.1em;
    text-transform:uppercase; transition:all 0.3s;
  }
  .btn-outline:hover { background:rgba(196,150,58,0.08); transform:translateY(-1px); }

  .btn-ghost {
    background:transparent; border:1px solid #1E1B14; color:#B8B09A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.3s;
  }
  .btn-ghost:hover { border-color:#2A261D; color:#F2EDE4; }

  .category-card {
    background:#0F0D0A; border:1px solid #1E1B14; cursor:pointer; text-align:center; padding:28px 20px;
    transition:all 0.35s cubic-bezier(0.23,1,0.32,1);
  }
  .category-card:hover  { border-color:rgba(196,150,58,0.4); transform:translateY(-4px); }
  .category-card.active { border-color:#C4963A; background:rgba(196,150,58,0.07); }

  .style-card {
    position:relative; overflow:hidden; cursor:pointer;
    transition:all 0.35s; border:2px solid transparent;
  }
  .style-card:hover { transform:translateY(-4px); }
  .style-card.active { border-color:#C4963A; }

  .drop-zone {
    border:2px dashed #2A261D; padding:60px 40px; text-align:center; cursor:pointer;
    transition:all 0.3s;
  }
  .drop-zone:hover, .drop-zone.dragging { border-color:#C4963A; background:rgba(196,150,58,0.04); }

  .photo-thumb { position:relative; overflow:hidden; aspect-ratio:1; }
  .photo-thumb-remove {
    position:absolute; top:6px; right:6px; width:22px; height:22px;
    background:rgba(8,7,5,0.85); border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity 0.2s;
  }
  .photo-thumb:hover .photo-thumb-remove { opacity:1; }

  .progress-step { display:flex; align-items:center; gap:12; }
  .progress-dot {
    width:8px; height:8px; border-radius:50%;
    background:#1E1B14; transition:all 0.4s;
    flex-shrink:0;
  }
  .progress-dot.done    { background:#C4963A; }
  .progress-dot.active  { background:#C4963A; box-shadow:0 0 0 4px rgba(196,150,58,0.25); animation:pulseGold 1.5s infinite; }

  .watermark-overlay {
    position:absolute; inset:0; pointer-events:none;
    display:flex; align-items:center; justify-content:center; overflow:hidden;
  }
  .watermark-text {
    font-family:'Cormorant Garamond',serif; font-size:13px; letter-spacing:0.3em;
    text-transform:uppercase; color:rgba(255,255,255,0.38); transform:rotate(-30deg);
    white-space:nowrap; user-select:none;
  }

  .portrait-card {
    position:relative; overflow:hidden; cursor:pointer;
    border:1px solid #1E1B14; transition:all 0.35s;
  }
  .portrait-card:hover { border-color:rgba(196,150,58,0.4); transform:translateY(-4px); }

  .social-ticker {
    overflow:hidden; white-space:nowrap;
  }
  .social-ticker-inner {
    display:inline-block; animation:ticker 30s linear infinite;
  }

  @media (max-width:768px) {
    .hide-sm { display:none !important; }
    .sm-col { flex-direction:column !important; }
    .sm-full { width:100% !important; }
  }
`;

// ── DATA ────────────────────────────────────────────────────
const CATEGORIES = [
  { id:"pets",     label:"Pets",           sub:"Fur babies deserve fine art",          icon:Heart },
  { id:"babies",   label:"Babies",         sub:"Tiny moments. Eternal memories.",      icon:Baby },
  { id:"adults",   label:"Adults",         sub:"You, reimagined as a masterpiece",     icon:Crown },
  { id:"couples",  label:"Couples",        sub:"Your love story. Painted by AI.",      icon:Heart },
  { id:"families", label:"Families",       sub:"Every face. One beautiful portrait.",  icon:Users },
  { id:"memorial", label:"Memorial",       sub:"Keep them close. Forever in art.",     icon:Star },
  { id:"gifts",    label:"Holiday Gifts",  sub:"The gift they'll never throw away",    icon:Gift },
  { id:"fantasy",  label:"Fantasy",        sub:"Step into another world entirely",     icon:Sparkles },
];

const STYLES = [
  { id:"royal",       name:"Royal Portrait",      desc:"Oil painting, regal costume, gold accents",      sample:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=280&h=340&fit=crop" },
  { id:"renaissance", name:"Renaissance",         desc:"Old Masters, dramatic chiaroscuro lighting",     sample:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=280&h=340&fit=crop" },
  { id:"storybook",   name:"Storybook Fantasy",   desc:"Fairy tale feel, soft magical atmosphere",       sample:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=280&h=340&fit=crop" },
  { id:"cinematic",   name:"Cinematic Portrait",  desc:"Film-quality color grade, dramatic shadows",     sample:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=280&h=340&fit=crop" },
  { id:"minimal",     name:"Minimal Fine Art",    desc:"Clean studio portrait, editorial aesthetic",     sample:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=280&h=340&fit=crop" },
  { id:"vintage",     name:"Vintage Portrait",    desc:"Sepia-toned, early photography textures",        sample:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=280&h=340&fit=crop" },
  { id:"holiday",     name:"Holiday Themed",      desc:"Seasonal settings: Christmas, winter, spring",   sample:"https://images.unsplash.com/photo-1554797589-7241bb691973?w=280&h=340&fit=crop" },
  { id:"fairytale",   name:"Children's Fairytale",desc:"Soft magical illustration, pastel palette",      sample:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=280&h=340&fit=crop" },
];

// Simulated portrait results (in production, these come from the AI API)
const MOCK_PORTRAITS = [
  { style:"Royal Portrait",      img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=360&h=450&fit=crop" },
  { style:"Renaissance",         img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=360&h=450&fit=crop" },
  { style:"Storybook Fantasy",   img:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=360&h=450&fit=crop" },
  { style:"Cinematic Portrait",  img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=360&h=450&fit=crop" },
  { style:"Minimal Fine Art",    img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=360&h=450&fit=crop" },
  { style:"Vintage Portrait",    img:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=360&h=450&fit=crop" },
];

const GENERATION_STEPS = [
  "Analyzing your photos...",
  "Training your personal AI model...",
  "Applying Royal Portrait style...",
  "Generating Renaissance composition...",
  "Creating Cinematic Portrait...",
  "Rendering Storybook Fantasy...",
  "Finishing Minimal Fine Art...",
  "Polishing final details...",
  "Your portraits are almost ready...",
];

const SOCIAL_TICKERS = [
  "Sarah in Austin just unlocked her portraits",
  "Marcus in London ordered a Canvas Print",
  "3 people unlocked portraits in the last hour",
  "Camille in Paris gifted a portrait session",
  "New mom in Chicago received her baby portraits",
  "Top style this week: Royal Portrait",
];

// ── STEP PROGRESS BAR ────────────────────────────────────────
function StepBar({ step }) {
  const steps = ["Category","Upload","Styles","Generating","Preview"];
  return (
    <div style={{ padding:"20px 40px", borderBottom:`1px solid ${C.border}`, background:C.bgCard }}>
      <div style={{ maxWidth:600, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {steps.map((s,i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={s} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                background: done ? C.gold : active ? "transparent" : "transparent",
                border: `2px solid ${done ? C.gold : active ? C.gold : C.border}`,
                transition:"all 0.4s",
              }}>
                {done ? <Check size={13} color={C.bg}/> : <span style={{ fontSize:12, color: active ? C.gold : C.creamMuted, fontWeight:500 }}>{num}</span>}
              </div>
              <span style={{ fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color: active ? C.gold : done ? C.goldDim : C.creamMuted }}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 1: CATEGORY SELECTION ────────────────────────────────
function CategoryStep({ onNext, selected, setSelected }) {
  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"60px 40px" }} className="fade-in">
      <div style={{ textAlign:"center", marginBottom:56 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:14 }}>Step 1 of 4</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,58px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
          Who is This Portrait <em>For?</em>
        </h1>
        <p style={{ color:C.creamMuted, fontSize:15, marginTop:14 }}>Choose a category to get started. You can create portraits in multiple categories.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selected === cat.id;
          return (
            <div
              key={cat.id}
              className={`category-card${isActive?" active":""}`}
              onClick={() => setSelected(cat.id)}
            >
              <div style={{ width:48, height:48, border:`1px solid ${isActive ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", transition:"all 0.3s" }}>
                <Icon size={18} color={isActive ? C.gold : C.creamMuted}/>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream, marginBottom:8 }}>{cat.label}</div>
              <div style={{ fontSize:11, color:C.creamMuted, lineHeight:1.5 }}>{cat.sub}</div>
              {isActive && (
                <div style={{ marginTop:14, width:24, height:24, background:C.gold, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"14px auto 0" }}>
                  <Check size={12} color={C.bg}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ textAlign:"center", marginTop:48 }}>
        <button className="btn-gold" style={{ padding:"18px 52px", fontSize:12 }} onClick={onNext} disabled={!selected}>
          Continue <ArrowRight size={14} style={{ display:"inline", marginLeft:8, verticalAlign:"middle" }}/>
        </button>
        {!selected && <p style={{ color:C.creamMuted, fontSize:12, marginTop:12 }}>Select a category to continue</p>}
      </div>
    </div>
  );
}

// ── STEP 2: PHOTO UPLOAD ──────────────────────────────────────
function UploadStep({ onNext, onBack, photos, setPhotos }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    setError("");
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) { setError("Please upload image files (JPG, PNG, HEIC, WEBP)."); return; }
    const newPhotos = valid.map(f => ({ file:f, preview:URL.createObjectURL(f), id:Math.random().toString(36).slice(2) }));
    setPhotos(prev => {
      const combined = [...prev, ...newPhotos];
      if (combined.length > 10) { setError("Maximum 10 photos allowed."); return prev; }
      return combined;
    });
  };

  const removePhoto = (id) => setPhotos(prev => prev.filter(p => p.id !== id));

  const tips = [
    { icon:"✓", label:"Clear, well-lit face photo", good:true },
    { icon:"✓", label:"Multiple photos = better results", good:true },
    { icon:"✓", label:"Front-facing preferred", good:true },
    { icon:"✗", label:"Avoid heavy filters", good:false },
    { icon:"✗", label:"Avoid group photos", good:false },
    { icon:"✗", label:"Avoid very dark or blurry", good:false },
  ];

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"60px 40px" }} className="fade-in">
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:14 }}>Step 2 of 4</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,5vw,54px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
          Upload Your <em>Photos</em>
        </h1>
        <p style={{ color:C.creamMuted, fontSize:14, marginTop:12 }}>Upload 3–10 photos. More photos = more accurate AI results.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:28 }}>
        {/* Upload zone */}
        <div>
          <div
            className={`drop-zone${dragging?" dragging":""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          >
            <Upload size={32} color={dragging ? C.gold : C.creamMuted} style={{ marginBottom:18 }}/>
            <p style={{ fontSize:16, color:C.cream, marginBottom:8 }}>Drag & drop your photos here</p>
            <p style={{ fontSize:13, color:C.creamMuted, marginBottom:20 }}>or click to browse your files</p>
            <button className="btn-outline" style={{ padding:"11px 28px", fontSize:11 }} onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
              Choose Photos
            </button>
            <p style={{ fontSize:11, color:C.creamMuted, marginTop:16 }}>JPG, PNG, HEIC, WEBP · Max 20MB each · Up to 10 photos</p>
          </div>
          <input ref={inputRef} type="file" multiple accept="image/*" style={{ display:"none" }} onChange={e => handleFiles(e.target.files)}/>

          {error && (
            <div style={{ marginTop:16, padding:"12px 16px", border:`1px solid rgba(200,80,80,0.3)`, background:"rgba(200,80,80,0.07)", display:"flex", gap:10, alignItems:"center" }}>
              <AlertCircle size={14} color="#E06060"/><span style={{ fontSize:13, color:"#E06060" }}>{error}</span>
            </div>
          )}

          {/* Photo thumbnails */}
          {photos.length > 0 && (
            <div style={{ marginTop:24 }}>
              <div style={{ fontSize:12, color:C.creamMuted, marginBottom:12, letterSpacing:"0.1em" }}>
                {photos.length} PHOTO{photos.length>1?"S":""} UPLOADED
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                {photos.map(p => (
                  <div key={p.id} className="photo-thumb">
                    <img src={p.preview} alt="" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }}/>
                    <button className="photo-thumb-remove" onClick={() => removePhoto(p.id)}>
                      <X size={10} color={C.cream}/>
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <div onClick={() => inputRef.current?.click()} style={{ aspectRatio:"1", border:`1px dashed ${C.borderLight}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:C.bgCard, transition:"border-color 0.3s" }}>
                    <Plus size={18} color={C.creamMuted}/>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tips panel */}
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"28px 24px" }}>
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:18 }}>Photo Tips</div>
          <div style={{ marginBottom:24 }}>
            {tips.map((t,i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10, fontSize:12, color: t.good ? C.creamMuted : "rgba(200,100,100,0.8)" }}>
                <span style={{ color: t.good ? C.gold : "rgba(200,100,100,0.8)", flexShrink:0 }}>{t.icon}</span>
                {t.label}
              </div>
            ))}
          </div>
          <div style={{ height:1, background:C.border, marginBottom:20 }}/>
          <div style={{ fontSize:10, letterSpacing:"0.15em", color:C.gold, textTransform:"uppercase", marginBottom:12 }}>Best Results</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {["Clear face","Good lighting","Multiple angles","No heavy filters"].map(t => (
              <div key={t} style={{ background:C.bg, border:`1px solid ${C.border}`, padding:"8px 10px", fontSize:10, color:C.creamMuted, textAlign:"center" }}>
                {t}
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:"14px", border:`1px solid ${C.border}`, background:C.bg }}>
            <div style={{ fontSize:11, color:C.cream, marginBottom:4 }}>Privacy Promise</div>
            <div style={{ fontSize:11, color:C.creamMuted, lineHeight:1.6 }}>Your photos are used only to create your portraits and deleted within 30 days.</div>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:48 }}>
        <button className="btn-ghost" style={{ padding:"14px 28px" }} onClick={onBack}>
          <ChevronLeft size={14} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }}/>Back
        </button>
        <button className="btn-gold" style={{ padding:"18px 52px", fontSize:12 }} onClick={onNext} disabled={photos.length < 1}>
          Continue to Style Selection <ArrowRight size={14} style={{ display:"inline", marginLeft:8, verticalAlign:"middle" }}/>
        </button>
      </div>
      {photos.length < 3 && photos.length > 0 && (
        <p style={{ textAlign:"right", color:C.creamMuted, fontSize:12, marginTop:10 }}>
          Tip: Upload at least 3 photos for the best portrait quality.
        </p>
      )}
    </div>
  );
}

// ── STEP 3: STYLE SELECTION ────────────────────────────────────
function StyleStep({ onNext, onBack, selectedStyles, setSelectedStyles }) {
  const allSelected = selectedStyles.length === STYLES.length;

  const toggleStyle = (id) => {
    if (id === "all") {
      setSelectedStyles(allSelected ? [] : STYLES.map(s => s.id));
      return;
    }
    setSelectedStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"60px 40px" }} className="fade-in">
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:14 }}>Step 3 of 4</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,5vw,54px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
          Choose Your <em>Styles</em>
        </h1>
        <p style={{ color:C.creamMuted, fontSize:14, marginTop:12 }}>Select individual styles or generate all 8 at once for the full experience.</p>
      </div>

      {/* Select All Banner */}
      <div
        onClick={() => toggleStyle("all")}
        style={{
          border:`1px solid ${allSelected ? C.gold : C.border}`,
          background: allSelected ? C.goldBg : C.bgCard,
          padding:"18px 24px", marginBottom:24, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
          transition:"all 0.3s",
        }}
      >
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:28, height:28, background: allSelected ? C.gold : "transparent", border:`2px solid ${allSelected ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
            {allSelected && <Check size={13} color={C.bg}/>}
          </div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream }}>Generate All 8 Styles</div>
            <div style={{ fontSize:12, color:C.creamMuted, marginTop:2 }}>Recommended — see all options before deciding what to purchase</div>
          </div>
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.bg, fontSize:9, fontWeight:700, letterSpacing:"0.2em", padding:"5px 14px", fontFamily:"'Outfit',sans-serif" }}>
          BEST VALUE
        </div>
      </div>

      {/* Style grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {STYLES.map(style => {
          const isActive = selectedStyles.includes(style.id);
          return (
            <div key={style.id} className={`style-card${isActive?" active":""}`} onClick={() => toggleStyle(style.id)} style={{ borderColor: isActive ? C.gold : "transparent" }}>
              <div style={{ position:"relative", height:240 }}>
                <img src={style.sample} alt={style.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                {/* Watermark */}
                <div className="watermark-overlay">
                  <span className="watermark-text" style={{ fontSize:"10px" }}>DIGITAL PHOTOS</span>
                </div>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(8,7,5,0.85) 0%,transparent 60%)" }}/>
                {isActive && (
                  <div style={{ position:"absolute", top:10, right:10, width:26, height:26, borderRadius:"50%", background:C.gold, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Check size={12} color={C.bg}/>
                  </div>
                )}
                <div style={{ position:"absolute", bottom:12, left:14, right:14 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.cream, marginBottom:3 }}>{style.name}</div>
                  <div style={{ fontSize:10, color:C.creamMuted }}>{style.desc}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:16, fontSize:12, color:C.creamMuted, textAlign:"center" }}>
        {selectedStyles.length} style{selectedStyles.length !== 1 ?"s":"" } selected
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:44 }}>
        <button className="btn-ghost" style={{ padding:"14px 28px" }} onClick={onBack}>
          <ChevronLeft size={14} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }}/>Back
        </button>
        <button className="btn-gold" style={{ padding:"18px 52px", fontSize:12 }} onClick={onNext} disabled={selectedStyles.length === 0}>
          Generate My Portraits <Sparkles size={14} style={{ display:"inline", marginLeft:8, verticalAlign:"middle" }}/>
        </button>
      </div>
    </div>
  );
}

// ── STEP 4: GENERATION LOADING ────────────────────────────────
function LoadingStep({ onComplete, selectedStyles }) {
  const [progress, setProgress] = useState(0);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [completedStyles, setCompletedStyles] = useState([]);
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);

  useEffect(() => {
    // Simulate generation progress
    const totalTime = 12000; // 12 seconds for demo
    const interval = 120;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / totalTime) * 100, 100);
      setProgress(pct);

      // Update message
      const msgIdx = Math.floor((pct / 100) * GENERATION_STEPS.length);
      setCurrentMsg(Math.min(msgIdx, GENERATION_STEPS.length - 1));

      // Add completed styles
      const stylesCompleted = Math.floor((pct / 100) * Math.min(selectedStyles.length, 6));
      setCompletedStyles(STYLES.slice(0, stylesCompleted));

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(onComplete, 800);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const tickers = SOCIAL_TICKERS.join("   ·   ");

  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"80px 40px", textAlign:"center" }} className="fade-in">
      {/* Logo-ish loading indicator */}
      <div style={{ width:72, height:72, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 36px", position:"relative" }}>
        <Wand2 size={28} color={C.gold}/>
        <div className="spin" style={{ position:"absolute", inset:-1, border:"2px solid transparent", borderTopColor:C.gold, borderRadius:0 }}/>
      </div>

      <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,5vw,52px)", fontWeight:300, color:C.cream, lineHeight:1.1, marginBottom:14 }}>
        Creating Your <span className="gold-shimmer">Masterpieces</span>
      </h1>
      <p style={{ color:C.creamMuted, fontSize:15, marginBottom:48 }}>
        Our AI is rendering your portraits in every selected style. This takes 2–5 minutes.
      </p>

      {/* Progress bar */}
      <div style={{ background:C.border, height:3, marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.goldLight})`, width:`${progress}%`, transition:"width 0.3s ease" }}/>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:36 }}>
        <p style={{ fontSize:13, color:C.creamMuted }}>{GENERATION_STEPS[currentMsg]}</p>
        <p style={{ fontSize:13, color:C.gold, fontWeight:500 }}>{Math.round(progress)}%</p>
      </div>

      {/* Style progress indicators */}
      {selectedStyles.length > 0 && (
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"24px", marginBottom:36 }}>
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.creamMuted, textTransform:"uppercase", marginBottom:18 }}>Portrait Progress</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {STYLES.slice(0, Math.min(selectedStyles.length, 6)).map((style,i) => {
              const isDone = completedStyles.find(s => s.id === style.id);
              return (
                <div key={style.id} style={{ position:"relative", overflow:"hidden" }}>
                  <div style={{
                    height:90, background: isDone ? "transparent" : C.bg,
                    border:`1px solid ${isDone ? C.gold : C.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all 0.5s",
                    overflow:"hidden",
                  }}>
                    {isDone ? (
                      <div className="build-in">
                        <img src={style.sample} alt="" style={{ width:"100%", height:90, objectFit:"cover", display:"block", opacity:0.5 }}/>
                        <div className="watermark-overlay"><span className="watermark-text" style={{ fontSize:"8px" }}>DIGITAL PHOTOS</span></div>
                      </div>
                    ) : (
                      <div style={{ textAlign:"center" }}>
                        <Loader size={16} color={C.border} className="spin"/>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize:10, color: isDone ? C.gold : C.creamMuted, marginTop:6, letterSpacing:"0.05em", textAlign:"center" }}>
                    {isDone ? "✓ " : ""}{style.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Email capture */}
      {!emailSaved && (
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"20px 24px", marginBottom:28 }}>
          <p style={{ fontSize:13, color:C.cream, marginBottom:14 }}>
            Get notified when your portraits are ready (and save a backup to your inbox):
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={emailCapture}
              onChange={e => setEmailCapture(e.target.value)}
              style={{ flex:1, padding:"10px 14px", fontSize:13, border:`1px solid ${C.border}`, background:C.bg, color:C.cream, outline:"none", fontFamily:"'Outfit',sans-serif" }}
            />
            <button className="btn-outline" style={{ padding:"10px 20px", fontSize:11 }} onClick={() => { if (emailCapture.includes("@")) setEmailSaved(true); }}>
              Notify Me
            </button>
          </div>
        </div>
      )}
      {emailSaved && (
        <div style={{ background:"rgba(40,120,60,0.1)", border:"1px solid rgba(40,120,60,0.3)", padding:"14px 20px", marginBottom:28, display:"flex", gap:10, alignItems:"center" }}>
          <Check size={14} color="#5DBB7A"/>
          <span style={{ fontSize:13, color:"#5DBB7A" }}>You'll receive your portraits at {emailCapture}</span>
        </div>
      )}

      {/* Social proof ticker */}
      <div className="social-ticker" style={{ borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
        <div className="social-ticker-inner">
          <span style={{ fontSize:11, color:C.creamMuted }}>{tickers}   ·   {tickers}</span>
        </div>
      </div>
    </div>
  );
}

// ── STEP 5: WATERMARKED PREVIEW RESULTS ───────────────────────
function PreviewStep({ onUnlock, onBack, category }) {
  const [timeLeft, setTimeLeft] = useState(47 * 3600 + 32 * 60 + 15);
  const [selectedPreview, setSelectedPreview] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const catLabel = CATEGORIES.find(c => c.id === category)?.label || "Portrait";

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"50px 40px" }} className="fade-in">
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:12 }}>Your Portraits Are Ready</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:300, color:C.cream, lineHeight:1.0, marginBottom:14 }}>
          We Made Something <em>Beautiful.</em>
        </h1>
        <p style={{ color:C.creamMuted, fontSize:15 }}>
          {MOCK_PORTRAITS.length} stunning {catLabel} portraits are ready. Unlock all of them in full resolution below.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32, alignItems:"start" }}>
        {/* Portrait grid */}
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {MOCK_PORTRAITS.map((p,i) => (
              <div
                key={i}
                className="portrait-card"
                onClick={() => setSelectedPreview(i === selectedPreview ? null : i)}
                style={{ borderColor: i === selectedPreview ? C.gold : C.border }}
              >
                <div style={{ position:"relative", height:260 }}>
                  <img src={p.img} alt={p.style} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                  {/* Watermark */}
                  <div className="watermark-overlay">
                    <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center" }}>
                      {[-30,-10,10,30].map(deg => (
                        <span key={deg} className="watermark-text" style={{ fontSize:"11px", transform:`rotate(${deg}deg)` }}>
                          DIGITAL PHOTOS
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Lock overlay */}
                  <div style={{ position:"absolute", inset:0, background:"rgba(8,7,5,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:36, height:36, background:"rgba(8,7,5,0.7)", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Lock size={14} color={C.creamMuted}/>
                    </div>
                  </div>
                  {i === selectedPreview && (
                    <div style={{ position:"absolute", top:10, right:10, width:24, height:24, background:C.gold, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Check size={11} color={C.bg}/>
                    </div>
                  )}
                </div>
                <div style={{ padding:"12px 14px", background:C.bgCard }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.cream }}>{p.style}</div>
                  <div style={{ fontSize:10, color:C.creamMuted, marginTop:2 }}>Preview · Watermarked</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:16, padding:"16px 20px", border:`1px solid ${C.border}`, background:C.bgCard, display:"flex", gap:12, alignItems:"center" }}>
            <Lock size={14} color={C.goldDim}/>
            <span style={{ fontSize:13, color:C.creamMuted }}>
              All portraits are watermarked. Unlock to download full-resolution files or order prints.
            </span>
          </div>
        </div>

        {/* Unlock sidebar */}
        <div style={{ position:"sticky", top:100 }}>
          {/* Countdown */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"20px 22px", marginBottom:16, display:"flex", gap:14, alignItems:"center" }}>
            <Clock size={16} color={C.gold}/>
            <div>
              <div style={{ fontSize:11, color:C.creamMuted, marginBottom:3 }}>Previews saved for</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.cream }}>{fmt(timeLeft)}</div>
            </div>
          </div>

          {/* Social proof */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"14px 22px", marginBottom:20, fontSize:12, color:C.creamMuted }}>
            <strong style={{ color:C.gold }}>412 people</strong> unlocked their portraits today
          </div>

          {/* Unlock card */}
          <div style={{ background:C.goldBg, border:`1px solid ${C.gold}`, padding:"28px 24px" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:C.cream, marginBottom:6 }}>
              Unlock Your Portraits
            </div>
            <div style={{ fontSize:13, color:C.creamMuted, marginBottom:24, lineHeight:1.6 }}>
              Get all {MOCK_PORTRAITS.length} portraits in full HD — watermark-free. Download instantly or order a print.
            </div>

            {/* Price anchoring */}
            <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:8 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:44, fontWeight:300, color:C.cream }}>$29</span>
              <span style={{ textDecoration:"line-through", color:C.creamMuted, fontSize:16 }}>$58</span>
              <span style={{ fontSize:11, color:"#5DBB7A", border:"1px solid rgba(93,187,122,0.3)", padding:"2px 8px" }}>SAVE 50%</span>
            </div>
            <p style={{ fontSize:12, color:C.creamMuted, marginBottom:24 }}>Digital download · All {MOCK_PORTRAITS.length} styles · Instant delivery</p>

            <button className="btn-gold pulse-gold" style={{ width:"100%", padding:"18px", fontSize:12, letterSpacing:"0.12em", marginBottom:12 }} onClick={onUnlock}>
              Unlock My Portraits — $29
            </button>
            <button className="btn-outline" style={{ width:"100%", padding:"14px", fontSize:11 }} onClick={onUnlock}>
              See All Product Options
            </button>

            {/* What you get */}
            <div style={{ marginTop:20 }}>
              {[
                [Check, `All ${MOCK_PORTRAITS.length} AI portraits watermark-free`],
                [Check, "Full HD resolution (print-ready)"],
                [Check, "Instant delivery to your email"],
                [Check, "Share to social media"],
                [RefreshCw, "30-day satisfaction guarantee"],
              ].map(([Icon,text],i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginTop:10, fontSize:12, color:C.creamMuted }}>
                  <Icon size={11} color={C.gold} style={{ marginTop:2, flexShrink:0 }}/>{text}
                </div>
              ))}
            </div>
          </div>

          {/* Gift option */}
          <div style={{ marginTop:14, padding:"14px 18px", border:`1px solid ${C.border}`, background:C.bgCard, display:"flex", gap:12, alignItems:"center", cursor:"pointer" }} onClick={onUnlock}>
            <Gift size={14} color={C.gold}/>
            <div>
              <div style={{ fontSize:13, color:C.cream }}>Give as a gift</div>
              <div style={{ fontSize:11, color:C.creamMuted }}>Send to anyone via email with a personal message</div>
            </div>
            <ChevronRight size={13} color={C.creamMuted} style={{ marginLeft:"auto" }}/>
          </div>

          {/* Print upsell teaser */}
          <div style={{ marginTop:10, padding:"14px 18px", border:`1px solid ${C.border}`, background:C.bgCard, cursor:"pointer" }} onClick={onUnlock}>
            <div style={{ fontSize:11, color:C.gold, marginBottom:4 }}>Also available as:</div>
            <div style={{ display:"flex", gap:16, fontSize:12, color:C.creamMuted }}>
              <span>Fine Art Print from $59</span>
              <span>·</span>
              <span>Canvas from $149</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ marginTop:48, textAlign:"center", padding:"40px", border:`1px solid ${C.border}`, background:C.bgCard }}>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:C.cream, marginBottom:12 }}>
          Ready to Make Them Permanent?
        </h3>
        <p style={{ color:C.creamMuted, fontSize:14, maxWidth:480, margin:"0 auto 24px" }}>
          Unlock the full-resolution watermark-free files, or skip straight to ordering a fine art print or canvas.
        </p>
        <button className="btn-gold" style={{ padding:"18px 52px", fontSize:12 }} onClick={onUnlock}>
          See Pricing & Unlock Options
        </button>
      </div>
    </div>
  );
}

// ── MAIN CREATION FLOW ─────────────────────────────────────────
export default function CreateFlow() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState(STYLES.map(s => s.id)); // all by default

  // In Lovable, replace with: const navigate = useNavigate()
  const goToCheckout = () => { window.location.href = "/checkout"; };
  const goHome = () => { window.location.href = "/"; };

  const nextStep = () => { setStep(s => s + 1); window.scrollTo({top:0,behavior:"smooth"}); };
  const prevStep = () => { setStep(s => s - 1); window.scrollTo({top:0,behavior:"smooth"}); };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:C.bg, minHeight:"100vh" }}>
        {/* Top nav */}
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(8,7,5,0.97)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"0 40px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream, cursor:"pointer" }} onClick={goHome}>
              Digital<span style={{ color:C.gold }}>Photos</span><span style={{ fontSize:9, verticalAlign:"super", color:C.goldDim }}>™</span>
            </div>
            <div style={{ display:"flex", gap:20, alignItems:"center" }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", fontSize:12, color:C.creamMuted }}>
                <Shield size={12} color={C.goldDim}/>Secure & Private
              </div>
              <button className="btn-ghost" style={{ padding:"8px 16px" }} onClick={goHome}>
                <X size={13} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }}/>Exit
              </button>
            </div>
          </div>
        </div>

        {/* Step progress bar */}
        <div style={{ paddingTop:64 }}>
          <StepBar step={step}/>
        </div>

        {/* Step content */}
        <div>
          {step === 1 && <CategoryStep onNext={nextStep} selected={category} setSelected={setCategory}/>}
          {step === 2 && <UploadStep onNext={nextStep} onBack={prevStep} photos={photos} setPhotos={setPhotos}/>}
          {step === 3 && <StyleStep onNext={nextStep} onBack={prevStep} selectedStyles={selectedStyles} setSelectedStyles={setSelectedStyles}/>}
          {step === 4 && <LoadingStep onComplete={nextStep} selectedStyles={selectedStyles}/>}
          {step === 5 && <PreviewStep onUnlock={goToCheckout} onBack={() => setStep(3)} category={category}/>}
        </div>
      </div>
    </>
  );
}
