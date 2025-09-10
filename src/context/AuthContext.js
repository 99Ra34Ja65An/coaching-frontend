import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // If there's no token, user is not logged in
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // ✅ Verify token by hitting backend
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        } else {
          // Token invalid or expired
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ Save token + user on login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // ✅ Clear token + user on logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
