import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
const data = [
  { name: "Active", value: 75, color: "#10b981" },
  { name: "Trial", value: 12, color: "#4f8ef7" },
  { name: "Expired", value: 8, color: "#f59e0b" },
  { name: "Cancelled", value: 5, color: "#ef4444" },
];
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div
        style={{
          background: "rgba(13,21,38,0.95)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${d.payload.color}50`,
          borderRadius: 12,
          padding: "10px 14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <p style={{ color: d.payload.color, fontWeight: 700, fontSize: 14 }}>{d.name}</p>
        <p style={{ color: "#f0f4ff", fontSize: 18, fontWeight: 800 }}>{d.value}%</p>
      </div>
    );
  }
  return null;
};
const CustomLegend = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginTop: 8 }}>
    {data.map((item) => (
      <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: item.color,
            boxShadow: `0 0 8px ${item.color}`,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 12, color: "#8b9dc3" }}>{item.name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f4ff", marginLeft: "auto" }}>{item.value}%</span>
      </div>
    ))}
  </div>
);
export default function SubscriptionChart() {
  const total = data.reduce((sum, d) => sum + d.value, 0);
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>
          Subscription Status
        </h3>
        <p style={{ fontSize: 12, color: "#4a5a7a" }}>Current subscription breakdown</p>
      </div>
      {/* Donut Chart */}
      <div style={{ flex: 1, position: "relative" }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  style={{ filter: `drop-shadow(0 0 8px ${entry.color}60)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f0f4ff" }}>{total}</div>
          <div style={{ fontSize: 10, color: "#4a5a7a", fontWeight: 500, letterSpacing: "0.5px" }}>TOTAL</div>
        </div>
      </div>
      <CustomLegend />
    </div>
  );
}
