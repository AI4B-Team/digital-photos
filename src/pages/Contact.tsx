// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle, Instagram, Facebook, MessageCircle, Clock, Heart, Shield } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";
import { supabase } from "@/integrations/supabase/client";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const TOPICS = [
  "Order status", "Problem with portrait", "Refund request", "Shipping issue",
  "Technical issue", "Framing question", "Gift card / promo", "Something else",
];

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", order_id:"", topic:"Order status", message:"" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<{name:string; email:string}|null>(null);
  const [sending, setSending] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault(); setError("");
    if (!form.name || !form.email || !form.message) { setError("Please fill in name, email, and message."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Please enter a valid email."); return; }
    setSending(true);
    try {
      try { await supabase.from("contact_messages" as any).insert({ ...form, created_at: new Date().toISOString() }); } catch {}
      setSubmitted({ name: form.name, email: form.email });
    } finally { setSending(false); }
  }

  if (submitted) {
    return (
      <div style={{ minHeight:"100vh", background:BG }}>
        <LandingHeader />
        <div style={{ maxWidth:560, margin:"0 auto", padding:"80px 22px", textAlign:"center" }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(34,197,94,.12)", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
            <CheckCircle size={42} color="#16a34a"/>
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:32, fontWeight:800, color:INK, margin:0 }}>
            Thanks {submitted.name.split(" ")[0]}!
          </h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, color:MUTED, marginTop:12 }}>
            We received your message and will reply to <strong style={{color:INK}}>{submitted.email}</strong> within a few hours.
          </p>
          <button onClick={()=>navigate("/")} style={{
            marginTop:24, padding:"13px 26px", borderRadius:12, background:RED, color:"#fff", border:"none", cursor:"pointer",
            fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
          }}>Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <LandingHeader />

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            ✉️ CONTACT SUPPORT
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:42, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>How can we help?</h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, color:MUTED, marginTop:10 }}>
            Real humans. Real fast. Real Art support.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))", gap:14, marginBottom:32 }}>
          {[
            [Clock, "Response time", "2–4 hours"],
            [Mail, "Email support", "Mon–Fri 9am–6pm EST"],
            [MessageCircle, "Live chat", "Coming soon"],
            [Heart, "100-Day Guarantee", "Satisfaction guaranteed"],
          ].map(([Icon, l, v], i)=>(
            <div key={i} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:18, textAlign:"center" }}>
              <Icon size={22} color={RED} style={{ marginBottom:8 }}/>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11.5, color:MUTED, letterSpacing:".08em", textTransform:"uppercase", fontWeight:600 }}>{l}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:700, color:INK, marginTop:4 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24 }}>
          {/* Form */}
          <form onSubmit={submit} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:28 }}>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:20, fontWeight:800, color:INK, margin:"0 0 18px" }}>Send us a message</h2>

            {[
              ["name","Full name *","text","Your name"],
              ["email","Email address *","email","you@email.com"],
              ["order_id","Order number (optional)","text","Helps us find your order faster"],
            ].map(([k,l,t,ph])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600, letterSpacing:".06em" }}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>set(k, e.target.value)} placeholder={ph}
                  style={{ width:"100%", marginTop:6, padding:"12px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none" }}/>
              </div>
            ))}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600, letterSpacing:".06em" }}>Topic</label>
              <select value={form.topic} onChange={e=>set("topic", e.target.value)}
                style={{ width:"100%", marginTop:6, padding:"12px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, background:"#fff", outline:"none" }}>
                {TOPICS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600, letterSpacing:".06em" }}>Message *</label>
              <textarea value={form.message} onChange={e=>set("message", e.target.value)} placeholder="Tell us what's going on..."
                style={{ width:"100%", marginTop:6, padding:"12px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, minHeight:140, resize:"vertical", outline:"none" }}/>
            </div>

            {error && (
              <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(230,25,25,.08)", color:RED, fontFamily:"'Poppins',sans-serif", fontSize:13, marginBottom:14 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={sending} style={{
              width:"100%", padding:"14px 18px", borderRadius:12, background:RED, color:"#fff",
              border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
              boxShadow:"0 8px 22px rgba(230,25,25,.28)", opacity: sending ? .7 : 1,
            }}>{sending ? "Sending..." : "Send message"}</button>
          </form>

          {/* Sidebar */}
          <div>
            <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:20, marginBottom:14 }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:800, color:INK, margin:"0 0 12px" }}>Before you write</h3>
              {[
                ["Need tracking?", "/tracking"],
                ["Want a refund?", "/refund"],
                ["Need a reprint?", "/faq"],
              ].map(([l,to])=>(
                <button key={l} onClick={()=>navigate(to)} style={{
                  display:"block", textAlign:"left", width:"100%", padding:"10px 0",
                  background:"none", border:"none", borderTop:`1px solid ${BORDER}`,
                  fontFamily:"'Poppins',sans-serif", fontSize:13, color:INK, cursor:"pointer", fontWeight:500,
                }}>{l} →</button>
              ))}
            </div>

            <div style={{ background:`linear-gradient(135deg, ${RED} 0%, #B81313 100%)`, color:"#fff", borderRadius:14, padding:20, marginBottom:14 }}>
              <Shield size={22} style={{ marginBottom:10 }}/>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:800, margin:"0 0 6px" }}>100-Day Satisfaction Guarantee</h3>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:12.5, opacity:.9, margin:0, lineHeight:1.5 }}>
                Not happy? We'll redo it free or refund you fully. No fuss.
              </p>
            </div>

            <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:20 }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:800, color:INK, margin:"0 0 12px" }}>Follow us</h3>
              <a href="https://instagram.com/realartportraits" target="_blank" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", color:INK, textDecoration:"none", fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:500 }}>
                <Instagram size={18} color="#E4405F"/> @realartportraits
              </a>
              <a href="https://facebook.com/realartportraits" target="_blank" style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", color:INK, textDecoration:"none", fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:500 }}>
                <Facebook size={18} color="#1877F2"/> Real Art Portraits
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
