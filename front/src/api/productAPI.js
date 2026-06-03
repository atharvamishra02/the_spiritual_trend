import axios from '../utils/axios.js';

const API_BASE_URL = '/api/products';
const CATEGORY_URL = '/api/homepage/categories';

// Get banner URL
export const getBannerUrl = async () => {
  try {
    const response = await axios.get('/api/homepage/banner');
    return response.data;
  } catch (error) {
    console.error('Error fetching banner:', error);
    throw error;
  }
};

// Get all active products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get featured products for homepage
export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/homepage/featured`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get famous products for homepage
export const getFamousProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/homepage/famous`);
    return response.data;
  } catch (error) {
    console.error('Error fetching famous products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public?search=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}; 