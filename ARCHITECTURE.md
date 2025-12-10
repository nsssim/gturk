# Educational Platform Architecture Document

## Overview
This document describes the architecture of the Educational Platform, a system that combines Udemy-like course management with Uber-like instructor-student matching.

## Technologies Used

### Frontend
- **Vue.js 3** with Composition API - Modern, reactive frontend framework
- **Vite** - Fast build tool and development server
- **Pinia** - State management for Vue
- **Bootstrap 5** - Responsive UI components
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** with Express - Server-side JavaScript runtime
- **JSON Database** - Simple file-based storage for development
- **JWT Authentication** - Secure token-based authentication
- **RESTful API** - Standardized API endpoints

### Why These Technologies?
- **Vue.js**: Excellent for building interactive UIs with clean component structure
- **Vite**: Provides fast development experience and optimized builds
- **Express**: Lightweight and flexible Node.js framework
- **JWT**: Stateless authentication that works well with SPAs
- **JSON DB**: Simple to set up for development, can be replaced with MongoDB/PostgreSQL for production

## System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Client (Browser)                                │
└───────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                            Frontend (Vue.js + Vite)                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────────┐  │
│  │  Components │    │   Services  │    │            State Management         │  │
│  │  (Vue SFCs) │    │  (API calls)│    │            (Pinia Stores)          │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                              Backend (Node.js + Express)                        │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────────┐  │
│  │  Routes     │    │ Controllers │    │            Database                 │  │
│  │  (REST API) │    │ (Business   │    │            (JSON files)             │  │
│  └─────────────┘    │  Logic)     │    └─────────────────────────────────────┘  │
│                     └─────────────┘                                        │
└───────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                              Database (JSON files)                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   Users     │    │ Instructors │    │   Courses   │    │   Lessons   │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
└───────────────────────────────────────────────────────────────────────────────┘
```

## Payment Flow Logic

### Course Purchase Process
1. **User browses courses** → Frontend fetches course list from `/api/courses`
2. **User selects course** → Payment modal opens with Stripe-like form
3. **User enters card details** → Form validation occurs
4. **Payment submission** → Frontend calls `/api/payments/purchase` with:
   - `courseId`
   - `cardDetails` (number, expiry, CVV, name)
5. **Backend processes payment**:
   - Validates input
   - Simulates Stripe API call (90% success rate for testing)
   - Updates user's `purchasedCourses` array
   - Adds user to course's `students` array
6. **Response to frontend** → Success/failure with transaction details
7. **UI updates** → Course marked as purchased, appears in "My Courses"

### Mock Payment Simulation
- **Success rate**: 90% (configurable)
- **Processing time**: 0.5-1.5 seconds delay
- **Transaction ID**: Randomly generated for tracking
- **Error cases**: Invalid amount, missing card details, bank declines

## Instructor-Student Matching Logic

### Lesson Request Process
1. **User requests lesson** → Frontend calls `/api/matching/lessons` with:
   - `subject` (e.g., "Mathematics")
   - `time` (e.g., "Mon 10:00-12:00")
2. **Backend matching algorithm**:
   - Filters instructors by subject expertise
   - Checks availability based on time slots
   - Selects first available instructor (simple algorithm)
3. **Lesson creation** → New lesson record with:
   - `userId`, `instructorId`, `subject`, `time`
   - `status: "pending"`
4. **Notification simulation** → Console log (would be real-time in production)
5. **Instructor response** → Frontend calls `/api/matching/lessons/status` with:
   - `lessonId`, `status` ("confirmed" or "cancelled")
6. **Status update** → Lesson record updated, user notified

### Matching Algorithm
```javascript
// Simple matching logic from matchingController.js
const availableInstructors = instructors.filter(instructor => {
  // Check subject match
  if (instructor.subject !== subject) return false;

  // Check time availability (basic implementation)
  return instructor.availability.some(slot => {
    return slot.includes(requestedTime.split(' ')[0]); // Check day of week
  });
});

// Select first available (could be enhanced with ratings, load balancing, etc.)
const selectedInstructor = availableInstructors[0];
```

## Future Scaling Considerations

### Database Scaling
- **Replace JSON DB** → MongoDB (document) or PostgreSQL (relational)
- **Add indexing** → For faster user/course lookups
- **Implement caching** → Redis for frequently accessed data

### Payment System Enhancements
- **Real payment gateway** → Stripe, PayPal, or local providers (PayTR, iyzico)
- **Subscription model** → Monthly memberships
- **Refund processing** → Handle payment reversals
- **Fraud detection** → Implement security checks

### Matching System Improvements
- **Advanced algorithm** → Consider instructor ratings, response time, student preferences
- **Real-time notifications** → WebSockets for instant updates
- **Scheduling calendar** → Integration with Google Calendar
- **Video integration** → Zoom/Google Meet for live lessons

### Performance Optimization
- **API pagination** → For large datasets
- **Lazy loading** → Frontend components load on demand
- **CDN for assets** → Faster static content delivery
- **Load balancing** → Multiple backend instances

### Security Enhancements
- **OAuth 2.0** → Social login (Google, Facebook)
- **Two-factor auth** → SMS/email verification
- **Rate limiting** → Prevent API abuse
- **Input validation** → Enhanced security checks

### Monitoring & Analytics
- **Logging system** → Track user actions and errors
- **Analytics dashboard** → Usage statistics and trends
- **Error tracking** → Sentry or similar service
- **Performance metrics** → Response times and bottlenecks

## Deployment Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Cloud Provider (AWS/Azure)                      │
├─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────┤
│  Load Balancer  │   CDN           │  Monitoring      │  CI/CD Pipeline │         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                                Application Servers                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────────┐  │
│  │  Frontend   │    │  Backend    │    │            Database Cluster         │  │
│  │  (Vue.js)   │    │  (Node.js)  │    │            (MongoDB/PostgreSQL)     │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

## Key Features Implemented

✅ **User-Instructor-Admin Roles** - Complete authentication and authorization
✅ **Course Management** - CRUD operations with purchasing
✅ **Payment Simulation** - Mock Stripe integration
✅ **Matching System** - Instructor-student lesson requests
✅ **Admin Dashboard** - System monitoring and management
✅ **Responsive UI** - Mobile-friendly Bootstrap design
✅ **API Proxy** - Frontend-backend communication
✅ **State Management** - Pinia for global state

## Next Steps for Production

1. **Replace JSON DB** with a real database system
2. **Implement real payment gateway** (Stripe, PayPal)
3. **Add comprehensive testing** (unit, integration, e2e)
4. **Set up CI/CD pipeline** for automated deployment
5. **Implement monitoring** and error tracking
6. **Add more sophisticated matching algorithm**
7. **Enhance security** with rate limiting and input validation
8. **Optimize performance** with caching and pagination

This architecture provides a solid foundation for an educational platform that can scale from a small demo to a full production system.