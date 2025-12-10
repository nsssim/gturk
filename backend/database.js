/**
 * In-Memory Database Module
 *
 * This module loads the database from db.json into memory when the server starts
 * and provides CRUD operations that work with the in-memory database.
 * Changes are persisted to db.json periodically and when the server shuts down.
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
let database = null;

// Load database from file into memory
const loadDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    database = JSON.parse(data);
    console.log('✅ Database loaded into memory');
    return true;
  } catch (error) {
    console.error('❌ Error loading database:', error);
    // Initialize with empty database if file doesn't exist
    database = {
      users: [],
      instructors: [],
      admins: [],
      courses: [],
      lessons: []
    };
    return false;
  }
};

// Save database from memory to file
const saveDatabase = () => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2), 'utf8');
    console.log('💾 Database saved to disk');
    return true;
  } catch (error) {
    console.error('❌ Error saving database:', error);
    return false;
  }
};

// Auto-save database every 5 minutes
const setupAutoSave = () => {
  setInterval(() => {
    saveDatabase();
  }, 5 * 60 * 1000); // 5 minutes
};

// Graceful shutdown to save database
const setupGracefulShutdown = () => {
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down...');
    saveDatabase();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('🛑 Shutting down...');
    saveDatabase();
    process.exit(0);
  });
};

// Initialize the database
const initialize = () => {
  if (loadDatabase()) {
    setupAutoSave();
    setupGracefulShutdown();
  }
  return {
    getDatabase: () => database,
    saveDatabase: saveDatabase,
    // Helper methods for common operations
    findUserById: (userId) => database.users.find(user => user.id === userId),
    findCourseById: (courseId) => database.courses.find(course => course.id === courseId),
    findInstructorById: (instructorId) => database.instructors.find(instructor => instructor.id === instructorId)
  };
};

// Database CRUD operations
const db = {
  // Users
  getUsers: () => database.users,
  getUserById: (id) => database.users.find(user => user.id === id),
  addUser: (user) => {
    database.users.push(user);
    saveDatabase();
    return user;
  },
  updateUser: (id, updates) => {
    const userIndex = database.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      database.users[userIndex] = { ...database.users[userIndex], ...updates };
      saveDatabase();
      return database.users[userIndex];
    }
    return null;
  },

  // Courses
  getCourses: () => database.courses,
  getCourseById: (id) => database.courses.find(course => course.id === id),
  addCourse: (course) => {
    database.courses.push(course);
    saveDatabase();
    return course;
  },
  updateCourse: (id, updates) => {
    const courseIndex = database.courses.findIndex(course => course.id === id);
    if (courseIndex !== -1) {
      database.courses[courseIndex] = { ...database.courses[courseIndex], ...updates };
      saveDatabase();
      return database.courses[courseIndex];
    }
    return null;
  },

  // Instructors
  getInstructors: () => database.instructors,
  getInstructorById: (id) => database.instructors.find(instructor => instructor.id === id),
  addInstructor: (instructor) => {
    database.instructors.push(instructor);
    saveDatabase();
    return instructor;
  },
  updateInstructor: (id, updates) => {
    const instructorIndex = database.instructors.findIndex(instructor => instructor.id === id);
    if (instructorIndex !== -1) {
      database.instructors[instructorIndex] = { ...database.instructors[instructorIndex], ...updates };
      saveDatabase();
      return database.instructors[instructorIndex];
    }
    return null;
  },

  // Lessons
  getLessons: () => database.lessons,
  getLessonById: (id) => database.lessons.find(lesson => lesson.id === id),
  addLesson: (lesson) => {
    database.lessons.push(lesson);
    saveDatabase();
    return lesson;
  },
  updateLesson: (id, updates) => {
    const lessonIndex = database.lessons.findIndex(lesson => lesson.id === id);
    if (lessonIndex !== -1) {
      database.lessons[lessonIndex] = { ...database.lessons[lessonIndex], ...updates };
      saveDatabase();
      return database.lessons[lessonIndex];
    }
    return null;
  },

  // Admins
  getAdmins: () => database.admins,
  getAdminById: (id) => database.admins.find(admin => admin.id === id)
};

module.exports = {
  initialize,
  getDatabase: () => database,
  saveDatabase
};