import { Router } from 'express';
import { changePassword, getProfile, updateProfile } from '../controllers/profileController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/password', changePassword);

export default router;
