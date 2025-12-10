const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Read database
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Hash the password "hello" with bcrypt (same as other users)
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('hello', salt);

console.log('📚 Adding student1 and student2 to the database...');

// Add student1
const student1 = {
  id: "student1",
  name: "Student One",
  email: "student1@example.com",
  password: hashedPassword,
  role: "user",
  purchasedCourses: []
};

// Add student2
const student2 = {
  id: "student2",
  name: "Student Two",
  email: "student2@example.com",
  password: hashedPassword,
  role: "user",
  purchasedCourses: []
};

// Add students to the users array
db.users.push(student1, student2);

console.log('✅ Students added successfully:');
console.log('📝 Student 1:', student1.email, '| Password: hello');
console.log('📝 Student 2:', student2.email, '| Password: hello');

// Save the updated database
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

console.log('💾 Database updated with', db.users.length, 'total users');