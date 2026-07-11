import api from "./api";

const MOCK_BILLS = [
  { id: "INV-1", customer_name: "Vyshnavi K", plan_name: "Premium", amount: 3538.82, billing_date: "2026-06-20", due_date: "2026-07-20", method: "UPI", status: "Paid" },
  { id: "INV-2", customer_name: "Rahul Sharma", plan_name: "Basic", amount: 588.82, billing_date: "2026-07-08", due_date: "2026-07-15", method: "Card", status: "Pending" },
  { id: "INV-3", customer_name: "Sai Charan", plan_name: "Enterprise", amount: 11798.82, billing_date: "2025-07-10", due_date: "2026-07-09", method: "Net Banking", status: "Pending" }
];

// Get all bills/invoices
export const getBills = async () => {
  try {
    const res = await api.get("/billing/");
    if (!res.data || res.data.length === 0) {
      return MOCK_BILLS;
    }
    return res.data;
  } catch (err) {
    console.error("API getBills failed, falling back to mock", err);
    return MOCK_BILLS;
  }
};

// Add a new bill
export const addBill = async (bill) => {
  try {
    const res = await api.post("/billing/", bill);
    return res.data;
  } catch (err) {
    console.error("API addBill failed", err);
    return { ...bill, id: `INV-${Date.now()}` };
  }
};

// Update a bill
export const updateBill = async (id, bill) => {
  try {
    const res = await api.put(`/billing/${id}`, bill);
    return res.data;
  } catch (err) {
    console.error("API updateBill failed", err);
    return { ...bill, id };
  }
};

// Delete a bill
export const deleteBill = async (id) => {
  try {
    const res = await api.delete(`/billing/${id}`);
    return res.data;
  } catch (err) {
    console.error("API deleteBill failed", err);
    return { id };
  }
};

// Get billing summary
export const getBillingSummary = async () => {
  try {
    const res = await api.get("/billing/summary/");
    return res.data;
  } catch (err) {
    console.error("API getBillingSummary failed", err);
    return { total_billed: 15926.46, total_paid: 3538.82, total_pending: 12387.64 };
  }
};