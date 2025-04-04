import React, { useState } from "react";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png';

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Account created!");
      navigate("/login");
    } else {
      const msg = await res.text();
      alert("Signup failed: " + msg);
    }
  };

  return (
    <div className="page-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Gamified Study Lounge</h1>
      </div>

      <div className="login-container">
        <form onSubmit={handleSignup}>
          <h2>Create Account</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <small style={{ color: 'black' }}>
            <b>Password Requirements:<br /></b>
            At least 8 characters<br />
            Special character or a digit<br />
            At least 1 lowercase letter<br />
            At least 1 uppercase letter
          </small>
          <button type="submit">Create Account</button>

          <div className="links">
            <a href="#" onClick={() => navigate("/login")} style={{ color: 'red' }}>Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;