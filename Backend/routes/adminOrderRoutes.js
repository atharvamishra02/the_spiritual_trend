import express from 'express';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// All routes are protected by admin middleware
router.use(adminProtect);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router; 