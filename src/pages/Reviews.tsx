// @ts-nocheck
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle, Sparkles } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const STATS = [
  ["4.9", "Average Rating"],
  ["12+", "Reviews Shown"],
  ["5,000+", "Total Orders"],
  ["92%", "5-Star Reviews"],
];

const REVIEWS = [
  ["Sarah M.", "Austin, TX", 5, "I cried when I opened it. My golden retriever Bailey looks like a Renaissance noble in the canvas - my wife framed it above the fireplace.", "Canvas Print 24×36\"", "Apr 28, 2026"],
  ["David L.", "Chicago, IL", 5, "Stunning quality. The acrylic glass adds incredible depth - it looks like the portrait is floating. Worth every penny.", "Acrylic Glass 16×20\"", "Apr 22, 2026"],
  ["Priya R.", "San Jose, CA", 5, "Ordered the storybook style for my newborn's nursery and it's the centerpiece of the room. Everyone asks where I got it.", "Fine Art Print 11×14\"", "Apr 19, 2026"],
  ["Marcus T.", "Brooklyn, NY", 5, "Memorial portrait of my grandmother - the renaissance style captured her grace perfectly. Gave the framed print to my mom for her birthday.", "Classic Frame 16×20\"", "Apr 14, 2026"],
  ["Olivia C.", "Portland, OR", 5, "Six styles in one upload was clutch - we picked Cinematic and the print landed in 4 days. Fast and flawless.", "Fine Art Print 8×10\"", "Apr 10, 2026"],
  ["James K.", "Atlanta, GA", 4, "Beautiful work. Knocked one star because the box frame had a small scuff, but support sent a replacement in 48 hours - very professional.", "Wide Frame 24×36\"", "Apr 6, 2026"],
  ["Emily H.", "Denver, CO", 5, "Royal style portrait of our cat Pumpkin is now the most-Instagrammed item in our house. The detail in the velvet is unreal.", "Canvas Print 16×20\"", "Apr 2, 2026"],
  ["Diego A.", "Miami, FL", 5, "Wedding gift for my parents' 40th anniversary. They both teared up. Worth every dollar - feels like a true heirloom.", "Acrylic Glass 24×36\"", "Mar 28, 2026"],
  ["Hannah W.", "Seattle, WA", 5, "Fantasy style with my husband as a knight. The framing is gallery quality and the colors pop. Will absolutely order more.", "Wide Frame 16×20\"", "Mar 22, 2026"],
  ["Robert F.", "Phoenix, AZ", 5, "Three pets, one canvas, museum-quality result. The composition is incredible and the canvas wrap is rock solid.", "Canvas Print 30×40\"", "Mar 18, 2026"],
  ["Lily B.", "Boston, MA", 5, "Minimal style for my apartment - clean, modern, and exactly what I wanted. The paper has a beautiful texture.", "Fine Art Print 12×16\"", "Mar 14, 2026"],
  ["Tyler J.", "Nashville, TN", 5, "Customer service alone is 5 stars. They regenerated my portrait twice for free until I was happy. Quality blew me away.", "Acrylic Glass 11×14\"", "Mar 9, 2026"],
];

export default function Reviews() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <SiteHeader current="upload" onBack={() => navigate("/")} />

      <div style={{ maxWidth:1140, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            ⭐ CUSTOMER REVIEWS
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:44, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            Loved By 5,000+ Customers
          </h1>
          <div style={{ display:"flex", justifyContent:"center", gap:3, marginTop:12 }}>
            {[1,2,3,4,5].map(i=>(<Star key={i} size={20} fill="#FFD600" color="#FFD600"/>))}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:"24px",
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:20, marginBottom:36, textAlign:"center",
        }}>
          {STATS.map(([n,l])=>(
            <div key={l}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:30, fontWeight:800, color:RED }}>{n}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11.5, color:MUTED, letterSpacing:".1em", textTransform:"uppercase", marginTop:4, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Reviews grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(330px,1fr))", gap:16 }}>
          {REVIEWS.map(([name, loc, rating, quote, badge, date], i) => (
            <div key={i} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:INK }}>{name}</div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, color:MUTED, marginTop:2 }}>{loc}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:6, background:"rgba(34,197,94,.10)", color:"#16a34a", fontFamily:"'Poppins',sans-serif", fontSize:10, fontWeight:700 }}>
                  <CheckCircle size={11}/> VERIFIED
                </div>
              </div>
              <div style={{ display:"flex", gap:2, marginBottom:10 }}>
                {[1,2,3,4,5].map(j => (
                  <Star key={j} size={14} fill={j <= (rating as number) ? "#FFD600" : "transparent"} color="#FFD600"/>
                ))}
              </div>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13.5, color:"#3a3a3a", lineHeight:1.6, margin:"0 0 14px" }}>
                "{quote}"
              </p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:6 }}>
                <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:6, background:"rgba(230,25,25,.08)", color:RED, fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:700 }}>
                  {badge}
                </span>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:MUTED }}>{date}</span>
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
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:28, fontWeight:800, margin:0 }}>Join Thousands Of Happy Customers</h2>
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
