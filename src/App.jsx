import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentSignup from "./pages/StudentSignup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  // ✅ Helper function to decide default route based on login + role
  const getDefaultRoute = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      if (user.role === "admin") return "/admin/dashboard";
      if (user.role === "student") return "/student/dashboard";
    }
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

        {/* ✅ Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Default → Go to dashboard if logged in */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* ✅ Catch-All: Redirect unknown URLs */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
