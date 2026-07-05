import { Request, Response } from 'express';
import { favoritesForUser } from '../services/favoritesService.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const results = await favoritesForUser(userId);
  return res.status(200).json(results);
};

export default {};
