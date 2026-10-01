import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const categories = [
  {
    name: 'Everyday Essentials',
    desc: 'Lightweight frames built for daily comfort',
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    gridSpan: 'col-span-1 md:col-span-2',
  },
  {
    name: 'Designer Favorites',
    desc: 'Iconic luxury silhouettes from top fashion houses',
    link: '/shop?search=Designer',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    gridSpan: 'col-span-1',
  },
  {
    name: 'Sunglasses Collection',
    desc: 'UV400 & Polarized outdoor protection',
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    gridSpan: 'col-span-1',
  },
  {
    name: 'Sport-Ready Eyewear',
    desc: 'Impact resistant frames for high performance',
    link: '/shop?search=Sport',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    gridSpan: 'col-span-1 md:col-span-2',
  },
];

const CategoryDiscoveryGrid = () => {
  return (
    <section className="bg-[#050505] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#292929]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#DFFF00]">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
              DISCOVER BY CATEGORY
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#DFFF00] hover:underline flex items-center gap-1"
          >
            Explore All Categories <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className={`group relative bg-[#0B0B0B] border border-[#292929] hover:border-[#DFFF00] rounded-2xl overflow-hidden min-h-[280px] p-8 flex flex-col justify-end transition-all duration-500 shadow-xl ${cat.gridSpan}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-50 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#DFFF00] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 font-medium">{cat.desc}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#DFFF00] group-hover:translate-x-1 transition-transform">
                    Shop Category <FiArrowRight className="w-3.5 h-3.5" />
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

export default CategoryDiscoveryGrid;
