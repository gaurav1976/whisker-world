import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import AdminSignup from "./components/AdminSignup";
import AdminLogin from "./components/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: redirect to admin signup */}
        <Route path="/" element={<Navigate to="/admin/signup" />} />

        {/* Admin authentication routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected admin panel route */}
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
