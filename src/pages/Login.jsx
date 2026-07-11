import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MOCK_CREDENTIALS = [
  { email: "admin1@infosys.com", hint: "admin1@infosys.com" },
  { email: "admin2@infosys.com", hint: "admin2@infosys.com" },
  { email: "viewer@infosys.com", hint: "viewer@infosys.com" },
];

const DEMO_ACCOUNTS = [
  { name: "Admin One", email: "admin1@infosys.com", role: "admin", avatar: "A1" },
  { name: "Admin Two", email: "admin2@infosys.com", role: "admin", avatar: "A2" },
  { name: "Viewer", email: "viewer@infosys.com", role: "viewer", avatar: "VI" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Use any of the demo accounts below.");
    }
    setLoading(false);
  };

  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setLoading(true);
    setError("");
    try {
      await login(acc.email, "any");
      navigate("/dashboard");
    } catch {
      setError("Could not log in with demo account.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Inter', sans-serif",
      background: "#f0f4f8",
    }}>
      {/* Left panel - branding */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4338ca 75%, #6366f1 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "64px 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Abstract grid/orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 380, height: 380, borderRadius: "50%", background: "rgba(99,102,241,0.25)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: 60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(139,92,246,0.2)", filter: "blur(50px)" }} />
          {/* Grid lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L4.09 12.11A1 1 0 0 0 5 14h6v8l8.91-10.11A1 1 0 0 0 19 10h-6V2z" fill="white" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: "white", letterSpacing: "-0.5px" }}>BillFlow</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(165,180,252,0.8)", letterSpacing: "2px", fontWeight: 600, textTransform: "uppercase", marginLeft: 2 }}>
            Fintech Billing Infrastructure
          </div>
        </div>

        {/* Headline */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-1.5px", marginBottom: 20 }}>
            Powering Global<br />
            <span style={{ color: "#a5b4fc" }}>Subscription Billing</span><br />
            at Scale
          </h1>
          <p style={{ fontSize: 15, color: "rgba(199,210,254,0.8)", lineHeight: 1.7, marginBottom: 40 }}>
            The unified billing intelligence platform trusted by enterprise SaaS platforms to manage recurring payments, invoices, and customer lifecycle.
          </p>
          {/* Trusted by logos */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 28 }}>
            <div style={{ fontSize: 11, color: "rgba(165,180,252,0.7)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
              Trusted by global platforms
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Netflix", "Spotify", "Zoom", "Duolingo"].map(name => (
                <div key={name} style={{
                  padding: "6px 16px", borderRadius: 100,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 12, fontWeight: 600,
                }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        width: 480,
        flexShrink: 0,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 52px",
        overflowY: "auto",
      }}>
        {/* Top heading */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
            Customer Portal
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#111827", letterSpacing: "-0.8px", lineHeight: 1.2, marginBottom: 8 }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
            Use a demo account below or enter your credentials
          </p>
        </div>

        {/* Demo Quick Sign-In */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            Quick Access — Demo Accounts
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 12,
                  background: "#f9fafb", border: "1px solid #e5e7eb",
                  cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#ede9fe";
                  e.currentTarget.style.borderColor = "#c4b5fd";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#f9fafb";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  background: acc.role === "admin" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#10b981,#06b6d4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 11, fontWeight: 800,
                }}>
                  {acc.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{acc.name}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{acc.email}</div>
                </div>
                <div style={{
                  marginLeft: "auto", padding: "2px 8px", borderRadius: 6,
                  background: acc.role === "admin" ? "#ede9fe" : "#d1fae5",
                  color: acc.role === "admin" ? "#7c3aed" : "#059669",
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                  {acc.role}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>or sign in manually</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
              placeholder="you@company.com"
              style={{
                width: "100%", padding: "12px 16px",
                borderRadius: 10, fontSize: 14, fontFamily: "Inter, sans-serif",
                background: "#f9fafb", color: "#111827",
                border: focusEmail ? "2px solid #6366f1" : "2px solid #e5e7eb",
                outline: "none", transition: "border 0.2s", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusPass(true)}
                onBlur={() => setFocusPass(false)}
                placeholder="Enter your password"
                style={{
                  width: "100%", padding: "12px 44px 12px 16px",
                  borderRadius: 10, fontSize: 14, fontFamily: "Inter, sans-serif",
                  background: "#f9fafb", color: "#111827",
                  border: focusPass ? "2px solid #6366f1" : "2px solid #e5e7eb",
                  outline: "none", transition: "border 0.2s", boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0,
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 10, padding: "12px 16px",
              fontSize: 13, color: "#dc2626", marginBottom: 20, lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
              transition: "all 0.2s", fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {loading ? "Authenticating..." : "Sign In →"}
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 28, lineHeight: 1.5 }}>
          Secured by BillFlow API Authentication Layer &amp; TLS 1.3
        </p>
      </div>
    </div>
  );
}