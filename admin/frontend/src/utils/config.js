export const BACKEND_URL = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : `${window.location.protocol}//thespritualtrends.com`;

export const API_BASE_URL = `${BACKEND_URL}/api/admin`;
