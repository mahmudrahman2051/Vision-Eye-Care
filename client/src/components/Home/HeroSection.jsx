import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white text-[#050505] py-10 lg:py-16 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Insurance Tag */}
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF9C3] text-black border border-black/20 hover:bg-[#DFFF00] text-xs font-black transition-all shadow-sm"
            >
              <FiShield className="w-4 h-4 text-black" />
              <span>You can pay with insurance</span>
              <FiChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-gray-500">
                Find Your New Fall Look And Save:
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#050505] leading-none tracking-tight uppercase">
                Up to 50% off <br />
                <span className="bg-[#DFFF00] px-2 py-0.5 rounded">Frames & Lenses*</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium leading-relaxed pt-2">
                Including Ray-Ban, Oakley, Versace & more. Including branded lenses. Get as low as 0% APR when you pay with Klarna.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop?sort=popular"
                className="px-8 py-3.5 bg-[#050505] hover:bg-gray-800 text-[#DFFF00] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                SHOP THE DEAL <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-white hover:bg-gray-50 text-black border-2 border-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                EXPLORE FRAMES
              </Link>
            </div>
          </div>

          {/* Right Side Model Images - Strictly Contained */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 items-center">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gray-100 aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80"
                alt="Man wearing designer sunglasses"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl bg-gray-100 aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
                alt="Woman wearing black optical glasses"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
