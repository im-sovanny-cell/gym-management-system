// src/api/http.js

import axios from "axios";

// IMPORTANT: Base URL must contain ONLY ONE /api
export const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Automatically attach JWT Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
