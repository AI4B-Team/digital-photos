// @ts-nocheck
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, FileText, RotateCcw, Mail } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const TABS = [
  { id: "privacy", label: "Privacy Policy",   path: "/privacy", icon: Shield },
  { id: "terms",   label: "Terms Of Service", path: "/terms",   icon: FileText },
  { id: "refund",  label: "Refund Policy",    path: "/refund",  icon: RotateCcw },
];

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["Who We Are", "Real Advisors, Inc. d/b/a Real Art ('we', 'us'). We respect your privacy and handle personal data in line with applicable law."],
      ["Data We Collect", "Name, email, billing/shipping address, payment metadata (via Stripe), uploaded photos, and basic analytics (page views, device type)."],
      ["How We Use Your Data", "To process orders, generate portraits, communicate updates, prevent fraud, and improve the service."],
      ["Your Photos", "Uploaded photos are stored privately and used only to generate your portrait. We do not sell or license your photos. Originals are auto-deleted after 30 days."],
      ["Cookies", "We use essential cookies for cart/session state and a small set of analytics cookies to understand usage. You can disable cookies in your browser."],
      ["Third Parties", "Stripe (payments), Supabase (storage and database), Prodigi (print fulfillment), and Google/AI providers for portrait generation."],
      ["Security", "Data is transmitted over HTTPS. Payment information is handled by Stripe and never touches our servers."],
      ["Your Rights", "Access, correction, deletion, and portability. Email support@realart.ai to make a request."],
      ["Children", "Real Art is not directed at children under 13. We do not knowingly collect data from minors."],
      ["Changes", "We may update this policy. Material changes will be announced via email or in-app notice."],
    ],
  },
  terms: {
    title: "Terms Of Service",
    sections: [
      ["Agreement", "By using Real Art, you agree to these Terms and to our Privacy Policy."],
      ["The Service", "AI-generated portraits and optional physical prints. Output is artistic and may not perfectly match the source photo."],
      ["Your Account", "You are responsible for the accuracy of your account and order details."],
      ["Acceptable Use", "Do not upload content you do not have rights to. Do not request portraits of identifiable third parties without consent."],
      ["Intellectual Property", "You own the rights to your uploaded photos. You receive a license to use generated portraits for personal use; commercial use requires a separate license."],
      ["Pricing & Payment", "Prices are in USD unless noted. Payment is processed via Stripe at checkout."],
      ["Delivery", "Digital files are delivered immediately after generation. Physical prints ship within 3-7 business days."],
      ["AI Disclaimer", "Generated images are produced by AI and may contain artifacts or unexpected stylistic choices."],
      ["Liability Limit", "To the maximum extent permitted by law, our liability is limited to the amount you paid for the order in question."],
      ["Governing Law", "These Terms are governed by the laws of the State of Delaware, USA."],
      ["Contact", "Questions? support@realart.ai"],
    ],
  },
  refund: {
    title: "Refund Policy",
    sections: [
      ["Our Promise", "We stand behind every portrait. If you're not happy, we'll make it right - free reprint or full refund."],
      ["Digital Portraits", "Free regeneration within 14 days. Full refund available if no portrait meets your expectations."],
      ["Printed Products", "Damaged or misprinted items are replaced free of charge. Notify us within 14 days of delivery."],
      ["How To Request", "Email support@realart.ai with your order number and a brief description (and photos for damaged items)."],
      ["Stripe Disputes", "Please contact us before opening a Stripe dispute - it's almost always faster to resolve directly."],
      ["Exceptions", "We cannot refund orders where the wrong subject was uploaded or where requests violate our Acceptable Use policy."],
    ],
  },
};

export default function Legal() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = (TABS.find(t => t.path === location.pathname)?.id || "privacy");
  const [tab, setTab] = useState(initial);

  useEffect(() => {
    const t = TABS.find(t => t.path === location.pathname)?.id;
    if (t && t !== tab) setTab(t);
  }, [location.pathname]);

  const content = CONTENT[tab];

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <SiteHeader current="upload" onBack={() => navigate("/")} />

      <div style={{ maxWidth:900, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            📜 LEGAL
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:40, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            {content.title}
          </h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED, marginTop:8 }}>
            Effective May 1, 2025 · Real Advisors, Inc. d/b/a Real Art
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={()=>{ setTab(t.id); navigate(t.path, { replace:true }); }} style={{
                display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:10,
                background: active ? RED : "#fff", color: active ? "#fff" : INK,
                border: `1px solid ${active ? RED : BORDER}`, cursor:"pointer",
                fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13,
              }}>
                <Icon size={15}/> {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:16, padding:"32px 36px" }}>
          {content.sections.map(([h, b], i)=>(
            <div key={i} style={{ marginBottom:24 }}>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:17, fontWeight:800, color:INK, margin:"0 0 8px" }}>{i+1}. {h}</h3>
              <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, color:"#3a3a3a", lineHeight:1.7, margin:0 }}>{b}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop:24, padding:"18px 22px", borderRadius:12, background:"#fff",
          border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:14,
        }}>
          <Mail size={22} color={RED}/>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:INK }}>
            Questions about any of our policies? Email <a href="mailto:support@realart.ai" style={{color:RED, fontWeight:600, textDecoration:"none"}}>support@realart.ai</a>
          </div>
        </div>
      </div>
    </div>
  );
}
