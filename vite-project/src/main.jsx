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


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/friends" element={<FriendsListPage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} /> {/* Add this route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
