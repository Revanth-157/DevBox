import { Router } from 'express';
import { listFavorites } from '../controllers/favoritesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', listFavorites);

export default router;
