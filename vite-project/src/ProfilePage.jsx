import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import logo from './assets/logo.png';
import backArrow from './assets/backbutton.png';


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

function ProfilePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User Name");
  const [bio, setBio] = useState("Bio goes here...");


    // States for user profile
    const [skinIndex, setSkinIndex] = useState(0);
    const [hairIndex, setHairIndex] = useState(0);


    
  
    const skinTones = [skin1, skin2, skin3];
    const hairStyles = [hair1, hair2, hair3, hair4, hair5, hair6, hair7];
  

  // Fetch user profile data
  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // Retrieve email from localStorage
    if (!email) {
      alert("No user logged in!");
      navigate("/login");
      return;
    }

    // Fetch user profile data from the backend
    fetch(`http://localhost:3000/get-profile?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.skin) {
          const skinIdx = skinTones.findIndex((skin) => skin.includes(data.skin));
          if (skinIdx !== -1) setSkinIndex(skinIdx);
        }
        if (data.hair) {
          const hairIdx = hairStyles.findIndex((hair) => hair.includes(data.hair));
          if (hairIdx !== -1) setHairIndex(hairIdx);
        }
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
      <div className="avatar-row">
            <div className="avatar-stack">
              <img src={skinTones[skinIndex]} alt="Skin" className="edit-avatar base-layer" />
              <img src={hairStyles[hairIndex]} alt="Hair" className="edit-avatar overlay" />
            </div>
      </div>
        <button className="edit-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
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