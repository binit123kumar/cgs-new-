import { useState } from 'react';
import { fileUrl } from '../api/client';

function buildInitialState(fields, record, nextDisplayOrder) {
  const state = {};
  fields.forEach((f) => {
    if (f.type === 'file') return; // files handled separately
    if (record) {
      state[f.name] = record[f.name] ?? (f.type === 'checkbox' ? false : '');
      if (f.type === 'date' && state[f.name]) {
        state[f.name] = String(state[f.name]).slice(0, 10); // yyyy-MM-dd for <input type=date>
      }
    } else {
      state[f.name] = f.name === 'displayOrder'
        ? nextDisplayOrder
        : f.default === 'today' ? new Date().toISOString().slice(0, 10) : (f.default ?? (f.type === 'checkbox' ? false : ''));
    }
  });
  return state;
}

export default function FormModal({ config, record, onClose, onSubmit, saving, nextDisplayOrder }) {
  const isEdit = !!record;
  const [values, setValues] = useState(() => buildInitialState(config.fields, record, nextDisplayOrder));
  const [files, setFiles] = useState({});
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState('');

  function handleChange(field, val) {
    setValues((prev) => ({ ...prev, [field]: val }));
  }

  function handleFile(field, fileObj) {
    setFiles((prev) => ({ ...prev, [field]: fileObj }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validate required fields
    for (const f of config.fields) {
      if (f.required && f.type !== 'file' && !String(values[f.name] ?? '').trim()) {
        setError(`${f.label} is required.`);
        return;
      }
      if (f.type === 'file' && f.requiredOnCreate && !isEdit && !files[f.name]) {
        setError(`${f.label} is required.`);
        return;
      }
    }

    const formData = new FormData();
    if (removeImage && config.imageField) formData.append('removeImage', 'true');
    config.fields.forEach((f) => {
      if (f.type === 'file') {
        if (files[f.name]) {
          const selectedFiles = f.multiple ? Array.from(files[f.name]) : [files[f.name]];
          selectedFiles.forEach((file) => formData.append(f.name, file));
          // Preserve compatibility with the existing single-image gallery API
          // while the backend is upgraded to consume the repeated `images` field.
          if (f.name === 'images' && selectedFiles[0]) formData.append('image', selectedFiles[0]);
        }
      } else if (f.type === 'checkbox') {
        formData.append(f.name, values[f.name] ? 'true' : 'false');
      } else {
        formData.append(f.name, values[f.name] ?? '');
      }
    });

    onSubmit(formData);
  }

  // Group fields: normal fields render in the 2-col grid; fields with `group`
  // are collected and rendered together under that group heading.
  const normalFields = config.fields.filter((f) => !f.group);
  const groups = {};
  config.fields.filter((f) => f.group).forEach((f) => {
    groups[f.group] = groups[f.group] || [];
    groups[f.group].push(f);
  });

  const currentImagePath = record && (config.imageField ? record[config.imageField] : config.fileField ? record[config.fileField] : null);

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
        <div className="modal-header">
          <h3 id="form-modal-title">{isEdit ? `Edit ${config.label}` : `Add ${config.label}`}</h3>
          <button className="modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="login-error">{error}</div>}
            <div className="form-grid">
              {normalFields.map((f) => (
                <FieldInput
                  key={f.name}
                  field={f}
                  value={values[f.name]}
                  onChange={(v) => handleChange(f.name, v)}
                  onFile={(file) => handleFile(f.name, file)}
                  currentImagePath={f.type === 'file' ? currentImagePath : null}
                  removeImage={removeImage}
                  onRemoveImage={setRemoveImage}
                />
              ))}

              {Object.entries(groups).map(([groupName, groupFields]) => (
                <div className="form-group full" key={groupName}>
                  <label>{groupName}</label>
                  <div className="checkbox-group">
                    {groupFields.map((f) => (
                      <label className="checkbox-row" key={f.name}>
                        <input
                          type="checkbox"
                          checked={!!values[f.name]}
                          onChange={(e) => handleChange(f.name, e.target.checked)}
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange, onFile, currentImagePath, removeImage, onRemoveImage }) {
  const wrapClass = `form-group${field.full ? ' full' : ''}`;

  if (field.type === 'checkbox') {
    return (
      <div className={wrapClass}>
        <label className="checkbox-row">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === 'file') {
    return (
      <div className={wrapClass}>
        <label>{field.label}{field.requiredOnCreate && <span className="req"> *</span>}</label>
        {field.image && currentImagePath && (
          <>
            {!removeImage && <img src={fileUrl(currentImagePath)} alt="" className="img-preview" />}
            <label className="checkbox-row"><input type="checkbox" checked={removeImage} onChange={(e) => onRemoveImage(e.target.checked)} /> Remove current image</label>
          </>
        )}
        <input type="file" multiple={field.multiple} accept={field.accept || (field.image ? 'image/*' : undefined)} onChange={(e) => onFile(field.multiple ? e.target.files : e.target.files[0])} />
        {field.hint && <span className="hint">{field.hint}</span>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className={wrapClass}>
        <label>{field.label}{field.required && <span className="req"> *</span>}</label>
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <label>{field.label}{field.required && <span className="req"> *</span>}</label>
      <input
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.type === 'number' ? e.target.value : e.target.value)}
      />
    </div>
  );
}
