import React, { useState } from "react"; 
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import libraryImg from "./assets/library.png";
import CafeImg from "./assets/cafe.png";
import HomeImg from "./assets/home.png";
import WhitehouseImg from "./assets/whitehouse.png";
import University from "./assets/university.png";
import profileImg from "./assets/profileI.png";

function MainPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomTypePrompt, setRoomTypePrompt] = useState(false);
  const [privateConfirm, setPrivateConfirm] = useState(false);


  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleProfile = () => navigate("/profile");

  const handleSignOut = () => {
    setShowConfirm(true);
    setDropdownOpen(false);
  };

  const confirmSignOut = () => {
    setShowConfirm(false);
    localStorage.removeItem("userEmail"); // So that when logout, the login infor will be clear
    navigate("/login");
  };

  const cancelSignOut = () => {
    setShowConfirm(false);
  };

  const handleRoomClick = (roomName) => {
    setSelectedRoom(roomName);
    setRoomTypePrompt(true);
  };

  const joinRoom = (type) => {
    setRoomTypePrompt(false);
  
    if (type === "private") {
      setPrivateConfirm(true); // new confirm layer
    } else {
      navigate(`/room?location=${selectedRoom}&type=public`);
    }
  };
  

  return (
  
    <div className="main-container">
      <div className="top-bar">
        <h2>Room Selection</h2>
        <div className="profile-wrapper">
          <img
            src={profileImg}
            alt="Profile"
            className="profile-icon"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="dropdown">
              <button onClick={handleProfile}>Profile</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
  
      <div className="rooms-grid">
        <div className="room" onClick={() => handleRoomClick("Library")}>
          <img className="room-image" src={libraryImg}  />
          <div className="Lib-name">Library</div>
          
        </div>
        <div className="room" onClick={() => handleRoomClick("Cafe")}>
          <img className="room-image cafe-img" src={CafeImg} alt="Cafe" />
          <div className="cafe-name">Cafe</div>
         
        </div>
        <div className="room" onClick={() => handleRoomClick("University")}>
          <img className="room-image" src={University} alt="University" />
          <div className="Lib-name">University</div>
        </div>
        <div className="room" onClick={() => handleRoomClick("Home")}>
          <img className="room-image" src={HomeImg} alt="Home" />
          <div className="Lib-name">Home</div>
        </div>
        <div className="room" onClick={() => handleRoomClick("White House")}>
          <img className="room-image whitehouse-img" src={WhitehouseImg} alt="White House" />
          <div className="Lib-name">Whitehouse</div>
        </div>
      </div>

      {/* Sign Out Confirmation Overlay */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3 classame="signout-title">Sign Out?</h3>
            <div className="confirm-buttons">
              <button className="no-btn" onClick={cancelSignOut}>No</button>
              <button className="yes-btn" onClick={confirmSignOut}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Room Type Selection Popup */}
      {roomTypePrompt && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3 className="room-type-title">Pick your Room Type</h3>
            <div className="confirm-buttons">
            <button className="public-btn" onClick={() => joinRoom("public")}>Public</button>
            <button className="private-btn" onClick={() => joinRoom("private")}>Private</button>
          </div>

          </div>
        </div>
      )}

    {privateConfirm && (
    <div className="confirm-overlay">
        <div className="confirm-box">
        <h3 className = "private-creation-title">Create Private Room</h3>
        <div className="confirm-buttons">
            <button className="no-btn" onClick={() => setPrivateConfirm(false)}>Cancel</button>
            <button className="yes-btn" onClick={() => navigate(`/room?location=${selectedRoom}&type=private`)}>Accept</button>
        </div>
        </div>
    </div>
)}

    </div>
  );
}

export default MainPage;
