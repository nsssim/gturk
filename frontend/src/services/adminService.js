import api from './api';

const adminService = {
  // Get system statistics
  async getSystemStats() {
    try {
      const response = await api.get('/admin/stats');
      return response;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get all instructors
  async getAllInstructors() {
    try {
      const response = await api.get('/admin/instructors');
      return response;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  // Get all admins
  async getAllAdmins() {
    try {
      const response = await api.get('/admin/admins');
      return response;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Get all courses
  async getAllCourses() {
    try {
      const response = await api.get('/admin/courses');
      return response;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get all lessons
  async getAllLessons() {
    try {
      const response = await api.get('/admin/lessons');
      return response;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  },

  // Create a new course
  async createCourse(courseData) {
    try {
      const response = await api.post('/admin/courses', courseData);
      return response;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update a course
  async updateCourse(courseId, courseData) {
    try {
      const response = await api.put(`/admin/courses/${courseId}`, courseData);
      return response;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete a course
  async deleteCourse(courseId) {
    try {
      const response = await api.delete(`/admin/courses/${courseId}`);
      return response;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

export default adminService;