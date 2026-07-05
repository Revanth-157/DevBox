import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { RegisterPayload, LoginPayload, AuthResponse, RefreshTokenPayload } from '../types/auth.js';
import { users } from './userStore.js';

const accessTokenSecret = process.env.JWT_SECRET ?? 'devbox-secret';
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET ?? `${accessTokenSecret}-refresh`;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const buildUserProfile = (user: { id: string; name: string; email: string; role: string; avatarUrl?: string | null }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl ?? undefined,
});

const signAccessToken = (user: { id: string; name: string; email: string; role: string; avatarUrl?: string | null }) =>
  jwt.sign({ sub: user.id, role: user.role, email: user.email, name: user.name }, accessTokenSecret, { expiresIn: '15m' });

const signRefreshToken = (user: { id: string; name: string; email: string; role: string; avatarUrl?: string | null }) =>
  jwt.sign({ sub: user.id, role: user.role, type: 'refresh' }, refreshTokenSecret, { expiresIn: '30d' });

const findUserByEmail = (email: string) => users.find((user) => user.email === email);
const findUserById = (id: string) => users.find((user) => user.id === id);

const toAuthResponse = async (user: { id: string; name: string; email: string; password: string; role: string; avatarUrl?: string | null }) => ({
  token: signAccessToken(user),
  refreshToken: signRefreshToken(user),
  user: buildUserProfile(user),
});

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const name = payload.name?.trim();
  const email = normalizeEmail(payload.email ?? '');
  const password = payload.password ?? '';

  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  return runWithPrisma(async () => {
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'Developer',
      },
    });

    return toAuthResponse(user);
  }, async () => {
    const existing = findUserByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      email,
      password: hashedPassword,
      role: 'Developer',
    };

    users.push(user);
    return toAuthResponse(user);
  });
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const email = normalizeEmail(payload.email ?? '');
  const password = payload.password ?? '';

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  return runWithPrisma(async () => {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return toAuthResponse(user);
  }, async () => {
    const user = findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return toAuthResponse(user);
  });
};

export const refreshAccessToken = async (payload: RefreshTokenPayload): Promise<AuthResponse> => {
  if (!payload.refreshToken) {
    throw new Error('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(payload.refreshToken, refreshTokenSecret) as { sub: string; role: string; type?: string };
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    return runWithPrisma(async () => {
      const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      return toAuthResponse(user);
    }, async () => {
      const user = findUserById(decoded.sub);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      return toAuthResponse(user);
    });
  } catch {
    throw new Error('Invalid or expired refresh token');
  }
};

export const logoutUser = async (_payload: RefreshTokenPayload) => ({ message: 'Logged out' });
