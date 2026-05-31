import React from "react";
import { motion } from "framer-motion";
import { FaTrash, FaMinus, FaPlus, FaExclamationTriangle, FaCheckCircle, FaShoppingBag } from "react-icons/fa";

const CartItem = ({ 
  item, 
  currency, 
  convert, 
  onIncrease, 
  onDecrease, 
  onRemove, 
  onBuyNow,
  productDetails = null 
}) => {
  const product = productDetails?.[item.productId];
  const isOutOfStock = product && product.stock === 0;
  const isLowStock = product && item.quantity >= product.stock && product.stock > 0;
  const canIncrease = !product || item.quantity < product.stock;

  return (
    <motion.div 
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-yellow-500 transition-all shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-32 h-32 md:w-36 md:h-36 flex items-center justify-center bg-gray-800 rounded-xl overflow-hidden shadow-md">
        <img
          src={item.image || product?.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/144x144/374151/FFFFFF?text=No+Image';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 hover:text-yellow-400 transition-colors line-clamp-2">
              {item.name}
            </h3>
            {product?.description && (
              <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                {product.description.length > 100 
                  ? `${product.description.substring(0, 100)}...` 
                  : product.description
                }
              </p>
            )}
            {/* Stock Status */}
            {product && (
              <div className="flex items-center space-x-2 mb-1">
                {isOutOfStock ? (
                  <div className="flex items-center text-red-400 text-xs bg-red-400 bg-opacity-10 px-2 py-1 rounded-full">
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    <span>Out of Stock</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center text-yellow-400 text-xs bg-yellow-400 bg-opacity-10 px-2 py-1 rounded-full">
                    <FaExclamationTriangle className="w-3 h-3 mr-1" />
                    <span>Only {product.stock} left</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-400 text-xs bg-green-400 bg-opacity-10 px-2 py-1 rounded-full">
                    <FaCheckCircle className="w-3 h-3 mr-1" />
                    <span>In Stock ({product.stock} available)</span>
                  </div>
                )}
              </div>
            )}
            {/* Price */}
            <div className="text-lg font-bold text-yellow-500 mb-1">
              {currency} {convert ? convert(item.price).toFixed(2) : item.price.toFixed(2)}
            </div>
          </div>
          {/* Remove Button */}
          <motion.button
            onClick={() => onRemove(item.productId)}
            className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-400 hover:bg-opacity-10 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Remove from cart"
          >
            <FaTrash className="w-4 h-4" />
          </motion.button>
        </div>
        {/* Quantity Controls & Buy Now */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-xs font-medium">Quantity:</span>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => onDecrease(item.productId)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-yellow-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Decrease quantity"
              >
                <FaMinus className="w-3 h-3" />
              </motion.button>
              <span className="w-10 text-center font-semibold text-white bg-gray-800 py-1 px-2 rounded">
                {item.quantity}
              </span>
              <motion.button
                onClick={() => onIncrease(item.productId)}
                disabled={!canIncrease}
                className="w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-yellow-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={!canIncrease ? "Maximum stock reached" : "Increase quantity"}
              >
                <FaPlus className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <motion.button
              onClick={() => onBuyNow(item)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow transition-all text-xs md:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of Stock' : 'Buy Now'}
            >
              <FaShoppingBag className="w-4 h-4" />
              Buy Now
            </motion.button>
            <div className="text-right ml-2">
              <div className="text-base font-bold text-yellow-500">
                {currency} {convert ? convert(item.price * item.quantity).toFixed(2) : (item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {item.quantity} × {currency} {convert ? convert(item.price).toFixed(2) : item.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem; 