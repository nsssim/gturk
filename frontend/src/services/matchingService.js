import api from './api';

const matchingService = {
  // Create a lesson request
  async createLessonRequest(subject, time, instructorId) {
    try {
      const response = await api.post('/matching/request', {
        subject,
        time,
        instructorId
      });
      return response;
    } catch (error) {
      console.error('Error creating lesson request:', error);
      throw error;
    }
  },

  // Get user's lesson requests
  async getUserLessons() {
    try {
      const response = await api.get('/matching/user/lessons');
      return response;
    } catch (error) {
      console.error('Error fetching user lessons:', error);
      throw error;
    }
  },

  // Get instructor's lesson requests
  async getInstructorLessons() {
    try {
      const response = await api.get('/matching/instructor/lessons');
      return response;
    } catch (error) {
      console.error('Error fetching instructor lessons:', error);
      throw error;
    }
  },

  // Update lesson status (for instructors)
  async updateLessonStatus(lessonId, status) {
    try {
      const response = await api.put('/matching/lesson/status', {
        lessonId,
        status
      });
      return response;
    } catch (error) {
      console.error('Error updating lesson status:', error);
      throw error;
    }
  },
  // Get instructors by subject
  async getInstructorsBySubject(subject) {
    try {
      const response = await api.get('/matching/instructors', {
        params: { subject }
      });
      return response;
    } catch (error) {
      console.error('Error fetching instructors by subject:', error);
      throw error;
    }
  }
};

export default matchingService;