import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RoomPage.css";
import hamburgerIcon from './assets/hamburgermenu.png';
import timerIcon from './assets/timer.png';
import arrowIcon from './assets/arrow.png';
import xIcon from './assets/x.png';


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
  const [aiResponse, setAiResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Add state for chat history
  const [countdownTime, setCountdownTime] = useState(null); // in seconds
  const [displayTime, setDisplayTime] = useState(""); // "00:00"
  const [showTimerEndPopup, setShowTimerEndPopup] = useState(false);
  const bgMusic = useRef(null);
  const timerSound = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  useEffect(() => {
    bgMusic.current = new Audio("/bgMusic.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.3;
  
    // try to play right away
    const playPromise = bgMusic.current.play();
  
    // catch autoplay errors
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay blocked — will play after user interaction");
        // fallback: play on next click
        const resumeAudio = () => {
          bgMusic.current.play();
          window.removeEventListener("click", resumeAudio);
        };
        window.addEventListener("click", resumeAudio);
      });
    }
  
    return () => {
      bgMusic.current?.pause();
      bgMusic.current = null;
    };
  }, []);
  
  useEffect(() => {
    timerSound.current = new Audio("/timer.mp3");
    timerSound.current.volume = 0.8;
  }, []);  
    useEffect(() => {
      if (countdownTime === null) return;
      const interval = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            if (timerSound.current) {
              timerSound.current.currentTime = 0;
              timerSound.current.play();
            }
            setShowTimerEndPopup(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [countdownTime]);
  
    useEffect(() => {
      if (countdownTime === null) {
        setDisplayTime("");
        return;
      }
      const h = String(Math.floor(countdownTime / 3600)).padStart(2, '0');
      const m = String(Math.floor((countdownTime % 3600) / 60)).padStart(2, '0');
      const s = String(countdownTime % 60).padStart(2, '0');
      setDisplayTime(`${h}:${m}:${s}`);
    }, [countdownTime]);
  

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
    const email = localStorage.getItem("userEmail"); // Retrieve email from localStorage
    if (!email) {
      alert("No user logged in!");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/get-username?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
      if (data.username) {
        setUsername(data.username);
      } else {
        console.error("Username not found in response");
      }
      })
      .catch((err) => console.error("Failed to fetch username:", err));
  }, []); 

  useEffect(() => {
    const uid = Math.floor(Math.random() * 10000);  // change to get from backend

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

  const handleSendToAI = async () => {
    if (!aiMessage.trim()) return;
  
    try {
      const res = await fetch("http://localhost:3000/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiMessage }),
      });
  
      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [
          ...prev,
          { role: "user", content: aiMessage },
          { role: "ai", content: data.response },
        ]);
        setAiMessage(""); // Clear the input field
      } else {
        alert("Failed to get AI response.");
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      alert("An error occurred while communicating with the AI.");
    }
  };

  useEffect(() => {
    const fetchTodoList = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;
  
      try {
        const res = await fetch(`http://localhost:3000/todo?email=${email}`);
        if (res.ok) {
          const data = await res.json();
          setTodoList(data.map((item) => ({ id: item.id, note: item.note })));
        } else {
          console.error("Failed to fetch to-do list.");
        }
      } catch (error) {
        console.error("Error fetching to-do list:", error);
      }
    };
  
    fetchTodoList();
  }, []);
  
  return (
    <div className="room-container">
      <div className="room-header">
        <h2>{room} — {type === "private" ? "Private Room" : "Public Room"}</h2>
        {displayTime && (
          <div className="countdown-display">
           Time left: {displayTime}
        </div>
        )}
        <div className="top-icons">
          <img src={hamburgerIcon} alt="Menu" className="hamburger" onClick={() => setMenuOpen(!menuOpen)}/>
        </div>
      </div>

      <div className="room-layout">
        <div className="room-inner">
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
        <div className="username-display">{username}</div>
        <img src={skinTones[skinIndex]} alt="Skin" className="edit-avatar base-layer" />
        <img src={hairStyles[hairIndex]} alt="Hair" className="edit-avatar overlay" />

      </div>
    
      {menuOpen && (
        <div className="menu-popup">
          <img src={xIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => setMenuOpen(false)}/>
            <button onClick={() => { setShowTodo(true); setMenuOpen(false); }}>To-Do List</button>
            <button onClick={() => { setShowAI(true); setMenuOpen(false); }}>AI Assistant</button>
            <button onClick={() => { setShowTimer(true); setMenuOpen(false); }}>Timer</button>
            <button onClick={() => alert("Invite clicked")}>Invite</button>
        </div>
        )}

        {showTodo && (
        <div className="todo-popup">
            <div className="todo-header">
            <img src={arrowIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => {setShowTodo(false); setMenuOpen(true);}}/>
            <h3>To-Do List</h3>
            </div>

            <div className="todo-input">
            <input
                type="text"
                placeholder="Add your task"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
            />
            
            <button
              onClick={async () => {
                if (todoInput.trim()) {
                  const email = localStorage.getItem("userEmail");
                  if (!email) return alert("User not logged in.");

                  try {
                    const res = await fetch("http://localhost:3000/todo", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, note: todoInput.trim() }),
                    });

                    if (res.ok) {
                      const newTodo = await res.json(); // Ensure the backend returns the new task with its ID
                      setTodoList((prev) => [...prev, { id: newTodo.id, note: todoInput.trim() }]);
                      setTodoInput(""); // Clear the input field after adding
                    } else {
                      alert("Failed to add to-do item.");
                    }
                  } catch (error) {
                    console.error("Error adding to-do item:", error);
                  }
                }
              }}
            >
              Add
            </button>
            
            </div>

            <ul className="todo-list">
              {todoList.map((task, index) => (
                <li key={task.id}>
                  {task.note}
                  <button
                    className="remove-task"
                    onClick={async () => {
                      try {
                        const res = await fetch("http://localhost:3000/todo", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: task.id }),
                        });

                        if (res.ok) {
                          setTodoList((prev) => prev.filter((t) => t.id !== task.id)); // Filter by ID
                        } else {
                          alert("Failed to delete to-do item.");
                        }
                      } catch (error) {
                        console.error("Error deleting to-do item:", error);
                      }
                    }}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
        </div>
        )}

        {showAI && (
          <div className="ai-popup">
            <div className="ai-header">
            <img src={arrowIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => {setShowAI(false); setMenuOpen(true);}}/>
            </div>

            <div className="ai-chat-history">
              {chatHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`chat-entry ${entry.role === "user" ? "user-message" : "ai-message"}`}
                >
                  <p>{entry.content}</p>
                </div>
              ))}
            </div>

            <div className="ai-body">
            <textarea
              placeholder="Message AI"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
            />
              <button onClick={handleSendToAI}>Send</button>
            </div>
          </div>
        )}

        {showTimer && (
        <div className="timer-popup">
          <img src={arrowIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => {setShowTimer(false); setMenuOpen(true)}}/>
            <h3>Enter Time</h3>
            <div className="time-inputs">
            <input
                type="number"
                min="0"
                max="23"
                value={timerHour}
                onChange={(e) => setTimerHour(e.target.value.padStart(2, '0'))}
            />
            <span>:</span>
            <input
                type="number"
                min="0"
                max="59"
                value={timerMinute}
                onChange={(e) => setTimerMinute(e.target.value.padStart(2, '0'))}
            />
            </div>
            <div className="timer-labels">
              <label>Hour</label>
              <label>Minute</label>  
            </div>
            <div className="timer-buttons">
            <button className="cancel-btn" onClick={() => setShowTimer(false)}>Cancel</button>
            <button className="ok-btn" onClick={() => {
              const totalSeconds = parseInt(timerHour) * 3600 + parseInt(timerMinute) * 60;
              setCountdownTime(totalSeconds);
              setShowTimer(false);
            }}>OK</button>
            </div>
        </div>
        )}
        {showTimerEndPopup && (
          <div className="timer-end-popup">
            <p>⏰ Time’s up!</p>
            <button onClick={() => {
              if (timerSound.current){
                timerSound.current.pause();
                timerSound.current.currentTime = 0;
              }
              setShowTimerEndPopup(false);
            }}>
              Got it
            </button>
          </div>
        )}
      <button
        className="music-toggle-btn"
        onClick={() => {
          if (bgMusic.current.paused) {
            bgMusic.current.play();
            setIsMusicPlaying(true);
          } else {
            bgMusic.current.pause();
            setIsMusicPlaying(false);
          }
        }}
      >
        {bgMusic.current?.paused ? "🔈 Play Music" : "🔇 Mute Music"}
      </button>
      </div>
    </div>
  );
}

export default RoomPage;