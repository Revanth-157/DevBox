import { Request, Response } from 'express';
import {
  createResourceForUser,
  deleteResourceForUser,
  filterResourcesByCategory,
  listResourcesForUser,
  updateResourceForUser,
} from '../services/resourcesService.js';
import type { CreateResourceInput, UpdateResourceInput } from '../types/resource.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listResources = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const category = req.query.category as string | undefined;
  const items = category ? await filterResourcesByCategory(userId, category) : await listResourcesForUser(userId);
  return res.status(200).json(items);
};

export const createResource = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = req.body as CreateResourceInput;
  if (!payload.title || !payload.url || !payload.category) {
    return res.status(400).json({ message: 'Title, URL, and category are required' });
  }

  const resource = await createResourceForUser(userId, payload);
  return res.status(201).json(resource);
};

export const updateResource = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body as UpdateResourceInput;
  const updated = await updateResourceForUser(userId, resourceId, payload);

  if (!updated) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  return res.status(200).json(updated);
};

export const deleteResource = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await deleteResourceForUser(userId, resourceId);

  if (!deleted) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  return res.status(204).send();
};
