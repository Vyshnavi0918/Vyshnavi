import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Plans from "./pages/Plans";
import Subscriptions from "./pages/Subscriptions";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


// ProtectedRoute ensures only authenticated users can access child routes
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid rgba(99,102,241,0.2)",
            borderTop: "3px solid #6366f1",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}