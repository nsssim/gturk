const { getDatabase, saveDatabase } = require('../database');

// Use the in-memory database functions directly
const readDatabase = () => getDatabase();
const writeDatabase = () => saveDatabase();

// Get all courses
const getAllCourses = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const courses = db.courses || [];
  res.json(courses);
};

// Get course by ID
const getCourseById = (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const courses = db.courses || [];
  const course = courses.find(course => course.id === id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(course);
};

// Get courses by instructor
const getCoursesByInstructor = (req, res) => {
  const { instructorId } = req.params;
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const courses = db.courses || [];
  const instructorCourses = courses.filter(course => course.instructor === instructorId);

  res.json(instructorCourses);
};

// Get user's purchased courses
const getPurchasedCourses = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const users = db.users || [];
  const user = users.find(user => user.id === req.user.id);

  if (!user) {
    // Return empty array instead of error for better UX
    return res.json([]);
  }

  const courses = db.courses || [];
  const purchasedCourses = courses.filter(course => user.purchasedCourses.includes(course.id));

  res.json(purchasedCourses);
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCoursesByInstructor,
  getPurchasedCourses
};