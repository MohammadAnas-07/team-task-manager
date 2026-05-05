const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, getDashboard);

module.exports = router;
