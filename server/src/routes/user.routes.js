const express = require('express');
const router = express.Router();
const { getDashboard, getMyTasks } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getDashboard);
router.get('/tasks', authMiddleware, getMyTasks);

module.exports = router;
