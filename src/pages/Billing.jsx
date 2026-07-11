import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaidIcon from "@mui/icons-material/Paid";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { jsPDF } from "jspdf";

const GlassCard = ({ children, style = {} }) => (
  <div style={{ background: "var(--bg-card)", backdropFilter: "blur(20px)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, ...style }}>
    {children}
  </div>
);

const initialBills = [
  { id: "INV-1001", customer_name: "Vyshnavi K", plan_name: "Premium", amount: 999, billing_date: "2026-07-05", status: "Paid", method: "UPI" },
  { id: "INV-1002", customer_name: "Rahul Sharma", plan_name: "Basic", amount: 499, billing_date: "2026-07-04", status: "Pending", method: "Card" },
  { id: "INV-1003", customer_name: "Sai Charan", plan_name: "Enterprise", amount: 4999, billing_date: "2026-07-03", status: "Paid", method: "Net Banking" },
  { id: "INV-1004", customer_name: "Priya Nair", plan_name: "Standard", amount: 1499, billing_date: "2026-07-02", status: "Failed", method: "UPI" },
  { id: "INV-1005", customer_name: "Karthik M", plan_name: "Premium", amount: 999, billing_date: "2026-07-01", status: "Paid", method: "Card" },
  { id: "INV-1006", customer_name: "Divya S", plan_name: "Basic", amount: 499, billing_date: "2026-06-30", status: "Pending", method: "UPI" },
  { id: "INV-1007", customer_name: "Ajay R", plan_name: "Enterprise", amount: 4999, billing_date: "2026-06-29", status: "Paid", method: "Net Banking" },
];

const statusCfg = {
  Paid: { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: <CheckCircleIcon style={{ fontSize: 13 }} /> },
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: <PendingIcon style={{ fontSize: 13 }} /> },
  Failed: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", icon: <ErrorIcon style={{ fontSize: 13 }} /> },
};

const methodColor = { UPI: "#10b981", Card: "#4f8ef7", "Net Banking": "#8b5cf6" };
const planGradients = [
  "linear-gradient(135deg,#4f8ef7,#8b5cf6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
];

const InputField = ({ label, type = "text", value, onChange, children, select }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.5px" }}>{label}</label>
    {select ? (
      <select value={value} onChange={onChange} style={{
        background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "10px 14px",
        color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-primary)", outline: "none", cursor: "pointer",
      }}>
        {children}
      </select>
    ) : (
      <input type={type} value={value} onChange={onChange} style={{
        background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "10px 14px",
        color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-primary)", outline: "none",
      }} />
    )}
  </div>
);

