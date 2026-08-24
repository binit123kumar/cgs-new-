/**
 * Event.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono Event.jsx
 *   Responsive photo gallery grid.
 *
 * DATA CHANGED:
 *   Images mapped to CGS gallery photos (Picture1-34 + AAC + activities).
 *   All images reference the shared CDN base URL; replace with
 *   your own public-folder paths once you host the CGS build.
 */

import React, { useEffect, useState } from 'react';
import '../Styles/Event.css';
import { getEvents, fileUrl } from '../api/cmsApi';

// CGS event / activity images (from cgs-main/images/) — used as a fallback
// until images are added in the CMS "Gallery" module.
const CGS_CDN = 'https://akucgs.vercel.app/images';

const fallbackEvents = [
  { title: 'CGS Activity 1', imagePath: `${CGS_CDN}/Picture1.png` },
  { title: 'CGS Activity 2', imagePath: `${CGS_CDN}/Picture2.png` },
  { title: 'CGS Activity 3', imagePath: `${CGS_CDN}/Picture3.png` },
  { title: 'CGS Activity 4', imagePath: `${CGS_CDN}/Picture4.png` },
  { title: 'CGS Activity 5', imagePath: `${CGS_CDN}/Picture5.png` },
];

function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((items) => {
      setEvents(items || []);
    });
  }, []);

  return (
    <>
      <h2 className="gallery-section-title">Events &amp; Activities</h2>
      <div className="gallery-grid">
        {(events.length ? events : fallbackEvents).map((event, index) => (
          <div className="gallery-item" key={event.id || index}>
            {event.imagePath && <img src={fileUrl(event.imagePath)} alt={event.title} loading="lazy" />}
            <h3>{event.title}</h3>
            {event.eventDate && <p>{new Date(event.eventDate).toLocaleDateString('en-IN')}</p>}
            {event.venue && <p>{event.venue}</p>}
          </div>
        ))}
      </div>
    </>
  );
}

export default Event;
