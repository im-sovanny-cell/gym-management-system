// src/api/payrollApi.js
import { API } from "./http";

// GET all payrolls
export const getAllPayrolls = () =>
  API.get("/payrolls").then((r) => r.data);

// GET payroll by ID
export const getPayrollById = (id) =>
  API.get(`/payrolls/${id}`).then((r) => r.data);

// CREATE payroll
export const createPayroll = (data) =>
  API.post("/payrolls", data).then((r) => r.data);

// UPDATE payroll
export const updatePayroll = (id, data) =>
  API.put(`/payrolls/${id}`, data).then((r) => r.data);

// DELETE payroll
export const deletePayroll = (id) =>
  API.delete(`/payrolls/${id}`).then((r) => r.data);

// ⭐ NEW — AUTO HOURS
export const getAutoHours = (trainerId, monthYear) =>
  API.get("/payrolls/auto-hours", {
    params: {
      trainerId,
      month: monthYear,
    },
  }).then((r) => r.data);
