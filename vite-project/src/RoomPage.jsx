import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RoomPage.css";
import hamburgerIcon from './assets/hamburgermenu.png';
import timerIcon from './assets/timer.png';
import arrowIcon from './assets/arrow.png';
import AgoraRTC from "agora-rtc-sdk-ng";

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
          <img src={arrowIcon} alt="Close" style={{width: "20px",height: "20px", position: "absolute", top: "8px", right: "10px", cursor: "pointer"}} onClick={() => setShowTimer(false)}/>
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
          <div className="timer-buttons">
            <button className="cancel-btn" onClick={() => setShowTimer(false)}>Cancel</button>
            <button className="ok-btn" onClick={() => {
              alert(`Timer set to ${timerHour}:${timerMinute}`);
              setShowTimer(false);
            }}>OK</button>
          </div>
        </div>
      )}

      <div id="members"></div>
    </div>
  );
}

export default RoomPage;

