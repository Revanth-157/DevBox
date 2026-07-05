import { Request, Response } from 'express';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../services/authService.js';
import type { RegisterPayload, LoginPayload, RefreshTokenPayload } from '../types/auth.js';

export const register = async (req: Request, res: Response) => {
  try {
    const payload = req.body as RegisterPayload;
    const result = await registerUser(payload);
    res.status(201).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const payload = req.body as LoginPayload;
    const result = await loginUser(payload);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const payload = req.body as RefreshTokenPayload;
    const result = await refreshAccessToken(payload);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Refresh failed';
    res.status(401).json({ message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const payload = req.body as RefreshTokenPayload;
    const result = await logoutUser(payload);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    res.status(400).json({ message });
  }
};
