import { Router } from 'express';
import { createCollection, deleteCollection, listCollections, updateCollection } from '../controllers/apicollectionsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', listCollections);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

export default router;
