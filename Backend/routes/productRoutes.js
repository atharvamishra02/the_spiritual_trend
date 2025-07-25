import express from 'express';
import {
  getAllProducts,
  getProductById,
  getHomePageProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  setDefaultProductImages
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer storage
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

// Image upload endpoint
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the file path with full backend URL
  const backendUrl = req.protocol + '://' + req.get('host');
  res.json({
    filename: req.file.filename,
    url: `${backendUrl}/uploads/${req.file.filename}`
  });
});

// Utility route to set default images for all products (admin/maintenance)
router.post('/set-default-images', setDefaultProductImages);

// Public routes
router.get('/public', getAllProducts); // Add public endpoint for all products
router.get('/homepage/:section', getHomePageProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/public/category/:category', getProductsByCategory);
router.get('/public/:id', getProductById); // <-- Move this above /:id
router.get('/:id', getProductById);
// Allow fetching a single product by ID for public (frontend cart, etc)

// Admin routes (protected)
router.get('/', adminProtect, getAllProducts);
router.post('/', adminProtect, createProduct);
router.put('/:id', adminProtect, updateProduct);
router.delete('/:id', adminProtect, deleteProduct);

export default router; 