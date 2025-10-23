import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../api";
import "../styles/LoginRegister.css";

const LoginRegisterDialog = ({ mode }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = mode === "login" ? `${BASE_URL}${API_ENDPOINTS.LOGIN}` : `${BASE_URL}${API_ENDPOINTS.REGISTER}`;

    try {
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 || response.status === 201) {
        const token = response.data;
        localStorage.setItem("token", token);

        // Mock role assignment based on email content
        const role = formData.email.includes("admin") ? "admin" : "user";
        localStorage.setItem("role", role);
        localStorage.setItem("username", formData.username || formData.email);
        if(mode === "register") {
          alert("Registration successful! You can now log in.");
          navigate("/login");
          return;
        }
        navigate("/dashboard");
      } else {
        alert("Invalid credentials or registration failed");
      }
    } catch (error) {
      // More informative error output with Axios error details
      if (error.response) {
        alert(
          "Error: " +
            error.response.status +
            " - " +
            (error.response.data.message || "Authentication failed")
        );
      } else if (error.request) {
        alert("No response from server. Please try later.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>{mode === "login" ? "Welcome Back" : "Create an Account"}</h2>
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn submit-btn">
            {mode === "login" ? "LOGIN" : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterDialog;
