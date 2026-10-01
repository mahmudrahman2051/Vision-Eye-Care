import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const cards = [
  {
    title: 'New Arrivals',
    subtitle: 'Meet the latest precision frames.',
    ctaText: 'SHOP NEW',
    link: '/shop?sort=newest',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80',
    tag: 'SPRING 2026',
  },
  {
    title: 'Designer Collection',
    subtitle: 'Iconic styles, modern optical vision.',
    ctaText: 'EXPLORE BRANDS',
    link: '/shop?search=Designer',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    tag: 'LUXURY BRANDS',
  },
  {
    title: 'Lens Technology',
    subtitle: 'Choose lenses built for your digital lifestyle.',
    ctaText: 'EXPLORE LENSES',
    link: '/shop?search=Blue+Light',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80',
    tag: 'ADVANCED OPTICS',
  },
];

const PromoCampaignCards = () => {
  return (
    <section className="bg-[#050505] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#292929]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group relative bg-[#0B0B0B] border border-[#292929] hover:border-[#DFFF00]/60 rounded-2xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-8 transition-all duration-500 shadow-2xl"
            >
              {/* Image */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 filter brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 space-y-3">
                <span className="inline-block px-2.5 py-1 bg-[#171717]/80 text-[#DFFF00] border border-[#DFFF00]/30 rounded text-[10px] font-extrabold uppercase tracking-widest">
                  {card.tag}
                </span>

                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  {card.title}
                </h3>

                <p className="text-xs text-gray-300 font-medium line-clamp-2">
                  {card.subtitle}
                </p>

                <Link
                  to={card.link}
                  className="inline-flex items-center gap-2 pt-2 text-xs font-extrabold uppercase tracking-widest text-[#DFFF00] group-hover:translate-x-1 transition-transform"
                >
                  {card.ctaText} <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCampaignCards;
