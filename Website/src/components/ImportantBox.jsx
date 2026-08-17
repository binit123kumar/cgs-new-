/**
 * ImportantBox.jsx  –  CGS
 *
 * Exact copy of akuastrono ImportantBox.jsx.
 * Renders a scrollable announcement / links panel.
 *
 * Props:
 *  BoxHeading           {string}  – Panel heading text
 *  NewsAndAnnouncement  {Array}   – [{id, NewsName, href}]
 *  Image                {string}  – URL for the "NEW" gif badge
 */
import React from 'react';
import '../Styles/ImportantBox.css';

function ImportantBox({ BoxHeading, NewsAndAnnouncement, Image }) {
  const newsData = NewsAndAnnouncement.map((item) => (
    <p className="Important-Par" key={item.id}>
      <a href={item.href} className="Important-data">
        {item.NewsName}{' '}
        {/* Show animated NEW badge only in the News & Announcements box */}
        {BoxHeading === 'News & Announcements' ? (
          <img src={Image} alt="new" />
        ) : ''}
      </a>
    </p>
  ));

  return (
    <div className="Important-Box">
      <div className="Important-Heading">
        <p>{BoxHeading}</p>
      </div>
      <div className="Important-Content">{newsData}</div>
    </div>
  );
}

export default ImportantBox;
