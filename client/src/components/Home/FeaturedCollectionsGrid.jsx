import React from 'react';
import { Link } from 'react-router-dom';

const collections = [
  {
    id: 'computer-glasses',
    title: 'Computer Glasses',
    tagline: 'Zero Power Blu Cut',
    badge: 'MUST HAVE',
    link: '/shop?search=computer',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'polarized-shades',
    title: 'Polarized Shades',
    tagline: '100% UV Protection',
    badge: 'POPULAR',
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'progressive-lenses',
    title: 'Progressive Vision',
    tagline: 'Multi-focal Comfort',
    badge: 'PREMIUM',
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'acetate-frames',
    title: 'Acetate Frames',
    tagline: 'Handcrafted Style',
    badge: 'TRENDING',
    link: '/shop?search=acetate',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'contact-lenses',
    title: 'Contact Lenses',
    tagline: 'Daily & Monthly',
    badge: 'ESSENTIAL',
    link: '/shop?search=Contact+Lenses',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'kids-eyewear',
    title: 'Kids Eyewear',
    tagline: 'Flexible & Safe',
    badge: 'NEW',
    link: '/shop?gender=kids',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
];

const FeaturedCollectionsGrid = () => {
  return (
    <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Curated Collections
          </h2>
          <div className="w-12 h-0.5 bg-[#8B7355] mx-auto mt-2.5" />
        </div>

        {/* 6 Square Cards Grid (Min 2 columns on mobile, 6 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#E8DFD0] hover:border-[#8B7355] shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/90 transition-colors" />

              {/* Top Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#1A1A1A] rounded-md tracking-wider">
                  {item.badge}
                </span>
              </div>

              {/* Card Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 z-10 flex flex-col justify-end">
                <p className="text-[9px] sm:text-[10px] font-bold text-[#8B7355] uppercase tracking-wider mb-0.5 group-hover:text-[#D4C9B8] transition-colors">
                  {item.tagline}
                </p>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:translate-x-0.5 transition-transform">
                  {item.title}
                </h3>
                <span className="text-[10px] sm:text-xs font-semibold text-white/80 group-hover:text-white mt-1 flex items-center gap-1 transition-colors">
                  Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionsGrid;
