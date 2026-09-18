/**
 * AimAndObjective.jsx  –  CGS (Centre for Geographical Studies)
 *
 * Now loads from the CMS "Aim & Objective" module (Admin -> Aim & Objective)
 * using the new AimObjectiveItem API, providing structured, editable content
 * for Aim, Objectives, Vision, and Mission sections.
 */

import React, { useEffect, useState } from 'react';
import { getAbout, getAimObjectives } from '../api/cmsApi';
import { LoadingSpinner, ErrorState, EmptyState } from '../components/DataState';
import '../Styles/Aim.css';
import '../Styles/About.css';

function AimAndObjective() {
  const [cmsItems, setCmsItems] = useState([]);
  const [legacyEntries, setLegacyEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aimObjectives, aboutEntries] = await Promise.all([getAimObjectives(), getAbout()]);
      setCmsItems(aimObjectives || []);
      setLegacyEntries(aboutEntries || []);
    } catch (err) {
      setError(err.message || 'Failed to load aim and objectives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group CMS items by section
  const grouped = cmsItems.reduce((acc, item) => {
    const section = item.sectionLabel;
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  // Legacy CMS entries (for backward compatibility)
  const legacyFiltered = legacyEntries.filter((entry) =>
    /aim|objective|vision|mission/i.test(entry.title || '')
  );

  if (loading) {
    return (
      <div className="AimdBox" style={{ padding: '30px', textAlign: 'center' }}>
        <LoadingSpinner size="md" message="Loading aim and objectives..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="AimdBox" style={{ padding: '30px', textAlign: 'center' }}>
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  const hasCmsContent = Object.keys(grouped).length > 0;
  const hasLegacyContent = legacyFiltered.length > 0;

  if (!hasCmsContent && !hasLegacyContent) {
    return (
      <div className="AimdBox" style={{ padding: '30px', textAlign: 'center' }}>
        <EmptyState message="No aim and objective content available yet." action={{ label: 'Retry', onClick: fetchData }} />
      </div>
    );
  }

  return (
    <div className="AimdBox" style={{ padding: '30px' }}>
      <h1 className="main-heading">Aim and Objective</h1>
      <hr className="heading-underline" />

      <div className="AimContent">
        {/* Aim */}
        {hasCmsContent && grouped.Aim ? (
          grouped.Aim.map((item) => (
            <section key={item.id}>
              <h2>Aim</h2>
              <p>{item.body}</p>
            </section>
          ))
        ) : (
          <section>
            <h2>Aim</h2>
            <EmptyState message="Aim content not configured yet." size="sm" />
          </section>
        )}

        {/* Objectives */}
        {hasCmsContent && grouped.Objectives ? (
          grouped.Objectives.map((item) => (
            <section key={item.id}>
              <h2>Objectives</h2>
              <p>{item.body}</p>
            </section>
          ))
        ) : (
          <section>
            <h2>Objectives</h2>
            <EmptyState message="Objectives content not configured yet." size="sm" />
          </section>
        )}

        {/* Vision */}
        {hasCmsContent && grouped.Vision ? (
          grouped.Vision.map((item) => (
            <section key={item.id}>
              <h2>Vision</h2>
              <p>{item.body}</p>
            </section>
          ))
        ) : (
          <section>
            <h2>Vision</h2>
            <EmptyState message="Vision content not configured yet." size="sm" />
          </section>
        )}

        {/* Mission */}
        {hasCmsContent && grouped.Mission ? (
          grouped.Mission.map((item) => (
            <section key={item.id}>
              <h3>{item.heading ? `• ${item.heading}` : 'Mission'}</h3>
              <p>{item.body}</p>
            </section>
          ))
        ) : hasLegacyContent ? (
          legacyFiltered
            .filter((e) => /mission/i.test(e.title || ''))
            .map((entry) => (
              <section key={entry.id}>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </section>
            ))
        ) : (
          <section>
            <h3>Mission</h3>
            <EmptyState message="Mission content not configured yet." size="sm" />
          </section>
        )}
      </div>
    </div>
  );
}

export default AimAndObjective;