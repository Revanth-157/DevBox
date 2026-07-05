import bcrypt from 'bcryptjs';
import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { ChangePasswordPayload, UpdateProfilePayload, UserProfile } from '../types/auth.js';
import { users } from './userStore.js';

const findUserById = (userId: string) => users.find((user) => user.id === userId);

export const getProfileForUser = async (userId: string): Promise<UserProfile> => {
  return runWithPrisma(async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl ?? undefined,
    };
  }, () => {
    const user = findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl ?? undefined,
    };
  });
};

export const updateProfileForUser = async (userId: string, payload: UpdateProfilePayload): Promise<UserProfile> => {
  const name = payload.name?.trim();
  const email = payload.email?.trim();

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  return runWithPrisma(async () => {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new Error('User not found');
    }

    const duplicate = await prisma.user.findFirst({ where: { id: { not: userId }, email: email.toLowerCase() } });
    if (duplicate) {
      throw new Error('Email already in use');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email: email.toLowerCase(),
        avatarUrl: payload.avatarUrl !== undefined ? payload.avatarUrl || null : existing.avatarUrl,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl ?? undefined,
    };
  }, () => {
    const existing = findUserById(userId);
    if (!existing) {
      throw new Error('User not found');
    }

    const duplicate = users.find((user) => user.id !== userId && user.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
      throw new Error('Email already in use');
    }

    Object.assign(existing, {
      name,
      email: email.toLowerCase(),
      avatarUrl: payload.avatarUrl !== undefined ? payload.avatarUrl || undefined : existing.avatarUrl,
    });

    return {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
      avatarUrl: existing.avatarUrl ?? undefined,
    };
  });
};

export const changePasswordForUser = async (userId: string, payload: ChangePasswordPayload): Promise<void> => {
  return runWithPrisma(async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    if (!payload.currentPassword || !payload.newPassword) {
      throw new Error('Current and new password are required');
    }

    const isValid = await bcrypt.compare(payload.currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(payload.newPassword, 10) },
    });
  }, async () => {
    const user = findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!payload.currentPassword || !payload.newPassword) {
      throw new Error('Current and new password are required');
    }

    const isValid = await bcrypt.compare(payload.currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(payload.newPassword, 10);
  });
};
