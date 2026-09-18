import React, { useEffect, useState } from 'react';
import '../Styles/Event.css';
import { getEvents, fileUrl } from '../api/cmsApi';
import { ErrorState, EmptyState, SkeletonGrid } from '../components/DataState';

function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <>
        <h2 className="gallery-section-title">Events & Activities</h2>
        <SkeletonGrid count={6} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <h2 className="gallery-section-title">Events & Activities</h2>
        <ErrorState message={error} onRetry={fetchEvents} />
      </>
    );
  }

  if (events.length === 0) {
    return (
      <>
        <h2 className="gallery-section-title">Events & Activities</h2>
        <EmptyState message="No events scheduled yet." icon="📅" />
      </>
    );
  }

  return (
    <>
      <h2 className="gallery-section-title">Events & Activities</h2>
      <div className="gallery-grid">
        {events.map((event, index) => (
          <div className="gallery-item" key={event.id || index}>
            {event.imagePath && <img src={fileUrl(event.imagePath)} alt={event.title} loading="lazy" />}
            <h3>{event.title}</h3>
            {event.eventDate && <p>{new Date(event.eventDate).toLocaleDateString('en-IN')}</p>}
            {event.venue && <p>{event.venue}</p>}
            {event.description && <p>{event.description}</p>}
          </div>
        ))}
      </div>
    </>
  );
}

export default Event;