import { Request, Response } from 'express';
import {
  createQueryForUser,
  deleteQueryForUser,
  filterQueriesByDatabaseType,
  listQueriesForUser,
  updateQueryForUser,
} from '../services/sqlqueriesService.js';
import type { CreateSqlQueryInput, UpdateSqlQueryInput } from '../types/sqlquery.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listQueries = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const databaseType = req.query.databaseType as string | undefined;
  const queries = databaseType ? await filterQueriesByDatabaseType(userId, databaseType) : await listQueriesForUser(userId);
  return res.status(200).json(queries);
};

export const createQuery = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = req.body as CreateSqlQueryInput;
  if (!payload.title || !payload.query || !payload.databaseType) {
    return res.status(400).json({ message: 'Title, query, and databaseType are required' });
  }

  const query = await createQueryForUser(userId, payload);
  return res.status(201).json(query);
};

export const updateQuery = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const queryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body as UpdateSqlQueryInput;
  const updated = await updateQueryForUser(userId, queryId, payload);

  if (!updated) {
    return res.status(404).json({ message: 'Query not found' });
  }

  return res.status(200).json(updated);
};

export const deleteQuery = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const queryId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await deleteQueryForUser(userId, queryId);

  if (!deleted) {
    return res.status(404).json({ message: 'Query not found' });
  }

  return res.status(204).send();
};
