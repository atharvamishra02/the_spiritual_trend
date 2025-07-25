import axios from 'axios';
import { adminLogout } from './auth.js';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Response error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      adminLogout();
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;
