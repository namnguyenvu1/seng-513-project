import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";

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
    <div className="reset-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
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
        <button type="submit">Reset</button>
      </form>
      <button className="cancel" onClick={() => navigate("/login")}>
        Cancel
      </button>
    </div>
  );
}

export default ResetPasswordPage;
