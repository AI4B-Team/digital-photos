// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import {
  X, Upload, Camera, Link2, Facebook, Instagram, Cloud,
  HardDrive, Image as ImageIcon, Clipboard, Smartphone, Shield, Lock
} from "lucide-react";

const T = {
  bg:        "#0B0B0F",
  panel:     "#13131A",
  panelAlt:  "#17171F",
  border:    "rgba(212,175,55,.18)",
  borderSoft:"rgba(255,255,255,.06)",
  gold:      "#D4AF37",
  goldSoft:  "rgba(212,175,55,.10)",
  cream:     "#F5EFE0",
  muted:     "#8A8579",
  dim:       "#5C5A52",
};

type SourceId =
  | "local" | "camera" | "link" | "clipboard"
  | "facebook" | "instagram" | "gdrive" | "gphotos" | "dropbox" | "onedrive";

const SOURCES: { id: SourceId; label: string; Icon: any; soon?: boolean }[] = [
  { id: "local",     label: "Local Files",   Icon: HardDrive },
  { id: "camera",    label: "Camera",        Icon: Camera },
  { id: "link",      label: "Direct Link",   Icon: Link2 },
  { id: "clipboard", label: "Clipboard",     Icon: Clipboard },
  { id: "facebook",  label: "Facebook",      Icon: Facebook,  soon: true },
  { id: "instagram", label: "Instagram",     Icon: Instagram, soon: true },
  { id: "gdrive",    label: "Google Drive",  Icon: Cloud,     soon: true },
  { id: "gphotos",   label: "Google Photos", Icon: ImageIcon, soon: true },
  { id: "dropbox",   label: "Dropbox",       Icon: Cloud,     soon: true },
  { id: "onedrive",  label: "OneDrive",      Icon: Cloud,     soon: true },
];

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

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
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleFile = (f?: File | null) => {
    if (!f) return;
    if (!ALLOWED.includes(f.type)) {
      alert("Please upload a PNG, JPEG, WebP, or GIF image.");
      return;
    }
    onFile(f);
    onClose();
  };

  const fetchFromUrl = async () => {
    setLinkErr("");
    if (!/^https?:\/\//i.test(link.trim())) {
      setLinkErr("Please paste a valid http(s) image URL.");
      return;
    }
    setLinkBusy(true);
    try {
      const res = await fetch(link.trim(), { mode: "cors" });
      if (!res.ok) throw new Error("Unable to fetch image (server blocked the request).");
      const blob = await res.blob();
      if (!ALLOWED.includes(blob.type)) throw new Error("URL is not a PNG, JPEG, WebP, or GIF image.");
      const name = (link.split("/").pop() || "image").split("?")[0] || "image.jpg";
      const file = new File([blob], name, { type: blob.type });
      handleFile(file);
    } catch (err: any) {
      setLinkErr(err?.message || "Couldn't load that image. Try downloading it and uploading from your device.");
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
      alert("No image found on your clipboard. Copy an image first, then try again.");
    } catch {
      alert("Clipboard access denied. Use Local Files instead.");
    }
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
        border: `1.5px dashed ${drag ? T.gold : T.border}`,
        background: drag ? T.goldSoft : "rgba(255,255,255,.02)",
        borderRadius: 12, padding: "44px 24px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", minHeight: 280, transition: "all .2s",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: T.goldSoft,
        border: `1px solid ${T.border}`, display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: 16,
      }}>
        <Upload size={22} color={T.gold} />
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: T.cream, marginBottom: 6, letterSpacing: ".01em" }}>
        Drag &amp; drop your photo
      </div>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 18, letterSpacing: ".04em" }}>
        or
      </div>
      <button
        onClick={() => fileInput.current?.click()}
        style={{
          background: T.gold, color: T.bg, border: "none", padding: "12px 28px",
          borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: ".08em",
          textTransform: "uppercase", cursor: "pointer",
          boxShadow: "0 6px 18px rgba(212,175,55,.22)",
        }}
      >
        Choose a local file
      </button>
      <p style={{ fontSize: 11, color: T.dim, marginTop: 16, lineHeight: 1.6, maxWidth: 360 }}>
        PNG, JPEG, WebP or GIF · up to 20MB · Best results above 1000×1000px
      </p>
    </div>
  );

  const cameraPanel = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 24px", minHeight: 280 }}>
      <div style={{ width:56, height:56, borderRadius:14, background:T.goldSoft,
        border:`1px solid ${T.border}`, display:"flex", alignItems:"center",
        justifyContent:"center", marginBottom:16 }}>
        <Camera size={22} color={T.gold}/>
      </div>
      <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, color:T.cream, marginBottom:8 }}>
        Take a photo
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, maxWidth:340, lineHeight:1.6 }}>
        Use your device camera. Hold steady, fill the frame with the face, and use good light.
      </p>
      <button onClick={() => cameraInput.current?.click()}
        style={{ background:T.gold, color:T.bg, border:"none", padding:"12px 28px",
          borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:".08em",
          textTransform:"uppercase", cursor:"pointer" }}>
        Open Camera
      </button>
    </div>
  );

  const linkPanel = (
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center",
      padding:"40px 24px", minHeight:280, maxWidth:520, margin:"0 auto", width:"100%" }}>
      <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, color:T.cream, marginBottom:6 }}>
        Paste a direct image link
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, lineHeight:1.6 }}>
        The URL must end in .jpg, .png, .webp or .gif and be publicly accessible.
      </p>
      <div style={{ display:"flex", gap:8 }}>
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          style={{ flex:1, padding:"12px 14px", borderRadius:8, border:`1px solid ${T.border}`,
            background:"rgba(255,255,255,.03)", color:T.cream, fontSize:13, outline:"none" }}
        />
        <button onClick={fetchFromUrl} disabled={linkBusy || !link}
          style={{ background:T.gold, color:T.bg, border:"none", padding:"0 22px",
            borderRadius:8, fontSize:12, fontWeight:700, letterSpacing:".08em",
            textTransform:"uppercase", cursor: linkBusy ? "wait" : "pointer",
            opacity: (!link || linkBusy) ? .55 : 1 }}>
          {linkBusy ? "Loading…" : "Import"}
        </button>
      </div>
      {linkErr && (
        <div style={{ marginTop:12, color:"#E06060", fontSize:12 }}>{linkErr}</div>
      )}
    </div>
  );

  const clipboardPanel = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 24px", minHeight:280 }}>
      <div style={{ width:56, height:56, borderRadius:14, background:T.goldSoft,
        border:`1px solid ${T.border}`, display:"flex", alignItems:"center",
        justifyContent:"center", marginBottom:16 }}>
        <Clipboard size={22} color={T.gold}/>
      </div>
      <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, color:T.cream, marginBottom:8 }}>
        Paste from clipboard
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, maxWidth:340, lineHeight:1.6 }}>
        Copy an image (⌘/Ctrl + C) then click the button below. We'll read it directly from your clipboard.
      </p>
      <button onClick={fromClipboard}
        style={{ background:T.gold, color:T.bg, border:"none", padding:"12px 28px",
          borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:".08em",
          textTransform:"uppercase", cursor:"pointer" }}>
        Paste image
      </button>
    </div>
  );

  const soonPanel = (label: string) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"40px 24px", minHeight:280 }}>
      <div style={{ width:56, height:56, borderRadius:14, background:T.goldSoft,
        border:`1px solid ${T.border}`, display:"flex", alignItems:"center",
        justifyContent:"center", marginBottom:16 }}>
        <Lock size={22} color={T.gold}/>
      </div>
      <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, color:T.cream, marginBottom:8 }}>
        {label} import — coming soon
      </div>
      <p style={{ fontSize:12, color:T.muted, marginBottom:18, maxWidth:380, lineHeight:1.6 }}>
        We're polishing the {label} integration. In the meantime, download the photo to your device and upload it from <b style={{ color:T.cream }}>Local Files</b>.
      </p>
      <button onClick={() => setActive("local")}
        style={{ background:"transparent", color:T.gold, border:`1px solid ${T.gold}`,
          padding:"10px 22px", borderRadius:8, fontSize:12, fontWeight:700, letterSpacing:".08em",
          textTransform:"uppercase", cursor:"pointer" }}>
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
    panel = soonPanel(src.label);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:1000,
        background:"rgba(5,5,9,.78)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width:"100%", maxWidth:920, maxHeight:"90vh",
          background:T.panel, border:`1px solid ${T.border}`, borderRadius:16,
          boxShadow:"0 24px 60px rgba(0,0,0,.55)", overflow:"hidden",
          display:"flex", flexDirection:"column",
        }}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 20px", borderBottom:`1px solid ${T.borderSoft}` }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:".24em", color:T.gold,
              textTransform:"uppercase", fontWeight:600, marginBottom:4 }}>
              Add your photo
            </div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:T.cream }}>
              {forCouplesPartner2 ? "Upload the second partner's photo" : "Choose how to add your photo"}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ width:34, height:34, borderRadius:10, background:"rgba(255,255,255,.04)",
              border:`1px solid ${T.borderSoft}`, color:T.cream, display:"flex",
              alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <X size={16}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ display:"flex", flex:1, minHeight:0 }}>
          {/* Sidebar */}
          <div style={{ width:220, background:T.panelAlt, borderRight:`1px solid ${T.borderSoft}`,
            padding:"12px 8px", overflowY:"auto" }}>
            {SOURCES.map(s => {
              const I = s.Icon;
              const isActive = active === s.id;
              return (
                <button key={s.id} onClick={() => setActive(s.id)}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:12,
                    padding:"10px 12px", borderRadius:8, border:"none",
                    background: isActive ? T.goldSoft : "transparent",
                    color: isActive ? T.cream : T.muted,
                    cursor:"pointer", textAlign:"left", marginBottom:2,
                    transition:"background .15s, color .15s",
                  }}>
                  <I size={16} color={isActive ? T.gold : T.muted}/>
                  <span style={{ fontSize:13, fontWeight: isActive ? 600 : 500, flex:1 }}>{s.label}</span>
                  {s.soon && (
                    <span style={{ fontSize:8, letterSpacing:".12em", color:T.dim,
                      textTransform:"uppercase" }}>Soon</span>
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
            <Shield size={12} color={T.gold}/> Encrypted upload
          </span>
          <span style={{ color:T.dim }}>·</span>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}>
            <Lock size={12} color={T.gold}/> Never shared or used for training
          </span>
          <span style={{ color:T.dim }}>·</span>
          <span>Auto-deleted after 30 days</span>
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
}
