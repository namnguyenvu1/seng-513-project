import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RoomPage.css";

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
  
  return (
    <div className="room-container">
      <div className="room-header">
        <h2>{room} — {type === "private" ? "Private Room" : "Public Room"}</h2>
        <div className="top-icons">
          <div className="occupancy">2...</div>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
        </div>
      </div>

      <div className="room-layout">
        <div className="reminder" onClick={() => navigate("/main")}>
          📌 Click here to go back to room select
        </div>

        <div className="center-area">
          <div className="sofa">🛋️</div>
          <div className="table">📘</div>
          <div className="rug"></div>
        </div>

        <div className="walls">
          <div className="wall-item">🖥️</div>
          <div className="wall-item">🖼️</div>
        </div>

        <div className="corners">
          <div className="plant">🌿</div>
          <div className="fruit">🍒</div>
        </div>
      </div>
    
      {menuOpen && (
        <div className="menu-popup">
            <button onClick={() => { setShowTodo(true); setMenuOpen(false); }}>To-do List</button>
            <button onClick={() => { setShowAI(true); setMenuOpen(false); }}>AI Assistant</button>
            <button onClick={() => { setShowTimer(true); setMenuOpen(false); }}>Timer</button>
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



    </div>
  );
}

export default RoomPage;
