import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings, getFooterLinks } from '../api/cmsApi';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn, FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';
import '../Styles/Footer.css';

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitorCounts, setVisitorCounts] = useState({ total: 0, today: 0 });
  const [settings, setSettings] = useState(null);
  const [footerLinks, setFooterLinks] = useState({});

  useEffect(() => {
    getSettings().then(setSettings);
    getFooterLinks().then((links) => {
      const grouped = (links || []).reduce((acc, link) => {
        const section = link.section || 'Other';
        if (!acc[section]) acc[section] = [];
        acc[section].push(link);
        return acc;
      }, {});
      setFooterLinks(grouped);
    });

    const updateClock = () => setCurrentTime(new Date());
    const clockTimer = window.setInterval(updateClock, 1000);
    const todayKey = new Date().toISOString().slice(0, 10);
    const storageKey = 'cgs-visitor-counts';
    const visitMarker = 'cgs-visitor-session';
    const savedCounts = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
    const counts = savedCounts.date === todayKey
      ? savedCounts
      : { total: savedCounts.total || 0, today: 0, date: todayKey };

    if (!window.sessionStorage.getItem(visitMarker)) {
      counts.total += 1;
      counts.today += 1;
      window.sessionStorage.setItem(visitMarker, '1');
      window.localStorage.setItem(storageKey, JSON.stringify(counts));
    }
    setVisitorCounts({ total: counts.total, today: counts.today });

    return () => window.clearInterval(clockTimer);
  }, []);

  const address = settings?.address || settings?.Address || 'Aryabhatta Knowledge University, Patna, Bihar - 800001';
  const phone = settings?.phone || settings?.Phone || '+91 612 235 0000';
  const email = settings?.email || settings?.Email || 'geography@aku.ac.in';
  const siteName = settings?.siteName || settings?.SiteName || 'School of Geography';

  const dateLabel = currentTime.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const timeLabel = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const renderLinks = (sectionName) => {
    const links = footerLinks[sectionName] || [];
    return links.map((link) => (
      <a
        key={link.id}
        href={link.url}
        target={link.isExternal || link.openInNewTab ? '_blank' : undefined}
        rel={link.isExternal || link.openInNewTab ? 'noreferrer' : undefined}
      >
        {link.label}
      </a>
    ));
  };

  return (
    <footer className="geo-footer">
      <div className="footer-main">
        <div className="footer-col school-footer">
          <div className="footer-brand"><div className="footer-globe">🌍</div><div><strong>{siteName}</strong><span>Aryabhatta Knowledge University</span></div></div>
          <p><FaMapMarkerAlt /> {address}</p>
          <p><FaPhone /> {phone}</p>
          <p><FaEnvelope /> {email}</p>
        </div>
        <div className="footer-col">
          <h3>QUICK LINKS</h3>
          {renderLinks('Quick Links').length > 0 ? renderLinks('Quick Links') : (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/academic-program/ma-msc-geography">Academics</Link>
              <Link to="/faculty">Faculty & Staff</Link>
              <Link to="/events">Research</Link>
              <Link to="/contact">Contact Us</Link>
            </>
          )}
        </div>
        <div className="footer-col">
          <h3>IMPORTANT LINKS</h3>
          {renderLinks('Important Links').length > 0 ? renderLinks('Important Links') : (
            <>
              <a href="https://akubihar.ac.in/" target="_blank" rel="noreferrer">AKU Official Website</a>
              <a href="https://www.ugc.gov.in/" target="_blank" rel="noreferrer">UGC</a>
              <a href="https://www.naac.gov.in/" target="_blank" rel="noreferrer">NAAC</a>
              <a href="https://www.nirfindia.org/" target="_blank" rel="noreferrer">NIRF</a>
              <a href="/assets/pdf/SGS Annual Report - 2025-26.pdf" target="_blank" rel="noreferrer">Annual Report</a>
            </>
          )}
        </div>
        <div className="footer-col">
          <h3>STUDENT CORNER</h3>
          {renderLinks('Student Corner').length > 0 ? renderLinks('Student Corner') : (
            <>
              <a href="/assets/pdf/Revised Syllabus - 2024-26 - M.A in Geography.pdf" target="_blank" rel="noreferrer">Academic Syllabus</a>
              <a href="/events">Examination</a>
              <a href="/events">Results</a>
              <a href="/events">Scholarship</a>
              <a href="/events">e-Resources</a>
            </>
          )}
        </div>
        <div className="footer-col social-footer">
          <h3>FOLLOW US</h3>
          {renderLinks('Follow Us').length > 0 ? renderLinks('Follow Us') : (
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            </div>
          )}
          <h4>LOCATION</h4>
          <div className="footer-map"><iframe title="Aryabhatta Knowledge University location" src="https://www.google.com/maps?q=Aryabhatta+Knowledge+University,+Patna&output=embed" loading="lazy" /></div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-live-info">
          <div className="footer-date-time">
            <span><FaCalendarAlt /> {dateLabel}</span>
            <span><FaClock /> {timeLabel}</span>
          </div>
          <div className="footer-visitor-stats">
            <span><FaUsers /> Total Visitors: {visitorCounts.total}</span>
            <span><FaUsers /> Today Visitors: {visitorCounts.today}</span>
          </div>
        </div>
        <div className="footer-bottom-inner"><span>© 2026 School of Geography, Aryabhatta Knowledge University. All Rights Reserved.</span><span>Designed & Developed by AKU IT Cell</span></div>
      </div>
    </footer>
  );
}