// Chat Application Frontend
// App.js - Main component

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Connect to backend (change URL in production)
const socket = io('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Message history when joining
    socket.on('message_history', (messageHistory) => {
      setMessages(messageHistory);
    });

    // New message received
    socket.on('new_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    // User joined event
    socket.on('user_joined', (data) => {
      setUsers(data.userList);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          system: true,
          text: `${data.user.username} joined the chat`,
          time: data.time
        }
      ]);
      scrollToBottom();
    });

    // User left event
    socket.on('user_left', (data) => {
      setUsers(data.userList);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          system: true,
          text: `${data.username} left the chat`,
          time: data.time
        }
      ]);
      scrollToBottom();
    });

    // Typing indicator
    socket.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [...prev.filter(user => user.id !== data.user.id), data.user]);
      } else {
        setTypingUsers((prev) => prev.filter(user => user.id !== data.user.id));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message_history');
      socket.off('new_message');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('user_join', username);
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { text: message });
      setMessage('');
      // Stop typing indicator
      socket.emit('typing', false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit('typing', e.target.value.length > 0);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Chat App</h1>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
            />
            <button type="submit">Join Chat</button>
          </form>
          <div className="connection-status">
            {isConnected ? (
              <span className="status online">Server online</span>
            ) : (
              <span className="status offline">Server offline</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main chat screen
  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Online Users</h2>
        </div>
        <div className="users-list">
          {users.map(user => (
            <div key={user.id} className="user-item">
              <span className="user-avatar">{user.username.charAt(0)}</span>
              <span className="user-name">{user.username}</span>
              {typingUsers.some(typingUser => typingUser.id === user.id) && (
                <span className="typing-indicator">typing...</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
        <div className="chat-header">
          <h1>Chat Room</h1>
          <div className="user-profile">
            <span className="user-avatar self">{username.charAt(0)}</span>
            <span className="user-name">{username}</span>
          </div>
        </div>
        <div className="messages-container">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`message ${msg.system ? 'system-message' : msg.user?.id === socket.id ? 'own-message' : 'other-message'}`}
            >
              {!msg.system && (
                <div className="message-header">
                  <span className="message-username">{msg.user?.id === socket.id ? 'You' : msg.user?.username}</span>
                  <span className="message-time">{formatTime(msg.time)}</span>
                </div>
              )}
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {typingUsers.length > 0 && (
            <div className="typing-container">
              {typingUsers.length === 1 
                ? `${typingUsers[0].username} is typing...`
                : `${typingUsers.length} people are typing...`}
            </div>
          )}
        </div>
        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type a message..."
            autoFocus
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
