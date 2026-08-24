import React, { useEffect, useState } from 'react';
import { FaBuilding, FaFlask, FaLaptop, FaMapMarkedAlt, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import '../Styles/Infrastructure.css';
import { getAbout } from '../api/cmsApi';

const facilities = [
  ['GIS & Remote Sensing Lab', FaMapMarkedAlt, 'Geospatial analysis, satellite imagery and practical mapping workspaces.'],
  ['Smart Classrooms', FaLaptop, 'Technology-enabled classrooms for lectures, demonstrations and collaborative learning.'],
  ['Research Library', FaBookOpen, 'Geography references, journals, maps and digital research resources for scholars.'],
  ['Field Study Facilities', FaBuilding, 'Field-based learning support for physical, human and regional geography studies.'],
  ['Research & Data Centre', FaFlask, 'A focused environment for applied research, data interpretation and innovation.'],
];

export default function Infrastructure() {
  const [cmsFacilities, setCmsFacilities] = useState([]);

  useEffect(() => {
    getAbout().then((entries) => {
      setCmsFacilities((entries || []).filter((entry) => /^infrastructure\s*[-:]/i.test(entry.title || '')));
    });
  }, []);

  const facilityItems = cmsFacilities.length
    ? cmsFacilities.map((entry, index) => [
      (index % 5 === 0 && FaMapMarkedAlt) || (index % 5 === 1 && FaLaptop) || (index % 5 === 2 && FaBookOpen) || (index % 5 === 3 && FaBuilding) || FaFlask,
      (entry.title || '').replace(/^infrastructure\s*[-:]\s*/i, ''),
      entry.description,
    ])
    : facilities;

  return (
    <main className="infrastructure-page">
      <header className="infrastructure-heading">
        <span className="section-label">THE CAMPUS LANDSCAPE</span>
        <h1>Infrastructure</h1>
        <p>Spaces, tools and learning environments that support geographical education and research.</p>
      </header>
      <div className="infrastructure-grid">
        {facilityItems.map(([title, Icon, description]) => (
          <article className="infrastructure-card" key={title}>
            <Icon className="infrastructure-icon" />
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="infrastructure-link"><FaArrowRight /></span>
          </article>
        ))}
      </div>
    </main>
  );
}
