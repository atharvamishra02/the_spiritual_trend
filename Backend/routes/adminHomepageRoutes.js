import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHomepageData, getBanner, uploadBanner } from '../controllers/adminHomepageController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer storage for banner
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// All routes are protected by admin authentication
router.use(adminProtect);

router.get('/', getHomepageData);
router.get('/banner', getBanner);
router.post('/upload-banner', upload.single('banner'), uploadBanner);

export default router;
