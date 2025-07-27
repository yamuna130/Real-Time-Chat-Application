const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getMessages, sendMessage } = require('../controllers/messageController');

// Only logged-in users can access these
router.get('/', verifyToken, getMessages);
router.post('/', verifyToken, sendMessage);

module.exports = router;
