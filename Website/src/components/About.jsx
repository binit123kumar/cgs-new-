/**
 * About.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono About.jsx
 * DATA CHANGED: CGS about text from cgs-main/about.html
 */

import React, { useEffect, useState } from 'react';
import '../Styles/About.css';
import { getAbout, fileUrl } from '../api/cmsApi';

// Original static copy — used automatically if the CMS backend has no
// "About" entries yet (or isn't reachable), so the page never looks broken.
const fallbackParagraphs = [
  `The Centre For Geographical Studies (CGS) came into existence vide Bihar
  Government notification 15/P 5-09/2016 va'k-193, Date 09.02.2018 as an autonomous
  institute affiliated to Aryabhatta Knowledge University. However, vide Bihar
  Government notification 15/M 1-69/2021 – 1997, dated September 20th, 2021, the
  Centre for Geographical Studies is now a constituent unit of the Aryabhatta
  Knowledge University.`,
  `The Centre for Geographical Studies was established as a centre of excellence by
  the Bihar Government with the basic objectives of teaching, training, and
  undertaking research in the areas of Geographical Studies. The first enrollment in
  Ph.D. was taken in the session 2020-21 and the second enrollment for Ph.D. was
  taken in the session 2021-22. Presently, total 08 Research Scholars are doing
  research in the Centre.`,
  `The first batch of M.A./M.Sc. in Geography was launched in 2022. M.Sc. in GIS and
  Remote Sensing, PG Diploma, and Certificate courses in GIS and Remote Sensing will
  be started in the near future once regular teaching positions are filled.`,
  `The Centre aims to become a premier and prestigious institute of Geographical
  Studies in the Bihar region. The growing need for quality education in the field
  of Geographical Studies and research led the Government of Bihar to establish the
  Centre for Geographical Studies as an institution of higher learning.`,
];

function About() {
  const [entries, setEntries] = useState(null); // null = loading, [] = none found

  useEffect(() => {
    getAbout().then(setEntries);
  }, []);

  // Still loading, or backend had nothing for the About page -> show the
  // original static content so the page is never empty.
  if (!entries || entries.length === 0) {
    return (
      <div className="About-par">
        <h1 className="About-heading">About Us</h1>
        {fallbackParagraphs.map((text, i) => (
          <React.Fragment key={i}>
            <p className="About-detail">{text}</p>
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="About-par">
      <h1 className="About-heading">About Us</h1>
      {entries.map((entry) => (
        <React.Fragment key={entry.id}>
          <h2 style={{ marginTop: 18 }}>{entry.title}</h2>
          {entry.imagePath && (
            <img
              src={fileUrl(entry.imagePath)}
              alt={entry.title}
              style={{ maxWidth: '100%', borderRadius: 8, margin: '12px 0' }}
            />
          )}
          <p className="About-detail">{entry.description}</p>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
}

export default About;
