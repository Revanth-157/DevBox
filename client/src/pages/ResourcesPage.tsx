import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createResource, deleteResource, listResources, updateResource } from '../lib/api';
import type { Resource, ResourcePayload } from '../types';

const CATEGORIES = ['Documentation', 'Tool', 'Library', 'Framework', 'Database', 'Deployment', 'Learning', 'Community'];
const emptyForm = { title: '', url: '', category: 'Documentation', description: '', tags: '' };

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadResources = async (category?: string) => {
    try {
      const nextResources = await listResources(category);
      setResources(nextResources);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load resources');
    }
  };

  useEffect(() => {
    void loadResources(filter || undefined);
  }, [filter]);

  const stats = useMemo(
    () => ({
      total: resources.length,
      favorites: resources.filter((r) => r.favorite).length,
      categories: new Set(resources.map((r) => r.category)).size,
    }),
    [resources],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      setError('Title and URL are required');
      return;
    }

    const payload: ResourcePayload = {
      title: form.title.trim(),
      url: form.url.trim(),
      category: form.category,
      description: form.description.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      favorite: false,
    };

    try {
      if (editingId) {
        const updated = await updateResource(editingId, payload);
        setResources((current) => current.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await createResource(payload);
        setResources((current) => [created, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save resource');
    }
  };

  const startEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      url: resource.url,
      category: resource.category,
      description: resource.description,
      tags: resource.tags.join(', '),
    });
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      setResources((current) => current.filter((r) => r.id !== resourceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete resource');
    }
  };

  return (
    <main className="resource-page">
      <div className="resource-container">
        <header className="resource-header">
          <div>
            <p className="resource-kicker">DevBox Workspace</p>
            <h1 className="resource-title">Developer Resources</h1>
          </div>
        </header>

        <section className="resource-stats-grid">
          <article className="resource-stat-card">
            <p className="resource-stat-label">Total resources</p>
            <h2>{stats.total}</h2>
          </article>
          <article className="resource-stat-card">
            <p className="resource-stat-label">Favorites</p>
            <h2>{stats.favorites}</h2>
          </article>
          <article className="resource-stat-card">
            <p className="resource-stat-label">Categories</p>
            <h2>{stats.categories}</h2>
          </article>
        </section>

        <section className="resource-content-grid">
          <form onSubmit={handleSubmit} className="resource-form">
            <h2>{editingId ? 'Update resource' : 'Create a resource'}</h2>
            {error ? <p className="resource-error">{error}</p> : null}
            <label className="resource-form-label" htmlFor="resource-title">Title</label>
            <input
              id="resource-title"
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="resource-form-input"
            />
            <label className="resource-form-label" htmlFor="resource-url">URL</label>
            <input
              id="resource-url"
              value={form.url}
              onChange={(e) => setForm((current) => ({ ...current, url: e.target.value }))}
              placeholder="https://example.com"
              className="resource-form-input"
            />
            <label className="resource-form-label" htmlFor="resource-category">Category</label>
            <select
              id="resource-category"
              value={form.category}
              onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
              className="resource-form-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <label className="resource-form-label" htmlFor="resource-description">Description</label>
            <textarea
              id="resource-description"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              rows={6}
              className="resource-form-textarea"
            />
            <label className="resource-form-label" htmlFor="resource-tags">Tags</label>
            <input
              id="resource-tags"
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              className="resource-form-input"
            />
            <button type="submit" className="resource-button resource-button-primary">
              {editingId ? 'Save changes' : 'Create resource'}
            </button>
          </form>

          <section className="resource-list-panel">
            <div className="resource-list-header">
              <h2>Resource library</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="resource-filter-select"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="resource-card-list">
              {resources.map((resource) => (
                <article key={resource.id} className="resource-card">
                  <div className="resource-card-heading">
                    <h3 className="resource-card-title">{resource.title}</h3>
                    <span className="resource-card-category">{resource.category}</span>
                  </div>
                  {resource.description && <p className="resource-card-description">{resource.description}</p>}
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-card-link">
                    {resource.url}
                  </a>
                  <div className="resource-tags">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="resource-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="resource-actions">
                    <button type="button" onClick={() => startEdit(resource)} className="resource-button resource-button-secondary">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(resource.id)} className="resource-button resource-button-danger">
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

export default ResourcesPage;
