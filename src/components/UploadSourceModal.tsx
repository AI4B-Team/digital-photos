// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X, Upload, Camera, Link2, HardDrive, Clipboard, Shield, Lock, Clock
} from "lucide-react";
import {
  FaFacebook, FaInstagram, FaDropbox,
} from "react-icons/fa";
import {
  SiGoogledrive, SiGooglephotos,
} from "react-icons/si";
import { Cloud as OneDriveIcon } from "lucide-react";

// Site brand palette: white surfaces, red accent, gray text/borders.
const T = {
  bg:        "#FFFFFF",
  panel:     "#FFFFFF",
  panelAlt:  "#FAFAFA",
  border:    "rgba(0,0,0,.10)",
  borderSoft:"rgba(0,0,0,.06)",
  red:       "#E61919",
  redSoft:   "rgba(230,25,25,.08)",
  ink:       "#0A0A0A",
  muted:     "#8C8C8C",
  dim:       "#B5B5B5",
};

type SourceId =
  | "local" | "camera" | "link" | "clipboard"
  | "facebook" | "instagram" | "gdrive" | "gphotos" | "dropbox" | "onedrive";

// `brand` is set ONLY for real third-party providers. Native sources use red.
const SOURCES: { id: SourceId; label: string; Icon: any; brand?: string; soon?: boolean }[] = [
  { id: "local",     label: "Local Files",   Icon: HardDrive },
  { id: "camera",    label: "Camera",        Icon: Camera },
  { id: "link",      label: "Direct Link",   Icon: Link2 },
  { id: "clipboard", label: "Clipboard",     Icon: Clipboard },
  { id: "facebook",  label: "Facebook",      Icon: FaFacebook,     brand: "#1877F2", soon: true },
  { id: "instagram", label: "Instagram",     Icon: FaInstagram,    brand: "#E4405F", soon: true },
  { id: "gdrive",    label: "Google Drive",  Icon: SiGoogledrive,  brand: "#1FA463", soon: true },
  { id: "gphotos",   label: "Google Photos", Icon: SiGooglephotos, brand: "#4285F4", soon: true },
  { id: "dropbox",   label: "Dropbox",       Icon: FaDropbox,      brand: "#0061FF", soon: true },
  { id: "onedrive",  label: "OneDrive",      Icon: OneDriveIcon,   brand: "#0078D4", soon: true },
];

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const HEADING_FONT = "'Poppins',sans-serif";

