import React from 'react';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 'computer-glasses',
    title: 'Computer Glasses',
    tagline: 'Zero Power Blu-Cut',
    badge: 'MUST HAVE',
    dotColor: 'bg-emerald-500',
    link: '/shop?search=computer',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'polarized-shades',
    title: 'Polarized Shades',
    tagline: '100% UV Protection',
    badge: 'POPULAR',
    dotColor: 'bg-amber-500',
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'progressive-lenses',
    title: 'Progressive Vision',
    tagline: 'Multi-Focal Comfort',
    badge: 'PREMIUM',
    dotColor: 'bg-indigo-500',
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'acetate-frames',
    title: 'Acetate Frames',
    tagline: 'Italian Handcrafted',
    badge: 'TRENDING',
    dotColor: 'bg-rose-500',
    link: '/shop?search=acetate',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'contact-lenses',
    title: 'Contact Lenses',
    tagline: 'Daily & Monthly',
    badge: 'ESSENTIAL',
    dotColor: 'bg-sky-500',
    link: '/shop?search=Contact+Lenses',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'kids-eyewear',
    title: 'Kids Eyewear',
    tagline: 'Flexible & Safe',
    badge: 'NEW',
    dotColor: 'bg-violet-500',
    link: '/shop?gender=kids',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
];

const FeaturedCollectionsGrid = () => {
  return (
    <section className="py-10 sm:py-14 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#F5EFE3]/20 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-7 sm:mb-10">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#8B7355] block mb-1">
            Curated Styles & Vision Care
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Explore By Style & Needs
          </h2>
          <div className="w-12 h-0.5 bg-[#8B7355] mx-auto mt-2.5 rounded-full" />
        </div>

        {/* 6 Square Cards Grid (Min 2 columns on mobile, 3 on tablet, 6 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8DFD0] hover:border-[#8B7355] shadow-sm hover:shadow-2xl transition-all duration-500 block bg-[#F5EFE3]/20"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Enhanced Contrast Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 group-hover:from-black/95 transition-colors duration-300" />

              {/* Glassmorphic Top Badge */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold bg-white/95 backdrop-blur-md text-[#1A1A1A] rounded-full shadow-sm tracking-wider uppercase">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`} />
                  {item.badge}
                </span>
              </div>

              {/* Card Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 flex flex-col justify-end">
                <p className="text-[10px] sm:text-[11px] font-bold text-[#E6C894] uppercase tracking-wider mb-0.5 drop-shadow-xs">
                  {item.tagline}
                </p>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight drop-shadow-sm group-hover:translate-x-0.5 transition-transform duration-300">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-semibold text-white/90 group-hover:text-white flex items-center gap-1 transition-colors">
                    Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#8B7355] transition-all duration-300">
                    <svg
                      className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionsGrid;

