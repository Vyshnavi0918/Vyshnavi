import api from "./api";

const MOCK_CUSTOMERS = [
  { id: 6, name: "Vyshnavi K", email: "vyshnavi@example.com", phone: "+91 9876543210", company: "Vyshnavi Tech Labs", status: "Active", created_at: "2026-07-10T12:00:00Z" },
  { id: 7, name: "Rahul Sharma", email: "rahul.sharma@example.com", phone: "+91 9123456789", company: "Sharma Consulting", status: "Active", created_at: "2026-07-10T12:00:00Z" },
  { id: 8, name: "Sai Charan", email: "charan.sai@example.com", phone: "+91 8877665544", company: "Charan Enterprises", status: "Active", created_at: "2026-07-10T12:00:00Z" },
  { id: 9, name: "Priya Nair", email: "priya.nair@example.com", phone: "+91 7766554433", company: "Nair Media Group", status: "Active", created_at: "2026-07-10T12:00:00Z" },
  { id: 10, name: "Karthik M", email: "karthik.m@example.com", phone: "+91 9988776655", company: "Karthik SaaS Corp", status: "Active", created_at: "2026-07-10T12:00:00Z" }
];

// Get all customers
export const getCustomers = async () => {
  try {
    const res = await api.get("/customers/");
    if (!res.data || res.data.length === 0) {
      return MOCK_CUSTOMERS;
    }
    return res.data;
  } catch (err) {
    console.error("API getCustomers failed, falling back to mock", err);
    return MOCK_CUSTOMERS;
  }
};

// Add customer
export const addCustomer = async (customer) => {
  try {
    const res = await api.post("/customers/", customer);
    return res.data;
  } catch (err) {
    console.error("API addCustomer failed", err);
    return { ...customer, id: Date.now() };
  }
};

// Update customer
export const updateCustomer = async (id, customer) => {
  try {
    const res = await api.put(`/customers/${id}`, customer);
    return res.data;
  } catch (err) {
    console.error("API updateCustomer failed", err);
    return { ...customer, id };
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
  } catch (err) {
    console.error("API deleteCustomer failed", err);
    return { id };
  }
};