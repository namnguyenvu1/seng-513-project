import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateUser = async () => {
    const res = await fetch("http://localhost:3000/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      alert("User created successfully.");
    } else {
      alert("Failed to create user.");
    }
  };

  const handleChangePassword = async () => {
    const res = await fetch("http://localhost:3000/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    if (res.ok) {
      alert("Password updated successfully.");
    } else {
      alert("Failed to update password.");
    }
  };

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <a
          href="#"
          onClick={() => navigate("/change-staff-password")}
          style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
        >
          Change Password
        </a>
      </div>
      <h1>Staff Dashboard</h1>

      <h2>Create User</h2>
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <button onClick={handleCreateUser}>Create</button>

      <h2>Change User Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
}

export default StaffDashboard;