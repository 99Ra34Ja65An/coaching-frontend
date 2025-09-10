import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentSignup from "./pages/StudentSignup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { getStoredToken, getStoredUser, isTokenExpired } from "./utils/auth";

const App = () => {
  // ✅ Default route decide karega based on user role & token status
  const getDefaultRoute = () => {
    const token = getStoredToken();
    const user = getStoredUser();

    // ✅ Agar token & user dono valid hai → direct dashboard open karo
    if (token && user && !isTokenExpired(token)) {
      return user.role === "admin"
        ? "/admin/dashboard"
        : "/student/dashboard";
    }

    // ✅ Otherwise → login page open karo
    return "/login";
  };

  useEffect(() => {
    document.title = "Coaching App";
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<StudentSignup />} />

        {/* ✅ Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Protected Student Dashboard */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Root Path → Auto Redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* ✅ Catch-All → Auto Redirect */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
