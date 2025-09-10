// src/utils/api.js
import axios from "axios";

// ✅ Axios instance create with environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://coaching-frontend1.onrender.com/api",
  timeout: 10000,
});

// ✅ Automatically attach token for every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle token expiration globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Session expired! Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
