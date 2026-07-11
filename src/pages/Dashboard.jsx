import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Data ───────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  {
    id: "mrr", label: "Monthly Recurring Revenue", value: "₹14.2 Cr",
    delta: "+12.4%", deltaDir: "up", icon: "💰",
    gradient: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
    sub: "vs ₹12.6 Cr last month",
  },
  {
    id: "arr", label: "Annual Run Rate", value: "₹170 Cr",
    delta: "+8.7%", deltaDir: "up", icon: "📈",
    gradient: "linear-gradient(135deg,#10b981 0%,#06b6d4 100%)",
    sub: "Based on current MRR",
  },
  {
    id: "tenants", label: "Active Tenants", value: "2,847",
    delta: "+43 this week", deltaDir: "up", icon: "🏢",
    gradient: "linear-gradient(135deg,#f59e0b 0%,#f97316 100%)",
    sub: "Across 6 global regions",
  },
  {
    id: "churn", label: "Churn Rate", value: "1.82%",
    delta: "-0.3%", deltaDir: "down-good", icon: "📉",
    gradient: "linear-gradient(135deg,#ec4899 0%,#f43f5e 100%)",
    sub: "Industry avg 3.2%",
  },
];

const TENANT_INTEGRATIONS = [
  { name: "Netflix Inc.", segment: "Media Streaming", mrr: "₹3.2 Cr", status: "active", uptime: 99.98 },
  { name: "Spotify AB", segment: "Music SaaS", mrr: "₹2.1 Cr", status: "active", uptime: 99.95 },
  { name: "Zoom Video", segment: "Collaboration", mrr: "₹1.8 Cr", status: "active", uptime: 99.91 },
  { name: "Duolingo Inc.", segment: "EdTech SaaS", mrr: "₹0.9 Cr", status: "degraded", uptime: 97.42 },
  { name: "Figma Corp.", segment: "Design SaaS", mrr: "₹0.7 Cr", status: "active", uptime: 99.99 },
];

const RECENT_EVENTS = [
  { id: 1, type: "payment", label: "Netflix — ₹3.2 Cr collected", time: "2 min ago", status: "success" },
  { id: 2, type: "webhook", label: "Webhook retry triggered for Duolingo", time: "18 min ago", status: "warning" },
  { id: 3, type: "upgrade", label: "Spotify upgraded to Enterprise tier", time: "1 hr ago", status: "info" },
  { id: 4, type: "invoice", label: "INV-0092 — Zoom Video sent", time: "2 hr ago", status: "success" },
  { id: 5, type: "alert", label: "Figma API rate limit at 72% capacity", time: "3 hr ago", status: "warning" },
  { id: 6, type: "payment", label: "Duolingo — ₹0.9 Cr collected", time: "5 hr ago", status: "success" },
];

const REVENUE_BARS = [
  { month: "Jan", value: 9.1 },
  { month: "Feb", value: 10.4 },
  { month: "Mar", value: 11.2 },
  { month: "Apr", value: 10.8 },
  { month: "May", value: 12.3 },
  { month: "Jun", value: 13.1 },
  { month: "Jul", value: 14.2 },
];

const PLAN_DIST = [
  { label: "Enterprise", pct: 42, color: "#6366f1" },
  { label: "Professional", pct: 33, color: "#10b981" },
  { label: "Starter", pct: 18, color: "#f59e0b" },
  { label: "Free Trial", pct: 7, color: "#ec4899" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function KpiCard({ card, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border-glass)",
        borderRadius: 20, padding: 24, cursor: "default",
        boxShadow: hovered ? "var(--shadow-glow)" : "var(--shadow-card)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        animation: `fadeInUp 0.5s ease ${delay}ms both`,
        backdropFilter: "blur(16px)", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: card.gradient, opacity: hovered ? 0.15 : 0.08, transition: "opacity 0.3s" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 28, lineHeight: 1 }}>{card.icon}</div>
        <div style={{
          padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
          background: card.deltaDir === "down-good" ? "rgba(16,185,129,0.12)" : card.deltaDir === "up" ? "rgba(99,102,241,0.12)" : "rgba(239,68,68,0.12)",
          color: card.deltaDir === "down-good" ? "#10b981" : card.deltaDir === "up" ? "#818cf8" : "#ef4444",
        }}>
          {card.deltaDir === "up" ? "▲" : "▼"} {card.delta}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 4 }}>{card.value}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 4 }}>{card.label}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{card.sub}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { bg: "rgba(16,185,129,0.12)", color: "#10b981", label: "Active" },
    degraded: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "Degraded" },
    down: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", label: "Down" },
  };
  const s = map[status] || map.active;
  return (
    <span style={{ padding: "3px 10px", borderRadius: 100, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, display: "inline-block" }} />{s.label}
    </span>
  );
}

