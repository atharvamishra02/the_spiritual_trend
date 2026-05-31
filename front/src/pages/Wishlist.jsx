import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { currency, convert } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please log in to add items to your cart');
      return;
    }
    addToCart(product, 1);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleProductClick = (product) => {
    navigate(`/buyitem/${product.productId || product.id}`, {
      state: { product: { ...product, quantity: 1 } }
    });
  };

  if (!user) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center text-yellow-500">
          <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
          <p className="text-lg mb-6">You need to be logged in to view your wishlist.</p>
          <motion.button
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/loginpage')}
          >
            Log In
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 md:pt-40 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-yellow-500 text-center mb-8">
            My Wishlist
          </h1>

          {wishlistItems.length === 0 ? (
            <div className="text-center text-yellow-400 py-20">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
              <p className="text-lg mb-8">Start adding items to your wishlist by browsing our products!</p>
              <motion.button
                className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/AllProducts')}
              >
                Browse Products
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.productId || item.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <img
                      src={item.image || item.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => handleProductClick(item)}
                      onError={(e) => {
                        e.target.src = "/src/assets/user.png";
                      }}
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(
                        item.product?._id || item._id || item.productId || item.id
                      )}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove from wishlist"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-black mb-2 cursor-pointer hover:text-yellow-600"
                        onClick={() => handleProductClick(item)}>
                      {item.name}
                    </h3>
                    <p className="text-black font-bold text-lg mb-4">
                      {currency} {convert(item.price)}
                    </p>
                    
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {wishlistItems.length > 0 && (
            <div className="text-center mt-12 flex justify-center gap-4">
              <motion.button
                className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/AllProducts')}
              >
                Continue Shopping
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cart')}
              >
                View Cart
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist; 