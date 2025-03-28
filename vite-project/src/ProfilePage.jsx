import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <button className="exit-btn" onClick={() => navigate("/main")}>⮌</button>
      </div>

      <div className="profile-card">
        <img src="/profile-icon.png" alt="Avatar" className="avatar" />
        <h3>User Name</h3>
        <button className="friends-btn" onClick={() => navigate("/friends")}>
          👥 Friends
        </button>
        <p className="bio">
          About Me: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Suspendisse maximus est quis mauris scelerisque tincidunt. In hac
          habitasse platea dictumst...
        </p>
        <button className="edit-btn" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