function EventBadge({ status }) {
  const map = {
    success: "#10b981", warning: "#f59e0b", info: "#6366f1", error: "#ef4444",
  };
  return <div style={{ width: 8, height: 8, borderRadius: "50%", background: map[status] || "#6366f1", boxShadow: `0 0 6px ${map[status] || "#6366f1"}`, flexShrink: 0, marginTop: 5 }} />;
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = ["overview", "tenants", "events"];

  return (
    <div style={{ padding: "28px 32px", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Welcome header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Good morning, {user?.name?.split(" ")[0] || "User"} 👋
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Here's what's happening with your billing infrastructure today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/billing")}
            style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "var(--bg-card)", border: "1px solid var(--border-glass)",
              color: "var(--text-secondary)", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-glass)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
            View Invoices
          </button>
          <button
            onClick={() => navigate("/plans")}
            style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none", color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Subscription
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "4px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 12, width: "fit-content", marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: activeTab === tab ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
              color: activeTab === tab ? "white" : "var(--text-muted)",
              border: "none", textTransform: "capitalize", transition: "all 0.2s",
              boxShadow: activeTab === tab ? "0 2px 8px rgba(99,102,241,0.35)" : "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 24 }}>
        {KPI_CARDS.map((card, i) => <KpiCard key={card.id} card={card} delay={i * 80} />)}
      </div>

      {/* Main grid */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
          {/* Revenue chart */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, backdropFilter: "blur(16px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Monthly Revenue Growth</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Recurring revenue in Crore ₹</div>
              </div>
              <div style={{ padding: "6px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 12, fontWeight: 700 }}>+12.4% this month</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
              {REVENUE_BARS.map((bar, i) => {
                const max = Math.max(...REVENUE_BARS.map(b => b.value));
                const h = (bar.value / max) * 120;
                const isLatest = i === REVENUE_BARS.length - 1;
                return (
                  <div key={bar.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 600 }}>₹{bar.value}Cr</div>
                    <div style={{ width: "100%", height: h,
                      background: isLatest ? "linear-gradient(180deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.25)",
                      borderRadius: "6px 6px 4px 4px",
                      boxShadow: isLatest ? "0 4px 16px rgba(99,102,241,0.4)" : "none",
                      transition: "height 0.5s ease",
                    }} />
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{bar.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plan Distribution */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, backdropFilter: "blur(16px)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Plan Distribution</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>By active subscription count</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PLAN_DIST.map(p => (
                <div key={p.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{p.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 100, background: "var(--bg-secondary, rgba(0,0,0,0.1))", overflow: "hidden" }}>
                    <div style={{ width: `${p.pct}%`, height: "100%", background: p.color, borderRadius: 100, boxShadow: `0 0 8px ${p.color}60` }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "14px", background: "rgba(99,102,241,0.06)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.1)" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Avg Revenue Per Tenant</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>₹49,880 <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>▲ 4.2%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Tenants tab */}
      {activeTab === "tenants" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 20, backdropFilter: "blur(16px)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-glass)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Enterprise Tenant Monitor</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Real-time integration status for top clients</div>
            </div>
            <button
              onClick={() => navigate("/customers")}
              style={{ padding: "8px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366f1", cursor: "pointer" }}>
              View All
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Tenant", "Segment", "Monthly Revenue", "Uptime", "Status"].map(col => (
                    <th key={col} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--bg-secondary, rgba(0,0,0,0.05))" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TENANT_INTEGRATIONS.map((t, i) => (
                  <tr key={t.name} style={{ borderTop: "1px solid var(--border-glass)", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `hsl(${i * 60},70%,55%)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "white" }}>
                          {t.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px", fontSize: 13, color: "var(--text-secondary)" }}>{t.segment}</td>
                    <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{t.mrr}</td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 100, background: "var(--bg-secondary, rgba(0,0,0,0.1))", overflow: "hidden", maxWidth: 80 }}>
                          <div style={{ width: `${t.uptime}%`, height: "100%", background: t.uptime > 99 ? "#10b981" : "#f59e0b", borderRadius: 100 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: t.uptime > 99 ? "#10b981" : "#f59e0b" }}>{t.uptime}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events tab */}
      {activeTab === "events" && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, backdropFilter: "blur(16px)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>Live Event Stream</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>Real-time billing events from all tenants</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {RECENT_EVENTS.map((ev, i) => (
              <div key={ev.id} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "16px 0",
                borderBottom: i < RECENT_EVENTS.length - 1 ? "1px solid var(--border-glass)" : "none",
                animation: `fadeInUp 0.4s ease ${i * 60}ms both`,
              }}>
                <EventBadge status={ev.status} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{ev.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{ev.time}</div>
                </div>
                <div style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  background: ev.status === "success" ? "rgba(16,185,129,0.1)" : ev.status === "warning" ? "rgba(245,158,11,0.1)" : "rgba(99,102,241,0.1)",
                  color: ev.status === "success" ? "#10b981" : ev.status === "warning" ? "#f59e0b" : "#818cf8",
                }}>{ev.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom row */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          {/* Quick actions */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, backdropFilter: "blur(16px)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "🧾", label: "Create Invoice", path: "/billing" },
                { icon: "👤", label: "Add Customer", path: "/customers" },
                { icon: "📦", label: "Manage Plans", path: "/plans" },
                { icon: "📊", label: "View Reports", path: "/reports" },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.path)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 16px", borderRadius: 12,
                    background: "var(--bg-secondary, rgba(0,0,0,0.05))",
                    border: "1px solid var(--border-glass)", cursor: "pointer",
                    color: "var(--text-secondary)", fontSize: 13, fontWeight: 600,
                    transition: "all 0.2s", textAlign: "left", fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-glass)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-secondary, rgba(0,0,0,0.05))"; }}
                >
                  <span style={{ fontSize: 18 }}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* System health */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, backdropFilter: "blur(16px)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>API Gateway Health</div>
            {[
              { name: "Billing API", health: 100, latency: "42ms" },
              { name: "Webhook Engine", health: 98, latency: "88ms" },
              { name: "Payment Gateway", health: 100, latency: "61ms" },
              { name: "Tenant Sync", health: 94, latency: "134ms" },
            ].map(s => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: s.health > 97 ? "#10b981" : "#f59e0b", boxShadow: `0 0 6px ${s.health > 97 ? "#10b981" : "#f59e0b"}` }} />
                <div style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", minWidth: 50 }}>{s.latency}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.health > 97 ? "#10b981" : "#f59e0b", minWidth: 40, textAlign: "right" }}>{s.health}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}