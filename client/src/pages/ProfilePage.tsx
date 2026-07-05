import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword, getProfile, updateProfile } from '../lib/api';
import type { User } from '../types';

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', avatarUrl: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const nextProfile = await getProfile();
        setProfile(nextProfile);
        setForm({ name: nextProfile.name, email: nextProfile.email, avatarUrl: nextProfile.avatarUrl ?? '' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load profile');
      }
    };

    void load();
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((current) => ({ ...current, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedProfile = await updateProfile({
        name: form.name,
        email: form.email,
        avatarUrl: form.avatarUrl,
      });
      setProfile(updatedProfile);
      localStorage.setItem('devbox_user', JSON.stringify(updatedProfile));
      setMessage('Profile updated');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update profile');
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords must match');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password updated');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to change password');
    }
  };

  const logout = () => {
    localStorage.removeItem('devbox_token');
    localStorage.removeItem('devbox_user');
    navigate('/login');
  };

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: 24 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ margin: 0, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>DevBox Workspace</p>
            <h1 style={{ margin: '4px 0 0', fontSize: '2rem' }}>Profile</h1>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ color: '#f8fafc', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/favorites" style={{ color: '#f8fafc', textDecoration: 'none' }}>Favorites</Link>
            <Link to="/search" style={{ color: '#f8fafc', textDecoration: 'none' }}>Search</Link>
            <button onClick={logout} style={{ border: '1px solid #334155', background: 'transparent', color: 'white', padding: '10px 14px', borderRadius: 999, cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </header>

        {message ? <p style={{ color: '#86efac' }}>{message}</p> : null}
        {error ? <p style={{ color: '#fda4af' }}>{error}</p> : null}

        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <section style={{ background: '#111827', borderRadius: 16, padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Profile details</h2>
            <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Avatar preview" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }} />
                ) : (
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                )}
              </div>
              <label>
                <span style={{ display: 'block', marginBottom: 4 }}>Name</span>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: 4 }}>Email</span>
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: 4 }}>Avatar upload</span>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%', color: 'white' }} />
              </label>
              <button type="submit" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#38bdf8', color: '#082f49', fontWeight: 700, cursor: 'pointer' }}>
                Save profile
              </button>
            </form>
          </section>

          <section style={{ background: '#111827', borderRadius: 16, padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Change password</h2>
            <form onSubmit={handlePasswordChange} style={{ display: 'grid', gap: 12 }}>
              <label>
                <span style={{ display: 'block', marginBottom: 4 }}>Current password</span>
                <input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: 4 }}>New password</span>
                <input type="password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: 4 }}>Confirm new password</span>
                <input type="password" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: 'white' }} />
              </label>
              <button type="submit" style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: '#f59e0b', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                Update password
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
