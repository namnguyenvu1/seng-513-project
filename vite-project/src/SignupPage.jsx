import React, { useState } from "react";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Account created!");
      navigate("/login"); // Redirect to login page
    } else {
      const msg = await res.text();
      alert("Signup failed: " + msg);
    }
  };

  return (
    <div className="signup-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
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
        <small>• At least 8 characters<br />• One number or digit<br />• A mix of upper/lowercase</small>
        <button type="submit">Create account</button>
      </form>
      <button className="cancel" onClick={() => navigate("/login")}>
        Cancel
      </button>
    </div>
  );
}

export default SignupPage;
