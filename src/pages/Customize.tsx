// @ts-nocheck
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, RotateCcw, Pencil, Sparkles, Plus, Copy, Lock, EyeOff, Download, Trash2, ChevronUp, ChevronDown, SlidersHorizontal, X, Send, ZoomIn, ZoomOut, ArrowDownToLine, ImageIcon, Frame, Square, LayoutPanelTop, Truck, Layers, UploadCloud, Wand2, ShoppingCart, Minus, Zap, Star, Shield, RefreshCw, Home, Upload } from "lucide-react";
import { TEMPLATES } from "./Index";
import PreviewsDrawer from "@/components/PreviewsDrawer";
import SiteHeader from "@/components/SiteHeader";

import affirmLogo from "@/assets/payment-logos/affirm-reference-cropped.png";
import klarnaLogo from "@/assets/payment-logos/klarna.svg";
import afterpayLogo from "@/assets/payment-logos/afterpay.png";
import sizeGuideImg from "@/assets/size-guide.png";

/* ── Staged Room Presets (5 vibes) ── */
// Simple, clean wall scenes — minimal clutter, mostly empty walls so any portrait looks great
import roomLivingImg  from "@/assets/room-living.jpg";
import roomBedroomImg from "@/assets/room-bedroom.jpg";
import roomOfficeImg  from "@/assets/room-office.jpg";
import roomDiningImg  from "@/assets/room-dining.jpg";
import roomEntryImg   from "@/assets/room-entry.jpg";

