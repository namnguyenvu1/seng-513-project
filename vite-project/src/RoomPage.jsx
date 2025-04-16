import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RoomPage.css";
import hamburgerIcon from './assets/hamburgermenu.png';
import timerIcon from './assets/timer.png';
import arrowIcon from './assets/arrow.png';
import AgoraRTC from "agora-rtc-sdk-ng";

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

function RoomPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "public";
  const room = params.get("location") || "Room";
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTodo, setShowTodo] = useState(false);
  const [todoInput, setTodoInput] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [timerHour, setTimerHour] = useState("00");
  const [timerMinute, setTimerMinute] = useState("00");

  const [avatarPosition, setAvatarPosition] = useState({ top: 100, left: 100 }); // Initial position
 
  // States for user profile
  const [skinIndex, setSkinIndex] = useState(0);
  const [hairIndex, setHairIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

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

    // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 15; // Movement step size
      const roomContainer = document.querySelector(".room-container");
      const containerRect = roomContainer.getBoundingClientRect();

      setAvatarPosition((prevPosition) => {
        let newTop = prevPosition.top;
        let newLeft = prevPosition.left;

        if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
          newTop = Math.max(0, prevPosition.top - step);
        } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
          newTop = Math.min(containerRect.height - 100, prevPosition.top + step); // 100 is avatar height
        } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
          newLeft = Math.max(0, prevPosition.left - step);
        } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
          newLeft = Math.min(containerRect.width - 100, prevPosition.left + step); // 100 is avatar width
        }

        return { top: newTop, left: newLeft };
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Agora setup
  const appId = "555ddb47a67643abbf6e20f62f0e59fa";
  const token = null; // Add your token here if needed
  const rtc = {
    client: null,
    localAudioTrack: null,
  };

  useEffect(() => {
    const uid = Math.floor(Math.random() * 10000);

    const initAgora = async () => {
      rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      rtc.client.on("user-published", async (user, mediaType) => {
        await rtc.client.subscribe(user, mediaType);
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      rtc.client.on("user-left", (user) => {
        console.log("User left the voice chat:", user.uid);
      });

      await rtc.client.join(appId, room, token, uid);
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await rtc.client.publish([rtc.localAudioTrack]);

      console.log(`Joined room "${room}" as UID ${uid}`);
    };

    initAgora();

    return () => {
      rtc.localAudioTrack?.stop();
      rtc.localAudioTrack?.close();
      rtc.client?.leave();
    };
  }, [room]);

  
  return (
    <div className="room-container">
      <div className="room-header">
        <h2>{room} — {type === "private" ? "Private Room" : "Public Room"}</h2>
        <div className="top-icons">
          <img src={timerIcon} alt="Timer" className="timer" onClick={() => setShowTimer(true)} />
          <img src={hamburgerIcon} alt="Menu" className="hamburger" onClick={() => setMenuOpen(!menuOpen)}/>
        </div>
      </div>

      <div className="room-layout">
        <div className="reminder">
          📌 Click on the door to go back to room select
          <button className="door-overlay" onClick={() => navigate("/main")}></button>
        </div>
        <div className="voice-status">
          🔊 Voice chat active in: <strong>{room}</strong>
        </div>
      </div>

      {/* Movable User Avatar */}
      <div
        className="avatar-stack"
        style={{
          position: "absolute",
          top: avatarPosition.top,
          left: avatarPosition.left,
        }}
      >
        <img src={skinTones[skinIndex]} alt="Skin" className="edit-avatar base-layer" />
        <img src={hairStyles[hairIndex]} alt="Hair" className="edit-avatar overlay" />
      </div>
    
      {menuOpen && (
        <div className="menu-popup">
          <img src={arrowIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => setMenuOpen(false)}/>
          <button onClick={() => { setShowTodo(true); setMenuOpen(false); }}>To-Do List</button>
          <button onClick={() => { setShowAI(true); setMenuOpen(false); }}>AI Assistant</button>
          <button onClick={() => alert("Invite clicked")}>Invite</button>
        </div>
      )}

      {showTodo && (
        <div className="todo-popup">
          <div className="todo-header">
            <h3>To-Do List</h3>
            <button onClick={() => setShowTodo(false)}>Return</button>
          </div>

          <div className="todo-input">
            <input
              type="text"
              placeholder="Add your task"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
            <button onClick={() => {
              if (todoInput.trim()) {
                setTodoList([...todoList, todoInput.trim()]);
                setTodoInput("");
              }
            }}>Add</button>
          </div>

          <ul className="todo-list">
            {todoList.map((task, index) => (
              <li key={index}>
                {task}
                <button className="remove-task" onClick={() => {
                  const updated = [...todoList];
                  updated.splice(index, 1);
                  setTodoList(updated);
                }}>x</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAI && (
        <div className="ai-popup">
          <div className="ai-header">
            <button onClick={() => setShowAI(false)}>← return</button>
          </div>

          <div className="ai-body">
            <input
              type="text"
              placeholder="Message AI"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
            />
            <button
              onClick={() => {
                if (aiMessage.trim()) {
                  alert("Sent to AI: " + aiMessage);
                  setAiMessage("");
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

{showTimer && (
  <div className="timer-popup">
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h3 style={{ fontWeight: 'bold', textAlign: 'center'}}>Enter Time</h3>
      <img src={arrowIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => setShowTimer(false)}/>
    </div>

    <div className="time-inputs">
      <input
        type="number"
        min="0"
        max="23"
        value={timerHour}
        onChange={(e) => setTimerHour(e.target.value.padStart(2, '0'))}
      />
      <span style={{ fontSize: '1.5rem', lineHeight: '40px' }}>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={timerMinute}
        onChange={(e) => setTimerMinute(e.target.value.padStart(2, '0'))}
      />
    </div>

    <div className="timer-labels">
      <span>Hour</span>
      <span>Minute</span>
    </div>

    <div className="timer-buttons">
      <button className="cancel-btn" onClick={() => setShowTimer(false)}>Cancel</button>
      <button className="ok-btn" onClick={() => {
        alert(`Timer set to ${timerHour}:${timerMinute}`);
        setShowTimer(false);
      }}>OK</button>
    </div>
  </div>
)}
    </div>
  );
}

export default RoomPage;

