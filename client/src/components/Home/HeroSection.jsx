import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white text-gray-800 py-12 lg:py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center">
          {/* Left Text Content */}
          <div className="md:col-span-6 flex flex-col justify-center text-left">
            {/* Top Insurance Tag */}
            <div className="mb-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEFCE8] text-gray-800 border border-[#FEF08A] hover:bg-[#DFFF00] text-xs font-bold transition-all shadow-xs"
              >
                <FiShield className="w-4 h-4 text-gray-700" />
                <span>You can pay with insurance</span>
                <FiChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                Find Your New Fall Look And Save:
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight uppercase">
                Up to 50% off <br />
                <span className="inline-block bg-[#DFFF00] px-3.5 py-1 rounded-xl border border-[#CBE600] mt-1 shadow-xs">
                  Frames & Lenses*
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium leading-relaxed pt-1">
                Including Ray-Ban, Oakley, Versace & more. Including branded lenses. Get as low as 0% APR when you pay with Klarna.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                to="/shop?sort=popular"
                className="px-7 py-3.5 bg-[#DFFF00] hover:bg-[#CBE600] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 border border-[#CBE600]"
              >
                SHOP THE DEAL <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="px-7 py-3.5 bg-white hover:bg-[#FEFCE8] text-gray-800 border-2 border-[#DFFF00] font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
              >
                EXPLORE FRAMES
              </Link>
            </div>
          </div>

          {/* Right Side Model Images */}
          <div className="md:col-span-6 grid grid-cols-2 gap-3 items-center max-w-md mx-auto md:max-w-none">
            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100 aspect-[3/4] max-h-[380px]">
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80"
                alt="Man wearing designer sunglasses"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-gray-100 aspect-[3/4] max-h-[380px]">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
                alt="Woman wearing black optical glasses"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
