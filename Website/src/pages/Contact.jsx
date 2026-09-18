/**
 * Contact.jsx  –  CGS (Centre for Geographical Studies)
 *
 * Address / Phone / Email now come from the CMS Settings module
 * (Admin -> Settings) instead of being hardcoded, so editing them
 * there updates this page automatically.
 */

import React, { useEffect, useState } from 'react';
import { getSettings } from '../api/cmsApi';
import { LoadingSpinner, ErrorState } from '../components/DataState';
import '../Styles/Contact.css';

function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message || 'Failed to load contact details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const siteName = settings?.siteName || settings?.SiteName || 'School of Geography';
  const address =
    settings?.address ||
    settings?.Address ||
    'Aryabhatta Knowledge University Campus, Mithapur, Patna - 800001, Bihar (India)';
  const phone = settings?.phone || settings?.Phone || '+91 612 235 0000';
  const email = settings?.email || settings?.Email || 'geography@aku.ac.in';

  if (loading) {
    return (
      <div className="Contact-page" style={{ textAlign: 'center', padding: '40px' }}>
        <LoadingSpinner size="md" message="Loading contact details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="Contact-page" style={{ textAlign: 'center', padding: '40px' }}>
        <ErrorState message={error} onRetry={fetchSettings} />
      </div>
    );
  }

  return (
    <div className="Contact-page">

      {/* Map Section */}
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

      {/* Contact Details Card */}
      <div
        className="Faculty-box"
        style={{ padding: '20px', textAlign: 'center' }}
      >
        <h2>Contact Us</h2>
        <h3>{siteName}</h3>
        <h3>{address}</h3>
        <h3>Phone - {phone}</h3>
        <h3>Email - {email}</h3>
      </div>

    </div>
  );
}

export default Contact;