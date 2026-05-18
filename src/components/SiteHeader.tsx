// @ts-nocheck
import { ArrowLeft, ChevronRight, ImageIcon, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "@/components/HamburgerMenu";

const RED = "#E61919";
const TXT = "#0A0A0A";
const MUTED = "#8C8C8C";
const INK = "#1A1614";
const BORDER = "rgba(0,0,0,0.08)";

const STEPS = [
  { id: "upload",    label: "Upload",    to: "/" },
  { id: "customize", label: "Customize", to: "/customize" },
  { id: "print",     label: "Print",     to: "/checkout" },
];

const HEADER_CSS = `
.sh-step{display:flex;align-items:center;gap:6px;color:${MUTED};font-size:12.5px;font-weight:500;cursor:pointer;background:none;border:none;font-family:'Poppins',sans-serif;padding:6px 10px;border-radius:8px;transition:all .15s}
.sh-step:hover{color:${TXT};background:rgba(0,0,0,.04)}
.sh-step.on{color:${INK};font-weight:600}
.sh-step .sh-step-num{width:22px;height:22px;border-radius:50%;background:#EFE9DF;color:${MUTED};display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Poppins',sans-serif}
.sh-step.on .sh-step-num{background:${RED};color:#fff}
`;

export default function SiteHeader({
  current = "upload",            // "upload" | "customize" | "print"
  onBack,
  total,                         // number | undefined — show TOTAL pill if defined
  showPreviews = false,
  onPreviews,
  showCart = false,
  onCart,
  cartCount = 0,
  sticky = true,
  topOffset = 0,
  navCenterOffset = 0,
}: {
  current?: "upload" | "customize" | "print";
  onBack?: () => void;
  total?: number;
  showPreviews?: boolean;
  onPreviews?: () => void;
  showCart?: boolean;
  onCart?: () => void;
  cartCount?: number;
  sticky?: boolean;
  topOffset?: number;
  navCenterOffset?: number;
}) {
  const navigate = useNavigate();
  const back = onBack || (() => navigate(-1));

  return (
    <>
      <style>{HEADER_CSS}</style>
      <header style={{
        position: sticky ? "sticky" : "static", top: topOffset, zIndex: 20,
        background: "rgba(244,241,236,.92)", backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${BORDER}`, padding: "14px 22px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={back} style={{
          background: "transparent", border: "none", cursor: "pointer", color: TXT,
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 13.5,
        }}>
          <ArrowLeft size={16}/> Back
        </button>

        <nav style={{
          display: "flex", alignItems: "center", gap: 2,
          position: "absolute", left: "50%", top: "50%", transform: `translate(calc(-50% + ${navCenterOffset}px), -50%)`,
        }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <button className={`sh-step ${current === s.id ? "on" : ""}`}
                onClick={() => navigate(s.to)}>
                <span className="sh-step-num">{i + 1}</span>{s.label}
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} color={MUTED}/>}
            </div>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {typeof total === "number" && (
            <div style={{
              display: "flex", alignItems: "baseline", gap: 6,
              padding: "7px 14px", borderRadius: 12, background: "#fff",
              border: `1px solid ${BORDER}`,
            }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".14em", color: MUTED, fontWeight: 600 }}>TOTAL</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: INK, fontFamily: "'Poppins',sans-serif" }}>${total}</span>
            </div>
          )}
          {showPreviews && (
            <button onClick={onPreviews} aria-label="Previews" style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 12px", borderRadius: 12, background: "#fff", color: INK,
              border: `1px solid ${BORDER}`, cursor: "pointer",
              fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13,
            }}>
              <ImageIcon size={15}/> Previews
            </button>
          )}
          {showCart && (
            <button onClick={onCart} aria-label="Cart" style={{
              position: "relative", display: "flex", alignItems: "center", gap: 6,
              padding: "9px 14px", borderRadius: 12, background: INK, color: "#fff",
              border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif",
              fontWeight: 600, fontSize: 13,
            }}>
              <ShoppingCart size={15}/> Cart
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, padding: "0 6px",
                  borderRadius: 10, background: RED, color: "#fff", fontSize: 11, fontWeight: 800,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,.2)",
                }}>{cartCount}</span>
              )}
            </button>
          )}
        </div>
      </header>
    </>
  );
}
