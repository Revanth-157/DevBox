import { prisma, runWithPrisma } from '../lib/prisma.js';
import type { CreateResourceInput, ResourceRecord, UpdateResourceInput } from '../types/resource.js';

const resources: ResourceRecord[] = [];

const normalizeTags = (tags?: string[]) => (tags ?? []).map((tag) => tag.trim()).filter(Boolean);

const toRecord = (record: { id: string; title: string; url: string; category: string; description: string; tags: string[]; favorite: boolean; createdAt: Date; updatedAt: Date; userId: string }) => ({
  id: record.id,
  title: record.title,
  url: record.url,
  category: record.category,
  description: record.description,
  tags: record.tags ?? [],
  favorite: Boolean(record.favorite),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
  userId: record.userId,
});

export const listResourcesForUser = async (userId: string) =>
  runWithPrisma(async () => {
    const records = await prisma.resource.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
    return records.map(toRecord);
  }, () =>
    resources
      .filter((resource) => resource.userId === userId)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()),
  );

export const createResourceForUser = async (userId: string, input: CreateResourceInput) =>
  runWithPrisma(async () => {
    const created = await prisma.resource.create({
      data: {
        title: input.title.trim(),
        url: input.url.trim(),
        category: input.category.trim(),
        description: (input.description ?? '').trim(),
        tags: normalizeTags(input.tags),
        favorite: Boolean(input.favorite),
        userId,
      },
    });
    return toRecord(created);
  }, () => {
    const resource: ResourceRecord = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: input.title.trim(),
      url: input.url.trim(),
      category: input.category.trim(),
      description: (input.description ?? '').trim(),
      tags: normalizeTags(input.tags),
      favorite: Boolean(input.favorite),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    resources.push(resource);
    return resource;
  });

export const updateResourceForUser = async (userId: string, resourceId: string, input: UpdateResourceInput) =>
  runWithPrisma(async () => {
    const existing = await prisma.resource.findFirst({ where: { id: resourceId, userId } });
    if (!existing) {
      return null;
    }

    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: input.title?.trim() ?? existing.title,
        url: input.url?.trim() ?? existing.url,
        category: input.category?.trim() ?? existing.category,
        description: input.description?.trim() ?? existing.description,
        tags: input.tags ? normalizeTags(input.tags) : existing.tags,
        favorite: input.favorite ?? existing.favorite,
      },
    });

    return toRecord(updated);
  }, () => {
    const resource = resources.find((entry) => entry.id === resourceId && entry.userId === userId);
    if (!resource) {
      return null;
    }

    Object.assign(resource, {
      title: input.title?.trim() ?? resource.title,
      url: input.url?.trim() ?? resource.url,
      category: input.category?.trim() ?? resource.category,
      description: input.description?.trim() ?? resource.description,
      tags: input.tags ? normalizeTags(input.tags) : resource.tags,
      favorite: input.favorite ?? resource.favorite,
      updatedAt: new Date().toISOString(),
    });

    return resource;
  });

export const deleteResourceForUser = async (userId: string, resourceId: string) =>
  runWithPrisma(async () => {
    const result = await prisma.resource.deleteMany({ where: { id: resourceId, userId } });
    return result.count > 0;
  }, () => {
    const index = resources.findIndex((entry) => entry.id === resourceId && entry.userId === userId);
    if (index === -1) {
      return false;
    }

    resources.splice(index, 1);
    return true;
  });

export const filterResourcesByCategory = async (userId: string, category: string) => {
  const resourcesForUser = await listResourcesForUser(userId);
  return resourcesForUser.filter((resource) => resource.category.toLowerCase() === category.toLowerCase());
};
