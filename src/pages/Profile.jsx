import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LogoutIcon from "@mui/icons-material/Logout";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

const AVATAR_COLORS = [
  "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #ef4444, #f59e0b)",
];

export default function Profile() {
  const { user, logout, switchAccount, mockAccounts } = useAuth();
  const { i18n } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarColor, setAvatarColor] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || "Admin One",
    email: user?.email || "admin1@infosys.com",
    phone: "+91 98765 43210",
    role: user?.role || "Administrator",
    company: "Infosys Ltd.",
    timezone: "Asia/Kolkata (IST)",
  });

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const cardStyle = {
    background: "var(--bg-card)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid var(--border-glass)",
    borderRadius: 20,
    padding: 28,
    boxShadow: "var(--shadow-glass)",
    marginBottom: 24,
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-glass)",
    borderRadius: 10,
    padding: "11px 14px",
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "var(--font-primary)",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 6,
    display: "block",
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              background: "linear-gradient(135deg, var(--text-primary), var(--text-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.3px",
              marginBottom: 6,
            }}
          >
            My Profile
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Manage your personal information, preferences and account settings
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
          {/* LEFT COLUMN */}
          <div>
            {/* Avatar Card */}
            <div style={{ ...cardStyle, textAlign: "center" }}>
              {/* Avatar */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: AVATAR_COLORS[avatarColor],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    fontWeight: 800,
                    color: "#fff",
                    boxShadow: "0 8px 32px rgba(79,142,247,0.4)",
                    margin: "0 auto",
                  }}
                >
                  {(form.name || "A")[0].toUpperCase()}
                </div>
                <button
                  onClick={() => setAvatarColor((avatarColor + 1) % AVATAR_COLORS.length)}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                    border: "2px solid var(--bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#fff",
                    transition: "all 0.2s ease",
                  }}
                  title="Change avatar color"
                >
                  <CameraAltIcon style={{ fontSize: 14 }} />
                </button>
              </div>

              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                {form.name}
              </div>
              <div
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  background: "rgba(79,142,247,0.1)",
                  border: "1px solid rgba(79,142,247,0.2)",
                  borderRadius: 20,
                  fontSize: 12,
                  color: "#4f8ef7",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  marginBottom: 6,
                }}
              >
                {form.role}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>{form.email}</div>

              {/* Logout */}
              <button
                id="profile-logout"
                onClick={logout}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 10,
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                }}
              >
                <LogoutIcon style={{ fontSize: 16 }} />
                Sign Out
              </button>
            </div>

            {/* Language Selector */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                🌐 Language
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-${lang.code}`}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: i18n.language === lang.code
                        ? "rgba(79,142,247,0.12)"
                        : "transparent",
                      border: i18n.language === lang.code
                        ? "1px solid rgba(79,142,247,0.3)"
                        : "1px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      if (i18n.language !== lang.code)
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      if (i18n.language !== lang.code)
                        e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{lang.flag}</span>
                    <span style={{ fontSize: 13, color: "var(--text-primary)", flex: 1 }}>
                      {lang.label}
                    </span>
                    {i18n.language === lang.code && (
                      <CheckCircleIcon style={{ fontSize: 16, color: "#6366f1" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Switcher */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                <SwapHorizIcon style={{ fontSize: 16, marginRight: 6, verticalAlign: "middle" }} />
                Switch Account
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mockAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    id={`switch-acc-${acc.id}`}
                    onClick={() => switchAccount(acc)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: user?.id === acc.id ? "rgba(99,102,241,0.15)" : "var(--bg-card)",
                      border: user?.id === acc.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border-glass)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: acc.role === "admin"
                          ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                          : "linear-gradient(135deg, #10b981, #06b6d4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {acc.name[0]}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>
                        {acc.role}
                      </div>
                    </div>
                    {user?.id === acc.id && (
                      <CheckCircleIcon style={{ fontSize: 14, color: "#4f8ef7", flexShrink: 0 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            {/* Personal Info Card */}
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                  Personal Information
                </h2>
                <div style={{ display: "flex", gap: 10 }}>
                  {saved && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                      <CheckCircleIcon style={{ fontSize: 16 }} />
                      Saved!
                    </div>
                  )}
                  {editing ? (
                    <button
                      id="profile-save"
                      onClick={handleSave}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                        border: "none",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <SaveIcon style={{ fontSize: 16 }} />
                      Save Changes
                    </button>
                  ) : (
                    <button
                      id="profile-edit"
                      onClick={() => setEditing(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 16px",
                        background: "rgba(79,142,247,0.1)",
                        border: "1px solid rgba(79,142,247,0.2)",
                        borderRadius: 10,
                        color: "#4f8ef7",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <EditIcon style={{ fontSize: 16 }} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { key: "name", label: "Full Name", type: "text" },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "phone", label: "Phone Number", type: "tel" },
                  { key: "role", label: "Role", type: "text" },
                  { key: "company", label: "Company", type: "text" },
                  { key: "timezone", label: "Timezone", type: "text" },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    {editing ? (
                      <input
                        id={`profile-${key}`}
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(79,142,247,0.5)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "var(--border-glass)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          padding: "11px 14px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: 10,
                          fontSize: 14,
                          color: "var(--text-primary)",
                        }}
                      >
                        {form[key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Summary */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
                Activity Summary
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { label: "Sessions", value: "24", color: "#4f8ef7", sub: "this month" },
                  { label: "Reports Run", value: "12", color: "#10b981", sub: "this month" },
                  { label: "Invoices", value: "87", color: "#8b5cf6", sub: "generated" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: "16px 20px",
                      background: `rgba(${stat.color === "#4f8ef7" ? "79,142,247" : stat.color === "#10b981" ? "16,185,129" : "139,92,246"},0.08)`,
                      border: `1px solid rgba(${stat.color === "#4f8ef7" ? "79,142,247" : stat.color === "#10b981" ? "16,185,129" : "139,92,246"},0.15)`,
                      borderRadius: 14,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 6 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
                Security
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Change Password", desc: "Last changed 30 days ago", btn: "Update" },
                  { label: "Two-Factor Auth", desc: "Extra security for your account", btn: "Enable" },
                  { label: "Active Sessions", desc: "1 active session", btn: "Manage" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                    <button
                      style={{
                        padding: "7px 16px",
                        background: "rgba(79,142,247,0.08)",
                        border: "1px solid rgba(79,142,247,0.2)",
                        borderRadius: 8,
                        color: "#4f8ef7",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(79,142,247,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(79,142,247,0.08)";
                      }}
                    >
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}