import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import logo from './assets/logo.png'; // adjust path if needed
import backArrow from './assets/backbutton.png';

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={logo} alt="Logo" className="header-logo" />
        <h2>Your Profile</h2>
        <img src={backArrow} alt="Go Back" className="exit-btn" onClick={() => navigate("/main")}/>
      </div>

      <div className="profile-card">
          <button className="edit-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
        <img src="/profile-icon.png" alt="Avatar" className="avatar" />
        <h3>User Name</h3>
        <button className="friends-btn" onClick={() => navigate("/friends")}>
          👥 Friends
        </button>
        <p className="bio">
          <h3>About Me: </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Suspendisse maximus est quis mauris scelerisque tincidunt. In hac
          habitasse platea dictumst...</p>
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
