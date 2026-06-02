import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  
import App from "./App";
import "./index.css";  
import { CartProvider } from "./context/CartContext"; 
import { CurrencyProvider } from "./context/CurrencyContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Provider } from 'react-redux';
import { store } from './store';
import axios from 'axios';

const IS_DEV = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BACKEND_URL = IS_DEV ? 'http://localhost:5000' : window.location.origin;

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


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider> 
        <React.StrictMode>
          <CartProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CurrencyProvider>
          </CartProvider>
        </React.StrictMode>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
