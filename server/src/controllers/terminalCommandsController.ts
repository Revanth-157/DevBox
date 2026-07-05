import { Request, Response } from 'express';
import {
  createTerminalCommandForUser,
  deleteTerminalCommandForUser,
  filterTerminalCommandsByOs,
  listTerminalCommandsForUser,
  updateTerminalCommandForUser,
} from '../services/terminalCommandsService.js';
import type { CreateTerminalCommandInput, UpdateTerminalCommandInput } from '../types/terminalCommand.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listTerminalCommands = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const os = req.query.os as string | undefined;
  const commands = os ? await filterTerminalCommandsByOs(userId, os) : await listTerminalCommandsForUser(userId);
  return res.status(200).json(commands);
};

export const createTerminalCommand = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = req.body as CreateTerminalCommandInput;
  if (!payload.title || !payload.command || !payload.os) {
    return res.status(400).json({ message: 'Title, command, and OS are required' });
  }

  const command = await createTerminalCommandForUser(userId, payload);
  return res.status(201).json(command);
};

export const updateTerminalCommand = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const commandId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body as UpdateTerminalCommandInput;
  const updated = await updateTerminalCommandForUser(userId, commandId, payload);

  if (!updated) {
    return res.status(404).json({ message: 'Command not found' });
  }

  return res.status(200).json(updated);
};

export const deleteTerminalCommand = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const commandId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await deleteTerminalCommandForUser(userId, commandId);

  if (!deleted) {
    return res.status(404).json({ message: 'Command not found' });
  }

  return res.status(204).send();
};
