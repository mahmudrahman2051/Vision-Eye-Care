import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    tag: 'BANGLADESH OPTICAL INNOVATION 👓',
    title: 'TRANSITIONS® LIGHT-ADAPTING LENSES',
    subtitle: 'Lenses that automatically darken under Bangladeshi sunlight & turn crystal clear indoors.',
    highlight: 'Starts at ৳2,200 (Frame + Prescription Lens)',
    link: '/shop?search=Transitions',
    btnText: 'GET TRANSITIONS LENSES',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&auto=format&fit=crop&q=80',
    features: ['100% UV Protection', 'Scratch Resistant', 'Available for all frames'],
  },
  {
    id: 2,
    tag: 'STUDENT & PROFESSIONAL DISCOUNT 🎒',
    title: 'ANTI-BLUE LIGHT GLASSES FOR COMPUTER USERS',
    subtitle: 'Reduce eye strain, headaches & insomnia caused by long screen sessions at work or study.',
    highlight: 'Complete Glasses from ৳1,450',
    link: '/shop?search=Blue+Light',
    btnText: 'ORDER BLUE LIGHT GLASSES',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop&q=80',
    features: ['Blocks 99% harmful blue ray', 'Ultra lightweight frames', 'No prescription needed'],
  },
  {
    id: 3,
    tag: 'LUXURY EYEWEAR BANGLADESH 👑',
    title: '100% AUTHENTIC RAY-BAN & OAKLEY FRAMES',
    subtitle: 'Shop original global designer eyewear with official warranty and free adjustment in Bangladesh.',
    highlight: 'Official Warranty Included',
    link: '/shop?search=Ray-Ban',
    btnText: 'EXPLORE DESIGNER BRANDS',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1000&auto=format&fit=crop&q=80',
    features: ['Serial Number Verified', 'Original Case & Cloth', 'Free Shipping Across BD'],
  },
];

const FeatureSliderBannerTwo = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[activeTab];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner Section Title */}
        <div className="text-center space-y-2">
          <span className="inline-block px-3.5 py-1 bg-[#DFFF00] text-gray-900 font-black text-xs uppercase tracking-widest rounded border border-yellow-400">
            PREMIUM OPTICAL SOLUTIONS IN BD
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Specialized Lens & Frame Collections
          </h2>
        </div>

        {/* Tab Navigation Header */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-b border-yellow-200 pb-4">
          {slides.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
                activeTab === idx
                  ? 'bg-[#DFFF00] text-gray-900 border-yellow-500 shadow-sm'
                  : 'bg-yellow-50 text-gray-700 border-yellow-200 hover:bg-yellow-100'
              }`}
            >
              {item.tag.split(' ')[0]} {item.tag.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Slider Box */}
        <div className="relative bg-[#FEFCE8] border-2 border-[#DFFF00] rounded-3xl overflow-hidden shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block px-3 py-1 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded border border-yellow-400 shadow-xs">
                {slide.tag}
              </span>

              <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase leading-snug">
                {slide.title}
              </h3>

              <p className="text-sm text-gray-700 font-bold leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Feature Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {slide.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs font-black text-gray-900 bg-white p-2.5 rounded-xl border border-yellow-300">
                    <FiCheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to={slide.link}
                  className="px-8 py-3.5 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-yellow-500"
                >
                  {slide.btnText}
                </Link>
                <span className="text-xs font-black text-yellow-900 bg-yellow-100 border border-yellow-400 px-4 py-3 rounded-xl">
                  {slide.highlight}
                </span>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-[360px] h-[280px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSliderBannerTwo;
