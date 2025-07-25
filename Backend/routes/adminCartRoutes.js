import express from 'express';
import { getAllCarts } from '../controllers/cartController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.route('/').get(adminProtect, getAllCarts);

export default router;