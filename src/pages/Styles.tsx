// @ts-nocheck
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Star, ArrowRight, X } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";
import portraitPeopleRoyal from "@/assets/portrait-people-royal.jpg";
import portraitPeopleRen from "@/assets/portrait-people-renaissance.jpg";
import portraitPeopleStory from "@/assets/portrait-people-storybook.jpg";
import portraitGiftsFan from "@/assets/portrait-gifts-fantasy.jpg";
import portraitPeopleCine from "@/assets/portrait-people-cinematic.jpg";
import portraitPeopleMin from "@/assets/portrait-people-minimal.jpg";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const STYLES = [
  { id: "royal",       name: "Royal",       mood: "Regal · Opulent",  desc: "Royal portraiture inspired by 18th-century European courts.", img: portraitPeopleRoyal },
  { id: "renaissance", name: "Renaissance", mood: "Classical · Rich", desc: "Old master oil-painting techniques with dramatic lighting.",   img: portraitPeopleRen },
  { id: "storybook",   name: "Storybook",   mood: "Whimsical · Soft", desc: "Hand-painted children's book aesthetic with warm tones.",     img: portraitPeopleStory },
  { id: "fantasy",     name: "Fantasy",     mood: "Epic · Heroic",    desc: "Mythic worlds, dragons, knights, and enchanted landscapes.",  img: portraitGiftsFan },
  { id: "cinematic",   name: "Cinematic",   mood: "Dramatic · Bold",  desc: "Movie poster quality with depth, contrast, and atmosphere.",  img: portraitPeopleCine },
  { id: "minimal",     name: "Minimal",     mood: "Clean · Modern",   desc: "Editorial portrait simplicity with negative space.",          img: portraitPeopleMin },
];

const CATS = [
  { id: "all",      label: "All",            emoji: "✨" },
  { id: "pets",     label: "Pets",           emoji: "🐾" },
  { id: "babies",   label: "Babies & Kids",  emoji: "👶" },
  { id: "couples",  label: "Couples",        emoji: "💕" },
  { id: "people",   label: "People",         emoji: "👤" },
  { id: "memorial", label: "Memorial",       emoji: "🕊️" },
  { id: "occasions",label: "Occasions",      emoji: "🎉" },
  { id: "wedding",  label: "Wedding",        emoji: "💍" },
];

