import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const MegaMenu = ({ activeMenu, onClose }) => {
  if (!activeMenu) return null;

  const eyeglassesContent = {
    shopBy: [
      { label: "Women's Eyeglasses", to: '/shop?category=eyeglasses&gender=women' },
      { label: "Men's Eyeglasses", to: '/shop?category=eyeglasses&gender=men' },
      { label: 'Kids Eyeglasses', to: '/shop?category=eyeglasses&gender=kids' },
      { label: 'Unisex Frames', to: '/shop?category=eyeglasses&gender=unisex' },
      { label: 'New Arrivals', to: '/shop?category=eyeglasses&sort=newest' },
      { label: 'Best Sellers', to: '/shop?category=eyeglasses&sort=popular' },
    ],
    shapes: [
      { label: 'Aviator', to: '/shop?frame_shape=Aviator' },
      { label: 'Rectangle', to: '/shop?frame_shape=Rectangle' },
      { label: 'Round', to: '/shop?frame_shape=Round' },
      { label: 'Square', to: '/shop?frame_shape=Square' },
      { label: 'Cat Eye', to: '/shop?frame_shape=Cat+Eye' },
      { label: 'Browline', to: '/shop?frame_shape=Browline' },
    ],
    features: [
      { label: 'Blue Light Lenses', to: '/shop?search=Blue+Light' },
      { label: 'Lightweight Frames', to: '/shop?search=Lightweight' },
      { label: 'Titanium Eyewear', to: '/shop?search=Titanium' },
      { label: 'Designer Eyewear', to: '/shop?search=Designer' },
      { label: 'Prescription Ready', to: '/shop?search=Prescription' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    featuredTitle: 'New Season Frames',
    featuredSub: 'Ergonomic titanium designs with antireflective optical lenses.',
    featuredLink: '/shop?category=eyeglasses',
  };

  const sunglassesContent = {
    shopBy: [
      { label: "Women's Sunglasses", to: '/shop?category=sunglasses&gender=women' },
      { label: "Men's Sunglasses", to: '/shop?category=sunglasses&gender=men' },
      { label: 'Unisex Sunglasses', to: '/shop?category=sunglasses&gender=unisex' },
      { label: 'Polarized Sunglasses', to: '/shop?search=Polarized' },
      { label: 'New Arrivals', to: '/shop?category=sunglasses&sort=newest' },
    ],
    shapes: [
      { label: 'Aviator Classics', to: '/shop?category=sunglasses&frame_shape=Aviator' },
      { label: 'Round Retro', to: '/shop?category=sunglasses&frame_shape=Round' },
      { label: 'Square Modern', to: '/shop?category=sunglasses&frame_shape=Square' },
      { label: 'Cat Eye Glamour', to: '/shop?category=sunglasses&frame_shape=Cat+Eye' },
    ],
    features: [
      { label: 'UV400 Protection', to: '/shop?search=UV400' },
      { label: 'Prescription Sun', to: '/shop?search=Prescription+Sun' },
      { label: 'Gradient Tint Lenses', to: '/shop?search=Gradient' },
      { label: 'Mirrored Lenses', to: '/shop?search=Mirrored' },
    ],
    featuredImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    featuredTitle: 'Polarized Collection',
    featuredSub: 'Maximum UV protection with crystal clear contrast technology.',
    featuredLink: '/shop?category=sunglasses',
  };

  const contentMap = {
    eyeglasses: eyeglassesContent,
    sunglasses: sunglassesContent,
  };

  const current = contentMap[activeMenu];
  if (!current) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-[#0B0B0B] border-b border-[#292929] shadow-2xl py-8 px-6 z-40 animate-fadeIn"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Shop By */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#DFFF00] mb-4">
            Shop By
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {current.shopBy.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Shop By Shape */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#DFFF00] mb-4">
            Shop By Shape
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {current.shapes.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Shop By Feature */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#DFFF00] mb-4">
            Special Features
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            {current.features.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Editorial Card */}
        <div className="relative group overflow-hidden rounded-xl border border-[#292929] bg-[#141414] aspect-[4/3]">
          <img
            src={current.featuredImage}
            alt={current.featuredTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
            <h5 className="text-base font-extrabold text-white mb-1">{current.featuredTitle}</h5>
            <p className="text-xs text-gray-300 line-clamp-2 mb-3">{current.featuredSub}</p>
            <Link
              to={current.featuredLink}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#DFFF00] hover:underline"
            >
              Shop Collection <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
