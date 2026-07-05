import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import { loginUser, persistAuthResponse } from '../lib/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required');
      return;
    }

    try {
      const result = await loginUser(form);
      persistAuthResponse(result);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    }
  };

  return (
    <AuthPage title="Sign in" description="Access your developer workspace.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? <div className="auth-error">{error}</div> : null}

        <label className="auth-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
          className="auth-input"
        />

        <label className="auth-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
          className="auth-input"
        />

        <button type="submit" className="auth-button">
          Continue
        </button>
      </form>

      <p className="auth-footer">
        No account yet?{' '}
        <Link to="/register" className="auth-link">
          Create one
        </Link>
      </p>
    </AuthPage>
  );
};

export default LoginPage;