const T = [
  // PETS (10)
  ["pets-royal-hound","Royal Hound","royal","pets","Your pet as noble royalty"],
  ["pets-royal-cat","Royal Feline","royal","pets","Crowned cat on velvet throne"],
  ["pets-ren","Renaissance Pet","renaissance","pets","Pet in an Italian palace"],
  ["pets-ren-knight","Sir Whiskers","renaissance","pets","Pet as renaissance knight"],
  ["pets-story","Storybook Pet","storybook","pets","Whimsical illustrated pet"],
  ["pets-story-adventure","Tiny Explorer","storybook","pets","Hand-drawn pet adventure"],
  ["pets-fantasy","Dragon Companion","fantasy","pets","Pet with mythical beast"],
  ["pets-fantasy-wizard","Wizard's Familiar","fantasy","pets","Pet beside an arcane sorcerer"],
  ["pets-cinema","Pet Star","cinematic","pets","Your pet in the spotlight"],
  ["pets-minimal","Studio Pet","minimal","pets","Sleek modern studio pet"],

  // BABIES & KIDS (10)
  ["babies-royal-prince","Little Prince","royal","babies","Tiny royalty in velvet"],
  ["babies-royal-princess","Little Princess","royal","babies","Crowned in lace and pearls"],
  ["babies-ren","Madonna's Child","renaissance","babies","Sacred renaissance child"],
  ["babies-ren-noble","Noble Heir","renaissance","babies","Young noble in oil paint"],
  ["babies-story-bear","Sleepy Bear Baby","storybook","babies","Storybook nursery scene"],
  ["babies-story-bunny","Bunny Dreams","storybook","babies","Whimsical bunny companion"],
  ["babies-fantasy","Tiny Adventurer","fantasy","babies","Mini hero in mythic world"],
  ["babies-cinema","Hero in Diapers","cinematic","babies","Dramatic cinematic baby"],
  ["babies-minimal","Newborn Minimal","minimal","babies","Quiet nursery portrait"],
  ["babies-minimal-twin","Twin Whisper","minimal","babies","Soft side-by-side portrait"],

  // COUPLES (10)
  ["couples-royal","Royal Couple","royal","couples","Coronation portrait pair"],
  ["couples-royal-monarchs","Monarchs in Love","royal","couples","Twin thrones and crowns"],
  ["couples-ren","Renaissance Lovers","renaissance","couples","Classic oil love"],
  ["couples-ren-vow","Eternal Vow","renaissance","couples","Old master couple portrait"],
  ["couples-story","Storybook Sweethearts","storybook","couples","Hand-drawn romance"],
  ["couples-fantasy","Elven Lovers","fantasy","couples","Forest-bound mythic pair"],
  ["couples-fantasy-warrior","Warrior & Mage","fantasy","couples","Heroic battle-bond duo"],
  ["couples-cinema","Cinematic Couple","cinematic","couples","Epic romance still"],
  ["couples-cinema-noir","Noir Romance","cinematic","couples","Black and white drama"],
  ["couples-minimal","Quiet Couple","minimal","couples","Soft modern portrait"],

  // PEOPLE (10)
  ["people-royal-king","Royal King","royal","people","Crown jewels and ermine robes"],
  ["people-royal-queen","Royal Queen","royal","people","Regal gown with golden tiara"],
  ["people-ren-noble","Noble","renaissance","people","16th-century merchant noble"],
  ["people-ren-mother","Madonna","renaissance","people","Sacred renaissance mother"],
  ["people-story-family","Family Adventure","storybook","people","Hand-drawn family tale"],
  ["people-fantasy-warrior","Warrior","fantasy","people","Armored battle hero"],
  ["people-fantasy-wizard","Wizard","fantasy","people","Robed sorcerer with staff"],
  ["people-fantasy-elf","Elven Royalty","fantasy","people","Forest elven monarch"],
  ["people-cinema-hero","Action Hero","cinematic","people","Movie poster portrait"],
  ["people-minimal-headshot","Studio Headshot","minimal","people","Clean editorial portrait"],

  // MEMORIAL (10)
  ["memorial-royal","In Loving Memory","royal","memorial","Tribute portrait in royal frame"],
  ["memorial-royal-eternal","Eternal Majesty","royal","memorial","Regal memorial portrait"],
  ["memorial-ren","Eternal Soul","renaissance","memorial","Renaissance memorial"],
  ["memorial-ren-saint","Sainted Memory","renaissance","memorial","Old master tribute"],
  ["memorial-story-pet","Pet Memorial","storybook","memorial","Cherished pet tribute"],
  ["memorial-story-angel","Little Angel","storybook","memorial","Soft storybook tribute"],
  ["memorial-fantasy","Beyond the Veil","fantasy","memorial","Mythic memorial scene"],
  ["memorial-cinema","Final Frame","cinematic","memorial","Cinematic farewell portrait"],
  ["memorial-minimal","Quiet Remembrance","minimal","memorial","Minimal tribute portrait"],
  ["memorial-minimal-light","Light Remains","minimal","memorial","Soft luminous tribute"],

  // OCCASIONS (10)
  ["occasion-birthday","Birthday Royalty","royal","occasions","Birthday celebration"],
  ["occasion-birthday-cinema","Birthday Star","cinematic","occasions","Spotlight birthday portrait"],
  ["occasion-graduation","Graduate","cinematic","occasions","Cap and gown drama"],
  ["occasion-graduation-royal","Scholar Royal","royal","occasions","Regal graduation portrait"],
  ["occasion-anniversary","Anniversary Lovers","renaissance","occasions","Years together"],
  ["occasion-retirement","Retirement Honor","renaissance","occasions","Celebrating a legacy"],
  ["occasion-newhome","New Home","minimal","occasions","Welcoming new beginnings"],
  ["occasion-promotion","Promotion","cinematic","occasions","Career milestone portrait"],
  ["occasion-holiday","Holiday Magic","storybook","occasions","Festive storybook scene"],
  ["occasion-mothers-day","Mother's Day","renaissance","occasions","Tribute to mother"],

  // WEDDING (10)
  ["wedding-bride","Bridal","renaissance","wedding","Classic bride portrait"],
  ["wedding-bride-royal","Royal Bride","royal","wedding","Bride in royal regalia"],
  ["wedding-groom","Groom","cinematic","wedding","Dramatic groom portrait"],
  ["wedding-couple","Wedding Day","cinematic","wedding","Cinematic wedding still"],
  ["wedding-couple-royal","Royal Wedding","royal","wedding","Coronation-style wedding"],
  ["wedding-couple-ren","Sacred Union","renaissance","wedding","Old master wedding"],
  ["wedding-pet","Ring Bearer","storybook","wedding","Your pet at the wedding"],
  ["wedding-fantasy","Fairytale Wedding","fantasy","wedding","Mythic wedding scene"],
  ["wedding-portrait","Vows","minimal","wedding","Quiet wedding moment"],
  ["wedding-first-dance","First Dance","cinematic","wedding","Cinematic first-dance still"],
];

