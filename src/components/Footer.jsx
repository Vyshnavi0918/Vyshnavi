export default function Footer() {
  return (
    <footer
      style={{
        padding: "20px 32px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 12, color: "#4a5a7a" }}>
        © {new Date().getFullYear()} Billing Automation Platform. All rights reserved.
      </div>
      <div style={{ display: "flex", gap: 20 }}>
        {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: 12,
              color: "#4a5a7a",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#4f8ef7")}
            onMouseLeave={(e) => (e.target.style.color = "#4a5a7a")}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
