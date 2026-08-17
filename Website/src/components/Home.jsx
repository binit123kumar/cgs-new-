import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap, FaUsers, FaBookOpen, FaGlobeAsia, FaMapMarkedAlt,
  FaCity, FaLeaf, FaPeopleArrows, FaBuilding, FaArrowRight,
  FaClock, FaImages
} from 'react-icons/fa';
import { getSlider, getAbout, getCourses, getEvents, getFaculty, getGallery, getNews, getNotices, fileUrl } from '../api/cmsApi';
import '../Styles/GeographyHome.css';

const fallback = {
  slides: [
    { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85', alt: 'Mountain landscape' },
    { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85', alt: 'Mountain valley' },
    { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85', alt: 'Lake and mountains' },
  ],
  courses: [
    { name: 'Undergraduate', description: 'B.Sc. (Hons.) Geography', duration: '3 Years Programme', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80' },
    { name: 'Postgraduate', description: 'M.Sc. Geography', duration: '2 Years Programme', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80' },
    { name: 'Ph.D. Programme', description: 'Doctor of Philosophy in Geography', duration: 'Research Programme', image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80' },
    { name: 'Certificate / Diploma', description: 'Add-on & Certificate Courses', duration: 'Short Term Programmes', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80' },
  ],
};

function formatDate(value) {
  if (!value) return { day: '--', month: '' };
  const d = new Date(value);
  return { day: d.getDate(), month: d.toLocaleString('en-IN', { month: 'short' }).toUpperCase() };
}

export default function Home() {
  const [data, setData] = useState({
    slides: fallback.slides, about: [], courses: fallback.courses, faculty: [],
    news: [], notices: [], events: [], gallery: []
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([getSlider(), getAbout(), getCourses(), getFaculty(), getNews(), getNotices(), getEvents(), getGallery()])
      .then(([slides, about, courses, faculty, news, notices, events, gallery]) => {
        if (!mounted) return;
        setData({
          slides: slides?.length ? slides.map(x => ({ src: fileUrl(x.imagePath), alt: x.title || 'School of Geography' })) : fallback.slides,
          about: about || [],
          courses: courses?.length ? courses : fallback.courses,
          faculty: faculty || [],
          news: news || [],
          notices: notices || [],
          events: events || [],
          gallery: gallery || [],
        });
      });
    return () => { mounted = false; };
  }, []);

  const aboutText = data.about[0]?.description ||
    "The School of Geography is dedicated to the understanding of the Earth's landscapes, environments, and human interactions across space and time. Through innovative teaching, cutting-edge research, and field-based learning, we prepare students to address global challenges and contribute to a sustainable future.";

  const faculty = data.faculty.slice(0, 4);
  const news = [...data.notices, ...data.news].slice(0, 4);
  const events = data.events.slice(0, 4);
  const gallery = data.gallery.slice(0, 6);

  const researchAreas = [
    [FaMapMarkedAlt, 'GIS & Remote Sensing', 'Spatial analysis and geospatial solutions'],
    [FaCity, 'Urban Geography', 'Sustainable cities and urban planning'],
    [FaLeaf, 'Environmental Geography', 'Climate, resources and ecosystem studies'],
    [FaPeopleArrows, 'Population Geography', 'Demography, migration and human dynamics'],
    [FaBuilding, 'Regional Planning', 'Regional development and spatial planning'],
  ];

  const stats = [
    [FaGraduationCap, `${data.courses.length}+`, 'Academic Programmes'],
    [FaUsers, `${data.faculty.length}+`, 'Experienced Faculty'],
    [FaBookOpen, `${researchAreas.length}+`, 'Research Areas'],
    [FaGlobeAsia, '250+', 'Students Enrolled'],
  ];

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

      <section className="programs-section header-container">
        <div className="center-heading">
          <h2>ACADEMIC PROGRAMMES</h2><span />
        </div>
        <div className="program-grid">
          {data.courses.map((course, index) => (
            <article className="program-card" key={course.id || course.name || index}>
              <div className="program-image">
                <img src={course.imagePath ? fileUrl(course.imagePath) : (course.image || fallback.courses[index % fallback.courses.length].image)} alt={course.name} />
                <span className="program-icon">{React.createElement([FaGraduationCap, FaBookOpen, FaGraduationCap, FaMapMarkedAlt][index % 4])}</span>
              </div>
              <div className="program-body">
                <h3>{course.name}</h3>
                <p>{course.description || course.eligibility || 'Geography programme'}</p>
                <small>{course.duration || 'Programme'}</small>
                <Link to={`/academic-program/${index === 2 ? 'phd-geography' : 'ma-msc-geography'}`}>View Details <FaArrowRight /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="research" className="research-band">
        <div className="header-container">
          <div className="center-heading light"><h2>RESEARCH &amp; INNOVATION</h2></div>
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
            {(faculty.length ? faculty : [
              { name: 'Dr. A. K. Singh', designation: 'Professor & Head', qualification: 'Physical Geography', photoPath: '/uploads/faculty/328f98392bb74bb5a35d2402127ada14.jpeg' },
              { name: 'Dr. P. Kumari', designation: 'Associate Professor', qualification: 'Human Geography', photoPath: '/uploads/faculty/cf7a1897e5724983b2d50d7656a9c23f.jpeg' },
            ]).map((person, i) => (
              <div className="faculty-card" key={person.id || person.name || i}>
                <img src={person.photoPath ? fileUrl(person.photoPath) : 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80'} alt={person.name} />
                <div className="faculty-info"><strong>{person.name}</strong><span>{person.designation || 'Faculty'}</span><small>{person.qualification || 'Geography'}</small></div>
              </div>
            ))}
          </div>
        </div>

        <div className="notice-column">
          <div className="section-heading-row"><h2>LATEST NOTICES</h2><Link to="/events">View All Notices <FaArrowRight /></Link></div>
          <div className="notice-list">
            {(news.length ? news : [
              { title: 'Field Work Camp for B.Sc. 2nd Year', noticeDate: '2026-05-20' },
              { title: 'UG 3rd Year Practical Examination Schedule', noticeDate: '2026-05-15' },
              { title: 'M.Sc. 2nd Semester Examination Routine', noticeDate: '2026-05-08' },
              { title: 'Seminar on “Climate Change and Sustainable Future”', noticeDate: '2026-05-01' },
            ]).map((item, i) => {
              const date = formatDate(item.noticeDate || item.publishDate);
              return <Link to="/events" className="notice-row" key={item.id || i}>
                <span className="date-box"><b>{date.day}</b><small>{date.month}</small></span>
                <span className="notice-title">{item.title}</span>
                {i === 1 && <em>NEW</em>}
              </Link>;
            })}
          </div>
        </div>

        <div className="events-column">
          <div className="section-heading-row"><h2>UPCOMING EVENTS</h2><Link to="/events">View All Events <FaArrowRight /></Link></div>
          <div className="event-list">
            {(events.length ? events : [
              { title: 'World Environment Day Celebration', eventDate: '2026-05-25', venue: 'Seminar Hall' },
              { title: 'Guest Lecture on GIS Applications', eventDate: '2026-06-05', venue: 'Smart Classroom' },
              { title: 'Field Visit to Ganga Floodplain', eventDate: '2026-06-12', venue: 'Patna' },
              { title: 'Research Scholar Colloquium', eventDate: '2026-06-20', venue: 'Seminar Hall' },
            ]).map((item, i) => {
              const date = formatDate(item.eventDate);
              return <div className="event-row" key={item.id || i}>
                <span className="date-box"><b>{date.day}</b><small>{date.month}</small></span>
                <div><strong>{item.title}</strong><span><FaClock /> {item.venue || 'School of Geography'}</span></div>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section className="gallery-section header-container">
        <div className="section-heading-row"><h2>PHOTO GALLERY</h2><Link to="/events">View Gallery <FaArrowRight /></Link></div>
        <div className="gallery-strip">
          {(gallery.length ? gallery : fallback.slides.concat(fallback.slides)).slice(0, 6).map((item, i) => {
            const src = item.imagePath ? fileUrl(item.imagePath) : item.src;
            return <Link to="/events" className="gallery-thumb" key={item.id || i}><img src={src} alt={item.title || item.alt || 'Geography gallery'} /><span><FaImages /></span></Link>;
          })}
        </div>
      </section>
    </main>
  );
}