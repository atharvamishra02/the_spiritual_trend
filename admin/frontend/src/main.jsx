// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import { BACKEND_URL } from './utils/config.js';

// Global Axios request interceptor to dynamically rewrite hardcoded localhost:5000 URLs in production
axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', BACKEND_URL);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global Fetch interceptor to dynamically rewrite hardcoded localhost:5000 URLs in production
const originalFetch = window.fetch;
window.fetch = async function (url, options) {
  if (typeof url === 'string' && url.startsWith('http://localhost:5000')) {
    url = url.replace('http://localhost:5000', BACKEND_URL);
  }
  return originalFetch(url, options);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
      <App />
    
  </React.StrictMode>
);
