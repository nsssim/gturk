const { getDatabase, saveDatabase } = require('../database');

// Use the in-memory database functions directly
const readDatabase = () => getDatabase();
const writeDatabase = () => saveDatabase();

// Mock Stripe payment processing
const processPayment = (amount, cardDetails) => {
  // In a real implementation, this would call Stripe API
  // For this mock, we'll simulate successful payment

  // Basic validation
  if (amount <= 0) {
    return { success: false, error: 'Invalid amount' };
  }

  if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
    return { success: false, error: 'Invalid card details' };
  }

  // Simulate payment processing delay
  const processingTime = Math.random() * 1000 + 500; // 0.5-1.5 seconds

  // Simulate payment success (90% success rate for testing)
  const isSuccess = Math.random() < 0.9;

  if (isSuccess) {
    return {
      success: true,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
  } else {
    return {
      success: false,
      error: 'Payment declined by bank',
      errorCode: 'card_declined'
    };
  }
};

// Purchase a course
const purchaseCourse = async (req, res) => {
  const { courseId, cardDetails } = req.body;

  if (!courseId || !cardDetails) {
    return res.status(400).json({ error: 'Course ID and card details are required' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  // Find the course
  const courses = db.courses || [];
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Process payment
  const paymentResult = processPayment(course.price, cardDetails);

  if (!paymentResult.success) {
    return res.status(400).json({
      error: 'Payment failed',
      details: paymentResult.error
    });
  }

  // Update user's purchased courses
  const users = db.users || [];
  const userIndex = users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Add course to user's purchased courses if not already purchased
  if (!users[userIndex].purchasedCourses.includes(courseId)) {
    users[userIndex].purchasedCourses.push(courseId);
  }

  // Add user to course's students if not already enrolled
  if (!course.students.includes(req.user.id)) {
    course.students.push(req.user.id);
  }

  // Save changes
  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to save purchase' });
  }

  res.json({
    message: 'Course purchased successfully',
    course: {
      id: course.id,
      title: course.title,
      price: course.price
    },
    payment: {
      transactionId: paymentResult.transactionId,
      amount: paymentResult.amount,
      status: paymentResult.status,
      timestamp: paymentResult.timestamp
    }
  });
};

// Get payment history (mock implementation)
const getPaymentHistory = (req, res) => {
  // In a real implementation, this would fetch from a payments table
  // For this mock, we'll return some sample data

  const samplePayments = [
    {
      transactionId: 'txn_sample1',
      courseId: 'math101',
      courseTitle: 'Introduction to Mathematics',
      amount: 49.99,
      status: 'completed',
      timestamp: '2023-12-01T10:30:00Z'
    },
    {
      transactionId: 'txn_sample2',
      courseId: 'physics101',
      courseTitle: 'Basic Physics',
      amount: 59.99,
      status: 'completed',
      timestamp: '2023-11-15T14:45:00Z'
    }
  ];

  res.json(samplePayments);
};

module.exports = {
  purchaseCourse,
  getPaymentHistory
};