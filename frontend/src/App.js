import { BrowserRouter, Routes, Route } from "react-router-dom";
import Detection from "./Components/Detection";
import Signin from "./Components/Signin";
import Home from "./Components/Home";
import Login from "./Components/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="header">
        <ul>
          <li className="logo"><img src="/logoplant.png" alt="logo" /> DiseaseDetection</li>
          <li><a href="/Home">Home</a></li>
          <li><a href="/Detection">Detection</a></li>
          <li><a href="/Signin">Signup/Login</a></li>
        </ul>
      </div>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Detection" element={<Detection />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
