import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);

  // Computed properties
  const userRole = computed(() => user.value?.role);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isInstructor = computed(() => user.value?.role === 'instructor');
  const isUser = computed(() => user.value?.role === 'user');


  // Initialize auth from localStorage
  const initializeAuth = () => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        user.value = parsedAuth.user;
        accessToken.value = parsedAuth.accessToken;
        refreshToken.value = parsedAuth.refreshToken;
        isAuthenticated.value = true;
      } catch (err) {
        console.error('Failed to parse auth data:', err);
        clearAuth();
      }
    }
  };

  // Clear auth data
  const clearAuth = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth');
  };

  // Login
  const login = async (credentials) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.post('/auth/login', credentials);

      user.value = response.user;
      accessToken.value = response.token;
      refreshToken.value = response.refreshToken;
      isAuthenticated.value = true;

      // Store in localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: response.user,
        accessToken: response.token,
        refreshToken: response.refreshToken
      }));

      return response;
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      loading.value = true;
      clearAuth();
    } catch (err) {
      error.value = 'Logout failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.post('/auth/register', userData);

      // Auto-login after registration
      await login({
        email: userData.email,
        password: userData.password
      });

      return response;
    } catch (err) {
      error.value = err.response?.data?.error || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      if (!isAuthenticated.value && accessToken.value) {
        // Try to get current user
        const response = await api.get('/auth/me');
        user.value = response;
        isAuthenticated.value = true;
      }
      return isAuthenticated.value;
    } catch (err) {
      clearAuth();
      return false;
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    loading,
    error,
    userRole,
    isAdmin,
    isInstructor,
    isUser,
    initializeAuth,
    login,
    logout,
    register,
    checkAuth
  };
});