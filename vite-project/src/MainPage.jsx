import React, { useState } from "react"; 
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

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
            src="/profile-icon.png"
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
          <div className="room-image">📚</div>
          <div>Library</div>
        </div>
        <div className="room" onClick={() => handleRoomClick("Cafe")}>
          <div className="room-image">☕</div>
          <div>Cafe</div>
        </div>
        <div className="room" onClick={() => handleRoomClick("University")}>
          <div className="room-image">🏫</div>
          <div>University</div>
        </div>
        <div className="room" onClick={() => handleRoomClick("Home")}>
          <div className="room-image">🏠</div>
          <div>Home</div>
        </div>
        <div className="room" onClick={() => handleRoomClick("White House")}>
          <div className="room-image">🏛️</div>
          <div>White House</div>
        </div>
      </div>

      {/* Sign Out Confirmation Overlay */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Sign Out?</h3>
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
            <h3>Room Type</h3>
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
        <h3>Create Private Room</h3>
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
