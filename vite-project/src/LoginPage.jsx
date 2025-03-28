import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Login successful!");
    } else {
      const msg = await res.text();
      alert("Login failed: " + msg);
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h2>Gamified Study Lounge</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <div className="links">
        <a href="/signup">Sign Up</a> | <a href="#">Forgot Password?</a>
      </div>
    </div>
  );
}

export default LoginPage;
