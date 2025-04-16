import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Reuse the CSS from AdminLoginPage
import logo from './assets/logo.png';

function ChangeStaffPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/change-staff-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      alert("Password updated successfully!");
      navigate("/admin-login"); // Redirect back to admin login after success
    } else {
      const msg = await res.text();
      alert("Failed to update password: " + msg);
    }
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Change Staff Password</h1>
      </div>

      <div className="login-container">
        <form onSubmit={handleChangePassword}>
          <h2>Change Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Change Password</button>
          <div className="links">
            <a href="#" onClick={() => navigate("/admin-login")} style={{ color: 'black' }}>
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeStaffPassword;