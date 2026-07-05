import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';
import { createSnippet, deleteSnippet, listSnippets, updateSnippet } from '../lib/api';
import type { Snippet, SnippetPayload } from '../types';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'SQL', 'HTML', 'CSS'];
const emptyForm = { title: '', code: '', language: 'JavaScript', description: '', tags: '' };

const languageToPrism = (language: string) => {
  switch (language.toLowerCase()) {
    case 'javascript':
      return 'javascript';
    case 'typescript':
      return 'typescript';
    case 'python':
      return 'python';
    case 'java':
      return 'java';
    case 'go':
      return 'go';
    case 'rust':
      return 'rust';
    case 'c++':
      return 'cpp';
    case 'sql':
      return 'sql';
    case 'html':
      return 'markup';
    case 'css':
      return 'css';
    default:
      return 'javascript';
  }
};

const SnippetsPage = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSnippets = async (language?: string) => {
    try {
      const nextSnippets = await listSnippets(language);
      setSnippets(nextSnippets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load snippets');
    }
  };

  useEffect(() => {
    void loadSnippets(languageFilter || undefined);
  }, [languageFilter]);

  const stats = useMemo(
    () => ({
      total: snippets.length,
      favorites: snippets.filter((s) => s.favorite).length,
      languages: new Set(snippets.map((s) => s.language)).size,
    }),
    [snippets],
  );

  const filteredSnippets = useMemo(
    () =>
      snippets.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(search.toLowerCase()) ||
          snippet.language.toLowerCase().includes(search.toLowerCase()) ||
          snippet.description.toLowerCase().includes(search.toLowerCase()) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
          snippet.code.toLowerCase().includes(search.toLowerCase()),
      ),
    [snippets, search],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.code.trim()) {
      setError('Title and code are required');
      return;
    }

    const payload: SnippetPayload = {
      title: form.title.trim(),
      code: form.code.trim(),
      language: form.language,
      description: form.description.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      favorite: false,
    };

    try {
      if (editingId) {
        const updated = await updateSnippet(editingId, payload);
        setSnippets((current) => current.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await createSnippet(payload);
        setSnippets((current) => [created, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save snippet');
    }
  };

  const startEdit = (snippet: Snippet) => {
    setEditingId(snippet.id);
    setForm({
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      description: snippet.description,
      tags: snippet.tags.join(', '),
    });
  };

  const handleDelete = async (snippetId: string) => {
    try {
      await deleteSnippet(snippetId);
      setSnippets((current) => current.filter((s) => s.id !== snippetId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete snippet');
    }
  };

  const toggleFavorite = async (snippet: Snippet) => {
    try {
      const updated = await updateSnippet(snippet.id, { ...snippet, favorite: !snippet.favorite });
      setSnippets((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update favorite');
    }
  };

  const copySnippet = async (snippet: Snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedId(snippet.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      setError('Unable to copy snippet');
    }
  };

  return (
    <main className="snippet-page">
      <div className="snippet-container">
        <header className="snippet-header">
          <div>
            <p className="snippet-kicker">DevBox Snippets</p>
            <h1 className="snippet-title">Code Snippets Library</h1>
          </div>
        </header>

        <section className="snippet-stats-grid">
          <article className="snippet-stat-card">
            <p className="snippet-stat-label">Total snippets</p>
            <h2>{stats.total}</h2>
          </article>
          <article className="snippet-stat-card">
            <p className="snippet-stat-label">Favorites</p>
            <h2>{stats.favorites}</h2>
          </article>
          <article className="snippet-stat-card">
            <p className="snippet-stat-label">Languages</p>
            <h2>{stats.languages}</h2>
          </article>
        </section>

        <section className="snippet-content-grid">
          <form onSubmit={handleSubmit} className="snippet-form">
            <h2>{editingId ? 'Update snippet' : 'Create a snippet'}</h2>
            {error ? <p className="snippet-error">{error}</p> : null}
            <label className="snippet-form-label" htmlFor="snippet-title">Title</label>
            <input
              id="snippet-title"
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="snippet-form-input"
            />
            <label className="snippet-form-label" htmlFor="snippet-language">Language</label>
            <select
              id="snippet-language"
              value={form.language}
              onChange={(e) => setForm((current) => ({ ...current, language: e.target.value }))}
              className="snippet-form-select"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <label className="snippet-form-label" htmlFor="snippet-code">Code</label>
            <textarea
              id="snippet-code"
              value={form.code}
              onChange={(e) => setForm((current) => ({ ...current, code: e.target.value }))}
              rows={12}
              className="snippet-form-textarea"
            />
            <label className="snippet-form-label" htmlFor="snippet-description">Description</label>
            <input
              id="snippet-description"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="snippet-form-input"
            />
            <label className="snippet-form-label" htmlFor="snippet-tags">Tags</label>
            <input
              id="snippet-tags"
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              className="snippet-form-input"
            />
            <button type="submit" className="snippet-button snippet-button-primary">
              {editingId ? 'Save changes' : 'Create snippet'}
            </button>
          </form>

          <section className="snippet-list-panel">
            <div className="snippet-list-header">
              <div>
                <h2>Code collection</h2>
                <p className="snippet-subtitle">Search across titles, languages, descriptions, tags, and code.</p>
              </div>
            </div>
            <div className="snippet-filters">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search snippets"
                className="snippet-search-input"
              />
              <select
                value={languageFilter}
                onChange={(event) => setLanguageFilter(event.target.value)}
                className="snippet-filter-select"
              >
                <option value="">All languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="snippet-card-list">
              {filteredSnippets.map((snippet) => {
                const prismLang = languageToPrism(snippet.language);
                const highlighted = Prism.highlight(snippet.code, Prism.languages[prismLang] || Prism.languages.javascript, prismLang);
                return (
                  <article key={snippet.id} className="snippet-card">
                    <div className="snippet-card-heading">
                      <div>
                        <h3 className="snippet-card-title">{snippet.title}</h3>
                        <p className="snippet-card-lang">{snippet.language}</p>
                      </div>
                      <button
                        onClick={() => void toggleFavorite(snippet)}
                        className={`snippet-favorite-button${snippet.favorite ? ' active' : ''}`}
                        aria-label={snippet.favorite ? 'Unfavorite' : 'Favorite'}
                      >
                        {snippet.favorite ? '★' : '☆'}
                      </button>
                    </div>
                    {snippet.description && <p className="snippet-card-description">{snippet.description}</p>}
                    <div className="snippet-code-block">
                      <button
                        onClick={() => void copySnippet(snippet)}
                        className="snippet-copy-button"
                      >
                        {copiedId === snippet.id ? 'Copied' : 'Copy'}
                      </button>
                      <pre className="snippet-pre">
                        <code className={`language-${prismLang}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
                      </pre>
                    </div>
                    <div className="snippet-tags">
                      {snippet.tags.map((tag) => (
                        <span key={tag} className="snippet-tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="snippet-card-actions">
                      <button type="button" onClick={() => startEdit(snippet)} className="snippet-button snippet-button-secondary">
                        Edit
                      </button>
                      <button type="button" onClick={() => void handleDelete(snippet.id)} className="snippet-button snippet-button-danger">
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
              {filteredSnippets.length === 0 ? <p className="snippet-empty">No snippets match your filters.</p> : null}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default SnippetsPage;
