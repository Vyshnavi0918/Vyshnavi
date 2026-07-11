import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
const payments = [
  { invoice: "INV-1001", customer: "Vyshnavi K", amount: "₹999", status: "Paid", date: "Jul 5, 2026", method: "UPI" },
  { invoice: "INV-1002", customer: "Rahul Sharma", amount: "₹499", status: "Pending", date: "Jul 4, 2026", method: "Card" },
  { invoice: "INV-1003", customer: "Sai Charan", amount: "₹1,499", status: "Paid", date: "Jul 3, 2026", method: "Net Banking" },
  { invoice: "INV-1004", customer: "Priya Nair", amount: "₹250", status: "Failed", date: "Jul 2, 2026", method: "UPI" },
  { invoice: "INV-1005", customer: "Karthik M", amount: "₹999", status: "Paid", date: "Jul 1, 2026", method: "Card" },
];
const statusStyles = {
  Paid: { bg: "rgba(16,185,129,0.12)", color: "#10b981", border: "rgba(16,185,129,0.25)", dot: "#10b981" },
  Pending: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "rgba(245,158,11,0.25)", dot: "#f59e0b" },
  Failed: { bg: "rgba(239,68,68,0.12)", color: "#ef4444", border: "rgba(239,68,68,0.25)", dot: "#ef4444" },
};
const methodColors = {
  UPI: "#10b981",
  Card: "#4f8ef7",
  "Net Banking": "#8b5cf6",
};
export default function PaymentTable() {
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
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 2 }}>Recent Payments</h3>
          <p style={{ fontSize: 12, color: "#4a5a7a" }}>Last 5 transactions</p>
        </div>
        <button
          style={{
            padding: "7px 16px",
            borderRadius: 10,
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            color: "#10b981",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(16,185,129,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(16,185,129,0.1)";
          }}
        >
          Export →
        </button>
      </div>
      {/* Payments list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {payments.map((p, idx) => {
          const status = statusStyles[p.status];
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
              }}
            >
              {/* Invoice Icon */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `${status.color}18`,
                  border: `1px solid ${status.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  color: status.color,
                  letterSpacing: "-0.3px",
                }}
              >
                INV
              </div>
              {/* Invoice info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff", whiteSpace: "nowrap" }}>
                    {p.invoice}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: methodColors[p.method] || "#8b9dc3",
                      background: `${methodColors[p.method]}15` || "rgba(139,157,195,0.1)",
                      padding: "2px 6px",
                      borderRadius: 6,
                      border: `1px solid ${methodColors[p.method]}30` || "rgba(139,157,195,0.2)",
                    }}
                  >
                    {p.method}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#4a5a7a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.customer} · {p.date}
                </div>
              </div>
              {/* Amount */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", marginBottom: 2 }}>{p.amount}</div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 8px",
                    borderRadius: 100,
                    background: status.bg,
                    border: `1px solid ${status.border}`,
                    color: status.color,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: status.dot,
                      display: "inline-block",
                    }}
                  />
                  {p.status}
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                {[
                  { icon: <VisibilityIcon style={{ fontSize: 14 }} />, color: "#4f8ef7", title: "View" },
                  { icon: <DownloadIcon style={{ fontSize: 14 }} />, color: "#10b981", title: "Download" },
                  { icon: <PrintIcon style={{ fontSize: 14 }} />, color: "#8b5cf6", title: "Print" },
                ].map((btn, i) => (
                  <button
                    key={i}
                    title={btn.title}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: "rgba(255,255,255,0.04)",
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
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
