export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tags?: string[];
  favorite?: boolean;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {}
