export interface ApiCollectionRecord {
  id: string;
  title: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  description: string;
  tags: string[];
  favorite: boolean;
  responseExample: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateApiCollectionInput {
  title: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
  responseExample?: string;
}

export interface UpdateApiCollectionInput extends Partial<CreateApiCollectionInput> {}
