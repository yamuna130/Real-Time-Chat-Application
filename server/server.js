// =====================
// Imports
// =====================
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// =====================
// Initialize App & Server
// =====================
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

// =====================
// Import Routes & Sockets
// =====================
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { setupSocket } = require('./socket');

// =====================
// Middleware
// =====================
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================
// Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// =====================
// Socket.IO Setup
// =====================
setupSocket(io);

// =====================
// MongoDB Connection & Server Start
// =====================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    server.listen(5000, () => {
      console.log('✅ Server running on http://localhost:5000');
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
