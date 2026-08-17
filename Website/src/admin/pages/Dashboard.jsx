import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { moduleList } from '../config/modules';

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await client.get('/dashboard/counts');
        setCounts(res.data.data || {});
      } catch (err) {
        setErrorMsg(err?.response?.data?.message || 'Could not load dashboard counts. Is the backend running?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Backend DashboardCountsDto uses PascalCase-ish camelCase keys like
  // "about", "faculty", "staff", "gallery", "news", "events", "notice",
  // "slider", "courses", "downloads", "publications"
  function countFor(key) {
    return counts[key] ?? 0;
  }

  return (
    <>
      <div className="page-title-row">
        <h1>Dashboard</h1>
      </div>

      {errorMsg && (
        <div className="login-error" style={{ marginBottom: 18 }}>{errorMsg}</div>
      )}

      <div className="dash-grid">
        {moduleList.map((m) => (
          <div className="dash-card" key={m.key}>
            <div className="dash-card-top">
              <div className="dash-icon" style={{ background: m.color }}>
                <i className={`bi ${m.icon}`} />
              </div>
              <div className="dash-count">{loading ? '—' : countFor(m.key)}</div>
            </div>
            <h3>{m.label}</h3>
            <div className="dash-status">
              <span className="status-pill active">
                <i className="bi bi-check-circle-fill" /> Active
              </span>
              <Link to={`/admin/${m.key}`} className="dash-add-btn" title={`Manage ${m.label}`}>
                <i className="bi bi-plus-lg" />
              </Link>
            </div>
          </div>
        ))}

        <div className="dash-card">
          <div className="dash-card-top">
            <div className="dash-icon" style={{ background: '#6b7280' }}>
              <i className="bi bi-gear" />
            </div>
          </div>
          <h3>Settings</h3>
          <div className="dash-status">
            <span className="status-pill active">
              <i className="bi bi-check-circle-fill" /> Active
            </span>
            <Link to="/admin/settings" className="dash-add-btn" title="Site Settings">
              <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
