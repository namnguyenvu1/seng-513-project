import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png'; // adjust path if needed

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Login successful!");
      localStorage.setItem("userEmail", email); // Save email to localStorage
      navigate("/main");
    } else {
      const msg = await res.text();
      alert("Login failed: " + msg);
    }
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Gamified Study Lounge</h1>
      </div>

      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>

          <div className="links">
          <a href="#" onClick={() => navigate("/signup")} style={{ color: 'red' }}>Sign Up</a>
          <a href="#" onClick={() => navigate("/reset-password")} style={{ color: 'black' }}>Forgot Password</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
