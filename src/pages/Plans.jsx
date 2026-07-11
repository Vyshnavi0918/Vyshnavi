import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import DiamondIcon from "@mui/icons-material/Diamond";
import BusinessIcon from "@mui/icons-material/Business";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import SecurityIcon from "@mui/icons-material/Security";

const GlassCard = ({ children, style = {} }) => (
  <div style={{ background: "var(--bg-card)", backdropFilter: "blur(20px)", border: "1px solid var(--border-glass)", borderRadius: 20, padding: 24, ...style }}>
    {children}
  </div>
);

const planIcons = { Basic: <StarIcon />, Standard: <FlashOnIcon />, Premium: <DiamondIcon />, Enterprise: <BusinessIcon /> };
const planGradients = {
  Basic: "linear-gradient(135deg,#4f8ef7,#2563eb)",
  Standard: "linear-gradient(135deg,#10b981,#059669)",
  Premium: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  Enterprise: "linear-gradient(135deg,#f59e0b,#d97706)",
};

const defaultPlans = [
  { id: 1, plan_name: "Basic", price: 499, billing_cycle: "Monthly", description: "Up to 5 users · 10GB Storage · Email Support", status: "Active", features: ["5 Users", "10 GB Storage", "Email Support", "Basic Analytics"] },
  { id: 2, plan_name: "Standard", price: 1499, billing_cycle: "Monthly", description: "Up to 20 users · 50GB Storage · Priority Support", status: "Active", features: ["20 Users", "50 GB Storage", "Priority Support", "Advanced Analytics", "API Access"] },
  { id: 3, plan_name: "Premium", price: 2999, billing_cycle: "Monthly", description: "Up to 100 users · 200GB Storage · 24/7 Support", status: "Active", features: ["100 Users", "200 GB Storage", "24/7 Support", "Full Analytics", "API Access", "Custom Integrations"] },
  { id: 4, plan_name: "Enterprise", price: 9999, billing_cycle: "Yearly", description: "Unlimited users · Unlimited Storage · Dedicated Manager", status: "Active", features: ["Unlimited Users", "Unlimited Storage", "Dedicated Manager", "Custom Reports", "SLA Guarantee", "On-premise Option", "White Label"] },
];

const InputField = ({ label, type = "text", value, onChange, children, select, textarea }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.5px" }}>{label}</label>
    {select ? (
      <select value={value} onChange={onChange} style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, fontFamily: "Inter,sans-serif", outline: "none" }}>{children}</select>
    ) : textarea ? (
      <textarea value={value} onChange={onChange} rows={3} style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, fontFamily: "Inter,sans-serif", outline: "none", resize: "vertical" }} />
    ) : (
      <input type={type} value={value} onChange={onChange} style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, fontFamily: "Inter,sans-serif", outline: "none" }} />
    )}
  </div>
);

