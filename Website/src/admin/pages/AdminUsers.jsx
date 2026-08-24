import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { moduleList } from '../config/modules';
import { useAuth } from '../context/AuthContext';

const actions = ['read', 'create', 'update', 'delete'];
const sections = [...moduleList, { key: 'settings', label: 'Settings' }];
const blank = { username: '', password: '', fullName: '', email: '', role: 'Editor', permissions: {} };

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]); const [form, setForm] = useState(blank); const [editing, setEditing] = useState(null);
  const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  async function load() { try { const res = await client.get('/admin-users'); setUsers(res.data.data || []); } catch (e) { setError(e?.response?.data?.message || 'Could not load admin users.'); } }
  useEffect(() => { load(); }, []);
  function toggle(module, action) { setForm((old) => { const current = old.permissions[module] || []; const next = current.includes(action) ? current.filter((x) => x !== action) : [...current, action]; return { ...old, permissions: { ...old.permissions, [module]: next } }; }); }
  function edit(user) { setEditing(user.id); setForm({ username: user.username, password: '', fullName: user.fullName || '', email: user.email || '', role: user.role, permissions: user.permissions || {} }); }
  async function submit(event) { event.preventDefault(); setSaving(true); setError(''); try { const payload = { ...form, username: editing ? undefined : form.username }; if (editing) await client.put(`/admin-users/${editing}`, payload); else await client.post('/admin-users', payload); setForm(blank); setEditing(null); await load(); } catch (e) { setError(e?.response?.data?.message || 'Could not save admin user.'); } finally { setSaving(false); } }
  async function remove(id) { if (!window.confirm('Delete this admin user?')) return; try { await client.delete(`/admin-users/${id}`); await load(); } catch (e) { setError(e?.response?.data?.message || 'Could not delete admin user.'); } }
  if (String(user?.role).toLowerCase() !== 'super admin') return <div className="empty-state"><i className="bi bi-shield-lock" />Only the Super Admin can manage administrators.</div>;
  return <>
    <div className="breadcrumb-row"><Link to="/admin">Dashboard</Link> / Admin Management</div>
    <div className="page-title-row"><h1>Admin Management</h1></div>
    {error && <div className="login-error">{error}</div>}
    <div className="card-panel"><h3>{editing ? 'Edit administrator' : 'Create administrator'}</h3><form onSubmit={submit}>
      <div className="form-grid">
        <div className="form-group"><label>Username</label><input value={form.username} disabled={!!editing} onChange={(e) => setForm({ ...form, username: e.target.value })} required={!editing} /></div>
        <div className="form-group"><label>Password {editing && '(leave blank to keep)'}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} /></div>
        <div className="form-group"><label>Full name</label><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="form-group"><label>Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Editor</option><option>Content Manager</option></select></div>
        <div className="form-group full"><label>Section access</label><div className="permission-grid">{sections.map((m) => <div className="permission-row" key={m.key}><strong>{m.label}</strong>{actions.map((a) => <label key={a}><input type="checkbox" checked={(form.permissions[m.key] || []).includes(a)} onChange={() => toggle(m.key, a)} /> {a}</label>)}</div>)}</div></div>
      </div><div className="modal-footer"><button type="button" className="btn btn-light" onClick={() => { setForm(blank); setEditing(null); }}>Clear</button><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update admin' : 'Create admin'}</button></div>
    </form></div>
    <div className="card-panel"><h3>Administrators</h3><table className="data-table"><thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Access</th><th>Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.username}</td><td>{user.fullName || '—'}</td><td>{user.role}</td><td>{user.role === 'Super Admin' ? 'Everything' : Object.keys(user.permissions || {}).filter((key) => user.permissions[key]?.length).join(', ') || 'None'}</td><td><button className="action-btn action-edit" onClick={() => edit(user)} title="Edit"><i className="bi bi-pencil" /></button>{user.id !== 1 && <button className="action-btn action-delete" onClick={() => remove(user.id)} title="Delete"><i className="bi bi-trash" /></button>}</td></tr>)}</tbody></table></div>
  </>;
}