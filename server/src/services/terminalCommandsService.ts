import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { CreateTerminalCommandInput, TerminalCommandRecord, UpdateTerminalCommandInput } from '../types/terminalCommand.js';

const terminalCommands: TerminalCommandRecord[] = [];

const normalizeTags = (tags?: string[]) => (tags ?? []).map((tag) => tag.trim()).filter(Boolean);

const toRecord = (record: { id: string; title: string; command: string; description: string; os: string; tags: string[]; favorite: boolean; createdAt: Date; updatedAt: Date; userId: string }) => ({
  id: record.id,
  title: record.title,
  command: record.command,
  description: record.description,
  os: record.os,
  tags: record.tags ?? [],
  favorite: Boolean(record.favorite),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  userId: record.userId,
});

export const listTerminalCommandsForUser = async (userId: string) =>
  runWithPrisma(async () => {
    const records = await prisma.terminalCommand.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return records.map(toRecord);
  }, () =>
    terminalCommands
      .filter((entry) => entry.userId === userId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
  );

export const createTerminalCommandForUser = async (userId: string, input: CreateTerminalCommandInput) =>
  runWithPrisma(async () => {
    const created = await prisma.terminalCommand.create({
      data: {
        title: input.title.trim(),
        command: input.command.trim(),
        description: (input.description ?? '').trim(),
        os: input.os.trim(),
        tags: normalizeTags(input.tags),
        favorite: Boolean(input.favorite),
        userId,
      },
    });
    return toRecord(created);
  }, () => {
    const command: TerminalCommandRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      command: input.command.trim(),
      description: (input.description ?? '').trim(),
      os: input.os.trim(),
      tags: normalizeTags(input.tags),
      favorite: Boolean(input.favorite),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    terminalCommands.push(command);
    return command;
  });

export const updateTerminalCommandForUser = async (userId: string, commandId: string, input: UpdateTerminalCommandInput) =>
  runWithPrisma(async () => {
    const existing = await prisma.terminalCommand.findFirst({ where: { id: commandId, userId } });
    if (!existing) {
      return null;
    }

    const updated = await prisma.terminalCommand.update({
      where: { id: commandId },
      data: {
        title: input.title?.trim() ?? existing.title,
        command: input.command?.trim() ?? existing.command,
        description: input.description?.trim() ?? existing.description,
        os: input.os?.trim() ?? existing.os,
        tags: input.tags ? normalizeTags(input.tags) : existing.tags,
        favorite: input.favorite ?? existing.favorite,
      },
    });

    return toRecord(updated);
  }, () => {
    const command = terminalCommands.find((entry) => entry.id === commandId && entry.userId === userId);
    if (!command) {
      return null;
    }

    Object.assign(command, {
      title: input.title?.trim() ?? command.title,
      command: input.command?.trim() ?? command.command,
      description: input.description?.trim() ?? command.description,
      os: input.os?.trim() ?? command.os,
      tags: input.tags ? normalizeTags(input.tags) : command.tags,
      favorite: input.favorite ?? command.favorite,
      updatedAt: new Date().toISOString(),
    });

    return command;
  });

export const deleteTerminalCommandForUser = async (userId: string, commandId: string) =>
  runWithPrisma(async () => {
    const result = await prisma.terminalCommand.deleteMany({ where: { id: commandId, userId } });
    return result.count > 0;
  }, () => {
    const index = terminalCommands.findIndex((entry) => entry.id === commandId && entry.userId === userId);
    if (index === -1) {
      return false;
    }

    terminalCommands.splice(index, 1);
    return true;
  });

export const filterTerminalCommandsByOs = async (userId: string, os: string) => {
  const commandsForUser = await listTerminalCommandsForUser(userId);
  return commandsForUser.filter((entry) => entry.os.toLowerCase() === os.toLowerCase());
};
