import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { ApiCollectionRecord, CreateApiCollectionInput, UpdateApiCollectionInput } from '../types/apicollection.js';

const collections: ApiCollectionRecord[] = [];

const normalizeTags = (tags?: string[]) => (tags ?? []).map((tag) => tag.trim()).filter(Boolean);

const toRecord = (record: { id: string; title: string; method: string; url: string; headers: Record<string, string> | unknown; body: string; description: string; responseExample: string; tags: string[]; favorite: boolean; createdAt: Date; updatedAt: Date; userId: string }) => ({
  id: record.id,
  title: record.title,
  method: record.method,
  url: record.url,
  headers: (record.headers as Record<string, string>) ?? {},
  body: record.body,
  description: record.description,
  responseExample: record.responseExample,
  tags: record.tags ?? [],
  favorite: Boolean(record.favorite),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  userId: record.userId,
});

export const listCollectionsForUser = async (userId: string) =>
  runWithPrisma(async () => {
    const records = await prisma.apiCollection.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return records.map(toRecord);
  }, () =>
    collections
      .filter((collection) => collection.userId === userId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
  );

export const createCollectionForUser = async (userId: string, input: CreateApiCollectionInput) =>
  runWithPrisma(async () => {
    const created = await prisma.apiCollection.create({
      data: {
        title: input.title.trim(),
        method: input.method.trim().toUpperCase(),
        url: input.url.trim(),
        headers: input.headers ?? {},
        body: (input.body ?? '').trim(),
        description: (input.description ?? '').trim(),
        responseExample: (input.responseExample ?? '').trim(),
        tags: normalizeTags(input.tags),
        favorite: Boolean(input.favorite),
        userId,
      },
    });
    return toRecord(created);
  }, () => {
    const collection: ApiCollectionRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      method: input.method.trim().toUpperCase(),
      url: input.url.trim(),
      headers: input.headers ?? {},
      body: (input.body ?? '').trim(),
      description: (input.description ?? '').trim(),
      tags: normalizeTags(input.tags),
      favorite: Boolean(input.favorite),
      responseExample: (input.responseExample ?? '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    collections.push(collection);
    return collection;
  });

export const updateCollectionForUser = async (userId: string, collectionId: string, input: UpdateApiCollectionInput) =>
  runWithPrisma(async () => {
    const existing = await prisma.apiCollection.findFirst({ where: { id: collectionId, userId } });
    if (!existing) {
      return null;
    }

    const updated = await prisma.apiCollection.update({
      where: { id: collectionId },
      data: {
        title: input.title?.trim() ?? existing.title,
        method: input.method?.trim().toUpperCase() ?? existing.method,
        url: input.url?.trim() ?? existing.url,
        headers: (input.headers ?? existing.headers ?? {}) as Record<string, string>,
        body: input.body?.trim() ?? existing.body,
        description: input.description?.trim() ?? existing.description,
        responseExample: input.responseExample?.trim() ?? existing.responseExample,
        tags: input.tags ? normalizeTags(input.tags) : existing.tags,
        favorite: input.favorite ?? existing.favorite,
      },
    });

    return toRecord(updated);
  }, () => {
    const collection = collections.find((entry) => entry.id === collectionId && entry.userId === userId);
    if (!collection) {
      return null;
    }

    Object.assign(collection, {
      title: input.title?.trim() ?? collection.title,
      method: input.method?.trim().toUpperCase() ?? collection.method,
      url: input.url?.trim() ?? collection.url,
      headers: input.headers ?? collection.headers,
      body: input.body?.trim() ?? collection.body,
      description: input.description?.trim() ?? collection.description,
      tags: input.tags ? normalizeTags(input.tags) : collection.tags,
      favorite: input.favorite ?? collection.favorite,
      responseExample: input.responseExample?.trim() ?? collection.responseExample,
      updatedAt: new Date().toISOString(),
    });

    return collection;
  });

export const deleteCollectionForUser = async (userId: string, collectionId: string) =>
  runWithPrisma(async () => {
    const result = await prisma.apiCollection.deleteMany({ where: { id: collectionId, userId } });
    return result.count > 0;
  }, () => {
    const index = collections.findIndex((entry) => entry.id === collectionId && entry.userId === userId);
    if (index === -1) {
      return false;
    }

    collections.splice(index, 1);
    return true;
  });

export const filterCollectionsByMethod = async (userId: string, method: string) => {
  const collectionsForUser = await listCollectionsForUser(userId);
  return collectionsForUser.filter((collection) => collection.method === method.toUpperCase());
};
