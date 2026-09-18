/**
 * About.jsx - CGS (Centre for Geographical Studies)
 *
 * Decorative "geography" theme: topographic contour-line background,
 * compass/mountain accents, earth-tone card. See About.css.
 */

import React, { useEffect, useState } from 'react';
import '../Styles/About.css';
import { getAbout, fileUrl } from '../api/cmsApi';
import { LoadingSpinner, EmptyState } from '../components/DataState';
import { FaCompass, FaMountain } from 'react-icons/fa';

function About() {
  const [entries, setEntries] = useState(null); // null = loading, [] = none found

  useEffect(() => {
    getAbout().then(setEntries);
  }, []);

  const heading = (
    <div className="About-heading-row">
      <FaCompass className="About-compass" />
      <h1 className="About-heading">About Us</h1>
      <FaMountain className="About-mountain" />
    </div>
  );

  // Still loading
  if (entries === null) {
    return (
      <div className="About-page">
        <div className="About-par">
          {heading}
          <LoadingSpinner size="md" message="Loading about page..." />
        </div>
      </div>
    );
  }

  // No entries found
  if (entries.length === 0) {
    return (
      <div className="About-page">
        <div className="About-par">
          {heading}
          <EmptyState message="No about content available yet." action={{ label: 'Retry', onClick: () => window.location.reload() }} />
        </div>
      </div>
    );
  }

  return (
    <div className="About-page">
      <div className="About-par">
        {heading}
        {entries.map((entry) => (
          <React.Fragment key={entry.id}>
            <h2 className="About-subheading">{entry.title}</h2>
            {entry.imagePath && (
              <img
                src={fileUrl(entry.imagePath)}
                alt={entry.title}
                className="About-image"
              />
            )}
            <p className="About-detail">{entry.description}</p>
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default About;