# Educational Platform - Backend System

A comprehensive educational platform with role-based authentication, course management, payment simulation, and instructor-student matching.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- Git

### Installation
```bash
# Clone the repository
git clone [your-repository-url]
cd educational-platform

# Install dependencies
cd backend
npm install

# Start the development server
npm run dev

# Or start in production mode
npm start
```

### Git Repository Setup
The project includes a comprehensive `.gitignore` file that excludes:
- Node modules and dependencies
- Environment files
- Logs and temporary files
- IDE-specific files
- Build outputs and test files
- Database files and local development artifacts

## 📦 Project Structure

```
backend/
├── controllers/          # Business logic controllers
├── middlewares/          # Authentication and authorization
├── models/               # Data models (empty - using JSON)
├── routes/               # API routes
├── db.json               # JSON database
├── server.js             # Main server file
├── package.json          # Dependencies
└── test_system.js        # Comprehensive test suite
```

## 🎯 Features Implemented

### 1. **Role-Based Authentication System**
- ✅ User, Instructor, and Admin roles
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with role-based authorization

### 2. **Course Management**
- ✅ Course listing with details
- ✅ Course purchase functionality
- ✅ User purchased courses tracking
- ✅ Instructor course management

### 3. **Payment System (Mock Stripe API)**
- ✅ Simulated credit card processing
- ✅ Payment success/failure simulation
- ✅ Transaction recording
- ✅ Course assignment on successful payment

### 4. **Instructor-Student Matching**
- ✅ Live lesson request system
- ✅ Availability-based instructor matching
- ✅ Lesson status management (pending/confirmed/cancelled)
- ✅ Notification simulation

### 5. **Admin Dashboard**
- ✅ System statistics and analytics
- ✅ User management
- ✅ Instructor management
- ✅ Course management (CRUD)
- ✅ Lesson oversight

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/instructor/:instructorId` - Get courses by instructor
- `GET /api/courses/purchased/me` - Get user's purchased courses

### Payments
- `POST /api/payments/purchase` - Purchase a course
- `GET /api/payments/history` - Get payment history

### Matching System
- `POST /api/matching/request` - Create lesson request
- `GET /api/matching/user/lessons` - Get user's lessons
- `GET /api/matching/instructor/lessons` - Get instructor's lessons
- `PUT /api/matching/lesson/status` - Update lesson status

### Admin Panel
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/instructors` - Get all instructors
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/lessons` - Get all lessons

## 📊 Data Model

### Users
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "user|instructor|admin",
  "purchasedCourses": ["string"]
}
```

### Courses
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "instructor": "string",
  "price": "number",
  "students": ["string"]
}
```

### Lessons
```json
{
  "id": "string",
  "userId": "string",
  "instructorId": "string",
  "subject": "string",
  "time": "string",
  "status": "pending|confirmed|cancelled"
}
```

## 🧪 Testing

### Running Tests
```bash
cd backend
node simple_test.js
```

### Test Coverage
- ✅ Authentication system
- ✅ Course management
- ✅ Payment processing
- ✅ Instructor-student matching
- ✅ Admin functionality

## 🚀 Deployment

### Local Deployment
```bash
# Start the server
cd backend
npm start

# Server will run on http://localhost:5000
```

### Production Deployment Options

#### 1. **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t educational-platform .
docker run -p 5000:5000 educational-platform
```

#### 2. **Heroku Deployment**
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create educational-platform-backend

# Deploy
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
```

#### 3. **AWS/EC2 Deployment**
```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone and run
git clone your-repo
cd educational-platform/backend
npm install
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
JWT_SECRET=your_strong_secret_key_here

# Database (currently using JSON file)
# DB_PATH=./db.json

# Stripe Configuration (for future real implementation)
# STRIPE_SECRET_KEY=your_stripe_key
# STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 📈 Future Enhancements

### Scalability Improvements
- ✅ Replace JSON storage with MongoDB/PostgreSQL
- ✅ Implement Redis for caching
- ✅ Add load balancing
- ✅ Containerize with Docker and Kubernetes

### Feature Enhancements
- ✅ Real Stripe API integration
- ✅ Email notifications
- ✅ Video conferencing integration
- ✅ Advanced search and filtering
- ✅ Rating and review system

### Security Enhancements
- ✅ Rate limiting
- ✅ Input validation
- ✅ CSRF protection
- ✅ Helmet middleware
- ✅ Regular security audits

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

**🎉 Project Status: Fully Functional and Ready for Deployment!**

All core requirements have been implemented:
- ✅ User-Instructor-Admin roles with simple login
- ✅ Mini Udemy flow with course purchase and payment simulation
- ✅ Mini Uber logic with instructor-student matching
- ✅ JSON data storage
- ✅ Mock Stripe API for payment simulation
- ✅ Comprehensive testing suite
- ✅ Ready for deployment