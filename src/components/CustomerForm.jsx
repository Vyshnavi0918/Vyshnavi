import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";

const InputField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: "#8b9dc3", letterSpacing: "0.5px" }}>{label}</label>
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10, padding: "10px 14px", color: "#f0f4ff", fontSize: 13,
        fontFamily: "Inter,sans-serif", outline: "none",
      }}
    />
  </div>
);

export default function CustomerForm({ customer = null, onSave, onCancel, saving = false }) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company || "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    onSave(form);
  };

  const isEdit = !!customer;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InputField
          label="Full Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Rahul Sharma"
        />
        <InputField
          label="Email Address *"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="e.g. rahul@company.com"
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <InputField
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+91 98765 43210"
        />
        <InputField
          label="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="e.g. Infosys Ltd."
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
        <button
          onClick={onCancel}
          style={{
            padding: "9px 20px", borderRadius: 10,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#8b9dc3", cursor: "pointer", fontWeight: 600, fontSize: 13,
            fontFamily: "Inter,sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            padding: "9px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13,
            background: isEdit
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#4f8ef7,#8b5cf6)",
            border: "none", color: "#fff",
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "Inter,sans-serif", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Customer"}
        </button>
      </div>
    </div>
  );
}
