import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
const customers = [
  { id: 1, name: "Vyshnavi K", email: "vyshnavi@gmail.com", plan: "Premium", status: "Active", avatar: "V", spend: "₹4,500" },
  { id: 2, name: "Rahul Sharma", email: "rahul@gmail.com", plan: "Basic", status: "Active", avatar: "R", spend: "₹999" },
  { id: 3, name: "Sai Charan", email: "sai@gmail.com", plan: "Enterprise", status: "Expired", avatar: "S", spend: "₹12,000" },
  { id: 4, name: "Priya Nair", email: "priya@gmail.com", plan: "Standard", status: "Trial", avatar: "P", spend: "₹0" },
  { id: 5, name: "Karthik M", email: "karthik@gmail.com", plan: "Premium", status: "Active", avatar: "K", spend: "₹4,500" },
];
const planColors = {
  Premium: { bg: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "rgba(139,92,246,0.3)" },
  Basic: { bg: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "rgba(79,142,247,0.3)" },
  Enterprise: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  Standard: { bg: "rgba(6,182,212,0.15)", color: "#06b6d4", border: "rgba(6,182,212,0.3)" },
};
const statusColors = {
  Active: { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.25)", dot: "#10b981" },
  Expired: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", dot: "#ef4444" },
  Trial: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.25)", dot: "#f59e0b" },
};
const avatarGradients = [
  "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #4f8ef7)",
];
export default function CustomerTable() {
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
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 2 }}>Recent Customers</h3>
          <p style={{ fontSize: 12, color: "#4a5a7a" }}>{customers.length} customers total</p>
        </div>
        <button
          style={{
            padding: "7px 16px",
            borderRadius: 10,
            background: "rgba(79,142,247,0.12)",
            border: "1px solid rgba(79,142,247,0.25)",
            color: "#4f8ef7",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(79,142,247,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(79,142,247,0.12)";
          }}
        >
          View All →
        </button>
      </div>
      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Customer", "Plan", "Spend", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#2a3a5a",
                    letterSpacing: "0.8px",
                    padding: "0 12px 12px",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c, idx) => {
              const plan = planColors[c.plan] || planColors.Basic;
              const status = statusColors[c.status] || statusColors.Active;
              return (
                <tr
                  key={c.id}
                  style={{ transition: "background 0.15s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Customer */}
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: avatarGradients[idx % avatarGradients.length],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#fff",
                          flexShrink: 0,
                        }}
                      >
                        {c.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "#4a5a7a" }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Plan */}
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: plan.bg,
                        color: plan.color,
                        border: `1px solid ${plan.border}`,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {c.plan}
                    </span>
                  </td>
                  {/* Spend */}
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{c.spend}</span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 100,
                        background: status.bg,
                        border: `1px solid ${status.border}`,
                        color: status.color,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: status.dot,
                          boxShadow: `0 0 6px ${status.dot}`,
                          display: "inline-block",
                        }}
                      />
                      {c.status}
                    </div>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[
                        { icon: <VisibilityIcon style={{ fontSize: 15 }} />, color: "#4f8ef7" },
                        { icon: <EditIcon style={{ fontSize: 15 }} />, color: "#10b981" },
                        { icon: <DeleteIcon style={{ fontSize: 15 }} />, color: "#ef4444" },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: btn.color,
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${btn.color}20`;
                            e.currentTarget.style.borderColor = `${btn.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          }}
                        >
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
