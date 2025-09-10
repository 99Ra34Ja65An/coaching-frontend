import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ✅ If no token → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If user role doesn't match required role → go to login
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
