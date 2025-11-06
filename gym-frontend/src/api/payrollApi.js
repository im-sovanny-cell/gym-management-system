import { API } from "./http";

export const getAllPayrolls = () =>
  API.get("/payrolls").then(r => r.data);

export const getPayrollById = (id) =>
  API.get(`/payrolls/${id}`).then(r => r.data);

export const createPayroll = (data) =>
  API.post("/payrolls", data).then(r => r.data);

export const updatePayroll = (id, data) =>
  API.put(`/payrolls/${id}`, data).then(r => r.data);

export const deletePayroll = (id) =>
  API.delete(`/payrolls/${id}`).then(r => r.data);
