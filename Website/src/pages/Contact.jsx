/**
 * Contact.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono Contact.jsx
 *   - Google Maps embed (AKU/CGS campus)
 *   - Contact details card
 *
 * DATA CHANGED: CGS phone, email, address
 */

import React from 'react';
import '../Styles/Contact.css';

function Contact() {
  return (
    <div className="Contact-page">

      {/* ── Map Section ── */}
      <div
        className="Contact-box"
        style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}
      >
        <iframe
          title="CGS Patna Location Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7369481.266118341!2d85.134929!3d25.592302!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58702e5ae787%3A0x6c55883d32ec4db4!2sAryabhatta%20Knowledge%20University!5e0!3m2!1sen!2sin!4v1716946990588!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* ── Contact Details Card ── */}
      <div
        className="Faculty-box"
        style={{ padding: '20px', textAlign: 'center' }}
      >
        <h2>Contact Us</h2>
        <h3>Centre for Geographical Studies</h3>
        <h3>
          Ground Floor, Centres of Excellence Building,
          Aryabhatta Knowledge University Campus,
          Mithapur, Patna – 800001, Bihar (India)
        </h3>
        <h3>Phone – 0612-2952752</h3>
        <h3>Email – support@cgspatna.ac.in</h3>
        <h3>Admin Portal – <a href="http://cgspatna.ac.in/administration/" target="_blank" rel="noopener noreferrer">cgspatna.ac.in/administration</a></h3>
      </div>

    </div>
  );
}

export default Contact;