export default function Plans() {
  const [plans, setPlans] = useState(defaultPlans);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState("cards");
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ plan_name: "", price: "", billing_cycle: "Monthly", description: "" });

  // Custom User Subscriptions State: 'active' | 'cancelled' | 'inactive'
  const [userSubs, setUserSubs] = useState({
    1: "active",
    2: "cancelled",
    3: "inactive",
    4: "inactive"
  });

  // Mock Payment Flow States
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentType, setPaymentType] = useState(""); // "subscribe" | "renew" | "reactivate"
  const [openCheckout, setOpenCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("input"); // "input" | "processing" | "success"
  const [processingMsg, setProcessingMsg] = useState("");
  
  // Card Inputs
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  
  const savePlan = () => {
    if (!form.plan_name || !form.price) { showToast("Please fill required fields", "error"); return; }
    const newId = plans.length + 1;
    setPlans([...plans, { ...form, id: newId, price: Number(form.price), status: "Active", features: [form.description] }]);
    setUserSubs({ ...userSubs, [newId]: "inactive" });
    setOpen(false);
    setForm({ plan_name: "", price: "", billing_cycle: "Monthly", description: "" });
    showToast("Plan Added Successfully!");
  };

  const deletePlan = (id) => { setPlans(plans.filter(p => p.id !== id)); showToast("Plan deleted"); };

  const handleCheckoutClick = (plan, type) => {
    setSelectedPlan(plan);
    setPaymentType(type);
    setCheckoutStep("input");
    setCardHolder("Vyshnavi K");
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/29");
    setCardCvv("123");
    setOpenCheckout(true);
  };

  const runMockPayment = () => {
    if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
      showToast("Please fill all mock card fields", "error");
      return;
    }

    setCheckoutStep("processing");
    
    // Fintech simulation workflow
    setProcessingMsg("Securing connection with Sandbox node...");
    setTimeout(() => {
      setProcessingMsg("Authorizing mock card credentials...");
      setTimeout(() => {
        setProcessingMsg("Syncing transaction with Billing database node...");
        setTimeout(() => {
          // Success update
          setUserSubs({ ...userSubs, [selectedPlan.id]: "active" });
          setCheckoutStep("success");
          showToast(`Mock payment successful for ${selectedPlan.plan_name}!`);
        }, 800);
      }, 800);
    }, 800);
  };

  const filtered = plans.filter(p =>
    p.plan_name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 20px", borderRadius: 14, backdropFilter: "blur(20px)", background: toast.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`, color: toast.type === "success" ? "#10b981" : "#ef4444", fontSize: 13, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "fadeInUp 0.3s ease" }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 4 }}>SaaS Product Pricing</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{plans.length} subscription tiers configured · Real-time checkout nodes</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["cards", "table"].map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{ padding: "8px 16px", borderRadius: 10, background: viewMode === m ? "rgba(99,102,241,0.12)" : "var(--bg-card)", border: viewMode === m ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border-glass)", color: viewMode === m ? "#6366f1" : "var(--text-muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", textTransform: "capitalize" }}>{m} View</button>
          ))}
          <button onClick={() => setOpen(true)} style={{ padding: "10px 22px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter,sans-serif", boxShadow: "0 4px 20px rgba(99,102,241,0.4)", transition: "all 0.2s" }}>
            <AddIcon style={{ fontSize: 18 }} /> Add Plan
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 14, padding: "10px 16px", marginBottom: 24, maxWidth: 400 }}>
        <SearchIcon style={{ color: "var(--text-muted)", fontSize: 18 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans..." style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "Inter,sans-serif", width: "100%", outline: "none" }} />
      </div>

      {/* Card View */}
      {viewMode === "cards" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginBottom: 24 }}>
          {filtered.map((plan, i) => {
            const grad = planGradients[plan.plan_name] || "linear-gradient(135deg,#4f8ef7,#8b5cf6)";
            const icon = planIcons[plan.plan_name] || <StarIcon />;
            
            // Resolve current sub status
            const subStatus = userSubs[plan.id] || "inactive";
            
            return (
              <div key={plan.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 24, padding: 28, position: "relative", overflow: "hidden", transition: "all 0.3s", cursor: "default", backdropFilter: "blur(16px)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--border-glass-hover)"; e.currentTarget.style.boxShadow = "var(--shadow-glow)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-glass)"; e.currentTarget.style.boxShadow = "none"; }}>
                
                {/* Glow blob */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: grad, opacity: 0.12, filter: "blur(24px)", pointerEvents: "none" }} />
                
                {/* Icon & Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>{icon}</div>
                  
                  {subStatus === "active" && (
                    <span style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontSize: 11, fontWeight: 700 }}>
                      ● ACTIVE
                    </span>
                  )}
                  {subStatus === "cancelled" && (
                    <span style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 11, fontWeight: 700 }}>
                      ● INACTIVE
                    </span>
                  )}
                  {subStatus === "inactive" && (
                    <span style={{ padding: "4px 12px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", fontSize: 11, fontWeight: 700 }}>
                      AVAILABLE
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>{plan.plan_name}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: 4 }}>
                  ₹{plan.price.toLocaleString("en-IN")}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>/{plan.billing_cycle === "Monthly" ? "mo" : "yr"}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>{plan.description}</div>
                
                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {(plan.features || []).map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircleIcon style={{ fontSize: 14, color: "#10b981" }} />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  {subStatus === "active" ? (
                    <button 
                      onClick={() => handleCheckoutClick(plan, "renew")}
                      style={{ flex: 1, padding: "9px", borderRadius: 10, background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", color: "#4f8ef7", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif" }}
                    >
                      Renew Plan
                    </button>
                  ) : subStatus === "cancelled" ? (
                    <button 
                      onClick={() => handleCheckoutClick(plan, "reactivate")}
                      style={{ flex: 1, padding: "9px", borderRadius: 10, background: "linear-gradient(135deg, #10b981, #06b6d4)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
                    >
                      Reactivate Plan
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleCheckoutClick(plan, "subscribe")}
                      style={{ flex: 1, padding: "9px", borderRadius: 10, background: grad, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif", boxShadow: `0 4px 16px rgba(0,0,0,0.3)` }}
                    >
                      Subscribe
                    </button>
                  )}

                  <button onClick={() => deletePlan(plan.id)} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DeleteIcon style={{ fontSize: 16 }} />
                  </button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: grad, borderRadius: "100px 100px 0 0", opacity: 0.7 }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <GlassCard>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Plan", "Price", "Billing Cycle", "Subscription Status", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "0 14px 12px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase", borderBottom: "1px solid var(--border-glass)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((plan, i) => {
                  const grad = planGradients[plan.plan_name] || "linear-gradient(135deg,#4f8ef7,#8b5cf6)";
                  const subStatus = userSubs[plan.id] || "inactive";

                  return (
                    <tr key={plan.id} style={{ transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: grad, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>{planIcons[plan.plan_name] || <StarIcon />}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{plan.plan_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>₹{plan.price.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 8, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366f1", fontSize: 11, fontWeight: 600 }}>{plan.billing_cycle}</span>
                      </td>
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                        {subStatus === "active" ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", fontSize: 11, fontWeight: 600 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                            Active
                          </span>
                        ) : subStatus === "cancelled" ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 11, fontWeight: 600 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                            Cancelled
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}>
                            Not Subscribed
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "13px 14px", borderBottom: "1px solid var(--border-glass)" }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {subStatus === "active" ? (
                            <button onClick={() => handleCheckoutClick(plan, "renew")} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", color: "#4f8ef7", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Renew</button>
                          ) : subStatus === "cancelled" ? (
                            <button onClick={() => handleCheckoutClick(plan, "reactivate")} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Reactivate</button>
                          ) : (
                            <button onClick={() => handleCheckoutClick(plan, "subscribe")} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "#8b5cf6", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Subscribe</button>
                          )}
                          <button onClick={() => deletePlan(plan.id)} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><DeleteIcon style={{ fontSize: 15 }} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Plan Add Modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Add New Plan</h2>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Define pricing and features</p>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}><CloseIcon style={{ fontSize: 18 }} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <InputField label="Plan Name *" value={form.plan_name} onChange={e => setForm({ ...form, plan_name: e.target.value })} />
              <InputField label="Price (₹) *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <InputField label="Billing Cycle" select value={form.billing_cycle} onChange={e => setForm({ ...form, billing_cycle: e.target.value })}>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </InputField>
              <InputField label="Description" textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setOpen(false)} style={{ flex: 1, padding: "11px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Cancel</button>
              <button onClick={savePlan} style={{ flex: 2, padding: "11px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter,sans-serif", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>Save Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Payment/Checkout Modal */}
      {openCheckout && selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: 28, padding: 36, width: "100%", maxWidth: 500, boxShadow: "0 32px 96px rgba(0,0,0,0.6)", overflow: "hidden", position: "relative" }}>
            
            {/* Header / Exit */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "1px", textTransform: "uppercase" }}>BillFlow Sandbox Node</span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 0" }}>
                  {paymentType === "subscribe" ? "Secure Checkout" : paymentType === "renew" ? "Renew Subscription" : "Reactivate Subscription"}
                </h2>
              </div>
              {checkoutStep !== "processing" && (
                <button onClick={() => setOpenCheckout(false)} style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
                  <CloseIcon style={{ fontSize: 18 }} />
                </button>
              )}
            </div>

            {/* Input state */}
            {checkoutStep === "input" && (
              <div>
                {/* Plan Summary Card */}
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: 16, padding: 20, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{selectedPlan.plan_name} Subscription</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Recurring billing model initialized</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-primary)" }}>₹{selectedPlan.price}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>/{selectedPlan.billing_cycle.toLowerCase()}</div>
                  </div>
                </div>

                {/* Card Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                  <InputField label="Cardholder Name" value={cardHolder} onChange={e => setCardHolder(e.target.value)} />
                  <InputField label="Card Number (Mock)" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <InputField label="Expiration Date" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                    <InputField label="CVV Security Code" value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
                  </div>
                </div>

                {/* Sandbox Info */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 12, marginBottom: 28 }}>
                  <SecurityIcon style={{ color: "#6366f1", fontSize: 18 }} />
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    Mock payment active. Card details will be processed securely on the simulated sandbox node.
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setOpenCheckout(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button onClick={runMockPayment} style={{ flex: 2, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}>
                    <PaymentIcon style={{ fontSize: 16, marginRight: 6, verticalAlign: "middle" }} />
                    Authorize Charge
                  </button>
                </div>
              </div>
            )}

            {/* Processing state */}
            {checkoutStep === "processing" && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid rgba(99,102,241,0.15)", borderTop: "4px solid #6366f1", animation: "spin 0.8s linear infinite", margin: "0 auto 28px" }} />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Processing Transaction</h3>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{processingMsg}</p>
              </div>
            )}

            {/* Success state */}
            {checkoutStep === "success" && (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "2px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", margin: "0 auto 24px", fontSize: 32 }}>✓</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Payment Authorized</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.5 }}>
                  Successfully synced subscription status. {selectedPlan.plan_name} plan is now fully activated on the database nodes.
                </p>
                <button onClick={() => setOpenCheckout(false)} style={{ padding: "12px 32px", borderRadius: 12, background: "linear-gradient(135deg,#10b981,#06b6d4)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`@keyframes fadeInUp { from { opacity:0;transform:translateY(16px); } to { opacity:1;transform:translateY(0); } }`}</style>
    </MainLayout>
  );
}