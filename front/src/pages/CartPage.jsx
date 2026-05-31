import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { removeFromCart } from "../api/cartAPI";
import { getProductById } from "../api/productAPI";
import { motion } from "framer-motion";
import { FaShoppingCart, FaTrash, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import CartItem from "../components/CartItem";

const CartPage = () => {
  const [currency, setCurrency] = useState("₹");
  const { user } = useAuth();
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const conversionRate = 85;
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const convert = (price) =>
    currency === "$" ? price : price * conversionRate;

  // Fetch product details including stock information
  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = {};
      for (const item of cartItems) {
        try {
          const product = await getProductById(item.productId);
          details[item.productId] = product;
        } catch (error) {
          console.error(`Failed to fetch product ${item.productId}:`, error);
        }
      }
      setProductDetails(details);
      setLoading(false);
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  const decreaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const increaseQty = (productId) => {
    const product = productDetails[productId];
    const currentItem = cartItems.find(item => item.productId === productId);
    const currentQty = currentItem ? currentItem.quantity : 0;
    
    // Check if we can increase quantity based on stock
    if (product && currentQty < product.stock) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    }
  };

  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        item: item,
        currency,
      },
    });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-32 pb-20 md:pt-40 md:pb-24 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-yellow-500">Please Log In</h1>
          <p className="text-lg mb-6 text-zinc-400">You need to be logged in to view your cart.</p>
          <motion.button
            className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 shadow-md shadow-yellow-500/20"
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
    <div className="min-h-screen bg-black text-white">
      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-yellow-500 text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">Your cart is empty</h2>
            <p className="text-gray-400 text-lg mb-8">Add some beautiful spiritual items to your cart!</p>
            <motion.button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item, index) => {
                  const product = productDetails[item.productId];
                  const isOutOfStock = product && product.stock === 0;
                  const isLowStock = product && item.quantity >= product.stock && product.stock > 0;
                  
                  return (
                    <CartItem
                      key={item.productId}
                      item={item}
                      currency={currency}
                      convert={convert}
                      onIncrease={increaseQty}
                      onDecrease={decreaseQty}
                      onRemove={handleRemove}
                      onBuyNow={handleBuyNow}
                      productDetails={productDetails}
                    />
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{currency} {convert(totalPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-xl font-bold text-yellow-500">
                      <span>Total</span>
                      <span>{currency} {convert(totalPrice).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        cartItems,
                        currency,
                        total: convert(totalPrice).toFixed(2),
                      },
                    })
                  }
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/')}
                    className="text-yellow-500 hover:text-yellow-400 text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
