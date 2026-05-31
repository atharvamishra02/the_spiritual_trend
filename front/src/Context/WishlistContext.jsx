import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from '../utils/axios';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from backend on login
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const res = await axiosInstance.get('/api/users/wishlist');
          setWishlistItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
    };
    fetchWishlist();
  }, [user]);

  // Add to wishlist (backend)
  const addToWishlist = async (product) => {
    if (!user) {
      console.error("Cannot add to wishlist: User not logged in");
      return;
    }
    try {
      const productId = product._id || product.productId || product.id;
      const res = await axiosInstance.post('/api/users/wishlist', { productId });
      setWishlistItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    }
  };

  // Remove from wishlist (backend)
  const removeFromWishlist = async (productId) => {
    if (!user) {
      console.error("Cannot remove from wishlist: User not logged in");
      return;
    }
    try {
      const res = await axiosInstance.delete(`/api/users/wishlist/${productId}`);
      setWishlistItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return Array.isArray(wishlistItems) && wishlistItems.some((item) => (item._id === productId || item.productId === productId || item.id === productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      setWishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist,
      clearWishlist,
      isLoggedIn: !!user 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext); 