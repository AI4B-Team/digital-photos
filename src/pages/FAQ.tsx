// @ts-nocheck
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, HelpCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const RED = "#E61919";
const INK = "#0A0A0A";
const MUTED = "#8C8C8C";
const BG = "#FAF8F4";
const BORDER = "rgba(0,0,0,.08)";

const CATS = [
  ["Getting Started", [
    ["What is Real Art?", "Real Art turns your photos into stunning AI-generated portraits in six styles, with optional museum-quality prints."],
    ["Do I need an account?", "No - you can preview portraits for free without an account. You'll create one at checkout for order tracking."],
    ["How long does it take?", "Portraits generate in 30-60 seconds. Digital downloads are instant after checkout. Prints ship in 3-7 business days."],
    ["What photos work best?", "Clear, well-lit photos with the subject's face visible work best. Avoid heavy filters or sunglasses."],
  ]],
  ["AI Generation", [
    ["How does the AI work?", "We use state-of-the-art generative models to reimagine your photo in each art style."],
    ["Can I choose my style?", "Yes - choose from Royal, Renaissance, Storybook, Fantasy, Cinematic, and Minimal."],
    ["Can I regenerate a portrait?", "Yes - you can regenerate any style for free within 14 days of purchase."],
    ["What if I don't like the result?", "Contact support and we'll regenerate it free or refund you - your choice."],
    ["Do you store my photos?", "Photos are stored privately for portrait generation and auto-deleted after 30 days."],
  ]],
  ["Prints & Products", [
    ["What print products do you offer?", "Fine art prints, canvas, acrylic glass, and classic or wide-frame options in multiple sizes."],
    ["What materials do you use?", "Museum-grade archival paper, gallery-wrapped canvas, and crystal-clear acrylic. Built to last 100+ years."],
    ["Can I see a proof before printing?", "Yes - the preview you approve at checkout is exactly what we print."],
    ["Do you ship internationally?", "Yes - we ship worldwide. Rates and timing vary by region."],
  ]],
  ["Shipping & Delivery", [
    ["How fast is shipping?", "US: 3-5 business days standard. International: 7-14 business days."],
    ["Do you offer rush shipping?", "Yes - express options are available at checkout."],
    ["How do I track my order?", "Visit /tracking and enter your email or order number for live status."],
    ["What if my order arrives damaged?", "Email a photo to support@realartnow.com within 14 days for a free replacement."],
  ]],
  ["Refunds & Support", [
    ["What's your refund policy?", "Full refunds available within 14 days. See our Refund Policy for details."],
    ["How do I contact support?", "Use the Contact Us page or email support@realartnow.com. We reply within a few hours."],
    ["Do you offer gift cards?", "Yes - visit our Gift Cards page to purchase one in any amount."],
  ]],
];

export default function FAQ() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [openKey, setOpenKey] = useState<string|null>(null);

  const filtered = useMemo(() => {
    if (!q) return CATS;
    const needle = q.toLowerCase();
    return CATS.map(([cat, qs]) => [cat, qs.filter(([qq, aa]) => `${qq} ${aa}`.toLowerCase().includes(needle))]).filter(([,qs]) => (qs as any[]).length>0);
  }, [q]);

  return (
    <div style={{ minHeight:"100vh", background:BG }}>
      <SiteHeader current="upload" onBack={() => navigate("/")} />

      <div style={{ maxWidth:880, margin:"0 auto", padding:"40px 22px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:RED, fontWeight:700, letterSpacing:".22em", marginBottom:10 }}>
            ❓ FREQUENTLY ASKED
          </div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:42, fontWeight:800, color:INK, margin:0, letterSpacing:"-.02em" }}>
            How Can We Help?
          </h1>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, color:MUTED, marginTop:10 }}>
            24 answers across 5 categories. Can't find what you need? Reach out anytime.
          </p>
        </div>

        <div style={{ position:"relative", marginBottom:28 }}>
          <Search size={18} style={{ position:"absolute", left:16, top:14, color:MUTED }}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search questions..."
            style={{
              width:"100%", padding:"13px 16px 13px 44px", borderRadius:12,
              border:`1px solid ${BORDER}`, background:"#fff", color:INK,
              fontFamily:"'Poppins',sans-serif", fontSize:14, outline:"none",
            }}/>
        </div>

        {filtered.length === 0 ? (
          <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14, padding:36, textAlign:"center" }}>
            <HelpCircle size={36} color={MUTED} style={{ marginBottom:10 }}/>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, color:INK }}>No Matches</div>
            <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED, marginTop:6 }}>Try a different keyword, or contact our team directly.</p>
            <button onClick={()=>navigate("/contact")} style={{
              marginTop:14, padding:"10px 20px", borderRadius:10, background:RED, color:"#fff",
              border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
            }}>Contact Support</button>
          </div>
        ) : filtered.map(([cat, qs]) => (
          <div key={cat as string} style={{ marginBottom:24 }}>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:800, color:RED, letterSpacing:".14em", textTransform:"uppercase", marginBottom:12 }}>{cat as string}</h2>
            {(qs as any[]).map(([qq, aa], i) => {
              const key = `${cat}-${i}`;
              const open = openKey === key;
              return (
                <div key={key} style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:12, marginBottom:8, overflow:"hidden" }}>
                  <button onClick={()=>setOpenKey(open ? null : key)} style={{
                    width:"100%", padding:"15px 18px", background:"none", border:"none", cursor:"pointer",
                    display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left",
                    fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14, color:INK,
                  }}>
                    {qq}
                    <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "", transition:"transform .2s", color:MUTED }}/>
                  </button>
                  {open && (
                    <div style={{ padding:"0 18px 16px", fontFamily:"'Poppins',sans-serif", fontSize:13.5, color:MUTED, lineHeight:1.6 }}>{aa}</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{
          marginTop:36, padding:"24px", borderRadius:14, background:"#fff",
          border:`1px solid ${BORDER}`, textAlign:"center",
        }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:16, color:INK }}>Still Have Questions?</div>
          <p style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, color:MUTED, marginTop:6 }}>Email <a href="mailto:support@realartnow.com" style={{color:RED, fontWeight:600, textDecoration:"none"}}>support@realartnow.com</a> or use the contact form.</p>
          <button onClick={()=>navigate("/contact")} style={{
            marginTop:14, padding:"11px 22px", borderRadius:10, background:RED, color:"#fff",
            border:"none", cursor:"pointer", fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13,
          }}>Contact Us</button>
        </div>
      </div>
    </div>
  );
}
