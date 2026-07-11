import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const NAV_TITLES = {
  dashboard: "Fintech Billing Console",
  customers: "Customers",
  plans: "Subscription Plans",
  subscriptions: "Subscriptions",
  billing: "Billing & Invoices",
  reports: "Reports & Analytics",
  profile: "My Profile",
  settings: "Settings",
};

const NOTIFICATIONS = [
  { id: 1, type: "success", title: "Netflix Sync Successful", desc: "Monthly billing cycle processed — ₹1,42,00,000 captured", time: "2 min ago", read: false },
  { id: 2, type: "error", title: "Duolingo Webhook Failed", desc: "3 retries exhausted. Manual intervention required.", time: "18 min ago", read: false },
  { id: 3, type: "success", title: "Stripe Charge Authorized", desc: "Payment of ₹2,999 processed for Premium plan customer", time: "1 hr ago", read: false },
  { id: 4, type: "info", title: "Spotify Plan Upgraded", desc: "Spotify AB upgraded from Standard → Enterprise tier", time: "3 hr ago", read: true },
  { id: 5, type: "warning", title: "API Rate Limit Warning", desc: "Tenant Zoom Video approaching 85% of API quota", time: "5 hr ago", read: true },
];

function NotifIcon({ type }) {
  const colors = { success: "#10b981", error: "#ef4444", warning: "#f59e0b", info: "#6366f1" };
  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: `${colors[type]}18`,
      border: `1.5px solid ${colors[type]}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: colors[type], fontSize: 13, fontWeight: 700,
    }}>
      {icons[type]}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const { user, switchAccount, logout, mockAccounts } = useAuth();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  const pageTitle = (() => {
    const path = location.pathname.substring(1);
    return NAV_TITLES[path] || (path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard");
  })();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const btnStyle = {
    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
    background: "var(--bg-card)", border: "1px solid var(--border-glass)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "all 0.2s", color: "var(--text-secondary)",
  };

  return (
    <>
      {/* Search Overlay */}
      {searchOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)", zIndex: 9999,
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: 120,
          }}
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 580,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-glass)",
              borderRadius: 20, overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              animation: "slideDown 0.2s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border-glass)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search customers, invoices, plans, tenants..."
                style={{
                  flex: 1, background: "transparent", border: "none",
                  fontSize: 15, color: "var(--text-primary)", fontFamily: "Inter, sans-serif",
                }}
              />
              <kbd style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 6, padding: "2px 8px" }}>ESC</kbd>
            </div>
            <div style={{ padding: "12px 20px" }}>
              {searchQuery.length === 0 ? (
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>Recent Searches</div>
                  {["Netflix billing cycle", "Premium plan customers", "Webhook failures"].map(q => (
                    <div key={q} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "var(--text-secondary)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => setSearchQuery(q)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5"/></svg>
                      {q}
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>Results for "{searchQuery}"</div>
                  {["Customer: Netflix Inc.", "Invoice #INV-0042 – Spotify", "Plan: Enterprise Tier"].filter(r => r.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                    <div key={r} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "var(--text-primary)", fontSize: 13, display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border-glass)", display: "flex", gap: 16 }}>
              {[["↵", "to select"], ["↑↓", "to navigate"], ["ESC", "to close"]].map(([key, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <kbd style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 4, padding: "1px 6px" }}>{key}</kbd>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <header style={{
        height: 72, display: "flex", alignItems: "center",
        padding: "0 24px", gap: 12,
        background: "var(--navbar-bg)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-glass)",
        position: "sticky", top: 0, zIndex: 99,
      }}>
        {/* Page title */}
        <div style={{ minWidth: 220 }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", margin: 0 }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{today}</p>
        </div>

        {/* Search bar */}
        <button
          onClick={() => setSearchOpen(true)}
          style={{
            flex: 1, maxWidth: 380, height: 38, display: "flex", alignItems: "center",
            gap: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)",
            borderRadius: 10, padding: "0 14px", cursor: "text",
            transition: "all 0.2s", textAlign: "left",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent, #6366f1)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-glass)"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span style={{ fontSize: 13, color: "var(--text-muted)", flex: 1 }}>Search anything...</span>
          <kbd style={{ fontSize: 10, color: "var(--text-muted)", background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: 4, padding: "1px 6px" }}>⌘K</kbd>
        </button>

        <div style={{ flex: 1 }} />

        {/* Live status pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 100 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>All Systems Operational</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => toggleTheme(mode === "dark" ? "light" : "dark")}
          style={btnStyle}
          title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#6366f1"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.borderColor = "var(--border-glass)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          {mode === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            style={{ ...btnStyle, position: "relative" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "#6366f1"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.borderColor = "var(--border-glass)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 8, height: 8, borderRadius: "50%",
                background: "#ef4444", border: "2px solid var(--navbar-bg)",
              }} />
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: 48, right: 0,
              width: 360, background: "var(--bg-secondary)",
              border: "1px solid var(--border-glass)", borderRadius: 16,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              zIndex: 200, animation: "slideDown 0.2s ease",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  Notifications {unreadCount > 0 && <span style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 100, background: "rgba(239,68,68,0.15)", color: "#ef4444", fontSize: 11, fontWeight: 700 }}>{unreadCount}</span>}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    Mark all read
                  </button>
                )}
              </div>
              {/* Items */}
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: "flex", gap: 12, padding: "14px 20px",
                      borderBottom: "1px solid var(--border-glass)",
                      cursor: "pointer", transition: "background 0.15s",
                      background: n.read ? "transparent" : "rgba(99,102,241,0.04)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card)"}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : "rgba(99,102,241,0.04)"}
                  >
                    <NotifIcon type={n.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: "var(--text-primary)", marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
                        {n.title}
                        {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block" }} />}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 4 }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 20px", textAlign: "center", borderTop: "1px solid var(--border-glass)" }}>
                <button style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  View All Activity →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Account switcher */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 12px 6px 6px", borderRadius: 12,
              background: "var(--bg-card)", border: "1px solid var(--border-glass)",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "rgba(99,102,241,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-glass)"; e.currentTarget.style.background = "var(--bg-card)"; }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--gradient-primary, linear-gradient(135deg,#6366f1,#8b5cf6))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 12, color: "white",
            }}>
              {user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "U"}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{user?.name || "User"}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.4, textTransform: "capitalize" }}>{user?.role || "viewer"}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ marginLeft: 2 }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {profileOpen && (
            <div style={{
              position: "absolute", top: 52, right: 0,
              width: 240, background: "var(--bg-secondary)",
              border: "1px solid var(--border-glass)", borderRadius: 16,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              zIndex: 200, animation: "slideDown 0.2s ease",
              overflow: "hidden",
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-glass)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Switch Account</div>
                {(mockAccounts || []).map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => { switchAccount(acc); setProfileOpen(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 10px", borderRadius: 10, marginBottom: 4,
                      background: user?.id === acc.id ? "rgba(99,102,241,0.1)" : "transparent",
                      border: user?.id === acc.id ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                      cursor: "pointer", transition: "all 0.15s", fontFamily: "Inter, sans-serif",
                    }}
                    onMouseEnter={e => { if (user?.id !== acc.id) e.currentTarget.style.background = "var(--bg-card)"; }}
                    onMouseLeave={e => { if (user?.id !== acc.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: acc.role === "admin" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#10b981,#06b6d4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800, color: "white",
                    }}>
                      {acc.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{acc.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "capitalize" }}>{acc.role}</div>
                    </div>
                    {user?.id === acc.id && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" style={{ marginLeft: "auto" }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ padding: "10px 16px" }}>
                <button
                  onClick={() => logout()}
                  style={{
                    width: "100%", padding: "10px", borderRadius: 10,
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                    color: "#ef4444", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "Inter, sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
