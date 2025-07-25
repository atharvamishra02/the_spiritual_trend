import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser
} from '../controllers/adminUserController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// All routes are protected by admin middleware
router.use(adminProtect);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router; 