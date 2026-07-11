import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Snackbar,
  Alert,
} from "@mui/material";

import {
  getSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
} from "../services/subscriptionService";
import { getCustomers } from "../services/customerService";
import { getPlans } from "../services/planService";
import api from "../services/api";

// ── Status configuration ───────────────────────────────────────────────────
const statusCfg = {
  trial:    { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  icon: <HourglassEmptyIcon style={{ fontSize: 13 }} />,  label: "Trial"    },
  active:   { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", icon: <CheckCircleIcon   style={{ fontSize: 13 }} />,  label: "Active"   },
  past_due: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",  icon: <WarningAmberIcon  style={{ fontSize: 13 }} />,  label: "Past Due" },
  cancelled:{ color: "#6b7280", bg: "rgba(107,114,128,0.12)",border: "rgba(107,114,128,0.3)",icon: <CancelIcon        style={{ fontSize: 13 }} />,  label: "Cancelled"},
  // Legacy fallback variants
  Active:    { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", icon: <CheckCircleIcon style={{ fontSize: 13 }} />, label: "Active" },
  Expired:   { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",  icon: <WarningAmberIcon style={{ fontSize: 13 }} />, label: "Expired" },
  Cancelled: { color: "#6b7280", bg: "rgba(107,114,128,0.12)",border: "rgba(107,114,128,0.3)",icon: <CancelIcon style={{ fontSize: 13 }} />, label: "Cancelled" },
};

// ── State machine: which next statuses are valid from the current one ───────
const TRANSITIONS = {
  trial:     ["active", "cancelled"],
  active:    ["past_due", "cancelled"],
  past_due:  ["active", "cancelled"],
  cancelled: [],          // terminal
  // legacy
  Active:    ["past_due", "cancelled"],
  Expired:   ["active",   "cancelled"],
  Cancelled: [],
};

const StatusBadge = ({ status }) => {
  const cfg = statusCfg[status] || statusCfg.active;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
    }}>
      {cfg.icon} {cfg.label || status}
    </span>
  );
};

const GlassCard = ({ children, style = {} }) => (
  <div style={{
    background: "var(--bg-card)", backdropFilter: "blur(20px)",
    border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, ...style,
  }}>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, children, select, type = "text" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px" }}>{label}</label>
    {select ? (
      <select value={value} onChange={onChange} style={{
        background: "var(--bg-card)", border: "1px solid var(--border-glass)",
        borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13,
        fontFamily: "Inter,sans-serif", outline: "none", cursor: "pointer",
      }}>{children}</select>
    ) : (
      <input type={type} value={value} onChange={onChange} style={{
        background: "var(--bg-card)", border: "1px solid var(--border-glass)",
        borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13,
        fontFamily: "Inter,sans-serif", outline: "none",
      }} />
    )}
  </div>
);

// ── Modal overlay ──────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, maxWidth = 500 }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1300,
    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      width: "100%", maxWidth, margin: 16,
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-glass)", borderRadius: 20,
      boxShadow: "var(--shadow-glass)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px", borderBottom: "1px solid var(--border-glass)",
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{
          background: "var(--bg-card)", border: "1px solid var(--border-glass)",
          borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "var(--text-muted)",
          display: "flex", alignItems: "center",
        }}><CloseIcon style={{ fontSize: 16 }} /></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
