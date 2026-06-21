const express = require('express');
const { getProjectActivity } = require('../controllers/activity.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Merge params allows us to mount this under /api/projects/:id/activity
router.get('/', authMiddleware, getProjectActivity);

module.exports = router;
