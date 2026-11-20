import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../services/bannerService';

const DEFAULT_BANNERS = [
  { id: 1, src: '/hero_banner_1.png', alt: 'Premium Eyewear Collection', ctaLink: '/shop' },
  { id: 2, src: '/hero_banner_2.png', alt: 'Designer Sunglasses', ctaLink: '/shop?category=sunglasses' },
  { id: 3, src: '/hero_banner_3.png', alt: 'Fashionable Frames', ctaLink: '/contact' },
];

const HeroSection = () => {
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [intervalMs, setIntervalMs] = useState(5000);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await bannerService.getBanners();
        if (data && isMounted) {
          if (Array.isArray(data.heroBanners) && data.heroBanners.length > 0) {
            setBanners(data.heroBanners);
          }
          if (data.heroInterval) {
            setIntervalMs(data.heroInterval);
          }
        }
      } catch (err) {}
    }
    load();

    const handleUpdate = (e) => {
      if (e.detail?.heroBanners && Array.isArray(e.detail.heroBanners)) {
        setBanners(e.detail.heroBanners);
      }
      if (e.detail?.heroInterval) {
        setIntervalMs(e.detail.heroInterval);
      }
    };
    window.addEventListener('banners-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('banners-updated', handleUpdate);
    };
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % (banners.length || 1));
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % (banners.length || 1));
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, intervalMs || 5000);
    return () => clearInterval(timer);
  }, [next, intervalMs]);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-900" id="hero-section">
      {/* Banner Container */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7]">
        {banners.map((banner, idx) => (
          <div
            key={banner.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {banner.ctaLink ? (
              <Link to={banner.ctaLink} className="block w-full h-full">
                <img
                  src={banner.src}
                  alt={banner.alt || 'Banner'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                />
              </Link>
            ) : (
              <img
                src={banner.src}
                alt={banner.alt || 'Banner'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot / Dash Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 cursor-pointer ${
              idx === current
                ? 'w-6 h-1 bg-white'
                : 'w-2 h-1 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
