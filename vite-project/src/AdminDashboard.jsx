import React, { useState } from "react";

function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: "", role: "admin", password: "" });
  const [adminToDelete, setAdminToDelete] = useState(""); // For deleting admin/staff
  const [adminToChangePassword, setAdminToChangePassword] = useState(""); // For changing password
  const [staffToChangePassword, setStaffToChangePassword] = useState(""); // For changing staff password
  const [newAdminPassword, setNewAdminPassword] = useState(""); // New password for admin
  const [newStaffPassword, setNewStaffPassword] = useState(""); // New password for admin

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

  const handleDeleteAdminStaff = async () => {
    const res = await fetch("http://localhost:3000/delete-admin-staff", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: adminToDelete }),
    });

    if (res.ok) {
      alert("Admin/Staff deleted successfully.");
    } else {
      alert("Failed to delete Admin/Staff.");
    }
  };

  const handleChangeStaffPassword = async () => {
    const res = await fetch("http://localhost:3000/change-staff-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: staffToChangePassword, newStaffPassword }),
    });

    if (res.ok) {
      alert("Staff password updated successfully.");
    } else {
      alert("Failed to update staff password.");
    }
  };

  const handleChangeAdminPassword = async () => {
    const res = await fetch("http://localhost:3000/change-admin-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: adminToChangePassword, newAdminPassword }),
    });

    if (res.ok) {
      alert("Admin password updated successfully.");
    } else {
      alert("Failed to update admin password.");
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

      <h2>Delete Admin/Staff</h2>
      <input
        type="text"
        placeholder="Name"
        value={adminToDelete}
        onChange={(e) => setAdminToDelete(e.target.value)}
      />
      <button onClick={handleDeleteAdminStaff}>Delete</button>

      <h2>Change Admin Password</h2>
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

      <h2>Change Staff Password</h2>
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