export default function Styles() {
  const navigate = useNavigate();
  const [style, setStyle] = useState("all");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const templates = useMemo(() => {
    return T.filter(([id, label, st, ct, desc]) => {
      if (style !== "all" && st !== style) return false;
      if (cat !== "all" && ct !== cat) return false;
      if (q && !(`${label} ${desc} ${ct}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [style, cat, q]);

  const activeStyle = STYLES.find(s => s.id === style);
  const hasFilters = style !== "all" || cat !== "all" || q;

  const chip = (active) => ({
    padding:"8px 14px", borderRadius:999, border:`1px solid ${active ? RED : BORDER}`,
    background: active ? RED : "#fff", color: active ? "#fff" : INK,
    fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:12.5, cursor:"pointer",
    transition:"all .15s",
  });

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <LandingHeader />

      <div style={{ maxWidth:1240, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            ✨ ART STYLES
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:44, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            Find Your Perfect Style
          </h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, color:MUTED, marginTop:10 }}>
            Crafted for every subject
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth:560, margin:"0 auto 26px", position:"relative" }}>
          <Search size={18} style={{ position:"absolute", left:16, top:14, color:MUTED }}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search styles or templates..."
            style={{
              width:"100%", padding:"13px 16px 13px 44px", borderRadius:12,
              border:`1px solid ${BORDER}`, background:"#fff", color:INK,
              fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none",
            }}/>
        </div>

        {/* Style chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:14 }}>
          <button style={chip(style==="all")} onClick={()=>setStyle("all")}>All Styles</button>
          {STYLES.map(s=>(
            <button key={s.id} style={chip(style===s.id)} onClick={()=>setStyle(s.id)}>{s.name}</button>
          ))}
        </div>
        {/* Subject chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:32 }}>
          {CATS.map(c=>(
            <button key={c.id} style={chip(cat===c.id)} onClick={()=>setCat(c.id)}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Spotlight or active banner */}
        {style === "all" && !q ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:18, marginBottom:40 }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={()=>setStyle(s.id)} style={{
                background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16,
                overflow:"hidden", cursor:"pointer", textAlign:"left", padding:0,
                transition:"transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,.10)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
              >
                <div style={{ height:200, background:`url(${s.img}) center/cover` }}/>
                <div style={{ padding:18 }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".18em" }}>{s.mood}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:22, fontWeight:700, color:INK, marginTop:4 }}>{s.name}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED, marginTop:6, lineHeight:1.5 }}>{s.desc}</div>
                  <div style={{ marginTop:14, display:"inline-flex", alignItems:"center", gap:6, color:RED, fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13 }}>
                    See Templates <ArrowRight size={14}/>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : activeStyle ? (
          <div style={{
            background:"#fff", border:`1px solid ${BORDER}`, borderRadius:18,
            padding:24, marginBottom:30, display:"grid", gridTemplateColumns:"220px 1fr",
            gap:24, alignItems:"center",
          }}>
            <div style={{ height:180, borderRadius:14, background:`url(${activeStyle.img}) center/cover` }}/>
            <div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".18em" }}>{activeStyle.mood}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:28, fontWeight:800, color:INK, marginTop:4 }}>{activeStyle.name}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:MUTED, marginTop:8, lineHeight:1.6 }}>{activeStyle.desc}</div>
              <button onClick={()=>navigate(`/?style=${activeStyle.id}`)} style={{
                marginTop:14, padding:"12px 22px", borderRadius:12, background:RED, color:"#fff",
                border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
                boxShadow:"0 8px 20px rgba(230,25,25,.25)",
              }}>Start With This Style</button>
            </div>
          </div>
        ) : null}

        {/* Result header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", color:INK, fontWeight:600, fontSize:14 }}>
            {templates.length} Templates
            {cat !== "all" && ` · ${CATS.find(c=>c.id===cat)?.label}`}
            {style !== "all" && ` · ${STYLES.find(s=>s.id===style)?.name}`}
          </div>
          {hasFilters && (
            <button onClick={()=>{ setStyle("all"); setCat("all"); setQ(""); }} style={{
              background:"none", border:"none", color:RED, cursor:"pointer",
              fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:4,
            }}><X size={14}/> Clear Filters</button>
          )}
        </div>

        {/* Template grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:14 }}>
          {templates.map(([id, label, st, ct, desc]) => {
            const catObj = CATS.find(c=>c.id===ct);
            const stObj = STYLES.find(s=>s.id===st);
            return (
              <div key={id} style={{
                background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14,
                overflow:"hidden", transition:"transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 30px rgba(0,0,0,.10)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
              >
                <div style={{
                  height:180, background:`url(${stObj?.img}) center/cover`,
                  position:"relative", overflow:"hidden",
                }}>
                  <span style={{
                    position:"absolute", top:8, left:8, padding:"4px 10px", borderRadius:999,
                    background:"rgba(255,255,255,.95)", color:INK, fontFamily:"'Poppins',sans-serif",
                    fontSize:10.5, fontWeight:700, letterSpacing:".06em",
                  }}>{stObj?.name}</span>
                  <span style={{
                    position:"absolute", top:8, right:8, padding:"4px 8px", borderRadius:999,
                    background:"rgba(0,0,0,.55)", color:"#fff", fontSize:13,
                  }}>{catObj?.emoji}</span>
                </div>
                <div style={{ padding:12 }}>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13.5, color:INK }}>{label}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11.5, color:MUTED, marginTop:3, lineHeight:1.4 }}>{desc}</div>
                  <button onClick={()=>navigate(`/?cat=${ct}&style=${st}`)} style={{
                    marginTop:10, width:"100%", padding:"9px 12px", borderRadius:10,
                    background:INK, color:"#fff", border:"none", cursor:"pointer",
                    fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:12,
                  }}>Start Design</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div style={{
          marginTop:60, padding:"24px", borderRadius:16, background:"#fff",
          border:`1px solid ${BORDER}`,
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:20, textAlign:"center",
        }}>
          {[
            ["70+","Templates"],
            ["6","Art Styles"],
            ["5,000+","Happy Customers"],
            ["5–9 Days","Worldwide Delivery"],
          ].map(([n,l])=>(
            <div key={l}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:28, fontWeight:800, color:RED }}>{n}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, letterSpacing:".1em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop:36, padding:"40px 32px", borderRadius:20,
          background:"linear-gradient(135deg, #1A1614 0%, #0A0A0A 100%)",
          color:"#fff", textAlign:"center",
        }}>
          <div style={{ display:"flex", justifyContent:"center", gap:3, marginBottom:14 }}>
            {[1,2,3,4,5].map(i=>(<Star key={i} size={18} fill="#FFD600" color="#FFD600"/>))}
          </div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:30, fontWeight:800, margin:0 }}>
            Ready To Create Your Masterpiece?
          </h2>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:"rgba(255,255,255,.7)", marginTop:8 }}>
            Upload one photo. Get six stunning portraits in seconds.
          </p>
          <button onClick={()=>navigate("/")} style={{
            marginTop:20, padding:"14px 28px", borderRadius:12, background:RED, color:"#fff",
            border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
            display:"inline-flex", alignItems:"center", gap:8,
            boxShadow:"0 10px 28px rgba(230,25,25,.4)",
          }}><Sparkles size={16}/> Upload Your Photo</button>
        </div>
      </div>
    </div>
  );
}
