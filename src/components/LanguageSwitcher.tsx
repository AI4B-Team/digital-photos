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

function readCookieLang() {
  const m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "en";
}

function setLang(code: string) {
  // clear existing googtrans cookies on this domain + parent domain
  const host = window.location.hostname;
  const domains = [host, "." + host, "." + host.split(".").slice(-2).join(".")];
  domains.forEach(d => {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
  });
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

  if (code !== "en") {
    const value = `/en/${code}`;
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=${host}`;
    document.cookie = `googtrans=${value}; path=/; domain=.${host}`;
  }
  window.location.reload();
}

let scriptInjected = false;
function injectGoogleTranslate() {
  if (scriptInjected) return;
  scriptInjected = true;

  // Hide the default banner / styling artifacts
  const style = document.createElement("style");
  style.innerHTML = `
    .goog-te-banner-frame, .skiptranslate { display:none !important; }
    body { top: 0 !important; }
    #google_translate_element { display:none !important; }
    font[style*="background-color"] { background:transparent !important; box-shadow:none !important; }
  `;
  document.head.appendChild(style);

  const div = document.createElement("div");
  div.id = "google_translate_element";
  document.body.appendChild(div);

  (window as any).googleTranslateElementInit = function () {
    new (window as any).google.translate.TranslateElement(
      { pageLanguage: "en", autoDisplay: false },
      "google_translate_element"
    );
  };

  const s = document.createElement("script");
  s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  s.async = true;
  document.body.appendChild(s);
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectGoogleTranslate();
    setCurrent(readCookieLang());
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
          background:"rgba(255,255,255,.06)", border:"1px solid rgba(196,150,58,.35)",
          color:"#F5EFE0", cursor:"pointer", padding:"6px 10px", borderRadius:6,
          fontFamily:"'Poppins',sans-serif", fontSize:12, letterSpacing:".06em",
        }}
      >
        <span style={{ fontSize:16, lineHeight:1 }}>{active.flag}</span>
        {!compact && <span style={{ textTransform:"uppercase" }}>{active.code.split("-")[0]}</span>}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", right:0, zIndex:1000,
          background:"#13131A", border:"1px solid rgba(196,150,58,.3)", borderRadius:8,
          minWidth:200, maxHeight:340, overflowY:"auto", padding:6,
          boxShadow:"0 16px 40px rgba(0,0,0,.55)",
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                display:"flex", alignItems:"center", gap:10, width:"100%",
                background: l.code === current ? "rgba(196,150,58,.15)" : "transparent",
                border:"none", color:"#F5EFE0", cursor:"pointer",
                padding:"8px 10px", borderRadius:6, textAlign:"left",
                fontFamily:"'Poppins',sans-serif", fontSize:13,
              }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(196,150,58,.18)"; }}
              onMouseOut={e => { e.currentTarget.style.background = l.code === current ? "rgba(196,150,58,.15)" : "transparent"; }}
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
