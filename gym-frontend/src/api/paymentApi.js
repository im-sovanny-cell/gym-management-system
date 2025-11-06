import { API } from "./http";

// Get all
export const getAllPayments = () =>
  API.get("/payments").then(r => (Array.isArray(r.data?.data) ? r.data.data : r.data));

// Get by ID
export const getPaymentById = (id) =>
  API.get(`/payments/${id}`).then(r => r.data?.data || r.data);

// Create
export const createPayment = (data) =>
  API.post("/payments", data).then(r => r.data);

// Update
export const updatePayment = (id, data) =>
  API.put(`/payments/${id}`, data).then(r => r.data);

// Delete
export const deletePayment = (id) =>
  API.delete(`/payments/${id}`).then(r => r.data);
