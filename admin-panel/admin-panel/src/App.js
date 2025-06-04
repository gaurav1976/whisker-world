import React from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet 
} from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";

// Protected Route Component
const ProtectedRoute = ({ redirectPath = '/admin/login' }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user?.token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

// Public Only Route (for login/signup when already authenticated)
const PublicOnlyRoute = ({ redirectPath = '/admin/panel' }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user?.token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        {/* Public routes (only accessible when not logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* Protected routes (only accessible when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/panel" element={<AdminPanel />} />
          {/* Add more protected routes here */}
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;