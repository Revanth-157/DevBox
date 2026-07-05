import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listFavorites } from '../lib/api';
import type { FavoritesResults } from '../types';

const FavoritesPage = () => {
  const [results, setResults] = useState<FavoritesResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await listFavorites();
        setResults(res);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load favorites');
      }
    };
    void load();
  }, []);

  return (
    <main className="favorites-page">
      <div className="favorites-container">
        <header className="favorites-header">
          <div>
            <p className="favorites-kicker">DevBox Workspace</p>
            <h1 className="favorites-title">Favorites</h1>
          </div>
        </header>

        {error ? <p className="favorites-error">{error}</p> : null}

        {results ? (
          <div className="favorites-grid">
            <section className="favorites-section">
              <div className="favorites-section-heading">
                <h2>Notes ({results.notes.length})</h2>
              </div>
              <div className="favorites-card-list">
                {results.notes.map((n) => (
                  <article key={n.id} className="favorites-card">
                    <Link to="/notes" className="favorites-card-link">{n.title}</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="favorites-section">
              <div className="favorites-section-heading">
                <h2>Snippets ({results.snippets.length})</h2>
              </div>
              <div className="favorites-card-list">
                {results.snippets.map((s) => (
                  <article key={s.id} className="favorites-card">
                    <Link to="/snippets" className="favorites-card-link">{s.title}</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="favorites-section">
              <div className="favorites-section-heading">
                <h2>SQL Queries ({results.sqlQueries.length})</h2>
              </div>
              <div className="favorites-card-list">
                {results.sqlQueries.map((q) => (
                  <article key={q.id} className="favorites-card">
                    <Link to="/sqlqueries" className="favorites-card-link">{q.title}</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="favorites-section">
              <div className="favorites-section-heading">
                <h2>API Collections ({results.apiCollections.length})</h2>
              </div>
              <div className="favorites-card-list">
                {results.apiCollections.map((c) => (
                  <article key={c.id} className="favorites-card">
                    <Link to="/apicollections" className="favorites-card-link">{c.title}</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="favorites-section">
              <div className="favorites-section-heading">
                <h2>Resources ({results.resources.length})</h2>
              </div>
              <div className="favorites-card-list">
                {results.resources.map((r) => (
                  <article key={r.id} className="favorites-card">
                    <a href={r.url} target="_blank" rel="noreferrer" className="favorites-card-link">
                      {r.title}
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section className="favorites-section">
              <div className="favorites-section-heading">
                <h2>Terminal Commands ({results.terminalCommands.length})</h2>
              </div>
              <div className="favorites-card-list">
                {results.terminalCommands.map((t) => (
                  <article key={t.id} className="favorites-card">
                    <Link to="/terminalcommands" className="favorites-card-link">{t.title}</Link>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <p className="favorites-empty">No favorites yet — mark items with ★ to add them here.</p>
        )}
      </div>
    </main>
  );
};

export default FavoritesPage;
