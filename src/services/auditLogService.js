import api from "./api";

// Get all audit logs (with optional filters)
export const getAuditLogs = async (params = {}) => {
  const res = await api.get("/audit-logs/", { params });
  return res.data;
};

// Get audit logs for a specific entity
export const getAuditLogsByEntity = async (entityType, entityId) => {
  const res = await api.get(`/audit-logs/?entity_type=${entityType}&entity_id=${entityId}`);
  return res.data;
};

// Get recent audit activity
export const getRecentAuditLogs = async (limit = 20) => {
  const res = await api.get(`/audit-logs/?limit=${limit}`);
  return res.data;
};
