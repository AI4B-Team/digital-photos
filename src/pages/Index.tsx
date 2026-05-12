// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate }  from "react-router-dom";
import { useSession }   from "@/context/SessionContext";
import { useUpload }    from "@/hooks/useUpload";
import { createSession } from "@/lib/supabaseHelpers";
import { supabase }     from "@/integrations/supabase/client";
import {
  Upload, X, Check, ChevronRight, ChevronDown, Download,
  Printer, FrameIcon, Heart, Truck, RefreshCw,
  Lock, Wand2, Sparkles, AlertCircle, Copy, Gift,
  ArrowRight, Shield, Star, Instagram, Facebook,
  PawPrint, Baby, Users, Flower2, Search, Image as ImageIcon
} from "lucide-react";
import scenePets from "@/assets/scene-pets.jpg";
import sceneBabies from "@/assets/scene-babies.jpg";
import scenePeople from "@/assets/scene-people.jpg";
import sceneMemorial from "@/assets/scene-memorial.jpg";
import sceneGifts from "@/assets/scene-gifts.jpg";
import portraitPets from "@/assets/portrait-pets.jpg";
import portraitPetsRen from "@/assets/portrait-pets-renaissance.jpg";
import portraitPetsStory from "@/assets/portrait-pets-storybook.jpg";
import portraitPetsFan from "@/assets/portrait-pets-fantasy.jpg";
import portraitPetsCine from "@/assets/portrait-pets-cinematic.jpg";
import portraitPetsMin from "@/assets/portrait-pets-minimal.jpg";
import portraitBabies from "@/assets/portrait-babies.jpg";
import portraitBabiesRoyal from "@/assets/portrait-babies-royal.jpg";
import portraitBabiesRen from "@/assets/portrait-babies-renaissance.jpg";
import portraitBabiesFan from "@/assets/portrait-babies-fantasy.jpg";
import portraitBabiesCine from "@/assets/portrait-babies-cinematic.jpg";
import portraitBabiesMin from "@/assets/portrait-babies-minimal.jpg";
import portraitCouplesRoyal from "@/assets/portrait-couples-royal.jpg";
import portraitCouplesRen from "@/assets/portrait-couples-renaissance.jpg";
import portraitCouplesStory from "@/assets/portrait-couples-storybook.jpg";
import portraitCouplesFan from "@/assets/portrait-couples-fantasy.jpg";
import portraitCouplesCine from "@/assets/portrait-couples-cinematic.jpg";
import portraitCouplesMin from "@/assets/portrait-couples-minimal.jpg";
import portraitPeople from "@/assets/portrait-people.jpg";
import portraitPeopleRoyal from "@/assets/portrait-people-royal.jpg";
import portraitPeopleRen from "@/assets/portrait-people-renaissance.jpg";
import portraitPeopleStory from "@/assets/portrait-people-storybook.jpg";
import portraitPeopleCine from "@/assets/portrait-people-cinematic.jpg";
import portraitPeopleMin from "@/assets/portrait-people-minimal.jpg";
import portraitMemorial from "@/assets/portrait-memorial.jpg";
import portraitMemorialRoyal from "@/assets/portrait-memorial-royal.jpg";
import portraitMemorialRen from "@/assets/portrait-memorial-renaissance.jpg";
import portraitMemorialStory from "@/assets/portrait-memorial-storybook.jpg";
import portraitMemorialFan from "@/assets/portrait-memorial-fantasy.jpg";
import portraitMemorialCine from "@/assets/portrait-memorial-cinematic.jpg";
import portraitGifts from "@/assets/portrait-gifts.jpg";
import portraitGiftsRoyal from "@/assets/portrait-gifts-royal.jpg";
import portraitGiftsStory from "@/assets/portrait-gifts-storybook.jpg";
import portraitGiftsFan from "@/assets/portrait-gifts-fantasy.jpg";
import portraitGiftsCine from "@/assets/portrait-gifts-cinematic.jpg";
import portraitGiftsMin from "@/assets/portrait-gifts-minimal.jpg";

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

