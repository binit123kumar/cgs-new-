/**
 * AcademicProgram.jsx – CGS (NEW page)
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/About.css';
import '../Styles/Aim.css';

// ── PDF डाउनलोड करने के लिए फंक्शन ──────────────────────────────────────────
const handleDownload = async (url, title) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    // अगर fetch फेल हो, तो सीधे लिंक खोलें (Fallback)
    window.open(url, '_blank');
  }
};

// ── Programme data map ─────────────────────────────────────────────────────
const programs = {
  'ma-msc-geography': {
    title: 'M.A. in Geography',
    pdfLink: '../assets/pdf/Ordinance - M.A. in Social Science.pdf',
    content: (
      <>
        <p>The 2-year (Four Semester) Post Graduate Degree course M.A./M.Sc. in Geography and Environmental Studies under the <strong>Choice Based Credit System (CBCS)</strong>.</p>
        <br />
        <h3>Ordinance Reference</h3>
        <p>The ordinance and regulations of M.A./M.Sc. are adopted from the common ordinance of Universities of Bihar from the Governor's Secretariat, Bihar, via Memo No. Estb. PREAMBLE: 40/2017-1457/GS(I), Dated 29-05-2018.</p>
      </>
    ),
  },
  'msc-gis-remote-sensing': {
    title: 'M.Sc. in GIS & Remote Sensing',
    pdfLink: '/assets/Ordinance_MSc_GIS.pdf',
    content: (
      <>
        <h3>Nomenclature</h3>
        <p>This ordinance may be called the "Ordinance for Admission to M.Sc. (Geographic Information System & Remote Sensing) programme..."</p>
      </>
    ),
  },
  'pg-diploma-gis': {
    title: 'Post Graduate Diploma in GIS & Remote Sensing',
    pdfLink: '/assets/Ordinance_PG_Diploma_GIS.pdf',
    content: (
      <>
        <h3>Nomenclature</h3>
        <p>This ordinance may be called the "Ordinance for Admission to Post Graduate Diploma (Geographic Information System & Remote Sensing) programme..."</p>
      </>
    ),
  },
  'certificate-gis': {
    title: 'Certificate Programme in GIS & Remote Sensing',
    pdfLink: '/assets/Ordinance_Certificate_GIS.pdf',
    content: (
      <>
        <h3>Nomenclature</h3>
        <p>This ordinance may be called the "Ordinance for Admission to Certificate (Geographic Information System & Remote Sensing) programme..."</p>
      </>
    ),
  },
  'phd-geography': {
    title: 'Ph.D. in Geography',
    pdfLink: '/assets/pdf/Ph.D. Coursework Syllabus.pdf',
    content: (
      <>
        <h3>Centre for Geographical Studies – Ph.D. Programme</h3>
        <p>Common Ordinance and Regulations for the award of Ph.D. degree...</p>
      </>
    ),
  },
};

// ── Component ──────────────────────────────────────────────────────────────
function AcademicProgram() {
  const { programId } = useParams();
  const program = programs[programId];

  if (!program) {
    return (
      <div className="About-par" style={{ textAlign: 'center' }}>
        <h2>Programme Not Found</h2>
        <p>The programme you are looking for does not exist. <Link to="/">Go Home</Link></p>
      </div>
    );
  }

  return (
    <div className="AimdBox" style={{ padding: '30px' }}>
      <h1 className="main-heading">{program.title}</h1>
      <hr className="heading-underline" />

      <div className="AimContent">
        {program.content}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={() => handleDownload(program.pdfLink, program.title)}
          style={{
            padding: '12px 28px',
            backgroundColor: '#2e6b3e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          📄 Download Ordinance (PDF)
        </button>
      </div>
    </div>
  );
}

export default AcademicProgram;