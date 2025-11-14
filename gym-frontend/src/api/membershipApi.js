// src/api/membershipApi.js
import { API } from "/src/api/http.js";

// List all memberships
export const getAllMemberships = () =>
  API.get(`/memberships`).then((r) => r.data);

// Get membership by ID
export const getMembershipById = (id) =>
  API.get(`/memberships/${id}`).then((r) => r.data);

// Create new membership
export const createMembership = (data) =>
  API.post(`/memberships`, data).then((r) => r.data);

// Update existing membership
export const updateMembership = (id, data) =>
  API.put(`/memberships/${id}`, data).then((r) => r.data);

// Delete membership (✔ used for Delete button)
export const deleteMembership = (id) =>
  API.delete(`/memberships/${id}`).then((r) => r.data);
