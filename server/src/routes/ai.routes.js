const express = require('express');
const { extractTasksFromNotes } = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Parse meeting notes into structured tasks
router.post('/meeting-notes', authMiddleware, extractTasksFromNotes);

module.exports = router;
