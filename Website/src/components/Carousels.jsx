/**
 * Carousels.jsx  –  CGS
 *
 * Same structure as akuastrono Carousels.jsx.
 * Images are CGS campus / activity photos hosted at
 * https://akucgs.vercel.app (shared CDN) or referenced
 * as public-folder paths (/images/...).
 *
 * Replace the src values below once you host the CGS
 * images at your own domain / public folder.
 */

import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../Styles/Carousel.css';
import { getSlider, fileUrl } from '../api/cmsApi';

// ── Fallback slides ──────────────────────────────────────
// Shown while loading, or if the CMS "Slider" module has no
// active slides yet / the backend is unreachable.
const fallbackSlides = [
  { src: 'https://akucgs.vercel.app/images/CGS_Entrance.JPG', alt: 'CGS Campus Entrance' },
  { src: 'https://akucgs.vercel.app/images/achievements.jpeg', alt: 'CGS Achievements' },
  { src: 'https://akucgs.vercel.app/images/newSlide.jpg', alt: 'CGS Activities' },
  { src: 'https://akucgs.vercel.app/images/20210308_145608.jpg', alt: 'CGS Events' },
  { src: 'https://akucgs.vercel.app/images/20210308_145734.jpg', alt: 'CGS Field Work' },
  { src: 'https://akucgs.vercel.app/images/newimage.jpg', alt: 'CGS Seminar' },
];

const Carousels = () => {
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    getSlider().then((items) => {
      if (items && items.length > 0) {
        setSlides(
          items.map((s) => ({
            src: fileUrl(s.imagePath),
            alt: s.title || 'CGS Slide',
            linkUrl: s.linkUrl,
          }))
        );
      }
    });
  }, []);

  return (
    <Carousel
      showArrows={true}
      showStatus={false}
      showIndicators={false}
      showThumbs={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={5000}
      stopOnHover={true}
      swipeable={true}
      dynamicHeight={true}
    >
      {slides.map((slide, index) =>
        slide.linkUrl ? (
          <a key={index} href={slide.linkUrl}>
            <img src={slide.src} alt={slide.alt} />
          </a>
        ) : (
          <div key={index}>
            <img src={slide.src} alt={slide.alt} />
          </div>
        )
      )}
    </Carousel>
  );
};

export default Carousels;
