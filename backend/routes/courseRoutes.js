const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate } = require('../middlewares/authMiddleware');

// Get all courses
router.get('/', courseController.getAllCourses);

// Get course by ID
router.get('/:id', courseController.getCourseById);

// Get courses by instructor
router.get('/instructor/:instructorId', courseController.getCoursesByInstructor);

// Get user's purchased courses (protected)
router.get('/purchased', authenticate, courseController.getPurchasedCourses);

module.exports = router;