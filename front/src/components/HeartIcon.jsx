import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const HeartIcon = ({ product, className = "" }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } = useWishlist();
  const { user } = useAuth();
  
  const productId = product?.productId || product?.id || product?._id;
  const isWishlisted = isInWishlist(productId);

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    console.log('Heart clicked', { user, product, productId, wishlistItems, isWishlisted });
    if (!user) {
      alert('Please log in to add items to your wishlist');
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleHeartClick}
      className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 hover:scale-110 ${className}`}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-all duration-300 ${
          isWishlisted 
            ? 'text-red-500 fill-current' 
            : 'text-white hover:text-red-400'
        }`}
        fill={isWishlisted ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={isWishlisted ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default HeartIcon; 