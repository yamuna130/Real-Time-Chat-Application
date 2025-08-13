import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text, fileUrl } = req.body;
    const msg = await Message.create({ senderId, receiverId, text, fileUrl });
    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

