// server/socket.js
export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`⚡ New user connected: ${socket.id}`);

    // Handle joining a chat room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`📢 User ${socket.id} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', (data) => {
      const { roomId, message } = data;
      io.to(roomId).emit('receiveMessage', { message, sender: socket.id });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
