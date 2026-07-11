import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";

export default function Landing() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-primary)",
        transition: "background 0.3s ease, color 0.3s ease",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Decorative blurred blobs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(79, 142, 247, 0.15) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid var(--border-glass)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79, 142, 247, 0.3)",
            }}
          >
            <ElectricBoltIcon style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>BillFlow</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Language Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 8, border: "1px solid var(--border-glass)" }}>
            <LanguageIcon style={{ fontSize: 16, color: "var(--text-secondary)" }} />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={{
                background: "transparent",
                color: "var(--text-primary)",
                border: "none",
                fontSize: 13,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border-glass)",
              borderRadius: 8,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            {darkMode ? <LightModeIcon style={{ fontSize: 16 }} /> : <DarkModeIcon style={{ fontSize: 16 }} />}
          </button>

          {/* Login Button */}
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 142, 247, 0.2)",
            }}
          >
            {t("home.loginButton")}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 20px 80px",
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(79, 142, 247, 0.1)",
            border: "1px solid rgba(79, 142, 247, 0.2)",
            padding: "6px 16px",
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            color: "#4f8ef7",
            marginBottom: 24,
            boxShadow: "0 2px 10px rgba(79, 142, 247, 0.05)",
          }}
        >
          <ElectricBoltIcon style={{ fontSize: 14 }} />
          <span>Next-Generation Recurring Revenue Suite</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            marginBottom: 20,
            background: "linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("home.title")}
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: 680,
            lineHeight: 1.6,
            marginBottom: 40,
            fontWeight: 500,
          }}
        >
          {t("home.tagline")}
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #4f8ef7 0%, #8b5cf6 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(79, 142, 247, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(79, 142, 247, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(79, 142, 247, 0.3)";
            }}
          >
            {t("home.loginButton")} <ArrowForwardIcon style={{ fontSize: 16 }} />
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "14px 28px",
              background: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-glass)",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            {t("home.signupButton")}
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ padding: "40px 40px 100px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: 30, borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(79, 142, 247, 0.1)", display: "flex", alignItems: "center", justify: "center", color: "#4f8ef7", marginBottom: 20, justifyContent: "center" }}>
              <TimelineIcon />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>{t("home.feature1")}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{t("home.feature1Desc")}</p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: 30, borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justify: "center", color: "#10b981", marginBottom: 20, justifyContent: "center" }}>
              <CheckCircleOutlineIcon />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>{t("home.feature2")}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{t("home.feature2Desc")}</p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: 30, borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justify: "center", color: "#8b5cf6", marginBottom: 20, justifyContent: "center" }}>
              <SecurityIcon />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>{t("home.feature3")}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{t("home.feature3Desc")}</p>
          </div>

          {/* Card 4 */}
          <div className="glass-card" style={{ padding: 30, borderRadius: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", marginBottom: 20 }}>
              <SecurityIcon />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "var(--text-primary)" }}>{t("home.feature4")}</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{t("home.feature4Desc")}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border-glass)", padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
        <p>© 2026 BillFlow Platform. Powered by Antigravity. All rights reserved.</p>
      </footer>
    </div>
  );
}