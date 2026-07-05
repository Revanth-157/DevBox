import { useEffect, useMemo, useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { createNote, deleteNote, listNotes, updateNote } from '../lib/api';
import type { Note, NotePayload } from '../types';

const emptyForm = { title: '', content: '', tags: '' };

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    try {
      const nextNotes = await listNotes();
      setNotes(nextNotes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load notes');
    }
  };

  useEffect(() => {
    void loadNotes();
  }, []);

  const stats = useMemo(
    () => ({
      total: notes.length,
      favorites: notes.filter((note) => note.favorite).length,
      tags: new Set(notes.flatMap((note) => note.tags)).size,
    }),
    [notes],
  );

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(filter.toLowerCase()) ||
          note.content.toLowerCase().includes(filter.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase())),
      ),
    [notes, filter],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }

    const payload: NotePayload = {
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      favorite: false,
    };

    try {
      if (editingId) {
        const updated = await updateNote(editingId, payload);
        setNotes((current) => current.map((note) => (note.id === updated.id ? updated : note)));
      } else {
        const created = await createNote(payload);
        setNotes((current) => [created, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save note');
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, tags: note.tags.join(', ') });
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete note');
    }
  };

  const toggleFavorite = async (note: Note) => {
    try {
      const updated = await updateNote(note.id, { ...note, favorite: !note.favorite });
      setNotes((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update favorite');
    }
  };

  const formatTagList = (tags: string[]) => tags.map((tag) => `#${tag}`).join(' ');

  return (
    <main className="note-page">
      <div className="note-container">
        <header className="note-header">
          <div>
            <p className="note-kicker">DevBox Notes</p>
            <h1 className="note-title">Organize your knowledge</h1>
          </div>
        </header>

        <section className="note-stats-grid">
          <article className="note-stat-card">
            <p className="note-stat-label">Total notes</p>
            <h2>{stats.total}</h2>
          </article>
          <article className="note-stat-card">
            <p className="note-stat-label">Favorites</p>
            <h2>{stats.favorites}</h2>
          </article>
          <article className="note-stat-card">
            <p className="note-stat-label">Tags</p>
            <h2>{stats.tags}</h2>
          </article>
        </section>

        <section className="note-content-grid">
          <form onSubmit={handleSubmit} className="note-form">
            <div className="note-form-header">
              <h2>{editingId ? 'Update note' : 'Create a note'}</h2>
              <button
                type="button"
                className="note-preview-toggle"
                onClick={() => setShowPreview((value) => !value)}
              >
                {showPreview ? 'Hide preview' : 'Show preview'}
              </button>
            </div>
            {error ? <p className="note-error">{error}</p> : null}
            <label className="note-form-label" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="note-form-input"
            />
            <label className="note-form-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              value={form.content}
              onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))}
              rows={10}
              className="note-form-textarea"
            />
            <label className="note-form-label" htmlFor="note-tags">Tags</label>
            <input
              id="note-tags"
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              className="note-form-input"
            />
            <button type="submit" className="note-button note-button-primary">
              {editingId ? 'Save changes' : 'Create note'}
            </button>

            {showPreview ? (
              <div className="note-preview-panel">
                <p className="note-preview-label">Markdown preview</p>
                <div className="markdown-preview">
                  {form.content.trim() ? (
                    <ReactMarkdown>{form.content}</ReactMarkdown>
                  ) : (
                    <p className="note-preview-empty">Type note content to preview markdown.</p>
                  )}
                </div>
              </div>
            ) : null}
          </form>

          <section className="note-list-panel">
            <div className="note-list-header">
              <h2>My notes</h2>
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Search notes"
                className="note-search-input"
              />
            </div>
            <div className="note-card-list">
              {filteredNotes.map((note) => (
                <article key={note.id} className="note-card">
                  <div className="note-card-heading">
                    <div>
                      <h3 className="note-card-title">{note.title}</h3>
                      <p className="note-card-tags">{formatTagList(note.tags)}</p>
                    </div>
                    <button
                      onClick={() => void toggleFavorite(note)}
                      className={`note-favorite-button${note.favorite ? ' active' : ''}`}
                      aria-label={note.favorite ? 'Unfavorite' : 'Favorite'}
                    >
                      {note.favorite ? '★' : '☆'}
                    </button>
                  </div>
                  <p className="note-card-content">{note.content}</p>
                  <div className="note-card-actions">
                    <button type="button" onClick={() => startEdit(note)} className="note-button note-button-secondary">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(note.id)} className="note-button note-button-danger">
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {filteredNotes.length === 0 ? <p className="note-empty">No notes match your search.</p> : null}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default NotesPage;
