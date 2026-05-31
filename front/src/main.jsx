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