/* Theme picker modal */
.tm-back{position:fixed;inset:0;background:rgba(10,10,10,.55);backdrop-filter:blur(6px);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
.tm-modal{background:#fff;border-radius:18px;width:100%;max-width:980px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.4);overflow:hidden}
.tm-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(0,0,0,.08)}
.tm-head h3{font-family:'Poppins',sans-serif;font-weight:700;font-size:18px;color:#0A0A0A}
.tm-search{margin:14px 22px 0;display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid rgba(0,0,0,.1);border-radius:999px;background:#FAFAFA}
.tm-search input{flex:1;border:none;outline:none;background:transparent;font-family:'Poppins',sans-serif;font-size:13px;color:#0A0A0A}
.tm-grid{padding:18px 22px 22px;overflow-y:auto;display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media(max-width:760px){.tm-grid{grid-template-columns:1fr}}
.tm-card{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .2s;background:#000}
.tm-card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.18)}
.tm-card.on{border-color:#E61919}
.tm-collage{display:grid;grid-template-columns:repeat(3,1fr);height:180px}
.tm-collage img{width:100%;height:100%;object-fit:cover;display:block}
.tm-meta{position:absolute;left:14px;bottom:12px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.6)}
.tm-meta .h{font-size:10.5px;letter-spacing:.18em;text-transform:lowercase;opacity:.85;font-weight:500}
.tm-meta .l{font-family:'Poppins',sans-serif;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-size:15px;margin-top:2px}
.tm-close{background:transparent;border:none;cursor:pointer;color:#525252;padding:4px;border-radius:6px}
.tm-close:hover{background:#F4F4F4;color:#0A0A0A}

/* Theme summary chip */
.theme-pick{display:flex;align-items:center;gap:10px;padding:8px 10px 8px 8px;border:1px solid rgba(230,25,25,.4);background:rgba(230,25,25,.05);border-radius:12px;cursor:pointer}
.theme-pick:hover{background:rgba(230,25,25,.09)}
.theme-pick .tp-thumbs{display:flex;gap:2px;border-radius:6px;overflow:hidden}
.theme-pick .tp-thumbs img{width:24px;height:24px;object-fit:cover;display:block}
.theme-pick .tp-l{font-family:'Poppins',sans-serif;font-weight:600;font-size:12.5px;color:#E61919;letter-spacing:.04em;text-transform:uppercase}
.theme-pick .tp-x{margin-left:auto;color:#E61919;background:transparent;border:none;cursor:pointer;padding:2px;border-radius:6px;display:flex}
.theme-pick .tp-x:hover{background:rgba(230,25,25,.12)}

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
  { id:"couples",  label:"Couples",  icon:"💞", Icon: Heart    },
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

/* Photoshoot Themes — category-specific template sets.
   Each theme adds extra creative direction to the AI prompt. */
const u = (id, w=400, h=400) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;
const THEMES = {
  pets: [
    { id:"royal-paws",   tag:"royalpup",   label:"Royal Paws",       prompt:"Regal pet portrait with velvet drapery, ornate crown collar, and soft window light.", thumbs:[u("photo-1583511655857-d19b40a7a54e"),u("photo-1517849845537-4d257902454a"),u("photo-1561037404-61cd46aa615b")] },
    { id:"adventure",    tag:"wildtail",   label:"Adventure",        prompt:"Outdoor adventure setting — mountain trails, golden hour light, dynamic action pose.", thumbs:[u("photo-1450778869180-41d0601e046e"),u("photo-1444212477490-ca407925329e"),u("photo-1507146426996-ef05306b995a")] },
    { id:"cozy-cottage", tag:"warmpaws",   label:"Cozy Cottage",     prompt:"Warm cottage interior, knitted blanket, soft fireplace glow, hygge mood.", thumbs:[u("photo-1561037404-61cd46aa615b"),u("photo-1494256997604-768d1f608cac"),u("photo-1574144611937-0df059b5ef3e")] },
    { id:"studio-pro",   tag:"poshpet",    label:"Studio Pro",       prompt:"Professional studio portrait, seamless backdrop, beauty dish lighting, magazine quality.", thumbs:[u("photo-1543466835-00a7907e9de1"),u("photo-1546238232-20216dec9f72"),u("photo-1583337130417-3346a1be7dee")] },
  ],
  babies: [
    { id:"newborn-dream",tag:"tinydream",  label:"Newborn Dream",    prompt:"Soft pastel newborn setup, dreamy linen wraps, gentle natural light, fine-art baby portrait.", thumbs:[u("photo-1519689680058-324335c77eba"),u("photo-1492725764893-90b379c2b6e7"),u("photo-1555252333-9f8e92e65df9")] },
    { id:"storybook",    tag:"littletale", label:"Storybook",        prompt:"Whimsical storybook scene with watercolor florals, fairy-tale props and warm illustration mood.", thumbs:[u("photo-1492725764893-90b379c2b6e7"),u("photo-1519689680058-324335c77eba"),u("photo-1555252333-9f8e92e65df9")] },
    { id:"first-year",   tag:"firstyear",  label:"First Year",       prompt:"Milestone celebration backdrop with balloons, soft pastel cake-smash setting.", thumbs:[u("photo-1555252333-9f8e92e65df9"),u("photo-1519689680058-324335c77eba"),u("photo-1492725764893-90b379c2b6e7")] },
    { id:"woodland",     tag:"wildbloom",  label:"Woodland",         prompt:"Enchanted woodland nursery, mushrooms, ferns, dappled forest light.", thumbs:[u("photo-1444212477490-ca407925329e"),u("photo-1448375240586-882707db888b"),u("photo-1441974231531-c6227db76b6e")] },
  ],
  couples: [
    { id:"old-money",    tag:"luxelife",   label:"Old Money",        prompt:"Old-money editorial — tailored knitwear, marble interiors, refined natural light, quiet luxury.", thumbs:[u("photo-1507003211169-0a1dd7228f2d"),u("photo-1494790108377-be9c29b29330"),u("photo-1500648767791-00dcc994a43e")] },
    { id:"editorial",    tag:"lostsignal", label:"Editorial Shots",  prompt:"High-fashion editorial spread, dramatic colored gels, modern poses, magazine cover energy.", thumbs:[u("photo-1502323777036-f29e3972d82f"),u("photo-1488161628813-04466f872be2"),u("photo-1469334031218-e382a71b716b")] },
    { id:"cinematic-romance", tag:"goldenhour", label:"Golden Romance", prompt:"Romantic golden-hour cinematic frame, sun flares, film grain, intimate close composition.", thumbs:[u("photo-1519741497674-611481863552"),u("photo-1525258946800-98cfd641d0de"),u("photo-1529634806980-85c3dd6d34ac")] },
    { id:"winter",       tag:"frostbyte",  label:"Winter Special",   prompt:"Snowy winter scene, soft cool tones, cashmere coats, breath in cold air.", thumbs:[u("photo-1483921020237-2ff51e8e4b22"),u("photo-1457269449834-928af64c684d"),u("photo-1483728642387-6c3bdd6c93e5")] },
  ],
  people: [
    { id:"editorial",    tag:"lostsignal", label:"Editorial Shots",  prompt:"High-fashion editorial frame, dramatic colored lighting, sculptural pose, magazine quality.", thumbs:[u("photo-1488161628813-04466f872be2"),u("photo-1502323777036-f29e3972d82f"),u("photo-1469334031218-e382a71b716b")] },
    { id:"old-money",    tag:"luxelife",   label:"Old Money",        prompt:"Refined corporate portrait, charcoal blazer, marble lobby, soft window light.", thumbs:[u("photo-1500648767791-00dcc994a43e"),u("photo-1494790108377-be9c29b29330"),u("photo-1507003211169-0a1dd7228f2d")] },
    { id:"hair-goals",   tag:"stylemaven", label:"Hair Goals",       prompt:"Salon-style hair-feature portrait, glossy lighting, beauty-shoot polish.", thumbs:[u("photo-1492106087820-71f1a00d2b11"),u("photo-1487412947147-5cebf100ffc2"),u("photo-1605497788044-5a32c7078486")] },
    { id:"makeup-glam",  tag:"beatface",   label:"Makeup Glam",      prompt:"Beauty close-up, bold makeup, ring-light highlights, editorial gloss.", thumbs:[u("photo-1487412947147-5cebf100ffc2"),u("photo-1522335789203-aaa1b59a4f04"),u("photo-1599733589046-8e4b04123f4f")] },
    { id:"fall",         tag:"autumnleaf", label:"Fall Aesthetic",   prompt:"Autumn outdoor scene, golden foliage, warm earth tones, crisp afternoon light.", thumbs:[u("photo-1500382017468-9049fed747ef"),u("photo-1507371341162-763b5e419408"),u("photo-1444930694458-01babe71870a")] },
    { id:"spring",       tag:"cherryblsm", label:"Spring Bloom",     prompt:"Spring bloom backdrop, cherry blossoms, pastel sky, soft pink light.", thumbs:[u("photo-1490750967868-88aa4486c946"),u("photo-1520763185298-1b434c919102"),u("photo-1522383225653-ed111181a951")] },
  ],
  memorial: [
    { id:"in-loving",    tag:"foreverwarm",label:"In Loving Memory", prompt:"Soft, dignified memorial portrait, warm light, gentle florals, treated with reverence.", thumbs:[u("photo-1490750967868-88aa4486c946"),u("photo-1520763185298-1b434c919102"),u("photo-1469474968028-56623f02e42e")] },
    { id:"heaven-light", tag:"goldenray",  label:"Heavenly Light",   prompt:"Soft heavenly light beams, peaceful sky composition, golden glow.", thumbs:[u("photo-1469474968028-56623f02e42e"),u("photo-1500534314209-a25ddb2bd429"),u("photo-1418065460487-3e41a6c84dc5")] },
    { id:"garden",       tag:"stillgarden",label:"Memorial Garden",  prompt:"Tranquil garden backdrop, soft greens, gentle dappled light, peaceful mood.", thumbs:[u("photo-1444930694458-01babe71870a"),u("photo-1490750967868-88aa4486c946"),u("photo-1520763185298-1b434c919102")] },
  ],
  gifts: [
    { id:"holiday",      tag:"hollydays",  label:"Christmas Magic",  prompt:"Festive holiday set with twinkling lights, evergreen, red & gold accents, cozy magic.", thumbs:[u("photo-1543589077-47d81606c1bf"),u("photo-1512389142860-9c449e58a543"),u("photo-1482517967863-00e15c9b44be")] },
    { id:"birthday",     tag:"bdaybash",   label:"Birthday Bash",    prompt:"Colorful birthday celebration, balloons, confetti, party lighting.", thumbs:[u("photo-1530103862676-de8c9debad1d"),u("photo-1464349095431-e9a21285b5f3"),u("photo-1515187029135-18ee286d815b")] },
    { id:"anniversary",  tag:"foreverours",label:"Anniversary",      prompt:"Romantic anniversary scene with candles, soft florals, intimate warm lighting.", thumbs:[u("photo-1519741497674-611481863552"),u("photo-1525258946800-98cfd641d0de"),u("photo-1529634806980-85c3dd6d34ac")] },
    { id:"thank-you",    tag:"warmthanks", label:"Thank You",        prompt:"Warm grateful portrait setting, soft floral arrangement, gentle golden light.", thumbs:[u("photo-1490750967868-88aa4486c946"),u("photo-1520763185298-1b434c919102"),u("photo-1444930694458-01babe71870a")] },
  ],
};

// Live teaser — one per category, cycles automatically
const TEASERS = [
  { cat:"Pets",     catId:"pets",     style:"Royal",       before:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop&q=80", after:scenePets,    portrait:portraitPets,
    portraits:[
      { url:portraitPets,       style:"Royal" },
      { url:portraitPetsRen,    style:"Renaissance" },
      { url:portraitPetsStory,  style:"Storybook" },
      { url:portraitPetsFan,    style:"Fantasy" },
      { url:portraitPetsCine,   style:"Cinematic" },
      { url:portraitPetsMin,    style:"Minimal" },
    ] },
  { cat:"Babies",   catId:"babies",   style:"Storybook",   before:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=600&fit=crop&q=80", after:sceneBabies,  portrait:portraitBabies,
    portraits:[
      { url:portraitBabiesRoyal, style:"Royal" },
      { url:portraitBabiesRen,   style:"Renaissance" },
      { url:portraitBabies,      style:"Storybook" },
      { url:portraitBabiesFan,   style:"Fantasy" },
      { url:portraitBabiesCine,  style:"Cinematic" },
      { url:portraitBabiesMin,   style:"Minimal" },
    ] },
  { cat:"Couples",  catId:"couples",  style:"Royal",       before:"https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&q=80", after:portraitCouplesRoyal, portrait:portraitCouplesRoyal,
    portraits:[
      { url:portraitCouplesRoyal, style:"Royal" },
      { url:portraitCouplesRen,   style:"Renaissance" },
      { url:portraitCouplesStory, style:"Storybook" },
      { url:portraitCouplesFan,   style:"Fantasy" },
      { url:portraitCouplesCine,  style:"Cinematic" },
      { url:portraitCouplesMin,   style:"Minimal" },
    ] },
  { cat:"People",   catId:"people",   style:"Cinematic",   before:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop&q=80", after:scenePeople,  portrait:portraitPeople,
    portraits:[
      { url:portraitPeopleRoyal, style:"Royal" },
      { url:portraitPeopleRen,   style:"Renaissance" },
      { url:portraitPeopleStory, style:"Storybook" },
      { url:portraitPeople,      style:"Fantasy" },
      { url:portraitPeopleCine,  style:"Cinematic" },
      { url:portraitPeopleMin,   style:"Minimal" },
    ] },
  { cat:"Memorial", catId:"memorial", style:"Minimal",     before:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&h=600&fit=crop&q=80", after:sceneMemorial,portrait:portraitMemorial,
    portraits:[
      { url:portraitMemorialRoyal, style:"Royal" },
      { url:portraitMemorialRen,   style:"Renaissance" },
      { url:portraitMemorialStory, style:"Storybook" },
      { url:portraitMemorialFan,   style:"Fantasy" },
      { url:portraitMemorialCine,  style:"Cinematic" },
      { url:portraitMemorial,      style:"Minimal" },
    ] },
  { cat:"Gifts",    catId:"gifts",    style:"Renaissance", before:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&q=80", after:sceneGifts,   portrait:portraitGifts,
    portraits:[
      { url:portraitGiftsRoyal, style:"Royal" },
      { url:portraitGifts,      style:"Renaissance" },
      { url:portraitGiftsStory, style:"Storybook" },
      { url:portraitGiftsFan,   style:"Fantasy" },
      { url:portraitGiftsCine,  style:"Cinematic" },
      { url:portraitGiftsMin,   style:"Minimal" },
    ] },
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
  const variants = cur.portraits || [{ url: cur.portrait, style: cur.style }];
  const portraitCur = variants[0];

  return (
    <div style={{ padding:"0 0 8px", display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ textAlign:"center", fontSize:11, letterSpacing:".32em",
        textTransform:"uppercase", color:T.gold, marginBottom:14 }}>
        What Your Photo Becomes
      </div>

      {/* Two-panel layout: Your Photo (left) + Generated slideshow (right) */}
      <div style={{ position:"relative", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48,
        alignItems:"stretch", flex:1, minHeight:0 }}>

        {/* LEFT: Your Photo */}
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden",
          border:`1px solid ${T.bGold}`, background:"#fff",
          boxShadow:"0 8px 24px rgba(0,0,0,.08)", minHeight:340 }}>
          <img src={cur.before} alt="Your original photo"
            style={{ width:"100%", height:"100%", objectFit:"cover",
              opacity:fading?0:1, transition:"opacity .3s" }}/>
          {/* "Your Photo" overlay label */}
          <div style={{ position:"absolute", top:12, left:12,
            fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#fff",
            background:"rgba(7,6,10,.78)", padding:"6px 12px", borderRadius:6, fontWeight:600 }}>
            Your Photo
          </div>
        </div>

        {/* RIGHT: Generated portraits slideshow (one at a time) */}
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden",
          border:`1px solid ${T.bGold}`, boxShadow:"0 12px 40px rgba(0,0,0,.08)",
          background:"#F5EFE3", minHeight:340 }}>
          <img src={portraitCur.url} alt="Generated portrait"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          {/* watermark */}
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
            justifyContent:"center", pointerEvents:"none" }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,.22)", letterSpacing:".26em",
              textTransform:"uppercase", transform:"rotate(-20deg)", whiteSpace:"nowrap" }}>
              DIGITAL PHOTOS
            </span>
          </div>
          {/* "Generated Portrait" label */}
          <div style={{ position:"absolute", top:12, left:12,
            fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#fff",
            background:"rgba(7,6,10,.78)", padding:"6px 12px", borderRadius:6, fontWeight:600 }}>
            Generated Portrait
          </div>
          {/* style badge */}
          <div style={{ position:"absolute", bottom:12, right:12,
            fontSize:10, letterSpacing:".18em", textTransform:"uppercase", color:T.bg,
            background:T.gold, padding:"6px 12px", borderRadius:6, fontWeight:700 }}>
            {portraitCur.style}
          </div>
        </div>

        {/* Doodle "becomes" arrow between panels */}
        <div style={{ position:"absolute", top:"50%", left:"50%",
          transform:"translate(-50%,-50%) rotate(-4deg)", pointerEvents:"none",
          display:"flex", flexDirection:"column", alignItems:"center", gap:2, zIndex:5 }}>
          <span style={{
            fontFamily:"'Caveat', 'Patrick Hand', cursive",
            fontSize:22, fontWeight:700, color:"#fff",
            background:T.gold, padding:"3px 14px", borderRadius:20,
            boxShadow:"0 6px 16px rgba(0,0,0,.25)", whiteSpace:"nowrap" }}>
            becomes
          </span>
          <svg width="56" height="22" viewBox="0 0 56 22" fill="none">
            <path d="M2 11 C 18 4, 38 18, 52 11" stroke={T.gold} strokeWidth="2.4"
              strokeLinecap="round" fill="none"/>
            <path d="M52 11 L44 6 M52 11 L44 16" stroke={T.gold} strokeWidth="2.4"
              strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Category dots */}
      <div style={{ display:"flex", gap:8, marginTop:14, alignItems:"center", justifyContent:"center" }}>
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
  const [theme,   setTheme]   = useState(null);    // { id, label, prompt, thumbs, tag } | null
  const [themeOpen, setThemeOpen] = useState(false);
  const [themeQuery, setThemeQuery] = useState("");
  const [drag,    setDrag]    = useState(false);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [addSlot, setAddSlot] = useState<"primary"|"extra">("primary");
  const err = uploadErr;
  const [scrolled,setScrolled]= useState(false);
  const [baX,     setBaX]     = useState(50);
  const [baDown,  setBaDown]  = useState(false);

  const heroRef = useRef<any>();
  const fileRef = useRef<any>();
  const baRef   = useRef<any>();

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
    if (!styles.length)return "Select at least one style";
    const c = CATS.find(c=>c.id===cat);
    return `Generate My ${c?.label} Portraits`;
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh" }}>

      {/* ── TRUST TICKER ── */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:201, height:30,
        background:"#B91C1C",
        display:"flex", alignItems:"center", justifyContent:"center", gap:22,
        fontFamily:"'Poppins',sans-serif", fontSize:11, letterSpacing:".14em",
        textTransform:"uppercase", color:"#fff", fontWeight:600 }}>
        <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
          <Truck size={13} strokeWidth={2}/> Free Worldwide Shipping
        </span>
        <span style={{ opacity:.5 }}>·</span>
        <span>30-Day Guarantee</span>
        <span style={{ opacity:.5 }}>·</span>
        <span>4.9★ Rated</span>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:30, left:0, right:0, zIndex:200, height:50,
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
                  setCat(c.id); setTheme(null);
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
      <section ref={heroRef} style={{ paddingTop:96, paddingBottom:40, display:"flex", alignItems:"center",
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
              lineHeight:1.6, marginBottom:24, maxWidth:"none", whiteSpace:"nowrap" }}>
              Turn Photos Of Your Pets, Babies, People, Or Precious Memories Into Timeless Portraits In Seconds.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"stretch" }} className="hg hero-grid">

          {/* LEFT PANEL — teaser */}
          <div style={{ display:"flex", flexDirection:"column", gap:24, height:"100%" }}>

            {/* LIVE TEASER moved into left panel */}
            <div className="fu" style={{ animationDelay:".3s", width:"100%",
              display:"flex", flexDirection:"column", flex:1 }}>
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
                      <button key={c.id} className={`chip cat ${cat===c.id?"on":""}`} onClick={() => { setCat(c.id); setTheme(null); }}>
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
                    onClick={() => { setAddSlot("primary"); fileRef.current?.click(); }}
                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={e => { e.preventDefault(); setDrag(false); setAddSlot("primary"); loadFile(e.dataTransfer.files[0]); }}>
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
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {[{ src: photo, onRemove: () => { clearPhoto(); if (fileRef.current) fileRef.current.value = ""; } },
                      ...extraPhotos.map((src, i) => ({
                        src,
                        onRemove: () => setExtraPhotos(p => p.filter((_, j) => j !== i)),
                      }))
                    ].map((item, i) => (
                      <div key={i} style={{ position:"relative", width:90, height:70, borderRadius:10,
                        overflow:"hidden", border:`1px solid ${T.bGold}`, background:"rgba(255,255,255,.04)" }}>
                        <img src={item.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                        <button onClick={item.onRemove} aria-label="Remove photo"
                          style={{ position:"absolute", top:4, right:4, width:18, height:18,
                            background:"#E0353F", border:"none", borderRadius:"50%", display:"flex",
                            alignItems:"center", justifyContent:"center", cursor:"pointer",
                            boxShadow:"0 2px 6px rgba(0,0,0,.35)" }}>
                          <X size={10} color="#fff" strokeWidth={3}/>
                        </button>
                      </div>
                    ))}
                    {/* Add another photo card */}
                    <button type="button"
                      onClick={() => { setAddSlot("extra"); fileRef.current?.click(); }}
                      style={{ width:90, height:70, borderRadius:10,
                        border:`1px dashed ${T.bGold}`, background:"rgba(255,255,255,.03)",
                        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                        gap:3, cursor:"pointer", color:T.cream }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background:T.gold,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:14, fontWeight:700, color:T.bg, lineHeight:1 }}>+</div>
                      <span style={{ fontSize:9, color:T.muted, letterSpacing:".06em" }}>Add Another</span>
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (addSlot === "extra") {
                      const reader = new FileReader();
                      reader.onload = ev => setExtraPhotos(p => [...p, ev.target?.result as string]);
                      reader.readAsDataURL(f);
                    } else {
                      loadFile(f);
                    }
                    // reset so the same file can be re-selected after removal
                    e.target.value = "";
                  }}/>
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

          <p style={{ fontSize:11, color:T.dim, textAlign:"center", maxWidth:360, lineHeight:1.7 }}>
            AI is generating {active.length} unique portrait{active.length>1?"s":""} from your photo.<br/>
            This may take 1–3 minutes.
          </p>
        </>
      )}
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
  const navigate                   = useNavigate();

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
    const featured = portraits[0]?.style || "";
    navigate(`/customize?style=${encodeURIComponent(featured)}`);
  }, [setSession, navigate]);

  return (
    <>
      <style>{G}</style>
      {screen==="home"    && <HomePage    onGenerate={handleGenerate}/>}
      {screen==="gen"     && <GenScreen   selectedStyles={localSession.styles}
                                sessionId={localSession.sessionId}
                                photoUrl={localSession.photoUrl || localSession.photo}
                                category={localSession.cat}
                                onDone={handleGenDone}/>}
    </>
  );
}
