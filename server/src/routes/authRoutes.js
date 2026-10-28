import { Router } from 'express';
import { login, logout, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateLoginInput } from '../validators/authValidator.js';

const router = Router();

router.post('/login', authLimiter, validateLoginInput, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
