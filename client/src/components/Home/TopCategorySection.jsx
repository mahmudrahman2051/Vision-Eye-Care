import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'glasses',
    name: "Men's Eyeglasses",
    link: '/shop?category=eyeglasses',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sunglasses',
    name: "Men's Sunglasses",
    link: '/shop?category=sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'womens-glasses',
    name: "Women's Eyeglasses",
    link: '/shop?gender=women',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'womens-sunglasses',
    name: "Women's Sunglasses",
    link: '/shop?category=sunglasses&gender=women',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'contact-lenses',
    name: 'Contact Lenses',
    link: '/shop?search=Contact+Lenses',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
  },
];

const TopCategorySection = () => {
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold text-black tracking-tight uppercase">
            Shop By Category
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-400 font-medium tracking-widest uppercase mt-1.5">
            FIND YOUR PERFECT FRAME
          </p>
        </div>

        {/* Category Lifestyle Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.link}
              className="group flex flex-col items-center text-center"
            >
              {/* Lifestyle Photo Card */}
              <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden relative border border-neutral-200 group-hover:border-black transition-colors duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Minimalist Editorial Label with Arrow */}
              <div className="mt-3.5 flex items-center justify-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-bold text-black uppercase tracking-wider group-hover:underline">
                  {cat.name}
                </span>
                <span className="text-xs text-black group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategorySection;
