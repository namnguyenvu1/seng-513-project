import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: "", role: "admin", password: "" });
  const [adminToDelete, setAdminToDelete] = useState("");
  const [adminToChangePassword, setAdminToChangePassword] = useState("");
  const [staffToChangePassword, setStaffToChangePassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");

  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showAdminPwdSection, setShowAdminPwdSection] = useState(false);
  const [showStaffPwdSection, setShowStaffPwdSection] = useState(false);
  const [showSearchSection, setShowSearchSection] = useState(false);

  const [userCount, setUserCount] = useState(0); // State to store user count
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch("http://localhost:3000/user-count");
        if (res.ok) {
          const data = await res.json();
          setUserCount(data.userCount);
        } else {
          console.error("Failed to fetch user count.");
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("staffName");
    navigate("/admin-login");
  };

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3000/search-user?query=${query}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(data);
    } else {
      alert("User not found.");
    }
  };

  const handleCreateAdminStaff = async () => {
    const res = await fetch("http://localhost:3000/create-admin-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAdmin),
    });
    const message = await res.text();

    if (res.ok) {
      alert("Admin/Staff created successfully.");
      setNewAdmin({ name: "", role: "admin", password: "" }); // Clear fields
    } else {
      alert(`Error: ${message}`);
    }
  };

  const handleDeleteAdminStaff = async () => {
    const res = await fetch("http://localhost:3000/delete-admin-staff", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: adminToDelete }),
    });
    const message = await res.text();

    if (res.ok) {
      alert("Admin/Staff deleted successfully.");
      setAdminToDelete(""); // Clear input
    } else {
      alert(`Error: ${message}`);
    }
  };

  const handleChangeStaffPassword = async () => {
    const res = await fetch("http://localhost:3000/change-staff-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: staffToChangePassword, newStaffPassword }),
    });
    const message = await res.text();

    if (res.ok) {
      alert("Staff password updated successfully.");
      setStaffToChangePassword("");
      setNewStaffPassword(""); // Clear input
    } else {
      alert(`Error: ${message}`);
    }
  };

  const handleChangeAdminPassword = async () => {
    const res = await fetch("http://localhost:3000/change-admin-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: adminToChangePassword, newAdminPassword }),
    });
    const message = await res.text(); // get backend response message as plain text
    
    if (res.ok) {
      alert("Admin password updated successfully.");
      setAdminToChangePassword("");
      setNewAdminPassword(""); // Clear input
    } else {
      alert(`Error: ${message}`);
    }
  };

  const handleDeleteUser = async (email) => {
    const res = await fetch("http://localhost:3000/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const message = await res.text();

    if (res.ok) {
      alert("User deleted successfully.");
      setSearchResults((prev) => prev.filter((u) => u.email !== email));
    } else {
      alert(`Error: ${message}`);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button onClick={handleLogout} style={{ color: "red", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <h1>Admin Dashboard</h1>

      {/* Display the user count */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Total Users: {userCount}</h2>
      </div>

      <h2
        onClick={() => setShowCreateSection(!showCreateSection)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {showCreateSection ? "▼" : "▶"} Create Admin/Staff
      </h2>
      {showCreateSection && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <select
            value={newAdmin.role}
            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <button onClick={handleCreateAdminStaff}>Create</button>
        </div>
      )}

      <h2
        onClick={() => setShowDeleteSection(!showDeleteSection)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {showDeleteSection ? "▼" : "▶"} Delete Admin/Staff
      </h2>
      {showDeleteSection && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={adminToDelete}
            onChange={(e) => setAdminToDelete(e.target.value)}
          />
          <button onClick={handleDeleteAdminStaff}>Delete</button>
        </div>
      )}

      <h2
        onClick={() => setShowAdminPwdSection(!showAdminPwdSection)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {showAdminPwdSection ? "▼" : "▶"} Change Admin Password
      </h2>
      {showAdminPwdSection && (
        <div>
          <input
            type="text"
            placeholder="Admin Name"
            value={adminToChangePassword}
            onChange={(e) => setAdminToChangePassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
          />
          <button onClick={handleChangeAdminPassword}>Change Admin Password</button>
        </div>
      )}

      <h2
        onClick={() => setShowStaffPwdSection(!showStaffPwdSection)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {showStaffPwdSection ? "▼" : "▶"} Change Staff Password
      </h2>
      {showStaffPwdSection && (
        <div>
          <input
            type="text"
            placeholder="Staff Name"
            value={staffToChangePassword}
            onChange={(e) => setStaffToChangePassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newStaffPassword}
            onChange={(e) => setNewStaffPassword(e.target.value)}
          />
          <button onClick={handleChangeStaffPassword}>Change Staff Password</button>
        </div>
      )}

      <h2
        onClick={() => setShowSearchSection(!showSearchSection)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {showSearchSection ? "▼" : "▶"} Search User
      </h2>
      {showSearchSection && (
        <div>
          <input
            type="text"
            placeholder="Email or Username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <ul>
            {searchResults.map((user) => (
              <li key={user.email}>
                {user.email} - {user.username} - {user.skin} - {user.hair} - {user.bio}
                <button onClick={() => handleDeleteUser(user.email)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
