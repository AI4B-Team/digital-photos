// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, AlertCircle, ChevronDown, Search } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";
import { supabase } from "@/integrations/supabase/client";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const STEPS = [
  { label: "Order Placed",        icon: CheckCircle },
  { label: "AI Generation",       icon: Clock },
  { label: "Printing & Framing",  icon: Package },
  { label: "Shipped",             icon: Truck },
  { label: "Delivered",           icon: CheckCircle },
];

function statusToStep(s) {
  if (!s) return 1;
  const k = String(s).toLowerCase();
  if (k.includes("deliver")) return 4;
  if (k.includes("ship"))    return 3;
  if (k.includes("submit"))  return 2;
  return 1;
}

const FAQ = [
  ["How long does production take?", "Most orders ship within 3-5 business days after generation. Custom framed pieces may take 5-7 days."],
  ["When will my order ship?",       "You'll receive an email with tracking as soon as your order leaves our facility."],
  ["How do I get a tracking number?","Tracking is sent via email when your order ships. Check your spam folder if you don't see it."],
  ["My status hasn't updated, why?", "Statuses update once per day. If you haven't seen progress in 48 hours, contact support."],
];

export default function Tracking() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  async function lookup() {
    setError(""); setOrder(null);
    if (!email && !orderId) { setError("Enter an email or order number to look up."); return; }
    setLoading(true);
    try {
      let q: any = supabase.from("sessions").select("*").limit(1);
      if (orderId) q = q.ilike("id", `%${orderId}%`);
      else q = q.eq("email", email);
      const { data, error: e } = await q;
      if (e) throw e;
      if (!data || data.length === 0) { setError("We couldn't find an order with those details. Double-check and try again."); }
      else setOrder(data[0]);
    } catch (e:any) {
      setError("Lookup unavailable right now. Please contact support.");
    } finally { setLoading(false); }
  }

  const step = order ? statusToStep(order.prodigi_status) : 0;

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <SiteHeader current="print" onBack={() => navigate("/")} />

      <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            📦 ORDER TRACKING
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:40, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            Track My Order
          </h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, color:MUTED, marginTop:10 }}>
            Enter your email or order number to see live status.
          </p>
        </div>

        {/* Lookup card */}
        <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:28 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"
                style={{ width:"100%", marginTop:6, padding:"12px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none" }}/>
            </div>
            <div>
              <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>Order Number</label>
              <input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="e.g. abc123..."
                style={{ width:"100%", marginTop:6, padding:"12px 14px", borderRadius:10, border:`1px solid ${BORDER}`, fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none" }}/>
            </div>
          </div>
          <button onClick={lookup} disabled={loading} style={{
            width:"100%", padding:"13px 18px", borderRadius:12, background:RED, color:"#fff",
            border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:"0 8px 22px rgba(230,25,25,.28)", opacity: loading ? .7 : 1,
          }}>
            <Search size={16}/> {loading ? "Looking up..." : "Track My Order"}
          </button>

          {error && (
            <div style={{
              marginTop:14, padding:"12px 14px", borderRadius:10,
              background:"rgba(230,25,25,.08)", color:RED,
              fontFamily:"'Poppins',sans-serif", fontSize:13, display:"flex", alignItems:"center", gap:8,
            }}><AlertCircle size={16}/> {error}</div>
          )}
        </div>

        {/* Progress */}
        {order && (
          <div style={{ marginTop:24, background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:28 }}>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase" }}>Status</div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:22, fontWeight:800, color:INK, marginTop:4 }}>
              {STEPS[step]?.label || "Order Placed"}
            </div>
            {order.prodigi_order_id && (
              <div style={{ marginTop:6, fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED }}>
                Production ID: <span style={{ color:INK, fontWeight:600 }}>{order.prodigi_order_id}</span>
              </div>
            )}

            <div style={{ marginTop:24, display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, position:"relative" }}>
              <div style={{ position:"absolute", top:24, left:24, right:24, height:3, background:"#EFE9DF", borderRadius:2 }}/>
              <div style={{ position:"absolute", top:24, left:24, height:3, width:`calc(${(step/(STEPS.length-1))*100}% - 24px)`, background:RED, borderRadius:2, transition:"width .5s" }}/>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i <= step;
                return (
                  <div key={i} style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", flex:1, zIndex:1 }}>
                    <div style={{
                      width:48, height:48, borderRadius:"50%",
                      background: active ? RED : "#fff", color: active ? "#fff" : MUTED,
                      border:`2px solid ${active ? RED : BORDER}`,
                      display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s",
                    }}>
                      <Icon size={20}/>
                    </div>
                    <div style={{ marginTop:8, fontFamily:"'Poppins',sans-serif", fontSize:11.5, fontWeight: active ? 700 : 500, color: active ? INK : MUTED, textAlign:"center", maxWidth:90 }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginTop:40 }}>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:22, fontWeight:800, color:INK, marginBottom:14 }}>Frequently Asked</h2>
          {FAQ.map(([q, a], i) => (
            <div key={i} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
              <button onClick={()=>setOpenFaq(openFaq===i ? null : i)} style={{
                width:"100%", padding:"16px 18px", background:"none", border:"none", cursor:"pointer",
                display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left",
                fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14, color:INK,
              }}>
                {q}
                <ChevronDown size={18} style={{ transform: openFaq===i ? "rotate(180deg)" : "", transition:"transform .2s", color:MUTED }}/>
              </button>
              {openFaq===i && (
                <div style={{ padding:"0 18px 16px", fontFamily:"'Poppins',sans-serif", fontSize:13.5, color:MUTED, lineHeight:1.6 }}>{a}</div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{
          marginTop:32, padding:"22px 24px", borderRadius:14, background:"#fff",
          border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <AlertCircle size={28} color={RED}/>
            <div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:15, color:INK }}>Still Need Help?</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED, marginTop:2 }}>Our team replies within a few hours.</div>
            </div>
          </div>
          <button onClick={()=>navigate("/contact")} style={{
            padding:"11px 20px", borderRadius:10, background:INK, color:"#fff",
            border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
          }}>Contact Support</button>
        </div>
      </div>
    </div>
  );
}
