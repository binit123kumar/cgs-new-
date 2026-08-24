import React, { useEffect, useState } from 'react';
import '../Styles/Institute.css';
import Carousels from './Carousels';
import ImportantBox from './ImportantBox';
import { getAbout, getDownloads, getNews, getNotices, fileUrl } from '../api/cmsApi';

// ── PDF Imports ──
// Niche diye gaye paths ko apne actual folder structure ke hisaab se adjust karein
import ProspectusPDF from '../assets/pdf/SGS Prospectus - 2026-28.pdf';
import AnnualReport2023 from '../assets/pdf/SGS Annual Report - 2025-26.pdf';
import AnnualReport2022 from '../assets/pdf/SGS Annual Report - 2024-25.pdf';
import OrdinanceMA from '../assets/pdf/Ordinance - M.A. in Social Science.pdf';


// ── Box headings ────────────────────────────────────────
const BoxHeading = 'News & Announcements';
const BoxHeadingSecond = 'Important Links';

const NewBadgeImage = 'https://akucgs.vercel.app/assets/new.gif';

const NewsAndAnnouncement = [
  { id: 0, NewsName: 'Admission 2026-28 – CGS Patna', href: 'https://adms.akubihar.ac.in/' },
  { id: 1, NewsName: 'CGS Prospectus 2026-28 (PDF)', href: ProspectusPDF },
  { id: 2, NewsName: 'Annual Report 2025-26 (PDF)', href: AnnualReport2023 },
  { id: 3, NewsName: 'Annual Report 2024-25 (PDF)', href: AnnualReport2022 },
  { id: 4, NewsName: 'M.A./M.Sc. Geography – Batch 2022 Launched', href: '/assets/pdf/Revised Syllabus - 2024-26 - M.A in Geography.pdf' },
  { id: 5, NewsName: 'Ph.D. Enrollment 2021-22 Open', href: '/academic-program/phd-geography' },
];

const ImportantLinks = [
  { id: 0, NewsName: 'Ordinance – M.A. Geography', href: OrdinanceMA },
  { id: 4, NewsName: 'Ph.D. Coursework Syllabus (PDF)', href: '/assets/pdf/Ph.D. Coursework Syllabus.pdf' },
];

function Institute() {
  const [content, setContent] = useState({ about: [], news: [], notices: [], downloads: [] });

  useEffect(() => {
    Promise.all([getAbout(), getNews(), getNotices(), getDownloads()]).then(([about, news, notices, downloads]) => {
      setContent({ about: about || [], news: news || [], notices: notices || [], downloads: downloads || [] });
    });
  }, []);

  const cmsAnnouncements = [...content.notices, ...content.news].slice(0, 8).map((item, index) => ({
    id: item.id || index,
    NewsName: item.title,
    href: item.linkUrl || (item.filePath ? fileUrl(item.filePath) : '/notices'),
  }));
  const cmsDownloads = content.downloads.slice(0, 8).map((item, index) => ({
    id: item.id || index,
    NewsName: item.title,
    href: fileUrl(item.filePath),
  }));
  const intro = content.about.slice(0, 3);

  return (
    <div className="Institute-tab">
      <div className="Institute-tab-one">
        <Carousels />
        <ImportantBox
          NewsAndAnnouncement={cmsAnnouncements.length ? cmsAnnouncements : NewsAndAnnouncement}
          Image={NewBadgeImage}
          BoxHeading={BoxHeading}
        />
      </div>

      <div className="Institute-tab-two">
        <div className="Institute-tab-content">
          {(intro.length ? intro : [
            { id: 1, description: 'The Centre For Geographical Studies (CGS) came into existence as an autonomous institute affiliated to Aryabhatta Knowledge University.' },
            { id: 2, description: 'The Centre was established as a centre of excellence for teaching, training, and research in Geographical Studies.' },
            { id: 3, description: 'The Centre aims to become a premier institute of Geographical Studies in the Bihar region.' },
          ]).map((entry) => <h3 className="institute-text" key={entry.id}>{entry.description}</h3>)}
        </div>

        <div className="Institute-links-wrapper">
          <ImportantBox
            NewsAndAnnouncement={cmsDownloads.length ? cmsDownloads : ImportantLinks}
            Image={NewBadgeImage}
            BoxHeading={BoxHeadingSecond}
          />
        </div>
      </div>
    </div>
  );
}

export default Institute;