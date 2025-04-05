import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfilePage.css";
import backArrow from './assets/backbutton.png';
import logo from './assets/logo.png'; // adjust path if needed

const avatars = [
  "/avatar1.png",
  "/avatar2.png",
  "/avatar3.png"
]; // placeholder paths for avatar options

function EditProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User Name");
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet...");
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleCycleAvatar = () => {
    setAvatarIndex((prev) => (prev + 1) % avatars.length);
  };

  const handleSave = () => {
    // save to backend later
    alert("Changes saved!");
    navigate("/profile");
  };

  return (
    <div className="edit-container">
      <div className="edit-header">
      <img src={logo} alt="Logo" className="header-logo" />
      <img src={backArrow} alt="Go Back" className="exit-btn" onClick={() => navigate("/main")}/>
      </div>

      <div className="edit-card">
        <div className="edit-actions">
          <button className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>

        <div className="avatar-section">
          <button className="cycle-btn" onClick={handleCycleAvatar}>↻</button>
          <img src={avatars[avatarIndex]} alt="Avatar" className="edit-avatar" />
        </div>

        <input
          className="username-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <textarea
          className="bio-input"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
    </div>
  );
}

export default EditProfilePage;
