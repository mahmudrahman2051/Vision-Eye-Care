import React from 'react';
import { Link } from 'react-router-dom';

const PromoDealsGrid = () => {
  return (
    <section className="bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Title */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-100 px-3 py-1 rounded-full">
            UNMISSABLE SAVINGS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
            Special BD Packages & Deals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Gold Membership Offer */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group min-h-[380px] shadow-xl">
            <div className="space-y-3 relative z-10">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-xs">
                VISION GOLD VIP 🌟
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-amber-300">
                BUY 1 GET 1 FREE FOR 1 YEAR
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Join Gold Membership for only ৳500/yr and get a free second frame on every optical purchase all year long!
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                to="/shop?sort=popular"
                className="inline-block px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                JOIN GOLD MEMBERSHIP
              </Link>
            </div>
          </div>

          {/* Card 2: Blue-Cut Digital Protection */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group min-h-[380px] shadow-sm hover:shadow-xl transition-all">
            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 font-extrabold text-[10px] uppercase tracking-wider rounded-full">
                SCREEN SHIELD 💻
              </span>
              <h3 className="text-2xl font-black text-slate-900 uppercase pt-1">
                BLUE-CUT LENSES AT ৳1,450
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Zero-power or prescription anti-glare lenses designed for programmers, students, and long screen hours.
              </p>
            </div>

            <div className="my-auto py-4 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80"
                alt="Blue Cut Glasses"
                className="w-44 h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="relative z-10 text-center">
              <Link
                to="/shop?search=Blue+Light"
                className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                EXPLORE BLUE-CUT
              </Link>
            </div>
          </div>

          {/* Card 3: Photochromic / Transitions */}
          <div className="bg-gradient-to-br from-teal-900 to-slate-900 border border-teal-800 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group min-h-[380px] shadow-xl">
            <div className="space-y-3 relative z-10">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-blue-400/30">
                SUN ADAPTIVE ☀️
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                TRANSITIONS® SUN LENSES
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Lenses that automatically darken outdoors under Bangladesh sunlight and stay clear indoors!
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                to="/shop?search=Transitions"
                className="inline-block px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                SHOP TRANSITIONS
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PromoDealsGrid;

