const Message = require('../models/Message');

// GET /api/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// POST /api/messages
const sendMessage = async (req, res) => {
  const { text } = req.body;
  const user = req.user; // comes from verified JWT in authMiddleware

  if (!text || !user) {
    return res.status(400).json({ message: 'Text and user required' });
  }

  try {
    const newMessage = new Message({
      user: user.id,
      username: user.username,
      text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

module.exports = { getMessages, sendMessage };
