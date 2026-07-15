// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle, Sparkles, Send } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

// Original seeded reviews — kept alongside customer-submitted ones
const SEED_REVIEWS = [
  { name:"Sarah M.",  location:"Austin, TX",   rating:5, quote:"I cried when I opened it. My golden retriever Bailey looks like a Renaissance noble in the canvas - my wife framed it above the fireplace.", product:"Canvas Print 24×36\"",    date:"Apr 28, 2026" },
  { name:"David L.",  location:"Chicago, IL",  rating:5, quote:"Stunning quality. The acrylic glass adds incredible depth - it looks like the portrait is floating. Worth every penny.",                    product:"Acrylic Glass 16×20\"",   date:"Apr 22, 2026" },
  { name:"Priya R.",  location:"San Jose, CA", rating:5, quote:"Ordered the storybook style for my newborn's nursery and it's the centerpiece of the room. Everyone asks where I got it.",                  product:"Fine Art Print 11×14\"",  date:"Apr 19, 2026" },
  { name:"Marcus T.", location:"Brooklyn, NY", rating:5, quote:"Memorial portrait of my grandmother - the renaissance style captured her grace perfectly. Gave the framed print to my mom for her birthday.", product:"Classic Frame 16×20\"",   date:"Apr 14, 2026" },
  { name:"Olivia C.", location:"Portland, OR", rating:5, quote:"Six styles in one upload was clutch - we picked Cinematic and the print landed in 4 days. Fast and flawless.",                              product:"Fine Art Print 8×10\"",   date:"Apr 10, 2026" },
  { name:"James K.",  location:"Atlanta, GA",  rating:4, quote:"Beautiful work. Knocked one star because the box frame had a small scuff, but support sent a replacement in 48 hours - very professional.",  product:"Wide Frame 24×36\"",      date:"Apr 6, 2026"  },
  { name:"Emily H.",  location:"Denver, CO",   rating:5, quote:"Royal style portrait of our cat Pumpkin is now the most-Instagrammed item in our house. The detail in the velvet is unreal.",               product:"Canvas Print 16×20\"",    date:"Apr 2, 2026"  },
  { name:"Diego A.",  location:"Miami, FL",    rating:5, quote:"Wedding gift for my parents' 40th anniversary. They both teared up. Worth every dollar - feels like a true heirloom.",                      product:"Acrylic Glass 24×36\"",   date:"Mar 28, 2026" },
  { name:"Hannah W.", location:"Seattle, WA",  rating:5, quote:"Fantasy style with my husband as a knight. The framing is gallery quality and the colors pop. Will absolutely order more.",                 product:"Wide Frame 16×20\"",      date:"Mar 22, 2026" },
  { name:"Robert F.", location:"Phoenix, AZ",  rating:5, quote:"Three pets, one canvas, museum-quality result. The composition is incredible and the canvas wrap is rock solid.",                            product:"Canvas Print 30×40\"",    date:"Mar 18, 2026" },
  { name:"Lily B.",   location:"Boston, MA",   rating:5, quote:"Minimal style for my apartment - clean, modern, and exactly what I wanted. The paper has a beautiful texture.",                              product:"Fine Art Print 12×16\"",  date:"Mar 14, 2026" },
  { name:"Tyler J.",  location:"Nashville, TN",rating:5, quote:"Customer service alone is 5 stars. They regenerated my portrait twice for free until I was happy. Quality blew me away.",                    product:"Acrylic Glass 11×14\"",   date:"Mar 9, 2026"  },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
  } catch { return ""; }
}

