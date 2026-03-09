// @ts-nocheck
// ============================================================
// DIGITAL PHOTOS™ — PHASE 4: DELIVERY PAGE
// Copy this entire file into Lovable as: src/pages/Delivery.jsx
//
// This is the post-purchase page. Users see:
//   • Confirmation + order summary
//   • Unlocked portrait grid (watermark-free)
//   • Download buttons per portrait
//   • Share to social
//   • Print upsell (if they only bought digital)
//   • Referral offer
//   • Community share invitation
// ============================================================

import { useState } from "react";
import {
  Check, Download, Share2, Instagram, Twitter, Facebook,
  FrameIcon, Gift, Star, ArrowRight, Copy, Mail,
  Heart, Sparkles, Crown, Package, Truck, ChevronRight,
  ExternalLink, RefreshCw, Users, Globe, Image, Award
} from "lucide-react";

// ── DESIGN TOKENS ───────────────────────────────────────────
const C = {
  bg:"#080705", bgCard:"#0F0D0A", bgLight:"#141109",
  cream:"#F2EDE4", creamMuted:"#B8B09A",
  gold:"#C4963A", goldLight:"#D4AE5C", goldDim:"#7A5C22", goldBg:"rgba(196,150,58,0.07)",
  border:"#1E1B14", borderLight:"#2A261D",
  success:"#4CAF77", successBg:"rgba(76,175,119,0.08)",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#080705; color:#F2EDE4; font-family:'Outfit',sans-serif; font-weight:300; }
  ::-webkit-scrollbar { width:2px; }
  ::-webkit-scrollbar-thumb { background:#C4963A; }

  @keyframes fadeIn  { from{opacity:0}          to{opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes confetti{ 0%{transform:translateY(-20px) rotate(0deg); opacity:1} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
  @keyframes popIn   { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulseGold{ 0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,0.3)} 50%{box-shadow:0 0 0 14px rgba(196,150,58,0)} }

  .fade-in  { animation:fadeIn  0.6s ease forwards; }
  .fade-up  { animation:fadeUp  0.7s ease forwards; }
  .pop-in   { animation:popIn   0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .pulse-gold{ animation:pulseGold 2s infinite; }

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

  .btn-outline {
    background:transparent; border:1px solid #C4963A; color:#C4963A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-weight:400; letter-spacing:0.1em;
    text-transform:uppercase; transition:all 0.3s;
  }
  .btn-outline:hover { background:rgba(196,150,58,0.08); }

  .btn-ghost {
    background:transparent; border:1px solid #1E1B14; color:#B8B09A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:12px; letter-spacing:0.08em;
    text-transform:uppercase; transition:all 0.3s;
  }
  .btn-ghost:hover { border-color:#2A261D; color:#F2EDE4; }

  .portrait-unlock {
    position:relative; overflow:hidden; border:1px solid #1E1B14;
    transition:all 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .portrait-unlock:hover { border-color:rgba(196,150,58,0.45); transform:translateY(-5px); }

  .action-btn {
    flex:1; display:flex; flex-direction:column; align-items:center; gap:5; padding:10px 8px;
    background:transparent; border:1px solid #1E1B14; cursor:pointer; transition:all 0.25s;
    font-family:'Outfit',sans-serif;
  }
  .action-btn:hover { border-color:#C4963A; background:rgba(196,150,58,0.06); }
  .action-btn span { font-size:9px; color:#B8B09A; letter-spacing:0.1em; text-transform:uppercase; }

  .share-chip {
    display:flex; align-items:center; gap:8; padding:10px 16px; cursor:pointer;
    border:1px solid #1E1B14; background:#0F0D0A; transition:all 0.25s;
    font-size:12px; color:#B8B09A;
  }
  .share-chip:hover { border-color:rgba(196,150,58,0.4); color:#F2EDE4; }

  .referral-box {
    background:linear-gradient(135deg,rgba(196,150,58,0.1),rgba(100,70,15,0.06));
    border:1px solid rgba(196,150,58,0.3); padding:28px 24px;
  }

  .upsell-card {
    border:1px solid #1E1B14; background:#0F0D0A; overflow:hidden;
    transition:border-color 0.3s;
  }
  .upsell-card:hover { border-color:rgba(196,150,58,0.4); }

  @media (max-width:768px) {
    .hide-sm { display:none !important; }
    .sm-col  { flex-direction:column !important; }
    .sm-full { width:100% !important; }
  }
`;

// ── MOCK DATA ──────────────────────────────────────────────────
// In production, these come from your API after purchase confirmation
const UNLOCKED_PORTRAITS = [
  { id:1, style:"Royal Portrait",      img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop", featured:true },
  { id:2, style:"Renaissance",         img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop", featured:false },
  { id:3, style:"Storybook Fantasy",   img:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop", featured:false },
  { id:4, style:"Cinematic Portrait",  img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop", featured:false },
  { id:5, style:"Minimal Fine Art",    img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop", featured:false },
  { id:6, style:"Vintage Portrait",    img:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=500&fit=crop", featured:false },
];

const FRAME_UPSELLS = [
  { id:"walnut",  name:"Walnut Classic",    price:49, size:'8"×10"', img:"https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=160&h=200&fit=crop" },
  { id:"gold",    name:"Gold Leaf Ornate",  price:79, size:'11"×14"', img:"https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=160&h=200&fit=crop" },
  { id:"canvas",  name:"Canvas Print",      price:99, size:'12"×16"', img:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&h=200&fit=crop" },
];

// ── CONFETTI ANIMATION ─────────────────────────────────────────
function ConfettiPiece({ delay, left, color }) {
  return (
    <div style={{
      position:"fixed", top:-20, left:`${left}%`, width:8, height:8,
      background:color, zIndex:1000, pointerEvents:"none",
      animation:`confetti ${2 + Math.random()*2}s ${delay}s ease-in forwards`,
    }}/>
  );
}

function ConfettiBurst() {
  const pieces = Array.from({ length:20 }, (_,i) => ({
    id:i,
    delay:i*0.1,
    left:Math.random()*100,
    color:[C.gold,"#F0D080","#C4963A","#E8B44A","#FAF8F5"][Math.floor(Math.random()*5)],
  }));
  return <>{pieces.map(p => <ConfettiPiece key={p.id} {...p}/>)}</>;
}

// ── CONFIRMATION HEADER ────────────────────────────────────────
function ConfirmationHeader({ orderProduct }) {
  return (
    <div style={{ textAlign:"center", padding:"80px 40px 60px", position:"relative", overflow:"hidden" }}>
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,150,58,0.12) 0%, transparent 70%)`,
        pointerEvents:"none",
      }}/>
      {/* Success icon */}
      <div className="pop-in" style={{ width:72, height:72, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px" }}>
        <Check size={34} color={C.bg} strokeWidth={2.5}/>
      </div>

      <div className="fade-up" style={{ animationDelay:"0.2s", opacity:0 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:12 }}>Payment Confirmed</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,6vw,72px)", fontWeight:300, color:C.cream, lineHeight:1.0, marginBottom:18 }}>
          Your Portraits Are <span className="gold-shimmer">Unlocked.</span>
        </h1>
        <p style={{ color:C.creamMuted, fontSize:16, maxWidth:520, margin:"0 auto 28px", lineHeight:1.7 }}>
          All 6 full-resolution watermark-free portraits are below.
          Download your favorites, share them, or order a print.
        </p>
      </div>

      {/* Order details strip */}
      <div className="fade-up" style={{ animationDelay:"0.4s", opacity:0, display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginTop:8 }}>
        {[
          [Check,    "Order Confirmed"],
          [Mail,     "Delivery Email Sent"],
          [Package,  orderProduct === "canvas" ? "Canvas in Production" : orderProduct === "print" ? "Print in Production" : "Files Ready to Download"],
        ].map(([Icon,label]) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.creamMuted, background:C.bgCard, border:`1px solid ${C.border}`, padding:"8px 16px" }}>
            <Icon size={12} color={C.gold}/>{label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PORTRAIT GRID ──────────────────────────────────────────────
function PortraitGrid({ portraits, onFrameClick }) {
  const [downloading, setDownloading] = useState(null);
  const [copied, setCopied] = useState(null);
  const [favorited, setFavorited] = useState([]);

  const handleDownload = (portrait) => {
    setDownloading(portrait.id);
    // In production: trigger actual file download from signed URL
    setTimeout(() => setDownloading(null), 1500);
  };

  const handleCopyLink = (portrait) => {
    // In production: copy actual download URL
    navigator.clipboard.writeText(`https://digitalphotos.app/download/${portrait.id}`);
    setCopied(portrait.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleFav = (id) => setFavorited(prev => prev.includes(id) ? prev.filter(i => i!==id) : [...prev,id]);

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 40px 80px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:"0.25em", color:C.gold, textTransform:"uppercase", marginBottom:6 }}>Your Portraits</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, color:C.cream, fontWeight:300 }}>6 Styles · All Unlocked</h2>
        </div>
        <button className="btn-gold" style={{ padding:"12px 28px", fontSize:11 }}
          onClick={() => portraits.forEach(p => handleDownload(p))}>
          <Download size={13} style={{ display:"inline", marginRight:8, verticalAlign:"middle" }}/>
          Download All
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {portraits.map(portrait => {
          const isFav = favorited.includes(portrait.id);
          const isDLing = downloading === portrait.id;
          const isCopied = copied === portrait.id;

          return (
            <div key={portrait.id} className="portrait-unlock">
              {/* Image — NO watermark */}
              <div style={{ position:"relative", height:340 }}>
                <img src={portrait.img} alt={portrait.style} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                {portrait.featured && (
                  <div style={{ position:"absolute", top:12, left:12, background:C.gold, color:C.bg, fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"4px 12px", fontFamily:"'Outfit',sans-serif" }}>
                    FEATURED
                  </div>
                )}
                <button onClick={() => toggleFav(portrait.id)} style={{ position:"absolute", top:12, right:12, width:32, height:32, background:"rgba(8,7,5,0.7)", border:`1px solid ${isFav ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.25s" }}>
                  <Heart size={13} color={isFav ? C.gold : C.creamMuted} fill={isFav ? C.gold : "none"}/>
                </button>
              </div>

              {/* Style name */}
              <div style={{ padding:"12px 14px 8px", background:C.bgCard, borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.cream, marginBottom:8 }}>{portrait.style}</div>

                {/* Action row */}
                <div style={{ display:"flex", gap:6 }}>
                  <button className="action-btn" onClick={() => handleDownload(portrait)} style={{ borderColor: isDLing ? C.gold : C.border }}>
                    <Download size={14} color={isDLing ? C.gold : C.creamMuted}/>
                    <span style={{ color: isDLing ? C.gold : C.creamMuted }}>{isDLing ? "Saving..." : "Download"}</span>
                  </button>
                  <button className="action-btn" onClick={() => handleCopyLink(portrait)}>
                    <Copy size={14} color={isCopied ? C.gold : C.creamMuted}/>
                    <span style={{ color: isCopied ? C.gold : C.creamMuted }}>{isCopied ? "Copied!" : "Copy Link"}</span>
                  </button>
                  <button className="action-btn" onClick={() => {}}>
                    <Share2 size={14} color={C.creamMuted}/>
                    <span>Share</span>
                  </button>
                  <button className="action-btn" onClick={() => onFrameClick(portrait)} style={{ background:C.goldBg, borderColor:C.goldDim }}>
                    <FrameIcon size={14} color={C.gold}/>
                    <span style={{ color:C.gold }}>Frame It</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing note */}
      <div style={{ marginTop:20, padding:"16px 20px", border:`1px solid ${C.border}`, background:C.bgCard, display:"flex", gap:14, alignItems:"center" }}>
        <RefreshCw size={14} color={C.goldDim}/>
        <div>
          <span style={{ fontSize:13, color:C.cream }}>Want a different result on any style?</span>
          <span style={{ fontSize:13, color:C.creamMuted }}> Use your Regeneration Pass (if purchased) or{" "}
            <span style={{ color:C.gold, cursor:"pointer" }}>contact us within 30 days</span> for a free redo.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SHARE SECTION ──────────────────────────────────────────────
function ShareSection() {
  const [copied, setCopied] = useState(false);
  const referralCode = "DIGITAL-A4X2K";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 40px 80px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Share your portraits */}
        <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"28px 24px" }}>
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:12 }}>Share Your Portraits</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.cream, marginBottom:12 }}>Show the World</h3>
          <p style={{ fontSize:13, color:C.creamMuted, lineHeight:1.7, marginBottom:20 }}>
            Tag us and let your friends discover what their photos could become.
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              [Instagram, "#E1306C", "Instagram"],
              [Twitter,   "#1DA1F2", "Twitter / X"],
              [Facebook,  "#4267B2", "Facebook"],
            ].map(([Icon, color, label]) => (
              <div key={label} className="share-chip">
                <Icon size={14} color={color}/>{label}
              </div>
            ))}
            <div className="share-chip">
              <Copy size={13} color={C.creamMuted}/>Copy Portrait Link
            </div>
          </div>
          <p style={{ fontSize:11, color:C.creamMuted, marginTop:16 }}>Tag us @DigitalPhotosAI · Use #DigitalPhotos</p>
        </div>

        {/* Referral */}
        <div className="referral-box">
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:12 }}>Refer a Friend</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.cream, marginBottom:12 }}>
            Share & Earn $10
          </h3>
          <p style={{ fontSize:13, color:C.creamMuted, lineHeight:1.7, marginBottom:20 }}>
            Every friend you refer who makes a purchase earns you $10 credit toward prints, canvases, or your next session.
          </p>
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            <input
              readOnly value={referralCode}
              style={{ flex:1, padding:"11px 14px", background:C.bg, border:`1px solid ${C.border}`, color:C.cream, fontFamily:"'Outfit',sans-serif", fontSize:13, letterSpacing:"0.08em", outline:"none" }}
            />
            <button className="btn-gold" style={{ padding:"11px 20px", fontSize:11 }} onClick={copyCode}>
              {copied ? <Check size={13}/> : <Copy size={13}/>}
            </button>
          </div>
          <div style={{ fontSize:12, color:C.creamMuted, display:"flex", gap:6, alignItems:"center" }}>
            <Users size={11} color={C.goldDim}/>
            You have 0 referrals. Share your code to start earning.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FRAME UPSELL (if only digital purchased) ──────────────────
function FrameUpsellSection({ onAddToCart }) {
  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 40px 80px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:10, letterSpacing:"0.25em", color:C.gold, textTransform:"uppercase", marginBottom:12 }}>Make It Real</div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:300, color:C.cream, lineHeight:1.1 }}>
          From Screen to <em>Wall</em>
        </h2>
        <p style={{ color:C.creamMuted, fontSize:14, marginTop:12, maxWidth:440, margin:"12px auto 0" }}>
          Most customers who download say they wish they'd ordered a print too. Add one now at a discount.
        </p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:32 }}>
        {FRAME_UPSELLS.map(frame => (
          <div key={frame.id} className="upsell-card">
            <div style={{ display:"grid", gridTemplateColumns:"120px 1fr", gap:0 }}>
              <img src={frame.img} alt={frame.name} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }}/>
              <div style={{ padding:"18px 18px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream, marginBottom:4 }}>{frame.name}</div>
                <div style={{ fontSize:11, color:C.creamMuted, marginBottom:12 }}>{frame.size}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:C.gold, marginBottom:12 }}>${frame.price}</div>
                <button className="btn-outline" style={{ padding:"9px 16px", fontSize:10 }} onClick={() => onAddToCart(frame)}>
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
        {[
          [Award,    "Archival Inks",     "100-year fade resistance"],
          [Package,  "White-Glove Pack",  "Arrives ready to hang"],
          [Truck,    "Free Shipping",     "Orders over $75"],
          [Globe,    "Ships Worldwide",   "180+ countries"],
        ].map(([Icon,title,sub]) => (
          <div key={title} style={{ textAlign:"center", padding:"20px 16px", border:`1px solid ${C.border}`, background:C.bgCard }}>
            <Icon size={18} color={C.gold} style={{ marginBottom:10 }}/>
            <div style={{ fontSize:12, color:C.cream, marginBottom:4 }}>{title}</div>
            <div style={{ fontSize:10, color:C.creamMuted }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CREATE AGAIN SECTION ───────────────────────────────────────
function CreateAgainSection() {
  const goCreate = () => { window.location.href = "/create"; };
  const goGift = () => { window.location.href = "/gift"; };

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 40px 80px" }}>
      <div style={{
        background:`linear-gradient(135deg,rgba(196,150,58,0.1),rgba(100,70,15,0.05))`,
        border:`1px solid rgba(196,150,58,0.25)`, padding:"48px 40px", textAlign:"center",
      }}>
        <Sparkles size={24} color={C.gold} style={{ marginBottom:16 }}/>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:300, color:C.cream, lineHeight:1.1, marginBottom:16 }}>
          Ready for Another <em>Masterpiece?</em>
        </h2>
        <p style={{ color:C.creamMuted, fontSize:15, maxWidth:440, margin:"0 auto 36px", lineHeight:1.7 }}>
          Create portraits for another category, give them as a gift, or explore a different set of styles.
        </p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-gold pulse-gold" style={{ padding:"16px 36px", fontSize:11 }} onClick={goCreate}>
            Create New Portraits
          </button>
          <button className="btn-outline" style={{ padding:"16px 32px", fontSize:11 }} onClick={goGift}>
            <Gift size={13} style={{ display:"inline", marginRight:8, verticalAlign:"middle" }}/>
            Give as a Gift
          </button>
        </div>
        <p style={{ color:C.creamMuted, fontSize:12, marginTop:20 }}>
          Members enjoy 20% off additional sessions. <span style={{ color:C.gold, cursor:"pointer" }}>Join the community →</span>
        </p>
      </div>
    </div>
  );
}

// ── FRAME MODAL ────────────────────────────────────────────────
function FrameModal({ portrait, onClose }) {
  if (!portrait) return null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(8,7,5,0.93)", backdropFilter:"blur(10px)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.3s ease" }}>
      <div style={{ background:C.bgCard, border:`1px solid ${C.borderLight}`, maxWidth:600, width:"calc(100% - 40px)", animation:"fadeUp 0.4s ease", padding:0 }}>
        <div style={{ padding:"22px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.cream }}>Frame This Portrait</span>
          <button style={{ background:"none", border:"none", cursor:"pointer" }} onClick={onClose}>
            <Check size={16} color={C.creamMuted} style={{ display:"none" }}/>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" onClick={onClose} style={{ cursor:"pointer" }}>
              <line x1="2" y1="2" x2="14" y2="14" stroke={C.creamMuted} strokeWidth={2}/>
              <line x1="14" y1="2" x2="2" y2="14" stroke={C.creamMuted} strokeWidth={2}/>
            </svg>
          </button>
        </div>
        <div style={{ padding:"24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:20, marginBottom:24 }}>
            <img src={portrait.img} alt="" style={{ width:"100%", aspectRatio:"4/5", objectFit:"cover" }}/>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream, marginBottom:6 }}>{portrait.style}</div>
              <p style={{ fontSize:13, color:C.creamMuted, lineHeight:1.7, marginBottom:20 }}>
                Have this portrait professionally printed and framed. Ships to your door ready to hang.
              </p>
              {FRAME_UPSELLS.map(f => (
                <div key={f.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize:14, color:C.cream }}>{f.name}</div>
                    <div style={{ fontSize:11, color:C.creamMuted }}>{f.size}</div>
                  </div>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.gold }}>${f.price}</span>
                    <button className="btn-gold" style={{ padding:"8px 18px", fontSize:10 }} onClick={onClose}>
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN DELIVERY PAGE ─────────────────────────────────────────
export default function DeliveryPage() {
  const [frameModal, setFrameModal] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  // In production: get these from route state or API
  const orderProduct = "digital";
  const orderNumber = "DP-2025-" + Math.random().toString(36).slice(2,8).toUpperCase();

  const handleAddToCart = (frame) => {
    setCartMessage(`${frame.name} added to your order!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  return (
    <>
      <style>{CSS}</style>
      <ConfettiBurst />
      <div style={{ background:C.bg, minHeight:"100vh" }}>
        {/* Top nav */}
        <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(8,7,5,0.97)", backdropFilter:"blur(18px)", borderBottom:`1px solid ${C.border}`, padding:"0 40px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream, cursor:"pointer" }} onClick={() => window.location.href="/"}>
              Digital<span style={{ color:C.gold }}>Photos</span><span style={{ fontSize:9, verticalAlign:"super", color:C.goldDim }}>™</span>
            </div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <span style={{ fontSize:11, color:C.creamMuted }}>Order #{orderNumber}</span>
              <button className="btn-ghost" style={{ padding:"8px 16px" }} onClick={() => window.location.href="/"}>
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Cart message toast */}
        {cartMessage && (
          <div style={{ position:"fixed", bottom:32, right:32, zIndex:200, background:C.bgCard, border:`1px solid ${C.gold}`, padding:"14px 20px", display:"flex", gap:10, alignItems:"center", animation:"fadeUp 0.3s ease" }}>
            <Check size={14} color={C.gold}/>
            <span style={{ fontSize:13, color:C.cream }}>{cartMessage}</span>
          </div>
        )}

        {/* Confirmation header */}
        <ConfirmationHeader orderProduct={orderProduct}/>

        {/* Portrait grid */}
        <PortraitGrid
          portraits={UNLOCKED_PORTRAITS}
          onFrameClick={p => setFrameModal(p)}
        />

        {/* Frame upsell (shown if digital-only purchase) */}
        {orderProduct === "digital" && (
          <FrameUpsellSection onAddToCart={handleAddToCart}/>
        )}

        {/* Share + Referral */}
        <ShareSection/>

        {/* Create again */}
        <CreateAgainSection/>

        {/* Footer strip */}
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"32px 40px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.cream }}>
              Digital<span style={{ color:C.gold }}>Photos</span><span style={{ fontSize:8, verticalAlign:"super", color:C.goldDim }}>™</span>
            </div>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {["Help Center","Refund Policy","Contact Us","Community Gallery"].map(l => (
                <span key={l} style={{ fontSize:11, color:C.creamMuted, cursor:"pointer" }}>{l}</span>
              ))}
            </div>
            <span style={{ fontSize:11, color:C.creamMuted }}>© 2025 Digital Photos™</span>
          </div>
        </div>

        {/* Frame modal */}
        {frameModal && <FrameModal portrait={frameModal} onClose={() => setFrameModal(null)}/>}
      </div>
    </>
  );
}
