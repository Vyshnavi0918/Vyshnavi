import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const menu = [
  { name: "dashboard", path: "/dashboard", icon: <DashboardIcon />, section: "main" },
  { name: "customers", path: "/customers", icon: <PeopleIcon />, section: "main" },
  { name: "plans", path: "/plans", icon: <InventoryIcon />, section: "main" },
  { name: "subscriptions", path: "/subscriptions", icon: <AutorenewIcon />, section: "main" },
  { name: "billing", path: "/billing", icon: <ReceiptLongIcon />, section: "finance" },
  { name: "reports", path: "/reports", icon: <BarChartIcon />, section: "finance" },
  { name: "profile", path: "/profile", icon: <PersonIcon />, section: "account" },
  { name: "settings", path: "/settings", icon: <SettingsIcon />, section: "account" },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const sectionLabels = {
    main: t("nav.sections.main", "MAIN MENU"),
    finance: t("nav.sections.finance", "FINANCE"),
    account: t("nav.sections.account", "ACCOUNT"),
  };

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <aside
      style={{
        width: collapsed ? 72 : 260,
        flexShrink: 0,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-glass)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 100,
        boxShadow: "var(--shadow-glass)",
        overflowX: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "24px 0" : "28px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid var(--border-glass)",
          minHeight: 72,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
          }}
        >
          <ElectricBoltIcon style={{ color: "#fff", fontSize: 22 }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
              BillFlow
            </div>
            <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, letterSpacing: "0.5px" }}>
              {t("nav.logo_subtitle", "FINTECH PLATFORM")}
            </div>
          </div>
        )}
      </div>
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: 24,
          right: -14,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "2px solid var(--bg-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 200,
          boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
          transition: "all 0.2s ease",
          color: "#fff",
        }}
      >
        {collapsed ? (
          <ChevronRightIcon style={{ fontSize: 16 }} />
        ) : (
          <ChevronLeftIcon style={{ fontSize: 16 }} />
        )}
      </button>
      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", overflowX: "hidden" }}>
        {Object.entries(groupedMenu).map(([section, items]) => (
          <div key={section} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "1px",
                  padding: "12px 12px 6px",
                }}
              >
                {sectionLabels[section]}
              </div>
            )}
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              const translatedName = t(`nav.${item.name}`);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={collapsed ? translatedName : ""}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: collapsed ? "12px 0" : "11px 14px",
                    borderRadius: 12,
                    marginBottom: 2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(99,102,241,0.25)"
                      : "1px solid transparent",
                    color: isActive ? "#6366f1" : "var(--text-secondary)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 14,
                    transition: "all 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--bg-card-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: "60%",
                        background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
                        borderRadius: "0 4px 4px 0",
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: isActive ? "#6366f1" : "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{translatedName}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      {/* Bottom user info */}
      {!collapsed && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border-glass)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border-glass)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user?.name?.[0] || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                {user?.name || t("nav.admin_name", "User")}
              </div>
              <div style={{ fontSize: 11, color: "#6366f1", whiteSpace: "nowrap", textTransform: "capitalize" }}>{user?.role || t("nav.admin_role", "Viewer")}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}