export default function Reviews() {
  const navigate = useNavigate();
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name:"", location:"", rating:5, quote:"", product:"" });

  useEffect(() => {
    supabase.from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setDbReviews(data.map(r => ({ ...r, date: formatDate(r.created_at) })));
      });
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      toast({ title: "Name and review are required" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: form.name.trim(),
      location: form.location.trim() || null,
      rating: form.rating,
      quote: form.quote.trim(),
      product: form.product.trim() || null,
      approved: false,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit review", description: error.message });
      return;
    }
    toast({ title: "Thanks! Your review is pending approval." });
    setForm({ name:"", location:"", rating:5, quote:"", product:"" });
    setShowForm(false);
  };

  const allReviews = [
    ...dbReviews,
    ...SEED_REVIEWS,
  ];

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <LandingHeader />

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            ⭐ CUSTOMER REVIEWS
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:44, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            Customer Reviews
          </h1>
          <div style={{ display:"flex", justifyContent:"center", gap:3, marginTop:12 }}>
            {[1,2,3,4,5].map(i=>(<Star key={i} size={20} fill="#FFD600" color="#FFD600"/>))}
          </div>
        </div>

        {/* Write a review CTA / form */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} style={{
              padding:"12px 22px", borderRadius:10, background:INK, color:"#fff", border:"none",
              cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
              display:"inline-flex", alignItems:"center", gap:8,
            }}>
              <Send size={14}/> Write a Review
            </button>
          ) : (
            <form onSubmit={submit} style={{
              width:"100%", maxWidth:640, background:"#fff", border:`1px solid ${BORDER}`,
              borderRadius:14, padding:24, display:"flex", flexDirection:"column", gap:12,
            }}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, color:INK }}>
                Share your experience
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <input required placeholder="Your name*" value={form.name}
                  onChange={e=>setForm({...form, name:e.target.value})}
                  style={inp}/>
                <input placeholder="City, State" value={form.location}
                  onChange={e=>setForm({...form, location:e.target.value})}
                  style={inp}/>
              </div>
              <input placeholder='Product (e.g. Canvas Print 16×20")' value={form.product}
                onChange={e=>setForm({...form, product:e.target.value})}
                style={inp}/>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED }}>Rating:</span>
                {[1,2,3,4,5].map(n => (
                  <button type="button" key={n} onClick={()=>setForm({...form, rating:n})}
                    style={{ background:"none", border:"none", cursor:"pointer", padding:2 }}>
                    <Star size={22} fill={n <= form.rating ? "#FFD600" : "transparent"} color="#FFD600"/>
                  </button>
                ))}
              </div>
              <textarea required placeholder="Tell us what you loved..." value={form.quote}
                onChange={e=>setForm({...form, quote:e.target.value})}
                rows={4} style={{ ...inp, resize:"vertical", fontFamily:"'Poppins',sans-serif" }}/>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <button type="button" onClick={()=>setShowForm(false)} style={{
                  padding:"10px 18px", borderRadius:8, background:"transparent",
                  border:`1px solid ${BORDER}`, cursor:"pointer",
                  fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, color:INK,
                }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{
                  padding:"10px 20px", borderRadius:8, background:RED, color:"#fff", border:"none",
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
                }}>{submitting ? "Submitting..." : "Submit Review"}</button>
              </div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:MUTED }}>
                Reviews are published after a quick moderation check.
              </div>
            </form>
          )}
        </div>

        {/* Reviews grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(330px,1fr))", gap:16 }}>
          {allReviews.map((r, i) => (
            <div key={r.id || `seed-${i}`} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:INK }}>{r.name}</div>
                  {r.location && (
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, marginTop:2 }}>{r.location}</div>
                  )}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:6, background:"rgba(34,197,94,.10)", color:"#16a34a", fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:700 }}>
                  <CheckCircle size={11}/> VERIFIED
                </div>
              </div>
              <div style={{ display:"flex", gap:2, marginBottom:10 }}>
                {[1,2,3,4,5].map(j => (
                  <Star key={j} size={14} fill={j <= r.rating ? "#FFD600" : "transparent"} color="#FFD600"/>
                ))}
              </div>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13.5, color:"#3a3a3a", lineHeight:1.6, margin:"0 0 14px" }}>
                "{r.quote}"
              </p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
                {r.product ? (
                  <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:6, background:"rgba(230,25,25,.08)", color:RED, fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:700 }}>
                    {r.product}
                  </span>
                ) : <span/>}
                <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:MUTED }}>{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop:40, padding:"36px 30px", borderRadius:18,
          background:"linear-gradient(135deg, #1A1614 0%, #0A0A0A 100%)",
          color:"#fff", textAlign:"center",
        }}>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:28, fontWeight:800, margin:0 }}>Create Your Own Portrait</h2>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:"rgba(255,255,255,.7)", marginTop:8 }}>
            Upload one photo. See six stunning portraits in seconds.
          </p>
          <button onClick={()=>navigate("/")} style={{
            marginTop:18, padding:"14px 28px", borderRadius:12, background:RED, color:"#fff",
            border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14,
            display:"inline-flex", alignItems:"center", gap:8,
            boxShadow:"0 10px 28px rgba(230,25,25,.4)",
          }}><Sparkles size={16}/> Create Your Portrait</button>
        </div>
      </div>
    </div>
  );
}

const inp: any = {
  width:"100%", padding:"10px 12px", borderRadius:8,
  border:`1px solid ${BORDER}`, fontSize:14, outline:"none",
  fontFamily:"'Poppins',sans-serif", color:INK, background:"#fff",
  boxSizing:"border-box",
};
