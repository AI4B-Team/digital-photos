// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Mail, Calendar, Sparkles, Check, Clock, Infinity as InfIcon, DollarSign } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";


const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const AMOUNTS = [25, 50, 75, 100, 150, 250];

export default function GiftCards() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [deliverOn, setDeliverOn] = useState("");

  const displayAmount = custom ? Number(custom) : amount;

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <SiteHeader current="upload" onBack={() => navigate("/")} />

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:34 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            🎁 GIFT CARDS
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:44, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            Give The Perfect Portrait
          </h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, color:MUTED, marginTop:10 }}>
            Let them choose their style, size, and finish. Delivered instantly by email.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:28 }}>
          {/* Form */}
          <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:28 }}>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:800, color:INK, margin:"0 0 14px" }}>Choose an amount</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
              {AMOUNTS.map(a => (
                <button key={a} onClick={()=>{ setAmount(a); setCustom(""); }} style={{
                  padding:"14px 8px", borderRadius:12,
                  background: (!custom && amount===a) ? RED : "#fff",
                  color: (!custom && amount===a) ? "#fff" : INK,
                  border:`1px solid ${(!custom && amount===a) ? RED : BORDER}`,
                  cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16,
                }}>${a}</button>
              ))}
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600 }}>Or enter a custom amount</label>
              <div style={{ position:"relative", marginTop:6 }}>
                <span style={{ position:"absolute", left:14, top:11, color:MUTED, fontFamily:"'Poppins',sans-serif" }}>$</span>
                <input type="number" min={10} max={1000} value={custom} onChange={e=>setCustom(e.target.value)} placeholder="100"
                  style={{ width:"100%", padding:"12px 14px 12px 28px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none" }}/>
              </div>
            </div>

            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:800, color:INK, margin:"6px 0 14px" }}>Personalize it</h2>
            {[
              ["From", from, setFrom, "Your name", "text"],
              ["To", to, setTo, "Recipient's name", "text"],
              ["Recipient email", recipientEmail, setRecipientEmail, "they@email.com", "email"],
            ].map(([l, v, s, ph, t]) => (
              <div key={l as string} style={{ marginBottom:12 }}>
                <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600 }}>{l as string}</label>
                <input type={t as string} value={v as string} onChange={e=> (s as any)(e.target.value)} placeholder={ph as string}
                  style={{ width:"100%", marginTop:6, padding:"11px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none" }}/>
              </div>
            ))}
            <div style={{ marginBottom:12 }}>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600 }}>Personal message</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Wishing you a beautiful portrait..."
                style={{ width:"100%", marginTop:6, padding:"11px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, minHeight:80, resize:"vertical", outline:"none" }}/>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600 }}>Deliver on (leave blank for instant)</label>
              <input type="date" value={deliverOn} onChange={e=>setDeliverOn(e.target.value)}
                style={{ width:"100%", marginTop:6, padding:"11px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none" }}/>
            </div>

            <button onClick={()=>navigate("/contact")} style={{
              width:"100%", padding:"14px 18px", borderRadius:12, background:RED, color:"#fff",
              border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
              boxShadow:"0 8px 22px rgba(230,25,25,.28)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}><Gift size={16}/> Purchase gift card · ${displayAmount || 0}</button>

            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:11.5, color:MUTED, marginTop:10, textAlign:"center", lineHeight:1.6 }}>
              Note: Gift cards are currently fulfilled manually within 1 business day.
              <br/>
              We're building a fully automated flow soon.
            </p>
          </div>


          {/* Preview */}
          <div>
            <div style={{
              background:"linear-gradient(135deg, #1A1614 0%, #0A0A0A 100%)",
              color:"#fff", borderRadius:18, padding:30, marginBottom:18,
              boxShadow:"0 20px 50px rgba(0,0,0,.18)",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:30 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div aria-label="REAL ART" style={{ background:RED, padding:5, width:78, flexShrink:0 }}>
                    <div style={{ border:"2px solid #fff", padding:"4px 10px", display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:900, color:"#fff", letterSpacing:".05em", lineHeight:1, textAlign:"center", display:"block" }}>REAL</span>
                      <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:6, fontWeight:700, letterSpacing:".3em", color:"#fff", textTransform:"uppercase", textAlign:"center", display:"block", marginTop:2 }}>ART</span>
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:"rgba(255,255,255,.7)" }}>Gift Card</div>
                </div>
                <Sparkles size={22} color={RED}/>
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:48, fontWeight:800, letterSpacing:"-.02em" }}>${displayAmount || 0}</div>
              <div style={{ marginTop:24, paddingTop:18, borderTop:"1px solid rgba(255,255,255,.12)" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, color:"rgba(255,255,255,.5)", letterSpacing:".14em", fontWeight:700 }}>TO</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:600, marginTop:3 }}>{to || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:10, color:"rgba(255,255,255,.5)", letterSpacing:".14em", fontWeight:700 }}>FROM</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:600, marginTop:3 }}>{from || "—"}</div>
                  </div>
                </div>
                {message && (
                  <div style={{ marginTop:14, padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,.06)", fontFamily:"'Poppins',sans-serif", fontSize:13, fontStyle:"italic", lineHeight:1.5 }}>
                    "{message}"
                  </div>
                )}
              </div>
            </div>

            <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:20, marginBottom:14 }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:800, color:INK, margin:"0 0 12px" }}>They can use it for</h3>
              {[
                "AI portrait generation in 6 styles",
                "Fine art print",
                "Canvas or acrylic glass",
                "Classic or box frame",
                "Digital download",
              ].map(l => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", fontFamily:"'Poppins',sans-serif", fontSize:13, color:INK }}>
                  <Check size={15} color={RED}/> {l}
                </div>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {[
                [Clock, "Instant", "Delivery"],
                [InfIcon, "Never", "Expires"],
                [DollarSign, "Any", "Amount"],
              ].map(([Icon, a, b], i) => (
                <div key={i} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:12, padding:14, textAlign:"center" }}>
                  <Icon size={18} color={RED} style={{marginBottom:6}}/>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:700, color:INK }}>{a as string}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:MUTED }}>{b as string}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
