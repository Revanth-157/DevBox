import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createApiCollection, deleteApiCollection, listApiCollections, updateApiCollection } from '../lib/api';
import type { ApiCollection, ApiCollectionPayload } from '../types';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const emptyForm = { title: '', method: 'GET', url: '', body: '', description: '', tags: '', responseExample: '' };

const ApiCollectionsPage = () => {
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadCollections = async (method?: string) => {
    try {
      const nextCollections = await listApiCollections(method);
      setCollections(nextCollections);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load collections');
    }
  };

  useEffect(() => {
    void loadCollections(filter || undefined);
  }, [filter]);

  const stats = useMemo(
    () => ({
      total: collections.length,
      favorites: collections.filter((c) => c.favorite).length,
      methods: new Set(collections.map((c) => c.method)).size,
    }),
    [collections],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      setError('Title and URL are required');
      return;
    }

    const payload: ApiCollectionPayload = {
      title: form.title.trim(),
      method: form.method,
      url: form.url.trim(),
      body: form.body.trim(),
      description: form.description.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      responseExample: form.responseExample.trim(),
      favorite: false,
    };

    try {
      if (editingId) {
        const updated = await updateApiCollection(editingId, payload);
        setCollections((current) => current.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createApiCollection(payload);
        setCollections((current) => [created, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save collection');
    }
  };

  const startEdit = (collection: ApiCollection) => {
    setEditingId(collection.id);
    setForm({
      title: collection.title,
      method: collection.method,
      url: collection.url,
      body: collection.body,
      description: collection.description,
      tags: collection.tags.join(', '),
      responseExample: collection.responseExample,
    });
  };

  const handleDelete = async (collectionId: string) => {
    try {
      await deleteApiCollection(collectionId);
      setCollections((current) => current.filter((c) => c.id !== collectionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete collection');
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: '#10b981',
      POST: '#3b82f6',
      PUT: '#f59e0b',
      PATCH: '#8b5cf6',
      DELETE: '#ef4444',
      HEAD: '#6b7280',
      OPTIONS: '#6b7280',
    };
    return colors[method] || '#6b7280';
  };

  return (
    <main className="apicollection-page">
      <div className="apicollection-container">
        <header className="apicollection-header">
          <div>
            <p className="apicollection-kicker">DevBox Workspace</p>
            <h1 className="apicollection-title">API Collections</h1>
          </div>
        </header>

        <section className="apicollection-stats-grid">
          <div className="apicollection-stat-card">
            <p className="apicollection-stat-label">Total requests</p>
            <h2>{stats.total}</h2>
          </div>
          <div className="apicollection-stat-card">
            <p className="apicollection-stat-label">Favorites</p>
            <h2>{stats.favorites}</h2>
          </div>
          <div className="apicollection-stat-card">
            <p className="apicollection-stat-label">HTTP Methods</p>
            <h2>{stats.methods}</h2>
          </div>
        </section>

        <section className="apicollection-content-grid">
          <form onSubmit={handleSubmit} className="apicollection-form">
            <h2>{editingId ? 'Update request' : 'Create a request'}</h2>
            {error ? <p className="apicollection-error">{error}</p> : null}
            <label className="apicollection-form-label" htmlFor="api-title">Title</label>
            <input
              id="api-title"
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="apicollection-form-input"
            />
            <label className="apicollection-form-label" htmlFor="api-method">HTTP Method</label>
            <select
              id="api-method"
              value={form.method}
              onChange={(e) => setForm((current) => ({ ...current, method: e.target.value }))}
              className="apicollection-form-select"
            >
              {HTTP_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <label className="apicollection-form-label" htmlFor="api-url">URL</label>
            <input
              id="api-url"
              value={form.url}
              onChange={(e) => setForm((current) => ({ ...current, url: e.target.value }))}
              placeholder="https://api.example.com/endpoint"
              className="apicollection-form-input"
            />
            <label className="apicollection-form-label" htmlFor="api-body">Request Body</label>
            <textarea
              id="api-body"
              rows={6}
              value={form.body}
              onChange={(e) => setForm((current) => ({ ...current, body: e.target.value }))}
              className="apicollection-form-textarea"
            />
            <label className="apicollection-form-label" htmlFor="api-description">Description</label>
            <input
              id="api-description"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="apicollection-form-input"
            />
            <label className="apicollection-form-label" htmlFor="api-response">Response Example</label>
            <textarea
              id="api-response"
              rows={4}
              value={form.responseExample}
              onChange={(e) => setForm((current) => ({ ...current, responseExample: e.target.value }))}
              className="apicollection-form-textarea"
            />
            <label className="apicollection-form-label" htmlFor="api-tags">Tags</label>
            <input
              id="api-tags"
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              className="apicollection-form-input"
            />
            <button type="submit" className="apicollection-button apicollection-button-primary">
              {editingId ? 'Save changes' : 'Create request'}
            </button>
          </form>

          <section className="apicollection-list-panel">
            <div className="apicollection-list-header">
              <h2>API Collection</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="apicollection-filter-select"
              >
                <option value="">All methods</option>
                {HTTP_METHODS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="apicollection-card-list">
              {collections.map((collection) => (
                <article key={collection.id} className="apicollection-card">
                  <div className="apicollection-card-heading">
                    <h3 className="apicollection-card-title">{collection.title}</h3>
                    <span
                      className="apicollection-card-tag"
                      style={{ background: getMethodColor(collection.method) }}
                    >
                      {collection.method}
                    </span>
                  </div>
                  {collection.description && <p className="apicollection-card-description">{collection.description}</p>}
                  <p className="apicollection-card-url">{collection.url}</p>
                  {collection.body && (
                    <>
                      <p className="apicollection-code-label">Request:</p>
                      <pre className="apicollection-pre">
                        <code>{collection.body}</code>
                      </pre>
                    </>
                  )}
                  {collection.responseExample && (
                    <>
                      <p className="apicollection-code-label">Response:</p>
                      <pre className="apicollection-pre">
                        <code>{collection.responseExample}</code>
                      </pre>
                    </>
                  )}
                  <div className="apicollection-tags">
                    {collection.tags.map((tag) => (
                      <span key={tag} className="apicollection-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="apicollection-actions">
                    <button type="button" onClick={() => startEdit(collection)} className="apicollection-button apicollection-button-secondary">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(collection.id)} className="apicollection-button apicollection-button-danger">
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

export default ApiCollectionsPage;
