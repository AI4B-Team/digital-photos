// @ts-nocheck
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/SessionContext";
import { ArrowLeft, Check, ChevronRight, RotateCcw, Pencil, Sparkles, Plus, Copy, Lock, EyeOff, Download, Trash2, ChevronUp, ChevronDown, SlidersHorizontal, X, Send, ZoomIn, ZoomOut, ArrowDownToLine, ImageIcon, Frame, Square, LayoutPanelTop, Truck, Layers, UploadCloud, Wand2 } from "lucide-react";
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

/* ── Prodigi product catalogue ── */
const PRODUCT_TYPES = [
  { id:"digital",       label:"Digital Only",     desc:"Hi-res download",              icon:ArrowDownToLine, price:27   },
  { id:"print",         label:"Fine Art Print",   desc:"Ships rolled, frame yourself", icon:ImageIcon,       price:null },
  { id:"classic-frame", label:"Classic Frame",    desc:"Ready to hang · 8 colours",    icon:Frame,           price:null },
  { id:"box-frame",     label:"Box Frame",        desc:"Deep shadow box · premium",    icon:LayoutPanelTop,  price:null },
  { id:"canvas",        label:"Canvas Print",     desc:"Gallery wrap · ready to hang", icon:Square,          price:null },
  { id:"acrylic-glass", label:"Acrylic Glass",    desc:"Museum-grade glass",            icon:Square,          price:null },
];

// Simplified S/M/L sizes per product (drives right-panel product cards)
const SIMPLE_SIZES: Record<string, { id:string; pid:string; label:string; dim:string; sku:string; price:number; w:number; h:number; best?:boolean }[]> = {
  "print": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8×10"',  sku:"GLOBAL-FAP-8x10",  price:47,  w:0.80, h:1 },
    { id:"md", pid:"16x20", label:"Medium", dim:'16×20"', sku:"GLOBAL-FAP-16x20", price:87,  w:0.80, h:1, best:true },
    { id:"lg", pid:"24x36", label:"Large",  dim:'24×36"', sku:"GLOBAL-FAP-24x36", price:167, w:0.67, h:1 },
  ],
  "canvas": [
    { id:"sm", pid:"12x16", label:"Small",  dim:'12×16"', sku:"GLOBAL-CAN-12x16", price:107, w:0.75, h:1 },
    { id:"md", pid:"16x20", label:"Medium", dim:'16×20"', sku:"GLOBAL-CAN-16x20", price:127, w:0.80, h:1, best:true },
    { id:"lg", pid:"24x36", label:"Large",  dim:'24×36"', sku:"GLOBAL-CAN-24x36", price:217, w:0.67, h:1 },
  ],
  "classic-frame": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8×10"',  sku:"GLOBAL-CFPM-8x10",  price:87,  w:0.80, h:1 },
    { id:"md", pid:"12x16", label:"Medium", dim:'12×16"', sku:"GLOBAL-CFPM-12x16", price:127, w:0.75, h:1, best:true },
    { id:"lg", pid:"18x24", label:"Large",  dim:'18×24"', sku:"GLOBAL-CFPM-18x24", price:197, w:0.75, h:1 },
  ],
  "acrylic-glass": [
    { id:"sm", pid:"8x10",  label:"Small",  dim:'8×10"',  sku:"GLOBAL-ACR-8x10",  price:147, w:0.80, h:1 },
    { id:"md", pid:"16x20", label:"Medium", dim:'16×20"', sku:"GLOBAL-ACR-16x20", price:197, w:0.80, h:1, best:true },
    { id:"lg", pid:"24x36", label:"Large",  dim:'24×36"', sku:"GLOBAL-ACR-24x36", price:297, w:0.67, h:1 },
  ],
};

