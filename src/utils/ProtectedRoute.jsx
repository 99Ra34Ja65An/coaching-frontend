import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, getStoredToken, getStoredUser, clearSession } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
  const token = getStoredToken();
  const user = getStoredUser();

  // ✅ Token ya user missing → login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Token expire ho gaya → session clear + login page
  if (isTokenExpired(token)) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  // ✅ Role mismatch → login page
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Otherwise allow access
  return children;
};

export default ProtectedRoute;
