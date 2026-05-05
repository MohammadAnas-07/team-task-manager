const express = require('express');
const router = express.Router();
const { signup, login, logout, me } = require('../controllers/auth.controller');
const { signupValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

module.exports = router;
