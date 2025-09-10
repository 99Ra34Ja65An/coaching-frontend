import axios from "axios";

// ✅ Backend ka base URL set karo
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://coaching-backend-venu.onrender.com/api",
});

// ✅ Request Interceptor — har API call se pehle token lagana
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

// ✅ Set or remove auth token manually (optional)
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
