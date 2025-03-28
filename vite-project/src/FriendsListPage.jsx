import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendsListPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <div className="friends-header">
        <h2>Friends List</h2>
        <button className="exit-btn" onClick={() => navigate("/profile")}>⮌</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Friend"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // 👈 Live filtering
        />
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

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default FriendsListPage;
