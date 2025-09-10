import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Agar token nahi hai → Login pe bhejo
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Agar role diya gaya hai aur user ka role match nahi kar raha → unauthorized
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise page dikhao
  return children;
};

export default ProtectedRoute;
