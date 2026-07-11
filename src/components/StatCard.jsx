import { useState, useEffect } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
export default function StatCard({ title, value, subtitle, icon, gradient, trend, trendValue }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const isPositive = trend === "up";
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "default",
        animation: animated ? "fadeInUp 0.5s ease forwards" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Gradient background blob */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: gradient,
          opacity: 0.12,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
          }}
        >
          <span style={{ color: "#fff", fontSize: 22, display: "flex" }}>{icon}</span>
        </div>
        {/* Trend badge */}
        {trendValue && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 100,
              background: isPositive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              border: `1px solid ${isPositive ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
              fontSize: 12,
              fontWeight: 600,
              color: isPositive ? "#10b981" : "#ef4444",
            }}
          >
            {isPositive ? (
              <TrendingUpIcon style={{ fontSize: 14 }} />
            ) : (
              <TrendingDownIcon style={{ fontSize: 14 }} />
            )}
            {trendValue}
          </div>
        )}
      </div>
      {/* Value */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#f0f4ff",
          letterSpacing: "-0.5px",
          lineHeight: 1,
          marginBottom: 8,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {value}
      </div>
      {/* Title */}
      <div style={{ fontSize: 13, fontWeight: 500, color: "#8b9dc3", marginBottom: 4 }}>{title}</div>
      {/* Subtitle */}
      <div style={{ fontSize: 12, color: "#4a5a7a", fontWeight: 400 }}>{subtitle}</div>
      {/* Bottom glow line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "20%",
          right: "20%",
          height: 2,
          background: gradient,
          borderRadius: "100px 100px 0 0",
          opacity: 0.6,
        }}
      />
    </div>
  );
}