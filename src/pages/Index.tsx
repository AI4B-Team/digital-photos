// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate }  from "react-router-dom";
import { useSession }   from "@/context/SessionContext";
import { useUpload, getImageDimensions, isLowRes, LOW_RES_THRESHOLD } from "@/hooks/useUpload";
import { createSession } from "@/lib/supabaseHelpers";
import { supabase }     from "@/integrations/supabase/client";
import {
  Upload, X, Check, ChevronLeft, ChevronRight, ChevronDown, Download,
  Printer, FrameIcon, Heart, Truck, RefreshCw,
  Lock, Wand2, Sparkles, AlertCircle, Copy, Gift,
  ArrowRight, Shield, Star, Instagram, Facebook,
  PawPrint, Baby, Users, Flower2, Search, Image as ImageIcon,
  SlidersHorizontal, Package, Globe, Droplets, FileText, Award,
  CalendarDays
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import scenePets from "@/assets/scene-pets.jpg";
import scenePetsBrutus  from "@/assets/scene-pets-brutus.jpg";
import scenePetsPitbull from "@/assets/scene-pets-pitbull.jpg";
import scenePetsGallery from "@/assets/scene-pets-gallery.jpg";
import scenePetsShepherdFlag from "@/assets/scene-pets-shepherd-flag.jpg";
import sceneBabies from "@/assets/scene-babies.jpg";
import sceneBabiesSkateboard from "@/assets/scene-babies-skateboard.jpg";
import sceneBabiesSuperman from "@/assets/scene-babies-superman.jpg";
import sceneBabiesSoccer from "@/assets/scene-babies-soccer.jpg";
import scenePeople from "@/assets/scene-people-ceo-v5.jpg";
import sceneMemorial from "@/assets/scene-family-heirloom-v4.jpg";
import sceneMemorialGrandmother from "@/assets/scene-memorial-grandmother.jpg";
import sceneMemorialVintageFamily from "@/assets/scene-memorial-vintage-family.jpg";
import sceneMemorialPet from "@/assets/scene-memorial-pet.jpg";
import sceneMemorialFather from "@/assets/scene-memorial-father.jpg";
import sceneMemorialCatAngel from "@/assets/scene-memorial-cat-angel.jpg";
import sceneMemorialFamily from "@/assets/scene-memorial-family.jpg";
import sceneGifts from "@/assets/scene-gifts.jpg";
import sceneFathersShoulders from "@/assets/scene-fathers-shoulders.jpg";
import sceneFathersFamilyEmbrace from "@/assets/scene-fathers-family-embrace.jpg";
import sceneFathersGenerations from "@/assets/scene-fathers-generations.jpg";
import sceneFathersReading from "@/assets/scene-fathers-reading.jpg";
import sceneFathersExecutive from "@/assets/scene-fathers-executive.jpg";
import sceneFathersRanch from "@/assets/scene-fathers-ranch.jpg";
import sceneCouples from "@/assets/scene-couples.jpg";
import sceneCouplesRings from "@/assets/scene-couples-rings.jpg";
import sceneCouplesTouch from "@/assets/scene-couples-touch.jpg";
import sceneCouplesKiss from "@/assets/scene-couples-kiss.jpg";
import sceneCouplesBackToBack from "@/assets/scene-couples-back-to-back.jpg";
import sceneCouplesEmbrace from "@/assets/scene-couples-embrace.jpg";
import sceneCouplesEditorialEmbrace from "@/assets/scene-couples-editorial-embrace.jpg";
import sceneCouplesCinematicKiss from "@/assets/scene-couples-cinematic-kiss.jpg";
import sceneCouplesBeachTender from "@/assets/scene-couples-beach-tender.jpg";
import stepUpload from "@/assets/step-upload.jpg";
import stepAi from "@/assets/step-ai.jpg";
import stepAi1 from "@/assets/step-ai-1.jpg";
import stepAi2 from "@/assets/step-ai-2.jpg";
import stepAi3 from "@/assets/step-ai-3.jpg";
import stepAi4 from "@/assets/step-ai-4.jpg";
import stepAi5 from "@/assets/step-ai-5.jpg";
import stepAi6 from "@/assets/step-ai-6.jpg";
import stepAi7 from "@/assets/step-ai-7.jpg";
import stepAi8 from "@/assets/step-ai-8.jpg";
import stepAi9 from "@/assets/step-ai-9.jpg";
import stepAi10 from "@/assets/step-ai-10.jpg";
import stepCustomize from "@/assets/step-customize.jpg";
import stepDelivered from "@/assets/step-delivered.jpg";
import portraitPetsRen from "@/assets/portrait-pets-renaissance.jpg";
import portraitPetsStory from "@/assets/portrait-pets-storybook.jpg";
import portraitPetsFan from "@/assets/portrait-pets-fantasy.jpg";
import proofPetsRoyal from "@/assets/portrait-pets-renaissance.jpg";
import proofPetsRen from "@/assets/portrait-pets-renaissance.jpg";
import proofPetsStory from "@/assets/portrait-pets-storybook.jpg";
import proofPetsFan from "@/assets/portrait-pets-fantasy.jpg";
import proofPetsCine from "@/assets/portrait-pets-cinematic.jpg";
import proofPetsMin from "@/assets/portrait-pets-minimal.jpg";
import proofBabiesRoyal from "@/assets/portrait-babies-royal.jpg";
import proofBabiesRen from "@/assets/portrait-babies-renaissance.jpg";
import proofBabiesFan from "@/assets/portrait-babies-fantasy.jpg";
import proofBabiesCine from "@/assets/portrait-babies-cinematic.jpg";
import proofBabiesMin from "@/assets/portrait-babies-minimal.jpg";
import proofCouplesRoyal from "@/assets/portrait-couples-royal.jpg";
import proofCouplesRen from "@/assets/portrait-couples-renaissance.jpg";
import proofCouplesStory from "@/assets/portrait-couples-storybook.jpg";
import proofCouplesFan from "@/assets/portrait-couples-fantasy.jpg";
import proofCouplesCine from "@/assets/portrait-couples-cinematic.jpg";
import proofCouplesMin from "@/assets/portrait-couples-minimal.jpg";
import proofPeopleRoyal from "@/assets/portrait-people-royal.jpg";
import proofPeopleRen from "@/assets/portrait-people-renaissance.jpg";
import proofPeopleStory from "@/assets/portrait-people-storybook.jpg";
import proofPeopleCine from "@/assets/portrait-people-cinematic.jpg";
import proofPeopleMin from "@/assets/portrait-people-minimal.jpg";
import proofMemorialRoyal from "@/assets/portrait-memorial-royal.jpg";
import proofMemorialRen from "@/assets/portrait-memorial-renaissance.jpg";
import proofMemorialStory from "@/assets/portrait-memorial-storybook.jpg";
import proofMemorialFan from "@/assets/portrait-memorial-fantasy.jpg";
import proofMemorialCine from "@/assets/portrait-memorial-cinematic.jpg";
import proofGiftsRoyal from "@/assets/portrait-gifts-royal.jpg";
import proofGiftsStory from "@/assets/portrait-gifts-storybook.jpg";
import proofGiftsFan from "@/assets/portrait-gifts-fantasy.jpg";
import proofGiftsCine from "@/assets/portrait-gifts-cinematic.jpg";
import proofGiftsMin from "@/assets/portrait-gifts-minimal.jpg";
import portraitPetsCine from "@/assets/portrait-pets-cinematic.jpg";
import portraitPetsMin from "@/assets/portrait-pets-minimal.jpg";
import petBathTime from "@/assets/pet-bath-time.jpg";
import petSleepy from "@/assets/pet-sleepy.jpg";
import petHighSociety from "@/assets/pet-high-society.jpg";
import petGuilty from "@/assets/pet-guilty.jpg";
import petExtremeSports from "@/assets/pet-extreme-sports.jpg";
import petKitchenTails from "@/assets/pet-kitchen-tails.jpg";
import petNineToFive from "@/assets/pet-nine-to-five.jpg";
import petCleanFluffy from "@/assets/pet-clean-fluffy.jpg";
import petSports from "@/assets/pet-sports.jpg";
import portraitBabies from "@/assets/portrait-babies.jpg";
import portraitBabiesRoyal from "@/assets/portrait-babies-royal.jpg";
import portraitBabiesRen from "@/assets/portrait-babies-renaissance.jpg";
import portraitBabiesFan from "@/assets/portrait-babies-fantasy.jpg";
import portraitBabiesCine from "@/assets/portrait-babies-cinematic.jpg";
import portraitBabiesMin from "@/assets/portrait-babies-minimal.jpg";
import babySkateboard from "@/assets/baby-skateboard.jpg";
import babyBasketball from "@/assets/baby-basketball.jpg";
import babySuperman from "@/assets/baby-superman.jpg";
import babyBalloonsFall from "@/assets/baby-balloons-fall.jpg";
import babyBoxing from "@/assets/baby-boxing.jpg";
import babySoccer from "@/assets/baby-soccer.jpg";
import babyBalloonBasket from "@/assets/baby-balloon-basket.jpg";
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
import beforePets from "@/assets/before-pets.jpg";
import beforeBabies from "@/assets/before-babies.jpg";
import beforeCouples from "@/assets/before-couples.jpg";
import beforePeople from "@/assets/before-people.jpg";
import beforeMemorial from "@/assets/before-memorial.jpg";
import beforeGifts from "@/assets/before-gifts.jpg";
import beforeWedding from "@/assets/before-wedding.jpg";
import sceneWeddingHeirloom from "@/assets/scene-wedding-heirloom.jpg";
import sceneWeddingConfetti from "@/assets/scene-wedding-confetti.jpg";
import sceneWeddingStreet from "@/assets/scene-wedding-street.jpg";
import sceneWeddingBeach from "@/assets/scene-wedding-beach.jpg";
import sceneWeddingCar from "@/assets/scene-wedding-car.jpg";
import sceneWeddingKiss from "@/assets/scene-wedding-kiss.jpg";
import beforePetMemorial from "@/assets/before-pet-memorial.jpg";
import scenePetRemembrance from "@/assets/scene-pet-remembrance.jpg";
import beforeVintage from "@/assets/before-vintage.jpg";
import sceneVintageRestored from "@/assets/scene-vintage-restored.jpg";
import beforePetViral from "@/assets/before-pet-viral.jpg";
import scenePetKing from "@/assets/scene-pet-king.jpg";
import beforePetCat from "@/assets/before-pet-cat.jpg";
import scenePetCatReader from "@/assets/scene-pet-cat-reader.jpg";
import scenePetBestfriend from "@/assets/scene-pet-bestfriend.jpg";
import beforeFamilyGrandparents from "@/assets/before-family-grandparents.jpg";
import sceneFamilyGrandparentsJoy from "@/assets/scene-family-grandparents-joy.jpg";
import beforePetCatHug from "@/assets/before-pet-cat-hug.jpg";
import scenePetCatHug from "@/assets/scene-pet-cat-hug.jpg";
import beforeBabyChef from "@/assets/before-baby-chef.jpg";
import sceneBabyChef from "@/assets/scene-baby-chef.jpg";

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
.btn-gold{background:#E61919;color:#FFFFFF;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:600;letter-spacing:.01em;text-transform:none;border-radius:12px;transition:all .2s}
.btn-gold:hover{background:#CC1414;transform:translateY(-1px);box-shadow:0 6px 18px rgba(230,25,25,.25)}
.btn-gold:active{transform:translateY(0)}
.btn-gold:disabled{opacity:.35;cursor:not-allowed;transform:none!important;box-shadow:none!important;animation:none!important}
.btn-ghost{background:transparent;border:1px solid rgba(0,0,0,.12);color:#0A0A0A;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:500;letter-spacing:.01em;text-transform:none;border-radius:12px;transition:all .2s}
.btn-ghost:hover{border-color:rgba(0,0,0,.3);background:rgba(0,0,0,.03)}
.btn-outline{background:transparent;border:1px solid #E61919;color:#E61919;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:600;letter-spacing:.01em;text-transform:none;border-radius:12px;transition:all .2s}
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
.szb{padding:6px 12px;font-size:12px;font-family:'Poppins',sans-serif;font-weight:500;cursor:pointer;border-radius:12px;transition:all .18s}
.szon{border:1px solid #E61919;background:rgba(230,25,25,.08);color:#E61919}
.szoff{border:1px solid rgba(0,0,0,.1);background:transparent;color:#525252}
.szoff:hover{border-color:rgba(0,0,0,.25);color:#0A0A0A}

/* Teaser */
.teaser-img{width:100%;height:100%;object-fit:cover;transition:opacity .5s ease}

/* Template strip */
.tmpl-wrap{position:relative}
.tmpl-strip{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:none;scroll-behavior:smooth}
.tmpl-strip::-webkit-scrollbar{display:none}
.tmpl-arrow{position:absolute;top:50%;transform:translateY(-50%);width:30px;height:30px;border-radius:50%;background:#fff;border:1px solid rgba(0,0,0,.12);box-shadow:0 2px 8px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:all .15s;color:#0A0A0A}
.tmpl-arrow:hover{background:#FAFAFA;box-shadow:0 4px 12px rgba(0,0,0,.18)}
.tmpl-arrow:disabled{opacity:0;pointer-events:none}
.tmpl-arrow.l{left:-10px}
.tmpl-arrow.r{right:-10px}
.tmpl-card{width:96px;flex-shrink:0;background:#fff;padding:0;cursor:pointer;border:1px solid rgba(0,0,0,.1);border-radius:10px;overflow:hidden;position:relative;transition:all .18s}
.tmpl-card:hover{border-color:rgba(0,0,0,.25);transform:translateY(-1px)}
.tmpl-card.on{border-color:#E61919;box-shadow:0 0 0 2px rgba(230,25,25,.2)}
.tmpl-img{height:84px;overflow:hidden;background:#FAFAFA;display:flex;align-items:center;justify-content:center}
.tmpl-img img{width:100%;height:100%;object-fit:cover;display:block}
.tmpl-meta{padding:6px 5px 7px;text-align:center}
.tmpl-l{font-family:'Poppins',sans-serif;font-size:10px;color:#0A0A0A;font-weight:600;letter-spacing:.02em;line-height:1.25}
.tmpl-d{font-size:8.5px;color:#8C8C8C;margin-top:2px;line-height:1.2}
.tmpl-check{position:absolute;top:5px;right:5px;width:16px;height:16px;background:#E61919;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.18)}

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
  { id:"pets",      label:"Pets",      icon:"🐾", Icon: PawPrint     },
  { id:"people",    label:"People",    icon:"👤", Icon: Users        },
  { id:"occasions", label:"Occasions", icon:"✦",  Icon: CalendarDays },
];

// Per-category upload requirements — drives the smart upload UI
const CAT_REQS: Record<string, {
  minPhotos: number;
  uploadHeading: string;
  uploadHint: string;
  namePlaceholders: string[];
  namesLabel: string;
}> = {
  pets:     { minPhotos:1,
              uploadHeading:"Upload Your Pet's Photo",
              uploadHint:"One Clear Photo Of Your Pet — Add More If You Have Multiple",
              namePlaceholders:["e.g., Barley, Milo, Sophie"],
              namesLabel:"Pet Name" },
  babies:   { minPhotos:1,
              uploadHeading:"Upload Your Baby's Photo",
              uploadHint:"One Clear, Well-Lit Photo — Face Visible",
              namePlaceholders:["e.g., Olivia, Noah, Emma"],
              namesLabel:"Baby's Name" },
  couples:  { minPhotos:2,
              uploadHeading:"Upload 2 Photos — One Of Each Partner",
              uploadHint:"Separate Photos Give The Best Couple Portrait",
              namePlaceholders:["Partner 1 Name","Partner 2 Name"],
              namesLabel:"Partner Names" },
  people:   { minPhotos:1,
              uploadHeading:"Upload Your Photo",
              uploadHint:"Add One Photo Per Person For Best Results",
              namePlaceholders:["e.g., Sarah, James, The Smiths"],
              namesLabel:"Name" },
  memorial: { minPhotos:1,
              uploadHeading:"Upload A Photo Of Your Loved One",
              uploadHint:"Any Cherished Photo — We'll Restore Clarity & Light",
              namePlaceholders:["In Loving Memory Of…"],
              namesLabel:"Name" },
  gifts:    { minPhotos:1,
              uploadHeading:"Upload Their Photo",
              uploadHint:"A Clear Photo Of The Person Or Pet You're Gifting",
              namePlaceholders:["e.g., Mom, Dad, Best Friend"],
              namesLabel:"Recipient Name" },
  occasions:{ minPhotos:1,
              uploadHeading:"Upload Your Photo",
              uploadHint:"One Clear Photo — Add More For Group Occasions",
              namePlaceholders:["e.g., Sarah, The Smiths"],
              namesLabel:"Name" },
};
const reqFor = (c?: string) => (c && CAT_REQS[c]) || CAT_REQS.people;

const STYLES = [
  { id:"royal",       label:"Royal",       desc:"Regal · Golden Era",       preview:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=520&h=650&fit=crop&q=80" },
  { id:"renaissance", label:"Renaissance", desc:"Old Masters · Rich Tones",  preview:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=520&h=650&fit=crop&q=80" },
  { id:"storybook",   label:"Storybook",   desc:"Whimsical · Illustrated",   preview:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=520&h=650&fit=crop&q=80" },
  { id:"fantasy",     label:"Fantasy",     desc:"Ethereal · Otherworldly",   preview:"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=520&h=650&fit=crop&q=80" },
  { id:"cinematic",   label:"Cinematic",   desc:"Moody · Film Quality",      preview:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=520&h=650&fit=crop&q=80" },
  { id:"minimal",     label:"Minimal",     desc:"Clean · Modern Fine Art",   preview:"https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=520&h=650&fit=crop&q=80" },
];

/* TEMPLATE SETS — category-specific scene/costume prompts.
   Each adds an "Additionally, depict the subject ..." clause to every style. */
export const TEMPLATES: Record<string, { id:string; label:string; desc:string; img:string; prompt:string }[]> = {
  pets: [
    { id:"pet-bath",      label:"Bath Time",       desc:"Spa Day Bubbles",
      img: petBathTime,
      prompt:"taking a bubble bath in a white tile bathroom, with a fluffy white towel wrapped on its head like a turban, two cucumber slices over its eyes spa-style, surrounded by foamy bubbles and a yellow rubber duck floating nearby, soft warm bathroom lighting, cozy hyper-realistic photograph" },
    { id:"pet-sleepy",    label:"Sleepy",          desc:"Tucked-In Cozy",
      img: petSleepy,
      prompt:"tucked into a bed with white blankets and a pillow under its head, cuddling a small brown teddy bear, soft warm bedroom lighting, dreamy sleepy mood, cozy hyper-realistic pet photograph" },
    { id:"pet-society",   label:"High Society",    desc:"Aristocrat Oil Painting",
      img: petHighSociety,
      prompt:"as a regal 18th century aristocrat in a classical oil painting. The reference image shows FOUR framed scenes in a 2x2 layout — pick one of the four scenes and recreate it exactly with the subject's identity. TOP-LEFT: sitting in a red velvet armchair in a Victorian library reading an old leather book, brass lamp on side table, bookshelves behind. TOP-RIGHT: sitting upright on a green velvet draped table beside a glowing fireplace with lit candlesticks. BOTTOM-LEFT: leaning over an antique chess board mid-game in a study with deep green curtain backdrop and bookshelves. BOTTOM-RIGHT: wearing an embroidered burgundy velvet coat with white lace cravat, posed formally in front of a deep burgundy curtain holding a quill pen at a writing desk. Warm earthy color palette, classical oil painting with painterly brushstrokes, gallery-quality fine art portrait. Output ONLY the painting content (no frame, no wall, no mockup chrome)." },
    { id:"pet-guilty",    label:"Guilty As Charged", desc:"Caught Red-Pawed",
      img: petGuilty,
      prompt:"standing guilty next to an overturned kitchen trash can with chewed paper and food scraps spilled around, ears back and big innocent guilty eyes, soft natural daylight in a clean kitchen, humorous hyper-realistic pet photograph" },
    { id:"pet-extreme",   label:"Extreme Sports",  desc:"Skydive Adventure",
      img: petExtremeSports,
      prompt:"skydiving through bright blue sky and white clouds wearing aviator goggles and a parachute harness with a tiny GoPro camera, paws spread wide, action sports hyper-realistic photograph" },
    { id:"pet-kitchen",   label:"Kitchen Tails",   desc:"Master Chef",
      img: petKitchenTails,
      prompt:"as a master chef wearing a tall white chef hat and red bandana, standing at a rustic wooden kitchen counter with flour, dough and baking ingredients, warm kitchen lighting, humorous hyper-realistic pet photograph" },
    { id:"pet-office",    label:"Nine To Five",    desc:"Office Life",
      img: petNineToFive,
      prompt:"as a serious office worker wearing reading glasses, sitting at a modern desk between two laptops with a coffee mug, colorful sticky notes covering the wall behind, corporate office lighting, humorous hyper-realistic pet photograph" },
    { id:"pet-laundry",   label:"Clean & Fluffy",  desc:"Laundry Day",
      img: petCleanFluffy,
      prompt:"sitting inside a wicker laundry basket full of fluffy white folded towels, wearing a blue shower cap, with soft soap suds, bright clean laundry room background, cute hyper-realistic pet photograph" },
     { id:"pet-sports",    label:"Sports Star",     desc:"Stadium MVP",
       img: petSports,
       prompt:"dressed as an American football star wearing helmet and team jersey, running with a football across a stadium field under bright stadium lights, blurred crowd in the background, dynamic hyper-realistic sports photograph" },
     { id:"pet-popart-splash", label:"Pop Art Splash", desc:"Vibrant Paint Drips",
       img: new URL("@/assets/templates/pets/pet-popart-cat-orange.jpg", import.meta.url).href,
       prompt:"vibrant pop-art painted portrait of the pet, head-and-shoulders centered composition, expressive thick brushstrokes with dripping paint splatters in saturated turquoise, magenta, orange and yellow, bold contrast, modern gallery acrylic painting style, textured canvas finish. Output ONLY the painting content at full bleed (no frame, no mat, no wall)." },
     { id:"pet-popart-tabby", label:"Tabby Mosaic", desc:"Warm Ochre Pop",
       img: new URL("@/assets/templates/pets/pet-popart-cat-tabby.jpg", import.meta.url).href,
       prompt:"vibrant pop-art painted portrait of the pet on a warm ochre and mustard background with magenta and teal paint splatters, expressive textured brushstrokes, bold modern acrylic painting, head-and-shoulders centered. Output ONLY the painting content at full bleed (no frame)." },
     { id:"pet-popart-doodle", label:"Color Burst", desc:"Sunset Acrylic",
       img: new URL("@/assets/templates/pets/pet-popart-doodle.jpg", import.meta.url).href,
       prompt:"vibrant pop-art painted portrait of the pet against a bold gradient background of orange, red, magenta and teal with thick painterly brushstrokes and drips, modern acrylic gallery painting, head-and-shoulders centered. Output ONLY the painting content at full bleed (no frame)." },
     { id:"pet-popart-husky", label:"Electric Husky", desc:"Cool Blue Splatter",
       img: new URL("@/assets/templates/pets/pet-popart-husky.jpg", import.meta.url).href,
       prompt:"vibrant pop-art painted portrait of the pet with an electric blue, pink and yellow splatter background, expressive thick brushstrokes and paint drips, bold modern acrylic painting, head-and-shoulders centered composition. Output ONLY the painting content at full bleed (no frame)." },
     { id:"pet-popart-siamese", label:"Gallery Drip", desc:"Crosshatch Pop",
       img: new URL("@/assets/templates/pets/pet-popart-siamese.jpg", import.meta.url).href,
       prompt:"vibrant pop-art painted portrait of the pet on a crosshatched grey, blue and red textured background with yellow and white paint splatters, expressive painterly brushstrokes, modern gallery acrylic painting, head-and-shoulders centered. Output ONLY the painting content at full bleed (no frame)." },
     { id:"pet-popart-frenchie", label:"Graffiti Gold", desc:"Urban Drip Art",
       img: new URL("@/assets/templates/pets/pet-popart-frenchie.jpg", import.meta.url).href,
       prompt:"vibrant pop-art painted portrait of the pet on a gold and black graffiti background with red, green, yellow and purple dripping paint splatters, expressive thick brushstrokes, urban modern acrylic painting, head-and-shoulders centered. Output ONLY the painting content at full bleed (no frame)." },
     { id:"pet-royal-regalia", label:"Royal Regalia", desc:"Golden Crown Portrait",
       img: new URL("@/assets/templates/pets/pet-royal-dog.jpg", import.meta.url).href,
       prompt:"regal renaissance oil painting of the pet wearing a golden jeweled crown, ornate royal blue velvet robe trimmed with gold embroidery and a gemstone medallion necklace, dramatic dark teal and gold textured background with painterly gold-leaf accents, classical court portrait composition, rich oil painting brushstrokes, gallery-quality fine art. Output ONLY the painting content at full bleed (no frame, no wall, no mockup chrome)." },
   ],
  babies: [
    { id:"baby-skateboard", label:"Little Skater", desc:"Mom & Baby Skate",
      img: babySkateboard,
      prompt:"creative overhead mom-and-baby photo against a plain white wall with a wood-plank floor strip at the bottom, shot top-down so both appear to stand on the wall. Baby wears a grey beanie and a printed white onesie with grey joggers, lying on a skateboard with green and purple wheels as if cruising. Mom stands next to baby in a white tank top and ripped blue jeans, arms crossed, looking down at baby with a soft smile, hair in a messy bun. Bright natural daylight, minimalist clean composition, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-basketball", label:"Slam Dunk", desc:"Mini Baller",
      img: babyBasketball,
      prompt:"creative overhead mom-and-baby photo against a white wall with a wood-plank floor strip, shot top-down so they appear to stand on the wall. Baby in green shorts reaches up to dunk an orange basketball into a small wall-mounted mini hoop with red trim. Mom wears a black Chicago Bulls jersey, white ripped denim shorts and white sneakers, arms crossed, looking at baby with an excited smile, hair in a messy bun. Bright clean daylight, playful sporty mood, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-superman", label:"Super Baby", desc:"Caped Hero", 
      img: babySuperman,
      prompt:"creative overhead mom-and-baby photo against a white wall with a wood-plank floor strip, shot top-down so they appear to stand on the wall. Baby in a blue Superman onesie with the red 'S' logo and a flowing red cape, posed flying horizontally with one fist forward. Mom wears a tied white button-up shirt and light denim shorts, with a strip of silver duct tape across her mouth (Lois Lane saved gag), looking sideways at baby. Bright natural light, comic-book playful mood, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-balloons-fall", label:"Balloon Drop", desc:"Floating Mischief",
      img: babyBalloonsFall,
      prompt:"creative overhead mom-and-baby photo against a white wall with a wood-plank floor strip, shot top-down. Baby in a grey hooded onesie hangs upside-down from two pearly mint-green balloons tied to its feet. Mom wears a dusty pink oversized sweater and black leggings, holding the string of a single pink balloon, looking at baby with a playful smile, hair in a messy bun. Bright natural daylight, whimsical pastel mood, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-boxing", label:"Tiny Champ", desc:"Knockout Round",
      img: babyBoxing,
      prompt:"creative overhead mom-and-baby photo against a white wall with a wood-plank floor strip, shot top-down. Baby in a grey striped onesie wears oversized red and black boxing gloves and kicks a red and black hanging punching bag. Mom wears a white tank top and grey athletic shorts, fists up in a boxing stance, looking at baby with a determined smile, hair in a high bun. Bright natural daylight, athletic playful mood, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-soccer", label:"Soccer Star", desc:"Goal Celebration",
      img: babySoccer,
      prompt:"creative overhead mom-and-baby photo against a white wall with a wood-plank floor strip, shot top-down. Baby in a navy Adidas Sweden football tracksuit kicks a white and blue soccer ball with both feet. Mom wears the matching yellow Sweden Adidas jersey, white denim shorts and white sneakers, throwing both hands up in double peace signs with a wide cheering open-mouth smile, hair in a messy bun. Bright natural daylight, sporty celebratory mood, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-balloon-basket", label:"Hot Air Baby", desc:"Balloon Basket Ride",
      img: babyBalloonBasket,
      prompt:"creative overhead mom-and-baby photo against a white wall with a wood-plank floor strip, shot top-down. Baby sits inside a woven straw belly basket holding a small green stuffed frog, with three balloons (green, red, yellow) tied above the basket like a hot-air balloon. Mom wears a white blouse and black knit lace skirt, one hand on her hip, looking at baby with a warm smile, hair in a messy bun. Bright natural daylight, whimsical adventure mood, hyper-realistic photograph. Output only the photo content." },
    { id:"baby-royal",    label:"Royal Baby",       desc:"Prince Or Princess",
      img:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=240&h=300&fit=crop&q=80",
      prompt:"as a royal baby prince or princess in a silk christening gown with pearl accessories, opulent palace background" },
    { id:"baby-fairy",    label:"Garden Fairy",     desc:"Magical Nature Sprite",
      img:"https://images.unsplash.com/photo-1537089949457-63fa3d7d74b5?w=240&h=300&fit=crop&q=80",
      prompt:"as a magical garden fairy with delicate translucent wings, surrounded by giant flowers, dewdrops, and soft pastel light" },
    { id:"baby-angel",    label:"Cherub Angel",     desc:"Heaven-sent Cherub",
      img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=240&h=300&fit=crop&q=80",
      prompt:"as a classic cherub angel with soft white feathered wings, floating among golden clouds in heavenly light" },
    { id:"baby-explorer", label:"Tiny Explorer",    desc:"Mini Adventurer",
      img:"https://images.unsplash.com/photo-1486218119243-13301543a0d4?w=240&h=300&fit=crop&q=80",
      prompt:"as a tiny adventurer in a pith helmet and explorer outfit, lush jungle and waterfall background" },
    { id:"baby-prince",   label:"Little Royal",     desc:"Tiny Aristocrat",
      img:"https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=240&h=300&fit=crop&q=80",
      prompt:"in a tiny aristocratic outfit with sash and miniature regalia, gilded nursery throne setting" },
    { id:"baby-storybook",label:"Storybook Star",   desc:"Once Upon A Time",
      img:"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=240&h=300&fit=crop&q=80",
      prompt:"in a whimsical storybook scene with watercolor florals, fairy-tale props, and warm illustration mood" },
    { id:"baby-mermaid",  label:"Little Mermaid",   desc:"Underwater Royalty",
      img:"https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=240&h=300&fit=crop&q=80",
      prompt:"as a tiny mermaid baby with a shimmering tail and seashell crown, surrounded by colorful coral, glowing fish, and soft underwater light" },
    { id:"baby-dragon",   label:"Dragon Rider",     desc:"Fantasy Companion",
      img:"https://images.unsplash.com/photo-1578632767115-351597cf2477?w=240&h=300&fit=crop&q=80",
      prompt:"riding a friendly baby dragon through cotton candy clouds, wearing a tiny hero cape, whimsical fantasy sky background" },
    { id:"baby-astronaut",label:"Space Baby",       desc:"Tiny Astronaut",
      img:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=240&h=300&fit=crop&q=80",
      prompt:"as a tiny adorable astronaut in a miniature spacesuit floating among colorful planets and stars, playful cosmic background" },
    { id:"baby-pumpkin",  label:"Harvest Season",   desc:"Cozy Autumn Magic",
      img:"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=240&h=300&fit=crop&q=80",
      prompt:"nestled in a magical pumpkin patch surrounded by autumn leaves, tiny gourds, warm lanterns, and cozy harvest season atmosphere" },
    { id:"baby-snow",     label:"Snow Princess",    desc:"Winter Ice Kingdom",
      img:"https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=240&h=300&fit=crop&q=80",
      prompt:"as a snow princess in a sparkling ice gown with a snowflake crown, magical frozen castle and twinkling snowfall background" },
    { id:"baby-butterfly",label:"Butterfly Garden", desc:"Colorful Bloom World",
      img:"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=240&h=300&fit=crop&q=80",
      prompt:"surrounded by giant colorful butterflies in a magical blooming garden with oversized flowers, glowing petals, and soft rainbow light" },
  ],
  couples: [
    { id:"cpl-wedding-confetti", label:"Wedding Confetti", desc:"Joyful Ceremony Exit",
      img: new URL("@/assets/templates/couples/cpl-wedding-confetti.jpg", import.meta.url).href,
      prompt:"as a wedding couple — bride in a white lace gown, veil and floral crown, groom in a navy tuxedo with bow tie — laughing joyfully as confetti and rose petals fall around them, warm bokeh string lights background, editorial wedding photography" },
    { id:"cpl-wedding-veil",     label:"Veil Embrace",     desc:"Golden Hour Intimate",
      img: new URL("@/assets/templates/couples/cpl-wedding-veil.jpg", import.meta.url).href,
      prompt:"as a wedding couple under a soft sheer veil draped over both, bride in lace gown, groom in cream beige suit, foreheads touching with intimate smile, warm golden backlight, ethereal romantic editorial photography" },
    { id:"cpl-wedding-flowing",  label:"Flowing Veil",     desc:"Studio Motion Portrait",
      img: new URL("@/assets/templates/couples/cpl-wedding-flowing.jpg", import.meta.url).href,
      prompt:"as a wedding couple — bride in flowing white chiffon gown with long veil dramatically blowing in the wind, groom in dark grey three-piece suit holding her hand and laughing — plain light grey studio backdrop, full body editorial wedding photography" },
    { id:"cpl-wedding-shades",   label:"Cool Newlyweds",   desc:"Sunglasses & Confetti",
      img: new URL("@/assets/templates/couples/cpl-wedding-shades.jpg", import.meta.url).href,
      prompt:"as a stylish wedding couple wearing sunglasses — bride in modern white ballgown, groom in classic black tuxedo with bow tie — standing confidently side by side as confetti falls, plain white studio backdrop, editorial fashion wedding photography" },
    { id:"cpl-wedding-intimate", label:"Intimate Portrait",desc:"Moody Studio Engagement",
      img: new URL("@/assets/templates/couples/cpl-wedding-intimate.jpg", import.meta.url).href,
      prompt:"as an intimate engagement couple — man in charcoal grey suit, woman in crisp white blouse leaning her head affectionately on his shoulder — soft warm rembrandt lighting against a dark grey backdrop, premium editorial portrait" },
    { id:"cpl-wedding-tuxedos",  label:"Matching Tuxedos", desc:"Power Couple Editorial",
      img: new URL("@/assets/templates/couples/cpl-wedding-tuxedos.jpg", import.meta.url).href,
      prompt:"as a modern power couple both wearing matching sleek black tuxedo suits with satin lapels, white shirts and black bow ties, standing side by side with arms crossed, plain white studio backdrop, editorial fashion photography" },
    { id:"cpl-argentina",  label:"Argentina Kit",     desc:"Matching Soccer Jerseys",
      img: new URL("@/assets/templates/couples/cpl-argentina.jpg", import.meta.url).href,
      prompt:"as a couple wearing matching Argentina national soccer jerseys (light blue and white vertical stripes, white shorts, white socks, soccer cleats), one seated and one standing leaning, soft pastel blue studio backdrop, editorial fashion photography" },
    { id:"cpl-brazil",     label:"Brazil Kit",        desc:"Retro Living Room",
      img: new URL("@/assets/templates/couples/cpl-brazil.jpg", import.meta.url).href,
      prompt:"as a couple in matching bright yellow Brazil soccer jerseys with green trim and dark shorts, seated together on a vintage brown leather armchair in a retro 1970s living room with old TV and patterned rug, warm editorial tones" },
    { id:"cpl-spain",      label:"Spain Kit",         desc:"Cozy Couch Match Day",
      img: new URL("@/assets/templates/couples/cpl-spain.jpg", import.meta.url).href,
      prompt:"as a couple in matching deep red Spain national soccer jerseys with yellow accents and blue jeans, sitting relaxed and smiling on a modern grey sofa in a cozy living room, snacks on coffee table" },
    { id:"cpl-england",    label:"England Kit",       desc:"Studio Back Print",
      img: new URL("@/assets/templates/couples/cpl-england.jpg", import.meta.url).href,
      prompt:"as a couple wearing matching white England soccer jerseys with KANE 9 printed on the back, blue jeans and white sneakers, standing back-to-camera and side leaning, plain light grey studio backdrop, editorial fashion photography" },
    { id:"cpl-germany",    label:"Germany Kit",       desc:"Stadium Stands",
      img: new URL("@/assets/templates/couples/cpl-germany.jpg", import.meta.url).href,
      prompt:"as a couple in matching white Germany national soccer jerseys with black-red-yellow chest stripes, jeans and caps, seated on stadium steps in a large empty soccer stadium, daylight" },
    { id:"cpl-denim",      label:"Double Denim",      desc:"Industrial Loft",
      img: new URL("@/assets/templates/couples/cpl-denim.jpg", import.meta.url).href,
      prompt:"as a couple in matching denim jackets, white tees and blue jeans, sitting casually on a concrete floor in a bright industrial loft with large windows, natural light editorial fashion" },
    { id:"cpl-leather",    label:"Leather & Neon",    desc:"Edgy Alley Glow",
      img: new URL("@/assets/templates/couples/cpl-leather.jpg", import.meta.url).href,
      prompt:"as a couple in matching black leather biker jackets and ripped black jeans, leaning against a red brick alley wall lit by red neon, edgy moody editorial fashion photography" },
    { id:"cpl-cozy-knit",  label:"Cozy Knit",         desc:"Cream Studio Calm",
      img: new URL("@/assets/templates/couples/cpl-cozy-knit.jpg", import.meta.url).href,
      prompt:"as a couple in matching chunky cream beige knit sweaters and cream pants, sitting close on the floor against a plain off-white backdrop, cozy intimate editorial photography" },
    { id:"cpl-hoodie",     label:"Hoodie Hug",        desc:"Playful & Joyful",
      img: new URL("@/assets/templates/couples/cpl-hoodie.jpg", import.meta.url).href,
      prompt:"as a couple in matching navy blue hoodies and blue jeans, hugging playfully and laughing, plain dark grey studio backdrop, joyful editorial fashion photography" },
    { id:"cpl-formal",     label:"Black Tie",         desc:"Tuxedo & Silk Gown",
      img: new URL("@/assets/templates/couples/cpl-formal.jpg", import.meta.url).href,
      prompt:"as an elegant couple in formal black tuxedo and floor-length white silk gown, posed close together against a dark grey backdrop, dramatic editorial wedding fashion lighting" },
    { id:"cpl-blazer",     label:"Tailored Blazers",  desc:"Studio Editorial",
      img: new URL("@/assets/templates/couples/cpl-blazer.jpg", import.meta.url).href,
      prompt:"as a couple in matching corduroy blazers (one tan brown, one cream beige) over white tees and wide-leg jeans, standing relaxed against a clean white studio backdrop, editorial fashion photography" },
    { id:"cpl-minimal-tee",label:"Minimal White Tee", desc:"Sunlit Apartment",
      img: new URL("@/assets/templates/couples/cpl-minimal-tee.jpg", import.meta.url).href,
      prompt:"as a couple in matching plain white t-shirts and light wash jeans, sitting close on a wooden floor in a sunlit minimalist apartment with white walls, soft natural daylight lifestyle photography" },
  ],
  people: [
    { id:"ppl-hollywood",label:"Hollywood Glam",    desc:"Golden Age Star",
      img:"https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=240&h=300&fit=crop&q=80",
      prompt:"in golden age Hollywood glamour style with dramatic studio lighting, fur stole, and cinematic background" },
    { id:"ppl-military", label:"Military Honor",    desc:"Distinguished Officer",
      img:"https://images.unsplash.com/photo-1504203700686-f21e703e5f1c?w=240&h=300&fit=crop&q=80",
      prompt:"in a formal military dress uniform adorned with ribbons, medals, and insignia, dignified regimental portrait style" },
    { id:"ppl-victorian",label:"Victorian Elegance",desc:"19Th Century Portrait",
      img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=240&h=300&fit=crop&q=80",
      prompt:"in Victorian-era formal dress with period hairstyle, gloves, and accessories, oil painting portrait style" },
    { id:"ppl-cosmic",   label:"Cosmic Traveler",   desc:"Interstellar Explorer",
      img:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=240&h=300&fit=crop&q=80",
      prompt:"as an interstellar traveler in a sleek cosmic suit, surrounded by stars, nebulas, and galactic light streams" },
    { id:"ppl-warrior",  label:"Epic Warrior",      desc:"Fantasy Battle Hero",
      img:"https://images.unsplash.com/photo-1553481187-be93c21490a9?w=240&h=300&fit=crop&q=80",
      prompt:"as an epic fantasy warrior in ornate battle armor with a dramatic stormy sky and battlefield background" },
    { id:"ppl-noir",     label:"Film Noir",         desc:"Shadowy Detective",
      img:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=240&h=300&fit=crop&q=80",
      prompt:"in classic film noir style with trench coat, fedora, dramatic high-contrast shadows and rainy city street" },
    { id:"ppl-viking",   label:"Viking Chieftain",  desc:"Norse Legend",
      img:"https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=240&h=300&fit=crop&q=80",
      prompt:"as a legendary Viking chieftain in fur and chainmail with a horned helmet and battle axe, dramatic Norse fjord and aurora borealis background" },
    { id:"ppl-samurai",  label:"Samurai Master",    desc:"Feudal Japan Honor",
      img:"https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=240&h=300&fit=crop&q=80",
      prompt:"as a revered samurai master in ornate lacquered armor holding a katana, misty Japanese mountain temple background at dawn" },
    { id:"ppl-pharaoh",  label:"Egyptian Royalty",  desc:"Ancient Nile Ruler",
      img:"https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=240&h=300&fit=crop&q=80",
      prompt:"as Egyptian royalty — pharaoh or queen — with golden headdress, kohl eyes, and ceremonial collar, grand pyramid and desert sunset background" },
    { id:"ppl-artdeco",  label:"Art Deco Glamour",  desc:"1920S Sophistication",
      img:"https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=240&h=300&fit=crop&q=80",
      prompt:"in 1920s Art Deco glamour with beaded flapper dress or sharp suit, geometric gold patterns, jazz age opulence, dramatic black and gold background" },
    { id:"ppl-greek",    label:"Greek Hero",        desc:"Ancient Olympian",
      img:"https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=240&h=300&fit=crop&q=80",
      prompt:"as a Greek hero or goddess in flowing robes with a laurel wreath, dramatic marble columns of the Parthenon and golden light of ancient Athens" },
    { id:"ppl-sheriff",  label:"Wild West Legend",  desc:"Frontier Outlaw Hero",
      img:"https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=240&h=300&fit=crop&q=80",
      prompt:"as a Wild West legend in full frontier attire with a wide-brimmed hat and leather vest, Monument Valley red rock landscape at sunset" },
  ],
  memorial: [
    { id:"mem-angel",    label:"Guardian Angel",   desc:"Heavenly Protector",
      img:"https://images.unsplash.com/photo-1517450084074-abe5e5950bf0?w=240&h=300&fit=crop&q=80",
      prompt:"as a peaceful guardian angel with luminous white wings and celestial golden light, soft clouds and heavenly background" },
    { id:"mem-garden",   label:"Heaven's Garden",  desc:"Serene Meadow",
      img:"https://images.unsplash.com/photo-1490750967868-88df5691cc9d?w=240&h=300&fit=crop&q=80",
      prompt:"in a serene heavenly flower garden with golden light filtering through ancient trees, butterflies, and soft mist" },
    { id:"mem-timeless", label:"Timeless Portrait",desc:"Dignified & Enduring",
      img:"https://images.unsplash.com/photo-1541804048018-5975f15fc6b4?w=240&h=300&fit=crop&q=80",
      prompt:"in a dignified timeless oil painting portrait with warm neutral background and soft classical Rembrandt-style lighting" },
    { id:"mem-light",    label:"Eternal Light",    desc:"Glow Of Remembrance",
      img:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=240&h=300&fit=crop&q=80",
      prompt:"surrounded by warm rays of eternal light, soft golden glow, peaceful and reverent composition" },
    { id:"mem-sky",      label:"Among The Stars",  desc:"Watching From Above",
      img:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=240&h=300&fit=crop&q=80",
      prompt:"set against a serene starry night sky with gentle moonlight and constellations as a peaceful tribute" },
    { id:"mem-classic",  label:"Classic Memorial", desc:"Black-tie Tribute",
      img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=300&fit=crop&q=80",
      prompt:"in elegant formal attire posed for a classic memorial portrait with deep neutral background and reverent lighting" },
    { id:"mem-rainbow",  label:"Rainbow Bridge",   desc:"Forever Remembered",
      img:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=240&h=300&fit=crop&q=80",
      prompt:"crossing a luminous rainbow bridge into radiant light, surrounded by beloved animals and flowers, hopeful and peaceful eternal crossing scene" },
    { id:"mem-cathedral",label:"Cathedral Light",  desc:"Sacred & Spiritual",
      img:"https://images.unsplash.com/photo-1520353269732-46b41a8c6887?w=240&h=300&fit=crop&q=80",
      prompt:"bathed in magnificent stained glass cathedral light with beams of red, gold, and blue streaming down, sacred and deeply spiritual atmosphere" },
    { id:"mem-mountain", label:"Mountain Summit",  desc:"Eternal Peak Serenity",
      img:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=240&h=300&fit=crop&q=80",
      prompt:"standing peacefully at a majestic mountain summit above the clouds, vast panoramic view of snow-capped peaks and endless blue sky" },
    { id:"mem-ocean",    label:"Ocean Horizon",    desc:"Peaceful Endless Sea",
      img:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=240&h=300&fit=crop&q=80",
      prompt:"standing before a breathtaking ocean horizon at golden hour, warm amber light on the water, gentle waves, and an endless peaceful seascape" },
    { id:"mem-forest",   label:"Ancient Forest",   desc:"Nature's Eternal Embrace",
      img:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=240&h=300&fit=crop&q=80",
      prompt:"standing beneath a cathedral of ancient towering trees with dappled golden light filtering through the canopy, peaceful and eternal forest atmosphere" },
    { id:"mem-field",    label:"Golden Field",     desc:"Radiant Harvest Peace",
      img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=240&h=300&fit=crop&q=80",
      prompt:"in a vast golden wheat field at dusk with warm amber light, wildflowers at the edges, and a breathtaking painted sky of orange and violet" },
  ],
  gifts: [
    { id:"gift-holiday", label:"Christmas Magic",  desc:"Festive Twinkle",
      img:"https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=240&h=300&fit=crop&q=80",
      prompt:"in a festive Christmas scene with twinkling lights, evergreen garlands, red and gold accents, cozy fireside warmth" },
    { id:"gift-birthday",label:"Birthday Bash",    desc:"Confetti Party",
      img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=240&h=300&fit=crop&q=80",
      prompt:"in a colorful birthday celebration scene with balloons, confetti, festive party lighting and joyful mood" },
    { id:"gift-love",    label:"Love Story",       desc:"Valentine's Romance",
      img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
      prompt:"in a romantic Valentine's love story portrait with heart motifs, red roses, and warm crimson and gold tones" },
    { id:"gift-legacy",  label:"Family Legacy",    desc:"Timeless Heirloom",
      img:"https://images.unsplash.com/photo-1511895426328-dc8714191011?w=240&h=300&fit=crop&q=80",
      prompt:"in a formal family legacy portrait style, dignified and classic, suitable to be treasured for generations" },
    { id:"gift-thanks",  label:"With Gratitude",   desc:"Thank You Gift",
      img:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=240&h=300&fit=crop&q=80",
      prompt:"in a warm grateful portrait setting with soft floral arrangement and gentle golden light, expressing heartfelt thanks" },
    { id:"gift-anniv",   label:"Anniversary",      desc:"Year Of Love",
      img:"https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=240&h=300&fit=crop&q=80",
      prompt:"in a romantic anniversary scene with candles, soft florals, and intimate warm lighting commemorating a milestone year" },
    { id:"gift-sports",  label:"Sports Champion",  desc:"Victory & Glory",
      img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=240&h=300&fit=crop&q=80",
      prompt:"as a champion athlete holding a golden trophy with confetti and stadium lights, triumphant victory celebration portrait" },
    { id:"gift-baby-new",label:"New Arrival",      desc:"Welcome Little One",
      img:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=240&h=300&fit=crop&q=80",
      prompt:"in a tender new baby arrival portrait with soft pastel nursery elements, ribbon bows, stars, and a 'Welcome' celebration atmosphere" },
    { id:"gift-golden",  label:"Golden Anniversary",desc:"50 Years Of Love",
      img:"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=240&h=300&fit=crop&q=80",
      prompt:"in a golden anniversary portrait with warm champagne and gold tones, roses, and elegant timeless romance celebrating decades of love" },
    { id:"gift-retire",  label:"Retirement Honor", desc:"Distinguished Career",
      img:"https://images.unsplash.com/photo-1504203700686-f21e703e5f1c?w=240&h=300&fit=crop&q=80",
      prompt:"in a distinguished retirement portrait with symbols of achievement, wisdom, and a lifetime of contribution, dignified and celebratory" },
    { id:"gift-newhome", label:"New Home",         desc:"Housewarming Joy",
      img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=240&h=300&fit=crop&q=80",
      prompt:"in a warm housewarming portrait with a charming home exterior, welcome wreath, garden flowers, and the joy of new beginnings" },
    { id:"gift-petmem",  label:"Pet Memorial",     desc:"Forever In Our Hearts",
      img:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=240&h=300&fit=crop&q=80",
      prompt:"in a tender pet memorial portrait with soft golden light, flowers, and a peaceful celestial background celebrating a beloved companion" },
  ],
  // ■■ OCCASIONS — new events + gifts + memorial merged ■■
  occasions: [
    { id:"occ-wedding",   label:"Wedding Day",      desc:"Your Special Day",
      img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=240&h=300&fit=crop&q=80",
      prompt:"at a romantic garden wedding ceremony with a floral arch, white roses, candles, and golden sunlight" },
    { id:"occ-engagement",label:"Engagement",       desc:"Celebrating Yes",
      img:"https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=240&h=300&fit=crop&q=80",
      prompt:"in a romantic engagement portrait with blush roses, cinematic lighting and soft bokeh background" },
    { id:"occ-graduation",label:"Graduation",       desc:"Cap & Gown Glory",
      img:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=240&h=300&fit=crop&q=80",
      prompt:"in academic regalia proudly holding a diploma, confetti, warm celebratory lighting and university background" },
    { id:"occ-mothers",   label:"Mother's Day",     desc:"A Tribute To Mum",
      img:"https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?w=240&h=300&fit=crop&q=80",
      prompt:"in a beautiful spring garden with blooming peonies and soft morning light, celebrating motherhood" },
    { id:"occ-fathers",   label:"Father's Day",     desc:"A Tribute To Dad",
      img:"https://images.unsplash.com/photo-1472173148041-00294f0814a2?w=240&h=300&fit=crop&q=80",
      prompt:"in a dignified outdoor portrait with warm afternoon light, celebrating fatherhood with quiet strength" },
    { id:"occ-valentine", label:"Valentine's Day",  desc:"Love In Bloom",
      img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
      prompt:"surrounded by red roses and candlelight, warm crimson and gold tones, intimate romantic atmosphere" },
    { id:"occ-birthday",  label:"Birthday Bash",    desc:"Confetti Party",
      img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=240&h=300&fit=crop&q=80",
      prompt:"in a colorful birthday celebration with balloons, confetti, festive party lighting and joyful mood" },
    { id:"occ-christmas", label:"Christmas Magic",  desc:"Festive Twinkle",
      img:"https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=240&h=300&fit=crop&q=80",
      prompt:"in a festive Christmas scene with twinkling lights, evergreen garlands, red and gold accents" },
    { id:"occ-anniv",     label:"Anniversary",      desc:"Year Of Love",
      img:"https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=240&h=300&fit=crop&q=80",
      prompt:"in a romantic anniversary scene with candles, soft florals, and intimate warm lighting" },
    { id:"occ-golden",    label:"Golden Anniversary",desc:"50 Years Of Love",
      img:"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=240&h=300&fit=crop&q=80",
      prompt:"in a golden anniversary portrait with champagne tones, roses, celebrating decades of love" },
    { id:"occ-retire",    label:"Retirement Honor", desc:"Distinguished Career",
      img:"https://images.unsplash.com/photo-1504203700686-f21e703e5f1c?w=240&h=300&fit=crop&q=80",
      prompt:"in a distinguished retirement portrait with symbols of achievement and a lifetime of contribution" },
    { id:"occ-newhome",   label:"New Home",         desc:"Housewarming Joy",
      img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=240&h=300&fit=crop&q=80",
      prompt:"in a warm housewarming portrait with a charming home, welcome wreath and the joy of new beginnings" },
    { id:"occ-angel",     label:"Guardian Angel",   desc:"Heavenly Protector",
      img:"https://images.unsplash.com/photo-1517450084074-abe5e5950bf0?w=240&h=300&fit=crop&q=80",
      prompt:"as a peaceful guardian angel with luminous white wings and celestial golden light, heavenly background" },
    { id:"occ-timeless",  label:"Timeless Portrait",desc:"Dignified & Enduring",
      img:"https://images.unsplash.com/photo-1541804048018-5975f15fc6b4?w=240&h=300&fit=crop&q=80",
      prompt:"in a dignified timeless oil painting portrait with warm neutral background and Rembrandt-style lighting" },
    { id:"occ-stars",     label:"Among The Stars",  desc:"Watching From Above",
      img:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=240&h=300&fit=crop&q=80",
      prompt:"set against a serene starry night sky with gentle moonlight and constellations as a peaceful tribute" },
    { id:"occ-rainbow",   label:"Rainbow Bridge",   desc:"Forever Remembered",
      img:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=240&h=300&fit=crop&q=80",
      prompt:"crossing a luminous rainbow bridge into radiant light, surrounded by flowers, hopeful and peaceful" },
    { id:"occ-ocean",     label:"Ocean Horizon",    desc:"Peaceful Endless Sea",
      img:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=240&h=300&fit=crop&q=80",
      prompt:"before a breathtaking ocean horizon at golden hour, warm amber light, gentle waves, endless seascape" },
    { id:"occ-garden",    label:"Heaven's Garden",  desc:"Serene Meadow",
      img:"https://images.unsplash.com/photo-1490750967868-88df5691cc9d?w=240&h=300&fit=crop&q=80",
      prompt:"in a serene heavenly flower garden with golden light filtering through ancient trees and soft mist" },
    { id:"occ-cathedral", label:"Cathedral Light",  desc:"Sacred & Spiritual",
      img:"https://images.unsplash.com/photo-1520353269732-46b41a8c6887?w=240&h=300&fit=crop&q=80",
      prompt:"bathed in magnificent stained glass cathedral light, sacred and deeply spiritual atmosphere" },
    { id:"occ-field",     label:"Golden Field",     desc:"Radiant Harvest Peace",
      img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=240&h=300&fit=crop&q=80",
      prompt:"in a vast golden wheat field at dusk with warm amber light and a breathtaking painted sky" },
  ],
};

/* THEMED SETS — niche-specific scenes grouped into Seasons / Holidays / Occasions.
   Each item has same shape as TEMPLATES so we can reuse StyleCard + handler. */
type ThemeItem = { id:string; label:string; desc:string; img:string; prompt:string };
type ThemeGroups = { Seasons:ThemeItem[]; Holidays:ThemeItem[]; Occasions:ThemeItem[] };
export const THEMES: Record<string, ThemeGroups> = {
  pets: {
    Seasons: [
      { id:"pet-winter", label:"Winter Wonder", desc:"Snowy Pet Portrait", img:"https://images.unsplash.com/photo-1551717743-49959800b1f6?w=240&h=300&fit=crop&q=80",
        prompt:"in a magical winter wonderland with soft snowfall, cozy knit scarf, pine forest and twinkling fairy lights" },
      { id:"pet-autumn", label:"Autumn Leaves", desc:"Cozy Fall Portrait", img:"https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=240&h=300&fit=crop&q=80",
        prompt:"surrounded by golden and crimson autumn leaves, pumpkins and warm afternoon light, cozy fall portrait" },
      { id:"pet-spring", label:"Spring Bloom", desc:"Cherry Blossom Pet", img:"https://images.unsplash.com/photo-1444212477490-ca407925329e?w=240&h=300&fit=crop&q=80",
        prompt:"in a blooming spring meadow with cherry blossoms, soft pastel petals and warm sunlight" },
      { id:"pet-summer", label:"Summer Sun", desc:"Beach Day Portrait", img:"https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=240&h=300&fit=crop&q=80",
        prompt:"enjoying a sunny summer beach with golden sand, gentle waves, palm shade and bright tropical light" },
    ],
    Holidays: [
      { id:"pet-xmas", label:"Christmas Pup", desc:"Santa Hat & Lights", img:"https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=240&h=300&fit=crop&q=80",
        prompt:"wearing a tiny Santa hat beside a decorated Christmas tree with twinkling lights, presents and cozy fireplace" },
      { id:"pet-halloween", label:"Halloween Spook", desc:"Pumpkin Patch", img:"https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=240&h=300&fit=crop&q=80",
        prompt:"in a spooky Halloween pumpkin patch with carved jack-o-lanterns, candlelight and a wizard hat" },
      { id:"pet-easter", label:"Easter Bunny", desc:"Pastel Spring Festive", img:"https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=240&h=300&fit=crop&q=80",
        prompt:"in a cheerful Easter scene with pastel eggs, fresh tulips, bunny ears and soft spring light" },
      { id:"pet-thanksgiving", label:"Thanksgiving Feast", desc:"Harvest Table", img:"https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=240&h=300&fit=crop&q=80",
        prompt:"at a Thanksgiving harvest table with autumn gourds, golden corn and warm candlelight" },
    ],
    Occasions: [
      { id:"pet-birthday", label:"Pet Birthday", desc:"Party Hat & Treats", img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=240&h=300&fit=crop&q=80",
        prompt:"wearing a colorful birthday party hat surrounded by balloons, confetti and a doggy birthday cake" },
      { id:"pet-adoption", label:"Adoption Day", desc:"Gotcha Day Portrait", img:"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=240&h=300&fit=crop&q=80",
        prompt:"in a heartwarming gotcha-day celebration scene with a 'forever home' banner, paw heart bunting and warm golden light" },
      { id:"pet-wedding", label:"Ring Bearer", desc:"Wedding Day Pup", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=240&h=300&fit=crop&q=80",
        prompt:"as a wedding ring bearer in a tiny floral collar with wedding florals, soft white draping and romantic golden light" },
    ],
  },
  babies: {
    Seasons: [
      { id:"bb-winter", label:"Winter Baby", desc:"Snowy Knit Cuddle", img:"https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=240&h=300&fit=crop&q=80",
        prompt:"bundled in soft white knitwear in a magical snowy winter scene with twinkling lights and frosted pines" },
      { id:"bb-autumn", label:"Autumn Baby", desc:"Pumpkin Patch Cutie", img:"https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=240&h=300&fit=crop&q=80",
        prompt:"nestled among autumn pumpkins, golden leaves and warm orange light in a cozy fall portrait" },
      { id:"bb-spring", label:"Spring Baby", desc:"Floral Meadow", img:"https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=240&h=300&fit=crop&q=80",
        prompt:"in a soft pastel spring meadow with tulips, daisies and gentle morning light" },
      { id:"bb-summer", label:"Summer Baby", desc:"Sunny Sandcastle", img:"https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=240&h=300&fit=crop&q=80",
        prompt:"on a sunny beach with sandcastles, seashells, soft waves and a tiny sunhat" },
    ],
    Holidays: [
      { id:"bb-xmas", label:"First Christmas", desc:"Santa's Little Helper", img:"https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=240&h=300&fit=crop&q=80",
        prompt:"as Santa's little helper in tiny red and white outfit beside a sparkling Christmas tree with stockings and cocoa" },
      { id:"bb-halloween", label:"Tiny Pumpkin", desc:"Cute Costume", img:"https://images.unsplash.com/photo-1572783973900-d1b67659e7d8?w=240&h=300&fit=crop&q=80",
        prompt:"dressed as an adorable tiny pumpkin in a cozy Halloween nursery scene with soft candle glow and gourds" },
      { id:"bb-easter", label:"Easter Bunny", desc:"Pastel Eggs", img:"https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=240&h=300&fit=crop&q=80",
        prompt:"in a soft pastel Easter scene with bunny ears, decorated eggs, baby chicks and spring tulips" },
      { id:"bb-valentine", label:"Little Valentine", desc:"Heart & Roses", img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender Valentine's portrait with tiny heart accessories, soft red roses and warm pink light" },
    ],
    Occasions: [
      { id:"bb-newborn", label:"Newborn Welcome", desc:"First Days Home", img:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender newborn welcome portrait with soft swaddling, name banner, fresh florals and gentle natural light" },
      { id:"bb-1stbday", label:"First Birthday", desc:"Cake Smash Magic", img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=240&h=300&fit=crop&q=80",
        prompt:"in a joyful first birthday cake-smash scene with a number 1 balloon, confetti and pastel party decor" },
      { id:"bb-baptism", label:"Baptism Day", desc:"Sacred Christening", img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=240&h=300&fit=crop&q=80",
        prompt:"in a sacred christening portrait with a flowing white gown, soft cathedral light, fresh white florals and reverent atmosphere" },
    ],
  },
  couples: {
    Seasons: [
      { id:"cp-winter", label:"Winter Romance", desc:"Snowfall Embrace", img:"https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple embracing in a romantic winter snowfall, cozy coats and scarves, twinkling lights and pine forest backdrop" },
      { id:"cp-autumn", label:"Autumn Stroll", desc:"Golden Leaves Walk", img:"https://images.unsplash.com/photo-1508804052814-cd3ba865a116?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple strolling through a golden autumn forest with warm sweaters, falling leaves and amber sunlight" },
      { id:"cp-spring", label:"Spring Petals", desc:"Cherry Blossom Love", img:"https://images.unsplash.com/photo-1490375235684-bf17e57608bd?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple under a cherry blossom canopy with drifting petals, soft pastel light and romantic spring atmosphere" },
      { id:"cp-summer", label:"Summer Sunset", desc:"Beach Romance", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple on a golden hour beach with warm sunset light, gentle ocean waves and breezy summer atmosphere" },
    ],
    Holidays: [
      { id:"cp-xmas", label:"Christmas Couple", desc:"By The Tree", img:"https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple beside a glowing Christmas tree in matching cozy sweaters with mugs of cocoa and warm fireside light" },
      { id:"cp-valentine", label:"Valentine's Vow", desc:"Roses & Candlelight", img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple in a romantic Valentine's portrait with red roses, candlelight, heart motifs and warm crimson tones" },
      { id:"cp-newyear", label:"New Year's Kiss", desc:"Midnight Sparkle", img:"https://images.unsplash.com/photo-1546565111-1d6e0e258854?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple sharing a midnight kiss under sparkling fireworks and confetti in elegant New Year's eve attire" },
      { id:"cp-halloween", label:"Halloween Pair", desc:"Costume Couple", img:"https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=240&h=300&fit=crop&q=80",
        prompt:"as a couple in matching elegant Halloween costumes — vampire and gothic bride — with candlelit pumpkins and moody atmosphere" },
    ],
    Occasions: [
      { id:"cp-wedding", label:"Wedding Day", desc:"Bride & Groom", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=240&h=300&fit=crop&q=80",
        prompt:"as a bride and groom in elegant wedding attire with white florals, soft veils, romantic golden light and timeless wedding portrait composition" },
      { id:"cp-engagement", label:"Engagement", desc:"The Proposal", img:"https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=240&h=300&fit=crop&q=80",
        prompt:"in a romantic engagement portrait with a sparkling ring, soft florals, dreamy bokeh background and warm golden light" },
      { id:"cp-anniv", label:"Anniversary", desc:"Years Of Love", img:"https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=240&h=300&fit=crop&q=80",
        prompt:"in an anniversary portrait celebrating years of love with candles, soft florals and warm timeless lighting" },
      { id:"cp-babymoon", label:"Babymoon", desc:"Expecting Glow", img:"https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender expecting-couple maternity portrait with soft flowing fabrics, gentle florals and warm golden light" },
    ],
  },
  people: {
    Seasons: [
      { id:"pp-winter", label:"Winter Portrait", desc:"Snowfall Glow", img:"https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?w=240&h=300&fit=crop&q=80",
        prompt:"in a winter portrait with cozy knitwear, soft snowfall, pine forest backdrop and warm magical lighting" },
      { id:"pp-autumn", label:"Autumn Mood", desc:"Golden Hour Fall", img:"https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=240&h=300&fit=crop&q=80",
        prompt:"in a golden autumn portrait with warm sweaters, falling leaves and amber sunset light" },
      { id:"pp-spring", label:"Spring Bloom", desc:"Floral Field", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=300&fit=crop&q=80",
        prompt:"in a spring portrait set in a blooming floral field with soft pastel light and fresh wildflowers" },
      { id:"pp-summer", label:"Summer Glow", desc:"Beach Sunset", img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=300&fit=crop&q=80",
        prompt:"in a sunny summer portrait at golden hour by the ocean with warm light and breezy atmosphere" },
    ],
    Holidays: [
      { id:"pp-xmas", label:"Holiday Portrait", desc:"Christmas Glow", img:"https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=240&h=300&fit=crop&q=80",
        prompt:"in a festive Christmas portrait beside a sparkling tree with cozy sweater, fireplace warmth and twinkling lights" },
      { id:"pp-halloween", label:"Halloween Style", desc:"Elegant Costume", img:"https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=240&h=300&fit=crop&q=80",
        prompt:"in an elegant Halloween portrait — vampire, witch or masquerade — with moody candlelight and gothic atmosphere" },
      { id:"pp-thanksgiving", label:"Thanksgiving", desc:"Family Gathering", img:"https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=240&h=300&fit=crop&q=80",
        prompt:"in a warm Thanksgiving portrait at a harvest table with autumn florals, candlelight and golden seasonal tones" },
      { id:"pp-valentine", label:"Valentine's Day", desc:"Romantic Roses", img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
        prompt:"in a Valentine's portrait with red roses, soft heart motifs and warm romantic lighting" },
    ],
    Occasions: [
      { id:"pp-wedding", label:"Wedding Guest", desc:"Black Tie Elegance", img:"https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=240&h=300&fit=crop&q=80",
        prompt:"in formal wedding attire with elegant tuxedo or gown, soft chandelier light and refined ballroom backdrop" },
      { id:"pp-grad", label:"Graduation", desc:"Cap & Gown", img:"https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=240&h=300&fit=crop&q=80",
        prompt:"in a triumphant graduation portrait with cap, gown, diploma, university backdrop and proud golden light" },
      { id:"pp-bday", label:"Birthday", desc:"Celebration Glow", img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=240&h=300&fit=crop&q=80",
        prompt:"in a joyful birthday portrait with balloons, confetti, cake and festive party lighting" },
      { id:"pp-retire", label:"Retirement", desc:"Distinguished Honor", img:"https://images.unsplash.com/photo-1504203700686-f21e703e5f1c?w=240&h=300&fit=crop&q=80",
        prompt:"in a distinguished retirement portrait with symbols of a lifetime of achievement, warm dignified lighting" },
    ],
  },
  memorial: {
    Seasons: [
      { id:"mm-winter", label:"Winter Peace", desc:"Snowfall Tribute", img:"https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=240&h=300&fit=crop&q=80",
        prompt:"in a peaceful winter memorial scene with gentle snowfall, soft moonlight and a serene snow-covered landscape" },
      { id:"mm-autumn", label:"Autumn Memory", desc:"Falling Leaves", img:"https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender autumn memorial scene with golden falling leaves, warm amber light and reflective atmosphere" },
      { id:"mm-spring", label:"Spring Renewal", desc:"Blossom Tribute", img:"https://images.unsplash.com/photo-1490375235684-bf17e57608bd?w=240&h=300&fit=crop&q=80",
        prompt:"in a hopeful spring memorial portrait with soft cherry blossoms, gentle sunlight and atmosphere of renewal" },
      { id:"mm-summer", label:"Summer Light", desc:"Endless Horizon", img:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=240&h=300&fit=crop&q=80",
        prompt:"in a peaceful summer memorial scene with warm golden hour light over an endless ocean horizon" },
    ],
    Holidays: [
      { id:"mm-xmas", label:"Christmas Memory", desc:"Empty Chair At Table", img:"https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender Christmas memorial portrait with a glowing tree, candlelight and a warm 'always with us' atmosphere" },
      { id:"mm-bday", label:"Birthday In Heaven", desc:"Forever Loved", img:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=240&h=300&fit=crop&q=80",
        prompt:"in a heavenly birthday memorial portrait with soft balloons, golden light and angelic atmosphere" },
      { id:"mm-mothersday", label:"Mother's Day", desc:"Tribute To Mom", img:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=240&h=300&fit=crop&q=80",
        prompt:"in a loving Mother's Day memorial portrait with soft florals, warm light and reverent peaceful tone" },
    ],
    Occasions: [
      { id:"mm-anniv", label:"Anniversary", desc:"Forever In Heart", img:"https://images.unsplash.com/photo-1517450084074-abe5e5950bf0?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender anniversary memorial portrait with soft golden light, candles and reverent flowers" },
      { id:"mm-celeb", label:"Celebration Of Life", desc:"Joyful Tribute", img:"https://images.unsplash.com/photo-1490750967868-88df5691cc9d?w=240&h=300&fit=crop&q=80",
        prompt:"in a joyful celebration-of-life portrait with bright florals, warm sunshine and a hopeful uplifting atmosphere" },
      { id:"mm-petloss", label:"Pet Tribute", desc:"Beloved Companion", img:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=240&h=300&fit=crop&q=80",
        prompt:"in a tender pet memorial portrait with celestial light, soft flowers and a peaceful 'forever loved' atmosphere" },
    ],
  },
  gifts: {
    Seasons: [
      { id:"gf-winter", label:"Winter Gift", desc:"Snowy Keepsake", img:"https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=240&h=300&fit=crop&q=80",
        prompt:"in a winter gift portrait with snowfall, cozy knitwear, twinkling lights and warm seasonal magic" },
      { id:"gf-autumn", label:"Autumn Gift", desc:"Harvest Tones", img:"https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=240&h=300&fit=crop&q=80",
        prompt:"in a warm autumn gift portrait with golden leaves, pumpkins and amber harvest light" },
      { id:"gf-spring", label:"Spring Gift", desc:"Floral Surprise", img:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=240&h=300&fit=crop&q=80",
        prompt:"in a fresh spring gift portrait with blooming florals, pastel light and joyful uplifting atmosphere" },
      { id:"gf-summer", label:"Summer Gift", desc:"Sunny Memory", img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=300&fit=crop&q=80",
        prompt:"in a sunny summer gift portrait with golden beach light, warm tones and joyful summer atmosphere" },
    ],
    Holidays: [
      { id:"gf-xmas", label:"Christmas Gift", desc:"Under The Tree", img:"https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=240&h=300&fit=crop&q=80",
        prompt:"in a festive Christmas gift portrait with sparkling tree, gold ribbon, presents and warm fireside glow" },
      { id:"gf-mothersday", label:"Mother's Day", desc:"For Mom", img:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=240&h=300&fit=crop&q=80",
        prompt:"in a loving Mother's Day gift portrait with soft pastel florals, warm light and tender heartfelt mood" },
      { id:"gf-fathersday", label:"Father's Day", desc:"For Dad", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=300&fit=crop&q=80",
        prompt:"in a distinguished Father's Day gift portrait with warm wood tones, classic styling and proud heartfelt mood" },
      { id:"gf-valentine", label:"Valentine's Gift", desc:"Heartfelt Love", img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
        prompt:"in a romantic Valentine's gift portrait with red roses, candlelight, heart motifs and warm crimson tones" },
    ],
    Occasions: [
      { id:"gf-wedding", label:"Wedding Gift", desc:"Bridal Keepsake", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=240&h=300&fit=crop&q=80",
        prompt:"in a refined wedding gift portrait with white florals, soft veils, warm chandelier light and timeless bridal mood" },
      { id:"gf-anniv", label:"Anniversary Gift", desc:"Years Together", img:"https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=240&h=300&fit=crop&q=80",
        prompt:"in an elegant anniversary gift portrait with candles, soft florals and warm timeless romance" },
      { id:"gf-grad", label:"Graduation Gift", desc:"Cap & Diploma", img:"https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=240&h=300&fit=crop&q=80",
        prompt:"in a proud graduation gift portrait with cap, gown, diploma and university backdrop in warm celebratory light" },
      { id:"gf-housewarm", label:"Housewarming", desc:"New Home Gift", img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=240&h=300&fit=crop&q=80",
        prompt:"in a warm housewarming gift portrait with charming home exterior, welcome wreath and joyful new-beginnings mood" },
    ],
  },
  occasions: {
    Seasons: [
      { id:"occ-s-winter", label:"Winter Occasion", desc:"Festive Cold Season", img:"https://images.unsplash.com/photo-1551717743-49959800b1f6?w=240&h=300&fit=crop&q=80",
        prompt:"in a magical winter setting with soft snow, warm layered clothing, and festive seasonal atmosphere" },
      { id:"occ-s-spring", label:"Spring Occasion", desc:"Fresh New Beginnings", img:"https://images.unsplash.com/photo-1444212477490-ca407925329e?w=240&h=300&fit=crop&q=80",
        prompt:"in a beautiful spring setting with blooming flowers, fresh air and the joy of new seasons" },
      { id:"occ-s-summer", label:"Summer Occasion", desc:"Warm Golden Hour", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=240&h=300&fit=crop&q=80",
        prompt:"in a warm summer outdoor portrait with golden afternoon light and beautiful natural backdrop" },
      { id:"occ-s-autumn", label:"Autumn Occasion", desc:"Harvest Season", img:"https://images.unsplash.com/photo-1507666405895-422eee7d517f?w=240&h=300&fit=crop&q=80",
        prompt:"in a rich autumn setting with golden and crimson leaves, harvest warmth and cozy atmosphere" },
    ],
    Holidays: [
      { id:"occ-h-xmas", label:"Christmas", desc:"Holiday Season Magic", img:"https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=240&h=300&fit=crop&q=80",
        prompt:"in a festive Christmas scene with twinkling lights, evergreen garlands, red and gold accents" },
      { id:"occ-h-val", label:"Valentine's Day", desc:"Love Celebration", img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=240&h=300&fit=crop&q=80",
        prompt:"surrounded by red roses and candles, intimate romantic Valentine's portrait" },
      { id:"occ-h-easter", label:"Easter", desc:"Springtime Joy", img:"https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=240&h=300&fit=crop&q=80",
        prompt:"in a cheerful Easter portrait with pastel eggs, spring flowers and soft natural light" },
      { id:"occ-h-thanks", label:"Thanksgiving", desc:"Harvest Gratitude", img:"https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=240&h=300&fit=crop&q=80",
        prompt:"at a Thanksgiving harvest table with autumn gourds, golden corn and warm candlelight" },
    ],
    Occasions: [
      { id:"occ-o-bday", label:"Birthday", desc:"Celebrate Their Day", img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=240&h=300&fit=crop&q=80",
        prompt:"in a colorful birthday celebration with balloons, confetti and joyful party atmosphere" },
      { id:"occ-o-anniv", label:"Anniversary", desc:"Milestone Celebration", img:"https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=240&h=300&fit=crop&q=80",
        prompt:"in a romantic anniversary setting with candles, florals and intimate warm light" },
    ],
  },
};

// Sub-type selectors — shown on StyleSelectPage for people + occasions.
// Pets has no sub-type (AI reads the photo directly).
export const SUBTYPES: Record<string, {
  id: string; label: string; desc: string; img: string; context: string;
}[]> = {
  people: [
    { id:"baby",         label:"Baby",         desc:"Newborns to toddlers",
      img:"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop&q=80",
      context:"The subject is a baby or young child. Keep the style whimsical, soft and magical." },
    { id:"couple",       label:"Couple",       desc:"Partners & pairs",
      img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80",
      context:"The subjects are a couple. The composition should feature both people prominently together." },
    { id:"family",       label:"Family",       desc:"Groups & generations",
      img:"https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&h=400&fit=crop&q=80",
      context:"The subjects are a family group. Include all members in a natural, warm composition." },
    { id:"individual",   label:"Individual",   desc:"Solo portraits",
      img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&q=80",
      context:"The subject is a single individual. Focus entirely on them in a strong portrait composition." },
    { id:"graduation",   label:"Graduation",   desc:"Academic achievement",
      img:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop&q=80",
      context:"This is a graduation portrait. Incorporate academic achievement, cap and gown elements." },
    { id:"maternity",    label:"Maternity",    desc:"Expecting mothers",
      img:"https://images.unsplash.com/photo-1584467735871-a4a647ea2f90?w=400&h=400&fit=crop&q=80",
      context:"The subject is expecting a baby. Celebrate this moment with warmth, softness and maternal beauty." },
    { id:"grandparents", label:"Grandparents", desc:"Senior portraits",
      img:"https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=400&fit=crop&q=80",
      context:"The subjects are grandparents or seniors. Celebrate their wisdom, warmth and dignity." },
    { id:"friends",      label:"Friends",      desc:"Groups & BFFs",
      img:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&q=80",
      context:"The subjects are friends. Capture genuine joy, connection and fun group energy." },
    { id:"professional", label:"Professional", desc:"Headshots & brand",
      img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
      context:"This is a professional portrait. Keep composition polished, confident and suited for business use." },
    { id:"creator",      label:"Creator",      desc:"Influencers & artists",
      img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop&q=80",
      context:"The subject is a content creator or artist. Lean into bold, editorial and visually distinctive styles." },
  ],
  occasions: [
    { id:"birthday",    label:"Birthday",       desc:"Celebrate their day",
      img:"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop&q=80",
      context:"This is a birthday portrait. Incorporate celebratory elements, joy and festive energy." },
    { id:"wedding",     label:"Wedding",        desc:"Your special day",
      img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80",
      context:"This is a wedding portrait. Feature romantic florals, elegant setting and timeless romance." },
    { id:"anniversary", label:"Anniversary",    desc:"Years of love",
      img:"https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=400&h=400&fit=crop&q=80",
      context:"This is an anniversary portrait. Capture enduring love, warmth and shared history." },
    { id:"memorial",    label:"Memorial",       desc:"A life celebrated",
      img:"https://images.unsplash.com/photo-1517450084074-abe5e5950bf0?w=400&h=400&fit=crop&q=80",
      context:"This is a memorial portrait. Treat with deep care and dignity. Soft, reverent and timeless." },
    { id:"mothers-day", label:"Mother's Day",   desc:"Honor mum",
      img:"https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?w=400&h=400&fit=crop&q=80",
      context:"This is a Mother's Day portrait. Celebrate warmth, nurturing love and maternal beauty." },
    { id:"fathers-day", label:"Father's Day",   desc:"Honor dad",
      img:"https://images.unsplash.com/photo-1472173148041-00294f0814a2?w=400&h=400&fit=crop&q=80",
      context:"This is a Father's Day portrait. Celebrate strength, quiet dignity and paternal warmth." },
    { id:"christmas",   label:"Christmas",      desc:"Holiday season",
      img:"https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=400&fit=crop&q=80",
      context:"This is a Christmas portrait. Include festive seasonal elements, warm lights and holiday joy." },
    { id:"valentines",  label:"Valentine's Day",desc:"For your love",
      img:"https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop&q=80",
      context:"This is a Valentine's Day portrait. Romantic, intimate and full of love and warmth." },
    { id:"graduation",  label:"Graduation",     desc:"Academic milestone",
      img:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop&q=80",
      context:"This is a graduation portrait. Celebrate academic achievement, pride and new beginnings." },
    { id:"retirement",  label:"Retirement",     desc:"A new chapter",
      img:"https://images.unsplash.com/photo-1504203700686-f21e703e5f1c?w=400&h=400&fit=crop&q=80",
      context:"This is a retirement portrait. Celebrate a distinguished career and the joy of a new chapter." },
    { id:"engagement",  label:"Engagement",     desc:"Saying yes",
      img:"https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=400&fit=crop&q=80",
      context:"This is an engagement portrait. Capture the joy, excitement and romance of a new commitment." },
    { id:"new-home",    label:"New Home",       desc:"Housewarming joy",
      img:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=400&fit=crop&q=80",
      context:"This is a housewarming portrait. Celebrate new beginnings, home and a fresh chapter of life." },
  ],
};

// Live teaser — one per category, cycles automatically
const TEASERS = [
    { cat:"Best Friend", catId:"pets", style:"Editorial", before:beforePets, after:scenePetBestfriend, portrait:scenePetBestfriend,
      portraits:[ { url:scenePetBestfriend, style:"Editorial" } ] },
     { cat:"Cat Mom", catId:"pets", style:"Editorial", before:beforePetCatHug, after:scenePetCatHug, portrait:scenePetCatHug,
       portraits:[ { url:scenePetCatHug, style:"Editorial" } ] },
     { cat:"Little Chef", catId:"babies", style:"Whimsical",  before:beforeBabyChef,   after:sceneBabyChef,        portrait:sceneBabyChef,
       portraits:[ { url:sceneBabyChef, style:"Whimsical" } ] },
    { cat:"Babies",   catId:"people",   style:"Royal",       before:beforeBabies, after:portraitBabiesRoyal,  portrait:portraitBabiesRoyal,
      portraits:[
        { url:portraitBabiesRoyal,     style:"Royal" },
        { url:sceneBabiesSkateboard,   style:"Cinematic" },
        { url:sceneBabiesSuperman,     style:"Fantasy" },
        { url:sceneBabiesSoccer,       style:"Storybook" },
        { url:portraitBabiesRen,       style:"Renaissance" },
        { url:portraitBabiesMin,       style:"Minimal" },
      ] },
    { cat:"Restored", catId:"occasions", style:"Archival",   before:beforeVintage,    after:sceneVintageRestored, portrait:sceneVintageRestored,
      portraits:[ { url:sceneVintageRestored, style:"Archival" } ] },
    { cat:"Wedding",  catId:"occasions", style:"Heirloom",   before:beforeWedding,    after:sceneWeddingHeirloom, portrait:sceneWeddingHeirloom,
      portraits:[ { url:sceneWeddingHeirloom, style:"Heirloom" } ] },
    { cat:"Family",   catId:"occasions",style:"Heirloom",     before:beforeMemorial, after:sceneMemorial,portrait:sceneMemorial,
     portraits:[
       { url:sceneMemorial,        style:"Heirloom" },
       { url:portraitMemorialRoyal, style:"Royal" },
       { url:portraitMemorialRen,   style:"Renaissance" },
       { url:portraitMemorialStory, style:"Storybook" },
       { url:portraitMemorialFan,   style:"Fantasy" },
       { url:portraitMemorialCine,  style:"Cinematic" },
       { url:portraitMemorial,      style:"Minimal" },
      ] },
      { cat:"Storyteller", catId:"pets", style:"Whimsical", before:beforePetCat, after:scenePetCatReader, portrait:scenePetCatReader,
        portraits:[ { url:scenePetCatReader, style:"Whimsical" } ] },
    { cat:"Professional",   catId:"people",   style:"Cinematic",   before:beforePeople, after:scenePeople,  portrait:scenePeople,
      portraits:[
        { url:scenePeople,        style:"Cinematic" },
        { url:portraitPeopleRoyal, style:"Royal" },
        { url:portraitPeopleRen,   style:"Renaissance" },
        { url:portraitPeopleStory, style:"Storybook" },
        { url:portraitPeople,      style:"Fantasy" },
        { url:portraitPeopleCine,  style:"Cinematic" },
        { url:portraitPeopleMin,   style:"Minimal" },
      ] },
      { cat:"Grandparents", catId:"occasions", style:"Editorial", before:beforeFamilyGrandparents, after:sceneFamilyGrandparentsJoy, portrait:sceneFamilyGrandparentsJoy,
        portraits:[ { url:sceneFamilyGrandparentsJoy, style:"Editorial" } ] },
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

// Social proof shown during generation — rotate through customer portraits
const SOCIAL_PROOF_BY_CAT: Record<string, { img: string; style: string; review: string }[]> = {
  pets: [
    { img: proofPetsRoyal, style:"Royal", review:'"My golden looks like royalty — I cried." — Jessica T.' },
    { img: proofPetsStory, style:"Storybook", review:'"My dog passed away last year. This is priceless." — Mark R.' },
    { img: proofPetsRen, style:"Renaissance", review:'"Everyone at the office asks where I got it." — Sarah M.' },
    { img: proofPetsFan, style:"Fantasy", review:'"It captured my pup\'s personality perfectly." — David L.' },
    { img: proofPetsCine, style:"Cinematic", review:'"Hands down the best gift I\'ve ever bought." — Amy K.' },
    { img: proofPetsMin, style:"Minimal", review:'"Beautiful, modern, and exactly what I wanted." — Tom W.' },
  ],
  babies: [
    { img: proofBabiesRoyal, style:"Royal", review:'"A keepsake we\'ll treasure forever." — Jessica T.' },
    { img: proofBabiesRen, style:"Renaissance", review:'"Looks like an heirloom painting." — Sarah M.' },
    { img: proofBabiesFan, style:"Fantasy", review:'"Magical — my baby looks like a little dream." — David L.' },
    { img: proofBabiesCine, style:"Cinematic", review:'"My mom hasn\'t stopped talking about it." — Amy K.' },
    { img: proofBabiesMin, style:"Minimal", review:'"Clean, modern, and absolutely beautiful." — Tom W.' },
  ],
  couples: [
    { img: proofCouplesRoyal, style:"Royal", review:'"The perfect anniversary gift." — Jessica T.' },
    { img: proofCouplesRen, style:"Renaissance", review:'"Looks like a museum piece of us." — Sarah M.' },
    { img: proofCouplesStory, style:"Storybook", review:'"So sweet — it tells our love story." — Mark R.' },
    { img: proofCouplesFan, style:"Fantasy", review:'"Otherworldly and romantic." — David L.' },
    { img: proofCouplesCine, style:"Cinematic", review:'"Looks like a movie poster of us." — Amy K.' },
    { img: proofCouplesMin, style:"Minimal", review:'"Elegant and timeless." — Tom W.' },
  ],
  people: [
    { img: proofPeopleRoyal, style:"Royal", review:'"I cried when I saw it — it\'s perfect." — Jessica T.' },
    { img: proofPeopleRen, style:"Renaissance", review:'"Everyone at the office asks where I got it." — Sarah M.' },
    { img: proofPeopleStory, style:"Storybook", review:'"Whimsical and so charming." — Mark R.' },
    { img: proofPeopleCine, style:"Cinematic", review:'"It looks like a movie poster of me." — Amy K.' },
    { img: proofPeopleMin, style:"Minimal", review:'"Clean and gallery-quality." — Tom W.' },
  ],
  memorial: [
    { img: proofMemorialRoyal, style:"Royal", review:'"A beautiful tribute — thank you." — Jessica T.' },
    { img: proofMemorialRen, style:"Renaissance", review:'"It honors them perfectly." — Sarah M.' },
    { img: proofMemorialStory, style:"Storybook", review:'"Gentle and heartwarming." — Mark R.' },
    { img: proofMemorialFan, style:"Fantasy", review:'"It brought tears to my eyes." — David L.' },
    { img: proofMemorialCine, style:"Cinematic", review:'"A keepsake we\'ll cherish forever." — Amy K.' },
  ],
  gifts: [
    { img: proofGiftsRoyal, style:"Royal", review:'"Best birthday gift I\'ve ever given." — Tom W.' },
    { img: proofGiftsStory, style:"Storybook", review:'"They were speechless." — Mark R.' },
    { img: proofGiftsFan, style:"Fantasy", review:'"Otherworldly — they loved it." — David L.' },
    { img: proofGiftsCine, style:"Cinematic", review:'"Movie-quality artwork." — Amy K.' },
    { img: proofGiftsMin, style:"Minimal", review:'"Tasteful and elegant." — Sarah M.' },
  ],
};

const getSocialProof = (cat?: string) =>
  (cat && SOCIAL_PROOF_BY_CAT[cat]) || SOCIAL_PROOF_BY_CAT.people;

// Default deck used outside generation contexts
const SOCIAL_PROOF = SOCIAL_PROOF_BY_CAT.people;



/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */
function CardSlideshow({ imgs, alt, interval = 2800 }: { imgs: string[]; alt: string; interval?: number }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % imgs.length), interval);
    return () => clearInterval(t);
  }, [imgs.length, interval]);
  return (
    <div style={{ position:"absolute", inset:0, background:"#000" }}>
      {imgs.map((src, i) => (
        <img key={src} src={src} alt={alt} loading="lazy"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            objectPosition:"center center",
            opacity: i === idx ? 1 : 0, transition:"opacity .8s ease-in-out" }}/>
      ))}
      <div style={{ position:"absolute", bottom:10, left:0, right:0, display:"flex", justifyContent:"center", gap:5, zIndex:2 }}>
        {imgs.map((_, i) => (
          <span key={i} style={{ width: i===idx ? 16 : 5, height:5, borderRadius:999,
            background: i===idx ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.5)", transition:"all .3s" }}/>
        ))}
      </div>
    </div>
  );
}

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
function LiveTeaser({ activeCat, onCatClick, preferredSlide }: { activeCat: string; onCatClick: (c:string)=>void; preferredSlide?: string|null }) {
  const [idx, setIdx] = useState(0);

  // Preload all teaser images once so transitions don't flash while loading
  useEffect(() => {
    TEASERS.forEach(t => {
      const a = new Image(); a.src = t.before;
      const variants = t.portraits || [{ url: t.portrait }];
      variants.forEach(v => { const b = new Image(); b.src = v.url; });
    });
  }, []);

  // Preferred slide override takes precedence (e.g. nav "Occasions" → Wedding)
  useEffect(() => {
    if (!preferredSlide) return;
    const m = TEASERS.findIndex(t => t.cat === preferredSlide);
    if (m >= 0) setIdx(m);
  }, [preferredSlide]);

  // When user picks a category, jump to matching teaser
  useEffect(() => {
    if (!activeCat || preferredSlide) return;
    const match = TEASERS.findIndex(t => t.catId === activeCat);
    if (match >= 0 && match !== idx) setIdx(match);
  }, [activeCat]); // eslint-disable-line

  // Auto-rotate when no category selected
  useEffect(() => {
    if (activeCat) return;
    const iv = setInterval(() => {
      setIdx(p => (p + 1) % TEASERS.length);
    }, 3600);
    return () => clearInterval(iv);
  }, [activeCat]);

  const safeIdx = TEASERS.length ? idx % TEASERS.length : 0;
  const cur = TEASERS[safeIdx];
  if (!cur) return null;
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

        {/* LEFT: Your Photo (crossfade stack) */}
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden",
          border:`1px solid ${T.bGold}`, background:"#fff",
          boxShadow:"0 8px 24px rgba(0,0,0,.08)", minHeight:340 }}>
          {TEASERS.map((t, i) => (
            <img key={`b-${i}`} src={t.before} alt=""
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
                opacity: i===idx ? 1 : 0, transition:"opacity .7s ease-in-out" }}/>
          ))}
        </div>

        {/* RIGHT: Generated portraits slideshow (crossfade stack) */}
        <div style={{ position:"relative", borderRadius:12, overflow:"hidden",
          border:`1px solid ${T.bGold}`, boxShadow:"0 12px 40px rgba(0,0,0,.08)",
          background:"#F5EFE3", minHeight:340 }}>
          {TEASERS.map((t, i) => {
            const v = (t.portraits || [{ url: t.portrait }])[0];
            return (
              <img key={`p-${i}`} src={v.url} alt=""
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
                  opacity: i===idx ? 1 : 0, transition:"opacity .7s ease-in-out" }}/>
            );
          })}
          {/* "Generated Portrait" label */}
          <div style={{ position:"absolute", top:12, left:12,
            fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"#fff",
            background:"rgba(7,6,10,.78)", padding:"6px 12px", borderRadius:6, fontWeight:600 }}>
            Generated Portrait
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

      {/* Prev / Next slide controls — big, easy to tap */}
      <div style={{ display:"flex", gap:10, marginTop:14, alignItems:"center", justifyContent:"center" }}>
        <button
          onClick={() => { const n = (safeIdx - 1 + TEASERS.length) % TEASERS.length; setIdx(n); onCatClick(TEASERS[n].catId); }}
          aria-label="Previous example"
          style={{ width:44, height:44, borderRadius:22, border:`1px solid ${T.bGold}`,
            background:"#fff", cursor:"pointer", fontSize:18, color:T.gold, fontWeight:700,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          ‹
        </button>
        <div style={{ minWidth:180, textAlign:"center", padding:"10px 18px",
          borderRadius:22, background:T.gold, color:"#fff",
          fontSize:12, letterSpacing:".18em", textTransform:"uppercase", fontWeight:700 }}>
          {cur.cat} <span style={{ opacity:.7, marginLeft:6 }}>{safeIdx+1}/{TEASERS.length}</span>
        </div>
        <button
          onClick={() => { const n = (safeIdx + 1) % TEASERS.length; setIdx(n); onCatClick(TEASERS[n].catId); }}
          aria-label="Next example"
          style={{ width:44, height:44, borderRadius:22, border:`1px solid ${T.bGold}`,
            background:"#fff", cursor:"pointer", fontSize:18, color:T.gold, fontWeight:700,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          ›
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
function Step2Slides() {
  const slides = [stepAi1, stepAi7, stepAi6, stepAi4, stepAi9, stepAi8, stepAi5, stepAi10, stepAi2, stepAi3];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % slides.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position:"absolute", inset:0 }}>
      {slides.map((src, idx) => (
        <img key={idx} src={src} alt="AI portrait sample" loading="lazy" width={768} height={768}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            opacity: i === idx ? 1 : 0, transition:"opacity 700ms ease-in-out" }}/>
      ))}
    </div>
  );
}

function HomePage({ onGenerate }) {
  const { preview: photo, uploadedUrl, uploading, uploadErr, lowResWarning, loadFile, clearPhoto } = useUpload();
  const [extraLowRes, setExtraLowRes] = useState<boolean[]>([]);
  const [cat,     setCat]     = useState("");
  const [preferredTeaser, setPreferredTeaser] = useState<string|null>(null);
  const [styles,  setStyles]  = useState(STYLES.map(s => s.id));
  const [selectedTemplate, setSelectedTemplate] = useState<string|null>(null);
  const [openFaq, setOpenFaq] = useState<number|null>(0);
  const tmplStripRef = useRef<HTMLDivElement|null>(null);
  const [tmplCanL, setTmplCanL] = useState(false);
  const [tmplCanR, setTmplCanR] = useState(false);
  const updateTmplArrows = useCallback(() => {
    const el = tmplStripRef.current; if (!el) return;
    setTmplCanL(el.scrollLeft > 4);
    setTmplCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    const el = tmplStripRef.current; if (!el) return;
    updateTmplArrows();
    el.addEventListener("scroll", updateTmplArrows, { passive: true });
    window.addEventListener("resize", updateTmplArrows);
    return () => { el.removeEventListener("scroll", updateTmplArrows); window.removeEventListener("resize", updateTmplArrows); };
  }, [updateTmplArrows, cat]);
  const scrollTmpl = (dir: 1|-1) => {
    const el = tmplStripRef.current; if (!el) return;
    el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.7), behavior: "smooth" });
  };
  const [drag,    setDrag]    = useState(false);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [addSlot, setAddSlot] = useState<"primary"|"extra">("primary");
  const [heroNames, setHeroNames] = useState<string[]>([""]);
  const totalPhotos = (photo ? 1 : 0) + extraPhotos.length;
  useEffect(() => {
    setHeroNames(prev => {
      const n = Math.max(1, totalPhotos, reqFor(cat).minPhotos);
      if (prev.length === n) return prev;
      if (prev.length < n) return [...prev, ...Array(n - prev.length).fill("")];
      return prev.slice(0, n);
    });
  }, [totalPhotos, cat]);
  const heroName = heroNames.filter(Boolean).join(" & ");
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx(p => (p + 1) % SOCIAL_PROOF.length), 4200);
    return () => clearInterval(iv);
  }, []);
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
  const req = reqFor(cat);
  const canGo = !!(cat && photo && totalPhotos >= req.minPhotos);

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
    if (!cat)   return "Choose A Category To Start";
    if (!photo) return cat === "couples" ? "Upload 2 Photos To Continue →" : "Upload A Photo To Continue →";
    if (totalPhotos < req.minPhotos) {
      const remaining = req.minPhotos - totalPhotos;
      return `Add ${remaining} More Photo${remaining > 1 ? "s" : ""} To Continue →`;
    }
    return "See Your Portrait — Free Preview →";
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
        <a href="/" aria-label="Real Art home" style={{
          display:"block", textDecoration:"none", flexShrink:0,
          background:"#E61919", padding:7, width:140,
          position:"relative", top:28, /* overlaps nav bottom border */
        }}>
          <div style={{ border:"2.5px solid #fff", padding:"6px 18px",
            display:"flex", flexDirection:"column", alignItems:"center" }}>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:"2.1rem",
              fontWeight:900, color:"#fff", letterSpacing:".05em",
              lineHeight:1, textAlign:"center", display:"block" }}>REAL</span>
            <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:".52rem",
              fontWeight:700, letterSpacing:".3em", color:"#fff",
              textTransform:"uppercase", textAlign:"center",
              display:"block", marginTop:3 }}>ART</span>
          </div>
        </a>
        <div className="hid" style={{ display:"flex", gap:44, alignItems:"center",
          position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}>
          {CATS.map(c => {
            const NavIcon = c.Icon;
            return (
              <button key={c.id} onClick={() => {
                  setCat(c.id); setSelectedTemplate(null);
                  setPreferredTeaser(c.id === "occasions" ? "Wedding" : null);
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
              Turn Your Favorite Memories Into Beautiful Art In Seconds
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, alignItems:"stretch" }} className="hg hero-grid">

          {/* LEFT PANEL — teaser */}
          <div style={{ display:"flex", flexDirection:"column", gap:24, height:"100%", minWidth:0 }}>

            {/* LIVE TEASER */}
            <div className="fu" style={{ animationDelay:".3s", width:"100%",
              display:"flex", flexDirection:"column", flex:1, position:"relative" }}>
              <LiveTeaser activeCat={cat} preferredSlide={preferredTeaser} onCatClick={(c) => { setCat(c); setPreferredTeaser(null); }}/>
            </div>

          </div>

          {/* RIGHT PANEL — BUILDER CARD */}
          <div className="si" style={{ animationDelay:".1s", width:"100%", minWidth:0, justifySelf:"end" }}>
            <div style={{ background:T.sur, border:`1px solid ${T.gold}`, padding:"22px 20px",
              position:"relative", minWidth:0, overflow:"hidden",
              boxShadow:"inset 0 1px 0 rgba(196,150,58,.08)" }}>

              {/* gold top accent */}
              <div style={{ position:"absolute", top:0, left:"16%", right:"16%", height:1,
                background:`linear-gradient(90deg,transparent,${T.gold},transparent)` }}/>

              {/* ── FREE PREVIEW VALUE PROP ── */}
              <div style={{
                marginBottom:16,
                padding:"12px 14px",
                background:"#F5F3EE",
                border:`1px solid ${T.gold}`,
                borderRadius:6,
                display:"flex",
                alignItems:"center",
                gap:10,
              }}>
                <div style={{
                  width:32, height:32, flexShrink:0, borderRadius:"50%",
                  background:T.gold, color:T.bg,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, fontWeight:700,
                }}>
                  <Sparkles size={16} strokeWidth={2.2}/>
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:16, lineHeight:1.15, color:T.cream, fontWeight:600,
                  }}>
                    Preview Your Portrait — Free Before You Buy
                  </div>
                  <div style={{
                    fontSize:11, color:T.muted, marginTop:3, letterSpacing:".02em",
                  }}>
                    See exactly what you'll get in 60 seconds. No card. No risk.
                  </div>
                </div>
              </div>

              {/* ── WHO IS THIS FOR ── */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, letterSpacing:".24em", color:T.gold, textTransform:"uppercase",
                  fontWeight:500, marginBottom:8 }}>What Are You Creating?</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {CATS.map(c => {
                    const CIcon = c.Icon;
                    return (
                      <button key={c.id} className={`chip cat ${cat===c.id?"on":""}`} onClick={() => { setCat(c.id); setSelectedTemplate(null); }}>
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
                  {req.uploadHeading}{req.minPhotos > 1 && (
                    <span style={{ marginLeft:8, color:T.cream, letterSpacing:".04em",
                      textTransform:"none", fontSize:10, fontWeight:500 }}>
                      ({totalPhotos}/{req.minPhotos})
                    </span>
                  )}
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
                    <p style={{ fontSize:12, color:T.cream, marginBottom:3 }}>
                      {cat === "couples" ? "Drop The First Partner's Photo Or Click To Upload" : "Drop Your Photo Here Or Click To Upload"}
                    </p>
                    <p style={{ fontSize:10, color:T.muted, lineHeight:1.55 }}>
                      {req.uploadHint}
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
                        low: extraLowRes[i],
                        onRemove: () => {
                          setExtraPhotos(p => p.filter((_, j) => j !== i));
                          setExtraLowRes(p => p.filter((_, j) => j !== i));
                        },
                      }))
                    ].map((item: any, i) => {
                      const isLow = i === 0 ? !!lowResWarning : !!item.low;
                      return (
                      <div key={i} style={{ position:"relative", width:90, height:70, borderRadius:10,
                        overflow:"hidden", border:`1px solid ${isLow ? "#E0A040" : T.bGold}`, background:"rgba(255,255,255,.04)" }}>
                        <img src={item.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                        {isLow && (
                          <div title="Low resolution" style={{ position:"absolute", left:4, bottom:4,
                            background:"rgba(224,160,64,.95)", color:"#1a1208", fontSize:8, fontWeight:700,
                            letterSpacing:".05em", padding:"2px 5px", borderRadius:4, display:"flex",
                            alignItems:"center", gap:3 }}>
                            <AlertCircle size={9} strokeWidth={3}/>LOW-RES
                          </div>
                        )}
                        <button onClick={item.onRemove} aria-label="Remove photo"
                          style={{ position:"absolute", top:4, right:4, width:18, height:18,
                            background:"#E0353F", border:"none", borderRadius:"50%", display:"flex",
                            alignItems:"center", justifyContent:"center", cursor:"pointer",
                            boxShadow:"0 2px 6px rgba(0,0,0,.35)" }}>
                          <X size={10} color="#fff" strokeWidth={3}/>
                        </button>
                      </div>
                    );})}
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
                      <span style={{ fontSize:9, color:T.muted, letterSpacing:".06em", textAlign:"center", padding:"0 4px" }}>
                        {totalPhotos < req.minPhotos
                          ? (cat === "couples" ? "Add Partner 2" : "Add Required Photo")
                          : cat === "babies"
                            ? "Add Mom (Optional)"
                            : "Add Another (Optional)"}
                      </span>
                    </button>
                  </div>
                )}
                {cat === "babies" && photo && (
                  <p style={{ fontSize:10, color:T.muted, marginTop:8, lineHeight:1.5, letterSpacing:".02em" }}>
                    Tip: Most baby templates feature mom & baby together. Add an optional photo of mom for the best face likeness.
                  </p>
                )}
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" style={{ display:"none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
                    if (!ALLOWED.includes(f.type)) {
                      alert("Please upload a PNG, JPEG, WebP, or GIF image.");
                      e.target.value = "";
                      return;
                    }
                    if (addSlot === "extra") {
                      const reader = new FileReader();
                      reader.onload = async ev => {
                        const dataUrl = ev.target?.result as string;
                        setExtraPhotos(p => [...p, dataUrl]);
                        let low = false;
                        try { const { w, h } = await getImageDimensions(dataUrl); low = isLowRes(w, h); } catch {}
                        setExtraLowRes(p => [...p, low]);
                      };
                      reader.readAsDataURL(f);
                    } else {
                      loadFile(f);
                    }
                    // reset so the same file can be re-selected after removal
                    e.target.value = "";
                  }}/>
              </div>

              {/* ── NAME (Optional) — only after photo uploaded ── */}
              {photo && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:9, letterSpacing:".24em", color:T.gold,
                  textTransform:"uppercase", fontWeight:500, marginBottom:8 }}>
                  {req.namesLabel} <span style={{ color:T.dim, fontSize:8,
                    textTransform:"none", letterSpacing:".04em", fontWeight:400,
                    marginLeft:6 }}>(Optional)</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {heroNames.map((nm, i) => (
                    <input
                      key={i}
                      type="text"
                      value={nm}
                      onChange={e => {
                        const v = e.target.value.slice(0, 20);
                        setHeroNames(prev => prev.map((x, j) => j === i ? v : x));
                      }}
                      placeholder={req.namePlaceholders[i] || req.namePlaceholders[0] || `Name ${i+1}`}
                      maxLength={20}
                      style={{
                        width:"100%", padding:"9px 12px", borderRadius:6,
                        border:`1px solid ${T.border}`,
                        background:"rgba(255,255,255,.04)",
                        color:T.cream, fontSize:12.5,
                        fontFamily:"'Poppins',sans-serif", outline:"none",
                        transition:"border-color .2s",
                      }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor=T.gold}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor=T.border}
                    />
                  ))}
                </div>
                <p style={{ fontSize:9.5, color:T.muted, marginTop:4, letterSpacing:".04em" }}>
                  Add a personal touch — your subject's name printed on the portrait.
                </p>
              </div>
              )}

              {/* ── GENERATE ── */}
              <button className="btn-gold" disabled={!canGo}
                style={{ width:"100%", padding:"15px", fontSize:13, borderRadius:6,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:9,
                  animation:canGo?"glow 2s infinite":"none" }}
                onClick={() => {
                  onGenerate({ cat, photo, uploadedUrl, heroName, extraPhotos });
                }}>
                <Wand2 size={15}/>{genLabel()}
              </button>

              <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                flexWrap:"wrap", gap:"4px 14px", marginTop:9 }}>
                {["Free Preview In 60 Seconds", "No Credit Card", "Free Worldwide Shipping"].map((t, i) => (
                  <span key={i} style={{ display:"flex", alignItems:"center",
                    gap:4, fontSize:11.5, color:T.muted }}>
                    <Check size={11} color="#16a34a" strokeWidth={3}/>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>

      </section>

      {/* ■■ Trust Strip ■■ */}
      <section style={{ padding:"22px 32px", background:"#F5F3EE", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, alignItems:"center" }} className="trust4">
          {[
            { Icon:Sparkles, label:"Free Instant Preview" },
            { Icon:RefreshCw, label:"Unlimited Revisions" },
            { Icon:FrameIcon, label:"Museum-Quality Print" },
            { Icon:Truck, label:"Free Worldwide Shipping" },
          ].map(({ Icon, label }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
              <Icon size={28} color={T.gold} strokeWidth={1.5}/>
              <span style={{ fontSize:14, fontWeight:500, color:"#1a1a1a", fontFamily:"'Poppins',sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ■■ How It Works ■■ */}
      <section style={{ padding:"80px 32px", background:T.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:T.gold, fontWeight:600, textAlign:"center", marginBottom:14, fontFamily:"'Poppins',sans-serif" }}>How It Works</p>
          <h2 style={{ fontSize:36, fontWeight:800, color:T.cream, textAlign:"center", lineHeight:1.15, marginBottom:10, fontFamily:"'Poppins',sans-serif" }}>From Photo To Masterpiece In Four Simple Steps</h2>
          <p style={{ fontSize:22, color:T.muted, textAlign:"center", marginBottom:48, lineHeight:1.65, fontFamily:"'Poppins',sans-serif" }}>Upload Once. Receive A Portrait Worth Treasuring Forever.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }} className="sg3">
            {[
              { n:"1", Icon:Upload,             img:stepUpload,    title:"Upload Your Photo", body:"Select who this portrait is for — pets, babies, couples, or people — then upload any photo from your camera roll. Clear, well-lit photos give the most stunning results." },
              { n:"2", Icon:Sparkles,           img:stepAi,        title:"AI Brings It To Life",       body:"In seconds, our AI transforms your photo into a stunning portrait across six timeless art styles — Royal, Renaissance, Storybook, Fantasy, Cinematic, and Minimal." },
              { n:"3", Icon:SlidersHorizontal,  img:stepCustomize, title:"Make It Truly Yours",        body:"Preview every style side by side. Choose your favourite, then customise every detail — size, frame color, and finish." },
              { n:"4", Icon:Heart,              img:stepDelivered, title:"Delivered & Cherished",      body:"Your portrait is printed on museum-quality archival fine art paper, carefully packaged, and delivered free to your door worldwide." },
            ].map((step) => (
              <div key={step.n} style={{ position:"relative", border:`1px solid ${T.border}`, borderRadius:18, background:T.bg, overflow:"hidden", display:"flex", flexDirection:"column" }}>
                <div style={{ position:"relative", aspectRatio:"1/1", background:"linear-gradient(160deg,#dbeafe 0%,#eff6ff 55%,#ffffff 100%)", overflow:"hidden" }}>
                  {step.n === "2"
                    ? <Step2Slides/>
                    : <img src={step.img} alt={step.title} loading="lazy" width={768} height={768} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>}
                  <div style={{ position:"absolute", top:12, left:12, background:T.gold, color:"#FFFFFF", borderRadius:999, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, fontFamily:"'Poppins',sans-serif", boxShadow:"0 4px 12px rgba(0,0,0,.25)" }}>{step.n}</div>
                </div>
                <div style={{ padding:"22px 22px 24px" }}>
                  <step.Icon size={22} color={T.gold} style={{ marginBottom:10 }}/>
                  <h3 style={{ fontSize:16, fontWeight:700, color:T.cream, marginBottom:10, lineHeight:1.25, fontFamily:"'Poppins',sans-serif" }}>{step.title}</h3>
                  <p style={{ fontSize:13, color:T.muted, lineHeight:1.65, fontFamily:"'Poppins',sans-serif" }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ■■ Occasions ■■ */}
      <section style={{ padding:"32px 32px 80px", background:T.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <p style={{ fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:T.gold, fontWeight:600, textAlign:"center", marginBottom:14, fontFamily:"'Poppins',sans-serif" }}>Choose Your Style</p>
          <h2 style={{ fontSize:36, fontWeight:800, color:T.cream, textAlign:"center", lineHeight:1.15, marginBottom:10, fontFamily:"'Poppins',sans-serif" }}>Turn Any Photo Into Timeless Art</h2>
          <p style={{ fontSize:22, color:T.muted, textAlign:"center", marginBottom:48, lineHeight:1.65, fontFamily:"'Poppins',sans-serif", whiteSpace:"nowrap" }}>Choose From 30+ Styles — Royal, Renaissance, Watercolor, Storybook And More For Every Moment.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }} className="pg3">
            {[
              { cat:"pets",     img:scenePetsBrutus, imgs:[scenePetsBrutus, scenePetsPitbull, scenePetsGallery, scenePetKing, scenePetsShepherdFlag], Icon:PawPrint, title:"Pets",     body:"Royal · Viking · Astronaut · Watercolor · +25 more", cta:"Create A Pet Portrait" },
              { cat:"babies",   img:sceneBabiesSkateboard, imgs:[sceneBabiesSkateboard, sceneBabiesSuperman, sceneBabiesSoccer], Icon:Baby,     title:"Babies",   body:"Fairy · Cherub · Storybook · Royal · +25 more", cta:"Create A Baby Portrait" },
              { cat:"couples",  img:sceneCouplesRings, imgs:[sceneCouplesRings, sceneCouplesBeachTender, sceneCouplesEditorialEmbrace, sceneCouplesCinematicKiss, sceneCouplesKiss, sceneCouplesBackToBack], Icon:Heart, title:"Couples", body:"Renaissance · Gothic · Gatsby · Royal · +25 more", cta:"Create A Couples Portrait" },
              { cat:"couples",  img:sceneWeddingConfetti, imgs:[sceneWeddingConfetti, sceneWeddingStreet, sceneWeddingBeach, sceneWeddingCar, sceneWeddingKiss], Icon:Sparkles, title:"Weddings", body:"Classic · Vintage · Royal · Watercolor · +25 more", cta:"Create A Wedding Portrait" },
              { cat:"memorial", img:sceneMemorialGrandmother, imgs:[sceneMemorialGrandmother, sceneMemorialVintageFamily, sceneMemorialPet, sceneMemorialFather, sceneMemorialCatAngel], Icon:Flower2, title:"Memorial", body:"Heavenly · Renaissance · Watercolor · Classic · +25 more", cta:"Create A Memorial Portrait" },
              { cat:"gifts",    img:sceneFathersShoulders, imgs:[sceneFathersShoulders, sceneFathersFamilyEmbrace, sceneFathersGenerations, sceneFathersReading, sceneFathersExecutive, sceneFathersRanch], Icon:Gift, title:"Father's Day", body:"Royal · Cinematic · Renaissance · Classic · +25 more", cta:"Create A Father's Day Portrait" },
            ].map(item => (
              <div key={item.cat} onClick={() => { setCat(item.cat); scrollToHero(); }}
                style={{ border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden",
                  cursor:"pointer", background:T.bg, transition:"all .25s",
                  display:"flex", flexDirection:"column" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 36px rgba(0,0,0,.18)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                {/* Hero image */}
                <div style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden", background:"#F7F7F7" }}>
                  {item.imgs ? (
                    <CardSlideshow imgs={item.imgs} alt={item.title}/>
                  ) : (
                    <img src={item.img} alt={item.title} loading="lazy"
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                  )}
                  <div style={{ position:"absolute", inset:0, pointerEvents:"none",
                    background:"linear-gradient(to top, rgba(10,10,10,.55) 0%, rgba(10,10,10,0) 55%)" }}/>
                  <div style={{ position:"absolute", top:14, left:14, width:38, height:38, borderRadius:12,
                    background:"rgba(255,255,255,.92)", display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 4px 12px rgba(0,0,0,.18)" }}>
                    <item.Icon size={18} color={T.gold}/>
                  </div>
                  <h3 style={{ position:"absolute", bottom:12, left:16, right:16, margin:0,
                    fontSize:18, fontWeight:800, color:"#fff", letterSpacing:".01em",
                    fontFamily:"'Poppins',sans-serif", textShadow:"0 2px 8px rgba(0,0,0,.5)" }}>
                    {item.title}
                  </h3>
                </div>
                {/* Body */}
                <div style={{ padding:"20px 22px 22px" }}>
                  <p style={{ fontSize:12.5, color:T.muted, lineHeight:1.65, marginBottom:14, fontFamily:"'Poppins',sans-serif", letterSpacing:".01em" }}>{item.body}</p>
                  <span style={{ fontSize:11, letterSpacing:".14em", textTransform:"uppercase", color:T.gold, fontWeight:600, fontFamily:"'Poppins',sans-serif" }}>{item.cta} →</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:56 }}>
            <p style={{ fontSize:22, color:T.muted, marginBottom:20, fontFamily:"'Poppins',sans-serif", letterSpacing:".01em" }}>Explore Hundreds Of Portrait Styles & Occasions</p>
            <button onClick={scrollToHero} style={{ background:T.gold, color:"#fff", border:"none", padding:"15px 32px", borderRadius:12, fontWeight:700, fontSize:14.5, cursor:"pointer", fontFamily:"'Poppins',sans-serif", display:"inline-flex", alignItems:"center", gap:8, letterSpacing:".01em", boxShadow:"0 10px 28px rgba(230,25,25,.25)" }}>
              Preview Your Portrait Free →
            </button>
          </div>
        </div>
      </section>


      {/* ■■ Quality Story ■■ */}
      <section style={{ background:"#F4F1ED", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"80px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, border:`1px solid rgba(230,25,25,.25)`, background:"rgba(230,25,25,.06)", borderRadius:999, padding:"6px 14px", fontSize:11.5, fontWeight:600, color:T.gold, marginBottom:18, fontFamily:"'Poppins',sans-serif" }}>
              <Award size={14} color={T.gold}/> Fine Art Quality
            </div>
            <h2 style={{ fontSize:36, fontWeight:800, color:T.cream, lineHeight:1.2, marginBottom:18, fontFamily:"'Poppins',sans-serif" }}>Art That Lasts A Hundred Years.</h2>
            <p style={{ fontSize:22, color:T.muted, maxWidth:680, margin:"0 auto 24px", lineHeight:1.65, fontFamily:"'Poppins',sans-serif" }}>Every REAL ART Portrait Is Printed Using The Same Archival Standards Used By The World's Leading Museums And Galleries. Made To Be Passed Down Through Generations.</p>
            <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap" }}>
              {[
                { Icon:Star,   label:"100-Year Color Guarantee" },
                { Icon:Truck,  label:"Free Worldwide Shipping" },
                { Icon:Shield, label:"100-Day Guarantee" },
              ].map(chip => (
                <span key={chip.label} style={{ border:`1px solid ${T.border}`, background:T.bg, borderRadius:999, padding:"8px 16px", fontSize:12, fontWeight:500, color:T.cream, display:"inline-flex", alignItems:"center", gap:6, fontFamily:"'Poppins',sans-serif" }}>
                  <chip.Icon size={13} color={T.gold}/> {chip.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18 }} className="pg3">
            {[
              { Icon:Droplets, title:"Archival Pigment Inks",       body:"Giclée printing with pigment-based inks that resist fading for over a century when displayed indoors — the gold standard in fine art reproduction." },
              { Icon:FileText, title:"Museum-Grade Fine Art Paper", body:"200gsm enhanced matte art paper with a velvety surface that brings exceptional depth, detail, and color to every portrait." },
              { Icon:Package,  title:"Beautifully Packaged",        body:"Ships in rigid, protective packaging with no third-party branding — just REAL ART, beautifully presented and ready to gift." },
              { Icon:Globe,    title:"Free Global Delivery",        body:"Produced at certified fine art studios and shipped free worldwide. Every portrait arrives in 5–7 business days, ready to hang." },
            ].map(spec => (
              <div key={spec.title} style={{ display:"flex", gap:14, padding:"20px 22px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:14 }}>
                <div style={{ flexShrink:0, width:34, height:34, borderRadius:10, background:"rgba(230,25,25,.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <spec.Icon size={17} color={T.gold}/>
                </div>
                <div>
                  <h4 style={{ fontSize:14, fontWeight:700, color:T.cream, marginBottom:3, fontFamily:"'Poppins',sans-serif" }}>{spec.title}</h4>
                  <p style={{ fontSize:13, color:T.muted, lineHeight:1.6, fontFamily:"'Poppins',sans-serif" }}>{spec.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ■■ Reviews ■■ */}
      <section style={{ padding:"80px 32px", background:T.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, color:T.muted, fontFamily:"'Poppins',sans-serif", fontWeight:600, letterSpacing:".18em", textTransform:"uppercase" }}>
              <Star size={14} color="#00B67A" fill="#00B67A"/> Trustpilot Reviews
            </span>
          </div>
          <h2 style={{ fontSize:36, fontWeight:800, color:T.cream, textAlign:"center", lineHeight:1.15, marginBottom:48, fontFamily:"'Poppins',sans-serif" }}>4.9 Stars · Thousands Of Portraits Created</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }} className="pg3">
            {[
              { q:"I ordered the Royal portrait of my golden retriever for my mom's birthday and she cried the moment she opened it. The quality blew me away — it looks like it belongs in a museum.", author:"Sarah M.", tag:"Pet Portrait" },
              { q:"Got the Renaissance portrait of my husband and me for our 10th anniversary. The framed print arrived perfectly packaged. Every visitor asks about it.", author:"James R.", tag:"Couples Portrait" },
              { q:"I ordered a memorial portrait of our cat Milo in the Storybook style. The detail and color are incredible. The most meaningful piece of art we own.", author:"Priya K.", tag:"Memorial Portrait" },
            ].map((rev, i) => (
              <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:16, padding:"24px 22px", background:T.bg }}>
                <div style={{ marginBottom:12 }}>
                  {Array(5).fill(0).map((_,j)=>(<span key={j} style={{ color:"#00B67A", fontSize:15 }}>★</span>))}
                </div>
                <p style={{ fontSize:13.5, color:T.cream, lineHeight:1.7, marginBottom:14, fontFamily:"'Poppins',sans-serif" }}>"{rev.q}"</p>
                <div style={{ fontSize:12, color:T.muted, fontFamily:"'Poppins',sans-serif" }}>
                  <strong style={{ color:T.cream, fontWeight:600 }}>{rev.author}</strong>{" · Verified Buyer"}
                </div>
                <span style={{ display:"inline-block", marginTop:8, fontSize:10, letterSpacing:".12em", textTransform:"uppercase", background:"rgba(230,25,25,.08)", color:T.gold, borderRadius:6, padding:"3px 8px", fontWeight:600, fontFamily:"'Poppins',sans-serif" }}>{rev.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ■■ FAQ ■■ */}
      <section style={{ background:"#F9F7F4", borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"64px 32px" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <p style={{ fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:T.gold, fontWeight:600, textAlign:"center", marginBottom:14, fontFamily:"'Poppins',sans-serif" }}>Got Questions?</p>
          <h2 style={{ fontSize:36, fontWeight:800, color:T.cream, textAlign:"center", lineHeight:1.15, marginBottom:36, fontFamily:"'Poppins',sans-serif" }}>Everything You Need To Know</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { q:"How Does The AI Generation Work?",      a:"You upload a photo and our AI studies every detail to generate an original portrait across six art styles — in 30–60 seconds. You receive a free watermarked preview of every style before purchasing, so you only pay for what you love." },
              { q:"What Photo Works Best?",                a:"Clear, well-lit photos where the subject's face is fully visible work best. Front-facing is ideal. Avoid heavy shadows, sunglasses, or blur. Any recent smartphone photo taken in natural daylight is usually perfect." },
              { q:"What Sizes And Formats Do You Offer?",  a:"Fine Art Prints from 8×10\" to 24×36\". Framed Prints from 8×10\" to 20×24\" in 8 frame color options. Canvas Prints from 10×10\" to 24×36\". Every physical order includes a full digital download of all six portrait styles." },
              { q:"How Long Does Shipping Take?",          a:"Physical prints are produced and shipped within 3–5 business days, typically arriving in 5–7 business days in the US. International orders may take 7–14 days. All orders include free worldwide shipping with tracking." },
              { q:"What Is Your Happiness Guarantee?",     a:"We offer a 100-day happiness guarantee. If you're not completely satisfied for any reason — quality, damage in transit, or simply not what you expected — we'll reprint or refund in full. No questions asked." },
            ].map((item, i) => (
              <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden", background:T.bg }}>
                <button onClick={() => setOpenFaq(openFaq===i ? null : i)} style={{ width:"100%", textAlign:"left", background:T.bg, border:"none", padding:"18px 22px", fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:600, color: openFaq===i ? T.gold : T.cream, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
                  {item.q}
                  <ChevronDown size={16} color={openFaq===i ? T.gold : T.muted} style={{ transition:"transform .2s", flexShrink:0, transform: openFaq===i ? "rotate(180deg)" : "rotate(0deg)" }}/>
                </button>
                {openFaq===i && (
                  <div style={{ padding:"0 22px 20px", fontSize:13.5, color:T.muted, lineHeight:1.7, fontFamily:"'Poppins',sans-serif" }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ■■ Final CTA ■■ */}
      <section style={{ background:T.gold, padding:"80px 32px", textAlign:"center" }}>
        <p style={{ fontSize:10.5, letterSpacing:".28em", textTransform:"uppercase", color:"rgba(255,255,255,.85)", fontWeight:600, marginBottom:14, fontFamily:"'Poppins',sans-serif" }}>Start Creating</p>
        <h2 style={{ fontSize:40, fontWeight:800, color:"#FFFFFF", lineHeight:1.2, marginBottom:14, fontFamily:"'Poppins',sans-serif" }}>Turn Your Favourite Photo Into A Masterpiece.</h2>
        <p style={{ fontSize:22, color:"rgba(255,255,255,.9)", marginBottom:28, fontFamily:"'Poppins',sans-serif" }}>Free Preview Before You Buy. No Subscription. No Risk.</p>
        <button onClick={scrollToHero} style={{ background:"#FFFFFF", color:T.gold, border:"none", padding:"16px 36px", borderRadius:12, fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"'Poppins',sans-serif", display:"inline-flex", alignItems:"center", gap:10, letterSpacing:".01em" }}>
          <Upload size={17}/> Upload A Photo — It's Free
        </button>
        <p style={{ fontSize:11.5, color:"rgba(255,255,255,.85)", marginTop:18, letterSpacing:".06em", fontFamily:"'Poppins',sans-serif" }}>4.9 ★ Rated · Free Worldwide Shipping · 100-Day Guarantee</p>
      </section>

      {/* ■■ Expanded Footer ■■ */}
      <footer style={{ background:"#F9F7F4", borderTop:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"56px 32px 28px", display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:36 }} className="pg3">
          <div>
            <div style={{ display:"inline-block", background:"#E61919", padding:7, width:120, marginBottom:18 }}>
              <div style={{ border:"2px solid #fff", padding:"5px 14px", display:"flex", flexDirection:"column", alignItems:"center" }}>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:"1.7rem", fontWeight:900, color:"#fff", letterSpacing:".05em", lineHeight:1, textAlign:"center", display:"block" }}>REAL</span>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:".44rem", fontWeight:700, letterSpacing:".3em", color:"#fff", textTransform:"uppercase", textAlign:"center", display:"block", marginTop:3 }}>ART</span>
              </div>
            </div>
            <p style={{ fontSize:13, color:T.muted, lineHeight:1.65, marginBottom:18, maxWidth:300, fontFamily:"'Poppins',sans-serif" }}>
              AI-powered portrait art printed on archival fine art paper. Delivered to your door, anywhere in the world.
            </p>
            <div style={{ display:"flex", gap:12 }}>
              {[Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" style={{ width:34, height:34, borderRadius:"50%", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", background:T.bg }}>
                  <Icon size={16} color={T.dim}/>
                </a>
              ))}
            </div>
          </div>
          {[
            { title:"Create",   links:["Pet Portraits","Baby Portraits","Couples Portraits","Memorial Portraits","Gift Portraits"] },
            { title:"Products", links:["Fine Art Prints","Framed Prints","Canvas Prints","Digital Download","Size Guide"] },
            { title:"Help",     links:["FAQ","Shipping Info","Returns & Refunds","Contact Us","Privacy Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:10.5, letterSpacing:".22em", textTransform:"uppercase", color:T.dim, fontWeight:600, marginBottom:16, fontFamily:"'Poppins',sans-serif" }}>{col.title}</h4>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:10 }}>
                {col.links.map(l => (
                  <li key={l}><a href="#" style={{ fontSize:13, color:T.cream, textDecoration:"none", fontFamily:"'Poppins',sans-serif" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${T.border}`, padding:"18px 32px" }}>
          <div style={{ maxWidth:1240, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:11, fontSize:11, color:T.dim, fontFamily:"'Poppins',sans-serif" }}>
            <span>© 2025 Real Art™ · Real Advisors, Inc. All rights reserved.</span>
            <span>AI-Powered · Fine Art Quality · Yours Forever</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GENERATING SCREEN — Real AI generation
═══════════════════════════════════════════════════════════ */
function GenScreen({ selectedStyles, sessionId, photoUrl, extraPhotoUrls = [], category, templatePrompt, templatePrompts, styleRefUrl, onDone }) {
  const [pct,  setPct]  = useState(0);
  const [msg,  setMsg]  = useState(0);
  const [done, setDone] = useState([]);
  const [error, setError] = useState(null);
  const [proofIdx, setProofIdx] = useState(0);
  const [proofFade, setProofFade] = useState(true);
  const [emailGate, setEmailGate] = useState(false);
  const [donePortraits, setDonePortraits] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const active = STYLES.filter(s => selectedStyles.includes(s.id));
  const proofDeck = getSocialProof(category);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let fakePct = 0;
    const iv = setInterval(() => {
      fakePct = Math.min(fakePct + 0.2, 92);
      setPct(fakePct);
      setMsg(Math.min(Math.floor((fakePct/100) * GEN_MSGS.length), GEN_MSGS.length-1));
    }, 200);

    const spiv = setInterval(() => {
      setProofFade(false);
      setTimeout(() => {
        setProofIdx(p => (p + 1) % proofDeck.length);
        setProofFade(true);
      }, 280);
    }, 3500);

    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-portraits", {
          body: { sessionId, photoUrl, extraPhotoUrls, styles: selectedStyles, category, templatePrompt: templatePrompt || "", templatePrompts: templatePrompts || [], styleRefUrl: styleRefUrl || "" },
        });

        clearInterval(iv);

        if (fnError) throw new Error(fnError.message || "Generation failed");
        if (!data?.portraits?.length) throw new Error("No portraits were generated");

        setPct(100);
        setMsg(GEN_MSGS.length - 1);
        setDone(active);
        clearInterval(spiv);

        setTimeout(() => {
          setDonePortraits(data.portraits);
          setEmailGate(true);
        }, 800);
      } catch (err) {
        clearInterval(iv);
        clearInterval(spiv);
        console.error("Generation error:", err);
        setError(err.message || "Something went wrong generating your portraits.");
      }
    })();

    return () => { clearInterval(iv); clearInterval(spiv); };
  }, []);

  const handleEmailSubmit = async () => {
    if (!email.includes("@")) return;
    setEmailBusy(true);
    try {
      await supabase.from("lead_captures" as any).insert({
        email: email.trim().toLowerCase(),
        session_id: sessionId || null,
        category,
        source: "portrait_generation",
      });
      // Persist this client's preview gallery so they can revisit it from the
      // "My Previews" drawer and receive 7-day expiry reminders.
      try {
        await supabase.functions.invoke("save-client-previews", {
          body: {
            email: email.trim().toLowerCase(),
            sessionId: sessionId || null,
            category,
            sourcePhotoUrl: photoUrl || null,
            portraits: (donePortraits || []).map((p: any) => ({
              url: p.url,
              style: p.style,
              hd_url: p.hd_url || p.urlHd || null,
            })),
          },
        });
        try { localStorage.setItem("dp:previewEmail", email.trim().toLowerCase()); } catch {}
      } catch (_) { /* non-blocking */ }
    } catch (_) { /* non-blocking */ }
    setEmailBusy(false);
    onDone(donePortraits);
  };

  // Email gate screen
  if (emailGate) {
    return (
      <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"#16a34a",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
          <Check size={28} color="#fff" strokeWidth={3}/>
        </div>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:28, fontWeight:700,
          color:T.cream, marginBottom:10, textAlign:"center" }}>
          Your Portrait Is Ready!
        </h2>
        <p style={{ color:T.muted, fontSize:14, marginBottom:24, textAlign:"center" }}>
          Where Should We Send It?
        </p>
        <div style={{ width:"100%", maxWidth:380, display:"flex", flexDirection:"column", gap:10 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleEmailSubmit()}
            style={{ padding:"14px 16px", fontSize:14, borderRadius:10,
              border:`1px solid ${T.border}`, outline:"none",
              fontFamily:"'Poppins',sans-serif", background:"#fff", color:"#1a1a1a" }}
          />
          <button
            onClick={handleEmailSubmit}
            disabled={emailBusy || !email.includes("@")}
            className="btn-gold"
            style={{ padding:"15px 0", borderRadius:10, fontSize:14,
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              opacity: (!email.includes("@") || emailBusy) ? .55 : 1 }}>
            {emailBusy ? "Saving..." : <>Send Me My Portrait <ArrowRight size={17}/></>}
          </button>
          <p style={{ color:T.dim, fontSize:11.5, textAlign:"center", marginTop:6, whiteSpace:"nowrap" }}>
            Your portrait will be saved to your gallery — no spam, unsubscribe anytime.
          </p>
          <button onClick={() => onDone(donePortraits)}
            style={{ marginTop:6, background:"none", border:"none",
              color:T.muted, fontSize:11.5, cursor:"pointer",
              fontFamily:"'Poppins',sans-serif", textDecoration:"underline" }}>
            Skip, take me to my portrait →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <div aria-label="Real Art" style={{
        background:"#E61919", padding:7, width:140, marginBottom:32,
      }}>
        <div style={{ border:"2.5px solid #fff", padding:"6px 18px",
          display:"flex", flexDirection:"column", alignItems:"center" }}>
          <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:"2.1rem",
            fontWeight:900, color:"#fff", letterSpacing:".05em",
            lineHeight:1, textAlign:"center", display:"block" }}>REAL</span>
          <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:".52rem",
            fontWeight:700, letterSpacing:".3em", color:"#fff",
            textTransform:"uppercase", textAlign:"center",
            display:"block", marginTop:3 }}>ART</span>
        </div>
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
          <div style={{ position:"relative", width:56, height:56, marginBottom:18 }}>
            <div style={{ position:"absolute", inset:0, background:T.gold, borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Wand2 size={22} color="#fff"/>
            </div>
            <div className="spn" style={{ position:"absolute", inset:-4, border:"2px solid transparent",
              borderTopColor:T.gold, borderRadius:"50%" }}/>
          </div>

          <div style={{ width:"100%", maxWidth:380, height:5, background:"rgba(0,0,0,.2)",
            borderRadius:99, overflow:"hidden", marginBottom:8 }}>
            <div style={{ height:"100%", background:T.gold,
              width:`${pct}%`, transition:"width .2s ease", borderRadius:99 }}/>
          </div>
          <p style={{ fontSize:12.5, color:T.gold, marginBottom:20, fontWeight:600 }}>{Math.round(pct)}% complete</p>
          <p style={{ color:T.muted, fontSize:13, marginBottom:28, textAlign:"center", minHeight:18 }}>{GEN_MSGS[msg]}</p>

          {/* Social proof photo */}
          <div style={{ width:"100%", maxWidth:460, borderRadius:16, overflow:"hidden",
            border:"1px solid rgba(255,255,255,.08)", background:"#fff", position:"relative",
            opacity: proofFade ? 1 : 0, transition:"opacity .28s" }}>
            <img src={proofDeck[proofIdx % proofDeck.length].img}
              alt="Customer portrait example"
              style={{ width:"100%", height:340, objectFit:"cover", display:"block" }}/>
            <div style={{ position:"absolute", bottom:12, left:12, fontSize:10,
              letterSpacing:".16em", textTransform:"uppercase", color:"#fff",
              background:"rgba(0,0,0,.55)", padding:"5px 10px", borderRadius:6, fontWeight:600 }}>
              {proofDeck[proofIdx % proofDeck.length].style}
            </div>
          </div>

          {/* Reviews below photo */}
          <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:8,
            width:"100%", maxWidth:460 }}>
            {[
              proofDeck[proofIdx % proofDeck.length],
              proofDeck[(proofIdx+1) % proofDeck.length],
              proofDeck[(proofIdx+2) % proofDeck.length],
            ].slice(0, pct > 20 ? (pct > 50 ? 3 : 2) : 1).map((p, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8,
                opacity: proofFade ? 1 : 0, transition:"opacity .28s" }}>
                <span style={{ color:"#F5A623", fontSize:12, flexShrink:0 }}>★★★★★</span>
                <p style={{ fontSize:12.5, color:T.cream, lineHeight:1.5, fontStyle:"italic", margin:0 }}>{p.review}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   STYLE SELECT PAGE — between homepage and generation
═══════════════════════════════════════════════════════════ */
function StyleSelectPage({ session, onConfirm, onBack }) {
  const { cat, heroName, photo, extraPhotos = [] } = session;
  const allPhotos = [photo, ...(extraPhotos || [])].filter(Boolean);
  const [selected, setSelected] = useState<{ type: "style"|"template"; id: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [subType, setSubType] = useState<string | null>(null);
  const [stSearch, setStSearch] = useState("");

  const needsSubType = cat === "people" || cat === "occasions";
  const subTypeDefs = SUBTYPES[cat] || [];
  const filteredSubs = stSearch
    ? subTypeDefs.filter(s => s.label.toLowerCase().includes(stSearch.toLowerCase())
                           || s.desc.toLowerCase().includes(stSearch.toLowerCase()))
    : subTypeDefs;
  const selectedSubDef = subTypeDefs.find(s => s.id === subType);
  const subTypePromptContext = selectedSubDef?.context || "";

  const teaser = TEASERS.find(t => t.catId === cat);
  const portraits = teaser?.portraits || [];
  const templates = TEMPLATES[cat] || [];

  const baseCards = STYLES
    .map(st => {
      const match = portraits.find(p => p.style === st.label);
      return match ? {
        type: "style" as const,
        id: st.id,
        label: st.label,
        desc: st.desc,
        img: match.url,
      } : null;
    })
    .filter(Boolean) as { type:"style"; id:string; label:string; desc:string; img:string }[];

  const tmplCards = templates.map(t => ({
    type: "template" as const,
    id: t.id,
    label: t.label,
    desc: t.desc,
    img: t.img,
  }));

  const toAbsUrl = (u?: string) => {
    if (!u) return "";
    try { return new URL(u, window.location.origin).href; } catch { return u; }
  };

  const imageUrlToDataUrl = async (u?: string) => {
    const abs = toAbsUrl(u);
    if (!abs || abs.startsWith("data:image/")) return abs;

    const response = await fetch(abs);
    if (!response.ok) throw new Error(`Could not load reference image (${response.status})`);

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) throw new Error(`Reference image was ${blob.type || "not an image"}`);

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const getStyleRef = async (u?: string) => {
    try { return await imageUrlToDataUrl(u); }
    catch (err) {
      console.warn("Could not convert style reference to data URL, using URL fallback:", err);
      return toAbsUrl(u);
    }
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setConfirming(true);
    try {
      if (selected.type === "style") {
        const card = baseCards.find(c => c.id === selected.id);
        onConfirm({ styles: [selected.id], templatePrompt: subTypePromptContext, styleRefUrl: await getStyleRef(card?.img) });
      } else {
        const tmpl = templates.find(t => t.id === selected.id);
        const card = tmplCards.find(c => c.id === selected.id);
        const base = [subTypePromptContext, tmpl?.prompt].filter(Boolean).join(" ");
        const variants = cat === "pets"
          ? [
              `${base} — Recreate the scene shown in the TOP-LEFT framed picture of the reference template (same pose, same props, same setting, same lighting). Replace the pet with the user's pet.`,
              `${base} — Recreate the scene shown in the TOP-RIGHT framed picture of the reference template (same pose, same props, same setting, same lighting). Replace the pet with the user's pet.`,
              `${base} — Recreate the scene shown in the BOTTOM-LEFT framed picture of the reference template (same pose, same props, same setting, same lighting). Replace the pet with the user's pet.`,
              `${base} — Recreate the scene shown in the BOTTOM-RIGHT framed picture of the reference template (same pose, same props, same setting, same lighting). Replace the pet with the user's pet.`,
              `${base} — Recreate the TOP-LEFT framed scene but as a tighter close-up crop with the pet's face centered, same costume/props/lighting as the reference frame.`,
              `${base} — Recreate the BOTTOM-RIGHT framed scene but from a slightly wider angle showing more of the setting, same costume/props/lighting as the reference frame.`,
            ]
          : [
              `${base} — Variation 1: keep wardrobe/setting/lighting identical to the reference; full-body composition, both subjects facing camera, relaxed natural pose.`,
              `${base} — Variation 2: same wardrobe/setting/lighting; three-quarter angle, one partner slightly behind the other, soft genuine smiles.`,
              `${base} — Variation 3: same wardrobe/setting/lighting; tighter waist-up crop, partners leaning into each other, warm intimate mood.`,
              `${base} — Variation 4: same wardrobe/setting/lighting; wider shot showing more of the environment, dynamic asymmetric composition.`,
              `${base} — Variation 5: same wardrobe/setting/lighting; close-up portrait crop of both faces side by side, eyes engaged with viewer, shallow depth of field.`,
              `${base} — Variation 6: same wardrobe/setting/lighting; playful candid moment — laughing or one looking at the other, golden cinematic light.`,
            ];
        onConfirm({
          styles: ["v1","v2","v3","v4","v5","v6"],
          templatePrompt: base,
          templatePrompts: variants,
          styleRefUrl: await getStyleRef(card?.img),
        });
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div style={{ background:T.bg, minHeight:"100vh", color:T.cream }}>
      <style>{G}</style>

      <SiteHeader current="upload" onBack={onBack} total={0}/>

      {/* Headline */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 6vw 20px", textAlign:"center" }}>
        <h1 style={{ fontSize:"clamp(24px,3.5vw,42px)", fontWeight:800,
            color:T.cream, marginBottom:10, lineHeight:1.15,
            fontFamily:"'Poppins',sans-serif" }}>
          {heroName && subType
            ? `Choose A Style For ${heroName}'s ${selectedSubDef?.label} Portrait`
            : heroName
            ? `Choose A Style For ${heroName}`
            : subType
            ? `Choose A ${selectedSubDef?.label} Style`
            : "Choose An Art Style"}
        </h1>
        <p style={{ fontSize:17, color:T.muted, fontFamily:"'Poppins',sans-serif" }}>
          Select One Style To Generate Your Free Preview — Takes About 30 Seconds.
        </p>
      </div>

      {/* Sub-type selector (People + Occasions only) */}
      {needsSubType && (
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 24px" }}>
          <p style={{ fontSize:11, letterSpacing:".24em", textTransform:"uppercase",
              color:T.gold, fontWeight:600, marginBottom:6, fontFamily:"'Poppins',sans-serif" }}>
            {cat === "people" ? "Who Is This For?" : "What's The Occasion?"}
          </p>
          <p style={{ fontSize:14, color:T.muted, marginBottom:14,
              fontFamily:"'Poppins',sans-serif" }}>
            {subType
              ? `Great — showing styles for ${selectedSubDef?.label}`
              : "Choose a type to find the most relevant styles"}
          </p>

          <div style={{ position:"relative", marginBottom:16, maxWidth:360 }}>
            <Search size={14} color={T.muted}
              style={{ position:"absolute", left:12, top:"50%",
                transform:"translateY(-50%)", pointerEvents:"none" }}/>
            <input
              type="text"
              value={stSearch}
              onChange={e => setStSearch(e.target.value)}
              placeholder={cat === "people" ? "Search (baby, couple…)" : "Search occasions…"}
              style={{ width:"100%", paddingLeft:34, paddingRight:12, paddingTop:9,
                paddingBottom:9, borderRadius:8, fontSize:13,
                border:`1px solid ${T.border}`, outline:"none",
                background:"#fff", color:"#1a1a1a", fontFamily:"'Poppins',sans-serif",
                boxSizing:"border-box" as any }}/>
          </div>

          <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:12 }}>
            {filteredSubs.map(sub => {
              const isSel = subType === sub.id;
              return (
                <div key={sub.id}
                  onClick={() => setSubType(isSel ? null : sub.id)}
                  style={{ position:"relative", aspectRatio:"1", borderRadius:14,
                    overflow:"hidden", cursor:"pointer",
                    border:`2px solid ${isSel ? T.gold : "transparent"}`,
                    boxShadow: isSel
                      ? `0 0 0 3px rgba(230,180,80,.25)`
                      : "0 2px 10px rgba(0,0,0,.25)",
                    transition:"border-color .15s, box-shadow .15s, transform .15s",
                    transform: isSel ? "scale(1.04)" : "scale(1)" }}>
                  <img src={sub.img} alt={sub.label}
                    style={{ width:"100%", height:"100%",
                      objectFit:"cover", display:"block" }}/>
                  <div style={{ position:"absolute", inset:0,
                    background:"linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.1) 55%, transparent 100%)" }}/>
                  <div style={{ position:"absolute", left:10, right:10, bottom:8,
                    color:"#fff", fontFamily:"'Poppins',sans-serif" }}>
                    <div style={{ fontSize:13, fontWeight:700, lineHeight:1.1 }}>{sub.label}</div>
                    <div style={{ fontSize:11, opacity:.85, marginTop:2 }}>{sub.desc}</div>
                  </div>
                  {isSel && (
                    <div style={{ position:"absolute", top:8, right:8,
                      width:22, height:22, borderRadius:"50%", background:T.gold,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Check size={13} color="#fff" strokeWidth={3}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Art Styles header */}
      {baseCards.length > 0 && (
        <div style={{ padding:"20px 24px 8px" }}>
          <p style={{ fontSize:10, letterSpacing:".26em", textTransform:"uppercase",
            color:T.muted, fontWeight:600, textAlign:"left", margin:0 }}>Art Styles</p>
        </div>
      )}

      {/* Card grid */}
      <div style={{ margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:18 }}>
          {baseCards.map(card => {
            const isSelected = selected?.type === "style" && selected?.id === card.id;
            return (
              <StyleCard key={`s-${card.id}`} card={card} isSelected={isSelected} originalPhotos={allPhotos}
                confirming={confirming}
                onSelect={() => setSelected(isSelected ? null : { type:"style", id:card.id })}
                onConfirm={handleConfirm}/>
            );
          })}
        </div>
      </div>

      {/* Templates section */}
      {tmplCards.length > 0 && (
        <>
          <div style={{ margin:"0 auto", padding:"36px 24px 8px" }}>
            <p style={{ fontSize:10, letterSpacing:".26em", textTransform:"uppercase",
              color:T.muted, fontWeight:600 }}>Scenes & Costumes</p>
          </div>
          <div style={{ margin:"0 auto", padding:"0 24px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:18 }}>
              {tmplCards.map(card => {
                const isSelected = selected?.type === "template" && selected?.id === card.id;
                return (
                  <StyleCard key={`t-${card.id}`} card={card} isSelected={isSelected} originalPhotos={allPhotos}
                    confirming={confirming}
                    onSelect={() => setSelected(isSelected ? null : { type:"template", id:card.id })}
                    onConfirm={handleConfirm}/>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Themed sections — Seasons / Holidays / Occasions */}
      {THEMES[cat] && (Object.keys(THEMES[cat]) as Array<keyof typeof THEMES[typeof cat]>).map(group => {
        const items = THEMES[cat][group];
        if (!items || !items.length) return null;
        return (
          <div key={group}>
            <div style={{ margin:"0 auto", padding:"36px 24px 8px" }}>
              <p style={{ fontSize:10, letterSpacing:".26em", textTransform:"uppercase",
                color:T.muted, fontWeight:600 }}>{group}</p>
            </div>
            <div style={{ margin:"0 auto", padding:"0 24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(230px, 1fr))", gap:18 }}>
                {items.map(t => {
                  const isSelected = selected?.type === "template" && selected?.id === t.id;
                  return (
                    <StyleCard key={`th-${t.id}`}
                      card={{ id:t.id, label:t.label, desc:t.desc, img:t.img }}
                      isSelected={isSelected}
                      originalPhotos={allPhotos}
                      confirming={confirming}
                      onSelect={() => setSelected(isSelected ? null : { type:"template", id:t.id })}
                      onConfirm={async () => {
                        setConfirming(true);
                        try {
                          const base = t.prompt || "";
                          const variants = [
                            `${base} — variation 1: front-facing pose, head tilted slightly, centered composition`,
                            `${base} — variation 2: side profile angle, looking off camera, soft cinematic light`,
                            `${base} — variation 3: tight close-up portrait crop, eyes engaged with viewer, shallow depth of field`,
                            `${base} — variation 4: wider shot showing more of the scene and props, dynamic composition`,
                            `${base} — variation 5: three-quarter angle, warm golden-hour lighting, painterly mood`,
                            `${base} — variation 6: low-angle hero shot, dramatic rim light, bold confident expression`,
                          ];
                          onConfirm({
                            styles:["v1","v2","v3","v4","v5","v6"],
                            templatePrompt: base,
                            templatePrompts: variants,
                            styleRefUrl: await getStyleRef(t.img),
                          });
                        } finally {
                          setConfirming(false);
                        }
                      }}/>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ height:60 }}/>
    </div>
  );
}

function StyleCard({ card, isSelected, onSelect, onConfirm, originalPhotos = [], confirming }) {
  const photos = (originalPhotos || []).filter(Boolean).slice(0, 2);
  return (
    <div onClick={onSelect}
      style={{
        border:`2px solid ${isSelected ? T.gold : T.border}`,
        borderRadius:16,
        overflow:"hidden",
        cursor:"pointer",
        background:T.bg,
        transition:"border-color .15s, transform .15s",
        transform: isSelected ? "translateY(-3px)" : "none",
        boxShadow: isSelected ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
      }}>
      <div style={{ position:"relative", aspectRatio:"4/5", overflow:"hidden", background:"#111" }}>
        <img src={card.img} alt={card.label}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>

        {/* Small original photo thumbnails (Mixtiles-style) */}
        {photos.length > 0 && (
          <div style={{
            position:"absolute", left:10, bottom:10,
            display:"flex", gap:6,
          }}>
            {photos.map((src, i) => (
              <div key={i} style={{
                width:64, height:64, borderRadius:10, overflow:"hidden",
                border:"3px solid #fff",
                boxShadow:"0 4px 12px rgba(0,0,0,0.35)",
                background:"#222",
              }}>
                <img src={src} alt={`Your photo ${i+1}`}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
              </div>
            ))}
          </div>
        )}

        {isSelected && (
          <div style={{ position:"absolute", top:10, right:10, width:26, height:26,
            borderRadius:"50%", background:T.gold, display:"flex",
            alignItems:"center", justifyContent:"center" }}>
            <Check size={14} color="#fff" strokeWidth={3}/>
          </div>
        )}
      </div>
      <div style={{ padding:"14px 14px 16px" }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:T.cream,
          marginBottom:4, fontFamily:"'Poppins',sans-serif" }}>{card.label}</h3>
        <p style={{ fontSize:12, color:T.muted, marginBottom: isSelected ? 12 : 0,
          fontFamily:"'Poppins',sans-serif" }}>{card.desc}</p>
        {isSelected && (
          <button
            disabled={confirming}
            onClick={e => { e.stopPropagation(); if (!confirming) onConfirm(); }}
            style={{ width:"100%", padding:"11px 0",
              background:T.gold, color:"#fff", border:"none",
              borderRadius:10, cursor:confirming ? "wait" : "pointer", fontSize:13,
              opacity: confirming ? .72 : 1,
              fontWeight:700, fontFamily:"'Poppins',sans-serif",
              display:"flex", alignItems:"center",
              justifyContent:"center", gap:8 }}>
            <Sparkles size={15}/>{confirming ? "Preparing Reference..." : "Generate Free Preview"}
          </button>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen,      setScreen]   = useState("home");
  const [localSession, setLocal]   = useState({ cat:"", photo:null, photoUrl:null, heroName:"", extraPhotos:[], styles:[], templatePrompt:"", templatePrompts:[], styleRefUrl:"", sessionId:null, generatedPortraits:[] });
  const { setSession }             = useSession();
  const navigate                   = useNavigate();

  // Step 1: homepage Generate → go to style select
  const handleGenerate = useCallback(({ cat, photo, uploadedUrl, heroName = "", extraPhotos = [] }) => {
    setLocal(prev => ({ ...prev, cat, photo, photoUrl: uploadedUrl, heroName, extraPhotos }));
    setSession({ cat, photo, heroName } as any);
    setScreen("select-style");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [setSession]);

  // Step 2: user picks style → create session, then generate
  const handleStyleSelected = useCallback(async ({ styles, templatePrompt, templatePrompts, styleRefUrl }) => {
    setLocal(prev => ({ ...prev, styles, templatePrompt, templatePrompts: templatePrompts || [], styleRefUrl: styleRefUrl || "" }));
    setSession({ styles, heroName: localSession.heroName } as any);
    let sessionId = null;
    try {
      sessionId = await createSession({
        category: localSession.cat,
        styles,
        photoUrl: localSession.photoUrl || localSession.photo || "",
      });
      setSession({ orderId: sessionId } as any);
      setLocal(prev => ({ ...prev, sessionId }));
    } catch (err) {
      console.warn("Could not create session record:", err);
    }
    setScreen("gen");
  }, [localSession, setSession]);

  const handleGenDone = useCallback((portraits) => {
    setLocal(prev => ({ ...prev, generatedPortraits: portraits }));
    setSession({ generatedPortraits: portraits.map(p => ({ style: p.style, url: p.url })) });
    const featured = portraits[0]?.style || "";
    navigate(`/customize?style=${encodeURIComponent(featured)}`);
  }, [setSession, navigate]);

  return (
    <>
      <style>{G}</style>
      {screen==="home"         && <HomePage        onGenerate={handleGenerate}/>}
      {screen==="select-style" && <StyleSelectPage session={localSession}
                                    onConfirm={handleStyleSelected}
                                    onBack={() => { setScreen("home"); }}/>}
      {screen==="gen"          && <GenScreen      selectedStyles={localSession.styles}
                                    sessionId={localSession.sessionId}
                                    photoUrl={localSession.photoUrl || localSession.photo}
                                    extraPhotoUrls={localSession.extraPhotos || []}
                                    category={localSession.cat}
                                    templatePrompt={localSession.templatePrompt}
                                    templatePrompts={localSession.templatePrompts}
                                    styleRefUrl={localSession.styleRefUrl}
                                    onDone={handleGenDone}/>}
    </>
  );
}
