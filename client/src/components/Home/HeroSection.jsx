import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRotateCcw } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative bg-[#050505] text-white overflow-hidden py-20 lg:py-32 border-b border-[#292929]">
      {/* Editorial Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1600&auto=format&fit=crop&q=80"
          alt="Vision Eye Care Hero"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#292929] text-xs font-bold uppercase tracking-widest text-[#DFFF00]">
            <span className="w-2 h-2 rounded-full bg-[#DFFF00] animate-ping"></span>
            Spring / Summer 2026 Collection
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase text-white">
            SEE THE <br />
            <span className="text-[#DFFF00]">DIFFERENCE.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
            Premium eyewear designed around your style, comfort, and everyday vision. Hand-crafted frames with anti-reflective optical clarity.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              to="/shop?category=eyeglasses"
              className="w-full sm:w-auto px-8 py-4 bg-[#DFFF00] hover:bg-[#cbe600] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl hover:shadow-[#DFFF00]/20 flex items-center justify-center gap-2 group"
            >
              Shop Eyeglasses <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/shop?category=sunglasses"
              className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-[#1F1F1F] text-white border border-[#292929] hover:border-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              Shop Sunglasses <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 grid grid-cols-3 gap-4 border-t border-[#292929]/80 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <FiTruck className="w-4 h-4 text-[#DFFF00]" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="w-4 h-4 text-[#DFFF00]" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <FiRotateCcw className="w-4 h-4 text-[#DFFF00]" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
