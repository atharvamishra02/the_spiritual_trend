import express from 'express';
import { getUserWishlist, addToWishlist, removeFromWishlist, uploadProfileImage } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, ''));
  }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/wishlist', protect, getUserWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.post('/upload-profile-image', protect, upload.single('image'), uploadProfileImage);

export default router; 