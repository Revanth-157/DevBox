import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listApiCollections,
  listNotes,
  listResources,
  listSnippets,
  listSqlQueries,
  listTerminalCommands,
} from '../lib/api';
import type {
  ApiCollection,
  Note,
  Resource,
  Snippet,
  SqlQuery,
  TerminalCommand,
} from '../types';

const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [queries, setQueries] = useState<SqlQuery[]>([]);
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadDashboardData = async () => {
    try {
      const [nextNotes, nextSnippets, nextQueries, nextCollections, nextResources, nextCommands] = await Promise.all([
        listNotes(),
        listSnippets(),
        listSqlQueries(),
        listApiCollections(),
        listResources(),
        listTerminalCommands(),
      ]);

      setNotes(nextNotes);
      setSnippets(nextSnippets);
      setQueries(nextQueries);
      setCollections(nextCollections);
      setResources(nextResources);
      setCommands(nextCommands);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const stats = useMemo(
    () => ({
      notes: notes.length,
      snippets: snippets.length,
      queries: queries.length,
      apis: collections.length,
      resources: resources.length,
      commands: commands.length,
      favorites:
        notes.filter((item) => item.favorite).length +
        snippets.filter((item) => item.favorite).length +
        queries.filter((item) => item.favorite).length +
        collections.filter((item) => item.favorite).length +
        resources.filter((item) => item.favorite).length +
        commands.filter((item) => item.favorite).length,
    }),
    [notes, snippets, queries, collections, resources, commands],
  );

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      ),
    [notes, search],
  );

  const filteredSnippets = useMemo(
    () =>
      snippets.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(search.toLowerCase()) ||
          snippet.language.toLowerCase().includes(search.toLowerCase()) ||
          snippet.description.toLowerCase().includes(search.toLowerCase()) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      ),
    [snippets, search],
  );

  const filteredQueries = useMemo(
    () =>
      queries.filter(
        (query) =>
          query.title.toLowerCase().includes(search.toLowerCase()) ||
          query.databaseType.toLowerCase().includes(search.toLowerCase()) ||
          query.description.toLowerCase().includes(search.toLowerCase()) ||
          query.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      ),
    [queries, search],
  );

  const filteredCollections = useMemo(
    () =>
      collections.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.method.toLowerCase().includes(search.toLowerCase()) ||
          item.url.toLowerCase().includes(search.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      ),
    [collections, search],
  );

  const filteredResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(search.toLowerCase()) ||
          resource.category.toLowerCase().includes(search.toLowerCase()) ||
          resource.description.toLowerCase().includes(search.toLowerCase()) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      ),
    [resources, search],
  );

  const filteredCommands = useMemo(
    () =>
      commands.filter(
        (command) =>
          command.title.toLowerCase().includes(search.toLowerCase()) ||
          command.command.toLowerCase().includes(search.toLowerCase()) ||
          command.description.toLowerCase().includes(search.toLowerCase()) ||
          command.os.toLowerCase().includes(search.toLowerCase()) ||
          command.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      ),
    [commands, search],
  );

  const favoriteItems = useMemo(() => {
    const items = [
      ...notes
        .filter((item) => item.favorite)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.tags.join(', ') || item.content.slice(0, 60),
          category: 'Notes',
          updatedAt: item.updatedAt,
          route: '/notes',
        })),
      ...snippets
        .filter((item) => item.favorite)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.language,
          category: 'Snippets',
          updatedAt: item.updatedAt,
          route: '/snippets',
        })),
      ...queries
        .filter((item) => item.favorite)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.databaseType,
          category: 'SQL Queries',
          updatedAt: item.updatedAt,
          route: '/sqlqueries',
        })),
      ...collections
        .filter((item) => item.favorite)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.method,
          category: 'API Vault',
          updatedAt: item.updatedAt,
          route: '/apicollections',
        })),
      ...resources
        .filter((item) => item.favorite)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.category,
          category: 'Resources',
          updatedAt: item.updatedAt,
          route: '/resources',
        })),
      ...commands
        .filter((item) => item.favorite)
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.os,
          category: 'Terminal',
          updatedAt: item.updatedAt,
          route: '/terminalcommands',
        })),
    ];

    return items.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  }, [notes, snippets, queries, collections, resources, commands]);

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">DevBox Dashboard</p>
            <h1 className="dashboard-title">Workspace overview</h1>
          </div>
          <div className="dashboard-actions">
            <Link to="/favorites" className="dashboard-link">Favorites</Link>
            <Link to="/profile" className="dashboard-link">Profile</Link>
          </div>
        </header>

        <section className="dashboard-card-grid">
          <article className="dashboard-card">
            <p className="dashboard-card-label">Notes</p>
            <h2>{stats.notes}</h2>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Snippets</p>
            <h2>{stats.snippets}</h2>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">SQL Queries</p>
            <h2>{stats.queries}</h2>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">API Collections</p>
            <h2>{stats.apis}</h2>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Resources</p>
            <h2>{stats.resources}</h2>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Terminal Commands</p>
            <h2>{stats.commands}</h2>
          </article>
          <article className="dashboard-card dashboard-card-highlight">
            <p className="dashboard-card-label">Favorites</p>
            <h2>{favoriteItems.length}</h2>
          </article>
        </section>

        <section className="dashboard-search-panel">
          <div className="dashboard-search-box">
            <label htmlFor="dashboard-search" className="dashboard-search-label">Search workspace</label>
            <input
              id="dashboard-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes, snippets, SQL, APIs, resources, and commands"
              className="dashboard-search-input"
            />
          </div>
          <div className="dashboard-summary-card">
            <p className="dashboard-summary-label">Recent favorites</p>
            <Link to="/favorites" className="dashboard-summary-value">View all</Link>
          </div>
        </section>

        {error ? <p className="dashboard-error">{error}</p> : null}

        <section className="dashboard-section-grid">
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent notes</h2>
              <Link to="/notes">See all</Link>
            </div>
            {filteredNotes.slice(0, 3).map((note) => (
              <article key={note.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{note.title}</h3>
                <p className="dashboard-item-meta">{note.content.slice(0, 100)}{note.content.length > 100 ? '…' : ''}</p>
              </article>
            ))}
            {filteredNotes.length === 0 ? <p className="dashboard-empty">No matching notes.</p> : null}
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent snippets</h2>
              <Link to="/snippets">See all</Link>
            </div>
            {filteredSnippets.slice(0, 3).map((snippet) => (
              <article key={snippet.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{snippet.title}</h3>
                <p className="dashboard-item-meta">{snippet.language} • {snippet.description.slice(0, 100)}{snippet.description.length > 100 ? '…' : ''}</p>
              </article>
            ))}
            {filteredSnippets.length === 0 ? <p className="dashboard-empty">No matching snippets.</p> : null}
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent SQL queries</h2>
              <Link to="/sqlqueries">See all</Link>
            </div>
            {filteredQueries.slice(0, 3).map((query) => (
              <article key={query.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{query.title}</h3>
                <p className="dashboard-item-meta">{query.databaseType} • {query.description.slice(0, 100)}{query.description.length > 100 ? '…' : ''}</p>
              </article>
            ))}
            {filteredQueries.length === 0 ? <p className="dashboard-empty">No matching SQL queries.</p> : null}
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent APIs</h2>
              <Link to="/apicollections">See all</Link>
            </div>
            {filteredCollections.slice(0, 3).map((collection) => (
              <article key={collection.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{collection.title}</h3>
                <p className="dashboard-item-meta">{collection.method} • {collection.url}</p>
              </article>
            ))}
            {filteredCollections.length === 0 ? <p className="dashboard-empty">No matching APIs.</p> : null}
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent resources</h2>
              <Link to="/resources">See all</Link>
            </div>
            {filteredResources.slice(0, 3).map((resource) => (
              <article key={resource.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{resource.title}</h3>
                <p className="dashboard-item-meta">{resource.category} • {resource.url}</p>
              </article>
            ))}
            {filteredResources.length === 0 ? <p className="dashboard-empty">No matching resources.</p> : null}
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Recent terminal commands</h2>
              <Link to="/terminalcommands">See all</Link>
            </div>
            {filteredCommands.slice(0, 3).map((command) => (
              <article key={command.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{command.title}</h3>
                <p className="dashboard-item-meta">{command.os} • {command.command.slice(0, 100)}{command.command.length > 100 ? '…' : ''}</p>
              </article>
            ))}
            {filteredCommands.length === 0 ? <p className="dashboard-empty">No matching terminal commands.</p> : null}
          </section>

          <section className="dashboard-section dashboard-favorites-section">
            <div className="dashboard-section-header">
              <h2>Favorite items</h2>
              <Link to="/favorites">See all</Link>
            </div>
            {favoriteItems.slice(0, 6).map((favorite) => (
              <article key={favorite.id} className="dashboard-item">
                <h3 className="dashboard-item-title">{favorite.title}</h3>
                <p className="dashboard-item-meta">{favorite.category} • {favorite.subtitle}</p>
              </article>
            ))}
            {favoriteItems.length === 0 ? <p className="dashboard-empty">No favorites yet.</p> : null}
          </section>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
