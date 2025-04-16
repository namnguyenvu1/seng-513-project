import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";
import logo from './assets/logo.png';

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    const res = await fetch("http://localhost:3000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword: newPass }),
    });

    if (res.ok) {
      alert("Password reset successful!");
      navigate("/login");
    } else {
      const msg = await res.text();
      alert("Reset failed: " + msg);
    }
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Gamified Study Lounge</h1>
      </div>

      <div className="login-container">
        <form onSubmit={handleReset}>
          <h2>Reset Password</h2>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            required
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <small style={{ color: 'black' }}>
            At least 8 characters<br />
            Special character or a digit<br />
            At least 1 small letter<br />
            At least 1 capital letter
          </small>
          <button type="submit">Reset</button>

          <div className="links">
            <a href="#" onClick={() => navigate("/login")} style={{ color: 'red' }}>Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;