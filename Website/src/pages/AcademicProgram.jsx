/**
 * AcademicProgram.jsx - CGS
 *
 * Now loads the real Course record from the CMS (Admin -> Courses)
 * using the numeric course id in the URL, instead of a hardcoded
 * slug/content map. Edit programme details from Admin -> Courses.
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourses, fileUrl } from '../api/cmsApi';
import '../Styles/About.css';
import '../Styles/Aim.css';

function AcademicProgram() {
  const { programId } = useParams();
  const [course, setCourse] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    getCourses()
      .then((list) => {
        const match = (list || []).find(
          (c) => String(c.id) === String(programId)
        );
        setCourse(match || null);
      })
      .catch(() => setCourse(null));
  }, [programId]);

  if (course === undefined) {
    return (
      <div className="About-par" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="About-par" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Programme Not Found</h2>
        <p>The programme you are looking for does not exist. <Link to="/">Go Home</Link></p>
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
