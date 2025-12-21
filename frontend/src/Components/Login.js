import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from "../config";

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    axios.post(`${API_BASE_URL}/login`, formData)
      .then(result => {
        console.log("Login API response:", result.data);
        if (result.data.message === "success") {
          const userData = result.data.user;
          onLogin(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/Detection");
        } else if (result.data.message === "password incorrect") {
          alert("Incorrect password");
        } else if (result.data.message === "no record existed") {
          alert("No account found. Please sign up first.");
          navigate("/Signin");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-success bg-opacity-25 vh-100">
      <div className="auth-card">
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account? <Link to="/Signin">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
