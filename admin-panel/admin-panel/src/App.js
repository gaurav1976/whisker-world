import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";

function App() {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return (
    <Router>
      <Routes>
        {/* Default route: show signup page first */}
        <Route path="/" element={<Navigate to="/admin/signup" />} />

        {/* Admin Signup */}
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated ? (
              <AdminPanel />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Catch-all: redirect unknown routes to signup */}
        <Route path="*" element={<Navigate to="/admin/signup" replace />} />
      </Routes>
    </Router>
  );
}

export default App;