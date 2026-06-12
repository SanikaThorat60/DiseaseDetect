import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detection from "./Components/Detection";
import Signin from "./Components/Signin";
import About from "./Components/About";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Profile from "./Components/Profile";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // persist login on refresh
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData); // userData includes name & email
  };

  const handleLogout = () => {
    setUser(null);
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="header">
        <div className="header-container">
          <div className="logo">
            <img src="/logoplant.png" alt="logo" />
          </div>

          <button className="hamburger" onClick={toggleMenu}>
            <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${menuOpen ? 'active' : ''}`}></span>
          </button>

          <ul className={menuOpen ? "active" : ""}>
            <li><Link to="/Home" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/About" onClick={closeMenu}>About Us</Link></li>

            {user && <li><Link to="/Detection" onClick={closeMenu}>Detection</Link></li>}
            {user && <li><Link to="/Profile" onClick={closeMenu}>Profile</Link></li>}

            {user ? (
              <>
                <li className="welcome-text">Welcome, {user.name}!</li>
                <li><button className="logout-btn" onClick={() => { handleLogout(); closeMenu(); }}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/Signin" onClick={closeMenu}>Sign Up</Link></li>
                <li><Link to="/Login" onClick={closeMenu}>Login</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route
          path="/Detection"
          element={user ? <Detection /> : <Navigate to="/Login" />}
        />
        <Route
          path="/Profile"
          element={user ? <Profile user={user} /> : <Navigate to="/Login" />}
        />
        <Route path="/Signin" element={<Signin onLogin={handleLogin} />} />
        <Route path="/Login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
