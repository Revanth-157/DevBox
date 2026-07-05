import { Request, Response } from 'express';
import {
  createNoteForUser,
  deleteNoteForUser,
  listNotesForUser,
  updateNoteForUser,
} from '../services/notesService.js';
import type { CreateNoteInput, UpdateNoteInput } from '../types/note.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export const listNotes = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const notes = await listNotesForUser(userId);
  return res.status(200).json(notes);
};

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = req.body as CreateNoteInput;
  if (!payload.title || !payload.content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const note = await createNoteForUser(userId, payload);
  return res.status(201).json(note);
};

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const noteId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const payload = req.body as UpdateNoteInput;
  const updated = await updateNoteForUser(userId, noteId, payload);

  if (!updated) {
    return res.status(404).json({ message: 'Note not found' });
  }

  return res.status(200).json(updated);
};

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const noteId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await deleteNoteForUser(userId, noteId);

  if (!deleted) {
    return res.status(404).json({ message: 'Note not found' });
  }

  return res.status(204).send();
};
