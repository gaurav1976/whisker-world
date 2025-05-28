import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Simulate API call
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          location: formData.location || "",
          dob: formData.dob || "",
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store user data in localStorage
      const userData = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        location: formData.location || "",
        dob: formData.dob || "",
        image: "",
      };
      
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      
      // Redirect to profile page
      navigate("/profile");
      
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>

      <div className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
};

export default Signup;