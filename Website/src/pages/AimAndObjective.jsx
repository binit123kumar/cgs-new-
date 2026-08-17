/**
 * AimAndObjective.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono AimAndObjective.jsx
 * DATA CHANGED: CGS mission, vision, and objectives
 */

import React from 'react';
import '../Styles/Aim.css';

function AimAndObjective() {
  return (
    <div className="AimdBox">
      <h1 className="main-heading">Aim and Objective</h1>
      <hr className="heading-underline" />

      <div className="AimContent">

        <h2>Aim</h2>
        <p>
          To make the Centre for Geographical Studies a premier institution devoted
          to excellence in teaching, research, and outreach in Geographical Studies,
          GIS, Remote Sensing, and related disciplines — with a special focus on the
          developmental challenges of Bihar and the Gangetic Plain.
        </p>

        <h2>Objectives</h2>
        <p>
          The Centre aims to produce cutting-edge planning solutions for the myriad
          obstacles that Bihar has to overcome in its developmental journey. Key
          objectives include advancing knowledge through research in spatial sciences,
          building capacity in GIS and Remote Sensing, and providing quality
          postgraduate education in geography.
        </p>

        <h2>Vision</h2>
        <p>
          The Centre envisions becoming a numero uno in the disciplinary field of
          Geographical research, especially incorporating the very latest in satellite
          imagery, Geographic Information Systems (GIS), and Remote Sensing. The
          Centre was born out of the vision of the Chief Minister of Bihar to give
          geography its rightful place in guiding state-level planning and policy.
        </p>

        <h2>Mission</h2>

        <h3>• Teaching and Training</h3>
        <p>
          Providing rigorous postgraduate and doctoral programmes (M.A./M.Sc.
          Geography, M.Sc. GIS and Remote Sensing, PG Diploma, Certificate, and
          Ph.D.) under the Choice Based Credit System (CBCS) adopted from the common
          ordinance of Bihar Universities.
        </p>

        <h3>• Research Excellence</h3>
        <p>
          Encouraging original research on applied geographical topics including land
          use and land cover change, urban planning, disaster management, watershed
          analysis, and rural development, with special reference to the state of Bihar.
        </p>

        <h3>• Spatial Technology Capacity Building</h3>
        <p>
          Training students and professionals in modern geospatial tools including
          ArcGIS, QGIS, Remote Sensing software, and GPS data collection, aligning
          skills with national and international industry standards.
        </p>

        <h3>• Collaboration with Government and Industry</h3>
        <p>
          Working closely with the Bihar Government departments, the Survey of India,
          NRSC, ISRO, and other agencies to ensure that research outputs translate
          directly into actionable policies and development programmes.
        </p>

        <h3>• Public Outreach and Knowledge Dissemination</h3>
        <p>
          Organising seminars, workshops, field camps, and extension programmes to
          spread geographic literacy among students, teachers, and policymakers
          across Bihar and the broader Eastern India region.
        </p>

      </div>
    </div>
  );
}

export default AimAndObjective;
