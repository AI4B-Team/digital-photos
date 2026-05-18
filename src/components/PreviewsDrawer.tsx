// @ts-nocheck
import { useState } from "react";
import { X, Sparkles, Check, Download, ShoppingBag } from "lucide-react";

const RED = "#E61919";
const INK = "#1a1a1a";
const MUTED = "#6b675f";
const BORDER = "#e8e2d8";

type Portrait = { url: string; style: string; hd_url?: string };

export default function PreviewsDrawer({
  open,
  onClose,
  portraits = [],
  onSelectPortrait,
  onOrderPortrait,
}: {
  open: boolean;
  onClose: () => void;
  portraits?: Portrait[];
  onSelectPortrait?: (url: string, style: string) => void;
  onOrderPortrait?: (url: string, style: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
          zIndex: 70, animation: "previewsFadeIn .2s ease",
        }}
      />
      <aside
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(440px, 100vw)", background: "#fff", zIndex: 71,
          display: "flex", flexDirection: "column",
          boxShadow: "-12px 0 40px rgba(0,0,0,.18)",
          animation: "previewsSlideIn .25s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", borderBottom: `1px solid ${BORDER}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Sparkles size={18} color={INK} />
            <span style={{ fontSize: 15, fontWeight: 800, color: INK, fontFamily: "'Poppins',sans-serif" }}>
              My Portraits {portraits.length > 0 && (
                <span style={{ color: MUTED, fontWeight: 600 }}>({portraits.length})</span>
              )}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}>
            <X size={20} />
          </button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
          {portraits.length === 0 && (
            <div style={{ textAlign: "center", color: MUTED, padding: "60px 16px" }}>
              <Sparkles size={32} color={MUTED} style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 6 }}>
                No portraits yet
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                Generate portraits to see them here. They'll be available to swap into your design or add to your cart.
              </div>
            </div>
          )}

          {portraits.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {portraits.map((p, i) => {
                const isSel = selected === p.url;
                return (
                  <div key={p.url + i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      onClick={() => setSelected(isSel ? null : p.url)}
                      style={{
                        position: "relative", aspectRatio: "3/4", borderRadius: 10,
                        overflow: "hidden", padding: 0, cursor: "pointer",
                        background: "#eee",
                        border: isSel ? `2px solid ${RED}` : `1px solid ${BORDER}`,
                        boxShadow: isSel ? "0 6px 20px rgba(230,25,25,.18)" : "none",
                        transition: "all .15s",
                      }}
                    >
                      <img src={p.url} alt={p.style}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      {p.style && (
                        <div style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          padding: "6px 8px", fontSize: 10, fontWeight: 700,
                          color: "#fff", background: "linear-gradient(to top, rgba(0,0,0,.75), transparent)",
                          textTransform: "uppercase", letterSpacing: ".06em", textAlign: "left",
                        }}>{p.style}</div>
                      )}
                      {isSel && (
                        <div style={{
                          position: "absolute", top: 6, right: 6, width: 24, height: 24,
                          borderRadius: "50%", background: RED, color: "#fff",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,.3)",
                        }}>
                          <Check size={14} />
                        </div>
                      )}
                    </button>

                    {isSel && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button
                          onClick={() => {
                            onSelectPortrait?.(p.hd_url || p.url, p.style);
                            onClose();
                          }}
                          style={{
                            background: INK, color: "#fff", border: "none", borderRadius: 8,
                            padding: "9px 10px", fontSize: 11.5, fontWeight: 700,
                            fontFamily: "'Poppins',sans-serif", letterSpacing: ".04em",
                            textTransform: "uppercase", cursor: "pointer",
                          }}
                        >
                          Use This Portrait
                        </button>
                        <button
                          onClick={() => {
                            onOrderPortrait?.(p.hd_url || p.url, p.style);
                            onClose();
                          }}
                          style={{
                            background: RED, color: "#fff", border: "none", borderRadius: 8,
                            padding: "9px 10px", fontSize: 11.5, fontWeight: 700,
                            fontFamily: "'Poppins',sans-serif", letterSpacing: ".04em",
                            textTransform: "uppercase", cursor: "pointer",
                            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}
                        >
                          <ShoppingBag size={12} /> Add To Cart
                        </button>
                        <a
                          href={p.hd_url || p.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: "#fff", color: INK, border: `1px solid ${BORDER}`, borderRadius: 8,
                            padding: "9px 10px", fontSize: 11.5, fontWeight: 700,
                            fontFamily: "'Poppins',sans-serif", letterSpacing: ".04em",
                            textTransform: "uppercase", textDecoration: "none", textAlign: "center",
                            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}
                        >
                          <Download size={12} /> Save Image
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {portraits.length > 0 && (
          <div style={{
            padding: "10px 18px", borderTop: `1px solid ${BORDER}`,
            fontSize: 11, color: MUTED, textAlign: "center",
          }}>
            Tap a portrait to use it, add to cart, or save.
          </div>
        )}

        <style>{`
          @keyframes previewsFadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes previewsSlideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
        `}</style>
      </aside>
    </>
  );
}
