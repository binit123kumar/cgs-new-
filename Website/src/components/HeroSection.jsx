import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  FaChevronDown,
  FaSearch,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import {
  getSlider,
  fileUrl,
  getSettings,
} from "../api/cmsApi";
import "../Styles/HeroSection.css";


/* =========================================================
   NAVIGATION MENUS
   ========================================================= */

const menus = [
  {
    label: "ABOUT US",
    items: [
      ["About the School", "/about"],
      ["Aim & Objective", "/aim-and-objective"],
      ["Director's Message", "/director-message"],
    ],
  },

  {
    label: "ACADEMICS",
    items: [
      ["M.A./M.Sc. Geography", "/academic-program/ma-msc-geography"],
      ["Ph.D. in Geography", "/academic-program/phd-geography"],
      [
        "Prospectus 2026-28",
        "/assets/pdf/SGS Prospectus - 2026-28.pdf",
      ],
    ],
  },

  {
    label: "FACULTY & STAFF",
    items: [
      ["Faculty", "/faculty"],
      ["Guest Faculty / Staff", "/staff"],
    ],
  },

  {
    label: "RESEARCH",
    items: [
      ["Research Areas", "/#research"],
      ["Publications", "/publications"],
    ],
  },

  {
    label: "INFRASTRUCTURE",
    items: [
      ["GIS & Remote Sensing Lab", "/about"],
      ["Library", "/about"],
      ["Smart Classroom", "/about"],
    ],
  },
];


/* =========================================================
   HERO SECTION COMPONENT
   ========================================================= */

