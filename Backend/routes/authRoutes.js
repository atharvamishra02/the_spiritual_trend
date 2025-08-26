import express from 'express';
import { signup, login, logout, getMe, updateProfile, updateAddress, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Debug route to test if auth routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

// Auth routes
router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken); // Refresh token endpoint

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/address", protect, updateAddress);

export default router;
