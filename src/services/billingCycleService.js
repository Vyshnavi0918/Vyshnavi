import api from "./api";

// Get all billing cycles
export const getBillingCycles = async () => {
  const res = await api.get("/billing-cycles/");
  return res.data;
};

// Get billing cycles for a subscription
export const getBillingCyclesBySubscription = async (subscriptionId) => {
  const res = await api.get(`/billing-cycles/?subscription_id=${subscriptionId}`);
  return res.data;
};

// Generate next billing cycle
export const generateBillingCycle = async (subscriptionId) => {
  const res = await api.post(`/billing-cycles/generate`, { subscription_id: subscriptionId });
  return res.data;
};

// Get current billing cycle
export const getCurrentBillingCycle = async (subscriptionId) => {
  const res = await api.get(`/billing-cycles/current/${subscriptionId}`);
  return res.data;
};
