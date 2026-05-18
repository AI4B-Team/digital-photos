// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu, X, ChevronRight, Palette, MapPin, HelpCircle, Mail,
  Gift, Star, Shield, FileText, RotateCcw,
} from "lucide-react";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BORDER = "rgba(0,0,0,.08)";

const NAV = [
  { id: "styles",   label: "Art Styles",      sub: "Browse all portrait styles",         icon: Palette,    to: "/styles" },
  { id: "tracking", label: "Track My Order",  sub: "Check production & shipping status", icon: MapPin,     to: "/tracking" },
  { id: "faq",      label: "FAQ",             sub: "Common questions answered",          icon: HelpCircle, to: "/faq" },
  { id: "contact",  label: "Contact Us",      sub: "We reply within a few hours",        icon: Mail,       to: "/contact" },
  { id: "gifts",    label: "Gift Cards",      sub: "Give the perfect custom portrait",   icon: Gift,       to: "/gift-cards" },
  { divider: true },
  { id: "reviews",  label: "Reviews",         sub: "5,000+ verified five-star reviews",  icon: Star,       to: "/reviews" },
  { divider: true },
  { id: "privacy",  label: "Privacy Policy",  sub: "How we protect your data",           icon: Shield,     to: "/privacy" },
  { id: "terms",    label: "Terms of Service",sub: "Our terms and conditions",           icon: FileText,   to: "/terms" },
  { id: "refund",   label: "Refund Policy",   sub: "100% money-back guarantee",          icon: RotateCcw,  to: "/refund" },
];

const CSS = `
@keyframes shFade { from{opacity:0} to{opacity:1} }
@keyframes shSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
.sh-link{display:flex;align-items:center;gap:12px;padding:12px 10px;border-radius:10px;cursor:pointer;background:none;border:none;width:100%;text-align:left;transition:background .15s}
.sh-link:hover{background:#FAFAFA}
.sh-pill{width:36px;height:36px;border-radius:10px;background:rgba(230,25,25,.10);color:${RED};display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sh-label{font-family:'Poppins',sans-serif;font-weight:600;font-size:14px;color:${INK};line-height:1.2}
.sh-sub{font-family:'Poppins',sans-serif;font-weight:400;font-size:11.5px;color:${MUTED};margin-top:2px;line-height:1.2}
`;

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <style>{CSS}</style>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"transparent", border:`1px solid ${BORDER}`,
          color:INK, cursor:"pointer", width:38, height:34, borderRadius:8,
        }}
      >
        <Menu size={18} />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:"fixed", inset:0, zIndex:2147483647,
            background:"rgba(0,0,0,.45)", backdropFilter:"blur(3px)",
            animation:"shFade .18s ease",
          }}
        >
          <aside
            onClick={e => e.stopPropagation()}
            style={{
              position:"absolute", top:0, right:0, height:"100%",
              width:"min(340px, 90vw)", background:"#fff",
              display:"flex", flexDirection:"column",
              animation:"shSlideIn .22s ease",
              boxShadow:"-20px 0 60px rgba(0,0,0,.25)",
            }}
          >
            {/* Header */}
            <div style={{
              padding:"22px 20px 18px", borderBottom:`1px solid ${BORDER}`,
              display:"flex", alignItems:"flex-start", justifyContent:"space-between",
            }}>
              <div>
                <div style={{
                  fontFamily:"'Poppins',sans-serif", fontWeight:800, fontSize:20,
                  color:INK, letterSpacing:"-.01em",
                }}>Real Art</div>
                <div style={{
                  fontFamily:"'Poppins',sans-serif", fontSize:11, color:MUTED,
                  marginTop:2, letterSpacing:".06em",
                }}>AI Portrait Masterpieces</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu" style={{
                background:"none", border:"none", color:MUTED, cursor:"pointer",
                padding:4, marginTop:-2,
              }}>
                <X size={22}/>
              </button>
            </div>

            {/* Nav */}
            <nav style={{ flex:1, overflowY:"auto", padding:"12px 14px" }}>
              {NAV.map((it, i) => {
                if (it.divider) {
                  return <hr key={`d${i}`} style={{
                    border:"none", borderTop:`1px solid ${BORDER}`, margin:"10px 4px",
                  }}/>;
                }
                const Icon = it.icon;
                return (
                  <button key={it.id} className="sh-link" onClick={() => {
                    setOpen(false);
                    navigate(it.to);
                  }}>
                    <span className="sh-pill"><Icon size={18}/></span>
                    <span style={{ flex:1, minWidth:0 }}>
                      <div className="sh-label">{it.label}</div>
                      <div className="sh-sub">{it.sub}</div>
                    </span>
                    <ChevronRight size={16} color={MUTED}/>
                  </button>
                );
              })}
            </nav>

            {/* Footer CTA */}
            <div style={{ padding:"14px 18px 18px", borderTop:`1px solid ${BORDER}` }}>
              <button
                onClick={() => { setOpen(false); navigate("/"); }}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  width:"100%", padding:"13px 18px", borderRadius:12,
                  background:RED, color:"#fff", border:"none", cursor:"pointer",
                  fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
                  letterSpacing:".02em",
                  boxShadow:"0 8px 22px rgba(230,25,25,.28)",
                }}
              >
                <Palette size={16}/> Create A Portrait
              </button>
              <div style={{
                marginTop:12, textAlign:"center",
                fontFamily:"'Poppins',sans-serif", fontSize:11, color:MUTED,
              }}>
                © {new Date().getFullYear()} Real Art. All Rights Reserved.
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
