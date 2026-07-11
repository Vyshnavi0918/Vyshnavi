import api from "./api";

// Auth service for Task 4: User Authentication

// Login
export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

// Signup / Register
export const signup = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

// Logout
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

// Get current user profile
export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// Refresh token
export const refreshToken = async () => {
  const res = await api.post("/auth/refresh");
  return res.data;
};
