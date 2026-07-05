import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createTerminalCommand, deleteTerminalCommand, listTerminalCommands, updateTerminalCommand } from '../controllers/terminalCommandsController.js';

const router = Router();

router.use(authMiddleware);
router.get('/', listTerminalCommands);
router.post('/', createTerminalCommand);
router.put('/:id', updateTerminalCommand);
router.delete('/:id', deleteTerminalCommand);

export default router;
