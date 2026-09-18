import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourses, fileUrl } from '../api/cmsApi';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/DataState';
import '../Styles/About.css';
import '../Styles/Aim.css';

function AcademicProgram() {
  const { programId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getCourses();
      const match = (list || []).find((c) => String(c.id) === String(programId));
      if (match) {
        setCourse(match);
      } else {
        setCourse(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load programme');
    } finally {
      setLoading(false);
    }
  }, [programId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (loading) {
    return (
      <div className="About-par" style={{ textAlign: 'center', padding: '40px' }}>
        <LoadingSpinner size="md" message="Loading programme details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="About-par" style={{ textAlign: 'center', padding: '40px' }}>
        <ErrorState message={error} onRetry={fetchCourse} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="About-par" style={{ textAlign: 'center', padding: '40px' }}>
        <EmptyState
          message="Programme Not Found"
          action={{ label: 'Go Home', onClick: () => window.location.href = '/' }}
        />
      </div>
    );
  }

  return (
    <div className="AimdBox" style={{ padding: '30px' }}>
      <h1 className="main-heading">{course.name}</h1>
      <hr className="heading-underline" />

      <div className="AimContent">
        {course.imagePath && (
          <img
            src={fileUrl(course.imagePath)}
            alt={course.name}
            style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 8, marginBottom: 20 }}
          />
        )}

        {course.duration && <p><strong>Duration:</strong> {course.duration}</p>}
        {course.eligibility && <p><strong>Eligibility:</strong> {course.eligibility}</p>}

        {course.description && (
          <>
            <br />
            <h3>About this Programme</h3>
            <p>{course.description}</p>
          </>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {course.pdfPath ? (
          <a
            href={fileUrl(course.pdfPath)}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: '#2e6b3e',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            View / Download Course PDF
          </a>
        ) : (
          <Link
            to="/downloads"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: '#2e6b3e',
              color: 'white',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            View Ordinance / Syllabus (Downloads)
          </Link>
        )}
      </div>
    </div>
  );
}

export default AcademicProgram;