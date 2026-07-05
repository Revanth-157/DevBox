import { Router } from 'express';
import { createSnippet, deleteSnippet, listSnippets, updateSnippet } from '../controllers/snippetsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', listSnippets);
router.post('/', createSnippet);
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);

export default router;
