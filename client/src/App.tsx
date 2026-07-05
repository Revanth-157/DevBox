import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SnippetsPage from './pages/SnippetsPage';
import SqlQueriesPage from './pages/SqlQueriesPage';
import ApiCollectionsPage from './pages/ApiCollectionsPage';
import ResourcesPage from './pages/ResourcesPage';
import TerminalCommandsPage from './pages/TerminalCommandsPage';
import GlobalSearchPage from './pages/GlobalSearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import NotesPage from './pages/NotesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/search" element={<GlobalSearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/snippets" element={<SnippetsPage />} />
          <Route path="/sqlqueries" element={<SqlQueriesPage />} />
          <Route path="/apicollections" element={<ApiCollectionsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/terminalcommands" element={<TerminalCommandsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
