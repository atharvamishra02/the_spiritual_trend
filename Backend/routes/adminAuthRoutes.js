import express from 'express';
import { adminLogin } from '../controllers/adminAuthController.js';
import { refreshAdminToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/refresh', refreshAdminToken);

export default router; 