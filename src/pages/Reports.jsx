import { useState } from "react";
import { jsPDF } from "jspdf";
import MainLayout from "../layouts/MainLayout";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const revenueData = [
  { month: "Jan", revenue: 12000, expenses: 8000, profit: 4000 },
  { month: "Feb", revenue: 18000, expenses: 11000, profit: 7000 },
  { month: "Mar", revenue: 15000, expenses: 9500, profit: 5500 },
  { month: "Apr", revenue: 22000, expenses: 13000, profit: 9000 },
  { month: "May", revenue: 27000, expenses: 15000, profit: 12000 },
  { month: "Jun", revenue: 30000, expenses: 17000, profit: 13000 },
  { month: "Jul", revenue: 28000, expenses: 16000, profit: 12000 },
  { month: "Aug", revenue: 34000, expenses: 18000, profit: 16000 },
];

const subscriptionData = [
  { name: "Active", value: 65, color: "#10b981" },
  { name: "Expired", value: 20, color: "#f59e0b" },
  { name: "Cancelled", value: 15, color: "#ef4444" },
];

const growthData = [
  { month: "Jan", customers: 800 },
  { month: "Feb", customers: 920 },
  { month: "Mar", customers: 880 },
  { month: "Apr", customers: 1050 },
  { month: "May", customers: 1180 },
  { month: "Jun", customers: 1248 },
  { month: "Jul", customers: 1310 },
  { month: "Aug", customers: 1420 },
];

const planRevenueData = [
  { plan: "Basic", revenue: 45000 },
  { plan: "Standard", revenue: 72000 },
  { plan: "Premium", revenue: 110000 },
  { plan: "Enterprise", revenue: 180000 },
];

const kpis = [
  {
    label: "Total Revenue",
    value: "₹2,45,000",
    change: "+18.2%",
    up: true,
    icon: <AttachMoneyIcon />,
    gradient: "linear-gradient(135deg,#4f8ef7,#2563eb)",
  },
  {
    label: "Active Subscribers",
    value: "1,248",
    change: "+8.4%",
    up: true,
    icon: <PeopleIcon />,
    gradient: "linear-gradient(135deg,#10b981,#059669)",
  },
  {
    label: "Churn Rate",
    value: "3.2%",
    change: "-0.8%",
    up: false,
    icon: <AutorenewIcon />,
    gradient: "linear-gradient(135deg,#f59e0b,#d97706)",
  },
  {
    label: "Avg. Revenue / User",
    value: "₹1,963",
    change: "+9.1%",
    up: true,
    icon: <AssessmentIcon />,
    gradient: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  },
];

const GlassCard = ({ children, style = {} }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20,
      padding: 24,
      ...style,
    }}
  >
    {children}
  </div>
);

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(13,21,38,0.95)",
        border: "1px solid rgba(79,142,247,0.3)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {label && <p style={{ color: "#8b9dc3", fontSize: 11, marginBottom: 6 }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "#f0f4ff", fontSize: 12, fontWeight: 600 }}>
            {typeof p.value === "number" && p.name?.toLowerCase().includes("customer")
              ? p.value.toLocaleString()
              : `₹${p.value?.toLocaleString?.("en-IN") ?? p.value}`}
          </span>
          <span style={{ color: "#4a5a7a", fontSize: 11 }}>{p.name}</span>
        </div>
      ))}
    </div>
  );
};

const ranges = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "This Year"];

