import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCheckCircle, FiShield, FiAward, FiTruck, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Our Story & Craftsmanship
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1A1A]">
            Redefining Eyewear with Precision, Clarity & Architectural Elegance.
          </h1>
          <p className="text-sm text-[#666] leading-relaxed">
            Founded with a vision to bring world-class optical engineering and contemporary frame design to Bangladesh, VISION EYE CARE Atelier merges state-of-the-art Japanese CNC manufacturing with bespoke ocular customization.
          </p>
        </div>

        {/* Brand Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-[#F5EFE3] text-[#8B7355] rounded-xl flex items-center justify-center text-xl">
              <FiEye />
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Zero-Distortion Optical Lenses</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Every prescription lens is surface-milled with sub-micron computerized edging and coated with 16-layer hydrophobic, anti-reflective, and Blue-Light filtering nanocoatings.
            </p>
          </div>

          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-[#F5EFE3] text-[#8B7355] rounded-xl flex items-center justify-center text-xl">
              <FiShield />
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Grade-5 Aerospace Titanium</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Our frames utilize hypoallergenic Japanese titanium and hand-buffed Italian cellulose acetate, ensuring featherlight comfort without compromising structural rigidity.
            </p>
          </div>

          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-[#F5EFE3] text-[#8B7355] rounded-xl flex items-center justify-center text-xl">
              <FiAward />
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Bespoke Anatomical Fit</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              Engineered with ergonomic nose pads and balanced weight distribution designed specifically for comfortable, pinch-free day-long wear.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white border border-[#E8DFD0] rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="space-y-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">
              Dhaka Atelier & Lab
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] leading-snug">
              Every Frame Tells A Story of Meticulous Perfection.
            </h2>
            <p className="text-xs text-[#666] leading-relaxed">
              Located in Banani, Dhaka, our optical fitting laboratory inspects every curve, hinge tension, and optical focal point before dispatch. Whether you need single-vision reading glasses, digital blue-light protectors, or progressive bifocals, each pair is custom-fitted to your exact pupillary distance.
            </p>
            <div className="space-y-2 text-xs font-bold text-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[#8B7355]" /> Certified Master Opticians
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[#8B7355]" /> 1-Year Comprehensive Frame Warranty
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[#8B7355]" /> 7-Day Hassle-Free Lens Exchange Guarantee
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[#E8DFD0] h-80 bg-[#1A1A1A]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop&q=80"
              alt="VISION EYE CARE Eyewear Craft"
              className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#1A1A1A] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Experience VISION EYE CARE Today</h2>
          <p className="text-xs text-[#AAA] max-w-md mx-auto">
            Discover our curated collection of luxury optical frames and designer sunglasses, crafted for discerning eyes.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-[#8B7355] hover:bg-[#7A6348] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md"
            >
              Shop The Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
