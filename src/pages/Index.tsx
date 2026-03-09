import { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, X, Check, ChevronRight, ChevronDown, Download,
  Printer, FrameIcon, Share2, Heart, Truck, RefreshCw,
  Clock, Gift, Sparkles, Copy, AlertCircle, Lock, Wand2, Shield
} from "lucide-react";

// ─── CSS ───────────────────────────────────────────────────────
const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700;1,900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#07060A;color:#EAE6DF;font-family:'DM Sans',sans-serif;font-weight:300;overflow-x:hidden}
::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:#C4963A}
@keyframes fadeUp   {from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes scaleIn  {from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes shimmer  {0%{background-position:-300% center}100%{background-position:300% center}}
@keyframes spin     {from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes drift    {0%{transform:translateX(0) rotate(-20deg)}100%{transform:translateX(-50%) rotate(-20deg)}}
@keyframes float    {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse    {0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,.4)}50%{box-shadow:0 0 0 18px rgba(196,150,58,0)}}
@keyframes buildThumb{from{opacity:0;transform:scale(.85) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
.fu{animation:fadeUp .7s ease both}
.fi{animation:fadeIn .5s ease both}
.si{animation:scaleIn .6s cubic-bezier(.23,1,.32,1) both}
.spin{animation:spin 1.1s linear infinite}
.float{animation:float 5s ease-in-out infinite}
.pulse-gold{animation:pulse 2s infinite}
.bt{animation:buildThumb .45s cubic-bezier(.23,1,.32,1) both}
.gold-text{background:linear-gradient(90deg,#C4963A 0%,#EDD07A 38%,#C4963A 60%,#A07828 80%,#DDB04E 100%);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite}
.btn-gold{background:linear-gradient(135deg,#C4963A,#E0B44A 50%,#C4963A);color:#07060A;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;letter-spacing:.07em;text-transform:uppercase;transition:all .3s}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(196,150,58,.45)}
.btn-gold:active{transform:translateY(0)}
.btn-gold:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
.btn-outline{background:transparent;border:1px solid rgba(196,150,58,.4);color:#C4963A;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:400;letter-spacing:.07em;text-transform:uppercase;transition:all .3s}
.btn-outline:hover{background:rgba(196,150,58,.07);border-color:#C4963A}
.btn-ghost{background:transparent;border:1px solid #1E1A14;color:#7A7060;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:.07em;text-transform:uppercase;transition:all .3s}
.btn-ghost:hover{border-color:rgba(196,150,58,.3);color:#EAE6DF}
.cat-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:400;transition:all .22s;border:1px solid #1E1A14;background:#0D0C10;color:#7A7060;white-space:nowrap}
.cat-btn:hover{border-color:rgba(196,150,58,.35);color:#EAE6DF}
.cat-btn.on{border-color:#C4963A;background:rgba(196,150,58,.08);color:#C4963A;font-weight:500}
.style-toggle{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;transition:all .22s;border:1px solid #1E1A14;background:#0D0C10;color:#7A7060;white-space:nowrap}
.style-toggle:hover{border-color:rgba(196,150,58,.3);color:#EAE6DF}
.style-toggle.on{border-color:rgba(196,150,58,.5);background:rgba(196,150,58,.07);color:#EAE6DF}
.drop-zone{border:1.5px dashed #252018;text-align:center;cursor:pointer;transition:all .3s;background:#09080C;position:relative;overflow:hidden}
.drop-zone.hovering{border-color:rgba(196,150,58,.55);background:rgba(196,150,58,.04)}
.step-dot{width:6px;height:6px;border-radius:50%;transition:all .4s;flex-shrink:0}
.step-dot.done{background:#C4963A}
.step-dot.active{background:#C4963A;box-shadow:0 0 0 5px rgba(196,150,58,.2)}
.step-dot.todo{background:#252018}
.portrait-tile{position:relative;overflow:hidden;cursor:pointer;transition:transform .4s cubic-bezier(.23,1,.32,1)}
.portrait-tile:hover{transform:translateY(-5px)}
.portrait-tile img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.82);transition:filter .4s}
.portrait-tile:hover img{filter:brightness(.95)}
.before-after{position:relative;overflow:hidden;user-select:none;cursor:ew-resize}
.faq-row{border-bottom:1px solid #1A1715}
.faq-btn{width:100%;background:none;border:none;cursor:pointer;text-align:left;padding:20px 0;display:flex;justify-content:space-between;align-items:center;font-family:'DM Sans',sans-serif;font-size:14px;color:#EAE6DF;font-weight:400}
.price-card{border:1.5px solid #1E1A14;transition:all .35s cubic-bezier(.23,1,.32,1);position:relative;overflow:hidden;cursor:pointer}
.price-card:hover{border-color:rgba(196,150,58,.4);transform:translateY(-4px)}
.price-card.sel{border-color:#C4963A;background:rgba(196,150,58,.05)}
.wm-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.wm-row{position:absolute;white-space:nowrap;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:rgba(255,255,255,.24);animation:drift 22s linear infinite;width:200%}
.sz-btn{padding:6px 13px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;border-radius:5px;transition:all .2s}
.sz-on{border:1px solid #C4963A;background:rgba(196,150,58,.1);color:#C4963A}
.sz-off{border:1px solid #1E1A14;background:transparent;color:#7A7060}
.sz-off:hover{border-color:rgba(196,150,58,.35);color:#EAE6DF}
.thumb-strip{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.thumb-strip::-webkit-scrollbar{height:2px}
.thumb-strip::-webkit-scrollbar-thumb{background:#C4963A}
@media(max-width:860px){.hero-grid{grid-template-columns:1fr!important}.hide-sm{display:none!important}}
`;

// ─── DATA ──────────────────────────────────────────────────────
const CATS = [
  { id:"pets",label:"Pets",emoji:"🐾" },
  { id:"babies",label:"Babies",emoji:"🍼" },
  { id:"adults",label:"Adults",emoji:"👤" },
  { id:"couples",label:"Couples",emoji:"💑" },
  { id:"families",label:"Families",emoji:"🏡" },
  { id:"memorial",label:"Memorial",emoji:"✦" },
];

const STYLES_LIST = [
  { id:"royal",label:"Royal",preview:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=480&h=600&fit=crop" },
  { id:"renaissance",label:"Renaissance",preview:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=600&fit=crop" },
  { id:"storybook",label:"Storybook",preview:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=480&h=600&fit=crop" },
  { id:"fantasy",label:"Fantasy",preview:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=480&h=600&fit=crop" },
  { id:"cinematic",label:"Cinematic",preview:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=480&h=600&fit=crop" },
  { id:"minimal",label:"Minimal",preview:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=480&h=600&fit=crop" },
];

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=360&h=460&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=360&h=380&fit=crop",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=360&h=440&fit=crop",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=360&h=400&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=360&h=460&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=360&h=380&fit=crop",
];

const TESTIMONIALS = [
  { name:"Sarah M.",role:"Pet Owner",text:"The Royal Portrait of my golden retriever is now the centerpiece of my living room. More compliments than any real art I own." },
  { name:"Jessica T.",role:"New Mom",text:"My daughter's newborn photos became the most breathtaking portraits I've ever seen. Ordered three frames before I checked the price." },
  { name:"Marcus R.",role:"Entrepreneur",text:"Used the Renaissance style for my personal brand. I get DMs about it every single week. Worth every penny." },
  { name:"Camille D.",role:"Gift Buyer",text:"Gave this to my mom for Christmas. She keeps it on her nightstand. Best gift I've ever given anyone." },
];

const FAQS = [
  { q:"How does it actually work?",a:"Upload a photo, pick a category and style, and our AI generates stunning portrait artwork in minutes. You get a free watermarked preview of every style before paying." },
  { q:"Do I see the portraits before I pay?",a:"Always. You receive watermarked previews completely free. You only pay to download full-resolution files or order prints." },
  { q:"What photo should I upload?",a:"Any clear photo with a visible subject works. Better lighting and resolution = better results. You can upload multiple photos for higher accuracy." },
  { q:"What do I receive?",a:"Digital: high-resolution files sent instantly by email. Fine art print: professionally printed and shipped in 5–7 days. Canvas: gallery-wrapped, ships in 7–10 days." },
  { q:"What's your satisfaction guarantee?",a:"If you're not in love with your portraits, we regenerate them or issue a full refund within 30 days. No questions, no hassle." },
];

const GEN_MSGS = [
  "Analyzing your photo…","Training your personal AI model…","Applying Royal Portrait style…",
  "Generating Renaissance…","Crafting Storybook Fantasy…","Building Cinematic look…",
  "Rendering Minimal Fine Art…","Adding finishing details…","Almost ready…",
];

const D = {
  bg:"#07060A",surface:"#0D0C10",card:"#111019",
  border:"#1E1A14",borderGold:"rgba(196,150,58,.35)",
  cream:"#EAE6DF",muted:"#7A7060",dim:"#3A3428",
  gold:"#C4963A",goldLight:"#DDB04E",goldBg:"rgba(196,150,58,.06)",
};

// ─── SHARED ATOMS ──────────────────────────────────────────────
function Divider() {
  return <div style={{ width:52,height:1,background:"linear-gradient(90deg,transparent,#C4963A,transparent)",margin:"0 auto" }}/>;
}
function Eyebrow({ children }) {
  return <p style={{ fontSize:10,letterSpacing:".3em",textTransform:"uppercase",color:D.gold,fontWeight:500,textAlign:"center",marginBottom:14 }}>{children}</p>;
}
function StarRow({ n=5 }) {
  return (
    <span style={{ display:"inline-flex",gap:2 }}>
      {Array(n).fill(0).map((_,i) => (
        <span key={i} style={{ width:16,height:16,background:"#00B67A",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>
          <svg viewBox="0 0 12 12" width={9} height={9} fill="white"><path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 2.9 10.5l.6-3.5L1 4.5 4.5 4z"/></svg>
        </span>
      ))}
    </span>
  );
}
function Watermark() {
  return (
    <div className="wm-layer">
      {[-5,30,65,100].map((top,i) => (
        <div key={i} className="wm-row" style={{ top:`${top}%`,animationDelay:`${i*-5.5}s` }}>
          {Array(9).fill("DIGITAL PHOTOS  ·  ").join("")}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN A: HOMEPAGE
// ─────────────────────────────────────────────────────────────
function HomePage({ onGenerate }) {
  const [photo,setPhoto]   = useState(null);
  const [cat,setCat]       = useState("pets");
  const [styles,setStyles] = useState(["royal","renaissance","storybook","fantasy","cinematic","minimal"]);
  const [drag,setDrag]     = useState(false);
  const [err,setErr]       = useState("");
  const [sliderX,setSliderX] = useState(50);
  const [draggingBA,setDraggingBA] = useState(false);
  const [openFaq,setOpenFaq] = useState(null);
  const [scrolled,setScrolled] = useState(false);
  const fileRef = useRef();
  const baRef   = useRef();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll",fn);
    return () => window.removeEventListener("scroll",fn);
  }, []);

  const loadPhoto = useCallback(f => {
    if (!f?.type?.startsWith("image/")) { setErr("Please upload an image file."); return; }
    setErr("");
    const r = new FileReader();
    r.onload = e => setPhoto(e.target.result);
    r.readAsDataURL(f);
  }, []);

  const toggleStyle = id => setStyles(p => p.includes(id)?p.filter(s=>s!==id):[...p,id]);
  const allOn = styles.length === STYLES_LIST.length;
  const toggleAll = () => setStyles(allOn?[]:STYLES_LIST.map(s=>s.id));
  const canGenerate = photo && cat && styles.length > 0;
  const builderStep = !photo?1:!cat?2:styles.length===0?3:4;

  const moveSlider = clientX => {
    if (!baRef.current) return;
    const r = baRef.current.getBoundingClientRect();
    setSliderX(Math.max(5,Math.min(95,((clientX-r.left)/r.width)*100)));
  };

  return (
    <div style={{ background:D.bg,minHeight:"100vh" }}>

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"0 32px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(7,6,10,.96)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${D.border}`:"none",transition:"all .4s" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:D.cream }}>
          Digital<span style={{ color:D.gold }}>Photos</span><sup style={{ fontSize:8,color:D.dim,marginLeft:2 }}>™</sup>
        </div>
        <div className="hide-sm" style={{ display:"flex",gap:28 }}>
          {[["Styles","#styles"],["Gallery","#gallery"],["Reviews","#reviews"],["FAQ","#faq"]].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:11,letterSpacing:".15em",textTransform:"uppercase",color:D.muted,textDecoration:"none",transition:"color .3s" }}
              onMouseEnter={e=>e.target.style.color=D.gold} onMouseLeave={e=>e.target.style.color=D.muted}>{l}</a>
          ))}
        </div>
        <div className="hide-sm" style={{ display:"flex",alignItems:"center",gap:8,fontSize:11,color:D.muted }}>
          <StarRow n={5}/><span>4.9 · 50k+ portraits</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:"100vh",paddingTop:58,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",background:`radial-gradient(ellipse 80% 60% at 60% 40%, rgba(90,60,10,.2) 0%, transparent 70%), ${D.bg}` }}>
        <div style={{ position:"absolute",width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,150,58,.06) 0%,transparent 70%)",top:"-15%",right:"-10%",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",inset:0,opacity:.03,backgroundImage:`linear-gradient(${D.border} 1px,transparent 1px),linear-gradient(90deg,${D.border} 1px,transparent 1px)`,backgroundSize:"72px 72px",pointerEvents:"none" }}/>

        <div style={{ maxWidth:1280,margin:"0 auto",padding:"60px 32px",width:"100%",display:"grid",gridTemplateColumns:"1fr 1.05fr",gap:56,alignItems:"center" }} className="hero-grid">

          {/* LEFT: Headline */}
          <div>
            <div className="fu" style={{ display:"inline-flex",gap:8,alignItems:"center",border:`1px solid rgba(196,150,58,.22)`,padding:"7px 18px",marginBottom:28,fontSize:10,letterSpacing:".25em",color:D.gold,textTransform:"uppercase" }}>
              <Sparkles size={10}/> AI Fine Art Portrait Studio <Sparkles size={10}/>
            </div>
            <h1 className="fu" style={{ animationDelay:".1s",fontFamily:"'Playfair Display',serif",fontWeight:900,lineHeight:.92,marginBottom:24 }}>
              <span style={{ fontSize:"clamp(42px,6vw,76px)",color:D.cream,display:"block" }}>Upload a Photo.</span>
              <span style={{ fontSize:"clamp(42px,6vw,76px)",display:"block" }}><span className="gold-text">Get Back a</span></span>
              <span style={{ fontSize:"clamp(42px,6vw,76px)",color:D.cream,display:"block",fontStyle:"italic" }}>Masterpiece.</span>
            </h1>
            <p className="fu" style={{ animationDelay:".22s",fontSize:16,color:D.muted,lineHeight:1.75,marginBottom:36,maxWidth:420 }}>
              Transform photos of your pets, babies, couples, or family into timeless AI artwork.{" "}
              <strong style={{ color:D.cream,fontWeight:400 }}>Free watermarked preview — always.</strong>
            </p>
            <div className="fu" style={{ animationDelay:".34s",display:"flex",gap:20,flexWrap:"wrap",alignItems:"center" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <StarRow n={5}/><span style={{ fontSize:12,color:D.muted }}><strong style={{ color:D.cream }}>Excellent</strong> · Trustpilot</span>
              </div>
              {[[Shield,"Secure"],[RefreshCw,"30-Day Guarantee"],[Truck,"Ships Worldwide"]].map(([Icon,l]) => (
                <div key={l} style={{ display:"flex",gap:6,alignItems:"center",fontSize:11,color:D.muted }}><Icon size={11}/>{l}</div>
              ))}
            </div>
            <div className="fu" style={{ animationDelay:".46s",display:"flex",gap:8,marginTop:40,alignItems:"center" }}>
              {STYLES_LIST.slice(0,4).map(s => (
                <div key={s.id} style={{ width:52,height:66,overflow:"hidden",borderRadius:4,border:`1px solid ${D.border}`,flexShrink:0,position:"relative" }}>
                  <img src={s.preview} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.6 }}/>
                  <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"3px 2px" }}>
                    <span style={{ fontSize:7,color:"rgba(255,255,255,.5)",letterSpacing:".06em",textAlign:"center" }}>{s.label}</span>
                  </div>
                </div>
              ))}
              <div style={{ width:52,height:66,borderRadius:4,border:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <span style={{ fontFamily:"'Playfair Display',serif",fontSize:16,color:D.muted }}>+2</span>
              </div>
              <span style={{ fontSize:11,color:D.muted,paddingLeft:4 }}>6 styles at once</span>
            </div>
          </div>

          {/* RIGHT: BUILDER CARD */}
          <div className="si" style={{ animationDelay:".1s" }}>
            <div style={{ background:D.surface,border:`1px solid ${D.border}`,padding:"32px 28px",position:"relative",boxShadow:"0 40px 100px rgba(0,0,0,.6)" }}>
              <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${D.gold},transparent)` }}/>

              {/* Step dots */}
              <div style={{ display:"flex",gap:6,alignItems:"center",marginBottom:24 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <div className={`step-dot ${builderStep>n?"done":builderStep===n?"active":"todo"}`}/>
                    {n<4 && <div style={{ width:24,height:1,background:builderStep>n?D.gold:D.border }}/>}
                  </div>
                ))}
                <span style={{ fontSize:11,color:D.muted,marginLeft:6,letterSpacing:".08em" }}>
                  {["Upload","Category","Styles","Generate"][builderStep-1]}
                </span>
              </div>

              {/* STEP 1: UPLOAD */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11,letterSpacing:".18em",color:D.gold,textTransform:"uppercase",display:"block",marginBottom:10,fontWeight:500 }}>
                  01 — Upload Photo
                </label>
                {!photo ? (
                  <div className={`drop-zone ${drag?"hovering":""}`} style={{ borderRadius:8,padding:"36px 24px" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault();setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={e => { e.preventDefault();setDrag(false);loadPhoto(e.dataTransfer.files[0]); }}
                  >
                    <div style={{ width:48,height:48,background:"rgba(255,255,255,.04)",border:`1px solid ${D.border}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",position:"relative" }}>
                      <Upload size={20} color={D.muted}/>
                      <div style={{ position:"absolute",top:-7,right:-7,width:18,height:18,background:D.gold,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:D.bg,lineHeight:1 }}>+</div>
                    </div>
                    <p style={{ fontSize:14,color:D.cream,marginBottom:5,fontWeight:400 }}>Drop your photo here</p>
                    <p style={{ fontSize:12,color:D.muted }}>or click to browse · JPG, PNG, HEIC</p>
                    {err && <div style={{ marginTop:12,display:"flex",gap:6,alignItems:"center",justifyContent:"center",color:"#E06060",fontSize:12 }}><AlertCircle size={12}/>{err}</div>}
                  </div>
                ) : (
                  <div style={{ position:"relative",borderRadius:8,overflow:"hidden",height:130,border:`1px solid ${D.borderGold}` }}>
                    <img src={photo} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
                    <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,6,10,.8) 0%,transparent 50%)" }}/>
                    <div style={{ position:"absolute",bottom:10,left:12,display:"flex",alignItems:"center",gap:7 }}>
                      <div style={{ width:7,height:7,borderRadius:"50%",background:"#4CAF77" }}/>
                      <span style={{ fontSize:12,color:D.cream }}>Photo ready</span>
                    </div>
                    <button onClick={() => setPhoto(null)} style={{ position:"absolute",top:8,right:8,width:26,height:26,background:"rgba(7,6,10,.85)",border:`1px solid ${D.border}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                      <X size={11} color={D.muted}/>
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => loadPhoto(e.target.files[0])}/>
              </div>

              {/* STEP 2: CATEGORY */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11,letterSpacing:".18em",color:photo?D.gold:D.dim,textTransform:"uppercase",display:"block",marginBottom:10,fontWeight:500,transition:"color .3s" }}>
                  02 — Category
                </label>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {CATS.map(c => (
                    <button key={c.id} className={`cat-btn ${cat===c.id?"on":""}`} onClick={() => setCat(c.id)}>
                      <span>{c.emoji}</span>{c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 3: STYLES */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                  <label style={{ fontSize:11,letterSpacing:".18em",color:photo?D.gold:D.dim,textTransform:"uppercase",fontWeight:500,transition:"color .3s" }}>
                    03 — Styles
                  </label>
                  <button onClick={toggleAll} style={{ fontSize:10,color:allOn?D.gold:D.muted,background:"none",border:"none",cursor:"pointer",letterSpacing:".08em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>
                    {allOn?"Deselect All":"Select All"}
                  </button>
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {STYLES_LIST.map(s => (
                    <button key={s.id} className={`style-toggle ${styles.includes(s.id)?"on":""}`} onClick={() => toggleStyle(s.id)}>
                      {styles.includes(s.id) && <Check size={10} color={D.gold}/>}{s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GENERATE */}
              <button className="btn-gold pulse-gold" style={{ width:"100%",padding:"18px",fontSize:13,letterSpacing:".1em",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",gap:10 }}
                disabled={!canGenerate} onClick={() => onGenerate({ cat,styles,photo })}>
                <Wand2 size={16}/>
                {!photo?"Upload a Photo to Begin":styles.length===0?"Select at Least One Style":`Generate My ${CATS.find(c=>c.id===cat)?.label} Portraits`}
              </button>

              <div style={{ display:"flex",gap:16,justifyContent:"center",marginTop:16,flexWrap:"wrap" }}>
                {[[Lock,"Secure"],[RefreshCw,"30-Day Guarantee"],[Truck,"Ships Worldwide"]].map(([Icon,l]) => (
                  <div key={l} style={{ display:"flex",gap:5,alignItems:"center",fontSize:10,color:D.dim }}><Icon size={10}/>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="float" style={{ position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)" }}>
          <ChevronDown size={16} color={D.dim}/>
        </div>
      </section>

      {/* STYLES SECTION */}
      <section id="styles" style={{ padding:"120px 32px",background:D.surface }}>
        <div style={{ maxWidth:1280,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <Eyebrow>The Styles</Eyebrow>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,60px)",fontWeight:700,color:D.cream,lineHeight:1.05,marginBottom:16 }}>
              Six Styles. One Upload. <em style={{ fontStyle:"italic",color:D.gold }}>All Yours.</em>
            </h2>
            <p style={{ color:D.muted,fontSize:15,maxWidth:460,margin:"0 auto 24px",lineHeight:1.75 }}>
              Every session generates all 6 artistic styles simultaneously. Preview them all free — pay only for what you love.
            </p>
            <Divider/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
            {STYLES_LIST.map((s,i) => (
              <div key={s.id} className="portrait-tile" style={{ height:i===0||i===3?420:350,borderRadius:6 }}>
                <img src={s.preview} alt={s.label}/>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
                  <span style={{ fontSize:10,color:"rgba(255,255,255,.2)",letterSpacing:".28em",textTransform:"uppercase",transform:"rotate(-20deg)",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>DIGITAL PHOTOS</span>
                </div>
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,6,10,.88) 0%,transparent 55%)",borderRadius:6 }}/>
                <div style={{ position:"absolute",bottom:16,left:18,right:18 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:19,color:D.cream,marginBottom:4 }}>{s.label}</div>
                  <div style={{ fontSize:11,color:D.muted }}>AI Portrait Style · Watermark-free on purchase</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:44 }}>
            <button className="btn-gold" style={{ padding:"16px 42px",fontSize:12,borderRadius:6 }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
              Generate All 6 Styles Free
            </button>
            <p style={{ color:D.muted,fontSize:12,marginTop:12 }}>Watermark removed on purchase · Takes 2–5 minutes</p>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ padding:"120px 32px" }}>
        <div style={{ maxWidth:940,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <Eyebrow>Transformations</Eyebrow>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,56px)",fontWeight:700,color:D.cream,lineHeight:1.05 }}>
              Real Photos. <em style={{ fontStyle:"italic",color:D.gold }}>Real Results.</em>
            </h2>
            <p style={{ color:D.muted,fontSize:13,marginTop:12 }}>Drag the slider to reveal the transformation</p>
            <Divider/>
          </div>
          <div ref={baRef} className="before-after" style={{ height:500,borderRadius:8,border:`1px solid ${D.border}` }}
            onMouseDown={() => setDraggingBA(true)}
            onMouseUp={() => setDraggingBA(false)}
            onMouseLeave={() => setDraggingBA(false)}
            onMouseMove={e => { if(draggingBA) moveSlider(e.clientX); }}
            onTouchMove={e => moveSlider(e.touches[0].clientX)}
          >
            <img src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=900&h=500&fit=crop" alt="Before" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",borderRadius:8 }}/>
            <div style={{ position:"absolute",inset:0,clipPath:`inset(0 ${100-sliderX}% 0 0)` }}>
              <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&h=500&fit=crop" alt="After" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:8 }}/>
            </div>
            <div style={{ position:"absolute",top:0,bottom:0,left:`${sliderX}%`,width:2,background:D.gold,cursor:"ew-resize" }}>
              <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:40,height:40,borderRadius:"50%",background:D.gold,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
                <ChevronRight size={11} color={D.bg} style={{ marginLeft:1 }}/>
              </div>
            </div>
            <div style={{ position:"absolute",top:14,left:14,fontSize:10,letterSpacing:".2em",textTransform:"uppercase",background:"rgba(7,6,10,.75)",color:D.muted,padding:"4px 12px",borderRadius:2 }}>Original</div>
            <div style={{ position:"absolute",top:14,right:14,fontSize:10,letterSpacing:".2em",textTransform:"uppercase",background:"rgba(196,150,58,.85)",color:D.bg,padding:"4px 12px",fontWeight:600,borderRadius:2 }}>Royal Portrait</div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={{ padding:"0 32px 120px",background:D.surface }}>
        <div style={{ maxWidth:1280,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:52,paddingTop:120 }}>
            <Eyebrow>Sample Portraits</Eyebrow>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,56px)",fontWeight:700,color:D.cream,lineHeight:1.05 }}>
              The Art Speaks <em style={{ fontStyle:"italic",color:D.gold }}>for Itself</em>
            </h2>
            <Divider/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8 }}>
            {GALLERY_IMGS.map((src,i) => (
              <div key={i} className="portrait-tile" style={{ height:i%2===0?300:240,borderRadius:5,cursor:"default" }}>
                <img src={src} alt=""/>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
                  <span style={{ fontSize:9,color:"rgba(255,255,255,.18)",letterSpacing:".22em",textTransform:"uppercase",transform:"rotate(-20deg)",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>DIGITAL PHOTOS</span>
                </div>
                <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,6,10,.7) 0%,transparent 50%)",borderRadius:5 }}/>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:32 }}>
            <p style={{ color:D.muted,fontSize:13,marginBottom:20 }}>All portraits AI-generated from real uploaded photos.</p>
            <button className="btn-gold" style={{ padding:"14px 36px",fontSize:12,borderRadius:6 }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
              Create Your Portrait
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" style={{ padding:"120px 32px" }}>
        <div style={{ maxWidth:1280,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <Eyebrow>Reviews</Eyebrow>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,56px)",fontWeight:700,color:D.cream,lineHeight:1.05 }}>
              They Ordered One.<br/><em style={{ fontStyle:"italic",color:D.gold }}>Then Ordered Ten More.</em>
            </h2>
            <Divider/>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:D.surface,border:`1px solid ${D.border}`,padding:"28px 24px",borderRadius:4 }}>
                <div style={{ display:"flex",gap:3,marginBottom:16 }}><StarRow n={5}/></div>
                <p style={{ fontSize:13,color:D.muted,lineHeight:1.8,marginBottom:20,fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ height:1,background:D.border,marginBottom:16 }}/>
                <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,color:D.cream }}>{t.name}</div>
                <div style={{ fontSize:10,color:D.muted,letterSpacing:".1em",marginTop:2 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding:"120px 32px",background:D.surface }}>
        <div style={{ maxWidth:740,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <Eyebrow>FAQ</Eyebrow>
            <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,52px)",fontWeight:700,color:D.cream,lineHeight:1.05 }}>
              Everything You <em style={{ fontStyle:"italic",color:D.gold }}>Want to Know</em>
            </h2>
            <Divider/>
          </div>
          {FAQS.map((f,i) => (
            <div key={i} className="faq-row">
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                <span style={{ flex:1 }}>{f.q}</span>
                <ChevronDown size={15} color={D.muted} style={{ transform:openFaq===i?"rotate(180deg)":"none",transition:"transform .3s",flexShrink:0 }}/>
              </button>
              {openFaq===i && <div className="fi" style={{ paddingBottom:20 }}><p style={{ color:D.muted,fontSize:14,lineHeight:1.8 }}>{f.a}</p></div>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"120px 32px",textAlign:"center",background:`linear-gradient(135deg, rgba(196,150,58,.1) 0%, rgba(80,52,8,.06) 100%)`,borderTop:`1px solid ${D.border}`,borderBottom:`1px solid ${D.border}` }}>
        <div style={{ maxWidth:680,margin:"0 auto" }}>
          <Eyebrow>Start Creating</Eyebrow>
          <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,6vw,72px)",fontWeight:900,fontStyle:"italic",color:D.cream,lineHeight:.96,marginBottom:20 }}>
            Ready to See<br/>Your Portrait?
          </h2>
          <p style={{ color:D.muted,fontSize:16,lineHeight:1.75,marginBottom:44,maxWidth:440,margin:"0 auto 44px" }}>
            Free watermarked preview. No account required. Takes 2–5 minutes.
          </p>
          <button className="btn-gold pulse-gold" style={{ padding:"20px 60px",fontSize:13,letterSpacing:".12em",borderRadius:6,display:"inline-flex",alignItems:"center",gap:10 }}
            onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
            <Upload size={16}/> Upload a Photo
          </button>
          <div style={{ display:"flex",gap:24,justifyContent:"center",marginTop:24,flexWrap:"wrap" }}>
            {[[Lock,"Secure"],[RefreshCw,"30-Day Guarantee"],[Truck,"Ships Worldwide"],[Clock,"Instant Preview"]].map(([Icon,l]) => (
              <div key={l} style={{ display:"flex",gap:6,alignItems:"center",fontSize:11,color:D.muted }}><Icon size={10} color={D.dim}/>{l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"40px 32px",borderTop:`1px solid ${D.border}` }}>
        <div style={{ maxWidth:1280,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:16,color:D.cream }}>
            Digital<span style={{ color:D.gold }}>Photos</span><sup style={{ fontSize:8,color:D.dim }}>™</sup>
          </div>
          <div style={{ fontSize:11,color:D.dim }}>© 2025 Digital Photos™. All rights reserved.</div>
          <div style={{ fontSize:11,color:D.dim }}>AI-Powered · Fine Art Quality · Yours Forever</div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN B: GENERATING
// ─────────────────────────────────────────────────────────────
function GenScreen({ onDone, selectedStyles }) {
  const [pct,setPct]   = useState(0);
  const [msg,setMsg]   = useState(0);
  const [done,setDone] = useState([]);
  const activeStyles = STYLES_LIST.filter(s => selectedStyles.includes(s.id));

  useEffect(() => {
    const total=9000, tick=85; let t=0;
    const iv = setInterval(() => {
      t+=tick;
      const p=Math.min((t/total)*100,100);
      setPct(p);
      setMsg(Math.min(Math.floor((p/100)*GEN_MSGS.length),GEN_MSGS.length-1));
      setDone(activeStyles.slice(0,Math.floor((p/100)*activeStyles.length)));
      if(p>=100){ clearInterval(iv); setTimeout(onDone,600); }
    },tick);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ minHeight:"100vh",background:D.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px" }}>
      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:19,color:D.cream,marginBottom:52 }}>
        Digital<span style={{ color:D.gold }}>Photos</span><sup style={{ fontSize:8,color:D.dim }}>™</sup>
      </div>
      <div style={{ position:"relative",width:72,height:72,marginBottom:32 }}>
        <div style={{ position:"absolute",inset:0,border:`1.5px solid ${D.border}`,borderRadius:"50%" }}/>
        <div className="spin" style={{ position:"absolute",inset:0,border:"2px solid transparent",borderTopColor:D.gold,borderRadius:"50%" }}/>
        <div style={{ position:"absolute",inset:10,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Wand2 size={22} color={D.gold}/>
        </div>
      </div>
      <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,5vw,46px)",fontWeight:700,fontStyle:"italic",color:D.cream,textAlign:"center",marginBottom:10 }}>
        Creating Your Masterpiece
      </h2>
      <p style={{ color:D.muted,fontSize:14,marginBottom:40,textAlign:"center",minHeight:22 }}>{GEN_MSGS[msg]}</p>
      <div style={{ width:"100%",maxWidth:440,height:2,background:D.border,borderRadius:2,overflow:"hidden",marginBottom:8 }}>
        <div style={{ height:"100%",background:`linear-gradient(90deg,${D.gold},${D.goldLight})`,width:`${pct}%`,transition:"width .15s ease" }}/>
      </div>
      <p style={{ fontSize:12,color:D.gold,marginBottom:44 }}>{Math.round(pct)}%</p>
      {done.length>0 && (
        <div style={{ display:"flex",gap:9,flexWrap:"wrap",justifyContent:"center",maxWidth:540 }}>
          {done.map((s,i) => (
            <div key={i} className="bt" style={{ animationDelay:`${i*.08}s`,width:80,height:100,borderRadius:5,overflow:"hidden",border:`1px solid ${D.border}`,position:"relative",flexShrink:0 }}>
              <img src={s.preview} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.45,display:"block" }}/>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:8,color:"rgba(255,255,255,.22)",letterSpacing:".2em",textTransform:"uppercase",transform:"rotate(-20deg)",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif" }}>DP™</span>
              </div>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"rgba(7,6,10,.85)",padding:"4px 5px",textAlign:"center",fontSize:8,color:"rgba(255,255,255,.45)" }}>{s.label}</div>
              <div style={{ position:"absolute",top:5,right:5,width:16,height:16,background:D.gold,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Check size={9} color={D.bg}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN C: PREVIEW + PRICING
// ─────────────────────────────────────────────────────────────
function PreviewScreen({ cat, photo, selectedStyles, onBack }) {
  const [sel,setSel]         = useState(0);
  const [priceSel,setPriceSel] = useState("digital");
  const [printSz,setPrintSz]   = useState('8"×10"');
  const [canvSz,setCanvSz]     = useState('12"×16"');
  const [timer,setTimer]       = useState(19*60+18);
  const [liked,setLiked]       = useState([]);
  const [openAc,setOpenAc]     = useState(null);
  const catLabel = CATS.find(c=>c.id===cat)?.label||"Portrait";
  const activeStyles = STYLES_LIST.filter(s=>selectedStyles.includes(s.id));

  useEffect(() => {
    const t=setInterval(() => setTimer(p=>Math.max(0,p-1)),1000);
    return () => clearInterval(t);
  },[]);

  const fmt = s => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const main = activeStyles[sel]||STYLES_LIST[0];

  return (
    <div style={{ minHeight:"100vh",background:D.bg,paddingBottom:100 }}>
      <header style={{ position:"sticky",top:0,zIndex:100,background:"rgba(7,6,10,.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${D.border}` }}>
        <div style={{ padding:"6px 20px",borderBottom:`1px solid ${D.border}`,display:"flex",gap:20,alignItems:"center",justifyContent:"center",fontSize:11,color:D.muted,flexWrap:"wrap" }}>
          <span style={{ display:"flex",gap:5,alignItems:"center" }}><Truck size={10} color={D.gold}/>Free Shipping on Prints</span>
          <span>·</span>
          <span style={{ display:"flex",gap:5,alignItems:"center" }}><StarRow n={5}/> Rated 4.8</span>
          <span>·</span>
          <span>#1 on Trustpilot</span>
        </div>
        <div style={{ padding:"9px 24px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:D.cream }}>
            Digital<span style={{ color:D.gold }}>Photos</span>
          </div>
          <div style={{ display:"flex",gap:5,alignItems:"center",fontSize:12,color:D.dim }}>
            {["Upload","Preview","Download or Order Print"].map((s,i) => (
              <span key={s} style={{ display:"flex",alignItems:"center",gap:5 }}>
                <span style={{ color:i===1?D.cream:D.muted }}>{s}</span>
                {i<2 && <ChevronRight size={10} color={D.dim}/>}
              </span>
            ))}
          </div>
          <button className="btn-ghost" style={{ padding:"7px 14px",borderRadius:4,fontSize:11 }} onClick={onBack}>← Retry</button>
        </div>
      </header>

      <div style={{ maxWidth:800,margin:"0 auto",padding:"24px 18px 60px" }}>
        <h1 className="fu" style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,5vw,46px)",fontWeight:700,textAlign:"center",color:D.cream,marginBottom:24 }}>
          Your Masterpiece is Ready!
        </h1>

        {/* MAIN WATERMARKED IMAGE */}
        <div style={{ position:"relative",borderRadius:10,overflow:"hidden",marginBottom:10,background:D.surface,border:`1px solid ${D.border}` }}>
          <img src={photo||main.preview} alt="Preview" style={{ width:"100%",maxHeight:540,objectFit:"cover",display:"block",filter:"brightness(.84) saturate(1.1)" }}/>
          <Watermark/>
          <button onClick={onBack} style={{ position:"absolute",top:12,right:12,background:"rgba(7,6,10,.8)",border:`1px solid ${D.border}`,padding:"7px 14px",borderRadius:6,cursor:"pointer",display:"flex",gap:6,alignItems:"center",fontSize:11,color:D.cream,backdropFilter:"blur(8px)",fontFamily:"'DM Sans',sans-serif" }}>
            <RefreshCw size={11}/> Retry or Edit
          </button>
          <button onClick={() => setLiked(p=>p.includes(sel)?p.filter(i=>i!==sel):[...p,sel])} style={{ position:"absolute",top:12,left:12,width:36,height:36,background:"rgba(7,6,10,.8)",border:`1px solid ${D.border}`,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <Heart size={14} color={liked.includes(sel)?D.gold:D.muted} fill={liked.includes(sel)?D.gold:"none"}/>
          </button>
          <div style={{ position:"absolute",bottom:12,left:14,background:"rgba(7,6,10,.8)",border:`1px solid rgba(196,150,58,.25)`,padding:"5px 12px",borderRadius:4 }}>
            <span style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:14,color:D.cream }}>{main.label} Portrait</span>
          </div>
        </div>

        {/* STYLE THUMBS */}
        <div className="thumb-strip" style={{ marginBottom:8 }}>
          {activeStyles.map((s,i) => (
            <div key={i} onClick={() => setSel(i)} style={{ width:70,height:88,borderRadius:5,overflow:"hidden",cursor:"pointer",flexShrink:0,position:"relative",border:`2px solid ${sel===i?D.gold:D.border}`,opacity:sel===i?1:.5,transition:"all .2s" }}>
              <img src={s.preview} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}/>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"rgba(7,6,10,.85)",padding:"3px 4px",fontSize:7,color:"rgba(255,255,255,.55)",textAlign:"center" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:11,color:D.dim,textAlign:"center",marginBottom:30 }}>
          {activeStyles.length} styles generated · Select to preview · Watermark removed on purchase
        </p>

        <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(18px,3.5vw,32px)",fontWeight:700,textAlign:"center",color:D.cream,marginBottom:16 }}>
          Choose Your Format
        </h2>

        {/* PRICE CARDS */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>

          {/* Digital */}
          <div className={`price-card${priceSel==="digital"?" sel":""}`} style={{ borderRadius:8,padding:"20px 16px" }} onClick={() => setPriceSel("digital")}>
            <div style={{ background:"#2DD4BF",color:D.bg,fontSize:9,fontWeight:700,letterSpacing:".14em",padding:"3px 10px",borderRadius:50,display:"inline-block",marginBottom:12 }}>Most Popular</div>
            <Download size={15} color={D.muted} style={{ display:"block",marginBottom:10 }}/>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:D.cream,fontWeight:700,marginBottom:6 }}>Instant Download</div>
            <div style={{ display:"flex",alignItems:"baseline",gap:8,marginBottom:4 }}>
              <span style={{ fontSize:13,color:D.dim,textDecoration:"line-through" }}>$99</span>
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:D.cream }}>$29</span>
            </div>
            <div style={{ display:"flex",gap:5,alignItems:"center",fontSize:11,color:D.gold,marginBottom:12 }}>
              <Clock size={10}/>Expires {fmt(timer)}
            </div>
            <p style={{ fontSize:11,color:D.muted,lineHeight:1.6,marginBottom:12 }}>Full HD portraits to your inbox, instantly.</p>
            <div style={{ height:1,background:D.border,marginBottom:12 }}/>
            {["No Watermark","Instant Download",`All ${activeStyles.length} Styles`,"Personal License"].map(f => (
              <div key={f} style={{ display:"flex",gap:7,alignItems:"flex-start",fontSize:11,color:D.muted,marginBottom:7 }}>
                <Check size={10} color="#2DD4BF" style={{ marginTop:2,flexShrink:0 }}/>{f}
              </div>
            ))}
            <button className="btn-gold" style={{ width:"100%",padding:"12px",borderRadius:5,fontSize:12,marginTop:14 }}>Download Now</button>
          </div>

          {/* Print */}
          <div className={`price-card${priceSel==="print"?" sel":""}`} style={{ borderRadius:8,padding:"20px 16px" }} onClick={() => setPriceSel("print")}>
            <div style={{ height:22,marginBottom:12 }}/>
            <Printer size={15} color={D.muted} style={{ display:"block",marginBottom:10 }}/>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:D.cream,fontWeight:700,marginBottom:6 }}>Fine Art Print</div>
            <span style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:D.cream,display:"block",marginBottom:12 }}>$89</span>
            <p style={{ fontSize:11,color:D.muted,lineHeight:1.6,marginBottom:12 }}>Museum-quality archival paper. Fade-resistant inks.</p>
            <div style={{ fontSize:10,letterSpacing:".12em",color:D.muted,textTransform:"uppercase",marginBottom:7 }}>Choose Size</div>
            <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:12 }}>
              {['8"×10"','11"×14"'].map(sz => (
                <button key={sz} className={`sz-btn ${printSz===sz?"sz-on":"sz-off"}`} onClick={e=>{e.stopPropagation();setPrintSz(sz)}}>{sz}</button>
              ))}
            </div>
            <div style={{ height:1,background:D.border,marginBottom:12 }}/>
            {["Archival paper","Fade-resistant inks","Made to last decades"].map(f => (
              <div key={f} style={{ display:"flex",gap:7,alignItems:"flex-start",fontSize:11,color:D.muted,marginBottom:7 }}>
                <Check size={10} color="#2DD4BF" style={{ marginTop:2,flexShrink:0 }}/>{f}
              </div>
            ))}
            <div style={{ display:"flex",gap:5,alignItems:"center",fontSize:11,color:"#2DD4BF",margin:"4px 0 12px" }}><Truck size={10}/>Free Shipping</div>
            <button className="btn-gold" style={{ width:"100%",padding:"12px",borderRadius:5,fontSize:12 }}>Order Print</button>
            <p style={{ fontSize:10,color:"#2DD4BF",textAlign:"center",marginTop:8 }}>+ Digital download included</p>
          </div>

          {/* Canvas */}
          <div className={`price-card${priceSel==="canvas"?" sel":""}`} style={{ borderRadius:8,padding:"20px 16px",borderColor:"rgba(196,150,58,.3)",background:"rgba(196,150,58,.03)" }} onClick={() => setPriceSel("canvas")}>
            <div style={{ background:"linear-gradient(135deg,#7C3AED,#9F6BE3)",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:".12em",padding:"3px 10px",borderRadius:50,display:"inline-block",marginBottom:12 }}>
              🎁 Perfect Gift
            </div>
            <FrameIcon size={15} color={D.muted} style={{ display:"block",marginBottom:10 }}/>
            <div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,color:D.cream,fontWeight:700,marginBottom:6 }}>Large Canvas</div>
            <span style={{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:D.cream,display:"block",marginBottom:12 }}>$299</span>
            <p style={{ fontSize:11,color:D.muted,lineHeight:1.6,marginBottom:12 }}>Gallery-quality canvas. Arrives ready to hang.</p>
            <div style={{ fontSize:10,letterSpacing:".12em",color:D.muted,textTransform:"uppercase",marginBottom:7 }}>Choose Size</div>
            <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:12 }}>
              {['12"×16"','16"×20"','24"×30"'].map(sz => (
                <button key={sz} className={`sz-btn ${canvSz===sz?"sz-on":"sz-off"}`} style={{ borderColor:canvSz===sz?D.gold:D.border,color:canvSz===sz?D.gold:D.muted,background:canvSz===sz?"rgba(196,150,58,.1)":"transparent" }} onClick={e=>{e.stopPropagation();setCanvSz(sz)}}>{sz}</button>
              ))}
            </div>
            <div style={{ height:1,background:D.border,marginBottom:12 }}/>
            {["Ready to hang","1.25\" cotton canvas","Mounting hardware"].map(f => (
              <div key={f} style={{ display:"flex",gap:7,alignItems:"flex-start",fontSize:11,color:D.muted,marginBottom:7 }}>
                <Check size={10} color={D.gold} style={{ marginTop:2,flexShrink:0 }}/>{f}
              </div>
            ))}
            <div style={{ display:"flex",gap:5,alignItems:"center",fontSize:11,color:D.gold,margin:"4px 0 12px" }}><Truck size={10}/>Free Shipping</div>
            <button className="btn-gold" style={{ width:"100%",padding:"12px",borderRadius:5,fontSize:12 }}>Order Canvas</button>
            <p style={{ fontSize:10,color:D.gold,textAlign:"center",marginTop:8 }}>+ Digital download included</p>
          </div>
        </div>

        <div style={{ textAlign:"center",padding:"16px",border:`1px solid ${D.border}`,borderRadius:8,background:D.surface,marginBottom:20 }}>
          <p style={{ fontSize:13,color:D.muted }}>Chosen by <strong style={{ color:D.cream }}>10,000+</strong> {catLabel.toLowerCase()} owners</p>
          <div style={{ display:"flex",justifyContent:"center",marginTop:8 }}><StarRow n={5}/></div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24 }}>
          <button className="btn-ghost" style={{ padding:"13px",borderRadius:6,display:"flex",gap:8,alignItems:"center",justifyContent:"center",fontSize:13 }}><Copy size={14}/>Save for Later</button>
          <button className="btn-ghost" style={{ padding:"13px",borderRadius:6,display:"flex",gap:8,alignItems:"center",justifyContent:"center",fontSize:13,borderColor:"rgba(196,150,58,.3)",color:D.gold }}><Share2 size={14}/>Share</button>
        </div>

        {/* Accordions */}
        {[
          { title:"What Customers Say",sub:"Rated Excellent on Trustpilot ★★★★★",body:
            <div>{[{n:"Sarah M.",t:`The ${catLabel} portrait is absolutely stunning.`},{n:"Marcus T.",t:"Ordered 3 canvases. Everyone lost their minds."}].map(r=>(
              <div key={r.n} style={{ padding:"12px 0",borderBottom:`1px solid ${D.border}` }}>
                <StarRow n={5}/><p style={{ fontSize:12,color:D.muted,fontStyle:"italic",margin:"6px 0 3px" }}>"{r.t}"</p>
                <p style={{ fontSize:11,color:D.dim }}>— {r.n}</p>
              </div>
            ))}</div>
          },
          { title:"Need Support?",sub:"We're happy to help!",body:<p style={{ fontSize:13,color:D.muted,paddingTop:8,lineHeight:1.7 }}>Reach us at support@digitalphotos.app — we respond within 2 hours.</p> },
        ].map((ac,idx) => (
          <div key={idx} style={{ borderBottom:`1px solid ${D.border}` }}>
            <button onClick={() => setOpenAc(openAc===idx?null:idx)} style={{ width:"100%",background:"none",border:"none",cursor:"pointer",padding:"18px 0",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'DM Sans',sans-serif" }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:14,color:D.cream,fontWeight:400 }}>{ac.title}</div>
                {ac.sub && <div style={{ fontSize:12,color:D.muted,marginTop:2 }}>{ac.sub}</div>}
              </div>
              <ChevronDown size={14} color={D.muted} style={{ transform:openAc===idx?"rotate(180deg)":"none",transition:"transform .3s",flexShrink:0 }}/>
            </button>
            {openAc===idx && <div className="fi" style={{ paddingBottom:16 }}>{ac.body}</div>}
          </div>
        ))}

        <div style={{ textAlign:"center",padding:"32px 0 0" }}>
          <p style={{ fontSize:10,letterSpacing:".25em",color:D.dim,textTransform:"uppercase",marginBottom:18 }}>As Seen On</p>
          <div style={{ display:"flex",gap:28,justifyContent:"center",flexWrap:"wrap" }}>
            {["The New York Times","Forbes","ELLE","Vogue"].map(p=>(
              <span key={p} style={{ fontSize:12,color:D.dim,letterSpacing:".12em",fontStyle:"italic",fontFamily:"'Playfair Display',serif" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY CTA */}
      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"rgba(7,6,10,.97)",backdropFilter:"blur(20px)",borderTop:`1px solid ${D.border}`,padding:"10px 20px",display:"flex",gap:10,alignItems:"center",zIndex:50 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11,color:D.muted }}>Instant Digital Download</div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,color:D.cream,fontWeight:700,lineHeight:1.1 }}>
            $29 <span style={{ fontSize:13,color:D.dim,textDecoration:"line-through",fontFamily:"'DM Sans',sans-serif",fontWeight:300 }}>$99</span>
          </div>
        </div>
        <button className="btn-gold pulse-gold" style={{ padding:"13px 26px",borderRadius:7,fontSize:13,flexShrink:0,display:"flex",gap:8,alignItems:"center" }}>
          <Lock size={13}/>Unlock My Portraits
        </button>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]   = useState("home");
  const [session,setSession] = useState({ cat:"pets",styles:[],photo:null });

  const handleGenerate = useCallback(({ cat,styles,photo }) => {
    setSession({ cat,styles,photo }); setScreen("gen");
  }, []);

  return (
    <>
      <style>{G}</style>
      {screen==="home"    && <HomePage    onGenerate={handleGenerate}/>}
      {screen==="gen"     && <GenScreen   selectedStyles={session.styles} onDone={() => setScreen("preview")}/>}
      {screen==="preview" && <PreviewScreen cat={session.cat} photo={session.photo} selectedStyles={session.styles} onBack={() => setScreen("home")}/>}
    </>
  );
}
