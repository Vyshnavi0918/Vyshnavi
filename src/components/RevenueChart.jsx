import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
const data = [
  { month: "Jan", revenue: 12000, target: 10000 },
  { month: "Feb", revenue: 15000, target: 13000 },
  { month: "Mar", revenue: 18000, target: 16000 },
  { month: "Apr", revenue: 21000, target: 19000 },
  { month: "May", revenue: 24000, target: 22000 },
  { month: "Jun", revenue: 26000, target: 25000 },
  { month: "Jul", revenue: 30000, target: 27000 },
  { month: "Aug", revenue: 28000, target: 29000 },
  { month: "Sep", revenue: 32000, target: 30000 },
];
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(13,21,38,0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(79,142,247,0.3)",
          borderRadius: 12,
          padding: "12px 16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <p style={{ color: "#8b9dc3", fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{label}</p>
        {payload.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: p.color,
                display: "inline-block",
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
            <span style={{ color: "#f0f4ff", fontSize: 13, fontWeight: 600 }}>
              ₹{p.value.toLocaleString("en-IN")}
            </span>
            <span style={{ color: "#4a5a7a", fontSize: 11 }}>{p.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
export default function RevenueChart() {
  const total = data.reduce((sum, d) => sum + d.revenue, 0);
  const growth = (((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100).toFixed(1);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "24px",
        height: "100%",
        minHeight: 380,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>Revenue Overview</h3>
          <p style={{ fontSize: 12, color: "#4a5a7a" }}>Monthly performance vs target</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f0f4ff" }}>
            ₹{(total / 100000).toFixed(1)}L
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#10b981",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
              justifyContent: "flex-end",
            }}
          >
            <span>↑ {growth}%</span>
            <span style={{ color: "#4a5a7a" }}>vs last year</span>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {[
          { label: "Revenue", color: "#4f8ef7" },
          { label: "Target", color: "#8b5cf6" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 24,
                height: 3,
                borderRadius: 100,
                background: l.color,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 12, color: "#8b9dc3" }}>{l.label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f8ef7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f8ef7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4a5a7a", fontSize: 12, fontFamily: "Inter" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4a5a7a", fontSize: 11, fontFamily: "Inter" }}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            name="Revenue"
            type="monotone"
            dataKey="revenue"
            stroke="#4f8ef7"
            strokeWidth={2.5}
            fill="url(#colorRevenue)"
            dot={false}
            activeDot={{ r: 5, fill: "#4f8ef7", stroke: "#0d1526", strokeWidth: 2 }}
          />
          <Area
            name="Target"
            type="monotone"
            dataKey="target"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 3"
            fill="url(#colorTarget)"
            dot={false}
            activeDot={{ r: 4, fill: "#8b5cf6", stroke: "#0d1526", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
