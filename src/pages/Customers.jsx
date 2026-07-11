import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Snackbar, Alert } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BlockIcon from "@mui/icons-material/Block";
import PersonIcon from "@mui/icons-material/Person";
import DownloadIcon from "@mui/icons-material/Download";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/CustomerService";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#4f8ef7,#8b5cf6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#14b8a6,#4f8ef7)",
];

const initials = (name = "") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const avatarGrad = (id) => AVATAR_GRADIENTS[(id || 0) % AVATAR_GRADIENTS.length];

const GlassCard = ({ children, style = {} }) => (
  <div style={{
    background: "var(--bg-card)", backdropFilter: "blur(20px)",
    border: "1px solid var(--border-glass)", borderRadius: 20,
    padding: 24, ...style,
  }}>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px" }}>{label}</label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border-glass)",
        borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13,
        fontFamily: "Inter,sans-serif", outline: "none",
      }}
    />
  </div>
);

const Modal = ({ title, subtitle, onClose, children, maxWidth = 520 }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 1300,
    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      width: "100%", maxWidth, margin: 16,
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-glass)", borderRadius: 24,
      boxShadow: "var(--shadow-glass)",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        padding: "22px 28px", borderBottom: "1px solid var(--border-glass)",
      }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{subtitle}</p>}
        </div>
        <button onClick={onClose} style={{
          background: "var(--bg-card)", border: "1px solid var(--border-glass)",
          borderRadius: 9, padding: "5px 8px", cursor: "pointer", color: "var(--text-muted)",
          display: "flex", alignItems: "center",
        }}><CloseIcon style={{ fontSize: 16 }} /></button>
      </div>
      <div style={{ padding: "24px 28px" }}>{children}</div>
    </div>
  </div>
);

