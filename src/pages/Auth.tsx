// @ts-nocheck
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

const C = {
  bg: "#080705", bgCard: "#0F0D0A",
  cream: "#F2EDE4", creamMuted: "#B8B09A",
  gold: "#C4963A", goldLight: "#D4AE5C", goldDim: "#7A5C22",
  border: "#1E1B14",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#080705; color:#F2EDE4; font-family:'Outfit',sans-serif; font-weight:300; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .fade-up { animation:fadeUp 0.6s ease forwards; }
`;

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
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email to verify your account.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: C.cream, fontWeight: 600 }}>
                Digital<span style={{ color: C.gold }}>Photos</span>
                <sup style={{ fontSize: 10, color: C.goldDim }}>™</sup>
              </div>
            </Link>
            <p style={{ color: C.creamMuted, fontSize: 14, marginTop: 8 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          {/* Card */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "36px 32px" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
              {(["login", "signup"] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                  style={{
                    flex: 1, padding: "10px", background: "transparent", border: "none",
                    borderBottom: `2px solid ${mode === m ? C.gold : C.border}`,
                    color: mode === m ? C.cream : C.creamMuted, cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: mode === m ? 500 : 300,
                    letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.3s",
                  }}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.creamMuted, marginBottom: 6, display: "block" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={14} color={C.goldDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      placeholder="Your name"
                      style={{ width: "100%", padding: "13px 16px 13px 40px", background: C.bg, border: `1px solid ${C.border}`, color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 300, outline: "none" }} />
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.creamMuted, marginBottom: 6, display: "block" }}>Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={14} color={C.goldDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="you@example.com"
                    style={{ width: "100%", padding: "13px 16px 13px 40px", background: C.bg, border: `1px solid ${C.border}`, color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 300, outline: "none" }} />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.creamMuted, marginBottom: 6, display: "block" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <Lock size={14} color={C.goldDim} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••" minLength={6}
                    style={{ width: "100%", padding: "13px 44px 13px 40px", background: C.bg, border: `1px solid ${C.border}`, color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 300, outline: "none" }} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                    {showPw ? <EyeOff size={14} color={C.creamMuted} /> : <Eye size={14} color={C.creamMuted} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding: "10px 14px", background: "rgba(224,96,96,0.1)", border: "1px solid rgba(224,96,96,0.3)", color: "#E06060", fontSize: 12, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ padding: "10px 14px", background: "rgba(76,175,119,0.1)", border: "1px solid rgba(76,175,119,0.3)", color: "#4CAF77", fontSize: 12, marginBottom: 16 }}>
                  {success}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "15px", background: `linear-gradient(135deg,${C.gold},${C.goldLight},${C.gold})`,
                  color: C.bg, border: "none", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  opacity: loading ? 0.6 : 1, transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            {mode === "login" && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Link to="/reset-password" style={{ fontSize: 12, color: C.creamMuted, textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.goldDim, marginTop: 20 }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              style={{ color: C.gold, cursor: "pointer" }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