export default function HeroSection() {

  const location = useLocation();

  /* Open dropdown menu */
  const [open, setOpen] = useState(null);

  /* Database Site Settings */
  const [siteSettings, setSiteSettings] = useState(null);

  /* Hero image */
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1900&q=85"
  );

  /* Search text */
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);


  /* =========================================================
     LOAD DATABASE DATA
     ========================================================= */

  useEffect(() => {

    /* -------------------------------------------------------
       LOAD HERO SLIDER
       ------------------------------------------------------- */

    getSlider()
      .then((items) => {

        if (
          items &&
          items.length > 0 &&
          items[0]?.imagePath
        ) {

          setHeroImage(
            fileUrl(items[0].imagePath)
          );

        }

      })
      .catch((error) => {

        console.error(
          "Hero slider loading error:",
          error
        );

      });


    /* -------------------------------------------------------
       LOAD SITE SETTINGS
       LogoPath comes from database
       ------------------------------------------------------- */

    getSettings()
      .then((data) => {

        console.log(
          "Site Settings:",
          data
        );

        /*
          API sometimes returns an object
          and sometimes an array.

          This handles both.
        */

        if (Array.isArray(data)) {

          setSiteSettings(
            data.length > 0 ? data[0] : null
          );

        } else {

          setSiteSettings(data);

        }

      })
      .catch((error) => {

        console.error(
          "Site Settings loading error:",
          error
        );

      });

  }, []);


  /* =========================================================
     HOME PAGE CHECK
     ========================================================= */

  const isHome = location.pathname === "/";


  /* =========================================================
     DATABASE LOGO URL
     ========================================================= */

  const logoPath =
    siteSettings?.logoPath ||
    siteSettings?.LogoPath ||
    null;


  const logoUrl =
    logoPath
      ? fileUrl(logoPath)
      : null;


  const universityLogoPath =
    siteSettings?.universityLogoPath ||
    siteSettings?.UniversityLogoPath ||
    null;

  const universityLogoUrl =
    universityLogoPath
      ? fileUrl(universityLogoPath)
      : null;


  /* =========================================================
     SITE NAME
     ========================================================= */

  const siteName =
    siteSettings?.siteName ||
    siteSettings?.SiteName ||
    "School of Geography";


  /* =========================================================
     SEARCH HANDLER
     ========================================================= */

  const handleSearch = (e) => {

    e.preventDefault();

    const query = searchText.trim();

    if (!query) {
      return;
    }

    /*
      Search page route.
      If your project already has another search
      route, change only this line.
    */

    window.location.href =
      `/search?q=${encodeURIComponent(query)}`;

  };


  /* =========================================================
     JSX
     ========================================================= */

  return (

    <header className="site-header">


      {/* =====================================================
          TOP GREEN STRIP
          ===================================================== */}

      <div className="top-strip">

        <div className="header-container top-strip-inner">


          {/* -------------------------------------------------
              CONTACT INFORMATION
              ------------------------------------------------- */}

          <div className="top-contact">

            <span className="top-email">
              <FaEnvelope />
              geography@aku.ac.in
            </span>

            <span className="top-divider" />

            <span>
              <FaPhone />
              +91 612 235 0000
            </span>

          </div>


          {/* -------------------------------------------------
              LOGIN + SOCIAL
              ------------------------------------------------- */}

          <div className="top-actions">

            <a href="https://akubihar.ac.in/" target="_blank" rel="noreferrer">
              Student Login
            </a>

            <span>|</span>

            <Link to="/admin/login">
              Admin
            </Link>

            <span className="social-sep" />


            {/* Facebook */}

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>


            {/* Twitter */}

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>


            {/* Instagram */}

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>


            {/* YouTube */}

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>

          </div>

        </div>

      </div>



      {/* =====================================================
          BRAND HEADER
          ===================================================== */}

      <div className="brand-row">

        <div className="brand-inner">


          {/* =================================================
              AKU UNIVERSITY
              ================================================= */}

          <Link
            to="/"
            className="university-brand"
          >

            {universityLogoUrl ? (
              <img
                src={universityLogoUrl}
                alt="Aryabhatta Knowledge University"
                className="aku-emblem-logo"
              />
            ) : (
              <div className="aku-emblem">
                AKU
              </div>
            )}


            <div>

              <strong>
                Aryabhatta Knowledge University
              </strong>

              <span>
                Patna, Bihar
              </span>

            </div>

          </Link>



          {/* =================================================
              SCHOOL OF GEOGRAPHY
              DATABASE LOGO
              ================================================= */}

          <Link
            to="/"
            className="school-brand"
          >


            {/* -------------------------------------------------
                DATABASE LOGO
                ------------------------------------------------- */}

            {logoUrl ? (

              <img
                src={logoUrl}
                alt={siteName}
                className="database-school-logo"
              />

            ) : (

              /* Fallback if database logo is unavailable */

              <div className="globe-mark">
                🌍
              </div>

            )}


            {/* -------------------------------------------------
                SCHOOL NAME
                ------------------------------------------------- */}

            <div>

              <div className="school-title">

                <span>
                  SCHOOL OF
                </span>

                GEOGRAPHY

              </div>


              <small>
                Exploring Earth • Understanding People •
                Shaping Sustainable Futures
              </small>

            </div>

          </Link>



        </div>

      </div>



      {/* =====================================================
          MAIN NAVIGATION
          ===================================================== */}

      <nav className="main-nav">

        <div className="header-container nav-inner">


          {/* HOME */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${
                isActive ? "active" : ""
              }`
            }
          >
            HOME
          </NavLink>



          {/* =================================================
              DROPDOWN MENUS
              ================================================= */}

          {menus.map((menu) => (

            <div
              className="nav-menu"
              key={menu.label}
            >


              <button
                type="button"
                className={
                  `nav-link nav-menu-button ${
                    open === menu.label
                      ? "menu-open"
                      : ""
                  }`
                }
                onClick={() =>
                  setOpen(
                    open === menu.label
                      ? null
                      : menu.label
                  )
                }
              >

                {menu.label}

                <FaChevronDown />

              </button>


              {/* Dropdown */}

              {open === menu.label && (

                <div className="dropdown-panel">

                  {menu.items.map(
                    ([label, href]) => {

                      /* Anchor links */

                      if (
                        href.startsWith("/#")
                      ) {

                        return (

                          <a
                            key={label}
                            href={href}
                            onClick={() =>
                              setOpen(null)
                            }
                          >
                            {label}
                          </a>

                        );

                      }


                      /* PDF links */

                      if (
                        href.endsWith(".pdf")
                      ) {

                        return (

                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {label}
                          </a>

                        );

                      }


                      /* React routes */

                      return (

                        <Link
                          key={label}
                          to={href}
                          onClick={() =>
                            setOpen(null)
                          }
                        >
                          {label}
                        </Link>

                      );

                    }
                  )}

                </div>

              )}

            </div>

          ))}



          {/* =================================================
              OTHER NAVIGATION
              ================================================= */}

          <a
            href="https://adms.akubihar.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            ADMISSION
          </a>


          <NavLink
            to="/notices"
            className="nav-link"
          >
            NOTICES
          </NavLink>


          <NavLink
            to="/events"
            className="nav-link"
          >
            EVENTS
          </NavLink>


          <NavLink
            to="/gallery"
            className="nav-link"
          >
            GALLERY
          </NavLink>


          <NavLink
            to="/downloads"
            className="nav-link"
          >
            DOWNLOADS
          </NavLink>


          <NavLink
            to="/contact"
            className="nav-link"
          >
            CONTACT US
          </NavLink>


          {/* =================================================
              SEARCH BAR (in navbar)
              ================================================= */}

          <form
            className={`header-search ${searchFocused ? "focused" : ""}`}
            onSubmit={handleSearch}
          >

            <button
              type="submit"
              aria-label="Search"
              className="header-search-submit"
            >
              <FaSearch />
            </button>

            <input
              type="search"
              aria-label="Search"
              placeholder="Search..."
              value={searchText}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            {searchText && (
              <button
                type="button"
                aria-label="Clear search"
                className="header-search-clear"
                onClick={() => setSearchText("")}
              >
                <FaTimes />
              </button>
            )}

          </form>

        </div>

      </nav>



      {/* =====================================================
          HERO SECTION
          ONLY SHOW ON HOME PAGE
          ===================================================== */}

      {isHome && (

        <section
          className="geo-hero"
          style={{
            "--hero-image": `url(${heroImage})`,
          }}
        >


          {/* Hero overlay */}

          <div className="geo-hero-overlay" />


          {/* Hero content */}

          <div className="header-container geo-hero-content">


            {/* Welcome text */}

            <div className="hero-kicker">
              WELCOME TO
            </div>


            {/* Main heading */}

            <h1>
              School of Geography
            </h1>


            {/* Description */}

            <p>
              We study the diverse environments and
              spatial patterns that shape our world.
              Our teaching and research promote
              sustainable and informed decision-making
              for a better tomorrow.
            </p>


            {/* Buttons */}

            <div className="hero-buttons">


              {/* Programmes */}

              <Link
                to="/academic-program/ma-msc-geography"
                className="hero-primary"
              >
                Explore Programmes
                <span>›</span>
              </Link>


              {/* Research */}

              <a
                href="#research"
                className="hero-secondary"
              >
                Research &amp; Innovation
                <span>›</span>
              </a>

            </div>

          </div>


          {/* =================================================
              HERO SLIDER DOTS
              ================================================= */}

          <div className="hero-dots">

            <span className="selected" />

            <span />

            <span />

          </div>

        </section>

      )}

    </header>

  );
}