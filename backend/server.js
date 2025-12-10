const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { initialize: initializeDatabase } = require('./database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file path
const DB_PATH = path.join(__dirname, 'db.json');

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Course routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

// Payment routes
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

// Matching routes
const matchingRoutes = require('./routes/matchingRoutes');
app.use('/api/matching', matchingRoutes);

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Initialize in-memory database
initializeDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;