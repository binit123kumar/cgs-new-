import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import SettingsPage from './pages/SettingsPage';
import './admin.css';

// Mounted at /admin/* by the main site's <App />. All CSS below is scoped
// under .cgs-admin-scope (see admin.css) so it can never leak into / clash
// with the public website's own styles.
export default function AdminApp() {
  return (
    <div className="cgs-admin-scope">
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path=":moduleKey" element={<ModulePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}