const SIZES_BY_PRODUCT: Record<string, { id:string; label:string; sub:string; sku:string; price:number; w:number; h:number }[]> = {
  print: [
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-FAP-8x10",  price:47,  w:0.80, h:1 },
    { id:"10x10", label:'10 × 10"', sub:"Square",    sku:"GLOBAL-FAP-10x10", price:47,  w:1,    h:1 },
    { id:"11x14", label:'11 × 14"', sub:"Standard",  sku:"GLOBAL-FAP-11x14", price:57,  w:0.79, h:1 },
    { id:"12x12", label:'12 × 12"', sub:"Square",    sku:"GLOBAL-FAP-12x12", price:57,  w:1,    h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-FAP-12x16", price:67,  w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-FAP-16x20", price:87,  w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-FAP-18x24", price:107, w:0.75, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-FAP-20x24", price:127, w:0.83, h:1 },
    { id:"24x36", label:'24 × 36"', sub:"Grand",     sku:"GLOBAL-FAP-24x36", price:167, w:0.67, h:1 },
  ],
  "classic-frame": [
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-CFPM-8x10",  price:87,  w:0.80, h:1 },
    { id:"11x14", label:'11 × 14"', sub:"Standard",  sku:"GLOBAL-CFPM-11x14", price:107, w:0.79, h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-CFPM-12x16", price:127, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-CFPM-16x20", price:157, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-CFPM-18x24", price:197, w:0.75, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-CFPM-20x24", price:227, w:0.83, h:1 },
  ],
  "box-frame": [
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-BOXM-8x10",  price:97,  w:0.80, h:1 },
    { id:"11x14", label:'11 × 14"', sub:"Standard",  sku:"GLOBAL-BOXM-11x14", price:117, w:0.79, h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-BOXM-12x16", price:137, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-BOXM-16x20", price:167, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-BOXM-18x24", price:207, w:0.75, h:1 },
  ],
  canvas: [
    { id:"10x10", label:'10 × 10"', sub:"Square",    sku:"GLOBAL-CAN-10x10", price:77,  w:1,    h:1 },
    { id:"12x12", label:'12 × 12"', sub:"Square",    sku:"GLOBAL-CAN-12x12", price:87,  w:1,    h:1 },
    { id:"12x16", label:'12 × 16"', sub:"Portrait",  sku:"GLOBAL-CAN-12x16", price:107, w:0.75, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Large",     sku:"GLOBAL-CAN-16x20", price:127, w:0.80, h:1 },
    { id:"18x24", label:'18 × 24"', sub:"XL",        sku:"GLOBAL-CAN-18x24", price:147, w:0.75, h:1 },
    { id:"20x24", label:'20 × 24"', sub:"Statement", sku:"GLOBAL-CAN-20x24", price:167, w:0.83, h:1 },
    { id:"24x36", label:'24 × 36"', sub:"Grand",     sku:"GLOBAL-CAN-24x36", price:217, w:0.67, h:1 },
  ],
  "acrylic-glass": [
    { id:"8x10",  label:'8 × 10"',  sub:"Classic",   sku:"GLOBAL-ACR-8x10",  price:147, w:0.80, h:1 },
    { id:"16x20", label:'16 × 20"', sub:"Statement", sku:"GLOBAL-ACR-16x20", price:197, w:0.80, h:1 },
    { id:"24x36", label:'24 × 36"', sub:"Grand",     sku:"GLOBAL-ACR-24x36", price:297, w:0.67, h:1 },
  ],
};

const FRAME_COLORS: Record<string, { id:string; label:string; color:string }[]> = {
  "classic-frame": [
    { id:"black",          label:"Black",          color:"#1a1a1a" },
    { id:"white",          label:"White",          color:"#f4f4f4" },
    { id:"natural",        label:"Natural",        color:"#c89968" },
    { id:"antique-silver", label:"Antique Silver", color:"#9a9a9a" },
    { id:"antique-gold",   label:"Antique Gold",   color:"#c4963a" },
    { id:"dark-grey",      label:"Dark Grey",      color:"#555555" },
    { id:"light-grey",     label:"Light Grey",     color:"#d0d0d0" },
    { id:"brown",          label:"Brown",          color:"#8B5E3C" },
  ],
  "box-frame": [
    { id:"black",   label:"Black",   color:"#1a1a1a" },
    { id:"white",   label:"White",   color:"#f4f4f4" },
    { id:"natural", label:"Natural", color:"#c89968" },
    { id:"brown",   label:"Brown",   color:"#8B5E3C" },
  ],
};

const CANVAS_EDGES = [
  { id:"mirror",       label:"Mirror Wrap",         desc:"Edges mirror the image",   color:null      },
  { id:"museum-black", label:"Museum (Black edge)", desc:"Clean solid black edges",  color:"#1a1a1a" },
  { id:"museum-white", label:"Museum (White edge)", desc:"Clean solid white edges",  color:"#f4f4f4" },
];

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
    sku:         "GLOBAL-CFPM-11x14",
    frame:       "black",      // legacy — derived, drives visual preview
    size:        "11x14",      // new id format
    effect:      "original",
    border:      "shallow",
    borderColor: "soft-white",
    qty:         1,
    ...overrides,
  });


  const [items, setItems] = useState(() => {
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
  const [mpSection, setMpSection]     = useState<"" | "ai" | "concierge">("");
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

  // Right-panel accordion state
  const [activeCard, setActiveCard]             = useState("canvas");
  const [cardSize, setCardSize]                 = useState<Record<string,string>>({});
  const [cardFrame, setCardFrame]               = useState("black");
  const [canvasFrame, setCanvasFrame]           = useState(false);
  const [canvasFrameColor, setCanvasFrameColor] = useState("black");

  // Discount timer (welcome $20 → extended $10 → none)
  const [discountAmt, setDiscountAmt]   = useState(0);
  const [discountSec, setDiscountSec]   = useState(0);
  const [discountTier, setDiscountTier] = useState("");

  useEffect(() => {
    const LS_KEY = "ra_discount_start";
    const TEN_MIN = 10 * 60 * 1000;
    const FORTY_EIGHT = 48 * 60 * 60 * 1000;
    let startTs = parseInt(localStorage.getItem(LS_KEY) || "0");
    if (!startTs) {
      startTs = Date.now();
      localStorage.setItem(LS_KEY, String(startTs));
    }
    const tick = () => {
      const elapsed = Date.now() - startTs;
      if (elapsed < TEN_MIN) {
        setDiscountAmt(20); setDiscountTier("welcome");
        setDiscountSec(Math.ceil((TEN_MIN - elapsed) / 1000));
      } else if (elapsed < FORTY_EIGHT) {
        setDiscountAmt(10); setDiscountTier("extended");
        setDiscountSec(Math.ceil((FORTY_EIGHT - elapsed) / 1000));
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
  const setFrame = (v) => updateSelected({ frame: v, offsetX: 0, offsetY: 0 });
  const setSize = (v) => updateSelected({ size: v, offsetX: 0, offsetY: 0 });
  const setEffect = (v) => updateSelected({ effect: v });
  const setBorder = (v) => updateSelected({ border: v });
  const setBorderColor = (v) => updateSelected({ borderColor: v });
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
    if (it.productType === "digital") return 27;
    const pt = it.productType || "classic-frame";
    const sizes = SIZES_BY_PRODUCT[pt] || SIZES_BY_PRODUCT["classic-frame"];
    const sd = sizes.find(s => s.id === it.size) || sizes[1];
    return sd?.price || 97;
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
  const discountSave = discountAmt > 0 ? Math.min(discountAmt, subtotal - bundleSave - promoSave) : 0;
  const total        = Math.max(0, subtotal - bundleSave - promoSave - discountSave);
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
    const sd = getSizeDef(item);
    const ed = EFFECTS.find(e => e.id === item.effect) || EFFECTS[0];
    const isDigitalItem = item.productType === "digital";
    const bd = isDigitalItem ? (BORDERS.find(b => b.id === "none") || { id:"none", label:"None", px:0 }) : (BORDERS.find(b => b.id === item.border) || BORDERS[1]);
    const bcd = isDigitalItem ? { id:"transparent", label:"None", bg:"transparent" } : (BORDER_COLORS.find(c => c.id === item.borderColor) || BORDER_COLORS[0]);
    const isFrameless = fd.id === "frameless" || fd.id === "digital";
    const isCanvas    = fd.id === "canvas";
    const woodPad     = fd.w || 0;
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
              background: bd.px === 0 ? "transparent" : bcd.bg,
              padding: bd.px,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "none",
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
                  transform: `translate(calc(-50% + ${item.offsetX || 0}px), calc(-50% + ${item.offsetY || 0}px)) scale(${item.zoom || 1})`,
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
                      height: `${sd.h * 42}vh`,
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
                    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1, outline: isDraggingThis ? "2px dashed rgba(255,255,255,.9)" : "none", outlineOffset: "-1px" }}>
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
                            <div key={i}>DIGITALPHOTOS · DIGITALPHOTOS · DIGITALPHOTOS · DIGITALPHOTOS</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {itemBusy && (
                      <div className="cz-busy" style={{ zIndex: 2 }}>
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
          {isSelected ? (
            <div className="cz-toolbar" role="toolbar" aria-label="Image tools"
              onClick={(e) => e.stopPropagation()}
              style={{ flexShrink:0 }}>
              <span style={{ position:"relative", display:"inline-flex" }}>
                <button ref={(el) => { if (el) (window as any).__aiBtn = el; }} className={`cz-tool ${aiOpen?"on":""}`} onClick={(e) => { (window as any).__aiBtn = e.currentTarget; setAiOpen(v => !v); setMpSection("ai"); }} data-tip="Make It Perfect" aria-label="Make It Perfect" style={{ color: RED, background: "#FDECEC", borderRadius: 10 }}>
                  <Sparkles size={18}/>
                </button>
                {aiOpen && (() => {
                  const btn = (window as any).__aiBtn as HTMLElement | undefined;
                  const r = btn?.getBoundingClientRect();
                  const top = r ? Math.max(12, Math.min(window.innerHeight - 600, r.top)) : 100;
                  const left = r ? r.right + 12 : 100;
                  return (
                  <>
                    <div onClick={() => { setAiOpen(false); setMpSection(""); }} style={{ position:"fixed", inset:0, zIndex:199 }}/>
                    <div onClick={(e) => e.stopPropagation()} style={{
                      position:"fixed", left, top,
                      width:360, maxHeight:"80vh", overflowY:"auto",
                      background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14,
                      boxShadow:"0 20px 60px rgba(0,0,0,.18)", padding:14, zIndex:200,
                    }}>
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
                            <div style={{ fontSize:11, color:MUTED, marginTop:8, textAlign:"center" }}>
                              Free with every order · Applied after checkout
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                  );
                })()}
              </span>
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
    const primaryItem = items[0];
    setSession({
      customization: {
        portraitUrl,
        style:       styleId,
        productType: primaryItem.productType,
        size:        primaryItem.size,
        sizeLabel:   sizeDef?.label,
        sku:         primaryItem.sku,
        frameColor:  primaryItem.frameColor,
        canvasEdge:  primaryItem.canvasEdge,
        effect:      primaryItem.effect,
        border:      primaryItem.border,
        borderColor: primaryItem.borderColor,
        frame:       toFrameId(primaryItem.productType, primaryItem.frameColor),
      },
      customizationItems: items,
      selectedPlan:
        primaryItem.productType === "digital" ? "digital" :
        primaryItem.productType === "canvas"  ? "canvas"  : "bundle",
      printSize: sizeDef?.label,
      printSku:  primaryItem.sku,
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

      {/* Announcement strip — discount countdown */}
      {discountAmt > 0 && (
        <div style={{
          background:"#E61919", borderBottom:"1px solid #B91C1C",
          padding:"8px 22px", display:"flex", alignItems:"center", justifyContent:"center",
          gap:6, flexWrap:"wrap", position:"sticky", top:0, zIndex:30,
        }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>
            {discountTier === "welcome" ? "Welcome Discount" : "Limited Discount"}: ${discountAmt} OFF
          </span>
          <span style={{ fontSize:12, color:"#FFE4E6" }}>
            — Expires When The Timer Hits Zero
          </span>
          <div style={{
            background:"#fff", color:"#E61919", fontSize:12, fontWeight:700,
            padding:"4px 10px", borderRadius:6, fontFamily:"'Courier New',monospace",
          }}>{fmtCountdown(discountSec)}</div>
        </div>
      )}

      {/* Header */}
      <header style={{
        position: "sticky", top: discountAmt > 0 ? 38 : 0, zIndex: 20, background: "rgba(244,241,236,.85)",
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
        display:"grid", gridTemplateColumns:"320px 1fr 400px", gap:0,
        maxWidth:1500, margin:"0 auto",
      }}>
        {/* Customize controls (left) */}
        <aside className="cz-side" style={{
          padding:"24px 10px 24px 18px",
          position:"sticky", top:70, alignSelf:"start",
          maxHeight:"calc(100vh - 70px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:14,
        }}>
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

          {/* Mat / Border — not for digital */}
          {!isDigital && (
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
            display:"flex", alignItems:"center",
            justifyContent: aiOpen ? "flex-start" : "center",
            gap:16, width:"100%", maxWidth:"100%", flex:"1 1 auto", minHeight:0,
            paddingLeft: aiOpen ? 24 : 0,
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
          </div>
        </div>

        {/* Cart + pricing (right) */}
        <aside className="cz-side" style={{
          padding:"24px 24px 24px 12px",
          position:"sticky", top:70, alignSelf:"start",
          maxHeight:"calc(100vh - 70px)", overflowY:"auto",
          display:"flex", flexDirection:"column", gap:14,
        }}>
          {/* Choose Your Print — accordion product cards */}

          <div>
            <h3 style={{ fontSize:18, fontWeight:800, color:INK,
              fontFamily:"'Poppins',sans-serif", margin:"0 0 12px" }}>
              Choose Your Print
            </h3>
            {[
              { id:"digital", label:"Digital Only", sub:"Instant download.", badge:null,
                features:["All 6 portrait styles, hi-res files","Instant download, no waiting","Print-ready — use any local print shop"],
                delivery:"Instant" },
              { id:"print", label:"Art Print", sub:"Ships rolled, unframed.", badge:null,
                features:["Premium 230gsm archival paper, fade-resistant","Vivid colours, sunlight resistant","Ships rolled in a protective tube"],
                delivery:"5–7 Business Days" },
              { id:"canvas", label:"Gallery Canvas", sub:"Ready to hang.", badge:"Most Popular",
                features:["Fine-textured canvas, vivid detail & colour","Archival inks, UV-protected, fade-resistant","Stretched over solid pine wood frame","Ready to hang — mounting hardware included"],
                delivery:"4–7 Business Days", canvasAddon:true },
              { id:"classic-frame", label:"Framed Print", sub:"Ready to hang, 8 frame colours.", badge:null,
                features:["Museum-grade cotton art paper with white mount","Hand-finished solid frame, conservation-grade mount","Ready to hang — arrives fully assembled"],
                delivery:"5–9 Business Days", frameColors:true },
              { id:"acrylic-glass", label:"Acrylic Glass", sub:"Museum-grade glass.", badge:"Premium",
                features:["Printed behind crystal-clear acrylic for unmatched depth","Museum archival inks, UV-protected","Ready to hang — floating mount hardware included"],
                delivery:"5–8 Business Days" },
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
              const defaultSize = bestPid || sizes[Math.floor(sizes.length/2)]?.id || sizes[0]?.id || "md";
              const selSize  = cardSize[card.id] || defaultSize;
              const cardSizeDef = sizes.find(s => s.id === selSize) || sizes[0];
              const basePrice = card.id === "digital" ? 27 : (cardSizeDef?.price || 0);
              const frameAdd = card.canvasAddon && canvasFrame ? 49 : 0;
              const cardDiscount = isActive ? Math.min(discountAmt, basePrice + frameAdd) : 0;
              const price    = basePrice + frameAdd - cardDiscount;
              const origPrice = Math.round(basePrice * 1.4);

              return (
                <div key={card.id} style={{
                  border:`1px solid ${isActive ? RED : BORDER}`,
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
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                      {!isActive && (
                        <>
                          <span style={{ fontSize:11, color:MUTED, textDecoration:"line-through" }}>
                            ${card.id==="digital"?Math.round(27*1.4):origPrice}
                          </span>
                          <span style={{ fontSize:15, fontWeight:800, color:RED,
                            fontFamily:"'Poppins',sans-serif" }}>
                            ${card.id==="digital"?27:basePrice}
                          </span>
                        </>
                      )}
                      <ChevronDown size={15} color={isActive?RED:MUTED}
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
                          const lineP = unitPrice * qty;
                          const listP = Math.round(unitPrice * 1.4) * qty;
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
                                    <span style={{ fontSize:10, color:MUTED, textDecoration:"line-through" }}>${listP}</span>
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
                        <>
                          <div style={{ fontSize:11, color:MUTED, fontWeight:600,
                            letterSpacing:".06em", textTransform:"uppercase", margin:"6px 0 8px" }}>
                            Choose Size
                          </div>
                          <div style={{
                            display:"flex", gap:8, marginBottom:12,
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
                                    background:RED, color:"#fff", padding:"3px 7px",
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
                                <div style={{ fontSize:10, color:MUTED, textDecoration:"line-through", marginTop:4 }}>
                                  ${Math.round(sz.price*1.4)}
                                </div>
                                <div style={{ fontSize:12.5, fontWeight:800, color:RED }}>${sz.price}</div>
                              </button>
                            );})}
                          </div>
                        </>
                      )}

                      {card.frameColors && (
                        <>
                          <div style={{ fontSize:11, color:MUTED, fontWeight:600,
                            letterSpacing:".06em", textTransform:"uppercase", margin:"6px 0 8px" }}>
                            Frame Colour
                          </div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
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
                        </>
                      )}

                      {card.id !== "digital" && (
                        <div style={{ display:"flex", alignItems:"center", gap:6,
                          fontSize:12, color:"#16a34a", fontWeight:600, marginBottom:10 }}>
                          <Truck size={14}/> Free shipping included
                        </div>
                      )}

                      <div style={{ fontSize:11, color:MUTED, fontWeight:600,
                        letterSpacing:".06em", textTransform:"uppercase", marginBottom:6 }}>Included</div>
                      <ul style={{ listStyle:"none", padding:0, margin:"0 0 12px",
                        display:"flex", flexDirection:"column", gap:5 }}>
                        {card.features.map((f:string, i:number) => (
                          <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:6,
                            fontSize:12, color:INK, lineHeight:1.5 }}>
                            <Check size={13} style={{ color:"#16a34a", flexShrink:0, marginTop:2 }}/> {f}
                          </li>
                        ))}
                      </ul>

                      {cardDiscount > 0 && (
                        <div style={{ fontSize:12, color:"#16a34a", fontWeight:700, marginBottom:10 }}>
                          ■ ${discountAmt} discount applied!
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
                            style={{ border:`1px solid ${BORDER}`, borderRadius:8,
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
                            width:"100%", padding:"9px",
                            border:`1.5px dashed ${BORDER}`, borderRadius:8,
                            background:"#fff", cursor:"pointer",
                            fontFamily:"'Poppins',sans-serif", fontSize:12.5, fontWeight:600, color:INK,
                            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                            opacity: busy ? .5 : 1,
                          }}>
                          <Plus size={14}/> Add Another Photo
                        </button>
                        <div style={{
                          fontSize:11, color: bundlePct > 0 ? "#16a34a" : MUTED,
                          textAlign:"center", fontWeight: bundlePct > 0 ? 700 : 500,
                        }}>
                          {bundlePct > 0
                            ? `🎉 ${Math.round(bundlePct*100)}% Bundle Discount Applied!`
                            : "Add 2 — Save 10% · Add 3+ — Save 15%"}
                        </div>

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

                      <button onClick={() => {
                        updateSelected({
                          productType: card.id,
                          size: card.id === "digital" ? selected.size : (cardSizeDef?.pid || selSize),
                          sku: cardSizeDef?.sku || "",
                          frameColor: card.frameColors ? cardFrame : undefined,
                          canvasEdge: canvasFrame ? "mirror" : undefined,
                        });
                        handleContinue();
                      }} className="cz-btn-red" style={{ width:"100%", padding:"14px 0",
                        borderRadius:10, fontSize:14, display:"flex", alignItems:"center",
                        justifyContent:"center", gap:8 }}>
                        Order My {card.label} —{" "}
                        <span style={{ fontWeight:900 }}>${price}</span>
                      </button>

                      <div style={{ fontSize:10.5, color:MUTED, textAlign:"center", marginTop:8 }}>
                        Delivery: {card.delivery} · 100% Money-Back Guarantee
                      </div>

                      {/* Buy Now, Pay Later */}
                      <div style={{
                        marginTop:10, padding:"10px 12px",
                        border:`1px solid ${BORDER}`, borderRadius:10, background:"#FAFAF7",
                      }}>
                        <div style={{ fontSize:11.5, color:INK, fontWeight:600, marginBottom:8, textAlign:"center" }}>
                          Or 4 Interest-Free Payments Of <span className="cz-serif" style={{ fontWeight:700 }}>${(price/4).toFixed(2)}</span>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", alignItems:"center", gap:5 }}>
                          {[
                            { name: "Shop Pay", logo: shopPayLogo, bg: "#5A31F4", scale: "86%" },
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
                padding: "11px 14px", marginBottom: 10,
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
