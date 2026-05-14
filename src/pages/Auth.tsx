// @ts-nocheck
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const C = {
  bg:      "#F4F1EC",
  bgCard:  "#FFFFFF",
  ink:     "#0A0A0A",
  text:    "#1A1614",
  muted:   "#8C8C8C",
  border:  "rgba(0,0,0,0.08)",
  red:     "#E61919",
  field:   "#FAF7F2",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:${C.bg}; color:${C.ink}; font-family:'Poppins',sans-serif; font-weight:400; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation:fadeUp 0.6s ease forwards; }
  .auth-input::placeholder { color:#B8B0A6; }
`;

function Logo() {
  return (
    <div style={{
      display:"inline-block", background:C.red, padding:7, width:140,
    }}>
      <div style={{ border:"2.5px solid #fff", padding:"6px 18px",
        display:"flex", flexDirection:"column", alignItems:"center" }}>
        <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:"2.1rem",
          fontWeight:900, color:"#fff", letterSpacing:".05em",
          lineHeight:1, textAlign:"center", display:"block" }}>REAL</span>
        <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:".52rem",
          fontWeight:700, letterSpacing:".3em", color:"#fff",
          textTransform:"uppercase", textAlign:"center",
          display:"block", marginTop:3 }}>ART</span>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate("/");
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error.message);
      else setSuccess("Check your email to verify your account.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px 13px 40px",
    background: C.field, border: `1px solid ${C.border}`,
    color: C.ink, fontFamily: "'Poppins',sans-serif", fontSize: 14,
    fontWeight: 400, outline: "none", borderRadius: 8,
  } as const;

  const labelStyle = {
    fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase" as const,
    color: C.muted, marginBottom: 8, display: "block", fontWeight: 600,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="fade-up" style={{ width: "100%", maxWidth: 440 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link to="/" aria-label="Real Art home" style={{ textDecoration: "none", display: "inline-block" }}>
              <Logo />
            </Link>
            <p style={{ color: C.muted, fontSize: 14, marginTop: 18, fontWeight: 400 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          {/* Card */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "36px 32px", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
              {(["login", "signup"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                  style={{
                    flex: 1, padding: "10px", background: "transparent", border: "none",
                    borderBottom: `2px solid ${mode === m ? C.red : C.border}`,
                    color: mode === m ? C.ink : C.muted, cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", fontSize: 13,
                    fontWeight: mode === m ? 700 : 500,
                    letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s",
                  }}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={14} color={C.muted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input className="auth-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Your name" style={inputStyle} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={14} color={C.muted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={14} color={C.muted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input className="auth-input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••" minLength={6}
                    style={{ ...inputStyle, padding: "13px 44px 13px 40px" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                    {showPw ? <EyeOff size={14} color={C.muted} /> : <Eye size={14} color={C.muted} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding: "10px 14px", background: "rgba(230,25,25,0.06)", border: "1px solid rgba(230,25,25,0.25)", color: C.red, fontSize: 12, marginBottom: 16, borderRadius: 8 }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ padding: "10px 14px", background: "rgba(34,140,90,0.08)", border: "1px solid rgba(34,140,90,0.25)", color: "#1F7A4D", fontSize: 12, marginBottom: 16, borderRadius: 8 }}>
                  {success}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "15px", background: C.red,
                  color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  opacity: loading ? 0.6 : 1, transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  borderRadius: 10,
                }}>
                {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            {mode === "login" && (
              <div style={{ textAlign: "center", marginTop: 18 }}>
                <Link to="/reset-password" style={{ fontSize: 12.5, color: C.muted, textDecoration: "none", fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 12.5, color: C.muted, marginTop: 22, fontWeight: 400 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              style={{ color: C.red, cursor: "pointer", fontWeight: 600 }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
