import api from "./api";

// Get all settings
export const getSettings = async () => {
  const res = await api.get("/settings/");
  return res.data;
};

// Update settings
export const updateSettings = async (data) => {
  const res = await api.put("/settings/", data);
  return res.data;
};

// Generate new API key
export const generateApiKey = async () => {
  const res = await api.post("/settings/generate-api-key");
  return res.data;
};

// Change password
export const changePassword = async (data) => {
  const res = await api.put("/settings/change-password", data);
  return res.data;
};