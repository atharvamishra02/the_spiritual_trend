import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartNotification = ({ show, onClose, message }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-lg max-w-md"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-black hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => {
            navigate('/loginpage');
            onClose();
          }}
          className="bg-black text-yellow-500 px-3 py-1 rounded text-xs font-medium hover:bg-gray-800"
        >
          Login
        </button>
        <button
          onClick={() => {
            navigate('/create-account');
            onClose();
          }}
          className="bg-black text-yellow-500 px-3 py-1 rounded text-xs font-medium hover:bg-gray-800"
        >
          Sign Up
        </button>
      </div>
    </motion.div>
  );
};

export default CartNotification; 