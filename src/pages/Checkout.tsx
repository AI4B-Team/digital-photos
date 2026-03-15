// @ts-nocheck
// ============================================================
// DIGITAL PHOTOS™ — PHASE 3: CHECKOUT FLOW
// Copy this entire file into Lovable as: src/pages/Checkout.jsx
//
// FLOW:
//   Screen 1 → Product Selection (Digital / Fine Art Print / Canvas)
//   Screen 2 → Order Bumps + Payment Form
//   Screen 3 → OTO Post-Purchase Upsell Modal
//
// After OTO dismiss → navigate to /delivery
// Stripe integration: replace handlePurchase() with Stripe.js call
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { createCheckoutSession } from "@/lib/stripe";
import {
  Check, X, ChevronRight, ChevronLeft, Shield, Lock,
  Truck, Clock, RefreshCw, Star, Gift, Sparkles, Image,
  Globe, Plus, Minus, Package, FrameIcon, Download,
  CreditCard, Mail, User, ArrowRight, Layers, Zap,
  Award, AlertCircle, Heart, Crown
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
  @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulseGold{ 0%,100%{box-shadow:0 0 0 0 rgba(196,150,58,0.3)} 50%{box-shadow:0 0 0 14px rgba(196,150,58,0)} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

  .fade-in   { animation:fadeIn  0.5s ease forwards; }
  .fade-up   { animation:fadeUp  0.6s ease forwards; }
  .slide-up  { animation:slideUp 0.5s ease forwards; }
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
  .btn-gold:disabled { opacity:0.4; cursor:not-allowed; transform:none; }

  .btn-outline {
    background:transparent; border:1px solid #C4963A; color:#C4963A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-weight:400; letter-spacing:0.1em;
    text-transform:uppercase; transition:all 0.3s;
  }
  .btn-outline:hover { background:rgba(196,150,58,0.08); }

  .btn-ghost {
    background:transparent; border:1px solid #1E1B14; color:#B8B09A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:11px; letter-spacing:0.1em;
    text-transform:uppercase; transition:all 0.3s; padding:12px 24px;
  }
  .btn-ghost:hover { border-color:#2A261D; color:#F2EDE4; }

  .product-card {
    background:#0F0D0A; border:2px solid #1E1B14; cursor:pointer; position:relative;
    transition:all 0.35s cubic-bezier(0.23,1,0.32,1); padding:32px 28px;
  }
  .product-card:hover   { border-color:rgba(196,150,58,0.4); transform:translateY(-4px); }
  .product-card.active  { border-color:#C4963A; background:rgba(196,150,58,0.05); }
  .product-card.popular { border-color:rgba(196,150,58,0.5); }

  .bump-row {
    border:1px solid #1E1B14; padding:18px 20px; cursor:pointer; display:flex;
    align-items:flex-start; gap:16px; transition:all 0.3s; background:#0F0D0A;
    margin-bottom:10px;
  }
  .bump-row:hover   { border-color:rgba(196,150,58,0.35); }
  .bump-row.checked { border-color:#C4963A; background:rgba(196,150,58,0.05); }

  .form-field {
    background:#0F0D0A; border:1px solid #1E1B14; color:#F2EDE4;
    font-family:'Outfit',sans-serif; font-size:14px; font-weight:300;
    padding:13px 16px; width:100%; outline:none; transition:border-color 0.3s;
  }
  .form-field:focus { border-color:#C4963A; }
  .form-field::placeholder { color:#6A6355; }
  .form-label {
    font-size:10px; letter-spacing:0.2em; text-transform:uppercase;
    color:#B8B09A; margin-bottom:8px; display:block;
  }

  .modal-backdrop {
    position:fixed; inset:0; background:rgba(8,7,5,0.92);
    backdrop-filter:blur(10px); z-index:500;
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn 0.3s ease;
  }
  .modal-box {
    background:#0F0D0A; border:1px solid #2A261D;
    max-width:580px; width:calc(100% - 40px);
    max-height:90vh; overflow:auto;
    animation:slideUp 0.4s ease;
  }

  .size-btn {
    padding:8px 16px; border:1px solid #1E1B14; background:#0F0D0A; cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:12px; color:#B8B09A;
    transition:all 0.25s;
  }
  .size-btn:hover  { border-color:rgba(196,150,58,0.4); color:#F2EDE4; }
  .size-btn.active { border-color:#C4963A; color:#C4963A; background:rgba(196,150,58,0.06); }

  @media (max-width:768px) {
    .hide-sm  { display:none !important; }
    .sm-col   { flex-direction:column !important; }
    .sm-full  { width:100% !important; }
    .checkout-grid { grid-template-columns:1fr !important; }
  }
`;

// ── DATA ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id:"digital",
    name:"Digital Download",
    price:29,
    originalPrice:58,
    badge:null,
    icon:Download,
    desc:"All 6 portrait styles in full HD. Delivered to your inbox instantly.",
    features:[
      "All 6 AI portraits watermark-free",
      "Full HD resolution (print-ready quality)",
      "Instant email delivery",
      "Personal use license",
      "Share to any platform",
    ],
    deliveryNote:"Instant · Delivered by email",
  },
  {
    id:"print",
    name:"Fine Art Print",
    price:89,
    originalPrice:149,
    badge:"MOST POPULAR",
    icon:Image,
    desc:"Professionally printed on 100-year archival paper. Ships in 5–7 days.",
    features:[
      "All 6 digital files included",
      "8×10\" or 11×14\" size options",
      "100-year archival inks",
      "Museum-quality paper stock",
      "Ships in premium packaging",
    ],
    deliveryNote:"Ships in 5–7 days · Free over $75",
    sizes:['8"×10"','11"×14"'],
  },
  {
    id:"canvas",
    name:"Canvas Print",
    price:149,
    originalPrice:299,
    badge:null,
    icon:FrameIcon,
    desc:"Gallery-wrapped canvas ready to hang. The ultimate statement piece.",
    features:[
      "All 6 digital files included",
      "12×16\" to 24×30\" size options",
      "Gallery-wrapped edges",
      "Ready-to-hang hardware included",
      "White-glove packaging",
    ],
    deliveryNote:"Ships in 7–10 days · Free shipping",
    sizes:['12"×16"','16"×20"','24"×30"'],
  },
];

const ORDER_BUMPS = [
  {
    id:"rush",
    label:"⚡ Rush Processing — Done in 2 Minutes",
    desc:"Move to the front of the queue. Your full-res files ready in under 2 minutes.",
    price:9,
    icon:Zap,
  },
  {
    id:"xl",
    label:"🖼 XL Print-Ready Files (40MP Upscale)",
    desc:"Every portrait upscaled to 40 megapixels. Print up to 24×30\" with zero quality loss.",
    price:12,
    icon:Image,
  },
  {
    id:"extra",
    label:"✨ +2 Extra Styles (Vintage + Fairytale)",
    desc:"Add two more AI portrait styles to your session for an even richer collection.",
    price:15,
    icon:Sparkles,
  },
  {
    id:"commercial",
    label:"📄 Commercial License",
    desc:"Use your portraits in business branding, social ads, websites, and marketing materials.",
    price:29,
    icon:Globe,
  },
  {
    id:"gift",
    label:"🎁 Gift Delivery Option",
    desc:"Send your portraits as a gift to any email. Include a personal message and choose the send date.",
    price:9,
    icon:Gift,
  },
  {
    id:"regen",
    label:"🔄 Regeneration Pass",
    desc:"Not 100% happy with a style? Regenerate any portrait twice with custom direction notes.",
    price:14,
    icon:RefreshCw,
  },
];

const CANVAS_UPSELL = {
  title:"One Last Thing Before You Go",
  headline:"Turn Your Favorite Portrait into Wall Art",
  sub:"Most people who download their portraits wish they'd ordered the canvas. Add one now — no new payment info needed.",
  offer:"Add Canvas Print (12\"×16\") for just $99",
  originalPrice:149,
  salePrice:99,
  img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=280&h=340&fit=crop",
};

// ── PORTRAIT THUMBNAILS (mock) ────────────────────────────────
const PORTRAIT_THUMBS = [
  { style:"Royal Portrait",     img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=100&fit=crop" },
  { style:"Renaissance",        img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=100&fit=crop" },
  { style:"Storybook Fantasy",  img:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=100&fit=crop" },
  { style:"Cinematic",          img:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=100&fit=crop" },
  { style:"Minimal Fine Art",   img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=100&fit=crop" },
  { style:"Vintage",            img:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=80&h=100&fit=crop" },
];

// ── HELPERS ────────────────────────────────────────────────────
function formatPrice(cents) { return `$${cents}`; }

function TrustBadges({ compact=false }) {
  const badges = [
    [Lock,    "Secure Checkout"],
    [Shield,  "SSL Encrypted"],
    [RefreshCw,"30-Day Guarantee"],
    [Truck,   "Ships Worldwide"],
  ];
  return (
    <div style={{ display:"flex", gap: compact ? 16 : 24, flexWrap:"wrap", justifyContent:"center" }}>
      {badges.map(([Icon,label]) => (
        <div key={label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:C.creamMuted }}>
          <Icon size={11} color={C.goldDim}/>{label}
        </div>
      ))}
    </div>
  );
}

// ── SCREEN 1: PRODUCT SELECTION ────────────────────────────────
function ProductSelectScreen({ selected, setSelected, onNext }) {
  const [printSize, setPrintSize] = useState({});

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"60px 40px" }} className="fade-in">
      <div style={{ textAlign:"center", marginBottom:56 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:14 }}>Almost There</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(34px,5vw,62px)", fontWeight:300, color:C.cream, lineHeight:1.0, marginBottom:16 }}>
          Choose Your <span className="gold-shimmer">Product</span>
        </h1>
        <p style={{ color:C.creamMuted, fontSize:15, maxWidth:480, margin:"0 auto" }}>
          Your 6 portraits are ready. Select how you'd like to receive them.
          All options include your full digital files.
        </p>
      </div>

      {/* Portrait preview strip */}
      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:48, flexWrap:"wrap" }}>
        {PORTRAIT_THUMBS.map((p,i) => (
          <div key={i} style={{ position:"relative", width:60, height:75, overflow:"hidden", border:`1px solid ${C.border}` }}>
            <img src={p.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            <div style={{ position:"absolute", inset:0, background:"rgba(8,7,5,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:7, color:"rgba(255,255,255,0.4)", letterSpacing:"0.15em", textTransform:"uppercase", transform:"rotate(-30deg)", userSelect:"none", whiteSpace:"nowrap" }}>DP™</span>
            </div>
          </div>
        ))}
        <div style={{ display:"flex", alignItems:"center", paddingLeft:8 }}>
          <span style={{ fontSize:12, color:C.creamMuted }}>6 portraits ready to unlock</span>
        </div>
      </div>

      {/* Product cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginBottom:40 }}>
        {PRODUCTS.map(prod => {
          const Icon = prod.icon;
          const isActive = selected === prod.id;
          return (
            <div
              key={prod.id}
              className={`product-card${isActive?" active":""}${prod.badge?" popular":""}`}
              onClick={() => setSelected(prod.id)}
            >
              {prod.badge && (
                <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, color:C.bg, fontSize:9, fontWeight:700, letterSpacing:"0.2em", padding:"4px 16px", fontFamily:"'Outfit',sans-serif", whiteSpace:"nowrap" }}>
                  {prod.badge}
                </div>
              )}

              {/* Select indicator */}
              <div style={{ position:"absolute", top:16, right:16, width:22, height:22, border:`2px solid ${isActive ? C.gold : C.border}`, background: isActive ? C.gold : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s" }}>
                {isActive && <Check size={12} color={C.bg}/>}
              </div>

              <div style={{ marginBottom:20 }}>
                <div style={{ width:44, height:44, border:`1px solid ${isActive ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, transition:"border-color 0.3s" }}>
                  <Icon size={18} color={isActive ? C.gold : C.creamMuted}/>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:C.cream, marginBottom:4 }}>{prod.name}</div>
              </div>

              {/* Price */}
              <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:6 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:46, fontWeight:300, color:C.cream }}>${prod.price}</span>
                {prod.originalPrice && (
                  <span style={{ fontSize:16, color:C.creamMuted, textDecoration:"line-through" }}>${prod.originalPrice}</span>
                )}
              </div>
              {prod.originalPrice && (
                <div style={{ fontSize:11, color:"#4CAF77", marginBottom:16 }}>
                  You save ${prod.originalPrice - prod.price}
                </div>
              )}

              <p style={{ fontSize:13, color:C.creamMuted, lineHeight:1.65, marginBottom:20 }}>{prod.desc}</p>

              <div style={{ height:1, background:C.border, marginBottom:18 }}/>

              {prod.features.map(f => (
                <div key={f} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8, fontSize:12, color:C.creamMuted }}>
                  <Check size={10} color={C.gold} style={{ marginTop:3, flexShrink:0 }}/>{f}
                </div>
              ))}

              {/* Size selector */}
              {prod.sizes && isActive && (
                <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:10, letterSpacing:"0.15em", color:C.creamMuted, textTransform:"uppercase", marginBottom:10 }}>Select Size</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {prod.sizes.map(sz => (
                      <button key={sz} className={`size-btn${printSize[prod.id]===sz?" active":""}`} onClick={e => { e.stopPropagation(); setPrintSize(prev => ({...prev,[prod.id]:sz})); }}>
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop:16, fontSize:11, color:C.creamMuted, display:"flex", alignItems:"center", gap:6 }}>
                <Truck size={10} color={C.goldDim}/>{prod.deliveryNote}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign:"center" }}>
        <button className="btn-gold pulse-gold" style={{ padding:"20px 60px", fontSize:13 }} onClick={onNext} disabled={!selected}>
          Continue to Checkout <ArrowRight size={14} style={{ display:"inline", marginLeft:10, verticalAlign:"middle" }}/>
        </button>
        <div style={{ marginTop:20 }}>
          <TrustBadges compact />
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 2: ORDER BUMPS + PAYMENT FORM ──────────────────────
function CheckoutScreen({ product, bumps, setBumps, onComplete, onBack, sessionId }) {
  const [form, setForm] = useState({ email:"", firstName:"", lastName:"", card:"", expiry:"", cvc:"", address:"", city:"", zip:"", country:"US" });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [giftMode, setGiftMode] = useState(false);

  const selectedProduct = PRODUCTS.find(p => p.id === product);
  const bumpsTotal = bumps.reduce((s,id) => s + (ORDER_BUMPS.find(b => b.id===id)?.price||0), 0);
  const total = (selectedProduct?.price || 0) + bumpsTotal;

  const toggleBump = (id) => setBumps(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.firstName.trim()) e.firstName = "Required";
    if (form.card.replace(/\s/g,"").length < 16) e.card = "Enter valid card number";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/YY";
    if (form.cvc.length < 3) e.cvc = "3–4 digits";
    return e;
  };

  const handlePurchase = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setProcessing(true);
    try {
      const url = await createCheckoutSession(product, form.email, sessionId);
      // Save order info before redirecting
      onComplete();
      window.location.href = url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
      setProcessing(false);
      setErrors({ card: "Payment failed. Please try again." });
    }
  };

  const f = (field, value) => setForm(prev => ({...prev,[field]:value}));

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"50px 40px" }} className="fade-in">
      <div style={{ marginBottom:40 }}>
        <p style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:8 }}>Final Step</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,4vw,52px)", fontWeight:300, color:C.cream }}>
          Complete Your Order
        </h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:32, alignItems:"start" }} className="checkout-grid">
        {/* Left: Bumps + Form */}
        <div>
          {/* ORDER BUMPS — MUST appear BEFORE payment form */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"28px 24px", marginBottom:28 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:6 }}>
              <Sparkles size={14} color={C.gold}/>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.cream }}>Enhance Your Session</span>
            </div>
            <p style={{ fontSize:13, color:C.creamMuted, marginBottom:22 }}>
              Add these one-time upgrades to your order. Check the ones you want:
            </p>
            {ORDER_BUMPS.map(bump => {
              const checked = bumps.includes(bump.id);
              const BIcon = bump.icon;
              return (
                <div key={bump.id} className={`bump-row${checked?" checked":""}`} onClick={() => toggleBump(bump.id)}>
                  {/* Checkbox */}
                  <div style={{ width:22, height:22, border:`2px solid ${checked ? C.gold : C.borderLight}`, background: checked ? C.gold : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.25s", marginTop:2 }}>
                    {checked && <Check size={12} color={C.bg}/>}
                  </div>
                  <div style={{ width:32, height:32, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:checked ? C.goldBg : "transparent", transition:"all 0.3s" }}>
                    <BIcon size={13} color={checked ? C.gold : C.creamMuted}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:C.cream, fontWeight:checked?400:300, marginBottom:3 }}>{bump.label}</div>
                    <div style={{ fontSize:12, color:C.creamMuted, lineHeight:1.5 }}>{bump.desc}</div>
                  </div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color: checked ? C.gold : C.creamMuted, flexShrink:0 }}>
                    +${bump.price}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAYMENT FORM */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"28px 24px" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:24 }}>
              <CreditCard size={16} color={C.gold}/>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:C.cream }}>Payment Details</span>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                {["VISA","MC","AMEX"].map(c => (
                  <div key={c} style={{ fontSize:9, letterSpacing:"0.1em", border:`1px solid ${C.border}`, padding:"3px 8px", color:C.creamMuted }}>{c}</div>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom:18 }}>
              <label className="form-label">Email Address</label>
              <input className="form-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => f("email",e.target.value)}/>
              {errors.email && <p style={{ fontSize:11, color:"#E06060", marginTop:6 }}>{errors.email}</p>}
            </div>

            {/* Name row */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
              <div>
                <label className="form-label">First Name</label>
                <input className="form-field" placeholder="First" value={form.firstName} onChange={e => f("firstName",e.target.value)}/>
                {errors.firstName && <p style={{ fontSize:11, color:"#E06060", marginTop:6 }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input className="form-field" placeholder="Last" value={form.lastName} onChange={e => f("lastName",e.target.value)}/>
              </div>
            </div>

            {/* Card number */}
            <div style={{ marginBottom:18 }}>
              <label className="form-label">Card Number</label>
              <div style={{ position:"relative" }}>
                <input className="form-field" placeholder="1234  5678  9012  3456" value={form.card}
                  onChange={e => f("card", e.target.value.replace(/\D/g,"").replace(/(\d{4})/g,"$1 ").trim().slice(0,19))}/>
                <CreditCard size={14} color={C.creamMuted} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)" }}/>
              </div>
              {errors.card && <p style={{ fontSize:11, color:"#E06060", marginTop:6 }}>{errors.card}</p>}
            </div>

            {/* Expiry + CVC */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
              <div>
                <label className="form-label">Expiry Date</label>
                <input className="form-field" placeholder="MM/YY" value={form.expiry}
                  onChange={e => { let v=e.target.value.replace(/\D/g,""); if(v.length>=2)v=v.slice(0,2)+"/"+v.slice(2); f("expiry",v.slice(0,5)); }}/>
                {errors.expiry && <p style={{ fontSize:11, color:"#E06060", marginTop:6 }}>{errors.expiry}</p>}
              </div>
              <div>
                <label className="form-label">CVC</label>
                <input className="form-field" placeholder="•••" maxLength={4} value={form.cvc} onChange={e => f("cvc",e.target.value.replace(/\D/g,""))}/>
                {errors.cvc && <p style={{ fontSize:11, color:"#E06060", marginTop:6 }}>{errors.cvc}</p>}
              </div>
            </div>

            {/* Shipping address (only for print/canvas) */}
            {(product === "print" || product === "canvas") && (
              <>
                <div style={{ height:1, background:C.border, marginBottom:20 }}/>
                <div style={{ fontSize:12, color:C.creamMuted, marginBottom:16, display:"flex", gap:8, alignItems:"center" }}>
                  <Truck size={12} color={C.goldDim}/>Shipping Address
                </div>
                <div style={{ marginBottom:14 }}>
                  <label className="form-label">Street Address</label>
                  <input className="form-field" placeholder="123 Main Street" value={form.address} onChange={e => f("address",e.target.value)}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                  <div>
                    <label className="form-label">City</label>
                    <input className="form-field" placeholder="New York" value={form.city} onChange={e => f("city",e.target.value)}/>
                  </div>
                  <div>
                    <label className="form-label">ZIP / Postal</label>
                    <input className="form-field" placeholder="10001" value={form.zip} onChange={e => f("zip",e.target.value)}/>
                  </div>
                </div>
              </>
            )}

            {/* Gift delivery toggle */}
            <div style={{ border:`1px solid ${C.border}`, padding:"14px 16px", marginBottom:20, cursor:"pointer", display:"flex", gap:14, alignItems:"center" }} onClick={() => setGiftMode(!giftMode)}>
              <div style={{ width:20, height:20, border:`2px solid ${giftMode ? C.gold : C.border}`, background: giftMode ? C.gold : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.25s", flexShrink:0 }}>
                {giftMode && <Check size={11} color={C.bg}/>}
              </div>
              <Gift size={13} color={C.goldDim}/>
              <div>
                <div style={{ fontSize:13, color:C.cream }}>This is a gift</div>
                <div style={{ fontSize:11, color:C.creamMuted }}>Send to a different email with a personal message</div>
              </div>
            </div>

            {giftMode && (
              <div style={{ marginBottom:20 }}>
                <div style={{ marginBottom:14 }}>
                  <label className="form-label">Recipient Email</label>
                  <input className="form-field" placeholder="recipient@email.com" type="email"/>
                </div>
                <div>
                  <label className="form-label">Personal Message (optional)</label>
                  <textarea className="form-field" placeholder="Write a heartfelt message..." rows={3} style={{ resize:"vertical", lineHeight:1.6 }}/>
                </div>
              </div>
            )}

            {/* Big CTA */}
            <button
              className="btn-gold"
              style={{ width:"100%", padding:"20px", fontSize:13, letterSpacing:"0.12em", marginBottom:16, opacity: processing ? 0.7 : 1 }}
              onClick={handlePurchase}
              disabled={processing}
            >
              {processing ? "Processing Your Order..." : `Complete My Order — $${total}`}
            </button>
            <div style={{ textAlign:"center" }}>
              <TrustBadges compact />
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div style={{ position:"sticky", top:100 }}>
          {/* Portrait preview */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"20px", marginBottom:16 }}>
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:14 }}>Your Order</div>
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              {PORTRAIT_THUMBS.slice(0,4).map((p,i) => (
                <img key={i} src={p.img} alt="" style={{ width:48, height:60, objectFit:"cover", opacity:0.75, border:`1px solid ${C.border}` }}/>
              ))}
              <div style={{ width:48, height:60, background:C.bg, border:`1px dashed ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.creamMuted }}>+2</span>
              </div>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.cream, marginBottom:4 }}>
              {selectedProduct?.name}
            </div>
            <div style={{ fontSize:12, color:C.creamMuted }}>6 AI Portraits · {selectedProduct?.deliveryNote}</div>
          </div>

          {/* Price breakdown */}
          <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"20px" }}>
            <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.gold, textTransform:"uppercase", marginBottom:14 }}>Price Breakdown</div>

            <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, color:C.creamMuted, marginBottom:10 }}>
              <span>{selectedProduct?.name}</span>
              <span>${selectedProduct?.price}</span>
            </div>

            {bumps.map(id => {
              const b = ORDER_BUMPS.find(b => b.id === id);
              return b ? (
                <div key={id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.creamMuted, marginBottom:8, alignItems:"flex-start", gap:8 }}>
                  <span style={{ flex:1, fontSize:12 }}>{b.label.replace(/^[^\s]+ /,"")}</span>
                  <span>+${b.price}</span>
                </div>
              ) : null;
            })}

            {selectedProduct?.originalPrice && (
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4CAF77", marginBottom:10 }}>
                <span>Savings</span>
                <span>-${selectedProduct.originalPrice - selectedProduct.price}</span>
              </div>
            )}

            <div style={{ height:1, background:C.border, margin:"14px 0" }}/>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <span style={{ fontSize:13, color:C.creamMuted, letterSpacing:"0.08em" }}>TOTAL</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, color:C.cream }}>${total}</span>
            </div>

            <div style={{ marginTop:14, padding:"12px 14px", background:C.successBg, border:`1px solid rgba(76,175,119,0.2)`, display:"flex", gap:10, alignItems:"center" }}>
              <RefreshCw size={12} color={C.success}/>
              <span style={{ fontSize:12, color:C.success }}>30-day money-back guarantee</span>
            </div>
          </div>

          {/* Testimonial snippet */}
          <div style={{ marginTop:16, background:C.bgCard, border:`1px solid ${C.border}`, padding:"20px" }}>
            <div style={{ display:"flex", gap:3, marginBottom:10 }}>
              {Array(5).fill(0).map((_,i) => <Star key={i} size={11} fill={C.gold} color={C.gold}/>)}
            </div>
            <p style={{ fontSize:13, color:C.creamMuted, lineHeight:1.7, fontStyle:"italic" }}>
              "The Royal Portrait is now the centerpiece of my living room. I've gotten more compliments on it than any real art I own."
            </p>
            <p style={{ fontSize:11, color:C.creamMuted, marginTop:10 }}>— Sarah M., Verified Buyer</p>
          </div>

          <button className="btn-ghost" style={{ width:"100%", marginTop:12 }} onClick={onBack}>
            <ChevronLeft size={13} style={{ display:"inline", marginRight:6, verticalAlign:"middle" }}/>Change Product
          </button>
        </div>
      </div>
    </div>
  );
}

// ── OTO UPSELL MODAL ──────────────────────────────────────────
function OTOModal({ product, onAccept, onDecline }) {
  // Only show canvas upsell if they bought digital or print (not canvas already)
  if (product === "canvas") { onDecline(); return null; }

  return (
    <div className="modal-backdrop" onClick={onDecline}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:"28px 28px 20px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:10, letterSpacing:"0.25em", color:C.gold, textTransform:"uppercase", marginBottom:8 }}>{CANVAS_UPSELL.title}</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:300, color:C.cream, lineHeight:1.1 }}>
                {CANVAS_UPSELL.headline}
              </h2>
            </div>
            <button style={{ background:"none", border:"none", cursor:"pointer", padding:4, marginLeft:16 }} onClick={onDecline}>
              <X size={16} color={C.creamMuted}/>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:"24px 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:20, marginBottom:24, alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <img src={CANVAS_UPSELL.img} alt="Canvas sample" style={{ width:"100%", aspectRatio:"4/5", objectFit:"cover", display:"block" }}/>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(8,7,5,0.8)", padding:"8px 12px", fontSize:10, color:C.cream, textAlign:"center", letterSpacing:"0.1em" }}>
                CANVAS PRINT SAMPLE
              </div>
            </div>
            <div>
              <p style={{ color:C.creamMuted, fontSize:14, lineHeight:1.7, marginBottom:20 }}>
                {CANVAS_UPSELL.sub}
              </p>
              <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:12 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, color:C.cream }}>${CANVAS_UPSELL.salePrice}</span>
                <span style={{ fontSize:18, color:C.creamMuted, textDecoration:"line-through" }}>${CANVAS_UPSELL.originalPrice}</span>
              </div>
              <p style={{ fontSize:12, color:C.creamMuted, marginBottom:20 }}>12"×16" gallery-wrapped canvas · Ships in 7–10 days</p>
              {[
                "Gallery-wrapped, ready to hang",
                "Archival quality, 100-year inks",
                "Ships in premium packaging",
                "No new payment info needed — one click",
              ].map(f => (
                <div key={f} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8, fontSize:12, color:C.creamMuted }}>
                  <Check size={11} color={C.gold} style={{ marginTop:2, flexShrink:0 }}/>{f}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="btn-gold pulse-gold" style={{ width:"100%", padding:"18px", fontSize:12, letterSpacing:"0.12em", marginBottom:12 }} onClick={onAccept}>
            Yes! Add Canvas Print for ${CANVAS_UPSELL.salePrice} — One Click
          </button>
          <button style={{ width:"100%", padding:"13px", background:"transparent", border:"none", cursor:"pointer", fontSize:12, color:C.creamMuted, fontFamily:"'Outfit',sans-serif", letterSpacing:"0.08em" }} onClick={onDecline}>
            No thanks — I'll stick with my digital files only
          </button>
          <p style={{ textAlign:"center", fontSize:11, color:C.creamMuted, marginTop:10 }}>
            This offer expires when you leave this page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── MAIN CHECKOUT PAGE ────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();

  const [screen, setScreen] = useState(1);
  const [product, setProduct] = useState(session.selectedPlan === "canvas" ? "canvas"
                                        : session.selectedPlan === "digital" ? "digital"
                                        : "print");
  const [bumps, setBumps] = useState([]);
  const [showOTO, setShowOTO] = useState(false);

  const orderId = useState(() => "DP-" + Math.random().toString(36).slice(2,8).toUpperCase())[0];

  const goDelivery = () => navigate('/delivery');
  const goBack = () => navigate('/');

  const handlePaymentComplete = () => {
    setSession({
      orderId,
      orderProduct: product,
      addedBumps: bumps,
    });
    setShowOTO(true);
  };

  const handleOTOAccept = () => {
    setShowOTO(false);
    goDelivery();
  };

  const handleOTODecline = () => {
    setShowOTO(false);
    goDelivery();
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:C.bg, minHeight:"100vh" }}>
        {/* Top bar */}
        <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(8,7,5,0.97)", backdropFilter:"blur(18px)", borderBottom:`1px solid ${C.border}`, padding:"0 40px" }}>
          <div style={{ maxWidth:1280, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:C.cream }}>
              Digital<span style={{ color:C.gold }}>Photos</span><span style={{ fontSize:9, verticalAlign:"super", color:C.goldDim }}>™</span>
            </div>
            {/* Step indicator */}
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {["Select Product","Complete Checkout"].map((s,i) => (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background: screen > i+1 ? C.gold : screen===i+1 ? "transparent" : "transparent", border:`2px solid ${screen>=i+1 ? C.gold : C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:screen>i+1 ? C.bg : screen===i+1 ? C.gold : C.creamMuted, fontWeight:600 }}>
                    {screen > i+1 ? <Check size={10}/> : i+1}
                  </div>
                  <span style={{ fontSize:11, color: screen===i+1 ? C.cream : C.creamMuted, letterSpacing:"0.05em" }} className="hide-sm">{s}</span>
                  {i===0 && <ChevronRight size={13} color={C.border}/>}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center", fontSize:12, color:C.creamMuted }}>
              <Lock size={12} color={C.goldDim}/><span className="hide-sm">Secure Checkout</span>
            </div>
          </div>
        </div>

        <div style={{ paddingTop:64 }}>
          {screen === 1 && (
            <ProductSelectScreen
              selected={product}
              setSelected={setProduct}
              onNext={() => setScreen(2)}
            />
          )}
          {screen === 2 && (
            <CheckoutScreen
              product={product}
              bumps={bumps}
              setBumps={setBumps}
              onComplete={handlePaymentComplete}
              onBack={() => setScreen(1)}
              sessionId={session.orderId}
            />
          )}
        </div>

        {showOTO && (
          <OTOModal
            product={product}
            onAccept={handleOTOAccept}
            onDecline={handleOTODecline}
          />
        )}
      </div>
    </>
  );
}
