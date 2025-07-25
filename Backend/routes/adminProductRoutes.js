import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fixProductImageUrls,
  updateHomepageSections
} from '../controllers/productController.js';
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// All routes are protected by admin middleware
router.use(adminProtect);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/fix-image-urls', fixProductImageUrls);
router.post('/homepage/update', updateHomepageSections);

export default router; 