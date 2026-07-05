import { Request, Response } from 'express';
import {
  createCollectionForUser,
  deleteCollectionForUser,
  filterCollectionsByMethod,
  listCollectionsForUser,
  updateCollectionForUser,
} from '../services/apicollectionsService.js';
import type { CreateApiCollectionInput, UpdateApiCollectionInput } from '../types/apicollection.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listCollections = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const method = req.query.method as string | undefined;
  const items = method ? await filterCollectionsByMethod(userId, method) : await listCollectionsForUser(userId);
  return res.status(200).json(items);
};

export const createCollection = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = req.body as CreateApiCollectionInput;
  if (!payload.title || !payload.method || !payload.url) {
    return res.status(400).json({ message: 'Title, method, and URL are required' });
  }

  const collection = await createCollectionForUser(userId, payload);
  return res.status(201).json(collection);
};

export const updateCollection = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const collectionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body as UpdateApiCollectionInput;
  const updated = await updateCollectionForUser(userId, collectionId, payload);

  if (!updated) {
    return res.status(404).json({ message: 'Collection not found' });
  }

  return res.status(200).json(updated);
};

export const deleteCollection = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const collectionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await deleteCollectionForUser(userId, collectionId);

  if (!deleted) {
    return res.status(404).json({ message: 'Collection not found' });
  }

  return res.status(204).send();
};
