import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import PaletteIcon from "@mui/icons-material/Palette";
import LanguageIcon from "@mui/icons-material/Language";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{
      width: 44,
      height: 24,
      borderRadius: 12,
      background: checked ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "var(--bg-card)",
      border: "none",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.3s ease",
      flexShrink: 0,
      boxShadow: checked ? "0 0 12px rgba(99,102,241,0.4)" : "none",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 3,
        left: checked ? 22 : 3,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        transition: "left 0.3s ease",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    />
  </button>
);
const SettingRow = ({ icon, title, desc, children, danger }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      background: "var(--bg-card)",
      border: `1px solid ${danger ? "rgba(239,68,68,0.15)" : "var(--border-glass)"}`,
      borderRadius: 12,
      gap: 16,
      transition: "all 0.2s ease",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: danger ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: danger ? "#ef4444" : "#6366f1",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: danger ? "#ef4444" : "var(--text-primary)" }}>
          {title}
        </div>
        {desc && (
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>
        )}
      </div>
    </div>
    {children}
  </div>
);
const SectionCard = ({ title, icon, children }) => (
  <div
    style={{
      background: "var(--bg-card)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid var(--border-glass)",
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 24,
      boxShadow: "var(--shadow-glass)",
    }}
  >
    <div
      style={{
        padding: "18px 24px",
        borderBottom: "1px solid var(--border-glass)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "rgba(99,102,241,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6366f1",
        }}
      >
        {icon}
      </div>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{title}</h2>
    </div>
    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  </div>
);
export default function Settings() {
  const { t, i18n } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const [saved, setSaved] = useState(false);
  const [accentColor, setAccentColor] = useState("#4f8ef7");
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    weeklyReport: true,
    twoFactor: false,
    loginAlerts: true,
    apiAccess: true,
    dataExport: true,
    autoBackup: true,
    compactMode: false,
    animationsEnabled: true,
  });
  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const handleThemeChange = (newMode) => {
    toggleTheme(newMode);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const ACCENT_COLORS = ["#4f8ef7", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "te", label: "తెలుగు" },
    { code: "hi", label: "हिन्दी" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
  ];
  const selectStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--border-glass)",
    borderRadius: 10,
    padding: "9px 14px",
    color: "var(--text-primary)",
    fontSize: 13,
    fontFamily: "var(--font-primary)",
    outline: "none",
    cursor: "pointer",
    minWidth: 140,
  };
  return (
    <MainLayout>
      <div style={{ maxWidth: 720 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
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
              {t("nav.settings")}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {t("settings.subtitle", "Customize your dashboard experience")}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {saved && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#10b981",
                  fontSize: 13,
                  fontWeight: 600,
                  animation: "fadeInUp 0.3s ease",
                }}
              >
                <CheckCircleIcon style={{ fontSize: 18 }} />
                {t("settings.saved", "Settings saved!")}
              </div>
            )}
            <button
              id="settings-save"
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(79,142,247,0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <SaveIcon style={{ fontSize: 18 }} />
              {t("common.save")}
            </button>
          </div>
        </div>
        {/* Appearance */}
        <SectionCard title={t("settings.appearance", "Appearance")} icon={<PaletteIcon style={{ fontSize: 18 }} />}>
          <SettingRow
            icon={mode === "dark" ? <DarkModeIcon style={{ fontSize: 18 }} /> : <LightModeIcon style={{ fontSize: 18 }} />}
            title={t("settings.themeMode", "Theme Mode")}
            desc={t("settings.themeModeDesc", "Choose between light and dark interface")}
          >
            <div style={{ display: "flex", gap: 8 }}>
              {["light", "dark"].map((m) => (
                <button
                  key={m}
                  id={`theme-${m}`}
                  onClick={() => handleThemeChange(m)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    background: mode === m ? "linear-gradient(135deg, #4f8ef7, #8b5cf6)" : "rgba(255,255,255,0.05)",
                    border: mode === m ? "none" : "1px solid var(--border-glass)",
                    color: mode === m ? "#fff" : "var(--text-secondary)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.2s ease",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow
            icon={<PaletteIcon style={{ fontSize: 18 }} />}
            title={t("settings.accentColor", "Accent Color")}
            desc={t("settings.accentColorDesc", "Personalize the dashboard accent color")}
          >
            <div style={{ display: "flex", gap: 8 }}>
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: color,
                    border: accentColor === color ? `3px solid ${color}` : "3px solid transparent",
                    outline: accentColor === color ? `2px solid ${color}` : "none",
                    outlineOffset: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: accentColor === color ? `0 0 10px ${color}80` : "none",
                  }}
                />
              ))}
            </div>
          </SettingRow>
          <SettingRow
            icon={<PaletteIcon style={{ fontSize: 18 }} />}
            title={t("settings.compactMode", "Compact Mode")}
            desc={t("settings.compactModeDesc", "Reduce padding and spacing for denser UI")}
          >
            <Toggle id="toggle-compact" checked={settings.compactMode} onChange={() => toggle("compactMode")} />
          </SettingRow>
          <SettingRow
            icon={<PaletteIcon style={{ fontSize: 18 }} />}
            title={t("settings.animations", "Animations")}
            desc={t("settings.animationsDesc", "Enable micro-animations and transitions")}
          >
            <Toggle id="toggle-animations" checked={settings.animationsEnabled} onChange={() => toggle("animationsEnabled")} />
          </SettingRow>
        </SectionCard>
        {/* Language */}
        <SectionCard title={t("settings.languageRegion", "Language & Region")} icon={<LanguageIcon style={{ fontSize: 18 }} />}>
          <SettingRow
            icon={<LanguageIcon style={{ fontSize: 18 }} />}
            title={t("settings.interfaceLang", "Interface Language")}
            desc={t("settings.interfaceLangDesc", "Select your preferred display language")}
          >
            <select
              id="settings-language"
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={selectStyle}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </SettingRow>
          <SettingRow
            icon={<StorageIcon style={{ fontSize: 18 }} />}
            title={t("settings.dateFormat", "Date Format")}
            desc={t("settings.dateFormatDesc", "How dates are displayed across the app")}
          >
            <select id="settings-dateformat" style={selectStyle} defaultValue="DD/MM/YYYY">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </SettingRow>
          <SettingRow
            icon={<StorageIcon style={{ fontSize: 18 }} />}
            title={t("settings.currency", "Currency")}
            desc={t("settings.currencyDesc", "Default currency for billing and invoices")}
          >
            <select id="settings-currency" style={selectStyle} defaultValue="INR (₹)">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </SettingRow>
        </SectionCard>
        {/* Notifications */}
        <SectionCard title={t("settings.notifications", "Notifications")} icon={<NotificationsIcon style={{ fontSize: 18 }} />}>
          <SettingRow
            icon={<NotificationsIcon style={{ fontSize: 18 }} />}
            title={t("settings.pushNotifications", "Push Notifications")}
            desc={t("settings.pushNotificationsDesc", "Receive real-time in-app alerts")}
          >
            <Toggle id="toggle-notifications" checked={settings.notifications} onChange={() => toggle("notifications")} />
          </SettingRow>
          <SettingRow
            icon={<EmailIcon style={{ fontSize: 18 }} />}
            title={t("settings.emailAlerts", "Email Alerts")}
            desc={t("settings.emailAlertsDesc", "Payment confirmations, failures and billing events")}
          >
            <Toggle id="toggle-email" checked={settings.emailAlerts} onChange={() => toggle("emailAlerts")} />
          </SettingRow>
          <SettingRow
            icon={<NotificationsIcon style={{ fontSize: 18 }} />}
            title={t("settings.smsAlerts", "SMS Alerts")}
            desc={t("settings.smsAlertsDesc", "Critical alerts via SMS to your phone")}
          >
            <Toggle id="toggle-sms" checked={settings.smsAlerts} onChange={() => toggle("smsAlerts")} />
          </SettingRow>
          <SettingRow
            icon={<EmailIcon style={{ fontSize: 18 }} />}
            title={t("settings.weeklySummary", "Weekly Summary")}
            desc={t("settings.weeklySummaryDesc", "Receive a weekly revenue report email")}
          >
            <Toggle id="toggle-weekly" checked={settings.weeklyReport} onChange={() => toggle("weeklyReport")} />
          </SettingRow>
        </SectionCard>
        {/* Security */}
        <SectionCard title={t("settings.security", "Security")} icon={<SecurityIcon style={{ fontSize: 18 }} />}>
          <SettingRow
            icon={<SecurityIcon style={{ fontSize: 18 }} />}
            title={t("settings.twoFactor", "Two-Factor Authentication")}
            desc={t("settings.twoFactorDesc", "Add extra layer of security to your account")}
          >
            <Toggle id="toggle-2fa" checked={settings.twoFactor} onChange={() => toggle("twoFactor")} />
          </SettingRow>
          <SettingRow
            icon={<SecurityIcon style={{ fontSize: 18 }} />}
            title={t("settings.loginAlerts", "Login Alerts")}
            desc={t("settings.loginAlertsDesc", "Get notified when someone logs into your account")}
          >
            <Toggle id="toggle-login-alerts" checked={settings.loginAlerts} onChange={() => toggle("loginAlerts")} />
          </SettingRow>
          <SettingRow
            icon={<SecurityIcon style={{ fontSize: 18 }} />}
            title={t("settings.sessionTimeout", "Session Timeout")}
            desc={t("settings.sessionTimeoutDesc", "Auto logout after period of inactivity")}
          >
            <select id="settings-timeout" style={selectStyle} defaultValue="30 min">
              <option>15 min</option>
              <option>30 min</option>
              <option>1 hour</option>
              <option>Never</option>
            </select>
          </SettingRow>
        </SectionCard>
        {/* Data & Storage */}
        <SectionCard title={t("settings.dataStorage", "Data & Storage")} icon={<StorageIcon style={{ fontSize: 18 }} />}>
          <SettingRow
            icon={<StorageIcon style={{ fontSize: 18 }} />}
            title={t("settings.autoBackup", "Auto Backup")}
            desc={t("settings.autoBackupDesc", "Automatically back up data daily")}
          >
            <Toggle id="toggle-backup" checked={settings.autoBackup} onChange={() => toggle("autoBackup")} />
          </SettingRow>
          <SettingRow
            icon={<StorageIcon style={{ fontSize: 18 }} />}
            title={t("settings.dataExport", "Data Export")}
            desc={t("settings.dataExportDesc", "Allow CSV/PDF export of reports and billing")}
          >
            <Toggle id="toggle-export" checked={settings.dataExport} onChange={() => toggle("dataExport")} />
          </SettingRow>
          <SettingRow
            icon={<StorageIcon style={{ fontSize: 18 }} />}
            title={t("settings.clearCache", "Clear Cache")}
            desc={t("settings.clearCacheDesc", "Free up local storage and reset cached data")}
            danger
          >
            <button
              id="settings-clear-cache"
              style={{
                padding: "8px 16px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                color: "#ef4444",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
              onClick={() => alert("Cache cleared!")}
            >
              {t("settings.clear", "Clear")}
            </button>
          </SettingRow>
        </SectionCard>
      </div>
    </MainLayout>
  );
}
