// @ts-nocheck
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { ArrowLeft, Check, ChevronRight, RotateCcw, Pencil, Sparkles, Plus, Copy, Lock, EyeOff, Download, Trash2, ChevronUp, ChevronDown, SlidersHorizontal, X, Send, ZoomIn, ZoomOut } from "lucide-react";
import { TEMPLATES } from "./Index";
import shopPayLogo from "@/assets/payment-logos/shop-pay.svg";
import affirmLogo from "@/assets/payment-logos/affirm-reference-cropped.png";
import klarnaLogo from "@/assets/payment-logos/klarna.svg";
import afterpayLogo from "@/assets/payment-logos/afterpay.png";

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
.cz-chip{padding:9px 16px;border-radius:10px;border:1px solid ${BORDER};background:#fff;cursor:pointer;font-family:'Poppins',sans-serif;font-size:12.5px;font-weight:500;color:${TXT};transition:all .15s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
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
.cz-canvas-scroll{scrollbar-width:none;-ms-overflow-style:none;scroll-padding-top:12px}
.cz-canvas-scroll::-webkit-scrollbar{width:0;height:0;display:none}
.cz-size-card{flex:0 0 auto;scroll-snap-align:start;background:#fff;border:1px solid ${BORDER};border-radius:12px;padding:12px 14px 10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;font-family:'Poppins',sans-serif;transition:all .15s;min-width:88px}
.cz-size-card:hover{border-color:rgba(0,0,0,.25);transform:translateY(-1px)}
.cz-size-card.on{border-color:${RED};box-shadow:0 0 0 1px ${RED}}
@keyframes czFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.cz-fade{animation:czFade .35s cubic-bezier(.23,1,.32,1) both}
.cz-img-wrap{position:relative;display:inline-block;line-height:0;overflow:hidden}
.cz-watermark{position:absolute;inset:0;pointer-events:none;overflow:hidden;mix-blend-mode:overlay;opacity:.32;display:flex;align-items:center;justify-content:center}
.cz-watermark-inner{transform:rotate(-22deg);width:200%;font-family:'Poppins',sans-serif;font-weight:400;letter-spacing:.22em;color:rgba(255,255,255,.7);line-height:2.4;font-size:clamp(13px,1.5vw,18px);text-align:center;white-space:nowrap;animation:czWmScroll 22s linear infinite}
@keyframes czWmScroll{from{transform:rotate(-22deg) translateX(0)}to{transform:rotate(-22deg) translateX(-12%)}}
.cz-img-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;background:rgba(10,10,10,.34);opacity:0;transition:opacity .18s ease;pointer-events:none}
.cz-img-wrap:hover .cz-img-overlay{opacity:1;pointer-events:auto}
.cz-overlay-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;background:rgba(20,20,20,.82);color:#fff;border:1px solid rgba(255,255,255,.18);font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(6px);transition:all .15s ease}
.cz-overlay-btn.alt{background:#fff;color:#0A0A0A;border-color:#fff}
.cz-overlay-btn:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,.25)}
.cz-overlay-btn:disabled{opacity:.6;cursor:not-allowed}
.cz-busy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:rgba(10,10,10,.62);backdrop-filter:blur(4px);color:#fff;z-index:5}
.cz-spinner{width:46px;height:46px;border-radius:50%;border:3px solid rgba(255,255,255,.18);border-top-color:#fff;animation:czSpin .9s linear infinite}
@keyframes czSpin{to{transform:rotate(360deg)}}
.cz-busy-label{font-size:13px;font-weight:600;letter-spacing:.02em;text-align:center;max-width:80%}
.cz-busy-sub{font-size:11.5px;color:rgba(255,255,255,.7);text-align:center}
.cz-modal-back{position:fixed;inset:0;background:rgba(10,10,10,.55);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:czFade .2s ease}
.cz-modal{background:#fff;border-radius:18px;padding:24px;width:100%;max-width:460px;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.cz-modal h3{font-family:'Poppins',sans-serif;font-weight:700;font-size:19px;color:${INK};margin:0 0 6px}
.cz-modal p{font-size:13px;color:${MUTED};margin:0 0 14px;line-height:1.5}
.cz-modal textarea{width:100%;min-height:96px;padding:12px 14px;border:1px solid ${BORDER};border-radius:10px;font-family:'Poppins',sans-serif;font-size:13.5px;color:${INK};resize:vertical;outline:none;transition:border-color .15s}
.cz-modal textarea:focus{border-color:${RED}}
.cz-modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}
.cz-modal-btn{padding:10px 18px;border-radius:10px;font-family:'Poppins',sans-serif;font-size:13.5px;font-weight:600;cursor:pointer;border:none;transition:all .15s}
.cz-modal-btn.ghost{background:transparent;color:${MUTED}}
.cz-modal-btn.ghost:hover{color:${INK}}
.cz-modal-btn.primary{background:${RED};color:#fff}
.cz-modal-btn.primary:hover{background:${RED_DK}}
.cz-modal-btn:disabled{opacity:.5;cursor:not-allowed}
.cz-suggest{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.cz-suggest button{font-size:12.5px;padding:10px 12px;border-radius:8px;border:1px solid ${BORDER};background:#fafafa;cursor:pointer;color:${INK};font-family:'Poppins',sans-serif;text-align:left;width:100%}
.cz-suggest button:hover{border-color:${INK}}
.cz-toolbar{display:flex;flex-direction:column;gap:4px;background:#fff;border:1px solid ${BORDER};border-radius:14px;padding:6px;box-shadow:0 12px 30px -10px rgba(0,0,0,.12)}
.cz-tool{width:38px;height:38px;border-radius:10px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5A5550;transition:all .15s ease;position:relative}
.cz-tool:hover{background:#F4F1EC;color:${INK}}
.cz-tool.on{background:rgba(230,25,25,.10);color:${RED}}
.cz-tool:disabled{opacity:.45;cursor:not-allowed}
.cz-tool-divider{height:1px;background:${BORDER};margin:4px 6px}
.cz-tool[data-tip]::after{content:attr(data-tip);position:absolute;right:calc(100% + 10px);top:50%;transform:translateY(-50%) translateX(4px);background:#fff;color:${INK};font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;padding:6px 10px;border-radius:8px;border:1px solid ${BORDER};box-shadow:0 6px 18px -6px rgba(0,0,0,.18);white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s ease,transform .15s ease;z-index:50}
.cz-tool[data-tip]::before{content:"";position:absolute;right:calc(100% + 4px);top:50%;transform:translateY(-50%) translateX(4px) rotate(45deg);width:8px;height:8px;background:#fff;border-right:1px solid ${BORDER};border-top:1px solid ${BORDER};pointer-events:none;opacity:0;transition:opacity .15s ease,transform .15s ease;z-index:50}
.cz-tool[data-tip]:hover::after{opacity:1;transform:translateY(-50%) translateX(0)}
.cz-tool[data-tip]:hover::before{opacity:1;transform:translateY(-50%) translateX(0) rotate(45deg)}
.cz-ai-panel{width:320px;background:#fff;border:1px solid ${BORDER};border-radius:18px;box-shadow:0 18px 50px -12px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;animation:czAiSlide .28s cubic-bezier(.22,1,.32,1) both;align-self:stretch;max-height:560px}
@keyframes czAiSlide{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
.cz-ai-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid ${BORDER}}
.cz-ai-title{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;color:${INK}}
.cz-ai-icon{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,${RED},#FF6B5B);display:flex;align-items:center;justify-content:center;color:#fff}
.cz-ai-close{background:transparent;border:none;cursor:pointer;color:${MUTED};padding:4px;border-radius:6px}
.cz-ai-close:hover{background:#F4F1EC;color:${INK}}
.cz-ai-body{padding:14px 16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:10px}
.cz-ai-intro{font-size:12.5px;color:${MUTED};line-height:1.5}
.cz-ai-quick{display:flex;flex-direction:column;gap:6px}
.cz-ai-quick button{text-align:left;padding:10px 12px;border-radius:10px;border:1px solid ${BORDER};background:#FAFAF7;font-family:'Poppins',sans-serif;font-size:12.5px;color:${INK};cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:8px}
.cz-ai-quick button:hover{border-color:${INK};background:#fff}
.cz-ai-input{display:flex;gap:6px;padding:10px;border-top:1px solid ${BORDER};background:#FAFAF7}
.cz-ai-input input{flex:1;border:1px solid ${BORDER};border-radius:10px;padding:9px 12px;font-family:'Poppins',sans-serif;font-size:12.5px;outline:none;background:#fff}
.cz-ai-input input:focus{border-color:${RED}}
.cz-ai-send{background:${RED};color:#fff;border:none;border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.cz-ai-send:disabled{opacity:.4;cursor:not-allowed}
@media (max-width: 1100px){
  .cz-ai-panel{width:100%;max-width:420px}
  .cz-stage-row{flex-direction:column !important}
  .cz-toolbar{flex-direction:row !important}
  .cz-tool-divider{height:auto;width:1px;margin:6px 4px}
}
@media (max-width: 1100px){
  .cz-grid{grid-template-columns:1fr !important}
  .cz-stage{min-height:46vh !important;padding:28px 16px !important}
  .cz-side{padding:0 16px 24px !important;position:static !important;max-height:none !important}
}
`;

/* ── Options ── */
const FRAMES = [
  { id: "digital",     label: "Digital",     add: -8, wood: null, digital: true },
  { id: "frameless",   label: "Frameless",   add: 0,  wood: null },
  { id: "black",       label: "Black",       add: 0,  wood: "#1a1a1a", w: 14 },
  { id: "white",       label: "White",       add: 0,  wood: "#f4f4f4", w: 14 },
  { id: "oak",         label: "Oak",         add: 2,  wood: "#c89968", w: 14 },
  { id: "walnut",      label: "Walnut",      add: 2,  wood: "#5a3a24", w: 14 },
  { id: "wide-black",  label: "Wide Black",  add: 4,  wood: "#1a1a1a", w: 28 },
  { id: "wide-white",  label: "Wide White",  add: 4,  wood: "#f4f4f4", w: 28 },
  { id: "canvas",      label: "Canvas",      add: 15, wood: null },
];

const SIZES = [
  { id: '8" x 8"',   label: '8 × 8',   sub: "Square",    price: 17,  w: 1,     h: 1     },
  { id: '8" x 11"',  label: '8 × 11',  sub: "Petite",    price: 29,  w: 0.73,  h: 1     },
  { id: '11" x 8"',  label: '11 × 8',  sub: "Petite",    price: 29,  w: 1,     h: 0.73  },
  { id: '12" x 12"', label: '12 × 12', sub: "Square",    price: 47,  w: 1,     h: 1     },
  { id: '12" x 16"', label: '12 × 16', sub: "Classic",   price: 47,  w: 0.75,  h: 1     },
  { id: '16" x 12"', label: '16 × 12', sub: "Classic",   price: 47,  w: 1,     h: 0.75  },
  { id: '20" x 20"', label: '20 × 20', sub: "Statement", price: 101, w: 1,     h: 1     },
  { id: '20" x 27"', label: '20 × 27', sub: "Statement", price: 101, w: 0.74,  h: 1     },
  { id: '27" x 20"', label: '27 × 20', sub: "Statement", price: 101, w: 1,     h: 0.74  },
  { id: '27" x 36"', label: '27 × 36', sub: "Grand",     price: 201, w: 0.75,  h: 1     },
  { id: '36" x 27"', label: '36 × 27', sub: "Grand",     price: 201, w: 1,     h: 0.75  },
  { id: '22" x 44"', label: '22 × 44', sub: "Panorama",  price: 201, w: 0.5,   h: 1     },
  { id: '44" x 22"', label: '44 × 22', sub: "Panorama",  price: 201, w: 1,     h: 0.5   },
];


const EFFECTS = [
  { id: "original", label: "Original", filter: "none" },
  { id: "vivid",    label: "Vivid",    filter: "saturate(1.4) contrast(1.1)" },
  { id: "warm",     label: "Warm",     filter: "saturate(1.2) hue-rotate(-8deg) brightness(1.05)" },
  { id: "cool",     label: "Cool",     filter: "hue-rotate(8deg) saturate(1.1)" },
  { id: "sepia",    label: "Sepia",    filter: "sepia(0.7) contrast(1.02)" },
  { id: "faded",    label: "Faded",    filter: "contrast(.9) saturate(.85) brightness(1.05)" },
  { id: "silver",   label: "Silver",   filter: "grayscale(0.6) contrast(1.05)" },
  { id: "noir",     label: "Noir",     filter: "grayscale(1) contrast(1.15)" },
  { id: "dramatic", label: "Dramatic", filter: "contrast(1.25) saturate(1.15) brightness(.95)" },
];

const BORDERS = [
  { id: "none",    label: "None",    px: 0 },
  { id: "shallow", label: "Slim",    px: 24 },
  { id: "medium",  label: "Medium",  px: 48 },
  { id: "deep",    label: "Deep",    px: 72 },
];

const BORDER_COLORS = [
  { id: "soft-white",   label: "Soft White",   bg: "#F5F2ED" },
  { id: "dusty-pink",   label: "Dusty Pink",   bg: "#E8D4C8" },
  { id: "charcoal",     label: "Charcoal Gray",bg: "#2E2E30" },
  { id: "sage",         label: "Sage",         bg: "#B5BBA3" },
  { id: "linen",        label: "Linen",        bg: "#EFE6D2" },
  { id: "blush",        label: "Blush",        bg: "#F5DCDC" },
  { id: "sand",         label: "Sand",         bg: "#DCD8B8" },
  { id: "stone",        label: "Stone",        bg: "#7A7A7A" },
  { id: "walnut",       label: "Walnut",       bg: "#9E8669" },
  { id: "rust",         label: "Rust",         bg: "#9C5757" },
  { id: "navy",         label: "Navy",         bg: "#3F5F8A" },
  { id: "forest",       label: "Forest",       bg: "#3F6B5C" },
  { id: "white",        label: "White",        bg: "#FFFFFF" },
  { id: "shiplap",      label: "Shiplap",      bg: "repeating-linear-gradient(90deg,#EFEAE2 0 14px,#E4DED4 14px 15px)" },
  { id: "pampas",       label: "Pampas Grass", bg: "repeating-linear-gradient(90deg,#E8E4D8 0 6px,#DDD7C7 6px 7px)" },
];

/* ── Frame swatch (photorealistic mini) ── */
function FrameSwatch({ frame, on }) {
  const SIZE = 56;
  const ringColor = on ? RED : "transparent";
  const ringW = on ? 2 : 0;

  // Inner "photo" — soft blue gradient like Mixtiles reference
  const photo = (size) => (
    <div style={{
      width: size, height: size * 0.78,
      background: "linear-gradient(160deg,#9fb3c8 0%,#7993b0 60%,#6b87a4 100%)",
      borderRadius: 1.5,
      boxShadow: "inset 0 1px 2px rgba(255,255,255,.25), inset 0 -2px 4px rgba(0,0,0,.18)",
    }}/>
  );

  const wrap = (children, bg = "#fff") => (
    <div style={{
      width: SIZE, height: SIZE, borderRadius: 12, padding: 3,
      background: ringColor, transition: "background .15s",
    }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: 10,
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: on ? "none" : "inset 0 0 0 1px rgba(0,0,0,.06)",
      }}>
        {children}
      </div>
    </div>
  );

  // Digital — file/download look
  if (frame.id === "digital") {
    return wrap(
      <div style={{
        width: 32, height: 26, borderRadius: 3,
        background: "linear-gradient(160deg,#1a1a1a,#3a3a3a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,.18)",
        position: "relative",
      }}>
        <div style={{
          width: 22, height: 17, borderRadius: 1,
          background: "linear-gradient(160deg,#9fb3c8,#6b87a4)",
        }}/>
        <div style={{
          position:"absolute", bottom:-3, left:"50%", transform:"translateX(-50%)",
          width:14, height:2, borderRadius:1, background:"#1a1a1a",
        }}/>
      </div>
    );
  }

  // Frameless — floating photo on white
  if (frame.id === "frameless") {
    return wrap(
      <div style={{
        width: 30, height: 24, borderRadius: 1.5,
        background: "linear-gradient(160deg,#9fb3c8,#6b87a4)",
        boxShadow: "0 2px 6px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.04)",
      }}/>
    );
  }

  // Canvas — gallery wrap, white edge bevel
  if (frame.id === "canvas") {
    return wrap(
      <div style={{
        width: 30, height: 24, padding: 2,
        background: "#fafafa",
        boxShadow: "0 2px 5px rgba(0,0,0,.18), inset 0 0 0 1px #ece7d8",
        borderRadius: 1,
      }}>
        <div style={{ width: "100%", height: "100%",
          background: "linear-gradient(160deg,#9fb3c8,#6b87a4)" }}/>
      </div>
    );
  }

  // Wood / painted frames — render moulding with bevel + inner shadow
  const wood = frame.wood;
  const isWide = frame.id.startsWith("wide-");
  const isLight = frame.id === "white" || frame.id === "wide-white";
  const moulding = isLight
    ? `linear-gradient(135deg, #ffffff 0%, ${wood} 45%, #e6e6e6 100%)`
    : frame.id === "oak"
      ? `linear-gradient(135deg, #e3b988 0%, #c89968 50%, #9d7444 100%)`
      : frame.id === "walnut"
        ? `linear-gradient(135deg, #7d5638 0%, #5a3a24 55%, #3a2414 100%)`
        : `linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #050505 100%)`;
  const pad = isWide ? 8 : 5;
  const innerSize = SIZE - 6 - pad * 2; // inside ringWrap padding

  return wrap(
    <div style={{
      width: "100%", height: "100%", borderRadius: 6,
      background: moulding,
      padding: pad,
      boxShadow: `inset 0 0 0 1px rgba(255,255,255,${isLight ? .6 : .12}),
                  inset 0 -1px 2px rgba(0,0,0,.25),
                  0 1px 2px rgba(0,0,0,.12)`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: innerSize, height: innerSize * 0.78,
        background: "linear-gradient(160deg,#9fb3c8 0%,#7993b0 60%,#6b87a4 100%)",
        borderRadius: 1,
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,.25), 0 1px 2px rgba(0,0,0,.2)",
      }}/>
    </div>,
    "#fff"
  );
}

/* ── Page ── */
export default function Customize() {
  const navigate = useNavigate();
  const { session, setSession } = useSession();

  const params = new URLSearchParams(window.location.search);
  const styleId = params.get("style") || session.generatedPortraits?.[0]?.style || "";
  const PLACEHOLDER = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80";
  const initialPortraitUrl =
    session.generatedPortraits?.find(p => p.style === styleId)?.url
    || session.generatedPortraits?.[0]?.url
    || session.photo
    || PLACEHOLDER;

  // Multi-image cart: each item is an independent print with its own config
  const makeItem = (overrides = {}) => ({
    id: crypto.randomUUID(),
    photoUrl: initialPortraitUrl,
    style: styleId,
    frame: "black",
    size: '11" x 14"',
    effect: "original",
    border: "shallow",
    borderColor: "soft-white",
    qty: 1,
    ...overrides,
  });


  const [items, setItems] = useState(() => {
    const saved = (session as any).customizationItems;
    if (saved?.length) return saved;
    return [makeItem({
      frame: session.customization?.frame || "black",
      size: session.customization?.size || '11" x 14"',
      effect: session.customization?.effect || "original",
      border: session.customization?.border || "shallow",
      borderColor: session.customization?.borderColor || "soft-white",
    })];
  });
  const [selectedId, setSelectedId] = useState(() => items[0].id);
  const selected = items.find(i => i.id === selectedId) || items[0];
  const updateSelected = (patch) => {
    setItems(prev => prev.map(i => i.id === selectedId ? { ...i, ...patch } : i));
  };
  const removeItem = (id) => {
    setItems(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter(i => i.id !== id);
      if (id === selectedId) setSelectedId(next[0].id);
      return next;
    });
  };
  const setItemQty = (id, qty) => {
    const q = Math.max(1, Math.min(99, qty|0));
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: q } : i));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; baseX: number; baseY: number } | null>(null);

  const onDragStart = (item, e) => {
    const z = item.zoom || 1;
    if (z <= 1) return;
    e.preventDefault();
    const wrap = e.currentTarget as HTMLElement;
    const rect = wrap.getBoundingClientRect();
    const maxX = (rect.width  * (z - 1)) / 2;
    const maxY = (rect.height * (z - 1)) / 2;
    dragRef.current = {
      id: item.id, startX: e.clientX, startY: e.clientY,
      baseX: item.offsetX || 0, baseY: item.offsetY || 0,
    };
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current; if (!d) return;
      const nx = clamp(d.baseX + (ev.clientX - d.startX), maxX);
      const ny = clamp(d.baseY + (ev.clientY - d.startY), maxY);
      setItems(prev => prev.map(i => i.id === d.id ? { ...i, offsetX: nx, offsetY: ny } : i));
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Regeneration state
  const [busy, setBusy]               = useState(false);
  const [busyLabel, setBusyLabel]     = useState("");
  const [busyElapsed, setBusyElapsed] = useState(0);
  const [editOpen, setEditOpen]       = useState(false);
  const [editPrompt, setEditPrompt]   = useState("");
  const [errorMsg, setErrorMsg]       = useState("");
  const [aiOpen, setAiOpen]           = useState(false);
  const [aiInput, setAiInput]         = useState("");
  const [choices, setChoices]         = useState<string[]>([]);
  const [choiceOpen, setChoiceOpen]   = useState(false);
  const [choicesLoaded, setChoicesLoaded] = useState(0);

  // Promo code, gift note, low-res warnings
  const PROMOS: Record<string, { pct: number; label: string }> = {
    MOMGLOW30: { pct: 0.30, label: "Mother's Day 30% off" },
    WELCOME15: { pct: 0.15, label: "Welcome 15% off" },
    BUNDLE10:  { pct: 0.10, label: "Bundle 10% off" },
  };
  const [promoCode, setPromoCode]     = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; pct: number; label: string } | null>(null);
  const [promoOpen, setPromoOpen]     = useState(false);
  const [promoError, setPromoError]   = useState("");
  const [giftNote, setGiftNote]       = useState("");
  const [giftOpen, setGiftOpen]       = useState(false);

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    const p = PROMOS[code];
    if (!p) { setPromoError("That code isn't valid."); return; }
    setPromoApplied({ code, ...p });
    setPromoError("");
    setPromoOpen(false);
  };
  const clearPromo = () => { setPromoApplied(null); setPromoCode(""); };

  useEffect(() => {
    if (!busy) { setBusyElapsed(0); return; }
    const t = setInterval(() => setBusyElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [busy]);

  useEffect(() => { if (!initialPortraitUrl) navigate("/"); }, [initialPortraitUrl, navigate]);

  // Selected item's resolved defs (drives left panel + AI ops)
  const frame = selected.frame, size = selected.size, effect = selected.effect;
  const border = selected.border, borderColor = selected.borderColor;
  const portraitUrl = selected.photoUrl;
  const setFrame = (v) => updateSelected({ frame: v });
  const setSize = (v) => updateSelected({ size: v });
  const setEffect = (v) => updateSelected({ effect: v });
  const setBorder = (v) => updateSelected({ border: v });
  const setBorderColor = (v) => updateSelected({ borderColor: v });
  const borderColorDef = BORDER_COLORS.find(c => c.id === borderColor) || BORDER_COLORS[0];

  const frameDef  = FRAMES.find(f => f.id === frame)  || FRAMES[1];
  const sizeDef   = SIZES.find(s => s.id === size)    || SIZES[2];
  const effectDef = EFFECTS.find(e => e.id === effect) || EFFECTS[0];
  const borderDef = BORDERS.find(b => b.id === border) || BORDERS[1];

  // Per-item price + bundle discount based on number of images
  const itemUnitPrice = (it) => {
    const sd = SIZES.find(s => s.id === it.size) || SIZES[2];
    const fd = FRAMES.find(f => f.id === it.frame) || FRAMES[1];
    return sd.price + fd.add;
  };
  const itemPrice = (it) => itemUnitPrice(it) * (it.qty || 1);
  const itemListPrice = (it) => Math.round(itemUnitPrice(it) * 1.4) * (it.qty || 1); // MSRP for strikethrough
  const totalPhotoCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);
  const subtotal     = items.reduce((sum, it) => sum + itemPrice(it), 0);
  const listSubtotal = items.reduce((sum, it) => sum + itemListPrice(it), 0);
  const bundlePct    = totalPhotoCount >= 3 ? 0.15 : totalPhotoCount >= 2 ? 0.10 : 0;
  const bundleSave   = Math.round(subtotal * bundlePct);
  const promoPct     = promoApplied?.pct || 0;
  const promoSave    = Math.round((subtotal - bundleSave) * promoPct);
  const total        = Math.max(0, subtotal - bundleSave - promoSave);
  const totalSavings = listSubtotal - total;
  const savingsPct   = listSubtotal > 0 ? Math.round((totalSavings / listSubtotal) * 100) : 0;
  const lowResCount  = items.filter(i => i.lowRes).length;


  /* ── Regenerate / Edit (acts on selected item) ── */
  const runRegenerate = async (extraPrompt) => {
    setErrorMsg("");
    setBusy(true);
    setBusyLabel(extraPrompt ? "Generating 6 Edited Variations…" : "Generating 6 New Variations…");
    setChoices([]);
    setChoicesLoaded(0);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const sourceImageUrl = selected.photoUrl || session.photo;
      const N = 6;
      const tasks = Array.from({ length: N }, (_, i) =>
        supabase.functions.invoke("regenerate-portrait", {
          body: {
            sessionId: (session as any).sessionDbId || null,
            sourceImageUrl,
            style: selected.style || styleId,
            extraPrompt: extraPrompt
              ? `${extraPrompt} (variation ${i + 1})`
              : `Variation ${i + 1} — explore a fresh interpretation`,
          },
        }).then((res) => {
          setChoicesLoaded((c) => c + 1);
          return res;
        })
      );
      const results = await Promise.allSettled(tasks);
      const urls: string[] = [];
      for (const r of results) {
        if (r.status === "fulfilled") {
          const url = (r.value as any)?.data?.url;
          if (url) urls.push(url);
        }
      }
      if (!urls.length) throw new Error("No images returned. Please try again.");
      setChoices(urls);
      setChoiceOpen(true);
    } catch (e) {
      console.error(e);
      setErrorMsg(e?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
      setEditOpen(false);
      setEditPrompt("");
    }
  };

  const pickChoice = (url: string) => {
    updateSelected({ photoUrl: url });
    setChoiceOpen(false);
    setChoices([]);
  };

  const handleRetry = () => runRegenerate("");
  const handleApplyEdit = () => {
    if (!editPrompt.trim()) return;
    runRegenerate(editPrompt.trim());
  };

  /* ── Add a new image: file upload, then generate ── */
  const handleAddImage = () => fileInputRef.current?.click();

  const [tmplPickOpen, setTmplPickOpen] = useState(false);
  const [pendingNewItemId, setPendingNewItemId] = useState<string | null>(null);
  const [pendingDataUrl, setPendingDataUrl] = useState<string | null>(null);

  const handleFilePicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow same-file reselect
    if (!file) return;

    // Read as data URL for preview + generation source
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

    // Detect low resolution
    const lowRes: boolean = await new Promise((resolve) => {
      const im = new window.Image();
      im.onload = () => resolve(im.naturalWidth < 1200 || im.naturalHeight < 1200);
      im.onerror = () => resolve(false);
      im.src = dataUrl;
    });

    // Insert new item with current selected's settings as defaults
    const newItem = makeItem({
      photoUrl: dataUrl, lowRes,
      frame: selected.frame, size: selected.size, effect: selected.effect,
      border: selected.border, borderColor: selected.borderColor,
    });
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);

    // Open template picker before generating
    setPendingNewItemId(newItem.id);
    setPendingDataUrl(dataUrl);
    setTmplPickOpen(true);
  };

  const generateForNewItem = async (templatePrompt: string) => {
    const newItemId = pendingNewItemId;
    const dataUrl = pendingDataUrl;
    setTmplPickOpen(false);
    setPendingNewItemId(null);
    setPendingDataUrl(null);
    if (!newItemId || !dataUrl) return;

    setBusy(true);
    setBusyLabel("Generating Your Portrait…");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("regenerate-portrait", {
        body: {
          sessionId: (session as any).sessionDbId || null,
          sourceImageUrl: dataUrl,
          style: styleId,
          extraPrompt: templatePrompt || "",
        },
      });
      if (error) throw new Error(error.message || "Generation failed");
      if (data?.error) throw new Error(data.error);
      const newUrl = data?.url;
      if (newUrl) {
        setItems(prev => prev.map(i => i.id === newItemId ? { ...i, photoUrl: newUrl } : i));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || "Couldn't generate that image. The original was added.");
    } finally {
      setBusy(false);
    }
  };

  /* ── Preview (per-item, click to select, ✕ to remove) ── */
  const renderItem = (item, isSelected, isToolbarItem) => {
    const fd = FRAMES.find(f => f.id === item.frame) || FRAMES[1];
    const sd = SIZES.find(s => s.id === item.size) || SIZES[2];
    const ed = EFFECTS.find(e => e.id === item.effect) || EFFECTS[0];
    const bd = BORDERS.find(b => b.id === item.border) || BORDERS[1];
    const bcd = BORDER_COLORS.find(c => c.id === item.borderColor) || BORDER_COLORS[0];
    const isFrameless = fd.id === "frameless" || fd.id === "digital";
    const isCanvas    = fd.id === "canvas";
    const woodPad     = fd.w || 0;
    const itemBusy = busy && item.id === selectedId;
    const showRemove = items.length > 1;

    return (
      <div key={item.id}
        onClick={() => setSelectedId(item.id)}
        style={{
          position:"relative", cursor:"pointer", padding:0,
          border:"none", background:"transparent",
          display:"flex", flexDirection:"column", alignItems:"center", gap:10,
          scrollSnapAlign:"start",
        }}>
        {/* Image + inline toolbar — symmetric spacer keeps image visually centered */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          {/* Invisible spacer matching toolbar width to keep image centered */}
          <div aria-hidden="true" style={{ width:48, flexShrink:0, visibility:"hidden" }}/>
          <div style={{
            background: isCanvas ? "#fff" : (isFrameless ? "transparent" : fd.wood),
            padding: (isFrameless ? 6 : woodPad + 6),
            borderRadius: isFrameless ? 12 : 6,
            boxShadow: "none",
            display: "inline-block",
            maxWidth: "100%",
            border: isSelected ? `2px solid ${RED}` : "2px solid transparent",
            transition: "border-color .2s ease",
          }}>
            <div style={{
              background: bcd.bg,
              padding: bd.px,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "none",
            }}>
              <div
                className="cz-img-wrap"
                onMouseDown={(e) => onDragStart(item, e)}
                style={{ cursor: (item.zoom || 1) > 1 ? (dragRef.current?.id === item.id ? "grabbing" : "grab") : "default" }}
              >
                <img src={item.photoUrl} alt="Your portrait"
                  draggable={false}
                  style={{
                    display:"block",
                    height: `${sd.h * 42}vh`,
                    width:  `${sd.w * 42}vh`,
                    maxWidth: "100%",
                    objectFit: "cover",
                    filter: ed.filter,
                    transform: `translate(${item.offsetX || 0}px, ${item.offsetY || 0}px) scale(${item.zoom || 1})`,
                    transformOrigin: "center center",
                    transition: dragRef.current?.id === item.id
                      ? "width .25s ease, height .25s ease"
                      : "width .25s ease, height .25s ease, transform .25s ease",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}/>
                <div className="cz-watermark" aria-hidden="true">
                  <div className="cz-watermark-inner">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i}>DIGITALPHOTOS · DIGITALPHOTOS · DIGITALPHOTOS · DIGITALPHOTOS</div>
                    ))}
                  </div>
                </div>
                {itemBusy && (
                  <div className="cz-busy">
                    <div className="cz-spinner" />
                    <div className="cz-busy-label">{busyLabel}</div>
                    <div className="cz-busy-sub">
                      {busyLabel.includes("Variation") || busyLabel.includes("Edited")
                        ? `${choicesLoaded} of 6 ready · ${busyElapsed}s elapsed`
                        : `This Usually Takes 20–60 Seconds · ${busyElapsed}s Elapsed`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isSelected ? (
            <div className="cz-toolbar" role="toolbar" aria-label="Image tools"
              onClick={(e) => e.stopPropagation()}
              style={{ flexShrink:0 }}>
              <button className={`cz-tool ${aiOpen?"on":""}`} onClick={() => setAiOpen(v => !v)} data-tip="AI Assistant" aria-label="AI Assistant" style={{ color: RED }}>
                <Sparkles size={18}/>
              </button>
              <div className="cz-tool-divider"/>
              <button className="cz-tool" onClick={handleRetry} disabled={busy} data-tip="Regenerate" aria-label="Regenerate">
                <RotateCcw size={17}/>
              </button>
              <div className="cz-tool-divider"/>
              <button
                className="cz-tool"
                onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, zoom: Math.min(2.5, +(((i.zoom || 1) + 0.15)).toFixed(2)) } : i))}
                disabled={(item.zoom || 1) >= 2.5}
                data-tip="Zoom In" aria-label="Zoom in">
                <ZoomIn size={17}/>
              </button>
              <button
                className="cz-tool"
                onClick={() => setItems(prev => prev.map(i => {
                  if (i.id !== item.id) return i;
                  const z = Math.max(1, +(((i.zoom || 1) - 0.15)).toFixed(2));
                  return z <= 1 ? { ...i, zoom: 1, offsetX: 0, offsetY: 0 } : { ...i, zoom: z };
                }))}
                disabled={(item.zoom || 1) <= 1}
                data-tip="Zoom Out" aria-label="Zoom out">
                <ZoomOut size={17}/>
              </button>
              <div className="cz-tool-divider"/>
              <button className="cz-tool" onClick={handleAddImage} disabled={busy} data-tip="Add Another Image" aria-label="Add another image">
                <Plus size={18}/>
              </button>
              {showRemove && (
                <>
                  <div className="cz-tool-divider"/>
                  <button className="cz-tool" onClick={() => removeItem(item.id)} data-tip="Delete Image" aria-label="Delete image">
                    <Trash2 size={17}/>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div aria-hidden="true" style={{ width:48, flexShrink:0, visibility:"hidden" }}/>
          )}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", color:MUTED, fontSize:12.5 }}>
          <span>{sd.label}″</span>
          <span style={{ width:3, height:3, borderRadius:"50%", background:MUTED }}/>
          <span>{fd.label}</span>
          <span style={{ width:3, height:3, borderRadius:"50%", background:MUTED }}/>
          <span>{ed.label}</span>
        </div>
      </div>
    );
  };

  const handleContinue = () => {
    setSession({
      customization: { portraitUrl, style: styleId, frame, size, effect, border, borderColor },
      customizationItems: items,
      selectedPlan: frameDef.id === "canvas" ? "canvas" : "bundle",
      printSize: size,
    } as any);
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
          padding:"7px 14px", borderRadius:12, background:"#fff", border:`1px solid ${BORDER}`,
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
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(64px, 1fr))", gap:10, marginBottom:10 }}>
              {FRAMES.map(f => (
                <button key={f.id} onClick={() => setFrame(f.id)} title={f.label}
                  style={{
                    border:"none", background:"transparent", padding:0, cursor:"pointer",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  }}>
                  <FrameSwatch frame={f} on={frame===f.id}/>
                  <span style={{
                    fontSize:10.5, color: frame===f.id ? INK : MUTED, fontWeight: frame===f.id ? 600 : 500,
                    whiteSpace:"nowrap", textAlign:"center", lineHeight:1.1,
                  }}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Effect */}
          <div className="cz-section">
            <div className="cz-label"><span>Effect</span><span className="cz-value">{effectDef.label}</span></div>
            <div className="cz-size-scroll">
              {EFFECTS.map(e => {
                const on = effect === e.id;
                return (
                  <button key={e.id} onClick={() => setEffect(e.id)} title={e.label}
                    style={{
                      flex:"0 0 76px",
                      display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                      padding:6, borderRadius:10,
                      border:`1.5px solid ${on ? INK : BORDER}`,
                      background: on ? "#fff" : "transparent",
                      cursor:"pointer", transition:"all .15s ease",
                      scrollSnapAlign:"start",
                    }}>
                    <div style={{
                      width:"100%", aspectRatio:"1", borderRadius:6, overflow:"hidden",
                      background:"#eee",
                    }}>
                      <img src={portraitUrl} alt="" style={{
                        width:"100%", height:"100%", objectFit:"cover",
                        filter: e.filter,
                      }}/>
                    </div>
                    <span style={{
                      fontSize:10.5, fontWeight: on ? 600 : 500,
                      color: on ? INK : MUTED, whiteSpace:"nowrap",
                    }}>{e.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mat / Border */}
          <div className="cz-section">
            <div className="cz-label"><span>Mat</span><span className="cz-value">{borderDef.label}</span></div>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${BORDERS.length}, 1fr)`, gap:8, marginBottom:14 }}>
              {BORDERS.map(b => (
                <button key={b.id} className={`cz-chip ${border===b.id?"on":""}`}
                  style={{ justifyContent:"center", padding:"9px 6px" }}
                  onClick={() => setBorder(b.id)}>
                  {b.label}
                </button>
              ))}
            </div>
            <div className="cz-label" style={{ marginBottom:8 }}><span>Mat color</span><span className="cz-value">{borderColorDef.label}</span></div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:10 }}>
              {BORDER_COLORS.map(c => (
                <button key={c.id} aria-label={`Mat color ${c.label}`} title={c.label} onClick={() => setBorderColor(c.id)}
                  className={`cz-swatch ${borderColor===c.id?"on":""}`}
                  style={{ background:c.bg, border: "1px solid rgba(0,0,0,.12)", width:"100%", aspectRatio:"1 / 1", height:"auto" }}/>
              ))}
            </div>
          </div>
        </aside>

        {/* Preview (middle) */}
        <div className="cz-stage cz-fade" style={{
          padding:"0 24px 24px",
          minHeight:"calc(100vh - 70px)",
          maxHeight:"calc(100vh - 70px)",
          display:"flex", flexDirection:"column", alignItems:"center",
          gap:16,
          background:`radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, ${BG} 70%)`,
          overflow:"hidden",
        }}>
          <div style={{
            textAlign:"center", flexShrink:0, padding:"32px 0 8px",
            position:"sticky", top:0, zIndex:5, width:"100%",
          }}>
            <div style={{ fontSize:11, letterSpacing:".24em", color:MUTED, fontWeight:600 }}>YOUR PORTRAIT · LIVE PREVIEW</div>
            <h1 className="cz-serif" style={{ fontSize:28, margin:"6px 0 0", color:INK, fontWeight:600 }}>
              Make It Yours.
            </h1>
          </div>
          <div className="cz-stage-row" style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:16, width:"100%", maxWidth:"100%", flex:"1 1 auto", minHeight:0,
            transition:"all .3s cubic-bezier(.22,1,.32,1)",
          }}>
            <div className="cz-canvas-scroll" style={{
              flex:"0 1 auto", minWidth:0, maxHeight:"100%", height:"100%",
              overflowY:"auto", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"flex-start", gap:8, padding:"4px 6px",
              scrollBehavior:"smooth", scrollSnapType:"y proximity",
              WebkitOverflowScrolling:"touch", overscrollBehavior:"contain",
            }}>
              {items.map(it => renderItem(it, it.id === selectedId, it.id === selectedId))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display:"none" }}
              onChange={handleFilePicked}
            />
            {aiOpen && (
              <div className="cz-ai-panel">
                <div className="cz-ai-head">
                  <div className="cz-ai-title">
                    <span className="cz-ai-icon"><Sparkles size={14}/></span>
                    AI Assistant
                  </div>
                  <button className="cz-ai-close" onClick={() => setAiOpen(false)} aria-label="Close">
                    <X size={16}/>
                  </button>
                </div>
                <div className="cz-ai-body">
                  <div className="cz-ai-intro">
                    Describe what you'd like to change. The AI will regenerate the portrait with your tweaks.
                  </div>
                  <div className="cz-suggest" style={{ marginTop:0 }}>
                    {[
                      "Make the background darker",
                      "More dramatic lighting",
                      "Brighter and more vibrant",
                      "Add a subtle smile",
                      "Soften the colors",
                    ].map(s => (
                      <button key={s} type="button" disabled={busy} onClick={() => setAiInput(s)}>{s}</button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => runRegenerate("")}
                    style={{
                      width:"100%", padding:"10px 12px", borderRadius:8,
                      border:`1px solid ${BORDER}`, background:"#fafafa", cursor:"pointer",
                      color:INK, fontFamily:"'Poppins',sans-serif", fontSize:12.5,
                      fontWeight:500, display:"inline-flex", alignItems:"center", gap:8,
                      textAlign:"left",
                    }}
                  >
                    <Sparkles size={13} color={RED}/> New Variation
                  </button>
                </div>
                <div style={{
                  position:"relative", padding:10, borderTop:`1px solid ${BORDER}`, background:"#FAFAF7",
                }}>
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Describe what you'd like to change…"
                    disabled={busy}
                    style={{
                      width:"100%", minHeight:64, padding:"10px 44px 10px 12px",
                      border:`1px solid ${BORDER}`, borderRadius:10,
                      fontFamily:"'Poppins',sans-serif", fontSize:12.5, color:INK,
                      resize:"none", outline:"none", background:"#fff", display:"block",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = RED}
                    onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && aiInput.trim() && !busy) {
                        e.preventDefault();
                        const p = aiInput.trim();
                        setAiInput("");
                        runRegenerate(p);
                      }
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Generate"
                    disabled={busy || !aiInput.trim()}
                    onClick={() => {
                      const p = aiInput.trim();
                      setAiInput("");
                      runRegenerate(p);
                    }}
                    style={{
                      position:"absolute", right:18, bottom:18,
                      width:32, height:32, borderRadius:8,
                      background:RED, color:"#fff", border:"none", cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      opacity: (busy || !aiInput.trim()) ? .5 : 1,
                    }}
                  >
                    <Send size={14}/>
                  </button>
                </div>
              </div>
            )}
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

            {/* Itemized cart — one row per image */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {items.map((it, idx) => {
                const sd = SIZES.find(s => s.id === it.size) || SIZES[2];
                const fd = FRAMES.find(f => f.id === it.frame) || FRAMES[1];
                const ed = EFFECTS.find(e => e.id === it.effect) || EFFECTS[0];
                const bd = BORDERS.find(b => b.id === it.border) || BORDERS[1];
                const bcd = BORDER_COLORS.find(c => c.id === it.borderColor) || BORDER_COLORS[0];
                const isFrameless = fd.id === "frameless" || fd.id === "digital";
                const isCanvas    = fd.id === "canvas";
                const woodPad     = (fd.w || 0) * 0.3;
                const thumb       = 56;
                const imgW = sd.w >= sd.h ? thumb : thumb * (sd.w / sd.h);
                const imgH = sd.h >= sd.w ? thumb : thumb * (sd.h / sd.w);
                const unitPrice = itemUnitPrice(it);
                const qty = it.qty || 1;
                const price = unitPrice * qty;
                const listPrice = Math.round(unitPrice * 1.4) * qty;
                const isSel = it.id === selectedId;
                return (
                  <div key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    style={{
                      display:"flex", gap:10, padding:10, borderRadius:10,
                      border: isSel ? `1.5px solid ${RED}` : `1px solid ${BORDER}`,
                      background: isSel ? "rgba(230,25,25,.04)" : "#fff",
                      cursor:"pointer", position:"relative",
                    }}>
                    <div style={{
                      width:80, minWidth:80, display:"flex", alignItems:"center", justifyContent:"center",
                      background:BG, borderRadius:6, padding:6,
                    }}>
                      <div style={{
                        background: isCanvas ? "#fff" : (isFrameless ? "transparent" : fd.wood),
                        padding: isFrameless ? 0 : woodPad, display:"inline-block",
                      }}>
                        <div style={{ background: bcd.bg, padding: bd.px * 0.25, display:"flex" }}>
                          <img src={it.photoUrl} alt="" style={{
                            width: imgW, height: imgH, objectFit:"cover", display:"block",
                            filter: ed.filter,
                          }}/>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", justifyContent:"center", gap:3 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, color:INK }}>
                        Portrait #{idx + 1}
                      </div>
                      {it.lowRes && (
                        <span title="Low resolution photo" style={{
                          alignSelf:"flex-start",
                          fontSize:9.5, fontWeight:700, letterSpacing:".06em",
                          color:"#B45309", background:"#FEF3C7", padding:"2px 5px", borderRadius:4,
                        }}>LOW-RES</span>
                      )}
                      <div style={{ fontSize:11, color:MUTED, lineHeight:1.4 }}>
                        {sd.label}″
                      </div>
                      <div style={{ fontSize:11, color:MUTED, lineHeight:1.4 }}>
                        {fd.label} · {ed.label}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, marginTop:4 }}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                          <span style={{ fontSize:11, color:MUTED, textDecoration:"line-through" }}>
                            ${listPrice}
                          </span>
                          <span style={{ fontSize:13, fontWeight:700, color:RED }}>
                            ${price}
                          </span>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} style={{
                          display:"inline-flex", alignItems:"center",
                          border:`1px solid ${BORDER}`, borderRadius:8, background:"#fff",
                        }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setItemQty(it.id, qty - 1); }}
                            disabled={qty <= 1}
                            aria-label="Decrease quantity"
                            style={{
                              width:24, height:24, border:"none", background:"transparent",
                              cursor: qty <= 1 ? "not-allowed" : "pointer",
                              opacity: qty <= 1 ? .35 : 1, color:INK, fontSize:14, fontWeight:600,
                              display:"flex", alignItems:"center", justifyContent:"center",
                            }}>−</button>
                          <span style={{ minWidth:20, textAlign:"center", fontSize:12, fontWeight:600, color:INK }}>
                            {qty}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setItemQty(it.id, qty + 1); }}
                            aria-label="Increase quantity"
                            style={{
                              width:24, height:24, border:"none", background:"transparent",
                              cursor:"pointer", color:INK, fontSize:14, fontWeight:600,
                              display:"flex", alignItems:"center", justifyContent:"center",
                            }}>+</button>
                        </div>
                      </div>

                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(it.id); }}
                        aria-label="Remove"
                        style={{
                          position:"absolute", top:6, right:6,
                          width:22, height:22, borderRadius:"50%",
                          background:"transparent", border:"none", color:MUTED,
                          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                        }}>
                        <X size={14}/>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add another image button */}
            <button
              onClick={handleAddImage}
              disabled={busy}
              style={{
                marginTop:12, width:"100%", padding:"10px",
                border:`1.5px dashed ${BORDER}`, borderRadius:10,
                background:"transparent", cursor:"pointer",
                fontFamily:"'Poppins',sans-serif", fontSize:12.5, fontWeight:600, color:INK,
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                opacity: busy ? .5 : 1,
              }}>
              <Plus size={14}/> Add Another Photo
            </button>

            {/* Bundle hint */}
            <div style={{
              fontSize:11.5, color: bundlePct > 0 ? "#16a34a" : MUTED,
              padding:"8px 10px", background: bundlePct > 0 ? "#F0FDF4" : "#FAFAF7",
              borderRadius:8, marginTop:10, fontWeight: bundlePct > 0 ? 600 : 500, textAlign:"center",
            }}>
              {bundlePct > 0
                ? `🎉 ${Math.round(bundlePct*100)}% Bundle Discount Applied!`
                : "Add 2 Photos — Save 10% · Add 3+ — Save 15%"}
            </div>

            {/* Low-resolution warning */}
            {lowResCount > 0 && (
              <div style={{
                marginTop:10, padding:"10px 12px", borderRadius:10,
                background:"#FFFBEB", border:"1px solid #FDE68A",
                display:"flex", alignItems:"flex-start", gap:8,
              }}>
                <span style={{
                  flexShrink:0, width:18, height:18, borderRadius:"50%",
                  background:"#1A1614", color:"#fff", display:"flex",
                  alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                }}>!</span>
                <div style={{ fontSize:11.5, color:INK, lineHeight:1.45 }}>
                  {lowResCount === 1 ? "One Of Your Photos Is Low Resolution" : `${lowResCount} Photos Are Low Resolution`}, Consider Replacing{" "}
                  <button
                    onClick={() => {
                      const first = items.find(i => i.lowRes);
                      if (first) { setSelectedId(first.id); handleAddImage(); }
                    }}
                    style={{ background:"none", border:"none", padding:0, color:INK, fontWeight:600, textDecoration:"underline", cursor:"pointer", fontFamily:"inherit", fontSize:11.5 }}
                  >Review & Replace.</button>
                </div>
              </div>
            )}

            {/* Promo code */}
            <div style={{ marginTop:10 }}>
              {promoApplied ? (
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 12px", borderRadius:10, background:"#F0FDF4", border:"1px solid #BBF7D0",
                }}>
                  <div style={{ fontSize:12, color:"#15803D", fontWeight:600 }}>
                    Promo: {promoApplied.code}
                  </div>
                  <button onClick={clearPromo} style={{
                    background:"none", border:"none", color:MUTED, cursor:"pointer",
                    fontSize:11.5, textDecoration:"underline", fontFamily:"inherit",
                  }}>Remove</button>
                </div>
              ) : promoOpen ? (
                <div>
                  <div style={{ display:"flex", gap:6 }}>
                    <input
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                      onKeyDown={e => e.key === "Enter" && applyPromo()}
                      placeholder="Enter code"
                      style={{
                        flex:1, padding:"9px 11px", borderRadius:8,
                        border:`1px solid ${promoError ? "#DC2626" : BORDER}`,
                        fontFamily:"inherit", fontSize:12.5, outline:"none", background:"#fff",
                      }}
                    />
                    <button onClick={applyPromo} style={{
                      padding:"9px 14px", borderRadius:8, border:"none",
                      background:INK, color:"#fff", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit",
                    }}>Apply</button>
                  </div>
                  {promoError && <div style={{ fontSize:11, color:"#DC2626", marginTop:4 }}>{promoError}</div>}
                </div>
              ) : (
                <button onClick={() => setPromoOpen(true)} style={{
                  background:"none", border:"none", padding:0, color:INK, fontWeight:600,
                  fontSize:12, cursor:"pointer", fontFamily:"inherit", textDecoration:"underline",
                }}>+ Add Promo Code</button>
              )}
            </div>

            {/* Gift note */}
            <div style={{ marginTop:8 }}>
              {giftOpen || giftNote ? (
                <div>
                  <div style={{ fontSize:11, color:MUTED, fontWeight:600, marginBottom:5, letterSpacing:".08em", textTransform:"uppercase" }}>
                    Gift Note
                  </div>
                  <textarea
                    value={giftNote}
                    onChange={e => setGiftNote(e.target.value)}
                    placeholder="Add a personal message…"
                    maxLength={250}
                    rows={2}
                    style={{
                      width:"100%", padding:"9px 11px", borderRadius:8, border:`1px solid ${BORDER}`,
                      fontFamily:"inherit", fontSize:12.5, outline:"none", background:"#fff", resize:"vertical",
                    }}
                  />
                </div>
              ) : (
                <button onClick={() => setGiftOpen(true)} style={{
                  background:"none", border:"none", padding:0, color:INK, fontWeight:600,
                  fontSize:12, cursor:"pointer", fontFamily:"inherit", textDecoration:"underline",
                }}>+ Add Gift Note</button>
              )}
            </div>

            {/* Subtotals */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:13, paddingTop:12, marginTop:12, borderTop:`1px solid ${BORDER}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", color:MUTED }}>
                <span>List Price</span>
                <span style={{ textDecoration:"line-through" }}>${listSubtotal}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", color:TXT }}>
                <span>Subtotal ({totalPhotoCount} {totalPhotoCount === 1 ? "Photo" : "Photos"})</span>
                <span>${subtotal}</span>
              </div>
              {bundleSave > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", color:"#16a34a" }}>
                  <span>Bundle Discount ({Math.round(bundlePct*100)}%)</span><span>−${bundleSave}</span>
                </div>
              )}
              {promoSave > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", color:"#16a34a" }}>
                  <span>Promo {promoApplied?.code} ({Math.round(promoPct*100)}%)</span><span>−${promoSave}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", color:INK, fontSize:12 }}>
                <span style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <Check size={13} style={{ color:"#16a34a" }}/> Eligible For Free Shipping
                </span>
                <span style={{ color:MUTED }}>$0</span>
              </div>
            </div>

            {/* Total */}
            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"baseline",
              paddingTop:14, marginTop:14, borderTop:`1px solid ${BORDER}`,
            }}>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                <span style={{ fontSize:13, fontWeight:600, color:INK }}>Total</span>
                {totalSavings > 0 && (
                  <span style={{ fontSize:11, color:"#16a34a", fontWeight:600 }}>
                    You're Saving ${totalSavings} ({savingsPct}% Off)
                  </span>
                )}
              </div>
              <span className="cz-serif" style={{ fontSize:24, fontWeight:700, color:INK }}>${total}</span>
            </div>
          </div>

          <button onClick={handleContinue} className="cz-btn-red" style={{
            padding:"16px 18px", fontSize:14.5,
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          }}>
            <Check size={18}/> Continue To Checkout
          </button>

          {/* Buy Now, Pay Later */}
          <div style={{
            marginTop:4, padding:"12px 14px",
            border:`1px solid ${BORDER}`, borderRadius:10, background:"#FAFAF7",
          }}>
            <div style={{ fontSize:12, color:INK, fontWeight:600, marginBottom:10, textAlign:"center" }}>
              Or 4 Interest-Free Payments Of <span className="cz-serif" style={{ fontWeight:700 }}>${(total/4).toFixed(2)}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", alignItems:"center", gap:5 }}>
              {[
                { name: "Shop Pay", logo: shopPayLogo, bg: "#5A31F4", scale: "86%" },
                { name: "Klarna", logo: klarnaLogo, bg: "#FFA8CD", scale: "80%" },
                { name: "Affirm", logo: affirmLogo, bg: "transparent", scale: "100%", maxHeight: 32, pad: 0 },
                { name: "Afterpay", logo: afterpayLogo, bg: "#B2FCE4", scale: "84%" },
              ].map((provider) => (
                <div key={provider.name} title={provider.name} aria-label={provider.name} style={{
                  height:23, minWidth:0, padding:provider.pad ?? "0 5px", borderRadius:4, background:provider.bg,
                  display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden",
                }}>
                  <img src={provider.logo} alt={provider.name} style={{
                    width:provider.scale, maxHeight:provider.maxHeight ?? 13, objectFit:"contain", display:"block",
                  }}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign:"center", color:MUTED, fontSize:11.5 }}>
            Free Shipping · 100-Day Happiness Guarantee
          </div>
        </aside>
      </div>

      {/* Edit modal merged into AI Assistant panel */}

      {/* Choose-from-6 modal */}
      {choiceOpen && choices.length > 0 && (
        <div className="cz-modal-back" onClick={() => setChoiceOpen(false)}>
          <div
            className="cz-modal"
            style={{ maxWidth: 720 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Pick Your Favorite</h3>
            <p>We generated 6 variations. Click one to use it on your print.</p>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(3, 1fr)",
              gap:10,
              marginTop:6,
            }}>
              {choices.map((url, i) => (
                <button
                  key={i}
                  onClick={() => pickChoice(url)}
                  style={{
                    padding:0, border:`1px solid ${BORDER}`, background:"#fff",
                    borderRadius:10, overflow:"hidden", cursor:"pointer",
                    aspectRatio:"1 / 1", transition:"all .15s",
                  }}
                  onMouseEnter={(e)=>{(e.currentTarget as HTMLButtonElement).style.borderColor=RED;(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
                  onMouseLeave={(e)=>{(e.currentTarget as HTMLButtonElement).style.borderColor=BORDER;(e.currentTarget as HTMLButtonElement).style.transform="none";}}
                  aria-label={`Choose variation ${i+1}`}
                >
                  <img src={url} alt={`Variation ${i+1}`} style={{
                    width:"100%", height:"100%", objectFit:"cover", display:"block",
                  }}/>
                </button>
              ))}
            </div>
            <div className="cz-modal-actions">
              <button className="cz-modal-btn ghost" onClick={() => setChoiceOpen(false)}>
                Keep Current
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template picker for newly added photo */}
      {tmplPickOpen && (
        <div className="cz-modal-back" onClick={() => generateForNewItem("")}>
          <div
            className="cz-modal"
            style={{ maxWidth: 760 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Pick A Template (Optional)</h3>
            <p>Choose a creative direction for this photo, or let our AI decide for you.</p>
            <button
              onClick={() => generateForNewItem("")}
              style={{
                width:"100%", padding:"12px 14px", marginTop:4, marginBottom:12,
                border:`1.5px dashed ${BORDER}`, borderRadius:12, background:"#FAFAF7",
                cursor:"pointer", fontFamily:"'Poppins',sans-serif",
                fontSize:13.5, fontWeight:600, color:INK,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}
            >
              <Sparkles size={15}/> Let AI Decide (Recommended)
            </button>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(3, 1fr)",
              gap:10,
              maxHeight:"50vh", overflowY:"auto", paddingRight:4,
            }}>
              {(TEMPLATES[session.cat] || TEMPLATES["pets"] || []).map((t) => (
                <button
                  key={t.id}
                  onClick={() => generateForNewItem(t.prompt)}
                  style={{
                    padding:0, border:`1px solid ${BORDER}`, background:"#fff",
                    borderRadius:12, overflow:"hidden", cursor:"pointer",
                    display:"flex", flexDirection:"column", textAlign:"left",
                    transition:"all .15s",
                  }}
                  onMouseEnter={(e)=>{(e.currentTarget as HTMLButtonElement).style.borderColor=RED;(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
                  onMouseLeave={(e)=>{(e.currentTarget as HTMLButtonElement).style.borderColor=BORDER;(e.currentTarget as HTMLButtonElement).style.transform="none";}}
                >
                  <img src={t.img} alt={t.label} style={{
                    width:"100%", aspectRatio:"4 / 5", objectFit:"cover", display:"block",
                  }}/>
                  <div style={{ padding:"8px 10px 10px" }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:INK, lineHeight:1.2 }}>{t.label}</div>
                    <div style={{ fontSize:11, color:MUTED, marginTop:3, lineHeight:1.3 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="cz-modal-actions">
              <button className="cz-modal-btn ghost" onClick={() => generateForNewItem("")}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"#1A1A1A", color:"#fff", padding:"12px 18px", borderRadius:10,
          fontSize:13, zIndex:90, boxShadow:"0 8px 28px rgba(0,0,0,.3)",
        }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