export default function Subscriptions() {
  const location = useLocation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers]         = useState([]);
  const [plans, setPlans]                 = useState([]);
  const [search, setSearch]               = useState("");
  const [open, setOpen]                   = useState(false);
  const [statusModal, setStatusModal]     = useState(null); // { sub, nextStatuses }
  const [newStatus, setNewStatus]         = useState("");
  const [snackbar, setSnackbar]           = useState({ open: false, message: "", severity: "success" });
  const [editTarget, setEditTarget]       = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);

  const [form, setForm] = useState({ customer_id: "", plan_id: "", start_date: "", end_date: "" });

  useEffect(() => {
    loadData();
    if (location.state?.openDialog) {
      setOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const mockSubscriptions = [
    { id: 1, customer_id: 1, customer_name: "Vyshnavi K", plan_id: 1, plan_name: "Premium", start_date: "2026-06-01", end_date: "2026-12-01", status: "active" },
    { id: 2, customer_id: 2, customer_name: "Aditya Sharma", plan_id: 2, plan_name: "Standard", start_date: "2026-05-15", end_date: "2026-11-15", status: "trial" },
    { id: 3, customer_id: 3, customer_name: "Priya Nair", plan_id: 3, plan_name: "Basic", start_date: "2026-04-01", end_date: "2026-10-01", status: "past_due" },
    { id: 4, customer_id: 4, customer_name: "Rahul Mehta", plan_id: 4, plan_name: "Enterprise", start_date: "2026-01-01", end_date: "2026-07-01", status: "cancelled" },
    { id: 5, customer_id: 5, customer_name: "Sneha Patel", plan_id: 1, plan_name: "Premium", start_date: "2026-06-10", end_date: "2026-12-10", status: "active" },
  ];
  const mockCustomers = [
    { id: 1, name: "Vyshnavi K", email: "vyshnavi@example.com" },
    { id: 2, name: "Aditya Sharma", email: "aditya@example.com" },
    { id: 3, name: "Priya Nair", email: "priya@example.com" },
    { id: 4, name: "Rahul Mehta", email: "rahul@example.com" },
    { id: 5, name: "Sneha Patel", email: "sneha@example.com" },
  ];
  const mockPlans = [
    { id: 1, plan_name: "Basic" }, { id: 2, plan_name: "Standard" },
    { id: 3, plan_name: "Premium" }, { id: 4, plan_name: "Enterprise" },
  ];

  const loadData = async () => {
    try {
      const [subs, cust, plns] = await Promise.all([
        getSubscriptions(), getCustomers(), getPlans(),
      ]);
      setSubscriptions(subs);
      setCustomers(cust);
      setPlans(plns);
    } catch (err) {
      console.warn("Backend offline — using mock data", err);
      setSubscriptions(mockSubscriptions);
      setCustomers(mockCustomers);
      setPlans(mockPlans);
    }
  };


  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const saveSubscription = async () => {
    try {
      const payload = {
        customer_id: Number(form.customer_id),
        plan_id:     Number(form.plan_id),
        start_date:  form.start_date,
        end_date:    form.end_date,
      };
      if (editTarget) {
        await updateSubscription(editTarget.id, payload);
        showSnackbar("Subscription Updated Successfully");
        setEditTarget(null);
      } else {
        await addSubscription(payload);
        showSnackbar("Subscription Created Successfully");
        setOpen(false);
      }
      setForm({ customer_id: "", plan_id: "", start_date: "", end_date: "" });
      loadData();
    } catch (err) {
      console.error(err);
      showSnackbar(editTarget ? "Failed to Update Subscription" : "Failed to Create Subscription", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubscription(deleteTarget.id);
      showSnackbar("Subscription Deleted Successfully");
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to Delete Subscription", "error");
    }
  };

  const openEdit = (sub) => {
    setForm({
      customer_id: sub.customer_id?.toString() || "",
      plan_id: sub.plan_id?.toString() || "",
      start_date: sub.start_date ? sub.start_date.slice(0, 10) : "",
      end_date: sub.end_date ? sub.end_date.slice(0, 10) : "",
    });
    setEditTarget(sub);
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer Name", "Plan Name", "Start Date", "End Date", "Status"];
    const rows = filtered.map(sub => [
      sub.id,
      sub.customer_name || `Customer #${sub.customer_id}`,
      sub.plan_name || `Plan #${sub.plan_id}`,
      sub.start_date || "",
      sub.end_date || "",
      sub.status || "active",
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSnackbar("CSV Export downloaded successfully");
  };

  // Open the status-change modal for a given subscription
  const openStatusModal = (sub) => {
    const current = sub.status || "active";
    const allowed = TRANSITIONS[current] || [];
    setNewStatus(allowed[0] || "");
    setStatusModal({ sub, nextStatuses: allowed });
  };

  // Call the backend state-machine endpoint and optimistically update UI
  const applyStatusChange = async () => {
    if (!newStatus || !statusModal) return;
    const { sub } = statusModal;
    try {
      await api.put(`/subscriptions/${sub.id}/status`, { status: newStatus });
      setSubscriptions(prev =>
        prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s)
      );
      showSnackbar(`Status changed to "${statusCfg[newStatus]?.label || newStatus}"`);
    } catch (err) {
      const detail = err?.response?.data?.detail || "Invalid status transition";
      showSnackbar(detail, "error");
    } finally {
      setStatusModal(null);
    }
  };

  const filtered = subscriptions.filter(s =>
    s.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.plan_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <style>{`
        .sub-row:hover { background: rgba(79,142,247,0.04) !important; }
        .sub-row { transition: background 0.15s; }
        .action-btn { transition: opacity 0.15s, background 0.15s; }
        .action-btn:hover { opacity: 0.8; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>
            Subscription Management
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage customer subscriptions and lifecycle status transitions</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={exportCSV}
            style={{
              padding: "10px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13,
              background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-secondary)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              fontFamily: "Inter,sans-serif",
            }}
          >
            <DownloadIcon style={{ fontSize: 18 }} /> Export CSV
          </button>
          <button
            id="btn-add-subscription"
            onClick={() => {
              setEditTarget(null);
              setForm({ customer_id: "", plan_id: "", start_date: "", end_date: "" });
              setOpen(true);
            }}
            style={{
              padding: "10px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)", fontFamily: "Inter,sans-serif",
            }}
          >
            <AddIcon style={{ fontSize: 18 }} /> Add Subscription
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total",     value: subscriptions.length,                                       color: "var(--accent)" },
          { label: "Active",    value: subscriptions.filter(s => ["active","Active"].includes(s.status)).length,    color: "#10b981" },
          { label: "Trial",     value: subscriptions.filter(s => s.status === "trial").length,     color: "#f59e0b" },
          { label: "Past Due",  value: subscriptions.filter(s => s.status === "past_due").length,  color: "#ef4444" },
        ].map(({ label, value, color }) => (
          <GlassCard key={label} style={{ padding: "16px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
          </GlassCard>
        ))}
      </div>

      {/* ── Table Card ── */}
      <GlassCard style={{ padding: 0, overflow: "hidden" }}>
        {/* Search bar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-glass)", display: "flex", alignItems: "center", gap: 10 }}>
          <SearchIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
          <input
            placeholder="Search by customer or plan…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-primary)", fontSize: 14, fontFamily: "Inter,sans-serif",
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "Customer", "Plan", "Start Date", "End Date", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 18px", fontSize: 11, fontWeight: 700,
                    color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase",
                    borderBottom: "1px solid var(--border-glass)",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 14 }}>
                    No subscriptions found
                  </td>
                </tr>
              ) : filtered.map(sub => (
                <tr key={sub.id} className="sub-row" style={{ borderBottom: "1px solid var(--border-glass)" }}>
                  <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: 12, fontWeight: 600 }}>#{sub.id}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <PersonIcon style={{ fontSize: 15, color: "#fff" }} />
                      </div>
                      <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 13 }}>
                        {sub.customer_name || `Customer #${sub.customer_id}`}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--text-secondary)", fontSize: 13 }}>
                    {sub.plan_name || `Plan #${sub.plan_id}`}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 12 }}>
                      <CalendarMonthIcon style={{ fontSize: 14 }} />
                      {sub.start_date ? sub.start_date.slice(0, 10) : "—"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 12 }}>
                      <CalendarMonthIcon style={{ fontSize: 14 }} />
                      {sub.end_date ? sub.end_date.slice(0, 10) : "—"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <StatusBadge status={sub.status} />
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {(TRANSITIONS[sub.status] || []).length > 0 ? (
                        <button
                          className="action-btn"
                          onClick={() => openStatusModal(sub)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                            background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                            color: "#6366f1", cursor: "pointer", fontFamily: "Inter,sans-serif",
                          }}
                        >
                          <SyncAltIcon style={{ fontSize: 13 }} /> Status
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 4 }}>—</span>
                      )}
                      
                      {/* Edit Button */}
                      <button onClick={() => openEdit(sub)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#10b981", transition: "all 0.15s" }}
                        title="Edit Subscription">
                        <EditIcon style={{ fontSize: 14 }} />
                      </button>

                      {/* Delete Button */}
                      <button onClick={() => setDeleteTarget(sub)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444", transition: "all 0.15s" }}
                        title="Delete Subscription">
                        <DeleteIcon style={{ fontSize: 14 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ── Add / Edit Subscription Modal ── */}
      {(open || editTarget) && (
        <Modal title={editTarget ? "Edit Subscription" : "Add New Subscription"} onClose={() => { setOpen(false); setEditTarget(null); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField label="Customer" value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} select>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </InputField>
            <InputField label="Plan" value={form.plan_id} onChange={e => setForm({ ...form, plan_id: e.target.value })} select>
              <option value="">Select Plan</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.plan_name || p.name}</option>)}
            </InputField>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <InputField label="Start Date" type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              <InputField label="End Date"   type="date" value={form.end_date}   onChange={e => setForm({ ...form, end_date:   e.target.value })} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button onClick={() => { setOpen(false); setEditTarget(null); }} style={{
                padding: "9px 18px", borderRadius: 10, background: "var(--bg-card)",
                border: "1px solid var(--border-glass)", color: "var(--text-muted)", cursor: "pointer",
                fontWeight: 600, fontSize: 13, fontFamily: "Inter,sans-serif",
              }}>Cancel</button>
              <button onClick={saveSubscription} style={{
                padding: "9px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff",
                cursor: "pointer", fontFamily: "Inter,sans-serif",
              }}>{editTarget ? "Save Changes" : "Save Subscription"}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <Modal title="Confirm Delete" onClose={() => setDeleteTarget(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
              <DeleteIcon style={{ fontSize: 28 }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Delete Subscription?</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>Are you sure you want to delete the subscription for {deleteTarget.customer_name || `Customer #${deleteTarget.customer_id}`}? This action is permanent.</div>
            </div>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "Inter,sans-serif" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 13, background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Change Status Modal ── */}
      {statusModal && (
        <Modal title="Change Subscription Status" onClose={() => setStatusModal(null)} maxWidth={420}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
              Current status of <strong style={{ color: "var(--text-primary)" }}>{statusModal.sub.customer_name}</strong>:
            </p>
            <StatusBadge status={statusModal.sub.status} />

            {statusModal.nextStatuses.length === 0 ? (
              <div style={{
                padding: "16px", borderRadius: 12, background: "rgba(107,114,128,0.1)",
                border: "1px solid var(--border-glass)", color: "var(--text-muted)", fontSize: 13,
              }}>
                This subscription is in a terminal state and cannot be changed.
              </div>
            ) : (
              <>
                <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>Select the new status:</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {statusModal.nextStatuses.map(s => {
                    const cfg = statusCfg[s] || {};
                    return (
                      <button
                        key={s}
                        onClick={() => setNewStatus(s)}
                        style={{
                          padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                          cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6,
                          background: newStatus === s ? cfg.bg : "var(--bg-card)",
                          border: `1px solid ${newStatus === s ? cfg.border : "var(--border-glass)"}`,
                          color: newStatus === s ? cfg.color : "var(--text-muted)",
                          transition: "all 0.15s",
                        }}
                      >
                        {cfg.icon} {cfg.label || s}
                      </button>
                    );
                  })}
                </div>

                {/* Info blurb */}
                <div style={{
                  padding: "12px 16px", borderRadius: 12,
                  background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)",
                  fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6,
                }}>
                  <strong style={{ color: "#6366f1" }}>State machine rules:</strong><br />
                  trial → active / cancelled<br />
                  active → past_due / cancelled<br />
                  past_due → active / cancelled<br />
                  cancelled → <em>(terminal)</em>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
                  <button onClick={() => setStatusModal(null)} style={{
                    padding: "9px 18px", borderRadius: 10, background: "var(--bg-card)",
                    border: "1px solid var(--border-glass)", color: "var(--text-muted)", cursor: "pointer",
                    fontWeight: 600, fontSize: 13, fontFamily: "Inter,sans-serif",
                  }}>Cancel</button>
                  <button
                    onClick={applyStatusChange}
                    disabled={!newStatus}
                    style={{
                      padding: "9px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                      background: newStatus ? (statusCfg[newStatus]?.color ? `linear-gradient(135deg,${statusCfg[newStatus].color},${statusCfg[newStatus].border})` : "linear-gradient(135deg,#6366f1,#8b5cf6)") : "var(--bg-card)",
                      border: "none", color: newStatus ? "#fff" : "var(--text-muted)",
                      cursor: newStatus ? "pointer" : "not-allowed", fontFamily: "Inter,sans-serif",
                    }}
                  >
                    Apply Change
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* ── Snackbar ── */}
      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
}