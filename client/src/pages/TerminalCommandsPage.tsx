import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createTerminalCommand, deleteTerminalCommand, listTerminalCommands, updateTerminalCommand } from '../lib/api';
import type { TerminalCommand, TerminalCommandPayload } from '../types';

const OPERATING_SYSTEMS = ['Windows', 'macOS', 'Linux', 'WSL', 'Docker'];
const emptyForm = { title: '', command: '', os: 'Windows', description: '', tags: '' };

const TerminalCommandsPage = () => {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadCommands = async (os?: string) => {
    try {
      const nextCommands = await listTerminalCommands(os);
      setCommands(nextCommands);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load commands');
    }
  };

  useEffect(() => {
    void loadCommands(filter || undefined);
  }, [filter]);

  const stats = useMemo(
    () => ({
      total: commands.length,
      favorites: commands.filter((command) => command.favorite).length,
      operatingSystems: new Set(commands.map((command) => command.os)).size,
    }),
    [commands],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.command.trim()) {
      setError('Title and command are required');
      return;
    }

    const payload: TerminalCommandPayload = {
      title: form.title.trim(),
      command: form.command.trim(),
      os: form.os,
      description: form.description.trim(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      favorite: false,
    };

    try {
      if (editingId) {
        const updated = await updateTerminalCommand(editingId, payload);
        setCommands((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createTerminalCommand(payload);
        setCommands((current) => [created, ...current]);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save command');
    }
  };

  const startEdit = (command: TerminalCommand) => {
    setEditingId(command.id);
    setForm({
      title: command.title,
      command: command.command,
      os: command.os,
      description: command.description,
      tags: command.tags.join(', '),
    });
  };

  const handleDelete = async (commandId: string) => {
    try {
      await deleteTerminalCommand(commandId);
      setCommands((current) => current.filter((item) => item.id !== commandId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete command');
    }
  };

  return (
    <main className="terminal-page">
      <div className="terminal-container">
        <header className="terminal-header">
          <div>
            <p className="terminal-kicker">DevBox Workspace</p>
            <h1 className="terminal-title">Terminal Commands</h1>
          </div>
        </header>

        <section className="terminal-stats-grid">
          <article className="terminal-stat-card">
            <p className="terminal-stat-label">Total commands</p>
            <h2>{stats.total}</h2>
          </article>
          <article className="terminal-stat-card">
            <p className="terminal-stat-label">Favorites</p>
            <h2>{stats.favorites}</h2>
          </article>
          <article className="terminal-stat-card">
            <p className="terminal-stat-label">Platforms</p>
            <h2>{stats.operatingSystems}</h2>
          </article>
        </section>

        <section className="terminal-content-grid">
          <form onSubmit={handleSubmit} className="terminal-form">
            <h2>{editingId ? 'Update command' : 'Save a command'}</h2>
            {error ? <p className="terminal-error">{error}</p> : null}
            <label className="terminal-form-label" htmlFor="terminal-title">Title</label>
            <input
              id="terminal-title"
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="terminal-form-input"
            />
            <label className="terminal-form-label" htmlFor="terminal-os">OS</label>
            <select
              id="terminal-os"
              value={form.os}
              onChange={(e) => setForm((current) => ({ ...current, os: e.target.value }))}
              className="terminal-form-select"
            >
              {OPERATING_SYSTEMS.map((os) => (
                <option key={os} value={os}>{os}</option>
              ))}
            </select>
            <label className="terminal-form-label" htmlFor="terminal-command">Command</label>
            <textarea
              id="terminal-command"
              rows={6}
              value={form.command}
              onChange={(e) => setForm((current) => ({ ...current, command: e.target.value }))}
              className="terminal-form-textarea"
            />
            <label className="terminal-form-label" htmlFor="terminal-description">Description</label>
            <input
              id="terminal-description"
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              className="terminal-form-input"
            />
            <label className="terminal-form-label" htmlFor="terminal-tags">Tags</label>
            <input
              id="terminal-tags"
              value={form.tags}
              onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
              className="terminal-form-input"
            />
            <button type="submit" className="terminal-button terminal-button-primary">
              {editingId ? 'Save changes' : 'Add command'}
            </button>
          </form>

          <section className="terminal-list-panel">
            <div className="terminal-list-header">
              <h2>Saved commands</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="terminal-filter-select"
              >
                <option value="">All OS</option>
                {OPERATING_SYSTEMS.map((os) => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
            </div>
            <div className="terminal-card-list">
              {commands.map((command) => (
                <article key={command.id} className="terminal-card">
                  <div className="terminal-card-heading">
                    <h3 className="terminal-card-title">{command.title}</h3>
                    <span className="terminal-card-os">{command.os}</span>
                  </div>
                  {command.description ? <p className="terminal-card-description">{command.description}</p> : null}
                  <pre className="terminal-pre">
                    <code>{command.command}</code>
                  </pre>
                  <div className="terminal-tags">
                    {command.tags.map((tag) => (
                      <span key={tag} className="terminal-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="terminal-actions">
                    <button type="button" onClick={() => startEdit(command)} className="terminal-button terminal-button-secondary">
                      Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(command.id)} className="terminal-button terminal-button-danger">
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

export default TerminalCommandsPage;
