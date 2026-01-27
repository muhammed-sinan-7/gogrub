import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat([...chat, userMsg]);
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}chat/`,
        { message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setChat((prev) => [...prev, { role: "bot", text: response.data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChat((prev) => [...prev, { role: "bot", text: "Service temporarily busy." }]);
    }
  };

  const clearChat = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}chat/clear/`, {}, { withCredentials: true });
      setChat([]);
    } catch (error) {
      console.error("Clear chat error:", error);
    }
  };

  return (
    <div className="gg-chatbot-wrapper">
      {/* Premium Floating Button */}
      <button className={`gg-fab ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <span className="gg-close-icon">✕</span> : <span className="gg-chat-icon">🧡</span>}
      </button>

      {/* Modern Chat Window */}
      {isOpen && (
        <div className="gg-chat-window">
          {/* Header */}
          <div className="gg-header">
            <div className="gg-header-info">
              <div className="gg-avatar-pulse">
                <span className="gg-avatar-emoji">🍕</span>
                <span className="gg-online-dot"></span>
              </div>
              <div>
                <h4>GoGrub AI</h4>
                <p>Always hungry to help</p>
              </div>
            </div>
            <div className="gg-header-btns">
              <button onClick={clearChat} className="gg-icon-btn" title="Clear conversation">🗑️</button>
              <button onClick={() => setIsOpen(false)} className="gg-icon-btn">✕</button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="gg-chat-body">
            {chat.length === 0 ? (
              <div className="gg-welcome">
                <div className="gg-welcome-card">
                  <h3>Welcome to GoGrub! 🍔</h3>
                  <p>I can help you find the best deals or track your sushi order.</p>
                </div>
              </div>
            ) : (
              chat.map((msg, i) => (
                <div key={i} className={`gg-msg-row ${msg.role}`}>
                  <div className={`gg-bubble ${msg.role}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="gg-input-area">
            <div className="gg-input-field-container">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="gg-input"
              />
              <button type="submit" className="gg-send-btn" disabled={!message.trim()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;