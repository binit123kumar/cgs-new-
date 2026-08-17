/**
 * TabsWithDropdown.jsx  –  CGS
 *
 * Exact structural & behavioural copy of akuastrono TabsWithDropdown.jsx.
 * Handles:
 *  - Highlighting the active tab
 *  - Opening / closing dropdown menus
 *  - Routing: internal links via <Link>, PDFs / external via <a target="_blank">
 *  - Click-outside-to-close via ref + useEffect
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Tab.css';

const TabsWithDropdowns = ({ tabs }) => {
  const [activeTab, setActiveTab]     = useState(tabs[0].label);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  /* Toggle active tab and dropdown open state */
  const handleTabClick = (label, hasContent) => {
    if (hasContent) setActiveTab(label);
    setDropdownOpen(dropdownOpen === label ? null : label);
  };

  /* Close dropdown on outside click */
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="tabs-with-dropdowns">
      {/* ── Tab Button Row ── */}
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className="tab-container"
            ref={dropdownOpen === tab.label ? dropdownRef : null}
          >
            <button
              className={activeTab === tab.label ? 'active' : ''}
              onClick={() => handleTabClick(tab.label, !!tab.content)}
            >
              {tab.label}
              {tab.dropdownOptions && (
                <span className="dropdown-icon">▼</span>
              )}
            </button>

            {/* ── Dropdown Panel ── */}
            {dropdownOpen === tab.label && tab.dropdownOptions && (
              <div className="tab-dropdown">
                <ul>
                  {tab.dropdownOptions.map((option, index) => (
                    <li key={index}>
                      {/* External URL → open in new tab */}
                      {option.link.startsWith('http') ? (
                        <a href={option.link} target="_blank" rel="noopener noreferrer">
                          {option.label}
                        </a>
                      ) : /* PDF file → open in new tab */
                      option.link.endsWith('.pdf') ? (
                        <a href={option.link} target="_blank" rel="noopener noreferrer" className="pdf">
                          {option.label}
                        </a>
                      ) : (
                        /* Internal React route */
                        <Link to={option.link}>{option.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Tab Content Panels ── */}
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`tab-panel ${activeTab === tab.label ? 'active' : ''}`}
          >
            {tab.content ? tab.content : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsWithDropdowns;
