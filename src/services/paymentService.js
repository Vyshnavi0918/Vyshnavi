import api from "./api";

// Get all payments
export const getPayments = async () => {
  const res = await api.get("/payments/");
  return res.data;
};

// Get single payment
export const getPayment = async (id) => {
  const res = await api.get(`/payments/${id}`);
  return res.data;
};

// Create / record a payment
export const createPayment = async (payment) => {
  const res = await api.post("/payments/", payment);
  return res.data;
};

// Refund a payment
export const refundPayment = async (id) => {
  const res = await api.post(`/payments/${id}/refund`);
  return res.data;
};

// Get payments by invoice
export const getPaymentsByInvoice = async (invoiceId) => {
  const res = await api.get(`/payments/?invoice_id=${invoiceId}`);
  return res.data;
};
