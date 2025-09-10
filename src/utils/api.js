import axios from "axios";

// ✅ Axios instance create karo
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://coaching-backend-venu.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor → Har API request ke sath token attach karega
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

// ✅ Response Interceptor → Token expire hone pe automatic logout karega
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized → Token expire ho gaya
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Auto redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
