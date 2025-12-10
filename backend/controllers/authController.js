const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDatabase, saveDatabase } = require('../database');
const JWT_SECRET = 'educational_platform_secret_key';

// Use the in-memory database instead of file operations
const readDatabase = () => getDatabase();
const writeDatabase = () => saveDatabase();

// Register a new user
const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  // Check if user already exists
  const users = db.users || [];
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create new user
  const newUser = {
    id: `user${users.length + 1}`,
    name,
    email,
    password: hashedPassword,
    role,
    purchasedCourses: []
  };

  // Add user to database
  users.push(newUser);
  db.users = users;

  if (!writeDatabase(db)) {
    return res.status(500).json({ error: 'Failed to save user' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
};

// Login user
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  // Find user by email (check all user types)
  const users = db.users || [];
  const instructors = db.instructors || [];
  const admins = db.admins || [];

  let user = users.find(user => user.email === email);
  if (!user) {
    user = instructors.find(instructor => instructor.email === email);
  }
  if (!user) {
    user = admins.find(admin => admin.email === email);
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// Get current user
const getCurrentUser = (req, res) => {
  const db = readDatabase();
  if (!db) {
    return res.status(500).json({ error: 'Database error' });
  }

  const users = db.users || [];
  const user = users.find(user => user.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    purchasedCourses: user.purchasedCourses
  });
};

module.exports = {
  register,
  login,
  getCurrentUser
};