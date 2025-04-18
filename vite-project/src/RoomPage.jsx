import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RoomPage.css";
import hamburgerIcon from './assets/hamburgermenu.png';
import timerIcon from './assets/timer.png';
import arrowIcon from './assets/arrow.png';
import { useEffect } from "react";


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
 

    useEffect(() => {
      if (countdownTime === null) return;
      const interval = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
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
          ⏳ Time left: {displayTime}
        </div>
        )}
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
            <div className="return-button-container">
                <button onClick={() => setShowTodo(false)}>Return</button>
            </div>
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
              <button onClick={() => setShowAI(false)}>← return</button>
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
              const totalSeconds = parseInt(timerHour) * 3600 + parseInt(timerMinute) * 60;
              setCountdownTime(totalSeconds);
              setShowTimer(false);
            }}>OK</button>
            </div>
        </div>
        )}



    </div>
  );
}

export default RoomPage;
