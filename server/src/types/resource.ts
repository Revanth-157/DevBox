export interface ResourceRecord {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateResourceInput {
  title: string;
  url: string;
  category: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface UpdateResourceInput extends Partial<CreateResourceInput> {}
