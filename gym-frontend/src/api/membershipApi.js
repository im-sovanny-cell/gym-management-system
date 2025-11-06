// src/api/membershipApi.js
import { API } from "/src/api/http.js";

// List
export const getAllMemberships = () =>
  API.get(`/memberships`).then((r) => r.data);

// Detail
export const getMembershipById = (id) =>
  API.get(`/memberships/${id}`).then((r) => r.data);

// Create
export const createMembership = (data) =>
  API.post(`/memberships`, data).then((r) => r.data);

// Update
export const updateMembership = (id, data) =>
  API.put(`/memberships/${id}`, data).then((r) => r.data);

// Delete
export const deleteMembership = (id) =>
  API.delete(`/memberships/${id}`).then((r) => r.data);
