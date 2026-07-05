export interface SnippetRecord {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateSnippetInput {
  title: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface UpdateSnippetInput extends Partial<CreateSnippetInput> {}
