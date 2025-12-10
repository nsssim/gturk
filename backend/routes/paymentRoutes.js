const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/authMiddleware');

// Purchase a course (protected)
router.post('/purchase', authenticate, paymentController.purchaseCourse);

// Get payment history (protected)
router.get('/history', authenticate, paymentController.getPaymentHistory);

module.exports = router;