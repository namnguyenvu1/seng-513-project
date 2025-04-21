import React from "react";
import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children, role }) {
  const userEmail = localStorage.getItem("userEmail");

  // Check if the user is logged in and has the correct role
  if (!userEmail) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default UserProtectedRoute;