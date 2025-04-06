import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendsListPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from './assets/logo.png';
import backArrow from './assets/backbutton.png';

function FriendsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch(() => toast.error("Failed to load friends"));
  }, []);

  const handleUnfriend = (name) => {
    fetch("http://localhost:3000/friends/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setFriends((prev) => prev.filter((f) => f.name !== name));
        toast.success(`${name} has been unfriended`);
      })
      .catch(() => toast.error("Failed to unfriend"));
  };

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="friends-container">
      <div className="top-bar">
        <img src={logo} alt="Logo" className="header-logo" />
        <h1 className="header-title">Friends List</h1>
        <img src={backArrow} alt="Go Back" className="exit-btn" onClick={() => navigate("/main")}/>
      </div>

      <div className="friends-card">
  <div className="search-barFriends">
    <input
      type="text"
      placeholder="Search Friend"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button className="search-barFriends">Search</button>
  </div>

  <div className="friends-grid">
    {filteredFriends.map((friend, idx) => (
      <div className="friend-card" key={idx}>
        <img src={friend.avatar} alt="avatar" className="friend-avatar" />
        <div>{friend.name}</div>
        <button className="unfriend-btn" onClick={() => handleUnfriend(friend.name)}>
          Unfriend
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
