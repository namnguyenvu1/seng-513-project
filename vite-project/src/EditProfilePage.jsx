import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfilePage.css";
import backArrow from './assets/backbutton.png';
import logo from './assets/logo.png'; // adjust path if needed

import skin1 from './assets/skin/skin1.png';
import skin2 from './assets/skin/skin2.png';
import skin3 from './assets/skin/skin3.png';
import hair1 from './assets/hair/hair1.png';
import hair2 from './assets/hair/hair2.png';
import hair3 from './assets/hair/hair3.png';
import hair4 from './assets/hair/hair4.png';
import hair5 from './assets/hair/hair5.png';
import hair6 from './assets/hair/hair6.png';
import hair7 from './assets/hair/hair7.png';


function EditProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User Name");
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet...");
  
  const skinTones = [skin1, skin2, skin3];
  const hairStyles = [hair1, hair2, hair3, hair4, hair5, hair6, hair7];
  const [skinIndex, setSkinIndex] = useState(0);
  const [hairIndex, setHairIndex] = useState(0);

 const cycleskin = (dir) => {
    setSkinIndex((prevIndex) => (prevIndex + dir + skinTones.length) % skinTones.length);
  };
 const cyclehair = (dir) => {
    setHairIndex((prevIndex) => (prevIndex + dir + hairStyles.length) % hairStyles.length);
  }

  const handleSave = () => {
    // save to backend later
    alert("Changes saved!");
    navigate("/profile");
  };

  return (
    <div className="edit-container">
      <div className="edit-header">
      <img src={logo} alt="Logo" className="header-logo" />
      <h2>Edit Profile</h2>
      <img src={backArrow} alt="Go Back" className="exit-btn" onClick={() => navigate("/main")}/>
      </div>

      <div className="edit-card">
        <div className="edit-actions">
          <button className="cancel-btn" onClick={() => navigate("/profile")}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>

        <div className="avatar-section">
          <div className="avatar-row">
            <div className="avatar-stack">
              <img src={skinTones[skinIndex]} alt="Skin" className="edit-avatar base-layer" />
              <img src={hairStyles[hairIndex]} alt="Hair" className="edit-avatar overlay" />
            </div>
          </div>

          <div className="avatar-control">
            <button className="cycle-btn" onClick={() => cycleskin(-1)}>⬅</button>
            <span className="avatar-label">Skin</span>
            <button className="cycle-btn" onClick={() => cycleskin(1)}>➡</button>
          </div>

          <div className="avatar-control">
            <button className="cycle-btn" onClick={() => cyclehair(-1)}>⬅</button>
            <span className="avatar-label">Hair</span>
            <button className="cycle-btn" onClick={() => cyclehair(1)}>➡</button>
          </div>
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



