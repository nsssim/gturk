const { getDatabase, saveDatabase } = require('../database');

// Use the in-memory database functions directly
const readDatabase = () => getDatabase();
const writeDatabase = () => saveDatabase();

// Get system statistics
const getSystemStats = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const stats = {
    userCount: db.users?.length || 0,
    instructorCount: db.instructors?.length || 0,
    adminCount: db.admins?.length || 0,
    courseCount: db.courses?.length || 0,
    lessonCount: db.lessons?.length || 0,
    totalRevenue: db.courses?.reduce((sum, course) => sum + (course.students?.length || 0) * course.price, 0) || 0
  };

  res.json(stats);
};

// Get all users (admin only)
const getAllUsers = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const users = db.users || [];
  res.json(users);
};

// Get all instructors (admin only)
const getAllInstructors = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const instructors = db.instructors || [];
  res.json(instructors);
};

// Get all courses (admin only)
const getAllCourses = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const courses = db.courses || [];
  res.json(courses);
};

// Get all lessons (admin only)
const getAllLessons = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const lessons = db.lessons || [];
  res.json(lessons);
};

// Create a new course (admin only)
const createCourse = (req, res) => {
  const { title, description, instructorId, price } = req.body;

  if (!title || !description || !instructorId || price === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  // Check if instructor exists
  const instructors = db.instructors || [];
  const instructorExists = instructors.some(instructor => instructor.id === instructorId);

  if (!instructorExists) {
    return res.status(404).json({ error: 'Instructor not found' });
  }

  // Create new course
  const courses = db.courses || [];
  const newCourse = {
    id: `course${courses.length + 1}`,
    title,
    description,
    instructor: instructorId,
    price,
    students: []
  };

  courses.push(newCourse);
  db.courses = courses;

  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to create course' });
  }

  res.status(201).json({
    message: 'Course created successfully',
    course: newCourse
  });
};

// Update course (admin only)
const updateCourse = (req, res) => {
  const { id } = req.params;
  const { title, description, instructorId, price } = req.body;

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const courses = db.courses || [];
  const courseIndex = courses.findIndex(course => course.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Update course
  if (title) courses[courseIndex].title = title;
  if (description) courses[courseIndex].description = description;
  if (instructorId) courses[courseIndex].instructor = instructorId;
  if (price) courses[courseIndex].price = price;

  db.courses = courses;

  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to update course' });
  }

  res.json({
    message: 'Course updated successfully',
    course: courses[courseIndex]
  });
};

// Delete course (admin only)
const deleteCourse = (req, res) => {
  const { id } = req.params;

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const courses = db.courses || [];
  const courseIndex = courses.findIndex(course => course.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Remove course
  courses.splice(courseIndex, 1);
  db.courses = courses;

  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to delete course' });
  }

  res.json({
    message: 'Course deleted successfully'
  });
};

// Get all admins (admin only)
const getAllAdmins = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const admins = db.admins || [];
  res.json(admins);
};

module.exports = {
  getSystemStats,
  getAllUsers,
  getAllInstructors,
  getAllAdmins,
  getAllCourses,
  getAllLessons,
  createCourse,
  updateCourse,
  deleteCourse
};