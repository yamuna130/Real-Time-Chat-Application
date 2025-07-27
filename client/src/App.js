import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';
import axios from 'axios';

// Base URL setup (optional if you use proxy in package.json)
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Interceptor to catch expired tokens
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={token ? <ChatRoom /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
