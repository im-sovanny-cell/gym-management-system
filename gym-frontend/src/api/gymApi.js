// src/api/gymApi.js
const API_BASE = "/api/gyms";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllGyms = async () => {
  const res = await fetch(API_BASE, { headers: getAuthHeaders() });
  return res.json();
};

export const getGymById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
  return res.json();
};

export const createGym = async (data) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateGym = async (id, data) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteGym = async (id) => {
  await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};


