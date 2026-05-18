// @ts-nocheck
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function HamburgerMenu({
  items = [],
  onSelect,
}: {
  items?: { id: string; label: string; onClick?: () => void; href?: string }[];
  onSelect?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(255,255,255,.06)", border:"1px solid rgba(196,150,58,.35)",
          color:"#F5EFE0", cursor:"pointer", width:36, height:32, borderRadius:6,
        }}
      >
        <Menu size={18} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:"fixed", inset:0, zIndex:9999,
            background:"rgba(0,0,0,.6)", backdropFilter:"blur(6px)",
          }}
        >
          <aside
            onClick={e => e.stopPropagation()}
            style={{
              position:"absolute", top:0, right:0, height:"100%", width:"min(340px, 86vw)",
              background:"#0B0A10", borderLeft:"1px solid rgba(196,150,58,.3)",
              display:"flex", flexDirection:"column", padding:"22px 18px",
              boxShadow:"-20px 0 60px rgba(0,0,0,.6)",
            }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <span style={{
                fontFamily:"'Playfair Display',serif", fontSize:18, color:"#D4AF37",
                letterSpacing:".18em", textTransform:"uppercase",
              }}>Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" style={{
                background:"none", border:"none", color:"#F5EFE0", cursor:"pointer",
              }}>
                <X size={22}/>
              </button>
            </div>

            <nav style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {items.map(it => (
                <button
                  key={it.id}
                  onClick={() => {
                    if (it.href) { window.location.href = it.href; }
                    else if (it.onClick) it.onClick();
                    onSelect?.(it.id);
                    setOpen(false);
                  }}
                  style={{
                    textAlign:"left", background:"none", border:"none", cursor:"pointer",
                    color:"#F5EFE0", padding:"14px 8px",
                    fontFamily:"'Poppins',sans-serif", fontSize:13,
                    letterSpacing:".16em", textTransform:"uppercase",
                    borderBottom:"1px solid rgba(255,255,255,.06)",
                  }}
                  onMouseOver={e => { e.currentTarget.style.color = "#D4AF37"; }}
                  onMouseOut={e => { e.currentTarget.style.color = "#F5EFE0"; }}
                >
                  {it.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
