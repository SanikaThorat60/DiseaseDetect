import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from "../config";

function Signin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    axios.post(`${API_BASE_URL}/Signin`, { name, email, password })
      .then(result => {
        alert("Signup successful!");
        navigate('/Login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-success bg-opacity-25 vh-100">
      <div className="auth-card">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Name</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"

              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"

              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}

              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/Login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
