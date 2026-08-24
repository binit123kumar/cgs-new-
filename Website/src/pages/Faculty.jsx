/**
 * Faculty.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono Faculty.jsx
 *   Each person rendered in a .Faculty-box card with image,
 *   name, designation, email, and contact number.
 *
 * DATA CHANGED: CGS faculty & staff from cgs-main/founder.html
 *   and known CGS personnel records.
 */

import React, { useEffect, useState } from 'react';
import '../Styles/Faculty.css';
import { getFaculty, fileUrl } from '../api/cmsApi';

// ── Faculty images (hosted on shared CDN / public folder) ──
// Replace these paths with your actual image locations.
const facultyImg  = 'https://akucgs.vercel.app/images/faculty.jpg';

function Faculty() {
  const [cmsFaculty, setCmsFaculty] = useState([]);

  useEffect(() => {
    getFaculty().then(setCmsFaculty);
  }, []);

  return (
    <>
      {/* ── Faculty ── */}
      {cmsFaculty.filter((f) => !f.isGuestFaculty && !f.isDirector).length > 0 ? (
        cmsFaculty.filter((f) => !f.isGuestFaculty && !f.isDirector).map((f) => (
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
          <img src={facultyImg} alt="Faculty – CGS" />
          <h3>Faculty positions are being filled as per Bihar Government recruitment norms.</h3>
          <h3>
            For faculty-related enquiries, please contact:{' '}
            <a href="mailto:support@cgspatna.ac.in">support@cgspatna.ac.in</a>
          </h3>
        </div>
      )}

      {/* ── Administrative Staff ── */}
      <div className="Faculty-box">
        <h1>Administrative Staff</h1>
        <h3>Office – Centre for Geographical Studies</h3>
        <h3>
          Ground Floor, Centres of Excellence Building,
          AKU Campus, Mithapur, Patna-800001
        </h3>
        <h3>Phone – 0612-2952752</h3>
        <h3>Email – support@cgspatna.ac.in</h3>
      </div>
    </>
  );
}

export default Faculty;
