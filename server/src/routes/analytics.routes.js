const express = require('express');
const { getAnalyticsInsights } = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Get aggregated metrics and AI insights
router.get('/insights', authMiddleware, getAnalyticsInsights);

module.exports = router;
