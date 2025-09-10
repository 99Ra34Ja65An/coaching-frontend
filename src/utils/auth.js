// ✅ Get stored token from localStorage
export const getStoredToken = () => {
  return localStorage.getItem("token");
};

// ✅ Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// ✅ Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
};

// ✅ Get current logged-in user from localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ✅ Save user info to localStorage
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// ✅ Remove user info from localStorage
export const removeUser = () => {
  localStorage.removeItem("user");
};

// ✅ Clear full session (token + user)
export const clearSession = () => {
  removeToken();
  removeUser();
};

// ✅ Check if JWT token is expired or not
export const isTokenExpired = (token) => {
  try {
    // JWT ka payload decode karna
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Expiration time (seconds → ms)
    const expiry = payload.exp * 1000;

    return Date.now() >= expiry;
  } catch (err) {
    // Agar token invalid hai → expired treat karo
    return true;
  }
};
