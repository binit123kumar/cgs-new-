import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import { modules } from '../config/modules';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ViewDrawer from '../components/ViewDrawer';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ModulePage() {
  const { moduleKey } = useParams();
  const config = modules[moduleKey];

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey]);

  async function load() {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await client.get(config.endpoint);
      setRecords(res.data.data || []);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [records, search]);

  async function handleSubmit(formData) {
    setSaving(true);
    try {
      if (editingRecord) {
        await client.put(`${config.endpoint}/${editingRecord.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await client.post(config.endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowForm(false);
      setEditingRecord(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await client.delete(`${config.endpoint}/${deletingRecord.id}`);
      setDeletingRecord(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  }

  async function handleToggleStatus(record) {
    try {
      await client.patch(`${config.endpoint}/${record.id}/toggle-status`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not update status.');
    }
  }

  if (!config) {
    return <div className="empty-state">Module not found.</div>;
  }

  return (
    <>
      <div className="breadcrumb-row">
        <Link to="/admin">Dashboard</Link> / {config.label}
      </div>
      <div className="page-title-row">
        <h1>{config.label} Management</h1>
        <button className="btn btn-primary" onClick={() => { setEditingRecord(null); setShowForm(true); }}>
          <i className="bi bi-plus-lg" /> Add {config.label}
        </button>
      </div>

      <div className="card-panel">
        <div className="table-toolbar">
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {records.length} entries
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state"><i className="bi bi-hourglass-split" />Loading...</div>
        ) : errorMsg ? (
          <div className="empty-state" style={{ color: 'var(--danger)' }}>
            <i className="bi bi-exclamation-triangle" />{errorMsg}
          </div>
        ) : (
          <DataTable
            config={config}
            records={filtered}
            onView={setViewingRecord}
            onEdit={(r) => { setEditingRecord(r); setShowForm(true); }}
            onDelete={setDeletingRecord}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {showForm && (
        <FormModal
          config={config}
          record={editingRecord}
          saving={saving}
          onClose={() => { setShowForm(false); setEditingRecord(null); }}
          onSubmit={handleSubmit}
        />
      )}

      {viewingRecord && (
        <ViewDrawer config={config} record={viewingRecord} onClose={() => setViewingRecord(null)} />
      )}

      {deletingRecord && (
        <ConfirmDialog
          title={`Delete ${config.label}?`}
          message={`This will permanently delete "${deletingRecord[config.titleField]}". This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingRecord(null)}
        />
      )}
    </>
  );
}
