import type { AuthResponse, LoginPayload, Note, NotePayload, RegisterPayload, Snippet, SnippetPayload, SqlQuery, SqlQueryPayload, ApiCollection, ApiCollectionPayload, Resource, ResourcePayload, TerminalCommand, TerminalCommandPayload, GlobalSearchResults, FavoritesResults, User, UpdateProfilePayload, ChangePasswordPayload } from '../types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getToken = () => localStorage.getItem('devbox_token');
const getRefreshToken = () => localStorage.getItem('devbox_refresh_token');

export const persistAuthResponse = (response: AuthResponse) => {
  localStorage.setItem('devbox_token', response.token);
  localStorage.setItem('devbox_refresh_token', response.refreshToken);
  localStorage.setItem('devbox_user', JSON.stringify(response.user));
};

export const clearAuthStorage = () => {
  localStorage.removeItem('devbox_token');
  localStorage.removeItem('devbox_refresh_token');
  localStorage.removeItem('devbox_user');
};

export const getUserFromStorage = (): User | null => {
  const raw = localStorage.getItem('devbox_user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const request = async <T>(path: string, init: RequestInit = {}, retry = false): Promise<T> => {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !retry && getRefreshToken() && !path.startsWith('/api/auth')) {
      try {
        const refreshed = await request<AuthResponse>('/api/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: getRefreshToken() }),
        }, true);
        persistAuthResponse(refreshed);
        return request<T>(path, init, true);
      } catch {
        clearAuthStorage();
      }
    }

    throw new Error((data as { message?: string } | null)?.message || 'Request failed');
  }

  return data as T;
};

export const loginUser = (payload: LoginPayload) => request<AuthResponse>('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const registerUser = (payload: RegisterPayload) => request<AuthResponse>('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const listNotes = () => request<Note[]>('/api/notes');

export const createNote = (payload: NotePayload) => request<Note>('/api/notes', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateNote = (id: string, payload: NotePayload) => request<Note>(`/api/notes/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteNote = (id: string) => request<void>(`/api/notes/${id}`, { method: 'DELETE' });

export const listSnippets = (language?: string) => {
  const query = language ? `?language=${encodeURIComponent(language)}` : '';
  return request<Snippet[]>(`/api/snippets${query}`);
};

export const createSnippet = (payload: SnippetPayload) => request<Snippet>('/api/snippets', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateSnippet = (id: string, payload: SnippetPayload) => request<Snippet>(`/api/snippets/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteSnippet = (id: string) => request<void>(`/api/snippets/${id}`, { method: 'DELETE' });

export const listSqlQueries = (databaseType?: string) => {
  const query = databaseType ? `?databaseType=${encodeURIComponent(databaseType)}` : '';
  return request<SqlQuery[]>(`/api/sqlqueries${query}`);
};

export const createSqlQuery = (payload: SqlQueryPayload) => request<SqlQuery>('/api/sqlqueries', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateSqlQuery = (id: string, payload: SqlQueryPayload) => request<SqlQuery>(`/api/sqlqueries/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteSqlQuery = (id: string) => request<void>(`/api/sqlqueries/${id}`, { method: 'DELETE' });

export const listApiCollections = (method?: string) => {
  const query = method ? `?method=${encodeURIComponent(method)}` : '';
  return request<ApiCollection[]>(`/api/apicollections${query}`);
};

export const createApiCollection = (payload: ApiCollectionPayload) => request<ApiCollection>('/api/apicollections', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateApiCollection = (id: string, payload: ApiCollectionPayload) => request<ApiCollection>(`/api/apicollections/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteApiCollection = (id: string) => request<void>(`/api/apicollections/${id}`, { method: 'DELETE' });

export const listResources = (category?: string) => {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return request<Resource[]>(`/api/resources${query}`);
};

export const createResource = (payload: ResourcePayload) => request<Resource>('/api/resources', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateResource = (id: string, payload: ResourcePayload) => request<Resource>(`/api/resources/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteResource = (id: string) => request<void>(`/api/resources/${id}`, { method: 'DELETE' });

export const searchAll = (q?: string) => {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return request<GlobalSearchResults>(`/api/search${query}`);
};

export const listFavorites = () => request<FavoritesResults>('/api/favorites');

export const getProfile = () => request<User>('/api/profile');

export const updateProfile = (payload: UpdateProfilePayload) => request<User>('/api/profile', {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const changePassword = (payload: ChangePasswordPayload) => request<{ message: string }>('/api/profile/password', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const listTerminalCommands = (os?: string) => {
  const query = os ? `?os=${encodeURIComponent(os)}` : '';
  return request<TerminalCommand[]>(`/api/terminalcommands${query}`);
};

export const logoutUser = async () => {
  const refreshToken = getRefreshToken();
  clearAuthStorage();

  if (!refreshToken) {
    return { message: 'Logged out' };
  }

  try {
    return await request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return { message: 'Logged out' };
  }
};

export const createTerminalCommand = (payload: TerminalCommandPayload) => request<TerminalCommand>('/api/terminalcommands', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const updateTerminalCommand = (id: string, payload: TerminalCommandPayload) => request<TerminalCommand>(`/api/terminalcommands/${id}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});

export const deleteTerminalCommand = (id: string) => request<void>(`/api/terminalcommands/${id}`, { method: 'DELETE' });
