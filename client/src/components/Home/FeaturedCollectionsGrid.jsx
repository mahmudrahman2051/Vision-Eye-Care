import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../services/bannerService';

const DEFAULT_COLLECTIONS = [
  {
    id: 'computer-glasses',
    title: 'Computer Glasses',
    tagline: 'Zero Power Blu-Cut',
    badge: 'MUST HAVE',
    dotColor: 'bg-white',
    link: '/shop?search=computer',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'polarized-shades',
    title: 'Polarized Shades',
    tagline: '100% UV Protection',
    badge: 'POPULAR',
    dotColor: 'bg-white',
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'progressive-lenses',
    title: 'Progressive Vision',
    tagline: 'Multi-Focal Comfort',
    badge: 'PREMIUM',
    dotColor: 'bg-white',
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'acetate-frames',
    title: 'Acetate Frames',
    tagline: 'Handcrafted Minimal',
    badge: 'TRENDING',
    dotColor: 'bg-white',
    link: '/shop?search=acetate',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'contact-lenses',
    title: 'Contact Lenses',
    tagline: 'Daily & Monthly',
    badge: 'ESSENTIAL',
    dotColor: 'bg-white',
    link: '/shop?search=Contact+Lenses',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'kids-eyewear',
    title: 'Kids Eyewear',
    tagline: 'Flexible & Safe',
    badge: 'NEW',
    dotColor: 'bg-white',
    link: '/shop?gender=kids',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
];

const FeaturedCollectionsGrid = () => {
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await bannerService.getBanners();
        if (data?.featuredCollections && Array.isArray(data.featuredCollections) && isMounted) {
          setCollections(data.featuredCollections);
        }
      } catch (err) {}
    }
    load();

    const handleUpdate = (e) => {
      if (e.detail?.featuredCollections && Array.isArray(e.detail.featuredCollections)) {
        setCollections(e.detail.featuredCollections);
      }
    };
    window.addEventListener('banners-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('banners-updated', handleUpdate);
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold text-black tracking-tight uppercase">
            Curated Collections
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-400 font-medium tracking-widest uppercase mt-1.5">
            EXPLORE BY STYLE & VISION NEEDS
          </p>
        </div>

        {/* 6 Square Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative aspect-square overflow-hidden border border-neutral-200 hover:border-black transition-all duration-300 block bg-neutral-100"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* High Contrast Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-300" />

              {/* Minimalist Top Badge */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-bold bg-black text-white tracking-widest uppercase">
                  {item.badge}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex flex-col justify-end">
                <p className="text-[9px] sm:text-[10px] font-medium text-neutral-300 uppercase tracking-widest mb-0.5">
                  {item.tagline}
                </p>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {item.title}
                </h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white group-hover:underline flex items-center gap-1 uppercase tracking-wider">
                    Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
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
