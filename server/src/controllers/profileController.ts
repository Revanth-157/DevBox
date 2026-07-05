import { Request, Response } from 'express';
import { changePasswordForUser, getProfileForUser, updateProfileForUser } from '../services/profileService.js';
import type { ChangePasswordPayload, UpdateProfilePayload } from '../types/auth.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const profile = await getProfileForUser(userId);
    return res.status(200).json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load profile';
    return res.status(400).json({ message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const payload = req.body as UpdateProfilePayload;
    const profile = await updateProfileForUser(userId, payload);
    return res.status(200).json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update profile';
    return res.status(400).json({ message });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const payload = req.body as ChangePasswordPayload;
    await changePasswordForUser(userId, payload);
    return res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to change password';
    return res.status(400).json({ message });
  }
};
