/**
 * DirectorMessage.jsx - CGS
 *
 * Pulls the director's photo, name, and message from the CMS "About"
 * module (Admin -> About). To edit this page, create/edit an About
 * entry with Title exactly "Director's Message":
 *   - Description = the director's message text (shown below the box)
 *   - ImagePath    = director's photo
 * Shows empty state if no such entry exists yet.
 */

import React, { useEffect, useState } from 'react';
import { getAbout, getFaculty, fileUrl } from '../api/cmsApi';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/DataState';
import '../Styles/Faculty.css';
import '../Styles/About.css';

function DirectorMessage() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, faculty] = await Promise.all([getAbout(), getFaculty()]);
      const match = (list || []).find(
        (a) => a.isDirectorMessage || (a.title || a.Title || '').trim().toLowerCase() === "director's message"
      );
      const director = (faculty || []).find((member) => member.isDirector === true || member.isDirector === 'true');
      setEntry({ ...(match || {}), ...(director || {}) });
    } catch (err) {
      setError(err.message || 'Failed to load director message');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <LoadingSpinner size="md" message="Loading director's message..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  const imageSrc = (entry?.photoPath || entry?.imagePath)
    ? fileUrl(entry.photoPath || entry.imagePath)
    : null;

  const messageParagraphs = (entry?.bio || entry?.description || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  if (!entry || (!entry.name && !entry.description)) {
    return (
      <div style={{ padding: '20px' }}>
        <EmptyState message="Director's message not configured yet." action={{ label: 'Retry', onClick: fetchData }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="Faculty-box">
        <h1>Director's Message</h1>
        {imageSrc && <img src={imageSrc} alt="Director, CGS" />}
        {entry?.name && <h3>{entry.name}</h3>}
        {entry?.designation && <h3>{entry.designation}</h3>}
        {entry?.email && <h3>Email - {entry.email}</h3>}
        {entry?.phone && <h3>Phone - {entry.phone}</h3>}
      </div>

      <div className="About-par">
        {messageParagraphs.map((p, i) => (
          <React.Fragment key={i}>
            <p className="About-detail">{p}</p>
            {i < messageParagraphs.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default DirectorMessage;