export default function Customers() {
  const location = useLocation();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [addOpen, setAddOpen]         = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [viewTarget, setViewTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnack = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  useEffect(() => {
    loadCustomers();
    if (location.state?.openDialog) {
      openAdd();
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      showSnack("Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ name: "", email: "", phone: "", company: "" });
    setAddOpen(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company });
    setEditTarget(c);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) { showSnack("Name and Email are required", "error"); return; }
    setSaving(true);
    try {
      if (editTarget) {
        await updateCustomer(editTarget.id, form);
        showSnack("Customer updated successfully");
        setEditTarget(null);
      } else {
        await addCustomer(form);
        showSnack("Customer added successfully");
        setAddOpen(false);
      }
      loadCustomers();
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
        alert(JSON.stringify(err.response.data));
      } else {
        alert(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCustomer(deleteTarget.id);
      showSnack(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      loadCustomers();
    } catch {
      showSnack("Delete failed", "error");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status"];
    const rows = filtered.map(c => [
      c.id,
      c.name,
      c.email || "",
      c.phone || "",
      c.company || "",
      c.status || "Active",
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSnack("Customers CSV downloaded successfully");
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const activeCount   = customers.filter(c => c.status === "Active" || !c.status).length;
  const inactiveCount = customers.filter(c => c.status && c.status !== "Active").length;

  return (
    <MainLayout>
      <style>{`
        .cust-row:hover { background: rgba(79,142,247,0.04) !important; }
        .cust-row { transition: background 0.15s; }
        .icon-btn { display:flex;align-items:center;justify-content:center;border-radius:9px;cursor:pointer;transition:opacity 0.15s,transform 0.15s; }
        .icon-btn:hover { opacity:0.75;transform:scale(1.1); }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>Customer Management</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{customers.length} total customers · manage accounts and details</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={exportCSV} style={{
            padding: "10px 22px", borderRadius: 12, fontWeight: 700, fontSize: 13,
            background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-secondary)",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            fontFamily: "Inter,sans-serif",
          }}>
            <DownloadIcon style={{ fontSize: 18 }} /> Export CSV
          </button>
          <button id="btn-add-customer" onClick={openAdd} style={{
            padding: "10px 22px", borderRadius: 12, fontWeight: 700, fontSize: 13,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)", fontFamily: "Inter,sans-serif",
          }}>
            <AddIcon style={{ fontSize: 18 }} /> Add Customer
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total Customers", value: customers.length,  icon: <PeopleIcon />,      gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
          { label: "Active",          value: activeCount,        icon: <CheckCircleIcon />, gradient: "linear-gradient(135deg,#10b981,#059669)" },
          { label: "Inactive",        value: inactiveCount,      icon: <BlockIcon />,       gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
          { label: "New This Month",  value: Math.min(customers.length, 3), icon: <TrendingUpIcon />, gradient: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
        ].map(({ label, value, icon, gradient }) => (
          <GlassCard key={label} style={{ padding: "18px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: gradient, opacity: 0.1, filter: "blur(16px)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22 }}>
                {icon}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Table */}
      <GlassCard style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-glass)", display: "flex", alignItems: "center", gap: 10 }}>
          <SearchIcon style={{ color: "var(--text-muted)", fontSize: 20 }} />
          <input
            placeholder="Search by name, email, company or phone…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 14, fontFamily: "Inter,sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
              <CloseIcon style={{ fontSize: 16 }} />
            </button>
          )}
          <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Customer", "Email", "Phone", "Company", "Status", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase", borderBottom: "1px solid var(--border-glass)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "56px 0", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1", animation: "spin 1s linear infinite" }} />
                    Loading customers…
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "56px 0" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PeopleIcon style={{ fontSize: 28, color: "var(--text-muted)" }} />
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 600 }}>No customers found</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{search ? `No results for "${search}"` : "Click 'Add Customer' to get started"}</div>
                    {!search && (
                      <button onClick={openAdd} style={{ padding: "8px 18px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif", marginTop: 8 }}>
                        Add First Customer
                      </button>
                    )}
                  </div>
                </td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="cust-row" style={{ borderBottom: "1px solid var(--border-glass)" }}>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarGrad(c.id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>{initials(c.name)}</div>
                      <div>
                        <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: 11 }}>ID #{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <EmailIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.email || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <PhoneIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.phone || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <BusinessIcon style={{ fontSize: 13, color: "var(--text-muted)" }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.company || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    {c.status === "Inactive" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} /> Inactive
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} /> Active
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="icon-btn" title="View Details" onClick={() => setViewTarget(c)} style={{ width: 32, height: 32, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}><VisibilityIcon style={{ fontSize: 15 }} /></button>
                      <button className="icon-btn" title="Edit Customer" onClick={() => openEdit(c)} style={{ width: 32, height: 32, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366f1" }}><EditIcon style={{ fontSize: 15 }} /></button>
                      <button className="icon-btn" title="Delete Customer" onClick={() => setDeleteTarget(c)} style={{ width: 32, height: 32, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}><DeleteIcon style={{ fontSize: 15 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ADD MODAL */}
      {addOpen && (
        <Modal title="Add New Customer" subtitle="Fill in the details to create a new customer account" onClose={() => setAddOpen(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" />
              <InputField label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. rahul@company.com" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              <InputField label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Infosys Ltd." />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button onClick={() => setAddOpen(false)} style={{ padding: "9px 20px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "Inter,sans-serif" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "9px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Add Customer"}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editTarget && (
        <Modal title={`Edit — ${editTarget.name}`} subtitle="Update customer information below" onClose={() => setEditTarget(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <InputField label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <InputField label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button onClick={() => setEditTarget(null)} style={{ padding: "9px 20px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "Inter,sans-serif" }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "9px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewTarget && (
        <Modal title="Customer Details" subtitle={`Full profile for ${viewTarget.name}`} onClose={() => setViewTarget(null)} maxWidth={480}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: avatarGrad(viewTarget.id), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>{initials(viewTarget.name)}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{viewTarget.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>Customer ID #{viewTarget.id}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", marginTop: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  {viewTarget.status || "Active"}
                </span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: <EmailIcon style={{ fontSize: 16 }} />, label: "Email", value: viewTarget.email },
                { icon: <PhoneIcon style={{ fontSize: 16 }} />, label: "Phone", value: viewTarget.phone },
                { icon: <BusinessIcon style={{ fontSize: 16 }} />, label: "Company", value: viewTarget.company },
                { icon: <PersonIcon style={{ fontSize: 16 }} />, label: "Customer Since", value: viewTarget.created_at ? new Date(viewTarget.created_at).toLocaleDateString("en-IN") : "—" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 6 }}>
                    {icon}<span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{value || "—"}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setViewTarget(null); openEdit(viewTarget); }} style={{ flex: 1, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 13, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <EditIcon style={{ fontSize: 15 }} /> Edit Customer
              </button>
              <button onClick={() => { setViewTarget(null); setDeleteTarget(viewTarget); }} style={{ padding: "10px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", cursor: "pointer", fontFamily: "Inter,sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                <DeleteIcon style={{ fontSize: 15 }} />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <Modal title="Confirm Delete" onClose={() => setDeleteTarget(null)} maxWidth={400}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
              <DeleteIcon style={{ fontSize: 28 }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Delete "{deleteTarget.name}"?</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>This action cannot be undone. All associated data including subscriptions and invoices may be affected.</div>
            </div>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "Inter,sans-serif" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex: 1, padding: "10px", borderRadius: 10, fontWeight: 700, fontSize: 13, background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3500} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
}
