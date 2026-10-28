import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  exportCsv,
} from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateProductInput, validateStockAdjustment } from '../validators/productValidator.js';

const router = Router();

// Public/authenticated product listing and details
router.get('/', authenticate, getProducts);
router.get('/export/csv', authenticate, exportCsv);
router.get('/:id', authenticate, getProductById);

// Modification actions
router.post('/', authenticate, validateProductInput, createProduct);
router.put('/:id', authenticate, validateProductInput, updateProduct);
router.delete('/:id', authenticate, deleteProduct);
router.post('/:id/adjust', authenticate, validateStockAdjustment, adjustStock);

export default router;
