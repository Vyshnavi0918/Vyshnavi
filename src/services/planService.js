import api from "./api";

export const getPlans = async () => {
  const response = await api.get("/plans/");
  return response.data;
};

export const addPlan = async (plan) => {
  const response = await api.post("/plans/", plan);
  return response.data;
};

export const updatePlan = async (id, plan) => {
  const response = await api.put(`/plans/${id}`, plan);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/plans/${id}`);
  return response.data;
};