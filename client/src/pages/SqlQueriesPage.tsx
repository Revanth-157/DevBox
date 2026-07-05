import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createSqlQuery, deleteSqlQuery, listSqlQueries, updateSqlQuery } from '../lib/api';
import type { SqlQuery, SqlQueryPayload } from '../types';

const DATABASE_TYPES = ['PostgreSQL', 'MySQL', 'SQL Server', 'SQLite', 'MongoDB', 'Oracle', 'MariaDB', 'Redis'];
const emptyForm = { title: '', query: '', databaseType: 'PostgreSQL', description: '', tags: '' };

const SqlQueriesPage = () => {
  const [queries, setQueries] = useState<SqlQuery[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadQueries = async (databaseType?: string) => {
    try {
      const nextQueries = await listSqlQueries(databaseType);
      setQueries(nextQueries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load queries');
    }
  };

  useEffect(() => {
    void loadQueries(filter || undefined);
  }, [filter]);

  const stats = useMemo(
    () => ({
      total: queries.length,
      favorites: queries.filter((q) => q.favorite).length,
      databases: new Set(queries.map((q) => q.databaseType)).size,
    }),
    [queries],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.query.trim()) {
      setError('Title and query are required');
      return;
    }

    const payload: SqlQueryPayload = {
      title: form.title.trim(),
      query: form.query.trim(),
      databaseType: form.databaseType,
      description: form.description.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      favorite: false,
    };

    try {
      if (editingId) {
        const updated = await updateSqlQuery(editingId, payload);
        setQueries((current) => current.map((q) => (q.id === updated.id ? updated : q)));
      } else {
        const created = await createSqlQuery(payload);
        setQueries((current) => [created, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save query');
    }
  };

  const startEdit = (query: SqlQuery) => {
    setEditingId(query.id);
    setForm({
      title: query.title,
      query: query.query,
      databaseType: query.databaseType,
      description: query.description,
      tags: query.tags.join(', '),
    });
  };

  const handleDelete = async (queryId: string) => {
    try {
      await deleteSqlQuery(queryId);
      setQueries((current) => current.filter((q) => q.id !== queryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete query');
    }
  };

  return (
    <main className="sqlquery-page">
      <div className="sqlquery-container">
        <header className="sqlquery-header">
          <div>
            <p className="sqlquery-kicker">DevBox Workspace</p>
            <h1 className="sqlquery-title">SQL Queries Repository</h1>
          </div>
        </header>

        <section className="sqlquery-stats-grid">
          <div className="sqlquery-stat-card">
            <p className="sqlquery-stat-label">Total queries</p>
            <h2>{stats.total}</h2>
          </div>
          <div className="sqlquery-stat-card">
            <p className="sqlquery-stat-label">Favorites</p>
            <h2>{stats.favorites}</h2>
          </div>
          <div className="sqlquery-stat-card">
            <p className="sqlquery-stat-label">Databases</p>
            <h2>{stats.databases}</h2>
          </div>
        </section>

        <section className="sqlquery-content-grid">
          <form onSubmit={handleSubmit} className="sqlquery-form">
            <h2>{editingId ? 'Update query' : 'Create a query'}</h2>
            {error ? <p className="sqlquery-error">{error}</p> : null}
            <label className="sqlquery-form-label" htmlFor="sqlquery-title">Title</label>
            <input
              id="sqlquery-title"
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="sqlquery-form-input"
            />
            <label className="sqlquery-form-label" htmlFor="sqlquery-databaseType">Database Type</label>
            <select
              id="sqlquery-databaseType"
              value={form.databaseType}
              onChange={(e) => setForm((current) => ({ ...current, databaseType: e.target.value }))}
              className="sqlquery-form-select"
            >
              {DATABASE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="sqlquery-form-label" htmlFor="sqlquery-query">SQL Query</label>
            <textarea
              id="sqlquery-query"
              rows={12}
              value={form.query}
              onChange={(e) => setForm((current) => ({ ...current, query: e.target.value }))}
              className="sqlquery-form-textarea"
            />
            <label className="sqlquery-form-label" htmlFor="sqlquery-description">Description</label>
            <input
              id="sqlquery-description"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="sqlquery-form-input"
            />
            <label className="sqlquery-form-label" htmlFor="sqlquery-tags">Tags</label>
            <input
              id="sqlquery-tags"
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              className="sqlquery-form-input"
            />
            <button type="submit" className="sqlquery-button sqlquery-button-primary">
              {editingId ? 'Save changes' : 'Create query'}
            </button>
          </form>

          <section className="sqlquery-list-panel">
            <div className="sqlquery-list-header">
              <div>
                <h2>Query collection</h2>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="sqlquery-filter-select"
              >
                <option value="">All databases</option>
                {DATABASE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="sqlquery-card-list">
              {queries.map((query) => (
                <article key={query.id} className="sqlquery-card">
                  <div className="sqlquery-card-heading">
                    <h3 className="sqlquery-card-title">{query.title}</h3>
                    <span className="sqlquery-card-tag">{query.databaseType}</span>
                  </div>
                  {query.description && <p className="sqlquery-card-description">{query.description}</p>}
                  <pre className="sqlquery-pre">
                    <code>{query.query}</code>
                  </pre>
                  <div className="sqlquery-tags">
                    {query.tags.map((tag) => (
                      <span key={tag} className="sqlquery-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="sqlquery-actions">
                    <button type="button" onClick={() => startEdit(query)} className="sqlquery-button sqlquery-button-secondary">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(query.id)} className="sqlquery-button sqlquery-button-danger">
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default SqlQueriesPage;
