import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/AdminSignup.css";

function AdminSignup() {
  // Define API base URL with fallback
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://whisker-world-qlpf.onrender.com";

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

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
    setApiError("");

    try {
      if (!API_BASE) {
        throw new Error("Server configuration error. Please try again later.");
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === "superadmin") {
        payload.secretKey = formData.secretKey;
      }

      const response = await fetch(`${API_BASE}/admin/signup`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Invalid server response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      alert("Admin registration successful!");
      navigate("/admin/login");
      
    } catch (error) {
      console.error("Signup error:", error);
      setApiError(error.message || "An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Signup</h2>
      {apiError && <div className="error-message">{apiError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
            placeholder="Enter your full name"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            name="password" 
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            placeholder="Enter password (min 8 characters)"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select 
            id="role"
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
            <label htmlFor="secretKey">Super Admin Secret Key</label>
            <input
              type="password"
              id="secretKey"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              className={errors.secretKey ? "error" : ""}
              placeholder="Enter super admin secret key"
            />
            {errors.secretKey && <span className="error-text">{errors.secretKey}</span>}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span> Processing...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account? <Link to="/admin/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminSignup;