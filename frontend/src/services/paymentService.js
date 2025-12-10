import api from './api';

const paymentService = {
  // Get all courses
  async getAllCourses() {
    try {
      const response = await api.get('/courses');
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get user's purchased courses
  async getPurchasedCourses() {
    try {
      const response = await api.get('/courses/purchased');
      return response;
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
      throw error;
    }
  },

  // Purchase a course
  async purchaseCourse(courseId, cardDetails) {
    try {
      const response = await api.post('/payments/purchase', {
        courseId,
        cardDetails
      });
      return response;
    } catch (error) {
      console.error('Error purchasing course:', error);
      throw error;
    }
  },

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await api.get('/payments/history');
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }
};

export default paymentService;