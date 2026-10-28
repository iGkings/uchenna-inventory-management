import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateCategoryInput } from '../validators/categoryValidator.js';

const router = Router();

router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategoryById);
router.post('/', authenticate, validateCategoryInput, createCategory);
router.put('/:id', authenticate, validateCategoryInput, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
