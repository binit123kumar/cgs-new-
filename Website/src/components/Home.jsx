import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap, FaUsers, FaBookOpen, FaGlobeAsia, FaMapMarkedAlt,
  FaCity, FaLeaf, FaPeopleArrows, FaBuilding, FaArrowRight,
  FaClock, FaImages
} from 'react-icons/fa';
import { getSlider, getAbout, getCourses, getEvents, getFaculty, getGallery, getNews, getNotices, fileUrl } from '../api/cmsApi';
import { LoadingSpinner, EmptyState } from '../components/DataState';
import '../Styles/GeographyHome.css';

function formatDate(value) {
  if (!value) return { day: '--', month: '' };
  const d = new Date(value);
  return { day: d.getDate(), month: d.toLocaleString('en-IN', { month: 'short' }).toUpperCase() };
}

function excerpt(value, wordLimit = 38) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean);
  return words.length > wordLimit ? `${words.slice(0, wordLimit).join(' ')}...` : words.join(' ');
}

export default function Home() {
  const [data, setData] = useState({
    slides: [], about: [], courses: [], faculty: [],
    news: [], notices: [], events: [], gallery: []
  });
  const [loading, setLoading] = useState(true);
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([getSlider(), getAbout(), getCourses(), getFaculty(), getNews(), getNotices(), getEvents(), getGallery()])
      .then(([slides, about, courses, faculty, news, notices, events, gallery]) => {
        if (!mounted) return;
        setData({
          slides: slides?.length ? slides.map(x => ({ src: fileUrl(x.imagePath), alt: x.title || 'School of Geography' })) : [],
          about: about || [],
          courses: courses || [],
          faculty: faculty || [],
          news: news || [],
          notices: notices || [],
          events: events || [],
          gallery: gallery || [],
        });
        setLoading(false);
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const aboutText = data.about[0]?.description ||
    "The School of Geography is dedicated to the understanding of the Earth's landscapes, environments, and human interactions across space and time. Through innovative teaching, cutting-edge research, and field-based learning, we prepare students to address global challenges and contribute to a sustainable future.";

  const faculty = data.faculty.slice(0, 4);
  const news = [...data.notices, ...data.news].slice(0, 4);
  const events = data.events.slice(0, 4);
  const gallery = Object.values(data.gallery.reduce((groups, item) => {
    const category = item.category?.trim() || `photo-${item.id}`;
    groups[category] = groups[category] || [];
    groups[category].push(item);
    return groups;
  }, {})).map((photos) => photos.find((photo) => photo.isPrimary) || photos[0]).slice(0, 6);

  const newsHref = (item) => item.linkUrl || item.filePath ? (item.linkUrl || fileUrl(item.filePath)) : '/notices';
  const isExternalHref = (href) => /^https?:\/\//i.test(href);

  const defaultResearchAreas = [
    [FaMapMarkedAlt, 'GIS & Remote Sensing', 'Spatial analysis and geospatial solutions'],
    [FaCity, 'Urban Geography', 'Sustainable cities and urban planning'],
    [FaLeaf, 'Environmental Geography', 'Climate, resources and ecosystem studies'],
    [FaPeopleArrows, 'Population Geography', 'Demography, migration and human dynamics'],
    [FaBuilding, 'Regional Planning', 'Regional development and spatial planning'],
  ];

  const researchAreas = data.about.filter((entry) => /research|gis|urban|environment|population|planning/i.test(entry.title || '')).length > 0
    ? data.about
      .filter((entry) => /research|gis|urban|environment|population|planning/i.test(entry.title || ''))
      .slice(0, 5)
      .map((entry, index) => [[FaMapMarkedAlt, FaCity, FaLeaf, FaPeopleArrows, FaBuilding][index], entry.title, entry.description])
    : defaultResearchAreas;

  const stats = [
    [FaGraduationCap, `${data.courses.length || 0}+`, 'Academic Programmes'],
    [FaUsers, `${data.faculty.length || 0}+`, 'Experienced Faculty'],
    [FaBookOpen, `${researchAreas.length}+`, 'Research Areas'],
    [FaGlobeAsia, '250+', 'Students Enrolled'],
  ];

  if (loading) {
    return (
      <main className="geo-home">
        <section className="about-section header-container">
          <LoadingSpinner size="lg" message="Loading home page..." />
        </section>
      </main>
    );
  }

  return (
    <main className="geo-home">
      <section className="about-section header-container">
        <div className="about-copy">
          <div className="section-label">ABOUT THE SCHOOL</div>
          <p>{aboutText}</p>
          <Link className="green-button" to="/about">Read More About Us <FaArrowRight /></Link>
        </div>
        <div className="stats-grid">
          {stats.map(([Icon, number, label]) => (
            <div className="stat-card" key={label}>
              <Icon className="stat-icon" />
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="programs" className="programs-section header-container">
        <div className="center-heading">
          <h2>ACADEMIC PROGRAMMES</h2><span />
        </div>
        <div className="program-grid">
          {(showAllPrograms ? data.courses : data.courses.slice(0, 4)).map((course, index) => (
            <article className="program-card" key={course.id || course.name || index}>
              <div className="program-image">
                <img src={course.imagePath ? fileUrl(course.imagePath) : 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80'} alt={course.name} />
                <span className="program-icon">{React.createElement([FaGraduationCap, FaBookOpen, FaGraduationCap, FaMapMarkedAlt][index % 4])}</span>
              </div>
              <div className="program-body">
                <h3>{course.name}</h3>
                <p>{excerpt(course.description || course.eligibility || 'Geography programme')}</p>
                <small>{course.duration || 'Programme'}</small>
                <Link to={`/academic-program/${course.id ?? index}`}>View Details <FaArrowRight /></Link>
              </div>
            </article>
          ))}
        </div>
        {data.courses.length === 0 && (
          <EmptyState message="No programmes available yet." action={{ label: 'View All', onClick: () => window.location.href = '/#programs' }} />
        )}
        {data.courses.length > 4 && (
          <button
            type="button"
            className="program-more-button"
            onClick={() => setShowAllPrograms((isShown) => !isShown)}
          >
            {showAllPrograms ? 'Less' : 'More'} <FaArrowRight />
          </button>
        )}
      </section>

      <section id="research" className="research-band">
        <div className="header-container">
          <div className="center-heading light"><h2>RESEARCH & INNOVATION</h2></div>
          <div className="research-grid">
            {researchAreas.map(([Icon, title, text]) => (
              <div className="research-item" key={title}><Icon /><div><strong>{title}</strong><span>{text}</span></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-columns header-container">
        <div className="faculty-column">
          <div className="section-heading-row"><h2>OUR FACULTY</h2><Link to="/faculty">View All Faculty <FaArrowRight /></Link></div>
          <div className="faculty-grid">
            {(faculty.length ? faculty : []).map((person, i) => (
              <div className="home-faculty-card" key={person.id || person.name || i}>
                <img src={person.photoPath ? fileUrl(person.photoPath) : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80'} alt={person.name} />
                <div className="faculty-info"><strong>{person.name}</strong><span>{person.designation || 'Faculty'}</span><small>{person.qualification || 'Geography'}</small></div>
              </div>
            ))}
            {faculty.length === 0 && <EmptyState message="No faculty members added yet." />}
          </div>
        </div>

        <div className="notice-column">
          <div className="section-heading-row"><h2>LATEST NOTICES</h2><Link to="/notices">View All Notices <FaArrowRight /></Link></div>
          <div className="notice-list">
            {(news.length ? news : []).map((item, i) => {
              const date = formatDate(item.noticeDate || item.publishDate);
              const href = newsHref(item);
              const content = <><span className="date-box"><b>{date.day}</b><small>{date.month}</small></span><span className="notice-title">{item.title}</span>{i === 1 && <em>NEW</em>}</>;
              return isExternalHref(href)
                ? <a href={href} target="_blank" rel="noreferrer" className="notice-row" key={item.id || i}>{content}</a>
                : <Link to={href} className="notice-row" key={item.id || i}>{content}</Link>;
            })}
            {news.length === 0 && <EmptyState message="No notices published yet." />}
          </div>
        </div>

        <div className="events-column">
          <div className="section-heading-row"><h2>UPCOMING EVENTS</h2><Link to="/events">View All Events <FaArrowRight /></Link></div>
          <div className="event-list">
            {(events.length ? events : []).map((item, i) => {
              const date = formatDate(item.eventDate);
              return <div className="event-row" key={item.id || i}>
                <span className="date-box"><b>{date.day}</b><small>{date.month}</small></span>
                <div><strong>{item.title}</strong><span><FaClock /> {item.venue || 'School of Geography'}</span></div>
              </div>;
            })}
            {events.length === 0 && <EmptyState message="No events scheduled yet." />}
          </div>
        </div>
      </section>

      <section className="gallery-section header-container">
        <div className="section-heading-row"><h2>PHOTO GALLERY</h2><Link to="/gallery">View Gallery <FaArrowRight /></Link></div>
        <div className="gallery-strip">
          {(gallery.length ? gallery : []).slice(0, 6).map((item, i) => {
            const src = item.imagePath ? fileUrl(item.imagePath) : item.src;
            return <Link to="/gallery" className="gallery-thumb" key={item.id || i}><img src={src} alt={item.category || item.title || item.alt || 'Geography gallery'} /><span><FaImages /></span></Link>;
          })}
          {gallery.length === 0 && <EmptyState message="No gallery photos yet." />}
        </div>
      </section>
    </main>
  );
}