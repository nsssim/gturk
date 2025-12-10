const { getDatabase, saveDatabase } = require('../database');

// Use the in-memory database functions directly
const readDatabase = () => getDatabase();
const writeDatabase = () => saveDatabase();

// Find available instructors for a subject
const findAvailableInstructors = (subject, requestedTime) => {
  const db = readDatabase();
  if (!db) {
    return null;
  }

  const instructors = db.instructors || [];

  // Filter instructors by subject and availability
  const availableInstructors = instructors.filter(instructor => {
    // Check if instructor teaches the subject
    if (instructor.subject !== subject) {
      return false;
    }

    // Check if instructor is available at the requested time
    // In a real implementation, this would be more sophisticated
    return instructor.availability.some(slot => {
      return slot.includes(requestedTime.split(' ')[0]); // Check day of week
    });
  });

  return availableInstructors;
};

// Create a live lesson request
const createLessonRequest = (req, res) => {
  const { subject, time, instructorId } = req.body;

  if (!subject || !time) {
    return res.status(400).json({ error: 'Subject and time are required' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  // Use the selected instructor if provided, otherwise find available instructors
  let selectedInstructor;
  if (instructorId) {
    // Find the specific instructor by ID
    selectedInstructor = db.instructors.find(instructor => instructor.id === instructorId);
    if (!selectedInstructor) {
      return res.status(404).json({ error: 'Selected instructor not found' });
    }
  } else {
    // Find available instructors (fallback behavior)
    const availableInstructors = findAvailableInstructors(subject, time);
    if (availableInstructors.length === 0) {
      return res.status(404).json({
        error: 'No available instructors for the requested subject and time'
      });
    }
    // Select the first available instructor (simple matching algorithm)
    selectedInstructor = availableInstructors[0];
  }

  // Create lesson request
  const lessons = db.lessons || [];
  const newLesson = {
    id: `lesson${lessons.length + 1}`,
    userId: req.user.id,
    instructorId: selectedInstructor.id,
    subject: subject,
    time: time,
    status: 'pending'
  };

  lessons.push(newLesson);
  db.lessons = lessons;

  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to create lesson request' });
  }

  // Simulate notification to instructor
  console.log(`[NOTIFICATION] New lesson request for ${selectedInstructor.name} (${subject} at ${time})`);

  res.json({
    message: 'Lesson request created successfully',
    lesson: {
      id: newLesson.id,
      instructor: {
        id: selectedInstructor.id,
        name: selectedInstructor.name,
        subject: selectedInstructor.subject
      },
      subject: subject,
      time: time,
      status: 'pending'
    }
  });
};

// Get user's lesson requests
const getUserLessons = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const lessons = db.lessons || [];
  const userLessons = lessons.filter(lesson => lesson.userId === req.user.id);

  res.json(userLessons);
};

// Get instructor's lesson requests
const getInstructorLessons = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const lessons = db.lessons || [];
  const instructorLessons = lessons.filter(lesson => lesson.instructorId === req.user.id);

  res.json(instructorLessons);
};

// Update lesson status (for instructor to accept/reject)
const updateLessonStatus = (req, res) => {
  const { lessonId, status } = req.body;

  if (!lessonId || !status) {
    return res.status(400).json({ error: 'Lesson ID and status are required' });
  }

  if (!['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const lessons = db.lessons || [];
  const lessonIndex = lessons.findIndex(lesson => lesson.id === lessonId);

  if (lessonIndex === -1) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  // Check if the instructor is authorized to update this lesson
  if (lessons[lessonIndex].instructorId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to update this lesson' });
  }

  // Update lesson status
  lessons[lessonIndex].status = status;
  db.lessons = lessons;

  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to update lesson status' });
  }

  // Simulate notification to user
  console.log(`[NOTIFICATION] Lesson ${status} for user ${lessons[lessonIndex].userId}`);

  res.json({
    message: `Lesson ${status} successfully`,
    lesson: lessons[lessonIndex]
  });
};

// Get instructors by subject
const getInstructorsBySubject = (req, res) => {
  const { subject } = req.query;

  if (!subject) {
    return res.status(400).json({ error: 'Subject parameter is required' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const instructors = db.instructors || [];
  const subjectInstructors = instructors.filter(instructor => instructor.subject === subject);

  res.json(subjectInstructors);
};

module.exports = {
  createLessonRequest,
  getUserLessons,
  getInstructorLessons,
  updateLessonStatus,
  getInstructorsBySubject
};