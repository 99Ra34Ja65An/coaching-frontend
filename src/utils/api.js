import axios from "axios";

// ✅ Axios instance with environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://192.168.0.121:5000/api",
  timeout: 10000,
});

// ✅ Attach token automatically
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

// ✅ Handle 401 globally
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
