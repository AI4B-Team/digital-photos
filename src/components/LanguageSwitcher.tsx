// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const LANGS = [
  { code: "en", label: "English",    flag: "🇺🇸" },
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "pt", label: "Português",  flag: "🇵🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "sv", label: "Svenska",    flag: "🇸🇪" },
  { code: "pl", label: "Polski",     flag: "🇵🇱" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "ja", label: "日本語",       flag: "🇯🇵" },
  { code: "ko", label: "한국어",       flag: "🇰🇷" },
  { code: "zh-CN", label: "简体中文",  flag: "🇨🇳" },
  { code: "ar", label: "العربية",    flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी",      flag: "🇮🇳" },
  { code: "tr", label: "Türkçe",     flag: "🇹🇷" },
];

const LS_KEY = "site_lang";

function readSavedLang() {
  try { return localStorage.getItem(LS_KEY) || "en"; } catch { return "en"; }
}

async function waitForCombo(timeoutMs = 8000): Promise<HTMLSelectElement | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (el && el.options.length > 1) return el;
    await new Promise(r => setTimeout(r, 100));
  }
  return null;
}

async function setLang(code: string) {
  try { localStorage.setItem(LS_KEY, code); } catch {}
  const combo = await waitForCombo();
  if (!combo) { window.location.reload(); return; }
  combo.value = code === "en" ? "" : code;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  // small refresh of any cached translations is automatic
}

let scriptInjected = false;
function injectGoogleTranslate() {
  if (scriptInjected) return;
  scriptInjected = true;

  const style = document.createElement("style");
  style.innerHTML = `
    .goog-te-banner-frame, .skiptranslate iframe { display:none !important; visibility:hidden !important; }
    body { top: 0 !important; position: static !important; }
    #google_translate_element { position:absolute !important; left:-9999px !important; top:-9999px !important; height:0 !important; overflow:hidden !important; }
    font[style*="background-color"] { background:transparent !important; box-shadow:none !important; }
    .goog-tooltip, .goog-tooltip:hover { display:none !important; }
    .goog-text-highlight { background:transparent !important; box-shadow:none !important; }
  `;
  document.head.appendChild(style);

  const div = document.createElement("div");
  div.id = "google_translate_element";
  document.body.appendChild(div);

  (window as any).googleTranslateElementInit = function () {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
    // Apply saved language after init
    const saved = readSavedLang();
    if (saved && saved !== "en") {
      setTimeout(() => setLang(saved), 400);
    }
  };

  const s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
}


export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectGoogleTranslate();
    setCurrent(readSavedLang());
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const active = LANGS.find(l => l.code === current) || LANGS[0];

  return (
    <div ref={ref} style={{ position:"relative" }} className="notranslate" translate="no">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Change language"
        style={{
          display:"flex", alignItems:"center", gap:6,
          background:"#fff", border:"1px solid #8C8C8C",
          color:"#8C8C8C", cursor:"pointer", padding:"6px 10px", borderRadius:8,
          fontFamily:"'Poppins',sans-serif", fontSize:12, letterSpacing:".06em",
          fontWeight:600,
        }}
      >
        <span style={{ fontSize:16, lineHeight:1 }}>{active.flag}</span>
        {!compact && <span style={{ textTransform:"uppercase" }}>{active.code.split("-")[0]}</span>}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, zIndex:1000,
          background:"#fff", border:"1px solid #8C8C8C", borderRadius:8,
          minWidth:220, maxHeight:340, overflowY:"auto", padding:6,
          boxShadow:"0 16px 40px rgba(0,0,0,.18)",
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                display:"flex", alignItems:"center", gap:10, width:"100%",
                background: l.code === current ? "#FDECEC" : "transparent",
                border:"none", color:"#8C8C8C", cursor:"pointer",
                padding:"8px 10px", borderRadius:8, textAlign:"left",
                fontFamily:"'Poppins',sans-serif", fontSize:13,
                fontWeight: l.code === current ? 600 : 500,
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#F4F1EC"; }}
              onMouseOut={e => { e.currentTarget.style.background = l.code === current ? "#FDECEC" : "transparent"; }}
            >
              <span style={{ fontSize:18 }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
