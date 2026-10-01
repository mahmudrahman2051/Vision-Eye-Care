import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiChevronRight } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#6B3418] via-[#A85C32] to-[#D98E5B] text-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Insurance Tag */}
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D8F3F5] text-[#006070] hover:bg-white text-xs font-bold transition-all shadow"
            >
              <FiShield className="w-4 h-4 text-[#006070]" />
              <span>You can pay with insurance</span>
              <FiChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Main Header */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-semibold text-gray-200 tracking-wide">
                Find Your New Fall Look And Save:
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Up to 50% off <br />
                Frames & Lenses*
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 max-w-md font-medium leading-relaxed">
                Including Versace, Burberry & more. Including branded lenses. Get as low as 0% APR when you pay with Klarna.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                to="/shop?sort=popular"
                className="inline-block px-8 py-3.5 bg-[#5B649E] hover:bg-[#4A5288] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                SHOP THE DEAL
              </Link>
            </div>
          </div>

          {/* Right Model Photography (Screenshot 1) */}
          <div className="lg:col-span-6 flex items-end justify-center lg:justify-end gap-2 relative mt-6 lg:mt-0">
            <div className="relative w-1/2 max-w-[280px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80"
                alt="Man wearing designer sunglasses"
                className="w-full h-[320px] sm:h-[400px] object-cover object-top"
              />
            </div>
            <div className="relative w-1/2 max-w-[280px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 -translate-y-4">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
                alt="Woman wearing black optical glasses"
                className="w-full h-[320px] sm:h-[400px] object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
