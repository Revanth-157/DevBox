import { Request, Response } from 'express';
import { searchForUser } from '../services/searchService.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const searchAll = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const raw = req.query.q;
  const q = Array.isArray(raw) ? String(raw[0]) : (typeof raw === 'string' ? raw : undefined);
  const results = await searchForUser(userId, q);
  return res.status(200).json(results);
};

export default {};
