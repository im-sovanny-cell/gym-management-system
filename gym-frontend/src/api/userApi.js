import { API } from "./http";

// All Users
export const getAllUsers = () =>
  API.get("/users").then(r => (Array.isArray(r.data?.data) ? r.data.data : []));

// By ID
export const getUserById = (id) =>
  API.get(`/users/${id}`).then(r => r.data?.data || r.data);

// Create (ADMIN)
export const createUser = (data) =>
  API.post("/users", data).then(r => r.data);

// Update
export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data).then(r => r.data);

// Delete
export const deleteUser = (id) =>
  API.delete(`/users/${id}`).then(r => r.data);

// Change password
export const changeUserPassword = (id, password) =>
  API.put(`/users/${id}/password`, { password }).then(r => r.data);
