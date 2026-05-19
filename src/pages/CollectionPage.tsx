// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChevronLeft, Check, Shuffle, CheckSquare } from "lucide-react";
import { TEMPLATES, QUADRANT_HINTS } from "./Index";

const T = {
  bg: "#0F0E0C",
  cream: "#FBF7EE",
  muted: "#8a8377",
  border: "#2a261f",
  gold: "#E6B450",
};
const RED = "#E61919";
const POSITIONS = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];
const SCENE_LABELS = ["Scene 1", "Scene 2", "Scene 3", "Scene 4"];

function findCardById(id: string): { card: any; category: string } | null {
  for (const cat of Object.keys(TEMPLATES)) {
    const t = TEMPLATES[cat].find((x: any) => x.id === id);
    if (t) return { card: t, category: cat };
  }
  return null;
}

export default function CollectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const templateId = params.templateId as string;

  const fromState = (location.state as any) || {};
  const lookup = !fromState.card ? findCardById(templateId) : null;
  const card = fromState.card || lookup?.card;
  const category = fromState.category || lookup?.category || "pets";

  const [selected, setSelected] = useState<number[]>([]);

  const related = useMemo(() => {
    const list = (TEMPLATES[category] || []).filter((t: any) => t.id !== templateId);
    return list.slice(0, 12);
  }, [category, templateId]);

  useEffect(() => { window.scrollTo(0, 0); }, [templateId]);

  if (!card) {
    return (
      <div style={{ background:T.bg, color:T.cream, minHeight:"100vh", display:"flex",
        alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Poppins',sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ marginBottom:14 }}>Collection not found.</p>
          <button onClick={() => navigate("/")}
            style={{ padding:"10px 16px", background:RED, color:"#fff",
              border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>Back Home</button>
        </div>
      </div>
    );
  }

  const slideCount = card.isGrid === false ? 1 : 4;
  const toggle = (i: number) => {
    setSelected(prev => {
      if (prev.includes(i)) return prev.filter(x => x !== i);
      if (prev.length >= 6) return prev;
      return [...prev, i];
    });
  };
  const selectAll = () => setSelected(Array.from({ length: slideCount }, (_, i) => i));
  const random = () => {
    const all = Array.from({ length: slideCount }, (_, i) => i);
    const shuffled = all.sort(() => Math.random() - 0.5);
    setSelected(shuffled.slice(0, Math.min(slideCount, 6)));
  };

  const handleCreate = () => {
    const chosen = selected.length > 0 ? selected : Array.from({ length: slideCount }, (_, i) => i);
    const prompts = chosen.map(i => `${card.prompt || ""} — ${QUADRANT_HINTS[i] || "variation"}`);
    while (prompts.length < 6) prompts.push(`${card.prompt || ""} — variation ${prompts.length + 1}`);
    sessionStorage.setItem("pendingTemplateConfirm", JSON.stringify({
      templateId: card.id,
      category,
      styleRefImg: card.img,
      templatePrompt: card.prompt || "",
      templatePrompts: prompts.slice(0, 6),
    }));
    navigate("/");
  };

  return (
    <div style={{ background:T.bg, color:T.cream, minHeight:"100vh", paddingBottom:120,
      fontFamily:"'Poppins',sans-serif" }}>
      {/* Header */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"24px 24px 8px",
        display:"flex", alignItems:"center", gap:14 }}>
        <button onClick={() => navigate(-1)}
          style={{ display:"flex", alignItems:"center", gap:6, background:"transparent",
            border:`1px solid ${T.border}`, color:T.cream, padding:"8px 12px",
            borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:13 }}>
          <ChevronLeft size={16}/> Back
        </button>
        <h1 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:800, color:T.cream,
          margin:0, flex:1, fontFamily:"'Poppins',sans-serif" }}>{card.label}</h1>
        {selected.length > 0 && (
          <span style={{ background:RED, color:"#fff", padding:"6px 12px",
            borderRadius:999, fontSize:12, fontWeight:700 }}>{selected.length} of 6 selected</span>
        )}
      </div>
      <p style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 16px",
        color:T.muted, fontSize:14 }}>{card.desc}</p>

      {/* Shortcuts */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px 16px",
        display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={selectAll}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px",
            border:`1px solid ${T.border}`, background:"transparent", color:T.cream,
            borderRadius:999, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          <CheckSquare size={14}/> Select All
        </button>
        <button onClick={random}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px",
            border:`1px solid ${T.border}`, background:"transparent", color:T.cream,
            borderRadius:999, fontSize:12.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          <Shuffle size={14}/> Random
        </button>
        {selected.length > 0 && (
          <button onClick={() => setSelected([])}
            style={{ padding:"8px 14px", border:"none", background:"transparent",
              color:T.muted, fontSize:12, cursor:"pointer", textDecoration:"underline", fontFamily:"inherit" }}>
            Clear
          </button>
        )}
      </div>

      {/* Scene grid */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px",
        display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:18 }}>
        {Array.from({ length: slideCount }, (_, i) => i).map(i => {
          const isSel = selected.includes(i);
          const disabled = !isSel && selected.length >= 6;
          return (
            <div key={i} style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <button
                onClick={() => !disabled && toggle(i)}
                style={{
                  position:"relative", aspectRatio:"1/1", borderRadius:12,
                  border: isSel ? `2px solid ${RED}` : `2px solid ${T.border}`,
                  overflow:"hidden", padding:0, cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.45 : 1,
                  backgroundImage:`url(${card.img})`,
                  backgroundSize: slideCount > 1 ? "200% 200%" : "cover",
                  backgroundPosition: slideCount > 1 ? POSITIONS[i] : "50% 50%",
                  backgroundRepeat:"no-repeat",
                  transition:"border-color .15s, transform .15s",
                  transform: isSel ? "translateY(-2px)" : "none",
                }}>
                {isSel && (
                  <div style={{ position:"absolute", top:8, right:8, width:26, height:26,
                    borderRadius:"50%", background:RED, display:"flex",
                    alignItems:"center", justifyContent:"center",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}>
                    <Check size={14} color="#fff" strokeWidth={3}/>
                  </div>
                )}
              </button>
              <p style={{ margin:0, fontSize:12, color:T.muted, textAlign:"center" }}>
                {(card.sceneLabels && card.sceneLabels[i]) || SCENE_LABELS[i] || card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* More from category */}
      {related.length > 0 && (
        <div style={{ maxWidth:1200, margin:"40px auto 0", padding:"0 24px" }}>
          <p style={{ fontSize:11, letterSpacing:".14em", textTransform:"uppercase",
            color:T.muted, fontWeight:600, marginBottom:12 }}>More From {category}</p>
          <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:8 }}>
            {related.map((t: any) => (
              <button key={t.id} onClick={() => navigate(`/collection/${t.id}`, { state: { card: t, category } })}
                style={{ flex:"0 0 auto", width:140, background:"transparent",
                  border:`1px solid ${T.border}`, borderRadius:10, padding:0,
                  cursor:"pointer", color:T.cream, textAlign:"left", overflow:"hidden",
                  fontFamily:"inherit" }}>
                <div style={{ width:"100%", aspectRatio:"1/1",
                  backgroundImage:`url(${t.img})`, backgroundSize:"cover", backgroundPosition:"center" }}/>
                <div style={{ padding:"8px 10px", fontSize:12, fontWeight:600 }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticky footer */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0,
        background:"rgba(15,14,12,0.96)", borderTop:`1px solid ${T.border}`,
        padding:"14px 24px", zIndex:50, backdropFilter:"blur(6px)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <button disabled={selected.length === 0} onClick={handleCreate}
            style={{ width:"100%", padding:"14px 0", borderRadius:12, border:"none",
              background: selected.length === 0 ? "#444" : RED,
              color:"#fff", fontWeight:800, fontSize:15,
              cursor: selected.length === 0 ? "not-allowed" : "pointer",
              opacity: selected.length === 0 ? 0.6 : 1,
              fontFamily:"'Poppins',sans-serif", letterSpacing:".04em",
              textTransform:"uppercase",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            Create {selected.length > 0 ? `${selected.length} Selected` : "—"} →
          </button>
        </div>
      </div>
    </div>
  );
}
