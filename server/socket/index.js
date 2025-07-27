const users = {};         // Maps socket.id => username
const userSockets = {};   // Maps username => socket.id

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a user joins, save their socket and username
    socket.on('join', (username) => {
      users[socket.id] = username;
      userSockets[username] = socket.id;

      // Broadcast updated list of online users
      io.emit('userList', Object.values(userSockets));
    });

    // Public message: broadcast to everyone
    socket.on('sendMessage', (data) => {
      io.emit('message', data); // { user, text }
    });

    // Private message: only to one user
    socket.on('sendPrivateMessage', ({ to, from, text }) => {
      const targetSocketId = userSockets[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit('privateMessage', { from, text });
      }
    });

    // Typing indicator: show to everyone except sender
    socket.on('typing', (username) => {
      socket.broadcast.emit('typing', username);
    });

    // On disconnect, remove user
    socket.on('disconnect', () => {
      const username = users[socket.id];
      delete userSockets[username];
      delete users[socket.id];
      console.log('User disconnected:', socket.id);

      // Broadcast updated list of online users
      io.emit('userList', Object.values(userSockets));
    });
  });
}

module.exports = { setupSocket };
