// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, PawPrint, Users, CalendarDays } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";

const T = {
  gold: "#E6B450",
  muted: "#8C8C8C",
  cream: "#F4F1EC",
  border: "rgba(255,255,255,.08)",
};

const CATS = [
  { id: "pets",      label: "Pets",      Icon: PawPrint     },
  { id: "people",    label: "People",    Icon: Users        },
  { id: "occasions", label: "Occasions", Icon: CalendarDays },
];

export default function LandingHeader() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goCat = (id: string) => {
    navigate(`/?cat=${id}`);
  };

  return (
    <>
      {/* Announcement bar */}
      <div style={{
        height: 30, background: "#B91C1C",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 22,
        fontFamily: "'Poppins',sans-serif", fontSize: 11, letterSpacing: ".14em",
        textTransform: "uppercase", color: "#fff", fontWeight: 600,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Truck size={13} strokeWidth={2}/> Free Worldwide Shipping
        </span>
        <span style={{ opacity: .5 }}>·</span>
        <span>100-Day Guarantee</span>
        <span style={{ opacity: .5 }}>·</span>
        <span>4.9★ Rated</span>
      </div>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200, height: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 26px",
        background: scrolled ? "rgba(7,6,10,.97)" : "rgba(7,6,10,.92)",
        backdropFilter: "blur(22px)",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <a href="/" aria-label="Real Art home" style={{
            display: "block", textDecoration: "none",
            background: "#E61919", padding: 6, width: 110,
          }}>
            <div style={{
              border: "2px solid #fff", padding: "4px 14px",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <span style={{
                fontFamily: "'Poppins',sans-serif", fontSize: "1.6rem",
                fontWeight: 900, color: "#fff", letterSpacing: ".05em",
                lineHeight: 1, textAlign: "center", display: "block",
              }}>REAL</span>
              <span style={{
                fontFamily: "'Poppins',sans-serif", fontSize: ".45rem",
                fontWeight: 700, letterSpacing: ".3em", color: "#fff",
                textTransform: "uppercase", textAlign: "center",
                display: "block", marginTop: 2,
              }}>ART</span>
            </div>
          </a>
          <LanguageSwitcher />
        </div>

        <div className="hid" style={{
          display: "flex", gap: 44, alignItems: "center",
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        }}>
          {CATS.map(c => {
            const NavIcon = c.Icon;
            return (
              <button key={c.id} onClick={() => goCat(c.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
                  color: T.muted, fontFamily: "'Poppins',sans-serif",
                  transition: "color .2s",
                  display: "flex", alignItems: "center", gap: 7,
                }}
                onMouseOver={e => { e.currentTarget.style.color = T.cream; }}
                onMouseOut={e => { e.currentTarget.style.color = T.muted; }}>
                <NavIcon size={14} strokeWidth={1.8}/>
                {c.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <a href="/customize" style={{
                fontSize: 11, color: "#E61919", textDecoration: "none",
                letterSpacing: ".08em", textTransform: "uppercase",
                padding: "6px 14px", border: `1px solid ${T.muted}`, borderRadius: 8,
              }}>My Portraits</a>
              <button onClick={() => signOut()} style={{
                background: "none", fontSize: 11, color: T.muted, cursor: "pointer",
                letterSpacing: ".08em", textTransform: "uppercase",
                padding: "6px 14px", border: `1px solid ${T.muted}`, borderRadius: 8,
                fontFamily: "'Poppins',sans-serif",
              }}>Sign Out</button>
            </>
          ) : (
            <a href="/auth" style={{
              fontSize: 11, color: T.muted, textDecoration: "none",
              letterSpacing: ".08em", textTransform: "uppercase",
              padding: "6px 14px", border: `1px solid ${T.muted}`, borderRadius: 8,
            }}>Sign In</a>
          )}
          <HamburgerMenu />
        </div>
      </nav>
    </>
  );
}
