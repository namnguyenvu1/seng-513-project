import React from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children, role }) {
  const staffName = localStorage.getItem("staffName");

  // Check if the user is logged in and has the correct role
  if (!staffName) {
    return <Navigate to="/admin-login" />;
  }

  return children;
}

export default AdminProtectedRoute;