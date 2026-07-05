import { Router } from 'express';
import { createQuery, deleteQuery, listQueries, updateQuery } from '../controllers/sqlqueriesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', listQueries);
router.post('/', createQuery);
router.put('/:id', updateQuery);
router.delete('/:id', deleteQuery);

export default router;
