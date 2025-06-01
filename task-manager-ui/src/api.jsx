// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // Adjust your base URL
});

// Interceptor to add Authorization header with JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or sessionStorage/cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
