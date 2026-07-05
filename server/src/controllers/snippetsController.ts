import { Request, Response } from 'express';
import {
  createSnippetForUser,
  deleteSnippetForUser,
  filterSnippetsByLanguage,
  listSnippetsForUser,
  updateSnippetForUser,
} from '../services/snippetsService.js';
import type { CreateSnippetInput, UpdateSnippetInput } from '../types/snippet.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listSnippets = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const language = req.query.language as string | undefined;
  const snippets = language ? await filterSnippetsByLanguage(userId, language) : await listSnippetsForUser(userId);
  return res.status(200).json(snippets);
};

export const createSnippet = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = req.body as CreateSnippetInput;
  if (!payload.title || !payload.code || !payload.language) {
    return res.status(400).json({ message: 'Title, code, and language are required' });
  }

  const snippet = await createSnippetForUser(userId, payload);
  return res.status(201).json(snippet);
};

export const updateSnippet = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const snippetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body as UpdateSnippetInput;
  const updated = await updateSnippetForUser(userId, snippetId, payload);

  if (!updated) {
    return res.status(404).json({ message: 'Snippet not found' });
  }

  return res.status(200).json(updated);
};

export const deleteSnippet = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const snippetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await deleteSnippetForUser(userId, snippetId);

  if (!deleted) {
    return res.status(404).json({ message: 'Snippet not found' });
  }

  return res.status(204).send();
};
