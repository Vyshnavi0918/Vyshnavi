import api from "./api";

// Get all invoices
export const getInvoices = async () => {
  const res = await api.get("/invoices/");
  return res.data;
};

// Get single invoice by ID
export const getInvoice = async (id) => {
  const res = await api.get(`/invoices/${id}`);
  return res.data;
};

// Create a new invoice
export const createInvoice = async (invoice) => {
  const res = await api.post("/invoices/", invoice);
  return res.data;
};

// Update invoice status (mark paid, void, etc.)
export const updateInvoiceStatus = async (id, status) => {
  const res = await api.patch(`/invoices/${id}/status`, { status });
  return res.data;
};

// Download invoice PDF
export const downloadInvoice = async (id) => {
  const res = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
  return res.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  const res = await api.delete(`/invoices/${id}`);
  return res.data;
};