export default function Billing() {
  const location = useLocation();
  const [bills, setBills] = useState(initialBills);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState(null);
  
  // Payment processing overlay state
  const [payingBill, setPayingBill] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Edit Mode state
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ customer_name: "", plan_name: "", amount: "", billing_date: "", status: "Pending", method: "UPI" });

  useEffect(() => {
    if (location.state?.openDialog) {
      setOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveBill = () => {
    if (!form.customer_name || !form.plan_name || !form.amount) {
      showToast("Please fill all required fields", "error");
      return;
    }
    
    if (editingId) {
      // Edit mode
      setBills(bills.map(b => b.id === editingId ? { ...b, ...form, amount: Number(form.amount) } : b));
      showToast("Invoice Updated Successfully!");
      setEditingId(null);
    } else {
      // Create mode
      const newBill = { 
        ...form, 
        id: `INV-${1000 + bills.length + 1}`, 
        amount: Number(form.amount),
        billing_date: form.billing_date || new Date().toISOString().split("T")[0]
      };
      setBills([newBill, ...bills]);
      showToast("Invoice Generated Successfully!");
    }
    
    setOpen(false);
    setForm({ customer_name: "", plan_name: "", amount: "", billing_date: "", status: "Pending", method: "UPI" });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete invoice ${id}?`)) {
      setBills(bills.filter(b => b.id !== id));
      showToast(`Invoice ${id} deleted successfully`, "success");
    }
  };

  const startEdit = (bill) => {
    setEditingId(bill.id);
    setForm({
      customer_name: bill.customer_name,
      plan_name: bill.plan_name,
      amount: bill.amount.toString(),
      billing_date: bill.billing_date,
      status: bill.status,
      method: bill.method
    });
    setOpen(true);
  };

  const triggerMockPayment = (bill) => {
    setPayingBill(bill);
    setPaymentSuccess(false);
    
    // Simulate gateway response
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        setBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: "Paid" } : b));
        setPayingBill(null);
        showToast(`Payment of ₹${bill.amount.toLocaleString("en-IN")} received via ${bill.method}!`, "success");
      }, 1000);
    }, 1500);
  };

  const handleDownloadPDF = (bill) => {
    const doc = new jsPDF();
    
    // Header Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 142, 247);
    doc.text("BillFlow", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Recurring Revenue Platform", 14, 25);
    doc.text("Email: support@billflow.com", 14, 30);
    
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("INVOICE", 140, 20);
    
    doc.setFontSize(10);
    doc.text(`Invoice No: ${bill.id}`, 140, 26);
    doc.text(`Date: ${bill.billing_date}`, 140, 31);
    doc.text(`Status: ${bill.status}`, 140, 36);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 42, 196, 42);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Billed To:", 14, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Customer Name: ${bill.customer_name}`, 14, 58);
    doc.text(`Payment Method: ${bill.method}`, 14, 63);
    
    doc.setFont("helvetica", "bold");
    doc.text("Description", 14, 78);
    doc.text("Plan", 80, 78);
    doc.text("Amount", 160, 78);
    
    doc.line(14, 82, 196, 82);
    
    doc.setFont("helvetica", "normal");
    doc.text("Recurring Subscription Fee", 14, 90);
    doc.text(bill.plan_name, 80, 90);
    doc.text(`INR ${bill.amount.toLocaleString("en-IN")}.00`, 160, 90);
    
    doc.line(14, 96, 196, 96);
    
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 120, 106);
    doc.text(`INR ${bill.amount.toLocaleString("en-IN")}.00`, 160, 106);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business with BillFlow!", 14, 130);
    
    doc.save(`invoice_${bill.id}.pdf`);
    showToast(`Downloaded invoice PDF for ${bill.id}`);
  };

  const exportCSV = () => {
    const headers = ["Invoice ID", "Customer Name", "Plan Name", "Amount", "Billing Date", "Method", "Status"];
    const rows = filtered.map(b => [
      b.id,
      b.customer_name,
      b.plan_name,
      b.amount,
      b.billing_date,
      b.method,
      b.status,
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Invoices CSV downloaded successfully");
  };

  const filtered = bills.filter(b =>
    (filterStatus === "All" || b.status === filterStatus) &&
    (b.customer_name.toLowerCase().includes(search.toLowerCase()) || b.plan_name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPaid = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
  const totalPending = bills.filter(b => b.status === "Pending").reduce((s, b) => s + b.amount, 0);

  return (
    <MainLayout>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          padding: "14px 20px", borderRadius: 14, backdropFilter: "blur(20px)",
          background: toast.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
          color: toast.type === "success" ? "#10b981" : "#ef4444",
          fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeInUp 0.3s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Mock Payment Simulation Overlay */}
      {payingBill && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
          <div style={{ padding: 40, background: "var(--bg-secondary)", borderRadius: 24, border: "1px solid var(--border-glass)", textAlign: "center", width: "100%", maxWidth: 400, boxShadow: "var(--shadow-glass)" }}>
            {!paymentSuccess ? (
              <>
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid rgba(99, 102, 241, 0.2)", borderTopColor: "#6366f1", animation: "spin 1s linear infinite", margin: "0 auto 24px" }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Simulating Secure Payment</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>Processing ₹{payingBill.amount} via mock gateway ({payingBill.method})</p>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>This is a safe sandbox environment.</div>
              </>
            ) : (
              <>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#10b981" }}>
                  <CheckCircleIcon style={{ fontSize: 36 }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Payment Approved!</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Invoice updated to Paid status.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>Billing Management</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage invoices, payments and billing records</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={exportCSV}
            style={{
              padding: "10px 22px", borderRadius: 12, background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-glass)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-primary)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <DownloadIcon style={{ fontSize: 18 }} />
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ customer_name: "", plan_name: "", amount: "", billing_date: "", status: "Pending", method: "UPI" });
              setOpen(true);
            }}
            style={{
              padding: "10px 22px", borderRadius: 12, background: "linear-gradient(135deg,#4f8ef7,#8b5cf6)",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-primary)",
              boxShadow: "0 4px 20px rgba(79,142,247,0.4)", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(79,142,247,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(79,142,247,0.4)"; }}
          >
            <ReceiptLongIcon style={{ fontSize: 18 }} />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: `₹${(totalPaid + totalPending).toLocaleString("en-IN")}`, sub: "All invoices", gradient: "linear-gradient(135deg,#4f8ef7,#2563eb)", icon: <ReceiptLongIcon /> },
          { label: "Collected", value: `₹${totalPaid.toLocaleString("en-IN")}`, sub: `${bills.filter(b => b.status === "Paid").length} paid invoices`, gradient: "linear-gradient(135deg,#10b981,#059669)", icon: <PaidIcon /> },
          { label: "Pending", value: `₹${totalPending.toLocaleString("en-IN")}`, sub: `${bills.filter(b => b.status === "Pending").length} awaiting payment`, gradient: "linear-gradient(135deg,#f59e0b,#d97706)", icon: <PendingIcon /> },
        ].map((c, i) => (
          <GlassCard key={i} style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: c.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, flexShrink: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{c.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.sub}</div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: c.gradient, borderRadius: "100px 100px 0 0", opacity: 0.7 }} />
          </GlassCard>
        ))}
      </div>

      {/* Table */}
      <GlassCard>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-glass)", borderRadius: 12, padding: "8px 14px" }}>
            <SearchIcon style={{ color: "var(--text-muted)", fontSize: 18 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices, customers, plans..."
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-primary)", width: "100%", outline: "none" }} />
          </div>
          {["All", "Paid", "Pending", "Failed"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: "8px 16px", borderRadius: 10, fontFamily: "var(--font-primary)", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              background: filterStatus === s ? statusCfg[s]?.bg || "rgba(79,142,247,0.15)" : "var(--bg-card)",
              border: filterStatus === s ? `1px solid ${statusCfg[s]?.border || "rgba(79,142,247,0.3)"}` : "1px solid var(--border-glass)",
              color: filterStatus === s ? statusCfg[s]?.color || "#4f8ef7" : "var(--text-secondary)",
            }}>{s}</button>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Invoice", "Customer", "Plan", "Amount", "Date", "Method", "Status", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0 14px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase", borderBottom: "1px solid var(--border-glass)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((bill, i) => {
                const sc = statusCfg[bill.status] || statusCfg.Pending;
                const mc = methodColor[bill.method] || "#8b9dc3";
                return (
                  <tr key={i} style={{ transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 10, background: planGradients[i % 4], fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.3px" }}>INV</div>
                      <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{bill.id}</span>
                    </td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)", fontSize: 13, color: "var(--text-secondary)" }}>{bill.customer_name}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 8, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#8b5cf6", fontSize: 11, fontWeight: 600 }}>{bill.plan_name}</span>
                    </td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>₹{bill.amount.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)", fontSize: 12, color: "var(--text-muted)" }}>{bill.billing_date}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 8, background: `${mc}15`, border: `1px solid ${mc}30`, color: mc, fontSize: 11, fontWeight: 600 }}>{bill.method}</span>
                    </td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontSize: 11, fontWeight: 600 }}>
                        {sc.icon}{bill.status}
                      </div>
                    </td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {/* Mock Payment Action (Only for Pending) */}
                        {bill.status === "Pending" && (
                          <button onClick={() => triggerMockPayment(bill)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#f59e0b", transition: "all 0.15s" }}
                            title="Mock Payment Trigger"
                            onMouseEnter={e => { e.currentTarget.style.background = `rgba(245,158,11,0.25)`; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.15)"; }}>
                            <CreditCardIcon style={{ fontSize: 14 }} />
                          </button>
                        )}
                        
                        {/* Edit Button */}
                        <button onClick={() => startEdit(bill)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4f8ef7", transition: "all 0.15s" }}
                          title="Edit Invoice"
                          onMouseEnter={e => { e.currentTarget.style.background = `rgba(79,142,247,0.25)`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(79,142,247,0.15)"; }}>
                          <EditIcon style={{ fontSize: 14 }} />
                        </button>
                        
                        {/* Download PDF Button */}
                        <button onClick={() => handleDownloadPDF(bill)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#10b981", transition: "all 0.15s" }}
                          title="Download PDF"
                          onMouseEnter={e => { e.currentTarget.style.background = `rgba(16,185,129,0.25)`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}>
                          <DownloadIcon style={{ fontSize: 14 }} />
                        </button>
                        
                        {/* Delete Button */}
                        <button onClick={() => handleDelete(bill.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444", transition: "all 0.15s" }}
                          title="Delete Invoice"
                          onMouseEnter={e => { e.currentTarget.style.background = `rgba(239,68,68,0.25)`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}>
                          <DeleteOutlineIcon style={{ fontSize: 14 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 14 }}>No invoices found</div>
          )}
        </div>
      </GlassCard>

      {/* Modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{editingId ? "Edit Invoice" : "Generate Invoice"}</h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{editingId ? `Modifying invoice ${editingId}` : "Fill in the details below"}</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}>
                <CloseIcon style={{ fontSize: 18 }} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <InputField label="Customer Name *" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} />
              <InputField label="Plan Name *" value={form.plan_name} onChange={e => setForm({ ...form, plan_name: e.target.value })} />
              <InputField label="Amount (₹) *" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              <InputField label="Billing Date" type="date" value={form.billing_date} onChange={e => setForm({ ...form, billing_date: e.target.value })} />
              <InputField label="Payment Method" select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
              </InputField>
              <InputField label="Status" select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </InputField>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setOpen(false)} style={{ flex: 1, padding: "11px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-primary)" }}>
                Cancel
              </button>
              <button onClick={saveBill} style={{ flex: 2, padding: "11px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-primary)", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                {editingId ? "Save Changes" : "Generate Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp { 
          from { opacity:0;transform:translateY(16px); } 
          to { opacity:1;transform:translateY(0); } 
        }
      `}</style>
    </MainLayout>
  );
}