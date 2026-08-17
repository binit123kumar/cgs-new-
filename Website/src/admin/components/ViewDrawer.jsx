import { fileUrl } from '../api/client';

export default function ViewDrawer({ config, record, onClose }) {
  if (!record) return null;
  const imagePath = config.imageField ? record[config.imageField] : null;
  const filePath = config.fileField ? record[config.fileField] : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{config.label} — {record[config.titleField]}</h3>
          <button className="modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="modal-body">
          {imagePath && <img src={fileUrl(imagePath)} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 16, maxHeight: 260, objectFit: 'cover' }} />}
          {filePath && (
            <a href={fileUrl(filePath)} target="_blank" rel="noreferrer" className="btn btn-light" style={{ marginBottom: 16 }}>
              <i className="bi bi-file-earmark-arrow-down" /> Open attached file
            </a>
          )}
          <div style={{ display: 'grid', gap: 10 }}>
            {config.fields.filter((f) => f.type !== 'file').map((f) => (
              <div key={f.name}>
                <div className="hint" style={{ marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 13.5 }}>
                  {f.type === 'checkbox'
                    ? (record[f.name] ? 'Yes' : 'No')
                    : (record[f.name] || '—')}
                </div>
              </div>
            ))}
            <div>
              <div className="hint" style={{ marginBottom: 2 }}>Status</div>
              <span className={`status-pill ${record.isActive ? 'active' : 'inactive'}`}>
                {record.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-light" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
