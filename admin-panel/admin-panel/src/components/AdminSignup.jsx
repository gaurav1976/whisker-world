import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/AdminSignup.css";

function AdminSignup() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "junioradmin",
    secretKey: ""
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Define valid roles and their permissions
  const validRoles = [
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "junioradmin", label: "Junior Admin" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!validRoles.some(role => role.value === formData.role)) {
      newErrors.role = "Invalid role selected";
    }
    if (formData.role === "superadmin" && !formData.secretKey.trim()) {
      newErrors.secretKey = "Super admin secret key is required";
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
      // Only include secretKey if role is superadmin
      const payload = formData.role === "superadmin" ? 
        formData : 
        { ...formData, secretKey: undefined };
      
     const API_BASE = import.meta.env.VITE_API_BASE_URL;

const res = await axios.post(`${API_BASE}/admin/signup`, payload, {
  headers: { "Content-Type": "application/json" }
});

      if (res.status === 201) {
        alert("Admin registration successful!");
        navigate("/admin/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                       err.response?.data?.message || 
                       "Registration failed. Please try again.";
      setApiError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

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
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? "error" : ""}
          >
            {validRoles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && <span className="error-text">{errors.role}</span>}
        </div>

        {formData.role === "superadmin" && (
          <div className="form-group">
            <label>Super Admin Secret Key</label>
            <input
              type="password"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              className={errors.secretKey ? "error" : ""}
              placeholder="Enter super admin secret key"
            />
            {errors.secretKey && <span className="error-text">{errors.secretKey}</span>}
          </div>
        )}

        {apiError && <div className="error-text api-error">{apiError}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Sign Up"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/admin/login">Login</Link>
      </p>
    </div>
  );
}

export default AdminSignup;