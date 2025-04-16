import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import ResetPasswordPage from "./ResetPasswordPage.jsx";
import MainPage from "./MainPage";
import ProfilePage from "./ProfilePage";
import EditProfilePage from "./EditProfilePage";
import FriendsListPage from "./FriendsListPage";
import RoomPage from "./RoomPage";
import AdminLoginPage from "./AdminLoginPage.jsx"; // Import the AdminLoginPage component
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import ChangeStaffPassword from "./ChangeStaffPassword";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx"; // Import ProtectedRoute
import UserProtectedRoute from "./UserProtectedRoute.jsx"; // Import ProtectedRoute

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route
          path="/main"
          element={
            <UserProtectedRoute>
              <MainPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <ProfilePage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <UserProtectedRoute>
              <EditProfilePage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <UserProtectedRoute>
              <FriendsListPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/room"
          element={
            <UserProtectedRoute>
              <RoomPage />
            </UserProtectedRoute>
          }
        />
        {/* <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/friends" element={<FriendsListPage />} />
        <Route path="/room" element={<RoomPage />} /> */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} /> {/* Add this route */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <AdminProtectedRoute>
              <StaffDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/change-staff-password"
          element={
            <AdminProtectedRoute>
              <ChangeStaffPassword />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
