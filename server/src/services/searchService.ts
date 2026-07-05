import { listNotesForUser } from './notesService.js';
import { listSnippetsForUser } from './snippetsService.js';
import { listQueriesForUser } from './sqlqueriesService.js';
import { listCollectionsForUser } from './apicollectionsService.js';
import { listResourcesForUser } from './resourcesService.js';
import { listTerminalCommandsForUser } from './terminalCommandsService.js';

const match = (value: unknown, q: string) => {
  if (!value) return false;
  return String(value).toLowerCase().includes(q);
};

export const searchForUser = async (userId: string, query?: string) => {
  const q = (query ?? '').trim().toLowerCase();
  const [notes, snippets, sqlQueries, apiCollections, resources, terminalCommands] = await Promise.all([
    listNotesForUser(userId),
    listSnippetsForUser(userId),
    listQueriesForUser(userId),
    listCollectionsForUser(userId),
    listResourcesForUser(userId),
    listTerminalCommandsForUser(userId),
  ]);

  return {
    notes: notes.filter((n) => q === '' || [n.title, n.content, ...n.tags].some((v) => match(v, q))),
    snippets: snippets.filter((s) => q === '' || [s.title, s.code, s.language, s.description, ...s.tags].some((v) => match(v, q))),
    sqlQueries: sqlQueries.filter((s) => q === '' || [s.title, s.query, s.databaseType, s.description, ...s.tags].some((v) => match(v, q))),
    apiCollections: apiCollections.filter((c) => q === '' || [c.title, c.url, c.method, c.description, ...c.tags].some((v) => match(v, q))),
    resources: resources.filter((r) => q === '' || [r.title, r.url, r.category, r.description, ...r.tags].some((v) => match(v, q))),
    terminalCommands: terminalCommands.filter((t) => q === '' || [t.title, t.command, t.os, t.description, ...t.tags].some((v) => match(v, q))),
  };
};

export default {};
