import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  FaChevronDown,
  FaSearch,
  FaHome,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaBars,
} from "react-icons/fa";

import {
  getSlider,
  fileUrl,
  getSettings,
  getNavigation,
} from "../api/cmsApi";
import "../Styles/HeroSection.css";
import campusBackground from "../assets/pdf/Image-1769067088487.jpeg";

const defaultHeroImage = "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1900&q=85";

// A logo, document screenshot or thumbnail must never be stretched across the
// hero. Only landscape images large enough for a desktop banner are accepted.
function isBannerImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth >= 1200 && image.naturalHeight >= 400);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}


/* =========================================================
   HERO SECTION COMPONENT
   ========================================================= */

export default function HeroSection() {

  const location = useLocation();

  /* Open dropdown menu */
  const [open, setOpen] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  /* Database Site Settings */
  const [siteSettings, setSiteSettings] = useState(null);

  /* Navigation from CMS */
  const [navigation, setNavigation] = useState([]);

  /* Hero image */
  const [heroImages, setHeroImages] = useState([{ src: defaultHeroImage, title: 'School of Geography' }]);
  const [heroStart, setHeroStart] = useState(0);

  /* Search text */

  /* =========================================================
     LOAD DATABASE DATA
     ========================================================= */

  useEffect(() => {

    /* -------------------------------------------------------
       LOAD HERO SLIDER
       ------------------------------------------------------- */

    getSlider()
      .then(async (items) => {
        const candidates = (items || []).filter((item) => item?.imagePath);
        const validImages = [];
        for (const item of candidates) {
          const imageUrl = fileUrl(item.imagePath);
          if (await isBannerImage(imageUrl)) {
            validImages.push({ src: imageUrl, title: item.title || 'School of Geography' });
            if (validImages.length === 9) break;
          }
        }
        setHeroImages(validImages.length ? validImages : [{ src: defaultHeroImage, title: 'School of Geography' }]);
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

    /* -------------------------------------------------------
       LOAD NAVIGATION MENU
       ------------------------------------------------------- */

    getNavigation()
      .then((data) => {
        setNavigation(data || []);
      })
      .catch((error) => {
        console.error("Navigation loading error:", error);
      });

  }, []);

  useEffect(() => {
    if (heroImages.length < 2) return undefined;
    const timer = window.setInterval(() => setHeroStart((value) => (value + 3) % heroImages.length), 5000);
    return () => window.clearInterval(timer);
  }, [heroImages.length]);


  /* =========================================================
     HOME PAGE CHECK
     ========================================================= */

  const isHome = location.pathname === "/";

  useEffect(() => {
    setOpen(null);
    setNavOpen(false);
  }, [location.pathname]);


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

  const contactEmail = siteSettings?.email || siteSettings?.Email || "geography@aku.ac.in";
  const contactPhone = siteSettings?.phone || siteSettings?.Phone || "+91 612 235 0000";
  const heroDescription = siteSettings?.metaDescription || siteSettings?.MetaDescription ||
    "We study the diverse environments and spatial patterns that shape our world. Our teaching and research promote sustainable and informed decision-making for a better tomorrow.";


  /* =========================================================
     SEARCH HANDLER
     ========================================================= */

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
              {contactEmail}
            </span>

            <span className="top-divider" />

            <span>
              <FaPhone />
              {contactPhone}
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

        <div className="header-container mobile-nav-trigger-row">
          <button
            type="button"
            className="mobile-nav-trigger"
            aria-expanded={navOpen}
            aria-controls="primary-navigation"
            onClick={() => setNavOpen((value) => !value)}
          >
            {navOpen ? <FaTimes /> : <FaBars />} <span>Menu</span>
          </button>
        </div>

        <div id="primary-navigation" className={`header-container nav-inner ${navOpen ? "nav-open" : ""}`} onClick={(event) => {
          if (event.target.closest('a')) setNavOpen(false);
        }}>


          {/* HOME */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${
                isActive ? "active" : ""
              }`
            }
            aria-label="Home"
            title="Home"
          >
            <FaHome />
            <span className="sr-only">Home</span>
          </NavLink>


          {/* =================================================
              DYNAMIC DROPDOWN MENUS FROM CMS
              ================================================= */}

          {navigation
            .filter(item => item.parentId === null || item.parentId === 0)
            .map((menu) => {
              const children = navigation
                .filter(item => item.parentId === menu.id)
                .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

              if (children.length === 0) {
                // Top-level link without dropdown
                return (
                  <NavLink
                    key={menu.id}
                    to={menu.url || '#'}
                    className="nav-link"
                    target={menu.isExternal ? '_blank' : undefined}
                    rel={menu.isExternal ? 'noreferrer' : undefined}
                    onClick={() => setOpen(null)}
                  >
                    {menu.label}
                  </NavLink>
                );
              }

              // Dropdown menu
              return (
                <div
                  className="nav-menu"
                  key={menu.id}
                  onMouseEnter={() => setOpen(menu.id)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <button
                    type="button"
                    className={
                      `nav-link nav-menu-button ${
                        open === menu.id
                          ? "menu-open"
                          : ""
                      }`
                    }
                    onClick={() =>
                      setOpen(
                        open === menu.id
                          ? null
                          : menu.id
                      )
                    }
                  >
                    {menu.label}
                    <FaChevronDown />
                  </button>

                  {open === menu.id && (
                    <div className="dropdown-panel">
                      {children.map((child) => {
                        const isAnchor = child.url?.startsWith('/#');
                        const isPdf = child.url?.endsWith('.pdf');
                        const isExternal = child.isExternal;

                        if (isAnchor) {
                          return (
                            <a
                              key={child.id}
                              href={child.url}
                              onClick={() => setOpen(null)}
                            >
                              {child.label}
                            </a>
                          );
                        }

                        if (isPdf) {
                          return (
                            <a
                              key={child.id}
                              href={child.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {child.label}
                            </a>
                          );
                        }

                        if (isExternal) {
                          return (
                            <a
                              key={child.id}
                              href={child.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {child.label}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={child.id}
                            to={child.url}
                            onClick={() => setOpen(null)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}


          {/* =================================================
              STATIC NAVIGATION LINKS (kept for essential links)
              ================================================= */}

          <NavLink
            to="/gallery"
            className="nav-link"
          >
            GALLERY
          </NavLink>


          <NavLink
            to="/infrastructure"
            className="nav-link"
          >
            INFRASTRUCTURE
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

          <Link to="/search" className="nav-link nav-search-icon" aria-label="Search website" title="Search website"><FaSearch /></Link>

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
          }}
        >

          <div
            className="geo-hero-campus-background"
            style={{
              backgroundImage: `url(${siteSettings?.heroBackgroundPath || siteSettings?.HeroBackgroundPath
                ? fileUrl(siteSettings.heroBackgroundPath || siteSettings.HeroBackgroundPath)
                : campusBackground})`,
            }}
            aria-hidden="true"
          />

          {/* Hero overlay */}

          <div className="geo-hero-slides" aria-hidden="true">
            {[0, 1, 2].map((offset) => {
              const image = heroImages[(heroStart + offset) % heroImages.length];
              return <div key={`${image.src}-${offset}`} className="geo-hero-slide" style={{ backgroundImage: `url(${image.src})` }} />;
            })}
          </div>
          <div className="geo-hero-overlay" />


          {/* Hero content */}

          <div className="header-container geo-hero-content hero-fixed-copy">


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
              {heroDescription}
            </p>


            {/* Buttons */}

            <div className="hero-buttons">


              {/* Programmes */}

              <Link
                to="/#programs"
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
                Research & Innovation
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