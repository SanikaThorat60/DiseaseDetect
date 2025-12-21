import React from "react";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="main">
        <h1>Welcome To DiseaseDetect</h1>
        <p>HAPPY PLANTS, BETTER YEILD</p>
      </div>

      {/* Disease Cards */}
      <div className="card-container">
        <div className="card">
          <h3>Powdery Mildew</h3>
          <img src="/powdery Mildew.jpeg" alt="Powdery Mildew" />
          <p><strong>Description:</strong> White or gray powdery spots on leaves, stems, and buds.</p>
          <p><strong>Cause:</strong> Fungi in the order Erysiphales.</p>
          <p><strong>Symptoms:</strong> White spots, yellow leaves, reduced growth.</p>
        </div>

        <div className="card">
          <h3>Leaf Spot Diseases</h3>
          <img src="/Leaf Spot Diseases.jpg" alt="Leaf Spot Diseases" />
          <p><strong>Description:</strong> Spots on leaves caused by fungi or bacteria.</p>
          <p><strong>Cause:</strong> Cercospora, Septoria, or Xanthomonas.</p>
          <p><strong>Symptoms:</strong> Circular/irregular spots, yellow halo, leaf drop.</p>
        </div>

        <div className="card">
          <h3>Rust</h3>
          <img src="/Rust.jpeg" alt="Rust" />
          <p><strong>Description:</strong> Rust-colored pustules on leaves and stems.</p>
          <p><strong>Cause:</strong> Fungi in the order Pucciniales.</p>
          <p><strong>Symptoms:</strong> Small orange pustules, stunted growth.</p>
        </div>

        <div className="card">
          <h3>Bacterial Blight</h3>
          <img src="/Bacterial Blight.jpeg" alt="Bacterial Blight" />
          <p><strong>Description:</strong> Water-soaked lesions that turn dark brown.</p>
          <p><strong>Cause:</strong> Xanthomonas species.</p>
          <p><strong>Symptoms:</strong> Necrotic spots, wilting, stem cankers.</p>
        </div>

        <div className="card">
          <h3>Root Rot</h3>
          <img src="/Root Rot.jpg" alt="Root Rot" />
          <p><strong>Description:</strong> Roots decay in poorly drained soils.</p>
          <p><strong>Cause:</strong> Phytophthora, Pythium, Rhizoctonia.</p>
          <p><strong>Symptoms:</strong> Wilting despite watering, yellow leaves.</p>
        </div>

        <div className="card">
          <h3>Mosaic Virus</h3>
          <img src="/Mosaic Virus.jpeg" alt="Mosaic Virus" />
          <p><strong>Description:</strong> Mottled light/dark patches on leaves.</p>
          <p><strong>Cause:</strong> Viruses like Tobacco Mosaic Virus (TMV).</p>
          <p><strong>Symptoms:</strong> Mottled leaves, stunted growth, reduced yield.</p>
        </div>
      </div>

      {/* Footer */}
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
            <p>Email: support@DiseaseDetect.com</p>
            <p>📍 Pune, India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 DiseaseDetect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
