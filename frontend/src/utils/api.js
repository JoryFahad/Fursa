import axios from 'axios';
import config from '../config';

// Create axios instance
const api = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Token expired, attempting to refresh...');
        
        // Make refresh request
        const response = await axios.post(`${config.API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('access_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        console.log('Token refreshed successfully, retrying original request');
        
        // Trigger auth context update if available
        window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
          detail: { 
            access_token: access_token, 
            refresh_token: newRefreshToken || refreshToken 
          } 
        }));

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Trigger logout event
        window.dispatchEvent(new CustomEvent('authLogout'));

        // Redirect to login page
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
