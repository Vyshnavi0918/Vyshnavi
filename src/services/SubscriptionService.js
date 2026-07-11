import api from "./api";

const MOCK_SUBSCRIPTIONS = [
  { id: 1, customer_id: 6, customer_name: "Vyshnavi K", plan_id: 3, plan_name: "Premium", start_date: "2026-06-20T12:00:00Z", end_date: "2026-07-20T12:00:00Z", status: "active" },
  { id: 2, customer_id: 7, customer_name: "Rahul Sharma", plan_id: 1, plan_name: "Basic", start_date: "2026-07-08T12:00:00Z", end_date: "2026-07-15T12:00:00Z", status: "trial" },
  { id: 3, customer_id: 8, customer_name: "Sai Charan", plan_id: 4, plan_name: "Enterprise", start_date: "2025-07-10T12:00:00Z", end_date: "2026-07-09T12:00:00Z", status: "past_due" },
  { id: 4, customer_id: 9, customer_name: "Priya Nair", plan_id: 2, plan_name: "Standard", start_date: "2026-05-11T12:00:00Z", end_date: "2026-06-10T12:00:00Z", status: "cancelled" }
];

export const getSubscriptions = async () => {
  try {
    const res = await api.get("/subscriptions/");
    if (!res.data || res.data.length === 0) {
      return MOCK_SUBSCRIPTIONS;
    }
    return res.data;
  } catch (err) {
    console.error("API getSubscriptions failed, falling back to mock", err);
    return MOCK_SUBSCRIPTIONS;
  }
};

export const addSubscription = async (subscription) => {
  try {
    const res = await api.post("/subscriptions/", subscription);
    return res.data;
  } catch (err) {
    console.error("API addSubscription failed", err);
    return { ...subscription, id: Date.now(), status: "active" };
  }
};

export const updateSubscription = async (id, subscription) => {
  try {
    const res = await api.put(`/subscriptions/${id}`, subscription);
    return res.data;
  } catch (err) {
    console.error("API updateSubscription failed", err);
    return { ...subscription, id };
  }
};

export const deleteSubscription = async (id) => {
  try {
    const res = await api.delete(`/subscriptions/${id}`);
    return res.data;
  } catch (err) {
    console.error("API deleteSubscription failed", err);
    return { id };
  }
};

// Mock subscription functions
export const createSubscription = (plan) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...plan, subscriptionId: Date.now() }), 500);
  });
};

export const paySubscription = (subscriptionId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ subscriptionId, paidAt: Date.now() }), 500);
  });
};

export const renewSubscription = (subscriptionId) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ subscriptionId, renewedAt: Date.now() }), 500);
  });
};