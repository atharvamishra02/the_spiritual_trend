import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin';

// Admin login
export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password
    });
    
    const { token, admin } = response.data;
    
    // Store token and admin info
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(admin));
    
    return { success: true, admin };
  } catch (error) {
    console.error('Admin login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

// Admin logout
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  window.location.href = '/login';
};

// Check if admin is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Get current admin data
export const getCurrentAdmin = () => {
  const adminData = localStorage.getItem('adminData');
  return adminData ? JSON.parse(adminData) : null;
};

// Get admin token
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Verify token validity
export const verifyToken = async () => {
  try {
    const token = getAdminToken();
    if (!token) return false;
    
    // You can add a token verification endpoint to your backend
    // For now, we'll just check if token exists
    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};
