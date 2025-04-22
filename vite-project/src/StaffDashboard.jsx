import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // Collapse control states
  const [showCreateUserSection, setShowCreateUserSection] = useState(false);
  const [showChangePasswordSection, setShowChangePasswordSection] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("staffName"); // Clear session data
    navigate("/admin-login"); // Redirect to login page
  };

  const handleCreateUser = async () => {
    const res = await fetch("http://localhost:3000/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      alert("User created successfully.");
      setNewUser({ email: "", password: "" });
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
    const message = await res.text();

    if (res.ok) {
      alert("Password updated successfully.");
    } else {
      alert(`Error: ${message}`);
    }
    setEmail("");
    setNewPassword("");
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

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button onClick={handleLogout} style={{ color: "red", cursor: "pointer" }}>
          Logout
        </button>
      </div>


      <h1>Staff Dashboard</h1>

      {/* Toggle header */}
      <h2
        onClick={() => setShowCreateUserSection((prev) => !prev)}
        style={{ cursor: "pointer", color: "blue"}}
      >
        {showCreateUserSection ? "▼" : "▶"} Create User
      </h2>
      {showCreateUserSection && (
        <div>
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
        </div>
      )}

      <h2
        onClick={() => setShowChangePasswordSection((prev) => !prev)}
        style={{ cursor: "pointer", color: "blue"}}
      >
        {showChangePasswordSection ? "▼" : "▶"} Change User Password
      </h2>
      {showChangePasswordSection && (
        <div>
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
      )}
    </div>
  );
}

export default StaffDashboard;