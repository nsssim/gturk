const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Get current user route (protected)
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;