/**
 * Event.jsx  –  CGS (Centre for Geographical Studies)
 *
 * STRUCTURE: Identical to akuastrono Event.jsx
 *   Responsive photo gallery grid.
 *
 * DATA CHANGED:
 *   Images mapped to CGS gallery photos (Picture1-34 + AAC + activities).
 *   All images reference the shared CDN base URL; replace with
 *   your own public-folder paths once you host the CGS build.
 */

import React, { useEffect, useState } from 'react';
import '../Styles/Event.css';
import { getGallery, fileUrl } from '../api/cmsApi';

// CGS event / activity images (from cgs-main/images/) — used as a fallback
// until images are added in the CMS "Gallery" module.
const CGS_CDN = 'https://akucgs.vercel.app/images';

const fallbackImages = [
  { src: `${CGS_CDN}/Picture1.png`,   alt: 'CGS Activity 1' },
  { src: `${CGS_CDN}/Picture2.png`,   alt: 'CGS Activity 2' },
  { src: `${CGS_CDN}/Picture3.png`,   alt: 'CGS Activity 3' },
  { src: `${CGS_CDN}/Picture4.png`,   alt: 'CGS Activity 4' },
  { src: `${CGS_CDN}/Picture5.png`,   alt: 'CGS Activity 5' },
  { src: `${CGS_CDN}/Picture10.jpg`,  alt: 'CGS Event 10' },
  { src: `${CGS_CDN}/Picture11.png`,  alt: 'CGS Event 11' },
  { src: `${CGS_CDN}/Picture12.png`,  alt: 'CGS Event 12' },
  { src: `${CGS_CDN}/Picture13.png`,  alt: 'CGS Event 13' },
  { src: `${CGS_CDN}/Picture14.png`,  alt: 'CGS Event 14' },
  { src: `${CGS_CDN}/Picture15.png`,  alt: 'CGS Event 15' },
  { src: `${CGS_CDN}/Picture16.png`,  alt: 'CGS Event 16' },
  { src: `${CGS_CDN}/Picture17.png`,  alt: 'CGS Event 17' },
  { src: `${CGS_CDN}/Picture18.jpg`,  alt: 'CGS Event 18' },
  { src: `${CGS_CDN}/Picture19.jpg`,  alt: 'CGS Event 19' },
  { src: `${CGS_CDN}/Picture20.jpg`,  alt: 'CGS Event 20' },
  { src: `${CGS_CDN}/Picture21.jpg`,  alt: 'CGS Event 21' },
  { src: `${CGS_CDN}/Picture22.jpg`,  alt: 'CGS Event 22' },
  { src: `${CGS_CDN}/Picture23.jpg`,  alt: 'CGS Event 23' },
  { src: `${CGS_CDN}/Picture24.jpg`,  alt: 'CGS Event 24' },
  { src: `${CGS_CDN}/Picture25.jpg`,  alt: 'CGS Event 25' },
  { src: `${CGS_CDN}/Picture26.jpg`,  alt: 'CGS Event 26' },
  { src: `${CGS_CDN}/Picture27.jpg`,  alt: 'CGS Event 27' },
  { src: `${CGS_CDN}/Picture28.jpg`,  alt: 'CGS Event 28' },
  { src: `${CGS_CDN}/Picture29.jpg`,  alt: 'CGS Event 29' },
  { src: `${CGS_CDN}/Picture30.jpg`,  alt: 'CGS Event 30' },
  { src: `${CGS_CDN}/Picture31.jpg`,  alt: 'CGS Event 31' },
  { src: `${CGS_CDN}/Picture32.jpg`,  alt: 'CGS Event 32' },
  { src: `${CGS_CDN}/Picture33.jpg`,  alt: 'CGS Event 33' },
  { src: `${CGS_CDN}/Picture34.jpg`,  alt: 'CGS Event 34' },
  { src: `${CGS_CDN}/achievements.jpeg`,  alt: 'CGS Achievements' },
  { src: `${CGS_CDN}/achievements3.png`,  alt: 'CGS Achievements 3' },
  { src: `${CGS_CDN}/20210308_145608.jpg`,alt: 'CGS Campus 2021' },
  { src: `${CGS_CDN}/20210308_145734.jpg`,alt: 'CGS Campus 2021 (2)' },
];

function Event() {
  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    getGallery().then((items) => {
      if (items && items.length > 0) {
        setImages(items.map((g) => ({ src: fileUrl(g.imagePath), alt: g.title })));
      }
    });
  }, []);

  return (
    <>
      <h2 className="gallery-section-title">Events &amp; Activities Gallery</h2>
      <div className="gallery-grid">
        {images.map((img, index) => (
          <div className="gallery-item" key={index}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>
    </>
  );
}

export default Event;
