import api from './axios.js';

// Admin Authentication
export const adminAPI = {
  login: (credentials) => api.post('/login', credentials),
};

// User Management
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

// Product Management
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// Order Management
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// Helper function to handle API responses
export const handleAPIResponse = (response) => {
  return {
    success: true,
    data: response.data,
  };
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.response?.data?.message || 'An error occurred',
    status: error.response?.status,
  };
};

// Wrapper for API calls with error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return handleAPIResponse(response);
  } catch (error) {
    return handleAPIError(error);
  }
}; 