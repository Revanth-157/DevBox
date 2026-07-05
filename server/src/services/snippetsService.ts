import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { CreateSnippetInput, SnippetRecord, UpdateSnippetInput } from '../types/snippet.js';

const snippets: SnippetRecord[] = [];

const normalizeTags = (tags?: string[]) => (tags ?? []).map((tag) => tag.trim()).filter(Boolean);

const toRecord = (record: { id: string; title: string; code: string; language: string; description: string; tags: string[]; favorite: boolean; createdAt: Date; updatedAt: Date; userId: string }) => ({
  id: record.id,
  title: record.title,
  code: record.code,
  language: record.language,
  description: record.description,
  tags: record.tags ?? [],
  favorite: Boolean(record.favorite),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  userId: record.userId,
});

export const listSnippetsForUser = async (userId: string) =>
  runWithPrisma(async () => {
    const records = await prisma.snippet.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return records.map(toRecord);
  }, () =>
    snippets
      .filter((snippet) => snippet.userId === userId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
  );

export const createSnippetForUser = async (userId: string, input: CreateSnippetInput) =>
  runWithPrisma(async () => {
    const created = await prisma.snippet.create({
      data: {
        title: input.title.trim(),
        code: input.code.trim(),
        language: input.language.trim(),
        description: (input.description ?? '').trim(),
        tags: normalizeTags(input.tags),
        favorite: Boolean(input.favorite),
        userId,
      },
    });
    return toRecord(created);
  }, () => {
    const snippet: SnippetRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      code: input.code.trim(),
      language: input.language.trim(),
      description: (input.description ?? '').trim(),
      tags: normalizeTags(input.tags),
      favorite: Boolean(input.favorite),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    snippets.push(snippet);
    return snippet;
  });

export const updateSnippetForUser = async (userId: string, snippetId: string, input: UpdateSnippetInput) =>
  runWithPrisma(async () => {
    const existing = await prisma.snippet.findFirst({ where: { id: snippetId, userId } });
    if (!existing) {
      return null;
    }

    const updated = await prisma.snippet.update({
      where: { id: snippetId },
      data: {
        title: input.title?.trim() ?? existing.title,
        code: input.code?.trim() ?? existing.code,
        language: input.language?.trim() ?? existing.language,
        description: input.description?.trim() ?? existing.description,
        tags: input.tags ? normalizeTags(input.tags) : existing.tags,
        favorite: input.favorite ?? existing.favorite,
      },
    });

    return toRecord(updated);
  }, () => {
    const snippet = snippets.find((entry) => entry.id === snippetId && entry.userId === userId);
    if (!snippet) {
      return null;
    }

    Object.assign(snippet, {
      title: input.title?.trim() ?? snippet.title,
      code: input.code?.trim() ?? snippet.code,
      language: input.language?.trim() ?? snippet.language,
      description: input.description?.trim() ?? snippet.description,
      tags: input.tags ? normalizeTags(input.tags) : snippet.tags,
      favorite: input.favorite ?? snippet.favorite,
      updatedAt: new Date().toISOString(),
    });

    return snippet;
  });

export const deleteSnippetForUser = async (userId: string, snippetId: string) =>
  runWithPrisma(async () => {
    const result = await prisma.snippet.deleteMany({ where: { id: snippetId, userId } });
    return result.count > 0;
  }, () => {
    const index = snippets.findIndex((entry) => entry.id === snippetId && entry.userId === userId);
    if (index === -1) {
      return false;
    }

    snippets.splice(index, 1);
    return true;
  });

export const filterSnippetsByLanguage = async (userId: string, language: string) => {
  const snippetsForUser = await listSnippetsForUser(userId);
  return snippetsForUser.filter((snippet) => snippet.language.toLowerCase() === language.toLowerCase());
};
