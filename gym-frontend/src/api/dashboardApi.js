// src/api/dashboardApi.js
const API_BASE = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. COUNTS
export const fetchCounts = async () => {
  const res = await fetch(`${API_BASE}/dashboard/counts`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load counts");
  return res.json();
};

// 2. TODAY TOTAL
export const fetchTodayTotal = async () => {
  const res = await fetch(`${API_BASE}/dashboard/payments/today`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load today total");
  return res.json();
};

// 3. ALL-TIME TOTAL
export const fetchAllPaymentsTotal = async () => {
  const res = await fetch(`${API_BASE}/dashboard/payments/total`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load all payments");
  return res.json();
};

// 4. RECENT PAYMENTS
export const fetchRecentPayments = async (limit = 6) => {
  const res = await fetch(`${API_BASE}/dashboard/payments/recent?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load payments");
  return res.json();
};

// 5. UPCOMING CLASSES
export const fetchUpcomingClasses = async (limit = 6) => {
  const res = await fetch(`${API_BASE}/dashboard/classes/upcoming?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load classes");
  return res.json();
};