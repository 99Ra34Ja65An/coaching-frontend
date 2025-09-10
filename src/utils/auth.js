// utils/auth.js

// ✅ Save token & user to localStorage
export const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// ✅ Get token from localStorage
export const getStoredToken = () => localStorage.getItem("token");

// ✅ Get user from localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ✅ Clear token & user
export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ✅ Check if JWT is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
