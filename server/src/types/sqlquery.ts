export interface SqlQueryRecord {
  id: string;
  title: string;
  query: string;
  databaseType: string;
  description: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateSqlQueryInput {
  title: string;
  query: string;
  databaseType: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface UpdateSqlQueryInput extends Partial<CreateSqlQueryInput> {}
