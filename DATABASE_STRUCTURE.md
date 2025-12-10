# Database Structure Documentation

## Initial Database Schema

The database will be stored in `backend/db.json` with the following structure:

```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "password": "string (hashed)",
      "role": "user",
      "purchasedCourses": ["string"]
    }
  ],
  "instructors": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "password": "string (hashed)",
      "role": "instructor",
      "subject": "string",
      "availability": ["string"],
      "students": ["string"]
    }
  ],
  "admins": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "password": "string (hashed)",
      "role": "admin"
    }
  ],
  "courses": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "instructor": "string",
      "price": "number",
      "students": ["string"]
    }
  ],
  "lessons": [
    {
      "id": "string",
      "userId": "string",
      "instructorId": "string",
      "subject": "string",
      "time": "string",
      "status": "pending|confirmed|cancelled"
    }
  ]
}
```

## Sample Initial Data

```json
{
  "users": [
    {
      "id": "user1",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2a$10$N9qo8uLOickgx2ZMRZoMy.MeVqR4JtX9fLlLZ5v5v5v5v5v5v5v5v",
      "role": "user",
      "purchasedCourses": []
    }
  ],
  "instructors": [
    {
      "id": "instructor1",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "password": "$2a$10$N9qo8uLOickgx2ZMRZoMy.MeVqR4JtX9fLlLZ5v5v5v5v5v5v5v5v",
      "role": "instructor",
      "subject": "Mathematics",
      "availability": ["Mon 9-12", "Wed 14-17"],
      "students": []
    },
    {
      "id": "instructor2",
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "password": "$2a$10$N9qo8uLOickgx2ZMRZoMy.MeVqR4JtX9fLlLZ5v5v5v5v5v5v5v5v",
      "role": "instructor",
      "subject": "Physics",
      "availability": ["Tue 10-15", "Thu 13-16"],
      "students": []
    }
  ],
  "admins": [
    {
      "id": "admin1",
      "name": "Admin User",
      "email": "admin@example.com",
      "password": "$2a$10$N9qo8uLOickgx2ZMRZoMy.MeVqR4JtX9fLlLZ5v5v5v5v5v5v5v5v",
      "role": "admin"
    }
  ],
  "courses": [
    {
      "id": "math101",
      "title": "Introduction to Mathematics",
      "description": "Basic math concepts for beginners",
      "instructor": "instructor1",
      "price": 49.99,
      "students": []
    },
    {
      "id": "physics101",
      "title": "Basic Physics",
      "description": "Fundamental physics principles",
      "instructor": "instructor2",
      "price": 59.99,
      "students": []
    }
  ],
  "lessons": []
}
```

## Data Relationships

### User-Course Relationship
- Users have `purchasedCourses` array containing course IDs
- Courses have `students` array containing user IDs
- This creates a many-to-many relationship

### Instructor-Student Relationship
- Instructors have `students` array containing user IDs
- Lessons track the relationship between users and instructors
- This allows for both course-based and lesson-based relationships

### Lesson Management
- Lessons track the specific time and subject
- Lessons have status for workflow management
- Lessons reference both user and instructor

## Data Access Patterns

### Common Queries
1. **Get user's purchased courses**: Find courses where ID is in user.purchasedCourses
2. **Get instructor's students**: Find users where ID is in instructor.students
3. **Find available instructors**: Filter instructors by subject and availability
4. **Get course students**: Find users where ID is in course.students

### Performance Considerations
- JSON file will be loaded into memory on server start
- Regular writes to file system (after each mutation)
- Consider adding indexes for frequently queried fields
- Implement data validation on all operations

## Data Validation Rules

### Users
- Email must be unique
- Password must be hashed
- Role must be one of: "user", "instructor", "admin"

### Courses
- Title must be unique
- Price must be positive number
- Instructor must exist in instructors array

### Lessons
- User and instructor must exist
- Time format must be consistent
- Status must be one of: "pending", "confirmed", "cancelled"

## Backup Strategy

1. **Automatic Backups**: Create backup before each write operation
2. **Version Control**: Commit db.json to git with meaningful messages
3. **Manual Backups**: Regular manual backups during development
4. **Data Validation**: Validate data structure on each load

## Migration Path to Database

When ready to scale:
1. Export JSON data
2. Create MongoDB schemas
3. Import data using migration script
4. Update backend to use MongoDB
5. Test data consistency