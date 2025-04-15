import React, { useState } from "react";

function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: "", role: "admin", password: "" });

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

    if (res.ok) {
      alert("Admin/Staff created successfully.");
    } else {
      alert("Failed to create Admin/Staff.");
    }
  };

  const handleDeleteUser = async (email) => {
    const res = await fetch("http://localhost:3000/delete-user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert("User deleted successfully.");
    } else {
      alert("Failed to delete user.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Create Admin/Staff</h2>
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

      <h2>Search User</h2>
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
  );
}

export default AdminDashboard;