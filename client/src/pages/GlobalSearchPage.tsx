import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchAll } from '../lib/api';
import type { GlobalSearchResults } from '../types';

const GlobalSearchPage = () => {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<GlobalSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (q.trim() === '') {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const res = await searchAll(q.trim());
        setResults(res);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    const id = setTimeout(run, 250);
    return () => clearTimeout(id);
  }, [q]);

  const logout = () => {
    localStorage.removeItem('devbox_token');
    localStorage.removeItem('devbox_user');
    navigate('/login');
  };

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>DevBox Workspace</p>
            <h1 style={{ margin: '4px 0 0', fontSize: '2rem' }}>Global Search</h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/dashboard" style={{ color: '#f8fafc', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/notes" style={{ color: '#f8fafc', textDecoration: 'none' }}>Notes</Link>
            <Link to="/snippets" style={{ color: '#f8fafc', textDecoration: 'none' }}>Snippets</Link>
            <Link to="/sqlqueries" style={{ color: '#f8fafc', textDecoration: 'none' }}>SQL</Link>
            <Link to="/apicollections" style={{ color: '#f8fafc', textDecoration: 'none' }}>API</Link>
            <Link to="/resources" style={{ color: '#f8fafc', textDecoration: 'none' }}>Resources</Link>
            <Link to="/terminalcommands" style={{ color: '#f8fafc', textDecoration: 'none' }}>Terminal</Link>
            <Link to="/favorites" style={{ color: '#f8fafc', textDecoration: 'none' }}>Favorites</Link>
            <Link to="/profile" style={{ color: '#f8fafc', textDecoration: 'none' }}>Profile</Link>
            <button onClick={logout} style={{ border: '1px solid #334155', background: 'transparent', color: 'white', padding: '10px 14px', borderRadius: 999, cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </header>

        <div style={{ marginBottom: 20 }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search everything..." style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
        </div>

        {loading ? <p>Searching...</p> : null}
        {error ? <p style={{ color: '#fca5a5' }}>{error}</p> : null}

        {results ? (
          <div style={{ display: 'grid', gap: 20 }}>
            <section>
              <h2>Notes ({results.notes.length})</h2>
              {results.notes.map((n) => (
                <article key={n.id} style={{ background: '#0b1220', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <Link to={`/notes`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>{n.title}</Link>
                  <p style={{ margin: 4, color: '#9aa4b2' }}>{n.content.slice(0, 160)}</p>
                </article>
              ))}
            </section>

            <section>
              <h2>Snippets ({results.snippets.length})</h2>
              {results.snippets.map((s) => (
                <article key={s.id} style={{ background: '#0b1220', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <Link to="/snippets" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>{s.title}</Link>
                  <p style={{ margin: 4, color: '#9aa4b2' }}>{s.description}</p>
                </article>
              ))}
            </section>

            <section>
              <h2>SQL Queries ({results.sqlQueries.length})</h2>
              {results.sqlQueries.map((qItem) => (
                <article key={qItem.id} style={{ background: '#0b1220', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <Link to="/sqlqueries" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>{qItem.title}</Link>
                  <p style={{ margin: 4, color: '#9aa4b2' }}>{qItem.query.slice(0, 160)}</p>
                </article>
              ))}
            </section>

            <section>
              <h2>API Collections ({results.apiCollections.length})</h2>
              {results.apiCollections.map((c) => (
                <article key={c.id} style={{ background: '#0b1220', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <Link to="/apicollections" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>{c.title}</Link>
                  <p style={{ margin: 4, color: '#9aa4b2' }}>{c.url}</p>
                </article>
              ))}
            </section>

            <section>
              <h2>Resources ({results.resources.length})</h2>
              {results.resources.map((r) => (
                <article key={r.id} style={{ background: '#0b1220', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>{r.title}</a>
                  <p style={{ margin: 4, color: '#9aa4b2' }}>{r.description}</p>
                </article>
              ))}
            </section>

            <section>
              <h2>Terminal Commands ({results.terminalCommands.length})</h2>
              {results.terminalCommands.map((t) => (
                <article key={t.id} style={{ background: '#0b1220', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                  <Link to="/terminalcommands" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>{t.title}</Link>
                  <pre style={{ margin: 4, color: '#9aa4b2', fontFamily: 'monospace' }}>{t.command}</pre>
                </article>
              ))}
            </section>
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>Type to search across Notes, Snippets, SQL, API, Resources, and Terminal commands.</p>
        )}
      </div>
    </main>
  );
};

export default GlobalSearchPage;
