import React from "react";
import "../App.css";

function About() {
  return (
    <>
      <div className="about-container">
        <h1 className="about-title">About Us</h1>
        <p className="about-text">
          Welcome to DiseaseDetect! <br /><br />
          Our platform is designed to help users detect plant diseases quickly and efficiently. 
          Using advanced technology, we provide insights and guidance to ensure healthy crops 
          and sustainable farming practices. <br /><br />
          We believe in empowering farmers and gardeners with tools that are easy to use, 
          accurate, and reliable. Join our community and take a step towards smarter agriculture.
        </p>
        <div className="about-features">
          <div className="feature">
            <h3>Accurate Detection</h3>
            <p>Identify plant diseases with high accuracy using our intelligent detection system.</p>
          </div>
          <div className="feature">
            <h3>User-Friendly</h3>
            <p>Simple and intuitive interface, making it easy for everyone to use.</p>
          </div>
          <div className="feature">
            <h3>Expert Guidance</h3>
            <p>Get expert recommendations and actionable tips for healthy crops.</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logoplant.png" alt="logo" />
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/Detection">Detection</a></li>
              <li><a href="/About">About</a></li>
              <li><a href="/Signin">Signup/Login</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: support@DiseaseDetection.com</p>
            <p>📍 Pune, India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 DiseaseDetection. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default About;
