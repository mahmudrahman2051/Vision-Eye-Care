import React, { useState, useEffect, useCallback } from 'react';

const banners = [
  { id: 1, src: '/hero_banner_1.png', alt: 'Premium Eyewear Collection' },
  { id: 2, src: '/hero_banner_2.png', alt: 'Designer Sunglasses' },
  { id: 3, src: '/hero_banner_3.png', alt: 'Fashionable Frames' },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-[#F5EFE3]" id="hero-section">
      {/* Banner Container */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] md:aspect-[21/7]">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-md backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-md backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? 'w-7 h-2.5 bg-[#1A1A1A]'
                : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
