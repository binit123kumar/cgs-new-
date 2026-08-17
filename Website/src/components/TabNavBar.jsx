/**
 * TabNavBar.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono TabNavBar.jsx
 *   Six top-level tabs, each with dropdown options.
 *
 * DATA CHANGED:
 *   - "The Institute"   → About CGS + Aim & Objective + Director's Message
 *   - "Academic Program"→ CGS programme pages (MA/MSc, MSc GIS, PG Diploma,
 *                         Certificate, PhD)
 *   - "People"          → Faculty & Staff
 *   - "Activities"      → Events / Photo Gallery
 *   - "eResources"      → UGC, ISRO, NRSC, etc.
 *   - "Contact"         → Contact page (inline content tab)
 */

import React from 'react';
import TabsWithDropdowns from './TabsWithDropdown';
import '../Styles/Tab.css';
import Institute from './Institute';
import Contact from '../pages/Contact';

const TabNavBar = () => {
  const tabs = [
    /* ── 1. The Institute ─────────────────────────── */
    {
      label: 'The Institute',
      content: <Institute />,           // default landing content
      dropdownOptions: [
        { label: 'About Us',           link: '/about' },
        { label: 'Aim And Objective',  link: '/aim-and-objective' },
        { label: "Director's Message", link: '/director-message' },
      ],
    },

    /* ── 2. Academic Program ──────────────────────── */
    {
      label: 'Academic Program',
      dropdownOptions: [
        {
          label: 'M.A. in Geography',
          link: '/academic-program/ma-msc-geography',
        },
        {
          label: 'Ph.D. in Geography',
          link: '/academic-program/phd-geography',
        },
        {
          label: 'CGS Prospectus (PDF)',
          link: '/assets/pdf/SGS Prospectus - 2026-28.pdf',
        },
      ],
    },

    /* ── 3. People ────────────────────────────────── */
    {
      label: 'People',
      dropdownOptions: [
        { label: 'Faculty', link: '/faculty' },
        { label: 'Guest Faculty', link: '/Staff'},
      ],
    },

    /* ── 4. Activities ────────────────────────────── */
    {
      label: 'Activities',
      dropdownOptions: [
        { label: 'Events & Gallery', link: '/events' },
      ],
    },

    /* ── 5. eResources ────────────────────────────── */
    {
      label: 'eResources',
      dropdownOptions: [
        { label: 'UGC',            link: 'https://www.ugc.gov.in/' },
        { label: 'ISRO',           link: 'https://www.isro.gov.in/' },
        { label: 'NRSC',           link: 'https://www.nrsc.gov.in/' },
        { label: 'Survey of India',link: 'https://www.surveyofindia.gov.in/' },
        { label: 'SWAYAM',         link: 'https://www.swayam.gov.in/' },
        { label: 'INFLIBNET',      link: 'https://www.inflibnet.ac.in/' },
        { label: 'e-PG Pathshala', link: 'https://epgp.inflibnet.ac.in/' },
        { label: 'EGYANKOSH',      link: 'https://www.egyankosh.ac.in/' },
      ],
    },

    /* ── 6. Contact ───────────────────────────────── */
    {
      label: 'Contact',
      content: <Contact />,
    },
  ];

  return (
    <div className="TabNavBar">
      <TabsWithDropdowns tabs={tabs} />
    </div>
  );
};

export default TabNavBar;
