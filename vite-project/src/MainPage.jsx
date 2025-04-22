import React, { useState } from "react"; 
import "./MainPage.css";
import { Form, useNavigate } from "react-router-dom";
import libraryImg from "./assets/library.png";
import CafeImg from "./assets/cafe.png";
import HomeImg from "./assets/home.png";
import WhitehouseImg from "./assets/whitehouse.png";
import University from "./assets/University.png";
import profileImg from "./assets/profileI.png";
import privateRoom from "./assets/PrivateRoom.webp"; // Fix the import path

import enterRoom from "./AgoraFunc"; // No curly braces for default export

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

  const handlePrivateRoomClick = async () => {
    const inviteLink = prompt("Enter the invite link to join the private room:");
  
    if (!inviteLink) {
      alert("No link provided!");
      return;
    }
  
    try {
      // Extract roomId and type from the invite link
      const urlParams = new URLSearchParams(new URL(inviteLink).search);
      const roomId = urlParams.get("roomId");
      const type = urlParams.get("type");
  
      if (!roomId || !type || type !== "private") {
        alert("Invalid invite link!");
        return;
      }
  
      console.log("Joining Private Room ID:", roomId);
  
      // Navigate to the room page
      navigate(`/room?roomId=${roomId}&type=private`);
      await enterRoom(roomId); // Call enterRoom with the extracted roomId
    } catch (error) {
      console.error("Error parsing invite link:", error);
      alert("Invalid invite link format!");
    }
  };

  const joinRoom = async (type) => {
    setRoomTypePrompt(false); // Hide room type prompt
    let roomId = selectedRoom.toLowerCase(); // Base room name (e.g., "library", "cafe")
  
    if (type === "private") {
      setPrivateConfirm(true); // Show private room confirmation
    } else {
      roomId = `${roomId}-public`; // Append "public" for public rooms
      navigate(`/room?roomId=${roomId}&type=public`);
      await enterRoom(roomId); // Pass the roomId to enterRoom
    }
  
    console.log("Room ID:", roomId);
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
        <div className="room" onClick={(e) => handleRoomClick("Library")}>
          <img className="room-image" src={libraryImg}  />
          <div className="Lib-name">Library</div>
          
        </div>
        <div className="room" onClick={(e) => handleRoomClick("Cafe")}>
          <img className="room-image cafe-img" src={CafeImg} alt="Cafe" />
          <div className="cafe-name">Cafe</div>
         
        </div>
        <div className="room" onClick={(e) => handleRoomClick("University")}>
          <img className="room-image" src={University} alt="University" />
          <div className="Lib-name">University</div>
        </div>
        <div className="room" onClick={(e) => handleRoomClick("Home")}>
          <img className="room-image" src={HomeImg} alt="Home" />
          <div className="Lib-name">Home</div>
        </div>
        <div className="room" onClick={(e) => handleRoomClick("White House")}>
          <img className="room-image whitehouse-img" src={WhitehouseImg} alt="White House" />
          <div className="Lib-name">Whitehouse</div>
        </div>
        <div className="room" onClick={(e) => handlePrivateRoomClick("Join private room")}>
          <img className="room-image whitehouse-img" src={privateRoom} alt="White House" />
          <div className="Lib-name">Join Private Room</div>
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
            <button
                className="yes-btn"
                onClick={async () => {
                  const email = localStorage.getItem("userEmail");
                  const response = await fetch(`http://localhost:3000/get-profile?email=${email}`);
                  const data = await response.json();
                  const userId = data.id;
      
                  const roomId = `${selectedRoom.toLowerCase()}-${userId}`;
                  const inviteLink = `${window.location.origin}/room?roomId=${roomId}&type=private`;
                  console.log("invite link",inviteLink);
                  alert(`Copy Link: ${inviteLink}`);
                  navigate(`/room?location=${selectedRoom}&type=private`);
                  await enterRoom(roomId); // Call enterRoom for private rooms
                  
                }}
              >
                Accept
            </button>


        </div>
        </div>
    </div>
)}

    </div>
  );
}

export default MainPage;