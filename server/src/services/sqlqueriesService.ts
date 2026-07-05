import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { CreateSqlQueryInput, SqlQueryRecord, UpdateSqlQueryInput } from '../types/sqlquery.js';

const queries: SqlQueryRecord[] = [];

const normalizeTags = (tags?: string[]) => (tags ?? []).map((tag) => tag.trim()).filter(Boolean);

const toRecord = (record: { id: string; title: string; query: string; databaseType: string; description: string; tags: string[]; favorite: boolean; createdAt: Date; updatedAt: Date; userId: string }) => ({
  id: record.id,
  title: record.title,
  query: record.query,
  databaseType: record.databaseType,
  description: record.description,
  tags: record.tags ?? [],
  favorite: Boolean(record.favorite),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  userId: record.userId,
});

export const listQueriesForUser = async (userId: string) =>
  runWithPrisma(async () => {
    const records = await prisma.sqlQuery.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return records.map(toRecord);
  }, () =>
    queries
      .filter((query) => query.userId === userId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
  );

export const createQueryForUser = async (userId: string, input: CreateSqlQueryInput) =>
  runWithPrisma(async () => {
    const created = await prisma.sqlQuery.create({
      data: {
        title: input.title.trim(),
        query: input.query.trim(),
        databaseType: input.databaseType.trim(),
        description: (input.description ?? '').trim(),
        tags: normalizeTags(input.tags),
        favorite: Boolean(input.favorite),
        userId,
      },
    });
    return toRecord(created);
  }, () => {
    const query: SqlQueryRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      query: input.query.trim(),
      databaseType: input.databaseType.trim(),
      description: (input.description ?? '').trim(),
      tags: normalizeTags(input.tags),
      favorite: Boolean(input.favorite),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    queries.push(query);
    return query;
  });

export const updateQueryForUser = async (userId: string, queryId: string, input: UpdateSqlQueryInput) =>
  runWithPrisma(async () => {
    const existing = await prisma.sqlQuery.findFirst({ where: { id: queryId, userId } });
    if (!existing) {
      return null;
    }

    const updated = await prisma.sqlQuery.update({
      where: { id: queryId },
      data: {
        title: input.title?.trim() ?? existing.title,
        query: input.query?.trim() ?? existing.query,
        databaseType: input.databaseType?.trim() ?? existing.databaseType,
        description: input.description?.trim() ?? existing.description,
        tags: input.tags ? normalizeTags(input.tags) : existing.tags,
        favorite: input.favorite ?? existing.favorite,
      },
    });

    return toRecord(updated);
  }, () => {
    const query = queries.find((entry) => entry.id === queryId && entry.userId === userId);
    if (!query) {
      return null;
    }

    Object.assign(query, {
      title: input.title?.trim() ?? query.title,
      query: input.query?.trim() ?? query.query,
      databaseType: input.databaseType?.trim() ?? query.databaseType,
      description: input.description?.trim() ?? query.description,
      tags: input.tags ? normalizeTags(input.tags) : query.tags,
      favorite: input.favorite ?? query.favorite,
      updatedAt: new Date().toISOString(),
    });

    return query;
  });

export const deleteQueryForUser = async (userId: string, queryId: string) =>
  runWithPrisma(async () => {
    const result = await prisma.sqlQuery.deleteMany({ where: { id: queryId, userId } });
    return result.count > 0;
  }, () => {
    const index = queries.findIndex((entry) => entry.id === queryId && entry.userId === userId);
    if (index === -1) {
      return false;
    }

    queries.splice(index, 1);
    return true;
  });

export const filterQueriesByDatabaseType = async (userId: string, databaseType: string) => {
  const queriesForUser = await listQueriesForUser(userId);
  return queriesForUser.filter((query) => query.databaseType.toLowerCase() === databaseType.toLowerCase());
};
