/**
 * DirectorMessage.jsx - CGS
 *
 * Pulls the director's photo, name, and message from the CMS "About"
 * module (Admin -> About). To edit this page, create/edit an About
 * entry with Title exactly "Director's Message":
 *   - Description = the director's message text (shown below the box)
 *   - ImagePath    = director's photo
 * Falls back to the previous static content if no such entry exists yet.
 */

import React, { useEffect, useState } from 'react';
import { getAbout, getFaculty, fileUrl } from '../api/cmsApi';
import '../Styles/Faculty.css';
import '../Styles/About.css';

const FALLBACK = {
  name: "Dr. Poornima Sekhar Singh",
  designation: "Founding Director",
  org: "Centre for Geographical Studies, AKU, Patna",
  email: "director@cgspatna.ac.in",
  phone: "9471007084",
  office: "Office: Ground Floor, Centres of Excellence Building, AKU Campus, Mithapur, Patna-800001",
  image: "https://akucgs.vercel.app/images/director_img_150.png",
  message: `The Centre for Geographical Studies, Govt. of Bihar, is one of a kind centre exclusively devoted to the discipline of geography in its full applied potential. This centre is a product of the vision of our Hon'ble Chief Minister Shri. Nitish Kumar, who wants this centre to produce cutting-edge planning solutions for the myriad of obstacles that Bihar has to overcome in its developmental journey.

As the founding director of the institute, it is my honour as well as my promise to not only fulfil the vision of our dynamic Chief Minister but also to create this centre as the centre of excellence of research and knowledge production. With the patronage of all, I hope to make this centre a numero uno in the disciplinary field of Geographical research, especially incorporating the very latest in Satellite imagery, GIS, and Remote Sensing.`,
};

function DirectorMessage() {
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    Promise.all([getAbout(), getFaculty()])
      .then(([list, faculty]) => {
        const match = (list || []).find(
          (a) => a.isDirectorMessage || (a.title || a.Title || '').trim().toLowerCase() === "director's message"
        );
        const director = (faculty || []).find((member) => member.isDirector === true || member.isDirector === 'true');
        setEntry({ ...(match || {}), ...(director || {}) });
      })
      .catch(() => setEntry({}));
  }, []);

  const imageSrc = (entry?.photoPath || entry?.imagePath)
    ? fileUrl(entry.photoPath || entry.imagePath)
    : FALLBACK.image;

  const messageParagraphs = (entry?.bio || entry?.description || FALLBACK.message)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div style={{ padding: '20px' }}>
      <div className="Faculty-box">
        <h1>Director's Message</h1>
        <img src={imageSrc} alt="Director, CGS" />
        <h3>{entry?.name || FALLBACK.name}</h3>
        <h3>{entry?.designation || FALLBACK.designation}</h3>
        <h3>{FALLBACK.org}</h3>
        <h3>Email - {entry?.email || FALLBACK.email}</h3>
        <h3>Phone - {entry?.phone || FALLBACK.phone}</h3>
        <h3>{FALLBACK.office}</h3>
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