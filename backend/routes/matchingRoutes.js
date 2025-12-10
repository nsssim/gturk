const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Create lesson request (user only)
router.post('/request', authenticate, authorize(['user']), matchingController.createLessonRequest);

// Get user's lessons (user only)
router.get('/user/lessons', authenticate, authorize(['user']), matchingController.getUserLessons);

// Get instructor's lessons (instructor only)
router.get('/instructor/lessons', authenticate, authorize(['instructor']), matchingController.getInstructorLessons);

// Update lesson status (instructor only)
router.put('/lesson/status', authenticate, authorize(['instructor']), matchingController.updateLessonStatus);

// Get instructors by subject (public)
router.get('/instructors', matchingController.getInstructorsBySubject);

module.exports = router;