import { listNotesForUser } from './notesService.js';
import { listSnippetsForUser } from './snippetsService.js';
import { listQueriesForUser } from './sqlqueriesService.js';
import { listCollectionsForUser } from './apicollectionsService.js';
import { listResourcesForUser } from './resourcesService.js';
import { listTerminalCommandsForUser } from './terminalCommandsService.js';

export const favoritesForUser = async (userId: string) => {
  const [notes, snippets, sqlQueries, apiCollections, resources, terminalCommands] = await Promise.all([
    listNotesForUser(userId),
    listSnippetsForUser(userId),
    listQueriesForUser(userId),
    listCollectionsForUser(userId),
    listResourcesForUser(userId),
    listTerminalCommandsForUser(userId),
  ]);

  return {
    notes: notes.filter((n) => n.favorite),
    snippets: snippets.filter((s) => s.favorite),
    sqlQueries: sqlQueries.filter((q) => q.favorite),
    apiCollections: apiCollections.filter((c) => c.favorite),
    resources: resources.filter((r) => r.favorite),
    terminalCommands: terminalCommands.filter((t) => t.favorite),
  };
};

export default {};
