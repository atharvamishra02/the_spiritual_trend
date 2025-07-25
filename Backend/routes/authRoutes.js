import express from 'express';
import { signup, login, logout, getMe, updateProfile, updateAddress } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post("/signup", signup);
router.post("/register", signup); // Add register route for frontend compatibility
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/address", protect, updateAddress);

export default router;
