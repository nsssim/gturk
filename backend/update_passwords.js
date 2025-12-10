const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Read database
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Hash the new password "hello" with bcrypt
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync('hello', salt);

console.log('🔑 Updating all user passwords to "hello"...');
console.log('🔐 Hashed password:', hashedPassword);

// Function to update passwords in a user array
function updatePasswords(userArray) {
  return userArray.map(user => ({
    ...user,
    password: hashedPassword
  }));
}

// Update all user types
db.users = updatePasswords(db.users);
db.instructors = updatePasswords(db.instructors);
db.admins = updatePasswords(db.admins);

// Save the updated database
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

console.log('✅ All passwords updated successfully!');
console.log('📝 Updated users:', db.users.length);
console.log('📝 Updated instructors:', db.instructors.length);
console.log('📝 Updated admins:', db.admins.length);
console.log('🔑 All users can now log in with password: "hello"');