export default function Reports() {
  const [activeRange, setActiveRange] = useState("Last 6 Months");

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(13, 21, 38);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(79, 142, 247);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Billing Analytics Report", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(139, 157, 195);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, 14, 28);
    doc.text(`Period: ${activeRange}`, 14, 35);

    // KPI Summary
    doc.setTextColor(240, 244, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Key Performance Indicators", 14, 55);
    doc.setDrawColor(79, 142, 247);
    doc.line(14, 57, pageWidth - 14, 57);

    const kpiTable = [
      ["Total Revenue", "₹2,45,000", "+18.2%"],
      ["Active Subscribers", "1,248", "+8.4%"],
      ["Churn Rate", "3.2%", "-0.8%"],
      ["Avg. Revenue / User", "₹1,963", "+9.1%"],
    ];
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    kpiTable.forEach(([label, value, change], i) => {
      const y = 65 + i * 10;
      doc.setTextColor(139, 157, 195);
      doc.text(label, 14, y);
      doc.setTextColor(240, 244, 255);
      doc.text(value, 90, y);
      doc.setTextColor(change.startsWith("+") ? 16 : 239, change.startsWith("+") ? 185 : 68, change.startsWith("+") ? 129 : 68);
      doc.text(change, 140, y);
    });

    // Monthly Revenue Table
    doc.setTextColor(240, 244, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Revenue Summary", 14, 115);
    doc.setDrawColor(79, 142, 247);
    doc.line(14, 117, pageWidth - 14, 117);

    const headers = ["Month", "Revenue (₹)", "Expenses (₹)", "Profit (₹)", "Customers"];
    const colWidths = [25, 35, 37, 30, 28];
    let startX = 14;
    doc.setFontSize(9);
    doc.setTextColor(79, 142, 247);
    headers.forEach((h, i) => { doc.text(h, startX, 125); startX += colWidths[i]; });

    revenueData.forEach((row, idx) => {
      const y = 133 + idx * 9;
      if (idx % 2 === 0) {
        doc.setFillColor(20, 32, 55);
        doc.rect(13, y - 5, pageWidth - 26, 8, "F");
      }
      doc.setTextColor(240, 244, 255);
      let x = 14;
      const cols = [row.month, row.revenue.toLocaleString("en-IN"), row.expenses.toLocaleString("en-IN"), row.profit.toLocaleString("en-IN"), String(800 + idx * 80)];
      cols.forEach((val, i) => { doc.text(val, x, y); x += colWidths[i]; });
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(74, 90, 122);
    doc.text("Billing Management System — Confidential", 14, 285);
    doc.text(`Page 1 of 1`, pageWidth - 30, 285);

    doc.save(`billing-report-${activeRange.replace(/\s/g, "-").toLowerCase()}.pdf`);
  };

  const exportCSV = () => {
    const headers = ["Month", "Revenue", "Expenses", "Profit", "Customers", "Growth %"];
    const rows = revenueData.map((row, i) => [
      row.month,
      row.revenue,
      row.expenses,
      row.profit,
      800 + i * 80,
      `${(8 + i).toFixed(1)}%`,
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-summary-${activeRange.replace(/\s/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Reports & Analytics
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Track performance, revenue trends & subscription insights</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              style={{
                padding: "6px 14px",
                borderRadius: 10,
                background: activeRange === r ? "rgba(99,102,241,0.15)" : "var(--bg-card)",
                border: activeRange === r ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border-glass)",
                color: activeRange === r ? "#6366f1" : "var(--text-muted)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "Inter,sans-serif",
              }}
            >
              {r}
            </button>
          ))}
          <button
            onClick={exportPDF}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Inter,sans-serif",
              boxShadow: "0 4px 16px rgba(79,142,247,0.35)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <DownloadIcon style={{ fontSize: 16 }} />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <GlassCard key={i} style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: k.gradient, opacity: 0.12, filter: "blur(16px)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: k.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20 }}>
                {k.icon}
              </div>
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: k.up ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${k.up ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
                color: k.up ? "#10b981" : "#ef4444",
              }}>
                {k.up ? <TrendingUpIcon style={{ fontSize: 13 }} /> : <TrendingDownIcon style={{ fontSize: 13 }} />}
                {k.change}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{k.label}</div>
            <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: k.gradient, borderRadius: "100px 100px 0 0", opacity: 0.7 }} />
          </GlassCard>
        ))}
      </div>

      {/* Row 1: Bar chart + Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18, marginBottom: 18 }}>
        <GlassCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>Revenue vs Expenses vs Profit</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Monthly breakdown</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ label: "Revenue", color: "#6366f1" }, { label: "Expenses", color: "#ef4444" }, { label: "Profit", color: "#10b981" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} barGap={4} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#4f8ef7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard style={{ display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Subscription Status</h3>
          <p style={{ fontSize: 12, color: "#4a5a7a", marginBottom: 16 }}>Distribution by status</p>
          <div style={{ position: "relative", flex: 1 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={subscriptionData} dataKey="value" cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} strokeWidth={0}>
                  {subscriptionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color}60)` }} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  return (
                    <div style={{ background: "rgba(13,21,38,0.95)", border: `1px solid ${d.payload.color}50`, borderRadius: 10, padding: "8px 12px" }}>
                      <p style={{ color: d.payload.color, fontWeight: 700, fontSize: 13 }}>{d.name}</p>
                      <p style={{ color: "#f0f4ff", fontWeight: 800, fontSize: 16 }}>{d.value}%</p>
                    </div>
                  );
                }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>100%</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>TOTAL</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            {subscriptionData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, boxShadow: `0 0 6px ${d.color}`, display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{d.name}</span>
                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Customer Growth + Plan Revenue */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <GlassCard>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Customer Growth</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>Monthly active customer count</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growthData} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="custGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "8px 12px" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}>{label}</p>
                    <p style={{ color: "#10b981", fontWeight: 700 }}>{payload[0].value?.toLocaleString()} customers</p>
                  </div>
                );
              }} />
              <Area type="monotone" dataKey="customers" name="Customers" stroke="#10b981" strokeWidth={2.5} fill="url(#custGrad)" dot={false} activeDot={{ r: 5, fill: "#10b981", stroke: "var(--bg-secondary)", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Revenue by Plan</h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 18 }}>Total revenue generated per plan</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={planRevenueData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickFormatter={v => `₹${v / 1000}k`} />
              <YAxis type="category" dataKey="plan" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} width={70} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]}>
                {planRevenueData.map((_, i) => (
                  <Cell key={i} fill={["#6366f1", "#10b981", "#8b5cf6", "#f59e0b"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Bottom Summary Table */}
      <GlassCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Monthly Summary</h3>
          <button
            onClick={exportCSV}
            style={{
              padding: "6px 14px", borderRadius: 10, background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)", color: "#6366f1", fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.12)"}
          >
            <DownloadIcon style={{ fontSize: 14 }} />
            Export CSV
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Month", "Revenue", "Expenses", "Profit", "Customers", "Growth"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0 16px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase", borderBottom: "1px solid var(--border-glass)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row, i) => (
                <tr key={i} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"} style={{ transition: "background 0.15s" }}>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-glass)", color: "var(--text-primary)", fontWeight: 600 }}>{row.month}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-glass)", color: "var(--accent)", fontWeight: 600 }}>₹{row.revenue.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-glass)", color: "#ef4444" }}>₹{row.expenses.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-glass)", color: "#10b981", fontWeight: 600 }}>₹{row.profit.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-glass)", color: "var(--text-secondary)" }}>{(800 + i * 80).toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-glass)" }}>
                    <span style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>↑ {(8 + i).toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </MainLayout>
  );
}