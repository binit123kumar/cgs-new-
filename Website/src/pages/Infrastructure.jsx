import React, { useEffect, useState } from 'react';
import { FaBuilding, FaFlask, FaLaptop, FaMapMarkedAlt, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import '../Styles/Infrastructure.css';
import { getFacilities, fileUrl } from '../api/cmsApi';

const iconMap = {
  'bi-geo-alt': FaMapMarkedAlt,
  'bi-laptop': FaLaptop,
  'bi-book': FaBookOpen,
  'bi-building': FaBuilding,
  'bi-flask': FaFlask,
};

function getIcon(iconKey) {
  return iconMap[iconKey] || FaBuilding;
}

export default function Infrastructure() {
  const [cmsFacilities, setCmsFacilities] = useState([]);

  useEffect(() => {
    getFacilities().then(setCmsFacilities);
  }, []);

  const facilityItems = cmsFacilities.length
    ? cmsFacilities.map((facility) => ({
        id: facility.id,
        icon: getIcon(facility.iconKey),
        title: facility.name,
        description: facility.description,
        image: facility.imagePath ? fileUrl(facility.imagePath) : null,
      }))
    : [
        { icon: FaMapMarkedAlt, title: 'GIS & Remote Sensing Lab', description: 'Geospatial analysis, satellite imagery and practical mapping workspaces.' },
        { icon: FaLaptop, title: 'Smart Classrooms', description: 'Technology-enabled classrooms for lectures, demonstrations and collaborative learning.' },
        { icon: FaBookOpen, title: 'Research Library', description: 'Geography references, journals, maps and digital research resources for scholars.' },
        { icon: FaBuilding, title: 'Field Study Facilities', description: 'Field-based learning support for physical, human and regional geography studies.' },
        { icon: FaFlask, title: 'Research & Data Centre', description: 'A focused environment for applied research, data interpretation and innovation.' },
      ];

  return (
    <main className="infrastructure-page">
      <header className="infrastructure-heading">
        <span className="section-label">THE CAMPUS LANDSCAPE</span>
        <h1>Infrastructure</h1>
        <p>Spaces, tools and learning environments that support geographical education and research.</p>
      </header>
      <div className="infrastructure-grid">
        {facilityItems.map((facility) => (
          <article className="infrastructure-card" key={facility.id || facility.title}>
            {facility.image && <img src={facility.image} alt={facility.title} className="infrastructure-image" />}
            <facility.icon className="infrastructure-icon" />
            <h2>{facility.title}</h2>
            <p>{facility.description}</p>
            <span className="infrastructure-link"><FaArrowRight /></span>
          </article>
        ))}
      </div>
    </main>
  );
}