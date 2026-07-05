import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

interface JwtPayload {
  sub: string;
  role: string;
  email?: string;
  name?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.substring(7);
  const secret = process.env.JWT_SECRET ?? 'devbox-secret';

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email ?? '',
      name: decoded.name ?? '',
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
