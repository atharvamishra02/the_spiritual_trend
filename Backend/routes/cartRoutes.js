import express from 'express';
import {
  addToCart,
  getMyCart,
  removeFromCart,
  getUserCartById,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

// User Routes
router.post('/add', protect, addToCart);
router.get('/me', protect, getMyCart);
router.delete('/remove/:productId', protect, removeFromCart);

// Admin Route
router.get('/user/:userId', protect, isAdmin, getUserCartById);

export default router;
