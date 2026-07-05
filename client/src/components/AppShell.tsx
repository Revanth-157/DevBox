import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAuthStorage, getUserFromStorage } from '../lib/api';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/notes', label: 'Notes' },
  { to: '/snippets', label: 'Snippets' },
  { to: '/sqlqueries', label: 'SQL Queries' },
  { to: '/apicollections', label: 'API Vault' },
  { to: '/resources', label: 'Resources' },
  { to: '/terminalcommands', label: 'Terminal Commands' },
  { to: '/search', label: 'Global Search' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/profile', label: 'Profile' },
];

const AppShell = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUserFromStorage();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthStorage();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">DevBox</div>
          <p>Developer workspace</p>
        </div>

        <div className="sidebar-profile">
          <p className="sidebar-profile-name">{user?.name ?? 'Developer'}</p>
          <p className="sidebar-profile-email">{user?.email ?? 'you@example.com'}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="page-panel">
        <header className="topbar">
          <button type="button" className="mobile-toggle" onClick={() => setMenuOpen((value) => !value)}>
            Menu
          </button>
          <div className="topbar-title">Workspace</div>
          <div className="topbar-user">{user?.name ?? 'Developer'}</div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
