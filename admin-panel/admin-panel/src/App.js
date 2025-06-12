import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";

function App() {
  // Check if admin is authenticated
  const isAuthenticated = !!localStorage.getItem("adminToken");
  
  return (
    <Router>
      <Routes>
        {/* Default route: redirect to admin login */}
        <Route path="/" element={<Navigate to="/admin/login" />} />

        {/* Admin authentication routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected admin panel route */}
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

        {/* Redirect any unknown paths to login */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;