import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const actionStyle = {
  create: 'activity-create',
  update: 'activity-update',
  delete: 'activity-delete',
  login: 'activity-login',
  logout: 'activity-logout',
};

function normaliseAction(value) {
  return String(value || 'activity').toLowerCase();
}

function logDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ActivityLog() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('all');

  useEffect(() => {
    let active = true;
    client.get('/activity-log')
      .then((response) => {
        if (!active) return;
        const data = response.data?.data;
        setRecords(Array.isArray(data) ? data : data?.items || data?.records || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.response?.data?.message || 'Could not load the activity log.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const actions = useMemo(() => [...new Set(records.map((record) => normaliseAction(record.action)))], [records]);
  const visibleRecords = useMemo(() => records.filter((record) => {
    const matchesAction = action === 'all' || normaliseAction(record.action) === action;
    const matchesSearch = !search.trim() || JSON.stringify(record).toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  }), [action, records, search]);

  return (
    <>
      <div className="breadcrumb-row"><Link to="/admin">Dashboard</Link> / Activity Log</div>
      <div className="page-title-row">
        <div><h1>Activity Log</h1><p className="activity-subtitle">A server-recorded history of administrator actions.</p></div>
      </div>
      <div className="card-panel">
        <div className="table-toolbar activity-toolbar">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search user, module or record..." aria-label="Search activity log" />
          <select value={action} onChange={(event) => setAction(event.target.value)} aria-label="Filter activity by action">
            <option value="all">All actions</option>
            {actions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        {loading ? <div className="empty-state"><i className="bi bi-hourglass-split" />Loading activity...</div> : error ? (
          <div className="empty-state activity-error"><i className="bi bi-shield-exclamation" />{error}<small>Enable the secured <code>GET /api/activity-log</code> endpoint to view audit records.</small></div>
        ) : !visibleRecords.length ? (
          <div className="empty-state"><i className="bi bi-clock-history" />No activity matches the selected filter.</div>
        ) : (
          <div className="activity-list">
            {visibleRecords.map((record, index) => {
              const recordAction = normaliseAction(record.action);
              const actor = record.performedBy || record.userName || record.user?.username || record.user?.name || 'System';
              const module = record.entityType || record.module || record.resource || 'Site';
              const target = record.entityName || record.summary || record.description || (record.entityId ? `Record #${record.entityId}` : '');
              const timestamp = record.createdAt || record.timestamp || record.occurredAt || record.date;
              return <article className="activity-row" key={record.id || `${timestamp}-${index}`}>
                <span className={`activity-icon ${actionStyle[recordAction] || 'activity-default'}`}><i className={`bi ${recordAction === 'delete' ? 'bi-trash3' : recordAction === 'create' ? 'bi-plus-lg' : recordAction === 'update' ? 'bi-pencil-square' : 'bi-clock-history'}`} /></span>
                <div className="activity-copy"><strong>{actor}</strong> <span className="activity-verb">{recordAction}</span> <b>{module}</b>{target && <span> — {target}</span>}<small>{logDate(timestamp)}{record.ipAddress ? ` · ${record.ipAddress}` : ''}</small></div>
                <span className={`activity-badge ${actionStyle[recordAction] || 'activity-default'}`}>{recordAction}</span>
              </article>;
            })}
          </div>
        )}
      </div>
    </>
  );
}
