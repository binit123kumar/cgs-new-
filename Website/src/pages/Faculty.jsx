import React, { useEffect, useState } from 'react';
import '../Styles/Faculty.css';
import { getFaculty, fileUrl } from '../api/cmsApi';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/DataState';

function Faculty() {
  const [cmsFaculty, setCmsFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFaculty();
      setCmsFaculty(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const faculty = cmsFaculty.filter((f) => !f.isGuestFaculty && !f.isDirector);
  const director = cmsFaculty.find((f) => f.isDirector);

  if (loading) {
    return (
      <>
        <LoadingSpinner size="lg" message="Loading faculty..." />
      </>
    );
  }

  if (error) {
    return (
      <>
        <ErrorState message={error} onRetry={fetchFaculty} />
      </>
    );
  }

  return (
    <>
      {/* ── Director (if any) ── */}
      {director && (
        <div className="Faculty-box director-card">
          <h1>Director</h1>
          {director.photoPath && <img src={fileUrl(director.photoPath)} alt={director.name} />}
          <h3>{director.name}</h3>
          {director.designation && <h3>{director.designation}</h3>}
          {director.qualification && <h3>{director.qualification}</h3>}
          {director.email && <h3>Email – {director.email}</h3>}
          {director.phone && <h3>Contact No. – {director.phone}</h3>}
        </div>
      )}

      {/* ── Faculty ── */}
      {faculty.length > 0 ? (
        faculty.map((f) => (
          <div className="Faculty-box" key={f.id}>
            <h1>{f.designation || 'Faculty'}</h1>
            {f.photoPath && <img src={fileUrl(f.photoPath)} alt={f.name} />}
            <h3>{f.name}</h3>
            {f.qualification && <h3>{f.qualification}</h3>}
            {f.email && <h3>Email – {f.email}</h3>}
            {f.phone && <h3>Contact No. – {f.phone}</h3>}
          </div>
        ))
      ) : (
        <div className="Faculty-box">
          <h1>Faculty</h1>
          <EmptyState message="No faculty members added yet." />
        </div>
      )}

      {/* ── Administrative Staff ── */}
      <div className="Faculty-box">
        <h1>Administrative Staff</h1>
        <EmptyState message="Administrative staff information is managed separately." />
      </div>
    </>
  );
}

export default Faculty;