const STAGED_ROOMS = [
  { id: "living-sofa",   vibe: "Living Room",   bg: roomLivingImg },
  { id: "bedroom-calm",  vibe: "Bedroom",       bg: roomBedroomImg },
  { id: "office-clean",  vibe: "Home Office",   bg: roomOfficeImg },
  { id: "dining-simple", vibe: "Dining Nook",   bg: roomDiningImg },
  { id: "entry-minimal", vibe: "Minimal Entry", bg: roomEntryImg },
];

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
.cz-watermark{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;mix-blend-mode:normal;opacity:.22;display:flex;align-items:center;justify-content:center}
.cz-watermark-inner{transform:rotate(-22deg);width:200%;font-family:'Poppins',sans-serif;font-weight:500;letter-spacing:.32em;color:rgba(255,255,255,.42);line-height:5;font-size:clamp(11px,1.1vw,14px);text-align:center;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,.25);animation:czWmScroll 32s linear infinite}
@keyframes czWmScroll{from{transform:rotate(-22deg) translateX(0)}to{transform:rotate(-22deg) translateX(-12%)}}
.cz-acc{border-top:1px solid ${BORDER};margin-top:2px}
.cz-acc>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:12px 2px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${INK};outline:none}
.cz-acc>summary::-webkit-details-marker{display:none}
.cz-acc>summary:hover{color:#000}
.cz-acc>summary .cz-acc-val{font-size:11px;font-weight:500;color:${MUTED};text-transform:none;letter-spacing:.01em;margin-left:auto;margin-right:8px;text-align:right;max-width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cz-acc>summary .cz-acc-chev{transition:transform .2s ease;flex-shrink:0;color:${MUTED}}
.cz-acc[open]>summary .cz-acc-chev{transform:rotate(180deg);color:${INK}}
.cz-acc-body{padding:4px 0 14px;animation:czFade .25s ease}
.cz-img-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;background:rgba(10,10,10,.34);opacity:0;transition:opacity .18s ease;pointer-events:none}
.cz-img-wrap:hover .cz-img-overlay{opacity:1;pointer-events:auto}
.cz-overlay-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;background:rgba(20,20,20,.82);color:#fff;border:1px solid rgba(255,255,255,.18);font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;cursor:pointer;backdrop-filter:blur(6px);transition:all .15s ease}
.cz-overlay-btn.alt{background:#fff;color:#0A0A0A;border-color:#fff}
.cz-overlay-btn:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(0,0,0,.25)}
.cz-overlay-btn:disabled{opacity:.6;cursor:not-allowed}
.cz-busy{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(10,10,10,.94);backdrop-filter:blur(6px);color:#fff;z-index:10;isolation:isolate;line-height:1.25;text-align:center;padding:18px}
.cz-spinner{width:46px;height:46px;border-radius:50%;border:3px solid rgba(255,255,255,.18);border-top-color:#fff;animation:czSpin .9s linear infinite}
@keyframes czSpin{to{transform:rotate(360deg)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.cz-busy-label{font-size:13px;font-weight:600;letter-spacing:.02em;text-align:center;line-height:1.3;max-width:100%;overflow-wrap:break-word;text-wrap:balance}
.cz-busy-sub{font-size:11.5px;color:rgba(255,255,255,.7);text-align:center;line-height:1.35;max-width:100%;overflow-wrap:break-word}
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
.cz-toolbar{display:flex;flex-direction:column;gap:4px;background:#fff;border:1px solid ${BORDER};border-radius:14px;padding:6px;box-shadow:none}
.cz-tool{width:38px;height:38px;border-radius:10px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5A5550;transition:all .15s ease;position:relative}
.cz-tool:hover{background:#F4F1EC;color:${INK}}
.cz-tool.on{background:rgba(230,25,25,.10);color:${RED}}
.cz-tool:disabled{opacity:.45;cursor:not-allowed}
.cz-tool-divider{height:1px;background:${BORDER};margin:4px 6px}
.cz-tool[data-tip]::after{content:attr(data-tip);position:absolute;right:calc(100% + 10px);top:50%;transform:translateY(-50%) translateX(4px);background:#fff;color:${INK};font-family:'Poppins',sans-serif;font-size:12px;font-weight:500;padding:6px 10px;border-radius:8px;border:1px solid ${BORDER};box-shadow:0 6px 18px -6px rgba(0,0,0,.18);white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s ease,transform .15s ease;z-index:50}
.cz-tool[data-tip]::before{content:"";position:absolute;right:calc(100% + 4px);top:50%;transform:translateY(-50%) translateX(4px) rotate(45deg);width:8px;height:8px;background:#fff;border-right:1px solid ${BORDER};border-top:1px solid ${BORDER};pointer-events:none;opacity:0;transition:opacity .15s ease,transform .15s ease;z-index:50}
.cz-tool[data-tip]:hover::after{opacity:1;transform:translateY(-50%) translateX(0)}
.cz-tool[data-tip]:hover::before{opacity:1;transform:translateY(-50%) translateX(0) rotate(45deg)}
.cz-ai-panel{width:320px;background:#fff;border:1px solid ${BORDER};border-radius:18px;box-shadow:none;display:flex;flex-direction:column;overflow:hidden;animation:czAiSlide .28s cubic-bezier(.22,1,.32,1) both;align-self:stretch;max-height:560px}
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
@media (max-width: 760px){
  .cz-ai-panel{width:100%;max-width:420px}
  .cz-stage-row{flex-direction:column !important}
  .cz-toolbar{flex-direction:row !important}
  .cz-tool-divider{height:auto;width:1px;margin:6px 4px}
}
@media (max-width: 760px){
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

// Legacy size fallback — Prodigi-accurate sizes only, all prices end in 7
// Legacy fallback — all Prodigi-accurate sizes, all prices end in 7 (RETAIL prices)
const SIZES = [
  { id: '8" x 8"',   label: '8 × 8',   sub: "Square",    price: 57,  w: 1,    h: 1    },
  { id: '8" x 10"',  label: '8 × 10',  sub: "Classic",   price: 77,  w: 0.80, h: 1    },
  { id: '10" x 8"',  label: '10 × 8',  sub: "Classic",   price: 77,  w: 1,    h: 0.80 },
  { id: '8" x 11"',  label: '8 × 11',  sub: "Portrait",  price: 77,  w: 0.73, h: 1    },
  { id: '11" x 8"',  label: '11 × 8',  sub: "Landscape", price: 77,  w: 1,    h: 0.73 },
  { id: '10" x 10"', label: '10 × 10', sub: "Square",    price: 77,  w: 1,    h: 1    },
  { id: '11" x 14"', label: '11 × 14', sub: "Standard",  price: 87,  w: 0.79, h: 1    },
  { id: '14" x 11"', label: '14 × 11', sub: "Standard",  price: 87,  w: 1,    h: 0.79 },
  { id: '12" x 12"', label: '12 × 12', sub: "Square",    price: 87,  w: 1,    h: 1    },
  { id: '12" x 16"', label: '12 × 16', sub: "Portrait",  price: 97,  w: 0.75, h: 1    },
  { id: '16" x 12"', label: '16 × 12', sub: "Landscape", price: 97,  w: 1,    h: 0.75 },
  { id: '16" x 20"', label: '16 × 20', sub: "Large",     price: 117, w: 0.80, h: 1    },
  { id: '20" x 16"', label: '20 × 16', sub: "Large",     price: 117, w: 1,    h: 0.80 },
  { id: '16" x 16"', label: '16 × 16', sub: "Square",    price: 117, w: 1,    h: 1    },
  { id: '20" x 20"', label: '20 × 20', sub: "Statement", price: 137, w: 1,    h: 1    },
  { id: '18" x 24"', label: '18 × 24', sub: "XL",        price: 137, w: 0.75, h: 1    },
  { id: '24" x 18"', label: '24 × 18', sub: "XL",        price: 137, w: 1,    h: 0.75 },
  { id: '20" x 24"', label: '20 × 24', sub: "Statement", price: 157, w: 0.83, h: 1    },
  { id: '24" x 20"', label: '24 × 20', sub: "Statement", price: 157, w: 1,    h: 0.83 },
  { id: '24" x 36"', label: '24 × 36', sub: "Grand",     price: 187, w: 0.67, h: 1    },
  { id: '36" x 24"', label: '36 × 24', sub: "Grand",     price: 187, w: 1,    h: 0.67 },
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

/* ── Prodigi product catalogue ── */
const PRODUCT_TYPES = [
  { id:"digital",       label:"Digital Only",     desc:"Hi-res download",                  icon:ArrowDownToLine, price:37   },
  { id:"print",         label:"Fine Art Print",   desc:"Ships rolled, frame yourself",     icon:ImageIcon,       price:null },
  { id:"classic-frame", label:"Classic Frame",    desc:"Ready to hang · 8 colours",        icon:Frame,           price:null },
  { id:"box-frame",     label:"Box Frame",        desc:"Shadow box · premium look",        icon:LayoutPanelTop,  price:null },
  { id:"canvas",        label:"Canvas Print",     desc:"Gallery wrap · ready to hang",     icon:Square,          price:null },
  { id:"acrylic",       label:"Acrylic Glass",    desc:"Frameless · luminous · museum-grade", icon:Layers,        price:null },
];

// Simplified S/M/L sizes per product (drives right-panel product cards)
const SIMPLE_SIZES: Record<string, { id:string; pid:string; label:string; dim:string; sku:string; price:number; w:number; h:number; best?:boolean }[]> = {
  "print": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8 × 10"',  sku:"GLOBAL-FAP-8x10",  price:77,  w:0.80, h:1 },
    { id:"md", pid:"12x16", label:"Medium", dim:'12 × 16"', sku:"GLOBAL-FAP-12x16", price:97,  w:0.75, h:1, best:true },
    { id:"lg", pid:"24x36", label:"Large",  dim:'24 × 36"', sku:"GLOBAL-FAP-24x36", price:187, w:0.67, h:1 },
  ],
  "canvas": [
    { id:"sm", pid:"12x16", label:"Small",  dim:'12 × 16"', sku:"GLOBAL-CAN-12x16", price:117, w:0.75, h:1 },
    { id:"md", pid:"16x20", label:"Medium", dim:'16 × 20"', sku:"GLOBAL-CAN-16x20", price:137, w:0.80, h:1, best:true },
    { id:"lg", pid:"24x36", label:"Large",  dim:'24 × 36"', sku:"GLOBAL-CAN-24x36", price:227, w:0.67, h:1 },
  ],
  "classic-frame": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8 × 10"',  sku:"GLOBAL-CFPM-8x10",  price:97,  w:0.80, h:1 },
    { id:"md", pid:"12x16", label:"Medium", dim:'12 × 16"', sku:"GLOBAL-CFPM-12x16", price:137, w:0.75, h:1, best:true },
    { id:"lg", pid:"18x24", label:"Large",  dim:'18 × 24"', sku:"GLOBAL-CFPM-18x24", price:197, w:0.75, h:1 },
  ],
  "box-frame": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8 × 10"',  sku:"GLOBAL-BOXM-8x10",  price:107, w:0.80, h:1 },
    { id:"md", pid:"12x16", label:"Medium", dim:'12 × 16"', sku:"GLOBAL-BOXM-12x16", price:147, w:0.75, h:1, best:true },
    { id:"lg", pid:"18x24", label:"Large",  dim:'18 × 24"', sku:"GLOBAL-BOXM-18x24", price:207, w:0.75, h:1 },
  ],
  "acrylic": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8 × 10"',  sku:"GLOBAL-MOU-ACRY-8x10",  price:147, w:0.80, h:1 },
    { id:"md", pid:"12x16", label:"Medium", dim:'12 × 16"', sku:"GLOBAL-MOU-ACRY-12x16", price:187, w:0.75, h:1, best:true },
    { id:"lg", pid:"16x20", label:"Large",  dim:'16 × 20"', sku:"GLOBAL-MOU-ACRY-16x20", price:207, w:0.80, h:1 },
    { id:"xl", pid:"20x24", label:"XL",     dim:'20 × 24"', sku:"GLOBAL-MOU-ACRY-20x24", price:247, w:0.83, h:1 },
  ],
};

const SIZES_BY_PRODUCT: Record<string, { id:string; label:string; sub:string; sku:string; price:number; w:number; h:number }[]> = {
  print: [
    { id:"8x8",   label:'8 × 8"',   sub:"Square",    sku:"GLOBAL-FAP-8x8",   price:57,  w:1,    h:1 },
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-FAP-8x10",  price:77,  w:0.80, h:1 },
    { id:"8x11",  label:'8 × 11"',  sub:"Portrait",  sku:"GLOBAL-FAP-8x11",  price:77,  w:0.73, h:1 },
    { id:"10x10", label:'10 × 10"', sub:"Square",    sku:"GLOBAL-FAP-10x10", price:77,  w:1,    h:1 },
    { id:"11x14", label:'11 × 14"', sub:"Standard",  sku:"GLOBAL-FAP-11x14", price:87,  w:0.79, h:1 },
    { id:"12x12", label:'12 × 12"', sub:"Square",    sku:"GLOBAL-FAP-12x12", price:87,  w:1,    h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-FAP-12x16", price:97,  w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-FAP-16x20", price:117, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-FAP-18x24", price:137, w:0.75, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-FAP-20x24", price:157, w:0.83, h:1 },
    { id:"24x36", label:'24 × 36"', sub:"Grand",     sku:"GLOBAL-FAP-24x36", price:187, w:0.67, h:1 },
  ],
  "classic-frame": [
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-CFPM-8x10",  price:97,  w:0.80, h:1 },
    { id:"8x11",  label:'8 × 11"',  sub:"Portrait",  sku:"GLOBAL-CFPM-8x11",  price:97,  w:0.73, h:1 },
    { id:"10x10", label:'10 × 10"', sub:"Square",    sku:"GLOBAL-CFPM-10x10", price:97,  w:1,    h:1 },
    { id:"11x14", label:'11 × 14"', sub:"Standard",  sku:"GLOBAL-CFPM-11x14", price:117, w:0.79, h:1 },
    { id:"12x12", label:'12 × 12"', sub:"Square",    sku:"GLOBAL-CFPM-12x12", price:117, w:1,    h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-CFPM-12x16", price:137, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-CFPM-16x20", price:167, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-CFPM-18x24", price:197, w:0.75, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-CFPM-20x24", price:217, w:0.83, h:1 },
  ],
  "box-frame": [
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-BOXM-8x10",  price:107, w:0.80, h:1 },
    { id:"11x14", label:'11 × 14"', sub:"Standard",  sku:"GLOBAL-BOXM-11x14", price:127, w:0.79, h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-BOXM-12x16", price:147, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-BOXM-16x20", price:177, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-BOXM-18x24", price:207, w:0.75, h:1 },
  ],
  canvas: [
    { id:"10x10", label:'10 × 10"', sub:"Square",    sku:"GLOBAL-CAN-10x10", price:97,  w:1,    h:1 },
    { id:"12x12", label:'12 × 12"', sub:"Square",    sku:"GLOBAL-CAN-12x12", price:97,  w:1,    h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-CAN-12x16", price:117, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-CAN-16x20", price:137, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-CAN-18x24", price:157, w:0.75, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-CAN-20x24", price:177, w:0.83, h:1 },
    { id:"24x36", label:'24 × 36"', sub:"Grand",     sku:"GLOBAL-CAN-24x36", price:227, w:0.67, h:1 },
  ],
  "acrylic": [
    { id:"8x8",   label:'8 × 8"',   sub:"Square",    sku:"GLOBAL-MOU-ACRY-8x8",   price:127, w:1,    h:1 },
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-MOU-ACRY-8x10",  price:147, w:0.80, h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-MOU-ACRY-12x16", price:187, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-MOU-ACRY-16x20", price:207, w:0.80, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-MOU-ACRY-20x24", price:247, w:0.83, h:1 },
    { id:"24x36", label:'24 × 36"', sub:"Grand",     sku:"GLOBAL-MOU-ACRY-24x36", price:297, w:0.67, h:1 },
  ],
};

const FRAME_COLORS: Record<string, { id:string; label:string; color:string }[]> = {
  // Classic frames — premium matte palette
  "classic-frame": [
    { id:"black",          label:"Black",           color:"#15151a" },
    { id:"white",          label:"White",           color:"#efece6" },
    { id:"natural",        label:"Natural",         color:"#c89968" },
    { id:"antique-silver", label:"Antique Silver",  color:"#9a9a9a" },
    { id:"antique-gold",   label:"Antique Gold",    color:"#c4963a" },
    { id:"dark-grey",      label:"Dark Grey",       color:"#3d3d42" },
    { id:"light-grey",     label:"Light Grey",      color:"#c2c0bb" },
    { id:"brown",          label:"Brown",           color:"#6b4a30" },
  ],
  // Box frames: 3 Prodigi colours ONLY (black, white, natural — no brown)
  "box-frame": [
    { id:"black",   label:"Matte Black",   color:"#15151a" },
    { id:"white",   label:"Matte White",   color:"#efece6" },
    { id:"natural", label:"Natural Oak",   color:"#c89968" },
  ],
};

// Mount/mat colours for framed prints (CFPM / BOXM) — Prodigi confirmed
const MOUNT_COLORS = [
  { id:"snow-white", label:"Snow White", color:"#f9f9f7" },
  { id:"hayseed",    label:"Hayseed",    color:"#e8dfc8" },
  { id:"black",      label:"Black",      color:"#1a1a1a" },
];

// Prodigi glaze options — confirmed for GLOBAL-CFP/CFPM and GLOBAL-BOX/BOXM
const GLAZE_OPTIONS = [
  { id:"perspex",     label:"Standard",     desc:"Durable Perspex — clear & protective",            add:0  },
  { id:"float-glass", label:"Float Glass",  desc:"Premium float glass — enhanced clarity & depth",  add:9  },
  { id:"moth-eye",    label:"Moth-Eye ✦",   desc:"Anti-reflective, no-glare museum-grade glass",    add:17 },
] as const;

// ── Room View ─────────────────────────────────────────
// Curated staged rooms — each MUST have a large empty wall area
// where a single portrait can be placed cleanly. No gallery walls,
// no existing art, no shelving directly above the placement spot.
const ROOMS = [
  { label:"Modern Living Room",
    url:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&h=900&fit=crop&q=85",
    wallX:50, wallY:14, wallW:24 },
  { label:"Warm Neutral Sofa",
    url:"https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&h=900&fit=crop&q=85",
    wallX:50, wallY:12, wallW:22 },
  { label:"Scandinavian Lounge",
    url:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&h=900&fit=crop&q=85",
    wallX:48, wallY:14, wallW:26 },
  { label:"Minimalist Bedroom",
    url:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&h=900&fit=crop&q=85",
    wallX:50, wallY:12, wallW:24 },
  { label:"Bright Dining Room",
    url:"https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1400&h=900&fit=crop&q=85",
    wallX:50, wallY:14, wallW:24 },
  { label:"Cozy Reading Nook",
    url:"https://images.unsplash.com/photo-1616627781809-781c12d0fb88?w=1400&h=900&fit=crop&q=85",
    wallX:50, wallY:14, wallW:22 },
] as const;


const FRAME_COLOR_HEX: Record<string,string> = {
  "black":          "#15151a",
  "white":          "#efece6",
  "natural":        "#c89968",
  "antique-silver": "#9a9a9a",
  "antique-gold":   "#c4963a",
  "dark-grey":      "#3d3d42",
  "light-grey":     "#c2c0bb",
  "brown":          "#6b4a30",
};

const CANVAS_EDGES = [
  { id:"mirror",       label:"Mirror Wrap",         desc:"Edges mirror the image",   color:null      },
  { id:"museum-black", label:"Museum (Black edge)", desc:"Clean solid black edges",  color:"#1a1a1a" },
  { id:"museum-white", label:"Museum (White edge)", desc:"Clean solid white edges",  color:"#f4f4f4" },
];

// ── Name overlay options ──────────────────────────────
const NAME_POSITIONS = [
  { id:"none",   label:"None"   },
  { id:"top",    label:"Top"    },
  { id:"bottom", label:"Bottom" },
] as const;

const NAME_FONTS = [
  { id:"bold",   label:"Bold Sans",     css:(fs:number)=>`700 ${fs}px 'Poppins',sans-serif` },
  { id:"serif",  label:"Classic Serif", css:(fs:number)=>`700 ${fs}px Georgia,'Times New Roman',serif` },
  { id:"italic", label:"Italic",        css:(fs:number)=>`600 italic ${fs}px 'Poppins',sans-serif` },
] as const;

const NAME_SIZES = [
  { id:"sm", label:"S", mult:0.045, css:"3.5cqw" },
  { id:"md", label:"M", mult:0.065, css:"5cqw" },
  { id:"lg", label:"L", mult:0.085, css:"6.8cqw" },
  { id:"xl", label:"XL", mult:0.105, css:"8.5cqw" },
] as const;

const NAME_COLORS = [
  { id:"white", label:"White", hex:"#FFFFFF" },
  { id:"cream", label:"Cream", hex:"#EDE6D9" },
  { id:"black", label:"Black", hex:"#0A0A0A" },
  { id:"gold",  label:"Gold",  hex:"#C4963A" },
] as const;

const toFrameId = (productType:string, frameColor:string): string => {
  if (productType === "digital" || productType === "print") return "frameless";
  if (productType === "canvas") return "canvas";
  if (productType === "box-frame") return frameColor === "white" ? "wide-white" : "wide-black";
  const map: Record<string,string> = {
    "black":"black","white":"white","natural":"oak","antique-silver":"white",
    "antique-gold":"oak","dark-grey":"black","light-grey":"white","brown":"walnut",
  };
  return map[frameColor] || "black";
};

// Resolve a size def for any item (new id format or legacy fallback)
const getSizeDef = (it:any) => {
  const pt = it?.productType || "classic-frame";
  const list = SIZES_BY_PRODUCT[pt] || SIZES_BY_PRODUCT["classic-frame"];
  const found = list.find(s => s.id === it?.size);
  if (found) return found;
  // Legacy fallback for items saved with old size IDs like '11" x 14"'
  const legacy = SIZES.find(s => s.id === it?.size);
  if (legacy) return { id: legacy.id, label: legacy.label, sub: legacy.sub, sku: "", price: legacy.price, w: legacy.w, h: legacy.h };
  return list[1] || list[0];
};

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

/* ── Room View Panel (staged + upload) ── */
function RoomViewPanel({
  portraitUrl, frameColor, productType, selected,
  userRoomUrl, setUserRoomUrl,
  aiRoomUrl, setAiRoomUrl, aiRoomLoading, setAiRoomLoading,
  stagedComposites, setStagedComposites,
  selectedRoomKey, setSelectedRoomKey,
  portraitDragPos, setPortraitDragPos, isDragging, setIsDragging,
  dragStart, setDragStart, roomContainerRef, setRoomView,
}: any) {
  const framePx  = FRAME_COLOR_HEX[frameColor] || "#15151a";
  const isCanvas = productType === "canvas";
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sizeMap: Record<string, number> = {
    "8x8":1, "10x10":1, "12x12":1, "16x16":1,
    "8x10":0.80, "8x11":0.73, "10x8":1.25, "11x14":0.79,
    "12x16":0.75, "16x20":0.80, "18x24":0.75, "20x24":0.83, "24x36":0.67,
  };
  const aspectRatio = sizeMap[(selected as any)?.size] || 0.75;

  // ── Tab mode: "staged" | "user" | "ai" ──
  const mode: "staged" | "user" | "ai" =
    selectedRoomKey === "user" ? "user"
    : selectedRoomKey === "ai" ? "ai"
    : "staged";

  // ── Resolve background based on selected room ──
  const stagedEntry = mode === "staged" ? stagedComposites[selectedRoomKey] : null;
  const stagedRoomDef = STAGED_ROOMS.find(r => r.id === selectedRoomKey);
  const bgUrl =
    mode === "ai"   ? (aiRoomUrl || userRoomUrl)
    : mode === "user" ? userRoomUrl
    : (stagedEntry?.url || stagedRoomDef?.bg);
  const bgIsComposite = mode === "ai" ? !!aiRoomUrl : mode === "staged" ? !!stagedEntry?.url : false;
  const stagedLoading = mode === "staged" && stagedEntry?.loading;

  const wallX = portraitDragPos.x;
  const wallY = portraitDragPos.y;
  const wallW = portraitDragPos.w;

  const onDragStart = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ mx:e.clientX, my:e.clientY, px:portraitDragPos.x, py:portraitDragPos.y });
  };
  const onDragMove = (e: any) => {
    if (!isDragging || !roomContainerRef.current) return;
    const rect = roomContainerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.mx) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.my) / rect.height) * 100;
    setPortraitDragPos((p: any) => ({
      ...p,
      x: Math.max(0, Math.min(80 - wallW, dragStart.px + dx)),
      y: Math.max(0, Math.min(70, dragStart.py + dy)),
    }));
  };
  const onDragEnd = () => setIsDragging(false);
  const onWheel = (e: any) => {
    setPortraitDragPos((p: any) => ({
      ...p, w: Math.max(10, Math.min(60, p.w - e.deltaY * 0.02)),
    }));
  };

  // ── Auto-generate composites for all 5 staged rooms when portrait changes ──
  useEffect(() => {
    if (!portraitUrl) return;
    let cancelled = false;
    // Reset all composites when portrait or frame changes
    setStagedComposites({});
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      for (const room of STAGED_ROOMS) {
        const existing = stagedComposites[room.id];
        if (existing?.url || existing?.loading) continue;
        setStagedComposites((prev: any) => ({ ...prev, [room.id]: { loading: true } }));
        try {
          const { data, error } = await supabase.functions.invoke("composite-room-portrait", {
            body: { roomUrl: room.bg, portraitUrl, frameColor },
          });
          if (cancelled) return;
          if (!error && data?.url) {
            setStagedComposites((prev: any) => ({ ...prev, [room.id]: { url: data.url, loading: false } }));
          } else {
            setStagedComposites((prev: any) => ({ ...prev, [room.id]: { loading: false } }));
          }
        } catch {
          if (!cancelled) setStagedComposites((prev: any) => ({ ...prev, [room.id]: { loading: false } }));
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portraitUrl, frameColor]);

  const generateAIRoom = async () => {
    if (!userRoomUrl || !portraitUrl) return;
    setAiRoomLoading(true);
    setAiRoomUrl(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("composite-room-portrait", {
        body: { roomUrl: userRoomUrl, portraitUrl, frameColor },
      });
      if (!error && data?.url) setAiRoomUrl(data.url);
    } catch { /* silent */ }
    setAiRoomLoading(false);
  };

  const showPortraitOverlay = portraitUrl && bgUrl && !bgIsComposite && !aiRoomLoading && !stagedLoading;

  return (
    <div style={{
      width:"100%", height:"100%", display:"flex", flexDirection:"column",
      gap:14, background:"#0A0A0A", borderRadius:16, padding:18, color:"#fff",
      border:"1px solid rgba(255,255,255,.08)",
    }}>
      {/* Header: Back + Title */}
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <button
          onClick={() => setRoomView(false)}
          style={{
            padding:"7px 13px", borderRadius:999, fontSize:12, fontWeight:600,
            cursor:"pointer", fontFamily:"'Poppins',sans-serif",
            background:"rgba(255,255,255,.08)", color:"#fff",
            border:"1px solid rgba(255,255,255,.14)",
            display:"inline-flex", alignItems:"center", gap:6,
          }}>
          <ChevronLeft size={14}/> Back to portrait
        </button>
      </div>

      {/* Tab bar + upload (top-right) */}
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        {([
          { k:"staged", label:"Staged Rooms" },
          { k:"user",   label:"My Room" },
          { k:"ai",     label:"AI Magic", icon:<Sparkles size={13}/> },
        ] as const).map(t => {
          const on = mode === t.k;
          const isAi = t.k === "ai";
          return (
            <button key={t.k}
              onClick={() => {
                if (t.k === "staged") setSelectedRoomKey(STAGED_ROOMS[0].id);
                else setSelectedRoomKey(t.k);
              }}
              style={{
                display:"inline-flex", alignItems:"center", gap:6,
                padding:"8px 14px", borderRadius:8,
                fontSize:12, fontWeight:700, fontFamily:"'Poppins',sans-serif",
                cursor:"pointer",
                background: on ? (isAi ? RED : "rgba(255,255,255,.14)") : "transparent",
                color: "#fff",
                border: on
                  ? `1px solid ${isAi ? RED : "rgba(255,255,255,.22)"}`
                  : "1px solid rgba(255,255,255,.18)",
              }}>
              {t.label}{t.icon ? <span style={{ marginLeft:2 }}>{t.icon}</span> : null}
            </button>
          );
        })}

        {/* Push remaining controls to the right */}
        <div style={{ flex:1 }} />

        <label style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"8px 14px", borderRadius:8,
          background:"rgba(255,255,255,.08)", color:"#fff",
          border:"1px solid rgba(255,255,255,.14)",
          fontSize:12, fontWeight:600, fontFamily:"'Poppins',sans-serif",
          cursor:"pointer",
        }}>
          <Upload size={14}/> {userRoomUrl ? "Change Room Photo" : "Upload Your Room"}
          <input type="file" accept="image/*" style={{ display:"none" }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = ev => {
                setUserRoomUrl(ev.target?.result as string);
                setAiRoomUrl(null);
                // Jump to My Room so the user sees their upload immediately
                if (mode === "staged") setSelectedRoomKey("user");
              };
              reader.readAsDataURL(f);
            }}/>
        </label>

        {mode === "ai" && userRoomUrl && (
          <button onClick={generateAIRoom} disabled={aiRoomLoading}
            style={{
              display:"inline-flex", alignItems:"center", gap:6,
              background: aiRoomLoading ? "rgba(255,255,255,.12)" : RED,
              border:"none", padding:"9px 14px", borderRadius:8,
              fontSize:12, fontWeight:700, color:"#fff",
              cursor: aiRoomLoading ? "wait" : "pointer",
              fontFamily:"'Poppins',sans-serif",
            }}>
            {aiRoomLoading ? "Generating…" : <><Sparkles size={13}/> {aiRoomUrl ? "Regenerate" : "Generate Realistic View"}</>}
          </button>
        )}
      </div>

      {/* Main room view */}
      <div
        ref={roomContainerRef}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        style={{
          position:"relative", flex:"1 1 auto", borderRadius:14,
          overflow:"hidden", background:"#151515", minHeight:0,
          border:"1px solid rgba(255,255,255,.08)",
          userSelect: isDragging ? "none" : "auto",
        }}>
        {bgUrl && (
          <img
            src={bgUrl}
            alt="Room preview"
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
        )}

        {/* Empty state when user/ai tab selected and no upload */}
        {(mode === "user" || mode === "ai") && !userRoomUrl && (
          <label style={{
            position:"absolute", inset:0, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:18,
            textAlign:"center", padding:32, cursor:"pointer",
            background:"linear-gradient(180deg,#1a1a1a 0%,#0d0d0d 100%)",
          }}>
            <div style={{
              position:"relative", width:120, height:150,
              background:"#fff",
              border:"10px solid #fff",
              boxShadow:"0 18px 40px rgba(0,0,0,.55)",
              borderRadius:2,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Home size={32} color="#C9BFA9" strokeWidth={1.5}/>
            </div>
            <div style={{ maxWidth:340 }}>
              <div style={{
                fontSize:18, fontWeight:700, color:"#fff",
                fontFamily:"'Poppins',sans-serif", marginBottom:6,
              }}>Upload a photo of your wall</div>
              <div style={{
                fontSize:13, color:"rgba(255,255,255,.65)", lineHeight:1.55,
                fontFamily:"'Poppins',sans-serif",
              }}>See exactly how your portrait will look in your space — with realistic lighting, shadows, and scale.</div>
            </div>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background: RED, color:"#fff",
              padding:"11px 22px", borderRadius:999,
              fontSize:13, fontWeight:700, fontFamily:"'Poppins',sans-serif",
              boxShadow:"0 6px 18px rgba(212,38,46,.28)",
            }}>
              <Upload size={15}/> Upload Your Room
            </span>
            <input type="file" accept="image/*" style={{ display:"none" }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = ev => {
                  setUserRoomUrl(ev.target?.result as string);
                  setAiRoomUrl(null);
                };
                reader.readAsDataURL(f);
              }}/>
          </label>
        )}

        {/* Portrait overlay — when staged is still loading or user uploaded but hasn't generated */}
        {showPortraitOverlay && (
          <div
            onMouseDown={onDragStart}
            onWheel={onWheel}
            style={{
              position:"absolute",
              left:   `${wallX}%`,
              top:    `${wallY}%`,
              width:  `${wallW}%`,
              aspectRatio: `${1} / ${aspectRatio || 0.75}`,
              cursor: isDragging ? "grabbing" : "grab",
              boxShadow: "0 14px 28px rgba(0,0,0,.45), 0 4px 10px rgba(0,0,0,.3)",
              border: isCanvas ? "none" : `${Math.max(6, wallW*0.6)}px solid ${framePx}`,
              background: framePx,
              transition: isDragging ? "none" : "left .15s, top .15s, width .15s",
            }}>
            <img src={portraitUrl} alt="Your portrait"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          </div>
        )}

        {/* AI loading overlay */}
        {(aiRoomLoading || stagedLoading) && (
          <div style={{
            position:"absolute", inset:0, background:"rgba(0,0,0,.55)",
            backdropFilter:"blur(2px)",
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:14,
          }}>
            <div style={{
              width:40, height:40, borderRadius:"50%",
              border:"3px solid rgba(255,255,255,.18)", borderTopColor:"#fff",
              animation:"spin .9s linear infinite",
            }}/>
            <span style={{ color:"#fff", fontSize:13, fontWeight:600,
              fontFamily:"'Poppins',sans-serif" }}>Compositing your portrait…</span>
          </div>
        )}
      </div>

      {/* Footer thumbnail strip — only on Staged Rooms tab */}
      {mode === "staged" && (
        <div style={{
          display:"flex", gap:10, alignItems:"stretch",
          overflowX:"auto", paddingBottom:2,
        }}>
          {STAGED_ROOMS.map(room => {
            const entry = stagedComposites[room.id];
            const thumb = entry?.url || room.bg;
            const on = selectedRoomKey === room.id;
            const loading = entry?.loading;
            return (
              <button key={room.id}
                onClick={() => setSelectedRoomKey(room.id)}
                style={{
                  flex:"0 0 110px", height:90, position:"relative",
                  borderRadius:10, overflow:"hidden", cursor:"pointer",
                  border: on ? `2px solid ${RED}` : "2px solid rgba(255,255,255,.12)",
                  padding:0, background:"#222",
                  boxShadow: on ? "0 4px 14px rgba(230,25,25,.35)" : "none",
                }}>
                <img src={thumb} alt={room.vibe}
                  style={{ width:"100%", height:"100%", objectFit:"contain", display:"block",
                    background:"#1a1a1a",
                    opacity: loading ? .5 : 1 }}/>
                {loading && (
                  <div style={{
                    position:"absolute", inset:0, display:"flex",
                    alignItems:"center", justifyContent:"center",
                    background:"rgba(0,0,0,.4)",
                  }}>
                    <div style={{
                      width:18, height:18, borderRadius:"50%",
                      border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff",
                      animation:"spin .9s linear infinite",
                    }}/>
                  </div>
                )}
                <div style={{
                  position:"absolute", left:0, right:0, bottom:0,
                  background:"linear-gradient(180deg,transparent,rgba(0,0,0,.85))",
                  color:"#fff", fontSize:9.5, fontWeight:600,
                  fontFamily:"'Poppins',sans-serif",
                  padding:"10px 6px 5px", textAlign:"left",
                  letterSpacing:".04em",
                }}>{room.vibe}</div>
              </button>
            );
          })}

          {/* Size guide — always visible info tile */}
          <button onClick={() => setSizeGuideOpen(true)} style={{
            flex:"0 0 110px", height:90, position:"relative",
            borderRadius:10, overflow:"hidden", padding:0, cursor:"pointer",
            border:"2px solid rgba(255,255,255,.12)",
            background:"#fff",
          }}>
            <img src={sizeGuideImg} alt="Size guide"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
            <div style={{
              position:"absolute", left:0, right:0, bottom:0,
              background:"linear-gradient(180deg,transparent,rgba(0,0,0,.85))",
              color:"#fff", fontSize:9.5, fontWeight:600,
              fontFamily:"'Poppins',sans-serif",
              padding:"10px 6px 5px", textAlign:"left",
              letterSpacing:".04em",
            }}>Size Guide</div>
          </button>
        </div>
      )}

      {sizeGuideOpen && (
        <div onClick={() => setSizeGuideOpen(false)} style={{
          position:"fixed", inset:0, zIndex:1000,
          background:"rgba(0,0,0,.85)", display:"flex",
          alignItems:"center", justifyContent:"center", padding:24, cursor:"zoom-out",
        }}>
          <img src={sizeGuideImg} alt="Size guide"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth:"min(900px, 95vw)", maxHeight:"90vh",
              objectFit:"contain", borderRadius:8,
              boxShadow:"0 20px 60px rgba(0,0,0,.6)", background:"#fff",
            }}/>
          <button onClick={() => setSizeGuideOpen(false)} style={{
            position:"absolute", top:18, right:18,
            background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)",
            color:"#fff", borderRadius:8, padding:"8px 14px",
            fontSize:13, fontWeight:600, cursor:"pointer",
            fontFamily:"'Poppins',sans-serif",
          }}>Close</button>
        </div>
      )}
    </div>
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
    productType: "classic-frame",
    frameColor:  "black",
    canvasEdge:  "mirror",
    sku:         "GLOBAL-CFPM-8x10",
    frame:       "black",      // legacy — derived, drives visual preview
    size:        "8x10",       // new id format
    effect:      "original",
    border:      "shallow",
    borderColor: "soft-white",
    qty:         1,
    ...overrides,
  });


  const [items, setItems] = useState(() => {
    // Load portraits passed from the My Previews drawer
    try {
      const stored = localStorage.getItem("dp:pendingPortraits");
      if (stored) {
        const portraits: { url: string; style: string }[] = JSON.parse(stored);
        localStorage.removeItem("dp:pendingPortraits");
        localStorage.removeItem("dp:pendingCategory");
        if (portraits.length > 0) {
          return portraits.map(p =>
            makeItem({
              photoUrl: p.url,
              style:    p.style || "royal",
            })
          );
        }
      }
    } catch {}

    const saved = (session as any).customizationItems;
    if (saved?.length) return saved;
    return [makeItem({
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
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onDragStart = (item, e) => {
    const z = item.zoom || 1;
    e.preventDefault();
    const wrap = e.currentTarget as HTMLElement;
    const rect = wrap.getBoundingClientRect();
    const sd = getSizeDef(item);
    const frameAspect = sd.w / sd.h;
    const photoAspect = item.photoAspect || frameAspect;
    const baseW = photoAspect > frameAspect ? rect.height * photoAspect : rect.width;
    const baseH = photoAspect > frameAspect ? rect.height : rect.width / photoAspect;
    const maxX = Math.max(0, ((baseW * z) - rect.width) / 2);
    const maxY = Math.max(0, ((baseH * z) - rect.height) / 2);
    if (!maxX && !maxY) return;
    dragRef.current = {
      id: item.id, startX: e.clientX, startY: e.clientY,
      baseX: item.offsetX || 0, baseY: item.offsetY || 0,
    };
    setDraggingId(item.id);
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const onMove = (ev: MouseEvent) => {
      const d = dragRef.current; if (!d) return;
      const nx = clamp(d.baseX + (ev.clientX - d.startX), maxX);
      const ny = clamp(d.baseY + (ev.clientY - d.startY), maxY);
      setItems(prev => prev.map(i => i.id === d.id ? { ...i, offsetX: nx, offsetY: ny } : i));
    };
    const onUp = () => {
      dragRef.current = null;
      setDraggingId(null);
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
  const [mpSection, setMpSection]     = useState<"" | "regenerate" | "ai" | "concierge">("regenerate");
  const [conciergeNote, setConciergeNote] = useState("");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`concierge_note_${selected?.id}`);
      setConciergeNote(saved || (selected as any)?.conciergeNote || "");
    } catch { setConciergeNote(""); }
  }, [selected?.id]);
  const [choices, setChoices]         = useState<string[]>([]);
  const [choiceOpen, setChoiceOpen]   = useState(false);
  const [choicesLoaded, setChoicesLoaded] = useState(0);

  // Promo code, gift note, low-res warnings
  // Promo codes are validated server-side via the `validate-promo` edge function
  // (never hardcoded in client JS — they would be visible in browser DevTools).
  const [promoCode, setPromoCode]     = useState("");
  const [promoApplied, setPromoApplied] = useState<{ code: string; pct: number; label: string } | null>(null);
  const [promoOpen, setPromoOpen]     = useState(false);
  const [promoError, setPromoError]   = useState("");
  const [giftNote, setGiftNote]       = useState("");
  const [giftOpen, setGiftOpen]       = useState(false);

  // Right-panel accordion state
  const [activeCard, setActiveCard]             = useState("classic-frame");
  // Non-print products shown in the right panel only when toggled from the left column
  const [enabledExtras, setEnabledExtras]       = useState<string[]>([]);
  const [packsOpen, setPacksOpen]               = useState(false);
  const [selectedPackId, setSelectedPackId]     = useState<string | null>(null);
  const [cardSize, setCardSize]                 = useState<Record<string,string>>({});
  const [cardFrame, setCardFrame]               = useState("black");

  // ── Room View state ──
  const [roomView,        setRoomView]      = useState(false);
  const [userRoomUrl,     setUserRoomUrl]   = useState<string|null>(null);
  const [aiRoomUrl,       setAiRoomUrl]     = useState<string|null>(null);
  const [aiRoomLoading,   setAiRoomLoading] = useState(false);
  const [stagedComposites, setStagedComposites] = useState<Record<string,{url?:string;loading?:boolean}>>({});
  const [selectedRoomKey, setSelectedRoomKey] = useState<string>(STAGED_ROOMS[0].id);
  const [portraitDragPos, setPortraitDragPos] = useState({ x:45, y:12, w:26 });
  const [isDragging,      setIsDragging]    = useState(false);
  const [dragStart,       setDragStart]     = useState({ mx:0, my:0, px:0, py:0 });
  const roomContainerRef = useRef<HTMLDivElement>(null);
  const [mountColor, setMountColor]             = useState("snow-white");
  const [glazeType,  setGlazeType]              = useState<"perspex"|"moth-eye">("perspex");
  // Name overlay — pre-fill from homepage `heroName`, default to "top" when present
  const [portraitName,    setPortraitName]    = useState((session as any)?.heroName || "");
  const [namePosition,    setNamePosition]    = useState<"none"|"top"|"bottom">(
    ((session as any)?.heroName ? "top" : "none")
  );

  // Keep panel in sync if homepage `heroName` arrives/changes after mount
  useEffect(() => {
    const hn = ((session as any)?.heroName || "").trim();
    setPortraitName(prev => (prev ? prev : hn));
    setNamePosition(prev => (hn && prev === "none" ? "top" : prev));
  }, [(session as any)?.heroName]);
  const [nameFontId,      setNameFontId]      = useState("bold");
  const [nameSizeId,      setNameSizeId]      = useState("md");
  const [nameColorId,     setNameColorId]     = useState("white");
  const [nameCompositing, setNameCompositing] = useState(false);
  const [canvasFrame, setCanvasFrame]           = useState(false);
  const [canvasFrameColor, setCanvasFrameColor] = useState("black");

  // Cart drawer + extra pack line items
  const [cartOpen, setCartOpen]   = useState(false);
  const [previewsOpen, setPreviewsOpen] = useState(false);
  const [addedPacks, setAddedPacks] = useState<Array<{ id: string; packId: string; name: string; price: number; qty: number }>>([]);

  // Cart items: snapshots of configured prints the user has explicitly added.
  // Separate from workspace `items` so duplicating a photo does not auto-add it.
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [vipAdded, setVipAdded] = useState(false);
  const [pendingCart, setPendingCart] = useState<{ snapshot: any; qty: number } | null>(null);

  // Build a stable key from the configuration fields that distinguish a SKU,
  // so adding the same product twice merges into a qty bump.
  const cartKey = (it: any) =>
    [it.photoUrl, it.productType, it.size, it.sku || "", it.frameColor || "",
     it.canvasEdge || "", it.effect || "", it.border || "", it.borderColor || ""].join("|");

  const addToCart = (snapshot: any, qtyToAdd = 1) => {
    setCartItems(prev => {
      const k = cartKey(snapshot);
      const existing = prev.find(i => cartKey(i) === k);
      if (existing) {
        return prev.map(i => i === existing
          ? { ...i, qty: (i.qty || 1) + qtyToAdd }
          : i);
      }
      return [...prev, { ...snapshot, id: crypto.randomUUID(), qty: qtyToAdd }];
    });
    setCartOpen(true);
  };
  const removeCartItem = (id: string) =>
    setCartItems(prev => prev.filter(i => i.id !== id));
  const setCartItemQty = (id: string, qty: number) => {
    const q = Math.max(1, Math.min(99, qty|0));
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: q } : i));
  };
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const addPackToCart = (pk: { id: string; name: string; price: number }) => {
    setAddedPacks(prev => {
      const existing = prev.find(p => p.packId === pk.id);
      if (existing) return prev.map(p => p.packId === pk.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { id: crypto.randomUUID(), packId: pk.id, name: pk.name, price: pk.price, qty: 1 }];
    });
    setSelectedPackId(pk.id);
    setCartOpen(true);
  };
  const removePackFromCart = (id: string) => setAddedPacks(prev => prev.filter(p => p.id !== id));
  const setPackQty = (id: string, qty: number) => {
    const q = Math.max(1, Math.min(99, qty|0));
    setAddedPacks(prev => prev.map(p => p.id === id ? { ...p, qty: q } : p));
  };

  // Discount timer (welcome $20 → extended $10 → none)
  const [discountAmt, setDiscountAmt]   = useState(0);
  const [discountSec, setDiscountSec]   = useState(0);
  const [discountTier, setDiscountTier] = useState("");

  useEffect(() => {
    const LS_KEY = "ra_discount_start_v3";
    const FIFTEEN_MIN = 15 * 60 * 1000;
    const TOTAL = FIFTEEN_MIN + 24 * 60 * 60 * 1000; // 15min welcome + 24h extended
    let startTs = parseInt(localStorage.getItem(LS_KEY) || "0");
    if (!startTs) {
      startTs = Date.now();
      localStorage.setItem(LS_KEY, String(startTs));
    }
    const tick = () => {
      const elapsed = Date.now() - startTs;
      if (elapsed < FIFTEEN_MIN) {
        setDiscountAmt(20); setDiscountTier("welcome");
        setDiscountSec(Math.ceil((FIFTEEN_MIN - elapsed) / 1000));
      } else if (elapsed < TOTAL) {
        setDiscountAmt(10); setDiscountTier("extended");
        setDiscountSec(Math.ceil((TOTAL - elapsed) / 1000));
      } else {
        setDiscountAmt(0); setDiscountTier(""); setDiscountSec(0);
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const fmtCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2,"0")}m`;
    return `${String(m).padStart(2,"0")}m ${String(sec).padStart(2,"0")}s`;
  };

  // Bake name text onto portrait image using HTML5 Canvas, upload to Storage
  const composeNameOnImage = async (
    photoUrl: string,
    name: string,
    position: "top" | "bottom",
    fontId: string,
    colorId: string,
    sizeId: string = "md",
  ): Promise<string> => {
    try {
      const fontDef  = NAME_FONTS.find(f => f.id === fontId)   || NAME_FONTS[0];
      const colorDef = NAME_COLORS.find(c => c.id === colorId) || NAME_COLORS[0];
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const el = new Image();
        el.crossOrigin = "anonymous";
        el.onload  = () => res(el);
        el.onerror = () => rej(new Error("Image load failed"));
        el.src = photoUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const sizeMult = (NAME_SIZES.find(s => s.id === sizeId)?.mult) ?? 0.065;
      const fontSize = Math.round(img.naturalHeight * sizeMult);
      ctx.font      = fontDef.css(fontSize);
      ctx.fillStyle = colorDef.hex;
      ctx.textAlign = "center";
      ctx.shadowColor   = colorId === "white" || colorId === "cream"
        ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.35)";
      ctx.shadowBlur    = fontSize * 0.18;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = fontSize * 0.04;
      const x = img.naturalWidth / 2;
      const padding = img.naturalHeight * 0.055;
      const y = position === "top" ? padding + fontSize : img.naturalHeight - padding;
      ctx.fillText(name.toUpperCase(), x, y);
      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error("Canvas export failed")), "image/jpeg", 0.95)
      );
      const { supabase } = await import("@/integrations/supabase/client");
      const path = `named/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { data: upData, error: upErr } = await supabase.storage
        .from("portraits").upload(path, blob, { contentType:"image/jpeg", upsert:false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("portraits").getPublicUrl(upData.path);
      return publicUrl;
    } catch (err) {
      console.warn("Name compositing failed, using original:", err);
      return photoUrl;
    }
  };

  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoError("");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("validate-promo", {
        body: { code, subtotal },
      });
      if (error || !data?.valid) {
        setPromoError(data?.error || "That code isn't valid.");
        return;
      }
      setPromoApplied({ code: data.code, pct: data.discountPct, label: data.label });
      setPromoError("");
      setPromoOpen(false);
    } catch {
      setPromoError("Couldn't validate code. Please try again.");
    }
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
  const setFrame = (v) => updateSelected({ frame: v, offsetX: 0, offsetY: 0 });
  const setSize = (v) => updateSelected({ size: v, offsetX: 0, offsetY: 0 });
  const setEffect = (v) => updateSelected({ effect: v });
  const setBorder = (v) => updateSelected({ border: v });
  const setBorderColor = (v) => updateSelected({ borderColor: v });

  // ── Extra (non-print) product toggle: shows the card in the right panel AND
  // swaps the canvas live preview to that product.
  const EXTRA_PRODUCTS: Record<string, { size: string; sku: string }> = {
    digital: { size: "11x14", sku: "DIGITAL" },
    mug:     { size: "11oz",  sku: "GLOBAL-MUG-11OZ" },
    case:    { size: "iphone-16-pro", sku: "GLOBAL-TPC-IP16P" },
  };
  const PORTRAIT_DEFAULT = { productType: "classic-frame", size: "11x14", sku: "GLOBAL-CFPM-11x14", frameColor: "black" };
  const toggleExtraProduct = (id: string) => {
    setEnabledExtras(prev => {
      const on = prev.includes(id);
      if (on) {
        // Turning off — revert canvas to portraits
        updateSelected({ ...PORTRAIT_DEFAULT, offsetX: 0, offsetY: 0 });
        setActiveCard("classic-frame");
        return prev.filter(x => x !== id);
      }
      const cfg = EXTRA_PRODUCTS[id];
      if (cfg) {
        updateSelected({ productType: id, size: cfg.size, sku: cfg.sku, offsetX: 0, offsetY: 0 });
        setActiveCard(id);
      }
      return [...prev, id];
    });
  };
  const borderColorDef = BORDER_COLORS.find(c => c.id === borderColor) || BORDER_COLORS[0];

  const productType   = selected.productType || "classic-frame";
  const frameColor    = selected.frameColor  || "black";
  const canvasEdge    = selected.canvasEdge  || "mirror";
  const currentSizes  = SIZES_BY_PRODUCT[productType] || SIZES_BY_PRODUCT["classic-frame"];
  const sizeDef       = currentSizes.find(s => s.id === selected.size) || currentSizes[1];
  const frameColorDef = (FRAME_COLORS[productType] || []).find(c => c.id === frameColor) || (FRAME_COLORS[productType] || [])[0];
  const canvasEdgeDef = CANVAS_EDGES.find(e => e.id === canvasEdge) || CANVAS_EDGES[0];
  const frameDef      = FRAMES.find(f => f.id === toFrameId(productType, frameColor)) || FRAMES[1];
  const effectDef     = EFFECTS.find(e => e.id === effect) || EFFECTS[0];
  const borderDef     = BORDERS.find(b => b.id === border) || BORDERS[1];
  const isDigital     = productType === "digital";
  const isFramed      = productType === "classic-frame" || productType === "box-frame";
  const isCanvas      = productType === "canvas";

  // Per-item price + bundle discount based on number of images
  const itemUnitPrice = (it) => {
    if (it.productType === "vip") return 17;
    if (it.productType === "digital") return 37;
    if (it.productType === "acrylic") {
      const sizes = SIZES_BY_PRODUCT["acrylic"] || [];
      const sd = sizes.find(s => s.id === it.size) || sizes[1];
      return sd?.price || 147;
    }
    const pt = it.productType || "classic-frame";
    const sizes = SIZES_BY_PRODUCT[pt] || SIZES_BY_PRODUCT["classic-frame"];
    const sd = sizes.find(s => s.id === it.size) || sizes[1];
    const glazeAdd = (pt === "classic-frame" || pt === "box-frame")
      ? (GLAZE_OPTIONS.find(g => g.id === (it.glazeType || "perspex"))?.add || 0)
      : 0;
    return (sd?.price || 97) + glazeAdd;
  };
  const itemPrice = (it) => itemUnitPrice(it) * (it.qty || 1);
  // Strikethrough = retail price (only shown when discount is active)
  const itemListPrice = (it) => itemUnitPrice(it) * (it.qty || 1);
  const totalPhotoCount = items.reduce((sum, it) => sum + (it.qty || 1), 0);
  // Cart-derived totals (only what the user actually added to the cart)
  // VIP & digital are fixed-price — excluded from print subtotals, bundle math, and timer discount.
  const printItems             = cartItems.filter(it => it.productType !== "vip" && it.productType !== "digital");
  const cartPrintsSubtotal     = printItems.reduce((sum, it) => sum + itemPrice(it), 0);
  const cartPrintsListSubtotal = printItems.reduce((sum, it) => sum + itemListPrice(it), 0);
  // Bundle discount counts only physical print items
  const cartPhotoCount = printItems.reduce((sum, it) => sum + (it.qty || 1), 0);
  // Full cart subtotal still includes VIP/digital for the displayed Subtotal line
  const cartFullSubtotal = cartItems.reduce((sum, it) => sum + itemPrice(it), 0);
  const packsSubtotal  = addedPacks.reduce((sum, p) => sum + p.price * p.qty, 0);
  const subtotal     = cartFullSubtotal + packsSubtotal;
  const listSubtotal = cartPrintsListSubtotal
    + cartItems.filter(it => it.productType === "vip" || it.productType === "digital")
        .reduce((sum, it) => sum + itemListPrice(it), 0)
    + packsSubtotal;
  // Limited-time / welcome timer discount — applied ONCE per order (not per item),
  // against the most-expensive eligible print. VIP & digital never discounted.
  const cartPromoSave = (() => {
    if (discountAmt <= 0 || printItems.length === 0) return 0;
    const maxPrice = Math.max(...printItems.map(it => itemUnitPrice(it)));
    return Math.min(discountAmt, maxPrice);
  })();
  const cartPrintsAfterPromo = Math.max(0, cartPrintsSubtotal - cartPromoSave);
  const bundlePct    = cartPhotoCount >= 3 ? 0.15 : cartPhotoCount >= 2 ? 0.10 : 0;
  const bundleSave   = Math.round(cartPrintsAfterPromo * bundlePct);
  const promoPct     = promoApplied?.pct || 0;
  const promoSave    = Math.round((subtotal - cartPromoSave - bundleSave) * promoPct);
  const discountSave = cartPromoSave;
  const total        = Math.max(0, subtotal - bundleSave - promoSave - discountSave);

  // Live preview price for the currently-active product card (so the header TOTAL
  // pill reflects the user's selection even before they add it to the cart)
  const pendingUnitPrice = (() => {
    const cardId = activeCard;
    const hasFrameColors = cardId === "classic-frame" || cardId === "box-frame";
    const hasCanvasAddon = cardId === "canvas";
    const fullSizes   = SIZES_BY_PRODUCT[cardId] || [];
    const simpleSizes = SIMPLE_SIZES[cardId] || [];
    const bestPid = simpleSizes.find(s => s.best)?.pid;
    const sizes = fullSizes.length
      ? fullSizes.map(s => ({ id: s.id, pid: s.id, sku: s.sku, price: s.price }))
      : simpleSizes;
    const defaultSize = bestPid || sizes.find(s => s.id === "8x10")?.id || sizes[Math.floor(sizes.length/2)]?.id || sizes[0]?.id || "md";
    // Prefer the user's currently-selected size for THIS product so the header
    // TOTAL matches what they see on the live preview / order panel.
    const selectedSizeForCard =
      (selected as any).productType === cardId ? (selected as any).size : undefined;
    const existingItemOfType = items.find(it => (it as any).productType === cardId);
    const selSize     = cardSize[cardId]
      || selectedSizeForCard
      || (existingItemOfType as any)?.size
      || defaultSize;
    const snapshot: any = {
      productType: cardId,
      size: cardId === "digital" ? (selected as any).size : (sizes.find(s => s.id === selSize)?.pid || selSize),
      frameColor: hasFrameColors ? cardFrame : undefined,
      glazeType:  hasFrameColors ? glazeType : undefined,
      canvasEdge: hasCanvasAddon && canvasFrame ? "mirror" : undefined,
      qty: (selected as any).qty || 1,
    };
    const unit = itemUnitPrice(snapshot);
    const addon = hasCanvasAddon && canvasFrame ? 49 : 0;
    const gross = (unit + addon) * (snapshot.qty || 1);
    return Math.max(0, gross - (discountAmt || 0));
  })();
  const headerTotal = total > 0 ? total : pendingUnitPrice;
  const totalSavings = listSubtotal - total;
  const savingsPct   = listSubtotal > 0 ? Math.round((totalSavings / listSubtotal) * 100) : 0;
  const lowResCount  = items.filter(i => i.lowRes).length;
  const cartCount    = cartItems.reduce((s, i) => s + (i.qty || 1), 0)
                     + addedPacks.reduce((s, p) => s + p.qty, 0);


  /* ── Regenerate / Edit (acts on selected item) ── */
  const runRegenerate = async (extraPrompt) => {
    setErrorMsg("");
    setBusy(true);
    setBusyLabel(extraPrompt ? "Generating Edited Variations…" : "Generating New Variations…");
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

      // Append the new variations into the Styles panel as additional options
      const baseStyle = selected.style || styleId || "custom";
      const baseLabel = extraPrompt ? `${baseStyle} edit` : baseStyle;
      const newEntries = urls.map((u, i) => ({
        url: u,
        style: `${baseLabel} v${(session.generatedPortraits?.length || 0) + i + 1}`,
      }));
      setSession({
        generatedPortraits: [...(session.generatedPortraits || []), ...newEntries],
      });

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

    const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!ALLOWED.includes(file.type)) {
      alert("Please upload a PNG, JPEG, WebP, or GIF image.");
      return;
    }


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
    const sd = getSizeDef(item);
    const ed = EFFECTS.find(e => e.id === item.effect) || EFFECTS[0];
    const isDigitalItem = item.productType === "digital";
    const isFramedItem = item.productType === "classic-frame" || item.productType === "box-frame";
    const mountDef = MOUNT_COLORS.find(m => m.id === mountColor) || MOUNT_COLORS[0];
    const bd = isDigitalItem
      ? (BORDERS.find(b => b.id === "none") || { id:"none", label:"None", px:0 })
      : isFramedItem
        ? { id:"mount", label:"Mount", px: 22 }
        : (BORDERS.find(b => b.id === item.border) || BORDERS[1]);
    const bcd = isDigitalItem
      ? { id:"transparent", label:"None", bg:"transparent" }
      : isFramedItem
        ? { id:"mount", label: mountDef.label, bg: mountDef.color }
        : (BORDER_COLORS.find(c => c.id === item.borderColor) || BORDER_COLORS[0]);
    const isFrameless = fd.id === "frameless" || fd.id === "digital";
    const isCanvas    = fd.id === "canvas";
    const woodPad     = fd.w || 0;
    // Resolve actual selected frame color (so all 8 swatches render distinctly)
    const itemFrameColorDef = (FRAME_COLORS[item.productType] || []).find(c => c.id === item.frameColor);
    const actualWood = itemFrameColorDef?.color || fd.wood;
    const frameAspect = sd.w / sd.h;
    const photoAspect = item.photoAspect || frameAspect;
    const coverByHeight = photoAspect > frameAspect;
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
        {/* Image + inline toolbar + AI panel stay in one linked row */}
        <div style={{ display:"flex", alignItems: "flex-start", gap: aiOpen && isSelected ? 10 : 16, maxWidth:"100%", minWidth:0 }}>
          {/* Invisible spacer matching toolbar width to keep image centered */}
          <div aria-hidden="true" style={{ width: aiOpen && isSelected ? 0 : 48, flexShrink:0, visibility:"hidden" }}/>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, minWidth:0, flex:"0 1 auto" }}>
          <div style={{
            background: isCanvas
              ? "#fff"
              : isFrameless
                ? "transparent"
                // Solid frame face with subtle edge vignette (frame moulding, not gradient bg)
                : `
                    radial-gradient(ellipse at center, ${actualWood} 60%, color-mix(in srgb, ${actualWood} 85%, black) 100%),
                    ${actualWood}
                  `,
            padding: (isFrameless ? 6 : woodPad + 6),
            borderRadius: isFrameless ? 12 : 2,
            boxShadow: isFrameless
              ? "none"
              : "0 0 0 1px rgba(0,0,0,.30)",
            filter: "none",
            display: "inline-block",
            flex:"0 1 auto",
            minWidth:0,
            maxWidth: "100%",
            border: "none",
            outline: "none",
            transition: "box-shadow .3s ease",
          }}>
            <div style={{
              background: bd.px === 0 ? "transparent" : bcd.bg,
              padding: bd.px,
              display: "flex", alignItems: "center", justifyContent: "center",
              // Sharp inner rabbet — the picture sits recessed INSIDE the frame
              boxShadow: isFrameless ? "none" : `
                0 0 0 1px rgba(0,0,0,.55),
                inset 0 2px 6px rgba(0,0,0,.45),
                inset 2px 0 4px rgba(0,0,0,.30),
                inset 0 -1px 2px rgba(255,255,255,.08)
              `,
            }}>
              {(() => {
                const isDraggingThis = draggingId === item.id;
                const imgStyle: React.CSSProperties = {
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  display: "block",
                  width: coverByHeight ? "auto" : "100%",
                  height: coverByHeight ? "100%" : "auto",
                  minWidth: "100%",
                  minHeight: "100%",
                  maxWidth: "none",
                  filter: ed.filter,
                  transform: `translate(calc(-50% + ${item.offsetX || 0}px), calc(-50% + ${item.offsetY || 0}px)) rotate(${item.rotation || 0}deg) scale(${item.zoom || 1})`,
                  transformOrigin: "center center",
                  transition: isDraggingThis
                    ? "width .25s ease, height .25s ease"
                    : "width .25s ease, height .25s ease, transform .25s ease",
                  userSelect: "none",
                  pointerEvents: "none",
                };
                return (
                  <div
                    className="cz-img-wrap"
                    onMouseDown={(e) => onDragStart(item, e)}
                    style={{
                      width: `${sd.w * 42}vh`,
                      aspectRatio: `${sd.w} / ${sd.h}`,
                      maxWidth: "100%",
                      cursor: isDraggingThis ? "grabbing" : "grab",
                      overflow: isDraggingThis ? "visible" : "hidden",
                    }}
                  >
                    {/* Faded ghost of the full image — visible while dragging so user can see edges */}
                    {isDraggingThis && (
                      <img
                        src={item.photoUrl}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        style={{ ...imgStyle, opacity: 0.32, zIndex: 0, transition: "none" }}
                      />
                    )}
                    {/* Frame-clipped sharp image */}
                    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1, outline: isDraggingThis ? "2px dashed rgba(255,255,255,.9)" : "none", outlineOffset: "-1px", containerType: "inline-size" } as React.CSSProperties}>
                      <img src={item.photoUrl} alt="Your portrait"
                        draggable={false}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (!img.naturalWidth || !img.naturalHeight) return;
                          const photoAspect = img.naturalWidth / img.naturalHeight;
                          setItems(prev => prev.map(i => i.id === item.id ? { ...i, photoAspect } : i));
                        }}
                        style={imgStyle}/>
                      <div className="cz-watermark" aria-hidden="true">
                        <div className="cz-watermark-inner">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i}>REAL ART · REAL ART · REAL ART · REAL ART</div>
                          ))}
                        </div>
                      </div>
                      {/* Live name overlay */}
                      {namePosition !== "none" && portraitName && (
                        <div style={{
                          position:"absolute", left:0, right:0, zIndex:3,
                          top:    namePosition === "top"    ? "10%" : "auto",
                          bottom: namePosition === "bottom" ? "10%" : "auto",
                          textAlign:"center", pointerEvents:"none",
                        }}>
                          <span style={{
                            display:"inline-block",
                            color: NAME_COLORS.find(c=>c.id===nameColorId)?.hex || "#fff",
                            fontSize: `clamp(11px, ${NAME_SIZES.find(s=>s.id===nameSizeId)?.css || "5cqw"}, 96px)`,
                            fontFamily: nameFontId==="serif"
                              ? "Georgia,'Times New Roman',serif"
                              : "'Poppins',sans-serif",
                            fontWeight: nameFontId==="italic" ? 600 : 700,
                            fontStyle:  nameFontId==="italic" ? "italic" : "normal",
                            letterSpacing:".18em",
                            textShadow: nameColorId==="white"||nameColorId==="cream"
                              ? "0 2px 8px rgba(0,0,0,0.55)"
                              : "0 2px 8px rgba(255,255,255,0.35)",
                          }}>
                            {portraitName.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Glaze sheen — visible on Standard Perspex, removed on Moth-Eye */}
                    {isFramedItem && glazeType === "perspex" && (
                      <div aria-hidden="true" style={{
                        position:"absolute", inset:0, zIndex:4, pointerEvents:"none",
                        background:"linear-gradient(115deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 62%)",
                        mixBlendMode:"screen",
                      }}/>
                    )}
                    {itemBusy && (
                      <div className="cz-busy" style={{ zIndex: 10 }}>
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
                );
              })()}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center", color:MUTED, fontSize:12.5 }}>
            <span>{sd.label}″</span>
            <span style={{ width:3, height:3, borderRadius:"50%", background:MUTED }}/>
            <span>{fd.label}</span>
            <span style={{ width:3, height:3, borderRadius:"50%", background:MUTED }}/>
            <span>{ed.label}</span>
          </div>
          </div>
          {isSelected ? (
            <div className="cz-toolbar" role="toolbar" aria-label="Image tools"
              onClick={(e) => e.stopPropagation()}
              style={{ flexShrink:0 }}>
              <button
                className={`cz-tool ${roomView ? "on" : ""}`}
                onClick={() => { setRoomView(v => !v); setAiRoomUrl(null); }}
                data-tip={roomView ? "Live Preview" : "See In A Room"}
                aria-label="Toggle room view">
                <Home size={17}/>
              </button>
              <div className="cz-tool-divider"/>
              <span style={{ position:"relative", display:"inline-flex" }}>
                <button ref={(el) => { if (el) (window as any).__aiBtn = el; }} className={`cz-tool ${aiOpen?"on":""}`} onClick={(e) => { (window as any).__aiBtn = e.currentTarget; setAiOpen(v => !v); setMpSection("regenerate"); }} data-tip="Make It Perfect" aria-label="Make It Perfect" style={{ color: RED, background: "#FDECEC", borderRadius: 10 }}>
                  <Sparkles size={18}/>
                </button>
              </span>
              <div className="cz-tool-divider"/>
              <button
                className="cz-tool"
                onClick={() => setItems(prev => prev.map(i => i.id === item.id
                  ? { ...i, rotation: (((i.rotation || 0) + 90) % 360) }
                  : i))}
                data-tip="Rotate" aria-label="Rotate image">
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
              <button
                className="cz-tool"
                onClick={() => {
                  const dup = { ...item, id: crypto.randomUUID(), qty: 1 };
                  setItems(prev => {
                    const idx = prev.findIndex(i => i.id === item.id);
                    const next = [...prev];
                    next.splice(idx + 1, 0, dup);
                    return next;
                  });
                  setSelectedId(dup.id);
                }}
                data-tip="Duplicate Image"
                aria-label="Duplicate image"
              >
                <Copy size={17}/>
              </button>
              <button className="cz-tool" onClick={handleAddImage} disabled={busy} data-tip="Add Another Image" aria-label="Add another image">
                <Plus size={18}/>
              </button>
              <button
                className="cz-tool"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                data-tip="Delete Image"
                aria-label="Delete image"
              >
                <Trash2 size={17}/>
              </button>
            </div>
          ) : (
            <div aria-hidden="true" style={{ width:48, flexShrink:0, visibility:"hidden" }}/>
          )}
          {isSelected && aiOpen && (
            <div onClick={(e) => e.stopPropagation()}
              ref={(el) => {
                if (el) {
                  // Bring panel into view so the textarea & button aren't cut off
                  requestAnimationFrame(() => {
                    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
                  });
                }
              }}
              style={{
                width:300, flex:"0 0 300px",
                maxHeight:"min(560px, calc(100vh - 110px))", overflowY:"auto",
                background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14,
                boxShadow:"none", padding:14,
              }}>
                      {/* Regenerate */}
                      <div style={{
                        border:`1px solid ${mpSection==="regenerate" ? RED : BORDER}`, borderRadius:12,
                        padding:14, marginBottom:10, background:"#fff",
                      }}>
                        <button onClick={() => setMpSection(mpSection==="regenerate" ? "" : "regenerate")}
                          style={{ width:"100%", background:"transparent", border:"none", cursor:"pointer",
                            display:"flex", alignItems:"center", gap:12, textAlign:"left", padding:0 }}>
                          <span style={{ width:36, height:36, borderRadius:"50%",
                            background:"#FDECEC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <RefreshCw size={16} color={RED}/>
                          </span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:14, fontWeight:700, color:INK,
                                fontFamily:"'Poppins',sans-serif" }}>Regenerate</span>
                              <span style={{ fontSize:9, fontWeight:700, color:RED,
                                background:"#FDECEC", padding:"2px 6px", borderRadius:6,
                                letterSpacing:".08em", textTransform:"uppercase" }}>New Take</span>
                            </div>
                            <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>
                              Get a fresh version in the same style.
                            </div>
                          </div>
                        </button>
                        {mpSection === "regenerate" && (
                          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                            <div style={{ fontSize:12, color:INK, marginBottom:12, lineHeight:1.5 }}>
                              Not quite right? Generate a brand new version of this portrait — same style, fresh result.
                            </div>
                            <button
                              disabled={busy}
                              onClick={() => {
                                setAiOpen(false);
                                setMpSection("regenerate");
                                handleRetry();
                              }}
                              style={{
                                width:"100%", padding:"12px 0",
                                background:RED, color:"#fff", border:"none", borderRadius:10,
                                fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
                                cursor: busy ? "wait" : "pointer",
                                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                                opacity: busy ? .5 : 1,
                              }}>
                              <RefreshCw size={14}/> {busy ? "Regenerating…" : "Regenerate Now"}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* AI quick fix */}
                      <div style={{
                        border:`1px solid ${mpSection==="ai" ? RED : BORDER}`, borderRadius:12,
                        padding:14, marginBottom:10, background:"#fff",
                      }}>
                        <button onClick={() => setMpSection(mpSection==="ai" ? "" : "ai")}
                          style={{ width:"100%", background:"transparent", border:"none", cursor:"pointer",
                            display:"flex", alignItems:"center", gap:12, textAlign:"left", padding:0 }}>
                          <span style={{ width:36, height:36, borderRadius:"50%",
                            background:"#FDECEC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Sparkles size={16} color={RED}/>
                          </span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:14, fontWeight:700, color:INK,
                                fontFamily:"'Poppins',sans-serif" }}>AI Quick Fix</span>
                              <span style={{ fontSize:9, fontWeight:700, color:RED,
                                background:"#FDECEC", padding:"2px 6px", borderRadius:6,
                                letterSpacing:".08em", textTransform:"uppercase" }}>Instant</span>
                            </div>
                            <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>
                              See changes instantly — before you order.
                            </div>
                          </div>
                        </button>
                        {mpSection === "ai" && (
                          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                            <div style={{ fontSize:12, color:INK, marginBottom:10, lineHeight:1.5 }}>
                              Best for small tweaks: 'add a red bandana', 'change background to forest', 'bigger smile'. You'll see the new preview right away.
                            </div>
                            <textarea
                              value={aiInput}
                              onChange={(e) => setAiInput(e.target.value)}
                              placeholder="Describe the change you want…"
                              disabled={busy}
                              style={{
                                width:"100%", minHeight:80, padding:"10px 12px",
                                border:`1px solid ${BORDER}`, borderRadius:10,
                                fontFamily:"'Poppins',sans-serif", fontSize:13, color:INK,
                                resize:"vertical", outline:"none", background:"#fff",
                              }}/>
                            <button
                              disabled={busy || !aiInput.trim()}
                              onClick={() => {
                                const p = aiInput.trim();
                                setAiInput("");
                                setAiOpen(false);
                                setMpSection("");
                                runRegenerate(p);
                              }}
                              style={{
                                width:"100%", marginTop:10, padding:"12px 0",
                                background:RED, color:"#fff", border:"none", borderRadius:10,
                                fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
                                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                                opacity: (busy || !aiInput.trim()) ? .5 : 1,
                              }}>
                              <Sparkles size={14}/> Try With AI
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Concierge Touch-Up */}
                      <div style={{
                        border:`1px solid ${mpSection==="concierge" ? RED : BORDER}`, borderRadius:12,
                        padding:14, background:"#fff",
                      }}>
                        <button onClick={() => setMpSection(mpSection==="concierge" ? "" : "concierge")}
                          style={{ width:"100%", background:"transparent", border:"none", cursor:"pointer",
                            display:"flex", alignItems:"center", gap:12, textAlign:"left", padding:0 }}>
                          <span style={{ width:36, height:36, borderRadius:"50%",
                            background:"#FDECEC", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Wand2 size={16} color={RED}/>
                          </span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:14, fontWeight:700, color:INK,
                              fontFamily:"'Poppins',sans-serif" }}>Concierge Touch-Up</div>
                            <div style={{ fontSize:12, color:MUTED, marginTop:2 }}>
                              For complex edits — applied after you order.
                            </div>
                          </div>
                        </button>
                        {mpSection === "concierge" && (
                          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                            <div style={{ fontSize:12, color:INK, marginBottom:10, lineHeight:1.5 }}>
                              Choose this when AI Quick Fix can't get it right. A real artist refines eyes, fur, expressions, and likeness after checkout — unlimited revisions until you love it.
                            </div>
                            <textarea
                              value={conciergeNote}
                              onChange={(e) => setConciergeNote(e.target.value)}
                              placeholder="Tell our artist what to fix — be as specific as you like…"
                              style={{
                                width:"100%", minHeight:90, padding:"10px 12px",
                                border:`1px solid ${BORDER}`, borderRadius:10,
                                fontFamily:"'Poppins',sans-serif", fontSize:13, color:INK,
                                resize:"vertical", outline:"none", background:"#FAF7F2",
                              }}/>
                            <button
                              disabled={!conciergeNote.trim()}
                              onClick={() => {
                                try { localStorage.setItem(`concierge_note_${selected.id}`, conciergeNote.trim()); } catch {}
                                updateSelected({ conciergeNote: conciergeNote.trim() } as any);
                                setAiOpen(false);
                                setMpSection("");
                              }}
                              style={{
                                width:"100%", marginTop:10, padding:"12px 0",
                                background:RED, color:"#fff", border:"none", borderRadius:10,
                                fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
                                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                                opacity: !conciergeNote.trim() ? .5 : 1,
                              }}>
                              <Wand2 size={14}/> Save Notes For Artist
                            </button>
                            <div style={{ fontSize:11, color:MUTED, marginTop:8, textAlign:"center", lineHeight:1.5 }}>
                              <div>Free With Every Order</div>
                              <div>Applied After Checkout</div>
                            </div>
                          </div>
                        )}
                      </div>
            </div>
          )}
        </div>
      </div>
    );
  };



  // Build Stripe line items from current cart and redirect to Checkout
  const checkoutCart = async () => {
    if (cartCount === 0) return;
    setCheckingOut(true);
    setCheckoutError("");
    try {
      const lineItems: any[] = [];
      // Prints
      cartItems.forEach((it) => {
        const unit = itemUnitPrice(it);
        const ptLabel =
          it.productType === "vip"           ? "Portrait VIP Package" :
          it.productType === "digital"       ? "Digital Portrait" :
          it.productType === "print"         ? "Fine Art Print" :
          it.productType === "acrylic"       ? "Acrylic Glass" :
          it.productType === "canvas"        ? "Canvas Print" :
          it.productType === "box-frame"     ? "Box Frame" :
                                                "Classic Frame";
        const sizes = SIZES_BY_PRODUCT[it.productType] || SIZES_BY_PRODUCT["classic-frame"];
        const sd = sizes.find((s) => s.id === it.size);
        const desc = it.productType === "digital"
          ? "High-resolution digital download"
          : `${sd?.label || it.size}${it.frameColor ? " · " + it.frameColor : ""}`;
        lineItems.push({
          name: ptLabel,
          description: desc,
          unitAmount: Math.round(unit * 100),
          quantity: it.qty || 1,
          image: it.photoUrl?.startsWith("http") ? it.photoUrl : undefined,
        });
      });
      // Packs
      addedPacks.forEach((p) => {
        lineItems.push({
          name: p.name,
          description: "Style & masterpiece pack",
          unitAmount: Math.round(p.price * 100),
          quantity: p.qty,
        });
      });
      // Bundle / promo / discount as a single "Discount" negative? Stripe price_data
      // doesn't allow negatives — instead apply pro-rata to unit amounts.
      const rawSum = lineItems.reduce((s, li) => s + li.unitAmount * li.quantity, 0);
      const targetSum = total * 100;
      if (rawSum > 0 && targetSum < rawSum) {
        const ratio = targetSum / rawSum;
        lineItems.forEach((li) => {
          li.unitAmount = Math.max(50, Math.round(li.unitAmount * ratio));
        });
      }

      const primaryCartItem = cartItems[0];

      // Persist for downstream pages (preserve existing session like orderId)
      setSession((prev: any) => ({
        ...(prev || {}),
        customizationItems: items,
        cart: { items: cartItems, packs: addedPacks, total },
        customization: {
          ...((prev && prev.customization) || {}),
          portraitUrl: primaryCartItem?.photoUrl || items[0]?.photoUrl || "",
          productType: primaryCartItem?.productType || "",
          sku:         primaryCartItem?.sku || "",
          frameColor:  primaryCartItem?.frameColor || "",
          canvasEdge:  primaryCartItem?.canvasEdge || "",
        },
        printSku: primaryCartItem?.sku || "",
      }));

      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          lineItems,
          sessionId: (session as any).orderId || (session as any).sessionDbId || null,
          portraitUrl: primaryCartItem?.photoUrl || items[0]?.photoUrl || "",
          // Pass print fulfillment details so verify-payment can trigger Prodigi
          printSku:   primaryCartItem?.sku || "",
          productType: primaryCartItem?.productType || "",
          printFrame: primaryCartItem?.frameColor || primaryCartItem?.canvasEdge || "",
          printMount: mountColor || "snow-white",
          printGlaze: primaryCartItem?.glazeType || "perspex",
          vipPurchased: cartItems.some((i: any) => i.productType === "vip"),
        },
      });
      if (error) throw new Error(error.message || "Checkout failed");
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err?.message || "Couldn't start checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <div className="cz-root">
      <style>{G}</style>

      {/* Announcement strip — discount countdown */}
      {discountAmt > 0 && (
        <div style={{
          background:"#E61919", borderBottom:"1px solid #B91C1C",
          padding:"8px 22px", position:"sticky", top:0, zIndex:30,
          textAlign:"center",
        }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>
            {discountTier === "welcome" ? "Welcome Discount" : "Limited Discount"}: ${discountAmt} OFF
          </span>
          <span style={{ fontSize:12, color:"#FFE4E6", marginLeft:6 }}>
            — Expires When The Timer Hits Zero
          </span>
          <span style={{
            display:"inline-block", marginLeft:10, verticalAlign:"middle",
            background:"#fff", color:"#E61919", fontSize:12, fontWeight:700,
            padding:"4px 10px", borderRadius:6, fontFamily:"'Courier New',monospace",
          }}>{fmtCountdown(discountSec)}</span>
        </div>
      )}

      {/* Header */}
      <SiteHeader
        current="customize"
        onBack={() => navigate("/")}
        total={headerTotal}
        showPreviews
        onPreviews={() => setPreviewsOpen(true)}
        showCart
        onCart={() => setCartOpen(true)}
        cartCount={cartCount}
        topOffset={discountAmt > 0 ? 38 : 0}
      />

      {/* Three-column layout */}
      <div className="cz-grid" style={{
        display:"grid",
        gridTemplateColumns: aiOpen ? "64px 1fr 400px" : "320px 1fr 400px",
        gap:0, maxWidth:1500, margin:"0 auto",
      }}>
        {/* Customize controls (left) */}
        <aside className="cz-side" style={{
          padding: aiOpen ? "24px 8px" : "24px 10px 24px 18px",
          position:"sticky", top:70, alignSelf:"start",
          height: aiOpen ? "calc(100vh - 70px)" : undefined,
          maxHeight:"calc(100vh - 70px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:14,
          justifyContent: aiOpen ? "center" : "flex-start",
        }}>
          {aiOpen ? (
            <button onClick={() => setAiOpen(false)} aria-label="Expand customize panel" title="Expand customize panel" style={{
              width:48, minHeight:132, border:`1px solid ${BORDER}`, borderRadius:16, background:"#fff",
              cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
              color:INK, fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:10.5, letterSpacing:".12em", textTransform:"uppercase",
            }}>
              <SlidersHorizontal size={18} color={RED}/>
              <span style={{ writingMode:"vertical-rl", transform:"rotate(180deg)" }}>Customize</span>
            </button>
          ) : (
          <>
          {/* ── Variants ── */}
          {(session.generatedPortraits?.length || 0) > 1 && (
            <div className="cz-section">
              <div className="cz-label"><span>Styles</span><span className="cz-value">{session.generatedPortraits.length} Styles</span></div>
              <div style={{
                display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10,
                maxHeight: session.generatedPortraits.length > 6 ? 280 : "none",
                overflowY: session.generatedPortraits.length > 6 ? "auto" : "visible",
                paddingRight: session.generatedPortraits.length > 6 ? 6 : 0,
              }}>
                {session.generatedPortraits.map((p, idx) => {
                  const active = selected.photoUrl === p.url;
                  const inCart = cartItems.some(ci => ci.photoUrl === p.url);
                  return (
                    <div key={p.url + idx} style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"center" }}>
                      <button
                        onClick={() => {
                          const existing = items.find(i => i.photoUrl === p.url);
                          if (existing) {
                            setSelectedId(existing.id);
                            return;
                          }
                          const newItem = makeItem({
                            photoUrl: p.url,
                            style: p.style,
                            frame: selected.frame,
                            size: selected.size,
                            effect: selected.effect,
                            border: selected.border,
                            borderColor: selected.borderColor,
                            productType: (selected as any).productType,
                            sku: (selected as any).sku,
                          } as any);
                          setItems(prev => [...prev, newItem]);
                          setSelectedId(newItem.id);
                        }}
                        title={p.style}
                        style={{
                          width:"100%", aspectRatio:"1 / 1", padding:0, borderRadius:8, overflow:"hidden",
                          border: active ? `2px solid ${RED}` : `1px solid ${BORDER}`,
                          background:"#fff", cursor:"pointer",
                        }}
                      >
                        <img src={p.url} alt={p.style}
                          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const snapshot = {
                            ...selected,
                            photoUrl: p.url,
                            style: p.style,
                            photoAspect: undefined,
                            offsetX: 0,
                            offsetY: 0,
                            qty: 1,
                          };
                          addToCart(snapshot, 1);
                        }}
                        title={inCart ? "Already in cart — add another" : "Add this variant to cart"}
                        style={{
                          width:"100%", padding:"5px 0", borderRadius:6,
                          border:"none", cursor:"pointer",
                          background: inCart ? "#16a34a" : RED, color:"#fff",
                          fontSize:10.5, fontWeight:700, fontFamily:"'Poppins',sans-serif",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:3,
                        }}
                      >
                        {inCart ? <><Check size={10}/> Added</> : <><Plus size={10}/> Cart</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Name / Text Overlay ── */}
          <div className="cz-section">
            <div className="cz-label">
              <span>Name</span>
              <span className="cz-value" style={{ color:namePosition==="none"?MUTED:INK }}>
                {namePosition === "none" ? "None" : portraitName || "Add a name"}
              </span>
            </div>
            <input
              type="text"
              value={portraitName}
              onChange={e => {
                setPortraitName(e.target.value.slice(0, 20));
                if (e.target.value && namePosition === "none") setNamePosition("bottom");
              }}
              placeholder={`e.g. ${({
                pets:     "BARLEY, MILO, SOPHIE",
                babies:   "OLIVIA, NOAH, EMMA",
                couples:  "SARAH & JAMES, EMMA & LIAM",
                people:   "THE SMITHS, JOHN, MARIA",
                memorial: "IN LOVING MEMORY, GRANDMA ROSE",
                gifts:    "MOM, DAD, BEST FRIEND",
              } as Record<string,string>)[session.cat] || "BARLEY, MILO, SOPHIE"}`}
              maxLength={20}
              style={{
                width:"100%", padding:"10px 12px", borderRadius:8, marginBottom:10,
                border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif",
                fontSize:13, color:INK, outline:"none", background:"#fff",
              }}
            />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:12 }}>
              {NAME_POSITIONS.map(pos => (
                <button key={pos.id}
                  className={`cz-chip ${namePosition===pos.id?"on":""}`}
                  style={{ justifyContent:"center", padding:"8px 4px", whiteSpace:"nowrap" }}
                  onClick={() => setNamePosition(pos.id as any)}>
                  {pos.label}
                </button>
              ))}
            </div>
            {namePosition !== "none" && portraitName && (
              <>
                <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                  {NAME_FONTS.map(f => (
                    <button key={f.id}
                      onClick={() => setNameFontId(f.id)}
                      style={{
                        flex:1, padding:"7px 4px", borderRadius:8, cursor:"pointer",
                        border:`1.5px solid ${nameFontId===f.id?RED:BORDER}`,
                        background:nameFontId===f.id?"rgba(230,25,25,.05)":"#fff",
                        fontSize:11, color:nameFontId===f.id?RED:MUTED,
                        fontFamily: f.id==="serif" ? "Georgia,serif" : "'Poppins',sans-serif",
                        fontStyle:  f.id==="italic" ? "italic" : "normal",
                        fontWeight: f.id==="bold" ? 700 : 500,
                      }}>
                      {f.label}
                    </button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                  {NAME_SIZES.map(s => (
                    <button key={s.id}
                      onClick={() => setNameSizeId(s.id)}
                      style={{
                        flex:1, padding:"7px 4px", borderRadius:8, cursor:"pointer",
                        border:`1.5px solid ${nameSizeId===s.id?RED:BORDER}`,
                        background:nameSizeId===s.id?"rgba(230,25,25,.05)":"#fff",
                        fontSize:11, fontWeight:700,
                        color:nameSizeId===s.id?RED:MUTED,
                        fontFamily:"'Poppins',sans-serif",
                      }}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8, paddingTop:6 }}>
                  {NAME_COLORS.map(c => (
                    <button key={c.id} title={c.label}
                      onClick={() => setNameColorId(c.id)}
                      style={{
                        width:30, height:30, borderRadius:8,
                        background:c.hex, cursor:"pointer", border:"none",
                        outline: nameColorId===c.id ? `3px solid ${RED}` : `2px solid rgba(0,0,0,0.12)`,
                        outlineOffset: nameColorId===c.id ? 2 : 0,
                        boxShadow: "0 1px 4px rgba(0,0,0,.15)",
                        transition:"outline .15s",
                      }}/>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="cz-section">
            <div className="cz-label"><span>Effect</span><span className="cz-value">{effectDef.label}</span></div>
            <div style={{ position:"relative" }}>
              <button
                type="button"
                aria-label="Scroll effects left"
                onClick={(e) => {
                  const scroller = (e.currentTarget.parentElement?.querySelector(".cz-size-scroll") as HTMLElement | null);
                  scroller?.scrollBy({ left: -160, behavior: "smooth" });
                }}
                style={{
                  position:"absolute", left:-4, top:"42%", transform:"translateY(-50%)",
                  zIndex:2, width:26, height:26, borderRadius:"50%",
                  background:"#fff", border:`1px solid ${BORDER}`,
                  boxShadow:"0 2px 8px rgba(0,0,0,.08)", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                }}>
                <ChevronLeft size={14} color={INK}/>
              </button>
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
              <button
                type="button"
                aria-label="Scroll effects right"
                onClick={(e) => {
                  const scroller = (e.currentTarget.parentElement?.querySelector(".cz-size-scroll") as HTMLElement | null);
                  scroller?.scrollBy({ left: 160, behavior: "smooth" });
                }}
                style={{
                  position:"absolute", right:-4, top:"42%", transform:"translateY(-50%)",
                  zIndex:2, width:26, height:26, borderRadius:"50%",
                  background:"#fff", border:`1px solid ${BORDER}`,
                  boxShadow:"0 2px 8px rgba(0,0,0,.08)", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                }}>
                <ChevronRight size={14} color={INK}/>
              </button>
            </div>
          </div>

          {/* Mat / Border — only for unframed products */}
          {(productType === "print" || productType === "canvas") && (
          <div className="cz-section">
            <div className="cz-label"><span>Mat</span><span className="cz-value">{borderDef.label}</span></div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0, 1fr))", gap:6, marginBottom:14 }}>
              {BORDERS.map(b => (
                <button key={b.id} className={`cz-chip ${border===b.id?"on":""}`}
                  style={{ width:"100%", minWidth:0, justifyContent:"center", padding:"9px 8px", whiteSpace:"nowrap" }}
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
          )}
          </>
          )}
        </aside>

        {/* Preview (middle) — gallery wall ambience */}
        <div className="cz-stage cz-fade" style={{
          padding:"0 24px 24px",
          minHeight:"calc(100vh - 70px)",
          maxHeight:"calc(100vh - 70px)",
          display:"flex", flexDirection:"column", alignItems:"center",
          gap:16,
          background:"#F5EEDF",
          overflow:"hidden",
          position:"relative",
        }}>
          {/* subtle wall noise/texture overlay */}
          <div aria-hidden style={{
            position:"absolute", inset:0, pointerEvents:"none", zIndex:0, opacity:.35,
            backgroundImage:"radial-gradient(rgba(0,0,0,.05) 1px, transparent 1px)",
            backgroundSize:"3px 3px",
            mixBlendMode:"multiply",
          }}/>
          {roomView ? (
            <div style={{ flex:"1 1 auto", width:"100%", minHeight:0,
              display:"flex", padding:"16px 16px 24px" }}>
              <RoomViewPanel
                portraitUrl={(selected as any).photoUrl || ""}
                frameColor={cardFrame || "black"}
                productType={activeCard}
                selected={selected}
                userRoomUrl={userRoomUrl} setUserRoomUrl={setUserRoomUrl}
                aiRoomUrl={aiRoomUrl} setAiRoomUrl={setAiRoomUrl}
                aiRoomLoading={aiRoomLoading} setAiRoomLoading={setAiRoomLoading}
                stagedComposites={stagedComposites} setStagedComposites={setStagedComposites}
                selectedRoomKey={selectedRoomKey} setSelectedRoomKey={setSelectedRoomKey}
                portraitDragPos={portraitDragPos} setPortraitDragPos={setPortraitDragPos}
                isDragging={isDragging} setIsDragging={setIsDragging}
                dragStart={dragStart} setDragStart={setDragStart}
                roomContainerRef={roomContainerRef}
                setRoomView={setRoomView}
              />
            </div>
          ) : (
            <>
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
              display:"flex", alignItems:"center",
              justifyContent: aiOpen ? "flex-start" : "center",
              gap:16, width:"100%", maxWidth:"100%", flex:"1 1 auto", minHeight:0,
              paddingLeft: aiOpen ? 8 : 0,
            }}>
              <div className="cz-canvas-scroll" style={{
                flex:"1 1 auto", width:"100%", minWidth:0, maxHeight:"100%", height:"100%",
                overflowY:"auto", display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"flex-start", gap:8,
                padding:"20px 60px 60px 20px",
                scrollBehavior:"smooth", scrollSnapType:"y proximity",
                WebkitOverflowScrolling:"touch", overscrollBehavior:"contain",
              }}>
                {items.map(it => renderItem(it, it.id === selectedId, it.id === selectedId))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                style={{ display:"none" }}
                onChange={handleFilePicked}
              />
            </div>
            </>
          )}
          {/* Variants moved to left panel */}
        </div>

        {/* Cart + pricing (right) */}
        <aside className="cz-side" style={{
          padding: aiOpen ? "24px 10px 24px 6px" : "24px 24px 24px 12px",
          position:"sticky", top:70, alignSelf:"start",
          maxHeight:"calc(100vh - 70px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:14,
          width: aiOpen ? 360 : "auto",
        }}>
          {/* Choose Your Print — accordion product cards */}

          <div>
            <h3 style={{ fontSize:18, fontWeight:800, color:INK,
              fontFamily:"'Poppins',sans-serif", margin:"0 0 8px" }}>
              Choose Your Print
            </h3>
            {discountAmt > 0 && (
              <div style={{ fontSize:11.5, color:MUTED, fontWeight:600,
                fontFamily:"'Poppins',sans-serif", letterSpacing:".02em",
                margin:"0 0 14px", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                Discount Automatically Applied:
                <span style={{ color:RED, fontWeight:800,
                  fontFamily:"'Courier New',monospace" }}>{fmtCountdown(discountSec)}</span>
              </div>
            )}
            {[
              { id:"digital", label:"Digital Only", sub:"Instant download.", badge:null,
                features:["All 6 portrait styles, hi-res files","Instant download, no waiting","Print-ready — use any local print shop"],
                delivery:"Instant" },
              { id:"print", label:"Art Print", sub:"Ships rolled, unframed.", badge:null,
                features:["Premium 230gsm archival paper, fade-resistant","Vivid colors, sunlight resistant","Ships rolled in a protective tube","Hi-res digital download included"],
                delivery:"5–7 Business Days" },
              { id:"classic-frame", label:"Framed Print", sub:"Ready to hang, 8 frame colors.", badge:"Most Popular",
                features:[`Museum-grade cotton art paper · ${MOUNT_COLORS.find(m => m.id === mountColor)?.label ?? "Snow White"} mount`,"Hand-finished solid frame, conservation-grade mount","Ready to hang — arrives fully assembled","Hi-res digital download included"],
                delivery:"5–9 Business Days", frameColors:true },
              { id:"canvas", label:"Canvas Print", sub:"Ready to hang.", badge:null,
                features:["Fine-textured canvas, vivid detail & color","Archival inks, UV-protected, fade-resistant","Stretched over solid pine wood frame","Ready to hang — mounting hardware included","Hi-res digital download included"],
                delivery:"4–7 Business Days", canvasAddon:true },
              { id:"acrylic", label:"Acrylic Glass", sub:"Frameless · face-mounted · luminous.", badge:"Premium",
                features:[
                  "12-colour Giclée print on 10mm high-gloss acrylic",
                  "Crystal clear diamond-polished edges",
                  "Shatter, scratch and fade resistant",
                  "100+ year colour guarantee",
                  "Invisible floating subframe — arrives ready to hang",
                  "Hi-res digital download included",
                ],
                delivery:"7–9 Business Days · Global shipping" },
            ].map((card:any) => {
              const isActive = activeCard === card.id;
              const fullSizes = SIZES_BY_PRODUCT[card.id] || [];
              const simpleSizes = SIMPLE_SIZES[card.id] || [];
              const bestPid = simpleSizes.find(s => s.best)?.pid;
              const sizes = fullSizes.length ? fullSizes.map(s => ({
                id: s.id, pid: s.id, label: s.sub || s.label, dim: s.label,
                sku: s.sku, price: s.price, w: s.w, h: s.h,
                best: s.id === bestPid,
              })) : simpleSizes;
              const defaultSize = bestPid || sizes.find(s => s.id === "8x10")?.id || sizes[Math.floor(sizes.length/2)]?.id || sizes[0]?.id || "md";
              const selectedSizeForCard = (selected as any).productType === card.id
                ? (selected as any).size
                : undefined;
              const existingItemOfType = items.find(it => (it as any).productType === card.id);
              const selSize = cardSize[card.id]
                || selectedSizeForCard
                || (existingItemOfType as any)?.size
                || defaultSize;
              const cardSizeDef = sizes.find(s => s.id === selSize) || sizes[0];
              const basePrice = card.id === "digital" ? 37 : (cardSizeDef?.price || 0);
              const frameAdd = card.canvasAddon && canvasFrame ? 49 : 0;
              const cardDiscount = Math.min(discountAmt, basePrice + frameAdd);
              const price = basePrice + frameAdd - cardDiscount;
              const origPrice = basePrice;
              const digitalOrig = 37;
              const digitalPrice = Math.max(0, 37 - discountAmt);

              return (
                 <div key={card.id} style={{
                   border:`1px solid ${isActive ? INK : BORDER}`,
                   borderRadius:14, marginBottom:18,
                   transition:"border-color .15s", background:"#fff",
                   position:"relative",
                 }}>
                   {card.badge && (
                     <span style={{
                       position:"absolute", top:-9, left:12, zIndex:1,
                       fontSize:9, fontWeight:700, background:RED,
                       color:"#fff", padding:"3px 8px", borderRadius:20,
                       letterSpacing:".08em", textTransform:"uppercase",
                       fontFamily:"'Poppins',sans-serif",
                     }}>{card.badge}</span>
                   )}
                  <button
                    onClick={() => setActiveCard(isActive ? "" : card.id)}
                    style={{ width:"100%", display:"flex", alignItems:"center",
                      justifyContent:"space-between", padding:"14px 16px",
                      background: "#fff",
                      border:"none", cursor:"pointer", gap:8, borderRadius:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8,
                      flex:1, minWidth:0, textAlign:"left" }}>

                      <div style={{ minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:INK,
                          fontFamily:"'Poppins',sans-serif" }}>{card.label}</div>
                        <div style={{ fontSize:11.5, color:MUTED }}>{card.sub}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                      {!isActive && (
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:13, color:MUTED, marginRight:2 }}>from</span>
                            {discountAmt > 0 && (
                              <span style={{ fontSize:11, color:MUTED, textDecoration:"line-through" }}>
                                ${card.id==="digital" ? digitalOrig : origPrice}
                              </span>
                            )}
                            <span style={{ fontSize:15, fontWeight:800, color:RED, fontFamily:"'Poppins',sans-serif" }}>
                              ${card.id==="digital" ? digitalPrice : price}
                            </span>
                          </div>
                        </div>
                      )}
                       <ChevronDown size={15} color={isActive?INK:MUTED}
                         style={{ transform:isActive?"rotate(180deg)":"rotate(0)",
                           transition:"transform .2s", flexShrink:0 }}/>
                    </div>
                  </button>

                  {isActive && (
                    <div style={{ padding:"4px 16px 16px" }}>
                      {/* ── Your Order mini list ── */}
                      <div style={{ fontSize:11, color:MUTED, fontWeight:600,
                        letterSpacing:".06em", textTransform:"uppercase", margin:"6px 0 8px" }}>
                        Your Order ({totalPhotoCount} {totalPhotoCount === 1 ? "Photo" : "Photos"})
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
                        {items.map((it, idx) => {
                          const sd = getSizeDef(it);
                          const fd = FRAMES.find(f => f.id === it.frame) || FRAMES[1];
                          const ed = EFFECTS.find(e => e.id === it.effect) || EFFECTS[0];
                          const bd = BORDERS.find(b => b.id === it.border) || BORDERS[1];
                          const bcd = BORDER_COLORS.find(c => c.id === it.borderColor) || BORDER_COLORS[0];
                          const isFrameless = fd.id === "frameless" || fd.id === "digital";
                          const isCanvasItem = fd.id === "canvas";
                          const woodPad = (fd.w || 0) * 0.3;
                          const thumb = 44;
                          const imgW = sd.w >= sd.h ? thumb : thumb * (sd.w / sd.h);
                          const imgH = sd.h >= sd.w ? thumb : thumb * (sd.h / sd.w);
                          const unitPrice = itemUnitPrice(it);
                          const qty = it.qty || 1;
                          const listP = unitPrice * qty;
                          const maxPrintPrice = printItems.length > 0
                            ? Math.max(...printItems.map(x => itemUnitPrice(x)))
                            : 0;
                          const itemGetsDiscount = discountAmt > 0
                            && it.productType !== "vip"
                            && it.productType !== "digital"
                            && itemUnitPrice(it) >= maxPrintPrice;
                          const unitDisc = itemGetsDiscount ? Math.max(0, unitPrice - discountAmt) : unitPrice;
                          const lineP = unitDisc * qty;
                          const isSel = it.id === selectedId;
                          return (
                            <div key={it.id} onClick={() => setSelectedId(it.id)} style={{
                              display:"flex", gap:10, padding:8, borderRadius:9,
                              border: isSel ? `1.5px solid ${RED}` : `1px solid ${BORDER}`,
                              background:"#fff", cursor:"pointer", position:"relative",
                            }}>
                              <div style={{
                                width:62, minWidth:62, display:"flex", alignItems:"center", justifyContent:"center",
                                background:BG, borderRadius:5, padding:5,
                              }}>
                                <div style={{
                                  background: isCanvasItem ? "#fff" : (isFrameless ? "transparent" : fd.wood),
                                  padding: isFrameless ? 0 : woodPad, display:"inline-block",
                                }}>
                                  <div style={{ background: bcd.bg, padding: bd.px * 0.25, display:"flex" }}>
                                    <img src={it.photoUrl} alt="" style={{
                                      width: imgW, height: imgH, objectFit:"cover", display:"block", filter: ed.filter,
                                    }}/>
                                  </div>
                                </div>
                              </div>
                              <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", justifyContent:"center", gap:2 }}>
                                <div style={{ fontSize:12, fontWeight:600, color:INK }}>Portrait #{idx + 1}</div>
                                <div style={{ fontSize:10.5, color:MUTED, lineHeight:1.4 }}>
                                  {sd.label}″ · {fd.label}
                                </div>
                                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6, marginTop:3 }}>
                                  <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
                                    {itemGetsDiscount && lineP < listP && (
                                      <span style={{ fontSize:10, color:MUTED, textDecoration:"line-through" }}>${listP}</span>
                                    )}
                                    <span style={{ fontSize:12, fontWeight:700, color:RED }}>${lineP}</span>
                                  </div>
                                  <div onClick={(e) => e.stopPropagation()} style={{
                                    display:"inline-flex", alignItems:"center",
                                    border:`1px solid ${BORDER}`, borderRadius:6, background:"#fff",
                                  }}>
                                    <button onClick={(e) => { e.stopPropagation(); setItemQty(it.id, qty - 1); }}
                                      disabled={qty <= 1} aria-label="Decrease"
                                      style={{ width:20, height:20, border:"none", background:"transparent",
                                        cursor: qty <= 1 ? "not-allowed" : "pointer",
                                        opacity: qty <= 1 ? .35 : 1, color:INK, fontSize:12, fontWeight:600,
                                        display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                                    <span style={{ minWidth:16, textAlign:"center", fontSize:11, fontWeight:600, color:INK }}>{qty}</span>
                                    <button onClick={(e) => { e.stopPropagation(); setItemQty(it.id, qty + 1); }}
                                      aria-label="Increase"
                                      style={{ width:20, height:20, border:"none", background:"transparent",
                                        cursor:"pointer", color:INK, fontSize:12, fontWeight:600,
                                        display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                                  </div>
                                </div>
                              </div>
                              {items.length > 1 && (
                                <button onClick={(e) => { e.stopPropagation(); removeItem(it.id); }}
                                  aria-label="Remove"
                                  style={{ position:"absolute", top:4, right:4, width:18, height:18,
                                    borderRadius:"50%", background:"transparent", border:"none", color:MUTED,
                                    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                  <X size={12}/>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {card.id !== "digital" && (
                        <details className="cz-acc" open>
                          <summary>
                            <span>{card.id === "case" ? "Choose Your Phone" : "Size"}</span>
                            <span className="cz-acc-val">{cardSizeDef?.dim || cardSizeDef?.label || ""}</span>
                            <ChevronDown className="cz-acc-chev" size={15}/>
                          </summary>
                          <div className="cz-acc-body">
                          <div style={{ position:"relative", marginBottom:12 }}>
                            {sizes.length > 3 && (
                              <button
                                type="button"
                                aria-label="Scroll sizes left"
                                onClick={(e) => {
                                  const sc = e.currentTarget.parentElement?.querySelector("[data-size-scroll]") as HTMLElement | null;
                                  sc?.scrollBy({ left: -160, behavior: "smooth" });
                                }}
                                style={{
                                  position:"absolute", left:-6, top:"50%", transform:"translateY(-50%)",
                                  zIndex:2, width:26, height:26, borderRadius:"50%",
                                  background:"#fff", border:`1px solid ${BORDER}`,
                                  boxShadow:"0 2px 8px rgba(0,0,0,.08)", cursor:"pointer",
                                  display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                                }}>
                                <ChevronLeft size={14} color={INK}/>
                              </button>
                            )}
                          <div data-size-scroll style={{
                            display:"flex", gap:8,
                            overflowX:"auto", paddingTop:14, paddingBottom:6,
                            scrollSnapType:"x mandatory",
                            WebkitOverflowScrolling:"touch",
                            justifyContent: sizes.length <= 3 ? "center" : "flex-start",
                          }}>
                            {sizes.map(sz => {
                              const shapeH = 30;
                              const shapeW = Math.round(shapeH * (sz.w / sz.h));
                              return (
                              <button key={sz.id}
                                onClick={() => {
                                  setCardSize(prev => ({ ...prev, [card.id]: sz.id }));
                                  updateSelected({ size: sz.pid, sku: sz.sku, productType: card.id });
                                }}
                                style={{ border:`1px solid ${selSize===sz.id?RED:BORDER}`,
                                  borderRadius:10, padding:"10px 10px 10px",
                                  background: "#fff",
                                  cursor:"pointer", textAlign:"center", position:"relative",
                                  flex:"0 0 auto", minWidth:90, scrollSnapAlign:"start" }}>
                                {sz.best && (
                                  <span style={{ position:"absolute", top:-9, left:"50%",
                                    transform:"translateX(-50%)", fontSize:8, fontWeight:700,
                                    background:"#8B6B3D", color:"#fff", padding:"3px 7px",
                                    borderRadius:10, letterSpacing:".06em", textTransform:"uppercase",
                                    whiteSpace:"nowrap" }}>Best Value</span>
                                )}
                                <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end",
                                  height: shapeH + 4, marginBottom:6 }}>
                                  <div style={{ width: shapeW, height: shapeH,
                                    border:`1.5px solid ${selSize===sz.id?RED:"#bdb6ad"}`,
                                    borderRadius:2, background: "#f4f1ec" }}/>
                                </div>
                                <div style={{ fontSize:11.5, fontWeight:700, color:INK, whiteSpace:"nowrap" }}>{sz.dim}</div>
                                <div style={{ fontSize:10, color:MUTED, marginTop:1, whiteSpace:"nowrap" }}>{sz.label}</div>
                                {discountAmt > 0 && (
                                  <div style={{ fontSize:10, color:MUTED, textDecoration:"line-through", marginTop:4 }}>
                                    ${sz.price}
                                  </div>
                                )}
                                <div style={{ fontSize:12.5, fontWeight:800, color:RED }}>
                                  ${Math.max(0, sz.price - discountAmt)}
                                </div>
                              </button>
                            );})}
                          </div>
                            {sizes.length > 3 && (
                              <button
                                type="button"
                                aria-label="Scroll sizes right"
                                onClick={(e) => {
                                  const sc = e.currentTarget.parentElement?.querySelector("[data-size-scroll]") as HTMLElement | null;
                                  sc?.scrollBy({ left: 160, behavior: "smooth" });
                                }}
                                style={{
                                  position:"absolute", right:-6, top:"50%", transform:"translateY(-50%)",
                                  zIndex:2, width:26, height:26, borderRadius:"50%",
                                  background:"#fff", border:`1px solid ${BORDER}`,
                                  boxShadow:"0 2px 8px rgba(0,0,0,.08)", cursor:"pointer",
                                  display:"flex", alignItems:"center", justifyContent:"center", padding:0,
                                }}>
                                <ChevronRight size={14} color={INK}/>
                              </button>
                            )}
                          </div>
                          </div>
                        </details>
                      )}

                      {card.frameColors && (
                        <details className="cz-acc">
                          <summary>
                            <span>Frame Color</span>
                            <span className="cz-acc-val">{(FRAME_COLORS["classic-frame"]||[]).find(fc => fc.id === cardFrame)?.label || ""}</span>
                            <ChevronDown className="cz-acc-chev" size={15}/>
                          </summary>
                          <div className="cz-acc-body">
                            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                              {(FRAME_COLORS["classic-frame"]||[]).map(fc => (
                                <button key={fc.id} title={fc.label}
                                  onClick={() => { setCardFrame(fc.id);
                                    updateSelected({ frameColor:fc.id, frame:toFrameId("classic-frame",fc.id) }); }}
                                  style={{ width:30, height:30, borderRadius:7,
                                    background:fc.color, padding:0,
                                    border:`2px solid ${cardFrame===fc.id?RED:(fc.id==="white"?"#ccc":"transparent")}`,
                                    boxShadow:"0 1px 4px rgba(0,0,0,.15)",
                                    cursor:"pointer", outline:"none" }}/>
                              ))}
                            </div>
                          </div>
                        </details>
                      )}

                      {card.frameColors && (
                        <details className="cz-acc">
                          <summary>
                            <span>Mount Colour</span>
                            <span className="cz-acc-val">{MOUNT_COLORS.find(mc => mc.id === mountColor)?.label || ""}</span>
                            <ChevronDown className="cz-acc-chev" size={15}/>
                          </summary>
                          <div className="cz-acc-body">
                            <div style={{ display:"flex", gap:10 }}>
                              {MOUNT_COLORS.map(mc => (
                                <button key={mc.id} title={mc.label}
                                  onClick={() => setMountColor(mc.id)}
                                  style={{ display:"flex", flexDirection:"column",
                                    alignItems:"center", gap:4, background:"none",
                                    border:"none", cursor:"pointer", padding:0 }}>
                                  <div style={{ width:30, height:30, borderRadius:7,
                                    background:mc.color,
                                    border: mountColor===mc.id
                                      ? `2px solid ${RED}`
                                      : `1px solid rgba(0,0,0,.15)`,
                                    boxShadow:"0 1px 3px rgba(0,0,0,.1)" }}/>
                                  <span style={{ fontSize:9.5, color:mountColor===mc.id?INK:MUTED }}>
                                    {mc.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </details>
                      )}

                      {card.frameColors && (
                        <details className="cz-acc">
                          <summary>
                            <span>Glaze</span>
                            <span className="cz-acc-val">{GLAZE_OPTIONS.find(g => g.id === glazeType)?.label || ""}</span>
                            <ChevronDown className="cz-acc-chev" size={15}/>
                          </summary>
                          <div className="cz-acc-body">
                            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                              {GLAZE_OPTIONS.map(g => (
                                <button key={g.id}
                                  onClick={() => setGlazeType(g.id as "perspex" | "moth-eye")}
                                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                                    padding:"10px 12px", borderRadius:10, cursor:"pointer",
                                    border:`1.5px solid ${glazeType===g.id?RED:BORDER}`,
                                    background:glazeType===g.id?"rgba(230,25,25,.04)":"#fff",
                                    transition:"all .15s", textAlign:"left" }}>
                                  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                                    <span style={{ fontSize:12.5, fontWeight:700, color:INK }}>{g.label}</span>
                                    <span style={{ fontSize:11, color:MUTED }}>{g.desc}</span>
                                  </div>
                                  <span style={{ fontSize:12, fontWeight:800,
                                    color:g.add>0?INK:MUTED, flexShrink:0, marginLeft:12 }}>
                                    {g.add > 0 ? `+$${g.add}` : "Included"}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </details>
                      )}

                      {card.id !== "digital" && (
                        <div style={{ display:"flex", alignItems:"center", gap:6,
                          fontSize:12, color:"#16a34a", fontWeight:600, marginBottom:10 }}>
                          <Truck size={14}/> Free Shipping Included
                        </div>
                      )}

                      <details className="cz-acc">
                        <summary>
                          <span>What's Included</span>
                          <span className="cz-acc-val">{card.features.length} items</span>
                          <ChevronDown className="cz-acc-chev" size={15}/>
                        </summary>
                        <div className="cz-acc-body">
                          <ul style={{ listStyle:"none", padding:0, margin:0,
                            display:"flex", flexDirection:"column", gap:5 }}>
                            {card.features.map((f:string, i:number) => (
                              <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:6,
                                fontSize:12, color:INK, lineHeight:1.5 }}>
                                <Check size={13} style={{ color:"#16a34a", flexShrink:0, marginTop:2 }}/> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      {cardDiscount > 0 && (
                        <div style={{ fontSize:12, color:"#16a34a", fontWeight:700, marginBottom:10 }}>
                          ■ ${discountAmt} Discount Applied!
                        </div>
                      )}

                      {/* ── In-box extras: add photo upsell, promo, gift ── */}
                      <div style={{
                        border:`1px dashed ${BORDER}`, borderRadius:10, padding:10,
                        marginBottom:12, display:"flex", flexDirection:"column", gap:8,
                        background:"#FAFAF7",
                      }}>
                        {card.canvasAddon && (
                          <div onClick={() => setCanvasFrame(p => !p)}
                            style={{ border:`1.5px dashed ${canvasFrame?RED:BORDER}`, borderRadius:8,
                              padding:"9px 10px", cursor:"pointer", background:"#fff",
                              display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:18, height:18, borderRadius:"50%",
                              border:`2px solid ${canvasFrame?RED:BORDER}`,
                              background:canvasFrame?RED:"transparent",
                              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              {canvasFrame && <Check size={10} color="#fff" strokeWidth={3}/>}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12.5, fontWeight:600, color:INK }}>Add A Floating Wood Frame</div>
                              <div style={{ fontSize:11, color:MUTED }}>Elegant border around your canvas</div>
                            </div>
                            <span style={{ fontSize:12.5, fontWeight:700, color:INK }}>+$49</span>
                            {canvasFrame && (
                              <div style={{ display:"flex", gap:6, marginLeft:6 }} onClick={e => e.stopPropagation()}>
                                {[{id:"black",color:"#1a1a1a"},{id:"white",color:"#f4f4f4"},{id:"walnut",color:"#5a3a24"}].map(fc => (
                                  <button key={fc.id}
                                    onClick={() => setCanvasFrameColor(fc.id)}
                                    style={{ width:18, height:18, borderRadius:5,
                                      background:fc.color, cursor:"pointer",
                                      border:`2px solid ${canvasFrameColor===fc.id?RED:"rgba(0,0,0,.15)"}`,
                                      padding:0 }}/>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Add another photo upsell */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddImage(); }}
                          disabled={busy}
                          style={{
                            width:"100%", padding:"9px 10px",
                            border:`1.5px dashed ${BORDER}`, borderRadius:8,
                            background:"#fff", cursor:"pointer",
                            fontFamily:"'Poppins',sans-serif",
                            display:"flex", alignItems:"center", gap:10,
                            opacity: busy ? .5 : 1,
                            textAlign:"left",
                          }}>
                          <div style={{ width:18, height:18, borderRadius:"50%",
                            border:`2px solid ${BORDER}`,
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Plus size={11} color={INK} strokeWidth={3}/>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12.5, fontWeight:600, color:INK }}>Add Another Photo</div>
                            <div style={{ fontSize:11, color: bundlePct > 0 ? "#16a34a" : MUTED, fontWeight: bundlePct > 0 ? 700 : 400 }}>
                              {bundlePct > 0
                                ? `🎉 ${Math.round(bundlePct*100)}% Bundle Discount Applied!`
                                : "Add 2 — Save 10% · Add 3+ — Save 15%"}
                            </div>
                          </div>
                        </button>

                        {/* Promo code */}
                        <div>
                          {promoApplied ? (
                            <div style={{
                              display:"flex", alignItems:"center", justifyContent:"space-between",
                              padding:"7px 10px", borderRadius:8, background:"#F0FDF4", border:"1px solid #BBF7D0",
                            }}>
                              <div style={{ fontSize:11.5, color:"#15803D", fontWeight:600 }}>
                                Promo: {promoApplied.code}
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); clearPromo(); }} style={{
                                background:"none", border:"none", color:MUTED, cursor:"pointer",
                                fontSize:11, textDecoration:"underline", fontFamily:"inherit",
                              }}>Remove</button>
                            </div>
                          ) : promoOpen ? (
                            <div onClick={e => e.stopPropagation()}>
                              <div style={{ display:"flex", gap:6 }}>
                                <input
                                  value={promoCode}
                                  onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                                  onKeyDown={e => e.key === "Enter" && applyPromo()}
                                  placeholder="Enter code"
                                  style={{
                                    flex:1, padding:"7px 10px", borderRadius:7,
                                    border:`1px solid ${promoError ? "#DC2626" : BORDER}`,
                                    fontFamily:"inherit", fontSize:12, outline:"none", background:"#fff",
                                  }}
                                />
                                <button onClick={applyPromo} style={{
                                  padding:"7px 12px", borderRadius:7, border:"none",
                                  background:INK, color:"#fff", fontWeight:600, fontSize:11.5, cursor:"pointer", fontFamily:"inherit",
                                }}>Apply</button>
                              </div>
                              {promoError && <div style={{ fontSize:10.5, color:"#DC2626", marginTop:3 }}>{promoError}</div>}
                            </div>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); setPromoOpen(true); }} style={{
                              background:"none", border:"none", padding:0, color:INK, fontWeight:600,
                              fontSize:11.5, cursor:"pointer", fontFamily:"inherit", textDecoration:"underline",
                            }}>+ Add Promo Code</button>
                          )}
                        </div>

                        {/* Gift note */}
                        <div>
                          {giftOpen || giftNote ? (
                            <div onClick={e => e.stopPropagation()}>
                              <div style={{ fontSize:10.5, color:MUTED, fontWeight:600, marginBottom:4, letterSpacing:".08em", textTransform:"uppercase" }}>
                                Gift Note
                              </div>
                              <textarea
                                value={giftNote}
                                onChange={e => setGiftNote(e.target.value)}
                                placeholder="Add a personal message…"
                                maxLength={250}
                                rows={2}
                                style={{
                                  width:"100%", padding:"7px 10px", borderRadius:7, border:`1px solid ${BORDER}`,
                                  fontFamily:"inherit", fontSize:12, outline:"none", background:"#fff", resize:"vertical",
                                }}
                              />
                            </div>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); setGiftOpen(true); }} style={{
                              background:"none", border:"none", padding:0, color:INK, fontWeight:600,
                              fontSize:11.5, cursor:"pointer", fontFamily:"inherit", textDecoration:"underline",
                            }}>+ Add Gift Note</button>
                          )}
                        </div>
                      </div>

                      {card.id === "digital" && (
                        <div style={{
                          marginTop:4, marginBottom:14, paddingBottom:14, borderBottom:`1px solid ${BORDER}`,
                        }}>
                          {!packsOpen ? (
                            <div style={{ textAlign:"center" }}>
                              <div style={{ fontSize:12, color:MUTED, marginBottom:6 }}>
                                Want More Styles & Masterpieces?
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); setPacksOpen(true); }} style={{
                                background:"none", border:"none", padding:0, color:INK, fontWeight:700,
                                fontSize:13, cursor:"pointer", fontFamily:"'Poppins',sans-serif",
                              }}>View Packs & Pricing →</button>
                            </div>
                          ) : (
                            <div>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                                <div style={{ fontSize:12, fontWeight:700, color:INK,
                                  fontFamily:"'Poppins',sans-serif", letterSpacing:".04em", textTransform:"uppercase" }}>
                                  Choose A Pack
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setPacksOpen(false); }} style={{
                                  background:"none", border:"none", padding:0, color:MUTED, fontSize:11,
                                  cursor:"pointer", textDecoration:"underline", fontFamily:"inherit",
                                }}>Hide</button>
                              </div>
                              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                {[
                                  { id:"digital-pack", name:"Digital Pack", price:39, per:"$7.80/masterpiece",
                                    badge:"Popular", featured:true,
                                    feats:["5 masterpieces to perfect your art","2 print-ready downloads","All art styles unlocked","Commercial use rights"] },
                                  { id:"starter-pack", name:"Starter Pack", price:99, per:"$9.90/masterpiece",
                                    badge:null, featured:false,
                                    feats:["10 masterpieces to explore","All 10 downloads included","No watermarks ever","Precision Editor access"] },
                                  { id:"studio-pack", name:"Studio Pack", price:199, per:"$3.32/masterpiece",
                                    badge:"Best Value", featured:false, save:"Save 43%",
                                    feats:["60 masterpieces for total freedom","Download all your masterpieces","Advanced Precision Editor","Priority support"] },
                                ].map(pk => {
                                  const inCart = addedPacks.find(p => p.packId === pk.id);
                                  const qtyInCart = inCart?.qty || 0;
                                  return (
                                  <div key={pk.id}
                                    style={{
                                      border:`2px solid ${qtyInCart ? RED : (pk.featured ? RED : BORDER)}`,
                                      borderRadius:12, padding:"12px 14px",
                                      background: qtyInCart ? "#FFF8F8" : "#fff",
                                      position:"relative",
                                      boxShadow: qtyInCart ? `0 0 0 3px ${RED}22` : "none",
                                      transition:"all .15s ease",
                                  }}>
                                    {pk.badge && (
                                      <span style={{
                                        position:"absolute", top:-8, left:12,
                                        fontSize:9, fontWeight:700, background: pk.featured ? RED : "#F59E0B",
                                        color:"#fff", padding:"3px 8px", borderRadius:20,
                                        letterSpacing:".08em", textTransform:"uppercase",
                                        fontFamily:"'Poppins',sans-serif",
                                      }}>{pk.badge}</span>
                                    )}
                                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                                      <div style={{ fontSize:14, fontWeight:800, color:INK, fontFamily:"'Poppins',sans-serif" }}>
                                        {pk.name}
                                        {qtyInCart > 1 && (
                                          <span style={{ marginLeft:6, fontSize:11, fontWeight:700, color:RED }}>×{qtyInCart}</span>
                                        )}
                                      </div>
                                      <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                                        <span style={{ fontSize:18, fontWeight:900, color:INK, fontFamily:"'Poppins',sans-serif" }}>
                                          ${pk.price}
                                        </span>
                                        {pk.save && (
                                          <span style={{ fontSize:10, fontWeight:700, color:"#16a34a" }}>{pk.save}</span>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ fontSize:10.5, color:MUTED, marginBottom:8 }}>{pk.per}</div>
                                    <ul style={{ listStyle:"none", padding:0, margin:"0 0 10px",
                                      display:"flex", flexDirection:"column", gap:4 }}>
                                      {pk.feats.map(f => (
                                        <li key={f} style={{ fontSize:11.5, color:INK, display:"flex", gap:6, alignItems:"flex-start" }}>
                                          <Check size={12} color={pk.featured ? RED : "#16a34a"} style={{ marginTop:2, flexShrink:0 }}/>
                                          <span>{f}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); addPackToCart({ id: pk.id, name: pk.name, price: pk.price }); }}
                                      style={{
                                        width:"100%", border:"none", cursor:"pointer",
                                        fontSize:11.5, fontWeight:700, textAlign:"center",
                                        padding:"8px 10px", borderRadius:8,
                                        background: qtyInCart ? "#16a34a" : RED,
                                        color: "#fff",
                                        fontFamily:"'Poppins',sans-serif",
                                        letterSpacing:".04em", textTransform:"uppercase",
                                        display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
                                      }}>
                                      {qtyInCart ? <><Check size={13}/> Added — Add Another</> : <><Plus size={13}/> Add To Cart</>}
                                    </button>
                                  </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {discountAmt > 0 && (
                        <div style={{
                          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                          padding:"8px 12px", marginBottom:8,
                          background:"#FFF1F1", border:`1px solid ${RED}33`, borderRadius:10,
                        }}>
                          <span style={{ fontSize:11, fontWeight:700, color:RED, letterSpacing:".04em", textTransform:"uppercase", fontFamily:"'Poppins',sans-serif" }}>
                            ${discountAmt} Off Expires In
                          </span>
                          <span style={{
                            fontSize:12, fontWeight:800, color:"#fff", background:RED,
                            padding:"3px 8px", borderRadius:6, fontFamily:"'Courier New',monospace",
                          }}>{fmtCountdown(discountSec)}</span>
                        </div>
                      )}

                      {(() => {
                        const snapshot = {
                          ...selected,
                          productType: card.id,
                          size: card.id === "digital" ? selected.size : (cardSizeDef?.pid || selSize),
                          sku: cardSizeDef?.sku || "",
                          frameColor: card.frameColors ? cardFrame : undefined,
                          glazeType: card.frameColors ? glazeType : undefined,
                          canvasEdge: canvasFrame ? "mirror" : undefined,
                          qty: selected.qty || 1,
                        };
                        const lineQty = selected.qty || 1;
                        const linePrice = Math.max(0, itemUnitPrice(snapshot) - discountAmt) * lineQty;
                        return (
                          <>
                            <div style={{
                              fontSize:12, color:MUTED, textAlign:"center",
                              marginBottom:10, fontStyle:"italic",
                              fontFamily:"'Playfair Display','Poppins',serif",
                              letterSpacing:".01em",
                            }}>
                              A timeless piece made uniquely for you.
                            </div>
                            <button disabled={nameCompositing} onClick={async () => {
                              let finalPhotoUrl = (snapshot as any).photoUrl;
                              if (portraitName && namePosition !== "none") {
                                setNameCompositing(true);
                                finalPhotoUrl = await composeNameOnImage(
                                  (snapshot as any).photoUrl,
                                  portraitName,
                                  namePosition as "top" | "bottom",
                                  nameFontId,
                                  nameColorId,
                                  nameSizeId,
                                );
                                setNameCompositing(false);
                              }
                              const namedSnapshot = {
                                ...snapshot,
                                photoUrl: finalPhotoUrl,
                                portraitName: portraitName || null,
                                namePosition: portraitName ? namePosition : null,
                                nameFontId:   portraitName ? nameFontId   : null,
                                nameSizeId:   portraitName ? nameSizeId   : null,
                                nameColorId:  portraitName ? nameColorId  : null,
                              };
                              addToCart(namedSnapshot, lineQty);
                              setPendingCart({ snapshot: namedSnapshot, qty: lineQty });
                              setUpsellOpen(true);
                            }} className="cz-btn-red" style={{ width:"100%", padding:"14px 0",
                              borderRadius:10, fontSize:14, display:"flex", alignItems:"center",
                              justifyContent:"center", gap:8 }}>
                              {nameCompositing
                                ? <><div className="cz-spinner" style={{ width:14,height:14 }}/> Adding name…</>
                                : <><ShoppingCart size={15}/> Add {card.label} To Cart — <span style={{ fontWeight:900 }}>${linePrice}</span></>}
                            </button>
                          </>
                        );
                      })()}

                      <div style={{ fontSize:10.5, color:MUTED, textAlign:"center", marginTop:8 }}>
                        Delivery: {card.delivery} · 100% Money-Back Guarantee{cartCount > 0 ? <> · <span style={{ color: INK, fontWeight:600 }}>{cartCount} Item{cartCount === 1 ? "" : "s"} In Cart</span></> : null}
                      </div>

                      {/* Buy Now, Pay Later */}
                      <div style={{
                        marginTop:10, padding:"10px 12px",
                        border:`1px solid ${BORDER}`, borderRadius:10, background:"#FAFAF7",
                      }}>
                        <div style={{ fontSize:11.5, color:INK, fontWeight:600, marginBottom:8, textAlign:"center" }}>
                          Or 4 Interest-Free Payments Of <span className="cz-serif" style={{ fontWeight:700 }}>${(headerTotal/4).toFixed(2)}</span>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0, 1fr))", alignItems:"center", gap:5 }}>
                          {[
                            { name: "Klarna", logo: klarnaLogo, bg: "#FFA8CD", scale: "80%" },
                            { name: "Affirm", logo: affirmLogo, bg: "transparent", scale: "100%", maxHeight: 30, pad: 0 },
                            { name: "Afterpay", logo: afterpayLogo, bg: "#B2FCE4", scale: "84%" },
                          ].map((provider:any) => (
                            <div key={provider.name} title={provider.name} aria-label={provider.name} style={{
                              height:22, minWidth:0, padding:provider.pad ?? "0 5px", borderRadius:4, background:provider.bg,
                              display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden",
                            }}>
                              <img src={provider.logo} alt={provider.name} style={{
                                width:provider.scale, maxHeight:provider.maxHeight ?? 12, objectFit:"contain", display:"block",
                              }}/>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

          </div>



          {/* ── Social proof review ── */}
          {(() => {
            const reviews = [
              { quote: "Absolutely stunning — better than I imagined.", name: "Sarah M.", stars: 5 },
              { quote: "Ordered for my mom's birthday. She cried happy tears.", name: "James R.", stars: 5 },
              { quote: "My dog looks like actual royalty. 10/10.", name: "Priya K.", stars: 5 },
              { quote: "The quality blew me away. Framed it the same day.", name: "Tom W.", stars: 5 },
              { quote: "Got one for every room. My family is obsessed.", name: "Dana L.", stars: 5 },
            ];
            const r = reviews[Math.floor(Date.now() / 86400000) % reviews.length];
            return (
              <div style={{
                padding: "11px 14px", marginTop: -8, marginBottom: 10,
                background: "#FFFDF8", border: `1px solid ${BORDER}`,
                borderRadius: 10, borderLeft: `3px solid ${RED}`,
              }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 5 }}>
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: 12 }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: 12.5, color: INK, fontStyle: "italic",
                  lineHeight: 1.55, margin: "0 0 5px",
                }}>
                  "{r.quote}"
                </p>
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>
                  — {r.name}, verified buyer
                </span>
              </div>
            );
          })()}

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

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:80,
            animation:"czFade .2s ease both",
          }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              position:"absolute", top:0, right:0, height:"100%",
              width:"min(420px, 100vw)",
              background:"#fff", boxShadow:"-12px 0 40px rgba(0,0,0,.18)",
              display:"flex", flexDirection:"column",
              fontFamily:"'Poppins',sans-serif",
              animation:"czFade .25s cubic-bezier(.23,1,.32,1) both",
            }}
          >
            {/* Header */}
            <div style={{
              padding:"18px 20px", borderBottom:`1px solid ${BORDER}`,
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <ShoppingCart size={18} color={INK}/>
                <span style={{ fontSize:16, fontWeight:800, color:INK }}>
                  Your Cart {cartCount > 0 && <span style={{ color:MUTED, fontWeight:600 }}>({cartCount})</span>}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                style={{ background:"none", border:"none", cursor:"pointer", color:MUTED, padding:6, display:"flex" }}
              >
                <X size={20}/>
              </button>
            </div>

            {/* Items */}
            <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }}>
              {cartCount === 0 && (
                <div style={{ textAlign:"center", color:MUTED, fontSize:13, padding:"40px 10px" }}>
                  Your cart is empty.<br/>Add prints or packs to get started.
                </div>
              )}

              {/* Print line items */}
              {cartItems.map((it) => {
                const ptLabel =
                  it.productType === "digital"        ? "Digital Portrait"  :
                  it.productType === "print"          ? "Fine Art Print"    :
                  it.productType === "acrylic"        ? "Acrylic Glass"     :
                  it.productType === "canvas"         ? "Canvas Print"      :
                  it.productType === "box-frame"      ? "Box Frame"         :
                  it.productType === "classic-frame"  ? "Classic Frame"     :
                  it.productType === "vip"            ? "VIP Package"       :
                                                        "Portrait";
                const sizes = SIZES_BY_PRODUCT[it.productType] || SIZES_BY_PRODUCT["classic-frame"];
                const sd = sizes.find((s) => s.id === it.size);
                const unit = itemUnitPrice(it);
                return (
                  <div key={it.id} style={{
                    display:"flex", gap:12, padding:"12px 0",
                    borderBottom:`1px solid ${BORDER}`,
                  }}>
                    <div style={{
                      width:62, height:62, borderRadius:8, overflow:"hidden",
                      background:"#F4F1EC", flexShrink:0,
                      border:`1px solid ${BORDER}`,
                    }}>
                      {it.photoUrl && <img src={it.photoUrl} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:INK, lineHeight:1.3 }}>{ptLabel}</div>
                      <div style={{ fontSize:11.5, color:MUTED, marginTop:2 }}>
                        {it.productType !== "digital" && (sd?.label || it.size)}
                        {it.frameColor && it.productType !== "digital" ? ` · ${it.frameColor}` : ""}
                      </div>
                      {it.portraitName && (
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                          marginTop:3, fontSize:10.5, fontWeight:600,
                          color:RED, letterSpacing:".1em" }}>
                          <span>✦</span>
                          <span>NAME: {String(it.portraitName).toUpperCase()}</span>
                        </div>
                      )}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4, border:`1px solid ${BORDER}`, borderRadius:8 }}>
                          <button
                            onClick={() => setCartItemQty(it.id, (it.qty || 1) - 1)}
                            disabled={(it.qty || 1) <= 1}
                            style={{ background:"none", border:"none", padding:"4px 8px", cursor:"pointer", color:INK }}
                            aria-label="Decrease quantity"
                          ><Minus size={12}/></button>
                          <span style={{ fontSize:12, fontWeight:700, minWidth:18, textAlign:"center" }}>{it.qty || 1}</span>
                          <button
                            onClick={() => setCartItemQty(it.id, (it.qty || 1) + 1)}
                            style={{ background:"none", border:"none", padding:"4px 8px", cursor:"pointer", color:INK }}
                            aria-label="Increase quantity"
                          ><Plus size={12}/></button>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          {(() => {
                            const qty = it.qty || 1;
                            const listP = unit * qty;
                            const maxPrintPrice = printItems.length > 0
                              ? Math.max(...printItems.map(x => itemUnitPrice(x)))
                              : 0;
                            const itemGetsDiscount = discountAmt > 0
                              && it.productType !== "vip"
                              && it.productType !== "digital"
                              && unit >= maxPrintPrice;
                            const unitDisc = itemGetsDiscount ? Math.max(0, unit - discountAmt) : unit;
                            const lineP = unitDisc * qty;
                            return (
                              <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
                                {itemGetsDiscount && lineP < listP && (
                                  <span style={{ fontSize:10, color:MUTED, textDecoration:"line-through" }}>${listP}</span>
                                )}
                                <span style={{ fontSize:12, fontWeight:700, color:RED }}>${lineP}</span>
                              </div>
                            );
                          })()}
                          <button
                            onClick={() => removeCartItem(it.id)}
                            disabled={false}
                            style={{ background:"none", border:"none", cursor:"pointer", color:MUTED, padding:2, display:"flex" }}
                            aria-label="Remove"
                          ><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pack line items */}
              {addedPacks.map((p) => (
                <div key={p.id} style={{
                  display:"flex", gap:12, padding:"12px 0",
                  borderBottom:`1px solid ${BORDER}`,
                }}>
                  <div style={{
                    width:62, height:62, borderRadius:8, flexShrink:0,
                    background:"linear-gradient(135deg,#FDECEC,#FFF8F8)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border:`1px solid ${BORDER}`,
                  }}>
                    <Layers size={22} color={RED}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:INK, lineHeight:1.3 }}>{p.name}</div>
                    <div style={{ fontSize:11.5, color:MUTED, marginTop:2 }}>Style & masterpiece pack</div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:4, border:`1px solid ${BORDER}`, borderRadius:8 }}>
                        <button
                          onClick={() => setPackQty(p.id, p.qty - 1)}
                          disabled={p.qty <= 1}
                          style={{ background:"none", border:"none", padding:"4px 8px", cursor:"pointer", color:INK }}
                          aria-label="Decrease quantity"
                        ><Minus size={12}/></button>
                        <span style={{ fontSize:12, fontWeight:700, minWidth:18, textAlign:"center" }}>{p.qty}</span>
                        <button
                          onClick={() => setPackQty(p.id, p.qty + 1)}
                          style={{ background:"none", border:"none", padding:"4px 8px", cursor:"pointer", color:INK }}
                          aria-label="Increase quantity"
                        ><Plus size={12}/></button>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:INK }}>${p.price * p.qty}</span>
                        <button
                          onClick={() => removePackFromCart(p.id)}
                          style={{ background:"none", border:"none", cursor:"pointer", color:MUTED, padding:2, display:"flex" }}
                          aria-label="Remove"
                        ><Trash2 size={14}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding:"14px 18px 18px", borderTop:`1px solid ${BORDER}`, background:"#FAFAF7" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:MUTED, marginBottom:4 }}>
                <span>Subtotal</span><span>${subtotal}</span>
              </div>
              {discountSave > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:"#16a34a", marginBottom:4, fontWeight:600 }}>
                  <span>{discountTier === "welcome" ? "Welcome Promo" : "Limited-Time Promo"} (${discountAmt} off order)</span>
                  <span>−${discountSave}</span>
                </div>
              )}
              {bundleSave > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:"#16a34a", marginBottom:4, fontWeight:600 }}>
                  <span>Bundle Discount ({Math.round(bundlePct * 100)}% off {cartPhotoCount}+ prints)</span>
                  <span>−${bundleSave}</span>
                </div>
              )}
              {promoSave > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:"#16a34a", marginBottom:4, fontWeight:600 }}>
                  <span>Promo Code {promoApplied?.code ? `(${promoApplied.code})` : ""}</span>
                  <span>−${promoSave}</span>
                </div>
              )}
              {(bundleSave + promoSave + discountSave) > 0 && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:MUTED, marginBottom:6, paddingTop:4, borderTop:`1px dashed ${BORDER}` }}>
                  <span>Total Savings</span><span style={{ color:"#16a34a", fontWeight:700 }}>−${bundleSave + promoSave + discountSave}</span>
                </div>
              )}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, color:INK, fontWeight:800, marginBottom:12 }}>
                <span>Total</span><span>${total}</span>
              </div>
              {checkoutError && (
                <div style={{ fontSize:11.5, color:RED, marginBottom:8, textAlign:"center" }}>{checkoutError}</div>
              )}
              <button
                onClick={checkoutCart}
                disabled={cartCount === 0 || checkingOut}
                className="cz-btn-red"
                style={{
                  width:"100%", padding:"14px 0", borderRadius:10, fontSize:14,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  opacity: (cartCount === 0 || checkingOut) ? .55 : 1,
                  cursor: (cartCount === 0 || checkingOut) ? "not-allowed" : "pointer",
                }}
              >
                {checkingOut ? "Starting Checkout…" : <>Checkout — <span style={{ fontWeight:900 }}>${total}</span></>}
              </button>
              <button
                onClick={() => setCartOpen(false)}
                style={{
                  width:"100%", marginTop:8, padding:"10px 0", borderRadius:10,
                  background:"transparent", border:`1px solid ${BORDER}`,
                  fontSize:12.5, fontWeight:600, color:INK, cursor:"pointer",
                  fontFamily:"'Poppins',sans-serif",
                }}
              >
                Continue Shopping
              </button>
              {cartCount > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Remove all items from your cart?")) {
                      setCartItems([]);
                      setAddedPacks([]);
                    }
                  }}
                  style={{
                    width:"100%", marginTop:6, padding:"8px 0", borderRadius:10,
                    background:"transparent", border:"none",
                    fontSize:11.5, fontWeight:600, color:MUTED, cursor:"pointer",
                    fontFamily:"'Poppins',sans-serif", textDecoration:"underline",
                  }}
                >
                  Clear cart
                </button>
              )}
              <div style={{ fontSize:10.5, color:MUTED, textAlign:"center", marginTop:8 }}>
                100% Money-Back Guarantee · Secure Stripe Checkout
              </div>
            </div>
          </aside>
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

      {/* ■■ Portrait VIP Package Upsell Modal ■■ */}
      {upsellOpen && (
        <div
          onClick={() => { setUpsellOpen(false); checkoutCart(); }}
          style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:120,
            display:"flex", alignItems:"center", justifyContent:"center", padding:16,
            animation:"vipFadeIn .2s ease",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            background:"#fff", borderRadius:16, width:"100%", maxWidth:460,
            overflow:"hidden", fontFamily:"'Poppins',sans-serif",
            boxShadow:"0 30px 80px rgba(0,0,0,.4)",
            animation:"vipPop .25s cubic-bezier(.2,.8,.2,1)",
          }}>
            {/* Red header */}
            <div style={{
              background:RED, padding:"12px 18px", display:"flex",
              alignItems:"center", justifyContent:"space-between",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Star size={14} color="#fff" fill="#fff"/>
                <span style={{
                  fontSize:11, fontWeight:700, letterSpacing:".2em",
                  textTransform:"uppercase", color:"#fff",
                }}>Exclusive add-on</span>
              </div>
              <button
                onClick={() => { setUpsellOpen(false); checkoutCart(); }}
                aria-label="Close"
                style={{ background:"rgba(255,255,255,.25)", border:"none",
                  borderRadius:"50%", width:26, height:26, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                <X size={14} color="#fff"/>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding:"22px 22px 20px" }}>
              <h2 style={{
                fontSize:22, fontWeight:800, color:INK, textAlign:"center",
                marginBottom:6,
              }}>Portrait VIP package</h2>
              <div style={{ fontSize:13, color:MUTED, textAlign:"center", marginBottom:18 }}>
                Protect, prioritise & guarantee your portrait.
              </div>

              {/* Three items */}
              {[
                { Icon:Zap,    title:"Priority production",
                  desc:"Your order jumps to the front — ships in 2–3 days instead of 5–7", price:14 },
                { Icon:Shield, title:"Shipping insurance",
                  desc:"Full replacement if your print is lost or damaged in transit", price:12 },
                { Icon:RefreshCw, title:"Lifetime reprint protection",
                  desc:"Free reprint anytime if your print ever fades or is damaged", price:11 },
              ].map((item, i) => (
                <div key={i} style={{
                  display:"flex", gap:12, alignItems:"flex-start",
                  padding:"10px 0",
                  borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
                }}>
                  <div style={{
                    flexShrink:0, width:32, height:32, borderRadius:8,
                    background:"#FFF1F1", display:"flex",
                    alignItems:"center", justifyContent:"center",
                  }}>
                    <item.Icon size={17} color={RED}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:INK, marginBottom:2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize:11.5, color:MUTED, lineHeight:1.45 }}>
                      {item.desc}
                    </div>
                  </div>
                  <span style={{ fontSize:13, color:MUTED, flexShrink:0, fontWeight:600 }}>
                    ${item.price}
                  </span>
                </div>
              ))}

              {/* Pricing summary */}
              <div style={{
                marginTop:16, padding:"12px 14px", borderRadius:10,
                background:"#FAFAF7", border:`1px solid ${BORDER}`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12.5, color:MUTED }}>
                  <span>Total value</span>
                  <span style={{ textDecoration:"line-through" }}>$37</span>
                </div>
                <div style={{ fontSize:11.5, color:RED, fontWeight:700, marginTop:2 }}>
                  You save $20 (54% off)
                </div>
                <div style={{
                  display:"flex", justifyContent:"space-between", marginTop:8,
                  paddingTop:8, borderTop:`1px solid ${BORDER}`,
                  fontSize:15, fontWeight:800, color:INK,
                }}>
                  <span>Your price</span>
                  <span style={{ color:RED }}>$17</span>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:8 }}>
                <button
                  onClick={() => {
                    const vipItem = {
                      id: "vip-package",
                      productType: "vip",
                      photoUrl: pendingCart?.snapshot?.photoUrl || "",
                      sku: "VIP-PACKAGE",
                      qty: 1,
                      price: 17,
                    };
                    setCartItems((prev: any[]) => {
                      const existing = prev.find((i) => i.id === "vip-package");
                      if (existing) return prev;
                      return [...prev, vipItem];
                    });
                    setVipAdded(true);
                    setUpsellOpen(false);
                    checkoutCart();
                  }}
                  style={{
                    background:RED, color:"#fff", border:"none",
                    borderRadius:10, padding:"15px 0", fontSize:14.5,
                    fontWeight:700, cursor:"pointer",
                    fontFamily:"'Poppins',sans-serif",
                    display:"flex", alignItems:"center",
                    justifyContent:"center", gap:10,
                  }}>
                  <Check size={17}/> Yes, upgrade my order — $17
                </button>
                <button
                  onClick={() => { setUpsellOpen(false); checkoutCart(); }}
                  style={{ background:"none", border:"none", cursor:"pointer",
                    fontSize:12.5, color:MUTED, fontFamily:"'Poppins',sans-serif",
                    textDecoration:"underline", padding:"4px 0" }}>
                  No thanks, continue to checkout
                </button>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                  gap:6, fontSize:11, color:MUTED, marginTop:2 }}>
                  <Shield size={12} color={MUTED}/> Secure checkout powered by Stripe
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes vipFadeIn { from { opacity:0 } to { opacity:1 } }
            @keyframes vipPop { from { opacity:0; transform:translateY(20px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }
          `}</style>
        </div>
      )}
      <PreviewsDrawer
        open={previewsOpen}
        onClose={() => setPreviewsOpen(false)}
        defaultEmail={(session as any)?.email || ""}
      />
    </div>
  );
}
