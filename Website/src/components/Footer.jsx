import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import '../Styles/Footer.css';

export default function Footer() {
  return (
    <footer className="geo-footer">
      <div className="footer-main">
        <div className="footer-col school-footer">
          <div className="footer-brand"><div className="footer-globe">🌍</div><div><strong>SCHOOL OF GEOGRAPHY</strong><span>Aryabhatta Knowledge University</span></div></div>
          <p><FaMapMarkerAlt /> Aryabhatta Knowledge University<br />Patna, Bihar - 800001</p>
          <p><FaPhone /> +91 612 235 0000</p>
          <p><FaEnvelope /> geography@aku.ac.in</p>
        </div>
        <div className="footer-col">
          <h3>QUICK LINKS</h3>
          <Link to="/">Home</Link><Link to="/about">About Us</Link><Link to="/academic-program/ma-msc-geography">Academics</Link><Link to="/faculty">Faculty &amp; Staff</Link><Link to="/events">Research</Link><Link to="/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h3>IMPORTANT LINKS</h3>
          <a href="https://akubihar.ac.in/" target="_blank" rel="noreferrer">AKU Official Website</a>
          <a href="https://www.ugc.gov.in/" target="_blank" rel="noreferrer">UGC</a><a href="https://www.naac.gov.in/" target="_blank" rel="noreferrer">NAAC</a><a href="https://www.nirfindia.org/" target="_blank" rel="noreferrer">NIRF</a><a href="/assets/pdf/SGS Annual Report - 2025-26.pdf" target="_blank" rel="noreferrer">Annual Report</a>
        </div>
        <div className="footer-col">
          <h3>STUDENT CORNER</h3><a href="/assets/pdf/Revised Syllabus - 2024-26 - M.A in Geography.pdf" target="_blank" rel="noreferrer">Academic Syllabus</a><a href="/events">Examination</a><a href="/events">Results</a><a href="/events">Scholarship</a><a href="/events">e-Resources</a>
        </div>
        <div className="footer-col social-footer">
          <h3>FOLLOW US</h3>
          <div className="social-icons"><a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a><a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a><a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a><a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a></div>
          <h4>LOCATION</h4>
          <div className="footer-map"><iframe title="Aryabhatta Knowledge University location" src="https://www.google.com/maps?q=Aryabhatta+Knowledge+University,+Patna&output=embed" loading="lazy" /></div>
        </div>
      </div>
      <div className="footer-bottom"><div className="footer-bottom-inner"><span>© 2026 School of Geography, Aryabhatta Knowledge University. All Rights Reserved.</span><span>Designed &amp; Developed by AKU IT Cell</span></div></div>
    </footer>
  );
}