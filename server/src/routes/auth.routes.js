const express = require('express');
const router = express.Router();
const { signup, login, logout, me, updateProfile, googleLogin, googleCallback, githubLogin, githubCallback } = require('../controllers/auth.controller');
const { signupValidator, loginValidator, updateProfileValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);
router.put('/profile', authMiddleware, updateProfileValidator, validate, updateProfile);

// OAuth Routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);
router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);

module.exports = router;
