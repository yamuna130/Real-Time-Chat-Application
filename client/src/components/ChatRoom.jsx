import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChatRoom.css'; // ✅ Import CSS styles

const socket = io('http://localhost:5000');

function ChatRoom() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMessages(res.data))
      .catch(err => console.error('Could not load messages', err));
  }, [token]);

  useEffect(() => {
    socket.connect();
    socket.emit('join', username);

    socket.on('message', msg => setMessages(prev => [...prev, msg]));
    socket.on('privateMessage', msg => setPrivateMessages(prev => [...prev, msg]));
    socket.on('typing', user => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(''), 2000);
    });
    socket.on('userList', users => setOnlineUsers(users));

    return () => {
      socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    let fileUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await axios.post('http://localhost:5000/api/upload/file', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        fileUrl = res.data.fileUrl;
      } catch (err) {
        console.error('File upload failed', err);
        return;
      }
    }

    if (selectedUser) {
      socket.emit('sendPrivateMessage', {
        to: selectedUser,
        from: username,
        text,
        fileUrl
      });
      setPrivateMessages(prev => [...prev, { from: `You → ${selectedUser}`, text, fileUrl }]);
    } else {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/messages',
          { text, fileUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        socket.emit('sendMessage', {
          user: username,
          text: res.data.text,
          fileUrl: res.data.fileUrl
        });
      } catch (err) {
        console.error('Send failed', err);
      }
    }

    setText('');
    setFile(null);
  };

  const handleTyping = () => {
    socket.emit('typing', username);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    socket.disconnect();
    navigate('/');
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h2>Welcome, {username}</h2>
        <div>
          <button onClick={() => setDarkMode(prev => !prev)} className="button">
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={handleLogout} className="button">Logout</button>
        </div>
      </div>

      {/* Online Users */}
      <div>
        <h4>Online Users:</h4>
        <ul className="online-list">
          {onlineUsers.map((u, i) => (
            <li key={i}>
              <button
                className={`button user-button ${selectedUser === u ? 'active-user' : ''}`}
                onClick={() => setSelectedUser(u)}
              >
                {u}
              </button>
            </li>
          ))}
        </ul>
        {selectedUser && (
          <p>
            Private chat with <strong>{selectedUser}</strong>{' '}
            <button onClick={() => setSelectedUser(null)} className="button">Cancel</button>
          </p>
        )}
      </div>

      {/* Public Chat */}
      <div className="chat-box">
        <h4>Public Chat</h4>
        <div className="message-area">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              {msg.text && <strong>{msg.username}:</strong>} {msg.text}
              {msg.fileUrl && (
                <div>
                  {msg.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img src={msg.fileUrl} alt="uploaded" className="uploaded-image" />
                  ) : (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">Download File</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Typing Indicator */}
      {typingUser && <p className="typing">{typingUser} is typing...</p>}

      {/* Private Messages */}
      <div className="chat-box">
        <h4>Private Messages</h4>
        <div className="message-area">
          {privateMessages.map((msg, i) => (
            <div key={i} className="message">
              {msg.text && <strong>{msg.from}:</strong>} {msg.text}
              {msg.fileUrl && (
                <div>
                  {msg.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <img src={msg.fileUrl} alt="uploaded" className="uploaded-image" />
                  ) : (
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">Download File</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 📁 File Upload Button */}
      <label className="file-label">
        📁 Upload File
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />
      </label>

      {/* Message input + Send */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleTyping}
        placeholder={selectedUser ? 'Send private message...' : 'Send public message...'}
        className="text-input"
      />
      <button onClick={handleSend} className="button send-button">Send</button>
    </div>
  );
}

export default ChatRoom;