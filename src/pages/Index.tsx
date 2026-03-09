import { useState, useEffect, useRef } from "react";
import {
  Camera, Star, Download, Share2, Edit3, Package, ChevronRight,
  ShoppingCart, X, Check, ArrowRight, Heart, Users, Baby,
  Sparkles, Crown, Gift, Sun, Snowflake, Cake, Image,
  ZoomIn, FrameIcon, Truck, Globe, Lock, ChevronDown,
  Play, Plus, Minus, Instagram, Twitter, Facebook, Layers,
  Award, Palette, Wand2, Upload, Eye, MessageCircle
} from "lucide-react";

const COLORS = {
  bg: "#080705",
  bgCard: "#0F0D0A",
  bgLight: "#161310",
  cream: "#F2EDE4",
  creamMuted: "#C8BFA8",
  gold: "#C4963A",
  goldLight: "#D4AE5C",
  goldDim: "#7A5C22",
  white: "#FAF8F5",
  border: "#221E18",
  borderLight: "#2E2820",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #080705;
    --cream: #F2EDE4;
    --gold: #C4963A;
    --gold-light: #D4AE5C;
    --border: #221E18;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--cream);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
  }

  .serif { font-family: 'Cormorant Garamond', serif; }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: #080705; }
  ::-webkit-scrollbar-thumb { background: #C4963A; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(196,150,58,0.3); }
    50% { box-shadow: 0 0 0 12px rgba(196,150,58,0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0,0); }
    25% { transform: translate(-1%,-1%); }
    50% { transform: translate(1%,1%); }
    75% { transform: translate(-1%,1%); }
  }

  .animate-fade-up { animation: fadeUp 0.8s ease forwards; }
  .animate-fade-in { animation: fadeIn 1s ease forwards; }
  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-pulse-gold { animation: pulse-gold 2s infinite; }

  .gold-shimmer {
    background: linear-gradient(90deg, #C4963A, #F0D080, #C4963A, #A07030, #C4963A);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .grain-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.4;
    pointer-events: none;
    animation: grain 8s steps(2) infinite;
  }

  .nav-link {
    color: #C8BFA8;
    text-decoration: none;
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: color 0.3s;
    font-weight: 400;
    cursor: pointer;
  }
  .nav-link:hover { color: #C4963A; }

  .btn-gold {
    background: linear-gradient(135deg, #C4963A, #E8B84B, #C4963A);
    color: #080705;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }
  .btn-gold:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(196,150,58,0.4);
  }

  .btn-outline {
    background: transparent;
    color: #C4963A;
    border: 1px solid #C4963A;
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }
  .btn-outline:hover {
    background: rgba(196,150,58,0.08);
    transform: translateY(-1px);
  }

  .card-hover {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    border-color: rgba(196,150,58,0.4) !important;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8,7,5,0.9) 0%, rgba(8,7,5,0.2) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s;
    display: flex;
    align-items: flex-end;
    padding: 20px;
  }
  .photo-card:hover .image-overlay { opacity: 1; }

  .tab-active {
    color: #C4963A !important;
    border-bottom: 1px solid #C4963A !important;
  }

  input, textarea, select {
    background: #0F0D0A;
    border: 1px solid #2E2820;
    color: #F2EDE4;
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    outline: none;
    transition: border-color 0.3s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: #C4963A;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(8,7,5,0.92);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  .pricing-popular {
    position: relative;
    border-color: rgba(196,150,58,0.6) !important;
  }
  .pricing-popular::before {
    content: 'MOST POPULAR';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #C4963A, #E8B84B);
    color: #080705;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.2em;
    padding: 4px 14px;
    font-family: 'Outfit', sans-serif;
  }

  .divider-gold {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #C4963A, transparent);
    margin: 0 auto;
  }

  .section-label {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #C4963A;
    font-weight: 500;
    font-family: 'Outfit', sans-serif;
  }

  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .mobile-col { flex-direction: column !important; }
  }
`;

const CATEGORIES = [
  {
    id: "legends",
    label: "Legends",
    subtitle: "You, Reimagined",
    icon: Crown,
    desc: "Step into a world where your portrait becomes art. AI-rendered sessions that capture who you truly are — and who you dare to become.",
    sessions: ["Classic Portrait", "Editorial Fantasy", "Birthday Royale", "Holiday Glow", "Anniversary Edition", "Corporate Prestige"],
    color: "#8B6914",
    sample: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
  },
  {
    id: "cherubs",
    label: "Cherubs",
    subtitle: "Tiny Humans, Infinite Magic",
    icon: Baby,
    desc: "The most precious moments in the most breathtaking settings. Baby portraits that families frame and treasure for generations.",
    sessions: ["Newborn Dreamer", "First Birthday", "Holiday Wonder", "Fairytale Series", "Milestone Moments", "Seasonal Joy"],
    color: "#6B4C7A",
    sample: "https://images.unsplash.com/photo-1554797589-7241bb691973?w=400&h=500&fit=crop",
  },
  {
    id: "paws",
    label: "Paws",
    subtitle: "Fur Babies Deserve Fine Art",
    icon: Heart,
    desc: "Your pet. Royal treatment. AI photoshoots that turn your furry family member into the subject of museum-worthy portraiture.",
    sessions: ["Royal Portrait", "Christmas Paws", "Birthday Bark", "Fantasy Forest", "Studio Glam", "Seasonal Series"],
    color: "#2D6B4A",
    sample: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=500&fit=crop",
  },
];

const PACKS = {
  legends: [
    { name: "Spark", price: 19, images: 10, sessions: 1, downloads: true, framing: false, community: false, edits: false, features: ["10 AI portraits", "1 theme/scene", "HD download", "Instant delivery"] },
    { name: "Icon", price: 49, images: 30, sessions: 3, downloads: true, framing: true, community: true, edits: true, features: ["30 AI portraits", "3 themes/scenes", "HD + print-ready files", "Edit & retouch tools", "1 complimentary frame credit", "Community template access"], popular: true },
    { name: "Legend", price: 99, images: 80, sessions: "Unlimited", downloads: true, framing: true, community: true, edits: true, features: ["80 AI portraits", "All themes unlocked", "Commercial use license", "Priority rendering", "3 frame credits", "Submit to community gallery", "Dedicated style concierge"] },
  ],
  cherubs: [
    { name: "Sprout", price: 19, images: 10, sessions: 1, downloads: true, framing: false, community: false, edits: false, features: ["10 AI baby portraits", "1 theme/scene", "HD download", "Instant delivery"] },
    { name: "Bloom", price: 49, images: 30, sessions: 3, downloads: true, framing: true, community: true, edits: true, features: ["30 AI baby portraits", "3 themes/scenes", "HD + print-ready files", "Edit & retouch tools", "1 complimentary frame credit", "Community template access"], popular: true },
    { name: "Cherub Elite", price: 99, images: 80, sessions: "Unlimited", downloads: true, framing: true, community: true, edits: true, features: ["80 AI baby portraits", "All themes unlocked", "Premium nursery prints", "3 frame credits", "Submit to community gallery", "Keepsake collection box"] },
  ],
  paws: [
    { name: "Puppy Love", price: 19, images: 10, sessions: 1, downloads: true, framing: false, community: false, edits: false, features: ["10 AI pet portraits", "1 theme/scene", "HD download", "Instant delivery"] },
    { name: "Top Dog", price: 49, images: 30, sessions: 3, downloads: true, framing: true, community: true, edits: true, features: ["30 AI pet portraits", "3 themes/scenes", "HD + print-ready files", "Edit & retouch tools", "1 complimentary frame credit", "Community template access"], popular: true },
    { name: "Alpha", price: 99, images: 80, sessions: "Unlimited", downloads: true, framing: true, community: true, edits: true, features: ["80 AI pet portraits", "All themes unlocked", "Commercial use license", "3 frame credits", "Submit to community gallery", "Vet-approved pet portraits"] },
  ],
};

const FRAMES = [
  { id: "walnut", name: "Walnut Classic", price: 49, size: '8"×10"', desc: "Rich dark walnut with a linen mat. Timeless." },
  { id: "gold-leaf", name: "Gold Leaf Ornate", price: 79, size: '11"×14"', desc: "Baroque-inspired gold leaf frame. Drama personified." },
  { id: "float", name: "Float Glass", price: 69, size: '12"×16"', desc: "Museum-quality acrylic float mount. Ultra-modern." },
  { id: "canvas", name: "Gallery Canvas Wrap", price: 89, size: '16"×20"', desc: "Gallery-wrapped canvas, ready to hang. Pure impact." },
  { id: "acrylic", name: "Crystal Acrylic", price: 99, size: '12"×16"', desc: "Face-mounted crystal acrylic print. Luminous depth." },
  { id: "set", name: "Triptych Set", price: 149, size: "3-panel set", desc: "Three coordinated prints. A statement wall piece." },
];

const COMMUNITY_TEMPLATES = [
  { user: "M. Laurent", theme: "Venetian Noir", likes: 2847, uses: 1203, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=380&fit=crop" },
  { user: "D. Okafor", theme: "Golden Hour Royale", likes: 4102, uses: 2891, img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=380&fit=crop" },
  { user: "S. Reyes", theme: "Arctic Dreamscape", likes: 1934, uses: 876, img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=380&fit=crop" },
  { user: "K. Tanaka", theme: "Tokyo Neon Bloom", likes: 3567, uses: 1654, img: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=300&h=380&fit=crop" },
  { user: "A. Moreau", theme: "Parisian Atelier", likes: 2190, uses: 943, img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=380&fit=crop" },
  { user: "R. Hassan", theme: "Desert Empress", likes: 5201, uses: 3102, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=380&fit=crop" },
];

const HOW_IT_WORKS = [
  { num: "01", icon: Upload, title: "Upload Your Photos", desc: "Upload 5–15 clear photos. We train your AI model in minutes." },
  { num: "02", icon: Wand2, title: "Choose Your Session", desc: "Pick a category, theme, and pack. Or use a community template." },
  { num: "03", icon: Sparkles, title: "AI Works Its Magic", desc: "Receive 10–80 stunning portraits in under 30 minutes." },
  { num: "04", icon: Package, title: "Download, Frame & Ship", desc: "Download instantly, share, edit — or have it framed & shipped to your door." },
];

export default function DigitalPhotos() {
  const [activeCat, setActiveCat] = useState("legends");
  const [activeTab, setActiveTab] = useState("home");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [orderStep, setOrderStep] = useState(1);
  const [bumpsAdded, setBumpsAdded] = useState([]);
  const [navScrolled, setNavScrolled] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [qty, setQty] = useState({});

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.price, 0) + bumpsAdded.reduce((s, b) => s + b.price, 0);

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (idx) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleBump = (bump) => {
    setBumpsAdded(prev =>
      prev.find(b => b.id === bump.id) ? prev.filter(b => b.id !== bump.id) : [...prev, bump]
    );
  };

  const ORDER_BUMPS = [
    { id: "rush", label: "⚡ Rush Delivery", desc: "Get your portraits in 5 minutes, not 30", price: 9, icon: Sparkles },
    { id: "hd", label: "🖼 XL Print Files", desc: "Upscaled to 40MP for poster/canvas printing", price: 14, icon: Image },
    { id: "extra", label: "+20 Bonus Portraits", desc: "20 additional portraits from your session", price: 19, icon: Plus },
    { id: "commercial", label: "Commercial License", desc: "Use your portraits for business, branding, social ads", price: 29, icon: Globe },
  ];

  const s = {
    // Nav
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: navScrolled ? "rgba(8,7,5,0.96)" : "transparent",
      backdropFilter: navScrolled ? "blur(16px)" : "none",
      borderBottom: navScrolled ? `1px solid ${COLORS.border}` : "none",
      transition: "all 0.4s ease",
      padding: "0 40px",
    },
    navInner: {
      maxWidth: 1280, margin: "0 auto",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72,
    },
    logo: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 22, fontWeight: 500, letterSpacing: "0.1em",
      color: COLORS.cream, textDecoration: "none", cursor: "pointer",
    },
    logoSpan: { color: COLORS.gold },
    navLinks: { display: "flex", gap: 36, alignItems: "center" },
    cartBtn: {
      display: "flex", alignItems: "center", gap: 8,
      background: "transparent", border: `1px solid ${COLORS.border}`,
      color: COLORS.creamMuted, padding: "8px 16px", cursor: "pointer",
      fontFamily: "'Outfit', sans-serif", fontSize: 12, letterSpacing: "0.08em",
      transition: "all 0.3s",
    },

    // Hero
    hero: {
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(100,70,20,0.25) 0%, transparent 70%), ${COLORS.bg}`,
    },
    heroLines: {
      position: "absolute", inset: 0, opacity: 0.06,
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(196,150,58,0.5) 80px, rgba(196,150,58,0.5) 81px)`,
    },
    heroContent: {
      textAlign: "center", maxWidth: 900, padding: "0 24px",
      position: "relative", zIndex: 2,
    },
    eyebrow: {
      display: "inline-flex", alignItems: "center", gap: 10,
      fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
      color: COLORS.gold, fontWeight: 500, marginBottom: 32,
      border: `1px solid rgba(196,150,58,0.25)`, padding: "8px 20px",
    },
    heroTitle: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(52px, 8vw, 112px)",
      fontWeight: 300, lineHeight: 0.95,
      color: COLORS.cream, letterSpacing: "-0.02em",
      marginBottom: 32,
    },
    heroSub: {
      fontSize: 16, color: COLORS.creamMuted, lineHeight: 1.7,
      maxWidth: 560, margin: "0 auto 48px", fontWeight: 300,
    },
    heroBtns: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },

    // Sections
    section: { padding: "120px 40px", maxWidth: 1280, margin: "0 auto" },
    sectionFull: { padding: "120px 0" },
    sectionHeader: { textAlign: "center", marginBottom: 80 },
    h2: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300,
      color: COLORS.cream, letterSpacing: "-0.01em", lineHeight: 1.1,
    },
    h3: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 28, fontWeight: 400, color: COLORS.cream,
    },
    subtext: { color: COLORS.creamMuted, fontSize: 15, lineHeight: 1.7, fontWeight: 300 },

    // Category tabs
    catTabs: {
      display: "flex", gap: 0, borderBottom: `1px solid ${COLORS.border}`,
      marginBottom: 60, overflowX: "auto",
    },
    catTab: {
      padding: "16px 32px", cursor: "pointer", fontSize: 12,
      letterSpacing: "0.15em", textTransform: "uppercase",
      color: COLORS.creamMuted, borderBottom: "2px solid transparent",
      transition: "all 0.3s", whiteSpace: "nowrap", fontWeight: 400,
      background: "none", border: "none", fontFamily: "'Outfit', sans-serif",
    },
    catTabActive: {
      color: COLORS.gold,
      borderBottom: `2px solid ${COLORS.gold}`,
    },

    // Cards
    card: {
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      overflow: "hidden",
    },
    pricingCard: {
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      padding: "40px 32px",
      position: "relative",
    },

    // Pricing
    pricingGrid: {
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24, maxWidth: 1000, margin: "0 auto",
    },
    price: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 56, fontWeight: 300, color: COLORS.cream,
    },
    featureRow: {
      display: "flex", gap: 10, alignItems: "flex-start",
      fontSize: 13, color: COLORS.creamMuted, marginBottom: 10,
      lineHeight: 1.5,
    },

    // Frames
    framesGrid: {
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
    },
    frameCard: {
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      padding: "28px 24px", cursor: "pointer",
      transition: "all 0.3s",
    },

    // Community
    communityGrid: {
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
    },
    commCard: {
      position: "relative", overflow: "hidden", cursor: "pointer",
    },

    // Modal
    modal: {
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.borderLight}`,
      width: "100%", maxWidth: 680,
      maxHeight: "90vh", overflow: "auto",
      position: "relative",
    },

    // Steps (how it works)
    stepsGrid: {
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      gap: 40,
    },
  };

  const CatIcon = CATEGORIES.find(c => c.id === activeCat)?.icon || Crown;
  const currentPacks = PACKS[activeCat] || PACKS.legends;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <style>{css}</style>

      {/* ─── NAV ─── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo} onClick={() => setActiveTab("home")}>
            Digital<span style={s.logoSpan}>Photos</span>
            <span style={{ fontSize: 9, verticalAlign: "super", marginLeft: 4, color: COLORS.goldDim, letterSpacing: "0.2em" }}>™</span>
          </div>
          <div style={s.navLinks} className="hide-mobile">
            {["Sessions", "Gallery", "Pricing", "Frames", "Community"].map(l => (
              <span key={l} className="nav-link" onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="nav-link hide-mobile">Sign In</span>
            <button
              className="btn-gold"
              style={{ padding: "10px 22px", fontSize: 11, letterSpacing: "0.12em" }}
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Now
            </button>
            <button
              style={{ ...s.cartBtn, position: "relative" }}
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart size={14} />
              <span style={{ fontSize: 11 }}>{cart.length}</span>
              {cart.length > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6, width: 16, height: 16,
                  background: COLORS.gold, borderRadius: "50%", fontSize: 9,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: COLORS.bg, fontWeight: 700,
                }}>
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={s.hero} className="grain-overlay">
        <div style={s.heroLines} />
        {/* Floating orbs */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,150,58,0.08) 0%, transparent 70%)",
          top: "10%", left: "-10%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,80,180,0.05) 0%, transparent 70%)",
          bottom: "15%", right: "-5%", pointerEvents: "none",
        }} />

        <div style={s.heroContent}>
          <div className="animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div style={s.eyebrow}>
              <Sparkles size={10} />
              AI-Powered Fine Art Photography
              <Sparkles size={10} />
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <h1 style={s.heroTitle}>
              You've Never
              <br />
              <span className="gold-shimmer">Looked Like</span>
              <br />
              <em style={{ fontStyle: "italic" }}>This Before.</em>
            </h1>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <p style={s.heroSub}>
              Studio-quality AI portraits for people, pets & babies — in any setting imaginable.
              Upload a few photos. Choose a scene. Receive 80+ breathtaking images in minutes.
            </p>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.55s", opacity: 0 }}>
            <div style={s.heroBtns}>
              <button
                className="btn-gold"
                style={{ padding: "18px 42px", fontSize: 12, letterSpacing: "0.15em" }}
                onClick={() => document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" })}
              >
                Create My Portraits
              </button>
              <button
                className="btn-outline"
                style={{ padding: "18px 36px", fontSize: 12 }}
                onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Gallery
              </button>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.7s", opacity: 0, marginTop: 56 }}>
            <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
              {[["50K+", "Portraits Created"], ["4.9★", "Average Rating"], ["180+", "Scenes & Themes"], ["Free", "Community Templates"]].map(([n, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: COLORS.cream, fontWeight: 300 }}>{n}</div>
                  <div style={{ fontSize: 10, color: COLORS.creamMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }} className="animate-float">
          <ChevronDown size={18} color={COLORS.goldDim} />
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ ...s.sectionFull, background: COLORS.bgLight }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ ...s.sectionHeader }}>
            <div className="section-label" style={{ marginBottom: 16 }}>The Process</div>
            <h2 style={s.h2}>Four Steps to <em>Extraordinary</em></h2>
            <div className="divider-gold" style={{ marginTop: 28 }} />
          </div>
          <div style={s.stepsGrid}>
            {HOW_IT_WORKS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 56, height: 56, border: `1px solid ${COLORS.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px", position: "relative",
                  }}>
                    <StepIcon size={20} color={COLORS.gold} />
                    <span style={{
                      position: "absolute", top: -12, right: -12,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 11, color: COLORS.goldDim, letterSpacing: "0.1em",
                    }}>{step.num}</span>
                  </div>
                  <h3 style={{ ...s.h3, fontSize: 20, marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ ...s.subtext, fontSize: 14 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SESSIONS ─── */}
      <section id="sessions" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={s.sectionHeader}>
            <div className="section-label" style={{ marginBottom: 16 }}>Choose Your Subject</div>
            <h2 style={s.h2}>Every Soul Deserves <em>Fine Art</em></h2>
            <p style={{ ...s.subtext, maxWidth: 500, margin: "20px auto 0" }}>
              Three distinct session categories, each with its own universe of themes, styles, and moments.
            </p>
          </div>

          {/* Category Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 80 }}>
            {CATEGORIES.map(cat => {
              const CIcon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <div
                  key={cat.id}
                  className="card-hover photo-card"
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    ...s.card,
                    position: "relative", overflow: "hidden",
                    border: isActive ? `1px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
                    height: 420,
                  }}
                >
                  <img
                    src={cat.sample}
                    alt={cat.label}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(to top, rgba(8,7,5,0.97) 0%, rgba(8,7,5,0.5) 50%, rgba(8,7,5,0.2) 100%)`,
                    padding: "32px 28px",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <CIcon size={16} color={COLORS.gold} />
                      <span style={{ fontSize: 10, color: COLORS.gold, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                        {cat.subtitle}
                      </span>
                    </div>
                    <h3 style={{ ...s.h3, fontSize: 36, marginBottom: 12 }}>{cat.label}</h3>
                    <p style={{ ...s.subtext, fontSize: 13, marginBottom: 20 }}>{cat.desc}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {cat.sessions.slice(0, 3).map(sess => (
                        <span key={sess} style={{
                          fontSize: 10, color: COLORS.creamMuted,
                          border: `1px solid ${COLORS.border}`,
                          padding: "4px 10px", letterSpacing: "0.1em",
                        }}>{sess}</span>
                      ))}
                      <span style={{ fontSize: 10, color: COLORS.goldDim, padding: "4px 10px" }}>+{cat.sessions.length - 3} more</span>
                    </div>
                    {isActive && (
                      <div style={{
                        position: "absolute", top: 20, right: 20,
                        background: COLORS.gold, width: 28, height: 28,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Check size={14} color={COLORS.bg} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Session Themes for active category */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <CatIcon size={16} color={COLORS.gold} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.cream }}>
                {CATEGORIES.find(c => c.id === activeCat)?.label} Sessions
              </span>
              <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {CATEGORIES.find(c => c.id === activeCat)?.sessions.map((sess, i) => {
                const icons = [Snowflake, Cake, Crown, Sun, Gift, Star, Camera, Heart, Sparkles];
                const SIcon = icons[i % icons.length];
                return (
                  <div
                    key={sess}
                    className="card-hover"
                    style={{
                      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                      padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, border: `1px solid ${COLORS.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <SIcon size={14} color={COLORS.gold} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: COLORS.cream, marginBottom: 2 }}>{sess}</div>
                      <div style={{ fontSize: 11, color: COLORS.creamMuted }}>Browse templates →</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section id="gallery" style={{ ...s.sectionFull, background: COLORS.bgLight }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={s.sectionHeader}>
            <div className="section-label" style={{ marginBottom: 16 }}>Teaser Gallery</div>
            <h2 style={s.h2}>The Art Speaks <em>for Itself</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
            {[
              "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop",
              "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop",
              "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=400&fit=crop",
              "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=400&fit=crop",
              "https://images.unsplash.com/photo-1554797589-7241bb691973?w=300&h=400&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
            ].map((img, i) => (
              <div
                key={i}
                className="photo-card card-hover"
                style={{ position: "relative", overflow: "hidden", cursor: "pointer", height: i % 2 === 0 ? 320 : 260 }}
                onClick={() => setLightbox(img)}
              >
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", display: "block" }} />
                <div className="image-overlay">
                  <ZoomIn size={16} color={COLORS.cream} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="btn-outline" style={{ padding: "14px 36px", fontSize: 11 }}>
              View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={s.sectionHeader}>
            <div className="section-label" style={{ marginBottom: 16 }}>Choose Your Pack</div>
            <h2 style={s.h2}>Investment in <em>Your Legacy</em></h2>
            <p style={{ ...s.subtext, maxWidth: 480, margin: "20px auto 0" }}>
              Every pack includes instant HD downloads, sharing tools & image editing. No subscription required.
            </p>
          </div>

          {/* Category Tabs */}
          <div style={s.catTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                style={{
                  ...s.catTab,
                  ...(activeCat === cat.id ? s.catTabActive : {}),
                }}
                onClick={() => setActiveCat(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={s.pricingGrid}>
            {currentPacks.map((pack, i) => (
              <div
                key={pack.name}
                className={pack.popular ? "pricing-popular card-hover" : "card-hover"}
                style={{
                  ...s.pricingCard,
                  ...(pack.popular ? { background: "rgba(196,150,58,0.04)" } : {}),
                }}
              >
                <div style={{ marginBottom: 8, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold }}>
                  {CATEGORIES.find(c => c.id === activeCat)?.label} —
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: COLORS.cream, marginBottom: 4 }}>
                  {pack.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "20px 0 8px" }}>
                  <span style={s.price}>${pack.price}</span>
                  <span style={{ color: COLORS.creamMuted, fontSize: 13 }}>one-time</span>
                </div>
                <div style={{ color: COLORS.creamMuted, fontSize: 12, marginBottom: 32, letterSpacing: "0.05em" }}>
                  {pack.images} portraits · {typeof pack.sessions === "number" ? `${pack.sessions} theme${pack.sessions > 1 ? "s" : ""}` : pack.sessions + " themes"}
                </div>
                <div style={{ height: 1, background: COLORS.border, marginBottom: 28 }} />
                {pack.features.map(f => (
                  <div key={f} style={s.featureRow}>
                    <Check size={12} color={COLORS.gold} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span>{f}</span>
                  </div>
                ))}
                <button
                  className="btn-gold"
                  style={{
                    width: "100%", padding: "16px", fontSize: 11,
                    letterSpacing: "0.12em", marginTop: 32,
                    background: pack.popular ? "linear-gradient(135deg, #C4963A, #E8B84B, #C4963A)" : "transparent",
                    color: pack.popular ? COLORS.bg : COLORS.gold,
                    border: pack.popular ? "none" : `1px solid ${COLORS.gold}`,
                  }}
                  onClick={() => {
                    setSelectedPack({ ...pack, category: activeCat });
                    addToCart({ name: `${CATEGORIES.find(c => c.id === activeCat)?.label} — ${pack.name}`, price: pack.price, type: "pack" });
                    setShowCheckout(true);
                  }}
                >
                  Select {pack.name}
                </button>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", color: COLORS.creamMuted, fontSize: 12, marginTop: 40, letterSpacing: "0.05em" }}>
            All packs include: instant delivery · HD downloads · share & edit tools · 30-day satisfaction guarantee
          </p>
        </div>
      </section>

      {/* ─── FRAMES ─── */}
      <section id="frames" style={{ ...s.sectionFull, background: COLORS.bgLight }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={s.sectionHeader}>
            <div className="section-label" style={{ marginBottom: 16 }}>Print & Frame</div>
            <h2 style={s.h2}>From Screen to <em>Wall</em></h2>
            <p style={{ ...s.subtext, maxWidth: 520, margin: "20px auto 0" }}>
              Choose your frame. We print, frame, and hand-deliver to your door — anywhere in the world.
              Museum archival inks. Gallery-quality substrates. White-glove packaging.
            </p>
          </div>

          {/* Shipping features */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 60 }}>
            {[
              { icon: Award, label: "Archival Inks", desc: "100-year fade resistance" },
              { icon: Package, label: "White-Glove Pack", desc: "Arrives ready to hang" },
              { icon: Truck, label: "Free Shipping", desc: "On orders over $75" },
              { icon: Globe, label: "Ships Worldwide", desc: "180+ countries" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ textAlign: "center", padding: "28px 20px", border: `1px solid ${COLORS.border}`, background: COLORS.bgCard }}>
                <Icon size={20} color={COLORS.gold} style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 13, color: COLORS.cream, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 11, color: COLORS.creamMuted }}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={s.framesGrid}>
            {FRAMES.map(frame => (
              <div
                key={frame.id}
                className="card-hover"
                style={{
                  ...s.frameCard,
                  border: selectedFrame?.id === frame.id ? `1px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
                }}
                onClick={() => setSelectedFrame(frame)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <FrameIcon size={20} color={COLORS.gold} />
                  {selectedFrame?.id === frame.id && <Check size={14} color={COLORS.gold} />}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.cream, marginBottom: 6 }}>
                  {frame.name}
                </div>
                <div style={{ fontSize: 11, color: COLORS.creamMuted, marginBottom: 16 }}>{frame.size} · {frame.desc}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: COLORS.gold }}>
                  ${frame.price}
                </div>
                <button
                  className="btn-outline"
                  style={{ width: "100%", padding: "12px", fontSize: 10, marginTop: 20, letterSpacing: "0.12em" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFrame(frame);
                    addToCart({ name: frame.name, price: frame.price, type: "frame" });
                  }}
                >
                  Add Frame
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY ─── */}
      <section id="community" style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={s.sectionHeader}>
            <div className="section-label" style={{ marginBottom: 16 }}>Community Templates</div>
            <h2 style={s.h2}>Inspired by <em>Each Other</em></h2>
            <p style={{ ...s.subtext, maxWidth: 520, margin: "20px auto 0" }}>
              Members share their AI session prompts. Use any template to recreate a look. Create something iconic? Share it — and watch the world follow your aesthetic.
            </p>
          </div>

          <div style={s.communityGrid}>
            {COMMUNITY_TEMPLATES.map((tpl, i) => (
              <div
                key={i}
                className="photo-card card-hover"
                style={{ ...s.commCard }}
              >
                <img src={tpl.img} alt={tpl.theme} style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
                <div className="image-overlay" style={{ opacity: 1, background: "linear-gradient(to top, rgba(8,7,5,0.92) 0%, transparent 60%)" }}>
                  <div style={{ width: "100%" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.cream, marginBottom: 4 }}>
                      {tpl.theme}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.creamMuted, marginBottom: 12 }}>by {tpl.user}</div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: COLORS.creamMuted, display: "flex", alignItems: "center", gap: 4 }}>
                        <Heart size={10} /> {tpl.likes.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 11, color: COLORS.creamMuted, display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={10} /> {tpl.uses.toLocaleString()} uses
                      </span>
                      <button className="btn-gold" style={{ marginLeft: "auto", padding: "6px 14px", fontSize: 9, letterSpacing: "0.12em" }}>
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 60, padding: "40px", border: `1px solid ${COLORS.border}`,
            background: COLORS.bgCard, textAlign: "center",
          }}>
            <Globe size={24} color={COLORS.gold} style={{ marginBottom: 16 }} />
            <h3 style={{ ...s.h3, marginBottom: 12 }}>Share Your Aesthetic with the World</h3>
            <p style={{ ...s.subtext, maxWidth: 480, margin: "0 auto 28px" }}>
              Members with a Legend or Alpha pack can publish their session templates. Top shared prompts earn rewards and exclusive status.
            </p>
            <button className="btn-gold" style={{ padding: "14px 36px", fontSize: 11, letterSpacing: "0.12em" }}>
              Join the Community
            </button>
          </div>
        </div>
      </section>

      {/* ─── IMAGE TOOLS ─── */}
      <section style={{ ...s.sectionFull, background: COLORS.bgLight }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div className="section-label" style={{ marginBottom: 20 }}>Your Images, Your Control</div>
              <h2 style={{ ...s.h2, textAlign: "left" }}>Download. Edit.
                <br /><em>Share Everywhere.</em>
              </h2>
              <p style={{ ...s.subtext, marginTop: 20, marginBottom: 40 }}>
                Every portrait you create is yours. Download in full HD, edit with built-in retouching tools, share directly to Instagram, TikTok, and beyond — or print and frame it for your wall.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: Download, label: "HD Download", desc: "Up to 40MP files" },
                  { icon: Share2, label: "One-Click Share", desc: "Any platform, any format" },
                  { icon: Edit3, label: "In-App Editor", desc: "Retouch, crop, filter" },
                  { icon: Layers, label: "Style Transfer", desc: "Remix to new scenes" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={13} color={COLORS.gold} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: COLORS.cream, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 11, color: COLORS.creamMuted }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{
                background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                padding: 24, position: "relative",
              }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop"
                  alt="Sample portrait"
                  style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  {[Download, Edit3, Share2, Heart, FrameIcon].map((Icon, i) => (
                    <button
                      key={i}
                      style={{
                        flex: 1, padding: "10px", background: i === 0 ? COLORS.gold : "transparent",
                        border: `1px solid ${i === 0 ? COLORS.gold : COLORS.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        transition: "all 0.3s",
                      }}
                    >
                      <Icon size={13} color={i === 0 ? COLORS.bg : COLORS.creamMuted} />
                    </button>
                  ))}
                </div>
              </div>
              {/* Floating upsell chip */}
              <div style={{
                position: "absolute", bottom: -20, right: -20,
                background: COLORS.bgCard, border: `1px solid ${COLORS.gold}`,
                padding: "14px 20px", display: "flex", gap: 12, alignItems: "center",
                animation: "pulse-gold 2s infinite",
              }}>
                <FrameIcon size={16} color={COLORS.gold} />
                <div>
                  <div style={{ fontSize: 11, color: COLORS.cream }}>Love this one?</div>
                  <div style={{ fontSize: 10, color: COLORS.gold }}>Frame it from $49 →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "120px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={s.sectionHeader}>
            <div className="section-label" style={{ marginBottom: 16 }}>Reviews</div>
            <h2 style={s.h2}>They're <em>Obsessed.</em></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { name: "Camille R.", role: "Content Creator", text: "I have a real photographer — and honestly? These AI sessions blow every studio shoot I've ever done out of the water. I've gone viral 3 times this month with these portraits.", stars: 5 },
              { name: "Marcus T.", role: "Entrepreneur", text: "I uploaded photos of my golden retriever and got back the most ridiculous, magnificent, frame-worthy portraits I've ever seen. He's now hanging above my fireplace. No regrets.", stars: 5 },
              { name: "Jade M.", role: "New Mom", text: "My daughter's newborn photos are now museum-quality art pieces. I cried when I saw them. The Christmas scene was beyond — I've ordered 4 frames. This is my annual tradition now.", stars: 5 },
            ].map(({ name, role, text, stars }) => (
              <div key={name} style={{ ...s.card, padding: "36px 32px", background: COLORS.bgCard }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {Array(stars).fill(0).map((_, i) => <Star key={i} size={12} fill={COLORS.gold} color={COLORS.gold} />)}
                </div>
                <p style={{ ...s.subtext, fontSize: 14, lineHeight: 1.8, marginBottom: 28, fontStyle: "italic" }}>"{text}"</p>
                <div style={{ height: 1, background: COLORS.border, marginBottom: 20 }} />
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: COLORS.cream }}>{name}</div>
                <div style={{ fontSize: 11, color: COLORS.creamMuted, letterSpacing: "0.1em", marginTop: 4 }}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{
        background: "linear-gradient(135deg, rgba(196,150,58,0.12) 0%, rgba(100,70,20,0.08) 100%)",
        borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`,
        padding: "100px 40px", textAlign: "center",
      }}>
        <div className="section-label" style={{ marginBottom: 20 }}>Limited Time · No Subscription</div>
        <h2 style={{ ...s.h2, maxWidth: 700, margin: "0 auto 24px" }}>
          The World Has Never Seen<br /><em>a Version of You Like This.</em>
        </h2>
        <p style={{ ...s.subtext, maxWidth: 440, margin: "0 auto 48px" }}>
          Stop scrolling. Start creating. Your portrait belongs on a wall — not a mood board.
        </p>
        <button
          className="btn-gold animate-pulse-gold"
          style={{ padding: "20px 56px", fontSize: 13, letterSpacing: "0.15em" }}
          onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
        >
          Create My Portraits — Starting at $19
        </button>
        <div style={{ marginTop: 24, fontSize: 11, color: COLORS.creamMuted, letterSpacing: "0.08em" }}>
          <Lock size={10} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Secure checkout · Instant delivery · 30-day guarantee
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "60px 40px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={s.logo}>Digital<span style={s.logoSpan}>Photos</span><span style={{ fontSize: 9, verticalAlign: "super", color: COLORS.goldDim }}>™</span></div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["Sessions", "Gallery", "Pricing", "Frames", "Community", "Privacy", "Terms"].map(l => (
              <span key={l} className="nav-link" style={{ fontSize: 11 }}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <div key={i} style={{ width: 32, height: 32, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon size={13} color={COLORS.creamMuted} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: "32px auto 0", paddingTop: 32, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 11, color: COLORS.creamMuted }}>© 2025 Digital Photos™. All rights reserved.</span>
          <span style={{ fontSize: 11, color: COLORS.goldDim }}>AI-Powered · Fine Art Quality · Yours Forever</span>
        </div>
      </footer>

      {/* ─── CHECKOUT MODAL ─── */}
      {showCheckout && (
        <div className="modal-backdrop" onClick={() => setShowCheckout(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: "28px 32px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.cream }}>
                {orderStep === 1 ? "Your Order" : orderStep === 2 ? "Enhance Your Session" : "Complete Your Order"}
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => setShowCheckout(false)}>
                <X size={18} color={COLORS.creamMuted} />
              </button>
            </div>

            {/* Steps indicator */}
            <div style={{ padding: "16px 32px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
              {["Session", "Upgrades", "Checkout"].map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", fontSize: 10, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: orderStep > i + 1 ? COLORS.gold : orderStep === i + 1 ? COLORS.gold : COLORS.border,
                    color: orderStep >= i + 1 ? COLORS.bg : COLORS.creamMuted,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 11, color: orderStep === i + 1 ? COLORS.cream : COLORS.creamMuted }}>{step}</span>
                  {i < 2 && <ChevronRight size={12} color={COLORS.border} />}
                </div>
              ))}
            </div>

            <div style={{ padding: "28px 32px", maxHeight: "55vh", overflow: "auto" }}>

              {/* Step 1: Order Summary */}
              {orderStep === 1 && (
                <div>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <div>
                        <div style={{ fontSize: 14, color: COLORS.cream }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.creamMuted, marginTop: 2 }}>{item.type === "pack" ? "AI Portrait Pack" : "Print & Frame"}</div>
                      </div>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.cream }}>${item.price}</span>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => removeFromCart(idx)}>
                          <X size={12} color={COLORS.creamMuted} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {cart.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.creamMuted }}>
                      Your cart is empty
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Order Bumps */}
              {orderStep === 2 && (
                <div>
                  <p style={{ ...s.subtext, fontSize: 13, marginBottom: 28 }}>
                    Supercharge your session with these one-time add-ons:
                  </p>
                  {ORDER_BUMPS.map(bump => {
                    const isAdded = bumpsAdded.find(b => b.id === bump.id);
                    const BIcon = bump.icon;
                    return (
                      <div
                        key={bump.id}
                        style={{
                          padding: "20px", marginBottom: 12,
                          border: `1px solid ${isAdded ? COLORS.gold : COLORS.border}`,
                          background: isAdded ? "rgba(196,150,58,0.05)" : COLORS.bgCard,
                          cursor: "pointer", transition: "all 0.3s",
                          display: "flex", gap: 16, alignItems: "center",
                        }}
                        onClick={() => toggleBump(bump)}
                      >
                        <div style={{
                          width: 36, height: 36, border: `1px solid ${COLORS.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          background: isAdded ? COLORS.gold : "transparent",
                        }}>
                          {isAdded ? <Check size={14} color={COLORS.bg} /> : <BIcon size={14} color={COLORS.gold} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, color: COLORS.cream, marginBottom: 4 }}>{bump.label}</div>
                          <div style={{ fontSize: 12, color: COLORS.creamMuted }}>{bump.desc}</div>
                        </div>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.gold }}>
                          +${bump.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 3: Checkout Form */}
              {orderStep === 3 && (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: COLORS.creamMuted, marginBottom: 8, letterSpacing: "0.1em" }}>EMAIL</div>
                    <input style={{ width: "100%", padding: "12px 16px", fontSize: 13 }} placeholder="your@email.com" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 12, color: COLORS.creamMuted, marginBottom: 8, letterSpacing: "0.1em" }}>FIRST NAME</div>
                      <input style={{ width: "100%", padding: "12px 16px", fontSize: 13 }} placeholder="First" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: COLORS.creamMuted, marginBottom: 8, letterSpacing: "0.1em" }}>LAST NAME</div>
                      <input style={{ width: "100%", padding: "12px 16px", fontSize: 13 }} placeholder="Last" />
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: COLORS.creamMuted, marginBottom: 8, letterSpacing: "0.1em" }}>CARD NUMBER</div>
                    <input style={{ width: "100%", padding: "12px 16px", fontSize: 13 }} placeholder="4242 4242 4242 4242" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                    <div>
                      <div style={{ fontSize: 12, color: COLORS.creamMuted, marginBottom: 8, letterSpacing: "0.1em" }}>EXPIRY</div>
                      <input style={{ width: "100%", padding: "12px 16px", fontSize: 13 }} placeholder="MM/YY" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: COLORS.creamMuted, marginBottom: 8, letterSpacing: "0.1em" }}>CVC</div>
                      <input style={{ width: "100%", padding: "12px 16px", fontSize: 13 }} placeholder="•••" />
                    </div>
                  </div>

                  {/* Order summary */}
                  <div style={{ padding: "20px", background: COLORS.bgLight, border: `1px solid ${COLORS.border}`, marginBottom: 8 }}>
                    {cart.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.creamMuted, marginBottom: 8 }}>
                        <span>{item.name}</span><span>${item.price}</span>
                      </div>
                    ))}
                    {bumpsAdded.map(b => (
                      <div key={b.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.creamMuted, marginBottom: 8 }}>
                        <span>{b.label}</span><span>+${b.price}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: COLORS.border, margin: "12px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.cream }}>
                      <span>Total</span><span>${cartTotal}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.creamMuted, display: "flex", alignItems: "center", gap: 6 }}>
                    <Lock size={10} /> Secured by 256-bit SSL encryption
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "20px 32px", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {orderStep > 1 ? (
                <button className="btn-outline" style={{ padding: "12px 24px", fontSize: 11 }} onClick={() => setOrderStep(s => s - 1)}>
                  Back
                </button>
              ) : <div />}
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {orderStep < 3 && (
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.cream }}>
                    ${cartTotal}
                  </span>
                )}
                <button
                  className="btn-gold"
                  style={{ padding: "14px 32px", fontSize: 11, letterSpacing: "0.12em" }}
                  onClick={() => {
                    if (orderStep < 3) setOrderStep(s => s + 1);
                    else {
                      alert("🎉 Order placed! Your portraits will be ready in under 30 minutes.");
                      setShowCheckout(false);
                      setCart([]);
                      setBumpsAdded([]);
                      setOrderStep(1);
                    }
                  }}
                >
                  {orderStep === 1 ? "Continue →" : orderStep === 2 ? "Proceed to Checkout →" : `Complete Purchase · $${cartTotal}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CART DRAWER ─── */}
      {showCart && (
        <div className="modal-backdrop" onClick={() => setShowCart(false)}>
          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: 420,
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              display: "flex", flexDirection: "column",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: "28px 28px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.cream }}>
                Your Cart ({cart.length})
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => setShowCart(false)}>
                <X size={18} color={COLORS.creamMuted} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: COLORS.creamMuted }}>
                  <Camera size={32} color={COLORS.border} style={{ marginBottom: 16 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : cart.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, color: COLORS.cream }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.creamMuted, marginTop: 2 }}>{item.type}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: COLORS.gold }}>${item.price}</span>
                    <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => removeFromCart(i)}>
                      <X size={12} color={COLORS.creamMuted} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 28px", borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ color: COLORS.creamMuted }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.cream }}>${cartTotal}</span>
              </div>
              <button
                className="btn-gold"
                style={{ width: "100%", padding: "16px", fontSize: 11, letterSpacing: "0.12em" }}
                onClick={() => { setShowCart(false); setShowCheckout(true); }}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIGHTBOX ─── */}
      {lightbox && (
        <div className="modal-backdrop" onClick={() => setLightbox(null)}>
          <div style={{ position: "relative", maxWidth: "80vw", maxHeight: "85vh" }}>
            <img src={lightbox} alt="" style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", display: "block" }} />
            <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
              {[Download, Edit3, Share2, FrameIcon].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: 38, height: 38, background: "rgba(8,7,5,0.8)", border: `1px solid ${COLORS.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    if (i === 3) {
                      setLightbox(null);
                      document.getElementById("frames")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <Icon size={14} color={COLORS.creamMuted} />
                </button>
              ))}
            </div>
            {/* Frame upsell */}
            <div style={{
              position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
              background: "rgba(8,7,5,0.9)", border: `1px solid ${COLORS.gold}`,
              padding: "12px 24px", display: "flex", gap: 16, alignItems: "center", whiteSpace: "nowrap",
            }}>
              <FrameIcon size={14} color={COLORS.gold} />
              <span style={{ fontSize: 13, color: COLORS.cream }}>Love this portrait?</span>
              <button
                className="btn-gold"
                style={{ padding: "8px 20px", fontSize: 10, letterSpacing: "0.12em" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(null);
                  document.getElementById("frames")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Frame It · From $49
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
