import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { CreateNoteInput, NoteRecord, UpdateNoteInput } from '../types/note.js';

const notes: NoteRecord[] = [];

const normalizeTags = (tags?: string[]) => (tags ?? []).map((tag) => tag.trim()).filter(Boolean);

const toRecord = (record: { id: string; title: string; content: string; tags: string[]; favorite: boolean; createdAt: Date; updatedAt: Date; userId: string }) => ({
  id: record.id,
  title: record.title,
  content: record.content,
  tags: record.tags ?? [],
  favorite: Boolean(record.favorite),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  userId: record.userId,
});

export const listNotesForUser = async (userId: string) =>
  runWithPrisma(async () => {
    const records = await prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return records.map(toRecord);
  }, () =>
    notes
      .filter((note) => note.userId === userId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
  );

export const createNoteForUser = async (userId: string, input: CreateNoteInput) =>
  runWithPrisma(async () => {
    const created = await prisma.note.create({
      data: {
        title: input.title.trim(),
        content: input.content.trim(),
        tags: normalizeTags(input.tags),
        favorite: Boolean(input.favorite),
        userId,
      },
    });
    return toRecord(created);
  }, () => {
    const note: NoteRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      content: input.content.trim(),
      tags: normalizeTags(input.tags),
      favorite: Boolean(input.favorite),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    notes.push(note);
    return note;
  });

export const updateNoteForUser = async (userId: string, noteId: string, input: UpdateNoteInput) =>
  runWithPrisma(async () => {
    const existing = await prisma.note.findFirst({ where: { id: noteId, userId } });
    if (!existing) {
      return null;
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: input.title?.trim() ?? existing.title,
        content: input.content?.trim() ?? existing.content,
        tags: input.tags ? normalizeTags(input.tags) : existing.tags,
        favorite: input.favorite ?? existing.favorite,
      },
    });

    return toRecord(updated);
  }, () => {
    const note = notes.find((entry) => entry.id === noteId && entry.userId === userId);
    if (!note) {
      return null;
    }

    Object.assign(note, {
      title: input.title?.trim() ?? note.title,
      content: input.content?.trim() ?? note.content,
      tags: input.tags ? normalizeTags(input.tags) : note.tags,
      favorite: input.favorite ?? note.favorite,
      updatedAt: new Date().toISOString(),
    });

    return note;
  });

export const deleteNoteForUser = async (userId: string, noteId: string) =>
  runWithPrisma(async () => {
    const result = await prisma.note.deleteMany({ where: { id: noteId, userId } });
    return result.count > 0;
  }, () => {
    const index = notes.findIndex((entry) => entry.id === noteId && entry.userId === userId);
    if (index === -1) {
      return false;
    }

    notes.splice(index, 1);
    return true;
  });
