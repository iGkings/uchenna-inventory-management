import { Router } from 'express';
import { getMovements } from '../controllers/movementController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getMovements);

export default router;
