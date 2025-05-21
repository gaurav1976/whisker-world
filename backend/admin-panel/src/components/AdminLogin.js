import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:5000/admin/login",
      formData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (res.data.token) {
      // Save the user (admin) info, including isAdmin flag
      const loggedInUser = {
        ...res.data.admin,
        isAdmin: true // Mark this as admin
      };

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify(res.data.admin));
      localStorage.setItem("user", JSON.stringify(loggedInUser)); // ✅ FIXED

      alert("Login successful!");
      navigate("/admin/panel"); // Redirect to AdminPanel
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error ||
      "Login failed. Please check your credentials.";
    alert(errorMsg);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="auth-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <h6>
        New to ADMIN PANEL?{" "}
        <Link to="/admin/signup">Create an Account</Link>
      </h6>
    </div>
  );
}

export default AdminLogin;
