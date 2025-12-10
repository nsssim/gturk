const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Admin-only routes
router.use(authenticate, authorize(['admin']));

// System statistics
router.get('/stats', adminController.getSystemStats);

// User management
router.get('/users', adminController.getAllUsers);

// Instructor management
router.get('/instructors', adminController.getAllInstructors);

// Admin management
router.get('/admins', adminController.getAllAdmins);

// Course management
router.get('/courses', adminController.getAllCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

// Lesson management
router.get('/lessons', adminController.getAllLessons);

module.exports = router;