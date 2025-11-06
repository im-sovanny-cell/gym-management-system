import { API } from "./http";

// Get all
export const getAllClasses = () =>
  API.get("/classes").then(r => (Array.isArray(r.data?.data) ? r.data.data : r.data));

// Get by ID
export const getClassById = (id) =>
  API.get(`/classes/${id}`).then(r => r.data?.data || r.data);

// Create
export const createClassApi = (data) =>
  API.post("/classes", data).then(r => r.data);

// Update
export const updateClassApi = (id, data) =>
  API.put(`/classes/${id}`, data).then(r => r.data);

// Delete
export const deleteClassApi = (id) =>
  API.delete(`/classes/${id}`).then(r => r.data);
