import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Ensure this CSS file exists

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // For navigation after login

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        
        if (!formData.email || !formData.password) {
            setError("Both fields are required!");
            return;
        }

        try {
            const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed. Please try again.");
                return;
            }

            // Store token and user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Successful! ✅ Redirecting...");
            setTimeout(() => {
                navigate("/"); // Redirect to dashboard
            }, 2000);
        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="mobile-frame">
                <div className="speaker"></div>
                <div className="mobile-screen">
                    <div className="form-box">
                        <h2>Login</h2>
                        {error && <p className="error">{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit">Login</button>
                        </form>

                        <h6>
                            New to WHISKER WORLD?{" "}
                            <a href="/signup">Create an Account</a>
                        </h6>
                    </div>
                </div>
                <div className="home-button"></div>
            </div>
        </div>
    );
};

export default Login;
