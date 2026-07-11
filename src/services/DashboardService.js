import api from "./api";

// Get dashboard summary stats
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats/");
  return res.data;
};

// Get recent activity / audit logs
export const getRecentActivity = async (limit = 10) => {
  const res = await api.get(`/audit-logs/?limit=${limit}`);
  return res.data;
};

// Get revenue chart data
export const getRevenueData = async (period = "monthly") => {
  const res = await api.get(`/dashboard/revenue/?period=${period}`);
  return res.data;
};

// Get subscription chart data
export const getSubscriptionData = async () => {
  const res = await api.get("/dashboard/subscriptions/");
  return res.data;
};
