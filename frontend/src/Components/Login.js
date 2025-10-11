import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
   const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Check if fields are empty
  if (!formData.email || !formData.password) {
    alert("Please fill in all fields");
    return;
  }

  // Send request to backend
  axios.post("http://localhost:5000/login", {
    email: formData.email,
    password: formData.password,
  })
    .then((result) => {
      console.log(result.data);

      if (result.data === "success") {
        alert("✅ Login successful!"); 
        navigate("/home");            
      } else if (result.data === "password incorrect") {
        alert("Incorrect password. Try again."); 
      } else if (result.data === "no record existed") {
        alert("No account found. Please sign up first.");
        navigate("/Signin"); 
      } else {
        alert("Something went wrong. Please try again.");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Server error. Please try again later.");
    });
};

  return (
    <div className="d-flex justify-content-center align-items-center bg-success bg-opacity-25 vh-100 ">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
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
            <label className="form-label">Password</label>
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

          <button class="button" type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/Signin" className="text-decoration-none">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
