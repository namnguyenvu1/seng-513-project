import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import logo from './assets/logo.png';
import backArrow from './assets/backbutton.png';

function ProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User Name");
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet...");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("No user logged in!");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/get-profile?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
        if (data.bio) setBio(data.bio);
      })
      .catch((err) => console.error("Failed to fetch profile data:", err));
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={logo} alt="Logo" className="header-logo" />
        <h2>Your Profile</h2>
        <img src={backArrow} alt="Go Back" className="exit-btn" onClick={() => navigate("/main")} />
      </div>

      <div className="profile-card">
        <button className="edit-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
        <img src="/profile-icon.png" alt="Avatar" className="avatar" />
        <h3>{username}</h3>
        <button className="friends-btn" onClick={() => navigate("/friends")}>
          👥 Friends
        </button>
        <p className="bio">
          <h3>About Me: </h3>
          <p>{bio}</p>
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;