export default function UploadSourceModal({
  open,
  onClose,
  onFile,
  forCouplesPartner2 = false,
}: {
  open: boolean;
  onClose: () => void;
  onFile: (file: File) => void;
  forCouplesPartner2?: boolean;
}) {
  const [active, setActive] = useState<SourceId>("local");
  const [drag, setDrag] = useState(false);
  const [link, setLink] = useState("");
  const [linkErr, setLinkErr] = useState("");
  const [linkBusy, setLinkBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement|null>(null);
  const cameraInput = useRef<HTMLInputElement|null>(null);

  useEffect(() => {
    if (!open) {
      setActive("local"); setLink(""); setLinkErr(""); setDrag(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleFile = (f?: File | null) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      alert("Please Upload A PNG, JPEG, WebP, Or GIF Image.");
      return;
    }
    onFile(f);
    onClose();
  };

  const fetchFromUrl = async () => {
    setLinkErr("");
    if (!/^https?:\/\//i.test(link.trim())) {
      setLinkErr("Please Paste A Valid HTTP(S) Image URL.");
      return;
    }
    setLinkBusy(true);
    try {
      const res = await fetch(link.trim(), { mode: "cors" });
      if (!res.ok) throw new Error("Unable To Fetch Image (Server Blocked The Request).");
      const blob = await res.blob();
      if (!ALLOWED.includes(blob.type)) throw new Error("URL Is Not A PNG, JPEG, WebP, Or GIF Image.");
      const name = (link.split("/").pop() || "image").split("?")[0] || "image.jpg";
      const file = new File([blob], name, { type: blob.type });
      handleFile(file);
    } catch (err: any) {
      setLinkErr(err?.message || "Couldn't Load That Image. Try Downloading It And Uploading From Your Device.");
    } finally {
      setLinkBusy(false);
    }
  };

  const fromClipboard = async () => {
    try {
      // @ts-ignore
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t: string) => ALLOWED.includes(t));
        if (type) {
          const blob = await item.getType(type);
          handleFile(new File([blob], `clipboard.${type.split("/")[1]}`, { type }));
          return;
        }
      }
      alert("No Image Found On Your Clipboard. Copy An Image First, Then Try Again.");
    } catch {
      alert("Clipboard Access Denied. Use Local Files Instead.");
    }
  };

  // Shared primary button (red, white text)
  const primaryBtnStyle: React.CSSProperties = {
    background: T.red, color: "#fff", border: "none", padding: "12px 28px",
    borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: ".04em",
    cursor: "pointer", fontFamily: HEADING_FONT,
    boxShadow: "0 6px 18px rgba(230,25,25,.22)",
  };

  // Shared icon bubble (light red tint)
  const iconBubble: React.CSSProperties = {
    width: 56, height: 56, borderRadius: 14, background: T.redSoft,
    border: `1px solid ${T.border}`, display: "flex", alignItems: "center",
    justifyContent: "center", marginBottom: 16,
  };

  const dropZone = (
    <div
      className="dz"
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault(); setDrag(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      style={{
        border: `1.5px dashed ${drag ? T.red : T.border}`,
        background: drag ? T.redSoft : T.panelAlt,
        borderRadius: 12, padding: "44px 24px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", minHeight: 280, transition: "all .2s",
      }}
    >
      <div style={iconBubble}>
        <Upload size={22} color={T.red} />
      </div>
      <div style={{ fontFamily: HEADING_FONT, fontSize: 22, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
        Drag &amp; Drop Your Photo
      </div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 18, letterSpacing: ".04em" }}>
        Or
      </div>
      <button onClick={() => fileInput.current?.click()} style={primaryBtnStyle}>
        Choose A Local File
      </button>
      <p style={{ fontSize: 11, color: T.muted, marginTop: 16, lineHeight: 1.6, maxWidth: 360 }}>
        PNG, JPEG, WebP Or GIF · Up To 20MB · Best Results Above 1000×1000px
      </p>
    </div>
  );

  const cameraPanel = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 24px", minHeight: 280 }}>
      <div style={iconBubble}>
        <Camera size={22} color={T.red}/>
      </div>
      <div style={{ fontFamily: HEADING_FONT, fontSize:22, fontWeight:700, color:T.ink, marginBottom:8 }}>
        Take A Photo
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, maxWidth:340, lineHeight:1.6 }}>
        Use Your Device Camera. Hold Steady, Fill The Frame With The Face, And Use Good Light.
      </p>
      <button onClick={() => cameraInput.current?.click()} style={primaryBtnStyle}>
        Open Camera
      </button>
    </div>
  );

  const linkPanel = (
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center",
      padding:"40px 24px", minHeight:280, maxWidth:520, margin:"0 auto", width:"100%" }}>
      <div style={{ fontFamily: HEADING_FONT, fontSize:22, fontWeight:700, color:T.ink, marginBottom:6 }}>
        Paste A Direct Image Link
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, lineHeight:1.6 }}>
        The URL Must End In .jpg, .png, .webp Or .gif And Be Publicly Accessible.
      </p>
      <div style={{ display:"flex", gap:8 }}>
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          style={{ flex:1, padding:"12px 14px", borderRadius:10, border:`1px solid ${T.border}`,
            background:"#fff", color:T.ink, fontSize:13, outline:"none" }}
        />
        <button onClick={fetchFromUrl} disabled={linkBusy || !link}
          style={{ ...primaryBtnStyle, padding:"0 22px",
            opacity: (!link || linkBusy) ? .55 : 1,
            cursor: linkBusy ? "wait" : "pointer" }}>
          {linkBusy ? "Loading…" : "Import"}
        </button>
      </div>
      {linkErr && (
        <div style={{ marginTop:12, color:T.red, fontSize:12 }}>{linkErr}</div>
      )}
    </div>
  );

  const clipboardPanel = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 24px", minHeight:280 }}>
      <div style={iconBubble}>
        <Clipboard size={22} color={T.red}/>
      </div>
      <div style={{ fontFamily: HEADING_FONT, fontSize:22, fontWeight:700, color:T.ink, marginBottom:8 }}>
        Paste From Clipboard
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, maxWidth:340, lineHeight:1.6 }}>
        Copy An Image (⌘/Ctrl + C) Then Click The Button Below. We'll Read It Directly From Your Clipboard.
      </p>
      <button onClick={fromClipboard} style={primaryBtnStyle}>
        Paste Image
      </button>
    </div>
  );

  const soonPanel = (label: string, BrandIcon: any, brandColor?: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 24px", minHeight:280 }}>
      <div style={{ width:64, height:64, borderRadius:16, background:"#fff",
        border:`1px solid ${T.border}`, display:"flex", alignItems:"center",
        justifyContent:"center", marginBottom:16 }}>
        <BrandIcon size={28} color={brandColor || T.red}/>
      </div>
      <div style={{ fontFamily: HEADING_FONT, fontSize:22, fontWeight:700, color:T.ink, marginBottom:8 }}>
        {label} Import — Coming Soon
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, maxWidth:380, lineHeight:1.6 }}>
        We're Polishing The {label} Integration. In The Meantime, Download The Photo To Your Device And Upload It From <b style={{ color:T.ink }}>Local Files</b>.
      </p>
      <button onClick={() => setActive("local")}
        style={{ background:"transparent", color:T.red, border:`1px solid ${T.red}`,
          padding:"10px 22px", borderRadius:10, fontSize:12, fontWeight:700, letterSpacing:".04em",
          cursor:"pointer", fontFamily: HEADING_FONT }}>
        Use Local Files
      </button>
    </div>
  );

  let panel = dropZone;
  if (active === "camera") panel = cameraPanel;
  else if (active === "link") panel = linkPanel;
  else if (active === "clipboard") panel = clipboardPanel;
  else if (active !== "local") {
    const src = SOURCES.find(s => s.id === active)!;
    panel = soonPanel(src.label, src.Icon, src.brand);
  }

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position:"fixed", top:0, left:0, right:0, bottom:0, width:"100vw", height:"100vh",
        zIndex:2147483600,
        background:"rgba(10,10,10,.55)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:"100%", maxWidth:920, maxHeight:"90vh",
          background:T.panel, border:`1px solid ${T.border}`, borderRadius:16,
          boxShadow:"0 24px 60px rgba(0,0,0,.25)", overflow:"hidden",
          display:"flex", flexDirection:"column",
        }}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 20px", borderBottom:`1px solid ${T.borderSoft}` }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:".24em", color:T.red,
              fontWeight:700, marginBottom:4, fontFamily: HEADING_FONT, textTransform:"uppercase" }}>
              Add Your Photo
            </div>
            <div style={{ fontFamily: HEADING_FONT, fontSize:18, fontWeight:700, color:T.ink }}>
              {forCouplesPartner2 ? "Upload The Second Partner's Photo" : "Choose How To Add Your Photo"}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ width:34, height:34, borderRadius:10, background:"#fff",
              border:`1px solid ${T.border}`, color:T.muted, display:"flex",
              alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <X size={16}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ display:"flex", flex:1, minHeight:0 }}>
          {/* Sidebar */}
          <div style={{ width:240, background:T.panelAlt, borderRight:`1px solid ${T.borderSoft}`,
            padding:"12px 8px", overflowY:"auto" }}>
            {SOURCES.map(s => {
              const I = s.Icon;
              const isActive = active === s.id;
              // Real company colored icons for branded providers; red for native sources.
              const iconColor = s.brand ? s.brand : T.red;
              return (
                <button key={s.id} onClick={() => setActive(s.id)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:12,
                    padding:"10px 12px", borderRadius:8, border:"none",
                    background: isActive ? T.redSoft : "transparent",
                    color: isActive ? T.ink : T.muted,
                    cursor:"pointer", textAlign:"left", marginBottom:2,
                    fontFamily: HEADING_FONT,
                    transition:"background .15s, color .15s",
                  }}>
                  <I size={16} color={iconColor} style={{ flexShrink:0 }}/>
                  <span style={{ fontSize:13, fontWeight: isActive ? 700 : 500, flex:1 }}>{s.label}</span>
                  {s.soon && (
                    <span style={{ fontSize:9, letterSpacing:".10em", color:T.muted,
                      textTransform:"uppercase", fontWeight:600 }}>Soon</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div style={{ flex:1, padding:24, overflowY:"auto", background:T.panel }}>
            {panel}
          </div>
        </div>

        {/* Trust footer */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:18,
          padding:"12px 20px", borderTop:`1px solid ${T.borderSoft}`,
          background:T.panelAlt, color:T.muted, fontSize:11, letterSpacing:".04em", flexWrap:"wrap" }}>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Shield size={12} color={T.red}/> Encrypted Upload
          </span>
          <span style={{ color:T.dim }}>·</span>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Lock size={12} color={T.red}/> Never Shared Or Used For Training
          </span>
          <span style={{ color:T.dim }}>·</span>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Clock size={12} color={T.red}/> Auto-Deleted After 30 Days
          </span>
        </div>

        {/* Hidden inputs */}
        <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
          style={{ display:"none" }}
          onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ""; }}/>
        <input ref={cameraInput} type="file" accept="image/*" capture="environment"
          style={{ display:"none" }}
          onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ""; }}/>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
