import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/AdminSignup.css";

function AdminSignup() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "junioradmin", // Default role
    secretKey: "" // For super admin registration
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
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    // Validate secret key only for super admin
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
      const res = await axios.post(
        "http://localhost:5000/admin/signup", 
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (res.status === 201) {
        alert("Admin registration successful!");
        navigate("/admin/login");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                     err.response?.data?.message || 
                     "Registration failed. Please try again.";
      alert(errorMsg);
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
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="junioradmin">Junior Admin</option>
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