import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we have a refresh token
      if (authStore.refreshToken) {
        try {
          // Try to refresh token (this is a placeholder - backend needs refresh endpoint)
          const response = await axios.post('/api/auth/refresh', {
            refreshToken: authStore.refreshToken
          });

          // Update tokens
          authStore.accessToken = response.data.accessToken;
          authStore.refreshToken = response.data.refreshToken;

          // Update localStorage
          const authData = JSON.parse(localStorage.getItem('auth') || '{}');
          authData.accessToken = response.data.accessToken;
          authData.refreshToken = response.data.refreshToken;
          localStorage.setItem('auth', JSON.stringify(authData));

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout
          await authStore.logout();
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - logout
        await authStore.logout();
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error || error.message || 'Request failed';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;