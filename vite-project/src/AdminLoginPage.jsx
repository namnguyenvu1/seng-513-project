import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png'; // adjust path if needed

function AdminLoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
  
    const res = await fetch("http://localhost:3000/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
  
    if (res.ok) {
      const data = await res.json();
      alert("Admin/Staff login successful!");
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "staff") {
        navigate("/staff-dashboard");
      }
    } else {
      const msg = await res.text();
      alert("Login failed: " + msg);
    }
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Admin/Staff Login</h1>
      </div>

      <div className="login-container">
        <form onSubmit={handleAdminLogin}>
          <h2>Admin/Staff Login</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>

          <div className="links">
            <a href="#" onClick={() => navigate("/login")} style={{ color: 'black' }}>Back to User Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;