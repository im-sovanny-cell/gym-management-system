// src/api/authApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Auto add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginApi = (email, password) =>
  API.post("/auth/login", { email, password }).then((r) => r.data);

export const meApi = () => API.get("/auth/me").then((r) => r.data);

export const registerApi = (data) =>
  API.post("/auth/register", data).then((r) => r.data);