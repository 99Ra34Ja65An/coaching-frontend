// admin/src/API.js
import axios from "axios";

// ✅ Axios instance create
const API = axios.create({
  baseURL: "http://192.168.0.121:5000/api", // Apne backend ka URL
  timeout: 10000, // 10 sec timeout, network issues handle karne ke liye
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

// ✅ Handle token expiration & unauthorized access globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid → Auto logout
      localStorage.removeItem("token");
      localStorage.removeItem("student");

      alert("Session expired! Please login again.");
      window.location.href = "/login"; // redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;
