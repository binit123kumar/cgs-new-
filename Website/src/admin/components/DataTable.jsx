import { fileUrl } from '../api/client';

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

function Cell({ col, record, config }) {
  switch (col.key) {
    case 'thumb': {
      const path = config.imageField ? record[config.imageField] : null;
      return path ? <img src={fileUrl(path)} alt="" className="thumb-img" /> : <div className="thumb-img" />;
    }
    case 'status':
      return (
        <span className={`status-pill ${record.isActive ? 'active' : 'inactive'}`}>
          <i className={`bi ${record.isActive ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
          {record.isActive ? 'Active' : 'Inactive'}
        </span>
      );
    case 'showOn': {
      const tags = [];
      if (record.showOnHomePage) tags.push('Home');
      if (record.showOnAboutPage) tags.push('About Page');
      if (record.showOnFooter) tags.push('Footer');
      return tags.length ? tags.join(', ') : '—';
    }
    case 'file':
      return record[config.fileField] ? (
        <a href={fileUrl(record[config.fileField])} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          <i className="bi bi-file-earmark-arrow-down" /> View
        </a>
      ) : '—';
    default:
      if (col.date) return formatDate(record[col.key]);
      return record[col.key] ?? '—';
  }
}

export default function DataTable({ config, records, onView, onEdit, onDelete, onToggleStatus }) {
  if (!records.length) {
    return (
      <div className="empty-state">
        <i className="bi bi-inbox" />
        No records yet. Click &quot;Add {config.label}&quot; to create the first one.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            {config.columns.map((c) => <th key={c.key}>{c.label}</th>)}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              {config.columns.map((c) => (
                <td key={c.key}>
                  {c.key === 'status' ? (
                    <button
                      className={`status-pill ${r.isActive ? 'active' : 'inactive'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => onToggleStatus(r)}
                      title="Click to toggle"
                    >
                      <i className={`bi ${r.isActive ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`} />
                      {r.isActive ? 'Active' : 'Inactive'}
                    </button>
                  ) : (
                    <Cell col={c} record={r} config={config} />
                  )}
                </td>
              ))}
              <td>
                <button className="action-btn action-view" title="View" onClick={() => onView(r)}>
                  <i className="bi bi-eye" />
                </button>
                <button className="action-btn action-edit" title="Edit" onClick={() => onEdit(r)}>
                  <i className="bi bi-pencil" />
                </button>
                <button className="action-btn action-delete" title="Delete" onClick={() => onDelete(r)}>
                  <i className="bi bi-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
