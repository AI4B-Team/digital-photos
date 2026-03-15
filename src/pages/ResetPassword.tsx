// @ts-nocheck
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft } from "lucide-react";

const C = {
  bg: "#080705", bgCard: "#0F0D0A",
  cream: "#F2EDE4", creamMuted: "#B8B09A",
  gold: "#C4963A", goldLight: "#D4AE5C", goldDim: "#7A5C22",
  border: "#1E1B14",
};

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if this is a recovery callback
  const hash = window.location.hash;
  const isRecovery = hash.includes("type=recovery");

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setError(error.message);
    else setSuccess("Password updated! You can now sign in.");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: C.cream, fontWeight: 600 }}>
              Digital<span style={{ color: C.gold }}>Photos</span>
            </div>
          </Link>
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "36px 32px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: C.cream, marginBottom: 8 }}>
            {isRecovery ? "Set New Password" : "Reset Password"}
          </h2>

          {isRecovery ? (
            <form onSubmit={handleUpdatePassword}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.creamMuted, marginBottom: 6, display: "block" }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "13px 16px", background: C.bg, border: `1px solid ${C.border}`, color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 14, outline: "none" }} />
              </div>
              {error && <div style={{ padding: "10px", background: "rgba(224,96,96,0.1)", border: "1px solid rgba(224,96,96,0.3)", color: "#E06060", fontSize: 12, marginBottom: 16 }}>{error}</div>}
              {success && <div style={{ padding: "10px", background: "rgba(76,175,119,0.1)", border: "1px solid rgba(76,175,119,0.3)", color: "#4CAF77", fontSize: 12, marginBottom: 16 }}>{success}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.bg, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Mail size={32} color={C.gold} style={{ marginBottom: 16 }} />
              <p style={{ color: C.cream, fontSize: 14, marginBottom: 8 }}>Check your email</p>
              <p style={{ color: C.creamMuted, fontSize: 13 }}>We sent a password reset link to {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSendReset}>
              <p style={{ color: C.creamMuted, fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <div style={{ marginBottom: 20 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  style={{ width: "100%", padding: "13px 16px", background: C.bg, border: `1px solid ${C.border}`, color: C.cream, fontFamily: "'Outfit',sans-serif", fontSize: 14, outline: "none" }} />
              </div>
              {error && <div style={{ padding: "10px", background: "rgba(224,96,96,0.1)", border: "1px solid rgba(224,96,96,0.3)", color: "#E06060", fontSize: 12, marginBottom: 16 }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg,${C.gold},${C.goldLight})`, color: C.bg, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/auth" style={{ color: C.creamMuted, fontSize: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={12} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
