import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#07111f', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <section style={{ textAlign: 'center', maxWidth: 760, padding: 32 }}>
        <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6ee7ff', marginBottom: 16 }}>DevBox Phase 2</p>
        <h1 style={{ fontSize: '3rem', margin: '0 0 16px' }}>Your developer workspace now includes notes and dashboard workflows.</h1>
        <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#cbd5e1' }}>
          Create an account, sign in, and start capturing technical notes in your private workspace.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <Link to="/register" style={{ background: '#0ea5e9', color: 'white', padding: '12px 16px', borderRadius: 999, textDecoration: 'none' }}>Create account</Link>
          <Link to="/login" style={{ background: '#111827', color: 'white', padding: '12px 16px', borderRadius: 999, textDecoration: 'none', border: '1px solid #334155' }}>Sign in</Link>
          <Link to="/dashboard" style={{ background: '#8b5cf6', color: 'white', padding: '12px 16px', borderRadius: 999, textDecoration: 'none' }}>Open workspace</Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
