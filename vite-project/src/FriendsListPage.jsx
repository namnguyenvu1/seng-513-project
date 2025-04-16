import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendsListPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from './assets/logo.png';
import backArrow from './assets/backbutton.png';

function FriendsListPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [searchFriends, setSearchFriends] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Fetch friends
    fetch(`http://localhost:3000/friends?email=${currentUserEmail}`)
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch(() => toast.error("Failed to load friends"));

    // Fetch other users
    fetch(`http://localhost:3000/all-users?email=${currentUserEmail}`)
      .then((res) => res.json())
      .then((data) => setOtherUsers(data))
      .catch(() => toast.error("Failed to load users"));
  }, [currentUserEmail]);

  const handleFollow = (friend_email) => {
    fetch("http://localhost:3000/follow-friend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUserEmail, friend_email }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setFriends((prev) => [...prev, otherUsers.find((u) => u.email === friend_email)]);
        setOtherUsers((prev) => prev.filter((u) => u.email !== friend_email));
        toast.success("Friend followed successfully.");
      })
      .catch(() => toast.error("Failed to follow friend."));
  };

  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(searchFriends.toLowerCase())
  );

  const filteredUsers = otherUsers.filter((u) =>
    u.username.toLowerCase().includes(searchUsers.toLowerCase())
  );

  return (
    <div className="friends-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Friends List</h1>
        <img src={backArrow} alt="Go Back" className="exit-btn" onClick={() => navigate("/main")} />
      </div>

      <div className="friends-card">
        <h2>Friends ({friends.length})</h2>
        <div className="search-barFriends">
          <input
            type="text"
            placeholder="Search Friends"
            value={searchFriends}
            onChange={(e) => setSearchFriends(e.target.value)}
          />
        </div>
        <div className="friends-grid">
          {filteredFriends.map((friend, idx) => (
            <div className="friend-card" key={idx}>
              <div>{friend.username}</div>
              {/* Add skin and hair display here if available */}
            </div>
          ))}
        </div>
      </div>

      <div className="friends-card">
        <h2>Other Users You Might Know</h2>
        <div className="search-barFriends">
          <input
            type="text"
            placeholder="Search Users"
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
          />
        </div>
        <div className="friends-grid">
          {filteredUsers.map((user, idx) => (
            <div className="friend-card" key={idx}>
              <div>{user.username}</div>
              {/* Add skin and hair display here if available */}
              <button className="follow-btn" onClick={() => handleFollow(user.email)}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default FriendsListPage;