export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface NotePayload {
  title: string;
  content: string;
  tags?: string[];
  favorite?: boolean;
}

export interface Snippet {
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

export interface SnippetPayload {
  title: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface SqlQuery {
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

export interface SqlQueryPayload {
  title: string;
  query: string;
  databaseType: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface ApiCollection {
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

export interface ApiCollectionPayload {
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

export interface Resource {
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

export interface ResourcePayload {
  title: string;
  url: string;
  category: string;
  description?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface TerminalCommand {
  id: string;
  title: string;
  command: string;
  description: string;
  os: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TerminalCommandPayload {
  title: string;
  command: string;
  description?: string;
  os: string;
  tags?: string[];
  favorite?: boolean;
}

export interface GlobalSearchResults {
  notes: Note[];
  snippets: Snippet[];
  sqlQueries: SqlQuery[];
  apiCollections: ApiCollection[];
  resources: Resource[];
  terminalCommands: TerminalCommand[];
}

export interface FavoritesResults {
  notes: Note[];
  snippets: Snippet[];
  sqlQueries: SqlQuery[];
  apiCollections: ApiCollection[];
  resources: Resource[];
  terminalCommands: TerminalCommand[];
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
