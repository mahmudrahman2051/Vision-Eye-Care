import React from 'react';
import { Link } from 'react-router-dom';

const PromoDealsGrid = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-2xl sm:text-4xl font-black text-center text-[#050505] uppercase tracking-tight">
          Discover top deals and extra ways to save
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Meta AI Glasses */}
          <div className="bg-[#050505] border border-black rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between p-8 relative group min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
              alt="Meta AI Glasses"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="relative z-10 mt-auto text-center space-y-3">
              <span className="inline-block px-3 py-1 bg-[#DFFF00] text-black font-black text-[10px] uppercase tracking-widest rounded">
                AI SMART EYEWEAR
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">RAY-BAN & OAKLEY META AI</h3>
              <p className="text-xs text-gray-200 font-medium">Iconic styles with smart audio and camera technology.</p>
              <Link
                to="/shop?search=AI+Glasses"
                className="inline-block px-6 py-3 bg-[#DFFF00] hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                SHOP META AI GLASSES
              </Link>
            </div>
          </div>

          {/* Card 2: Insurance Deal (Light Yellow) */}
          <div className="bg-[#FEFCE8] border-2 border-[#FEF08A] rounded-3xl p-8 flex flex-col justify-between relative group min-h-[420px] shadow-sm">
            <div className="relative z-10 text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-widest bg-black text-[#DFFF00] px-3 py-1 rounded">
                Vision Benefits
              </span>
              <h3 className="text-2xl font-black text-[#050505] uppercase pt-2">ALL SAVINGS: UP TO 50% OFF</h3>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">
                Use insurance or FSA/HSA on prescription lenses with promo code NEWVISION at checkout.
              </p>
            </div>

            <div className="my-auto py-6 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80"
                alt="Floating Glasses"
                className="w-48 h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 text-center">
              <Link
                to="/shop?sort=popular"
                className="inline-block px-8 py-3 bg-[#050505] hover:bg-gray-800 text-[#DFFF00] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                SHOP WITH INSURANCE
              </Link>
            </div>
          </div>

          {/* Card 3: Transitions Lenses Model */}
          <div className="bg-[#050505] rounded-3xl border border-black overflow-hidden shadow-lg flex flex-col justify-between p-8 relative group min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
              alt="Transitions Lenses"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-60 filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            <div className="relative z-10 mt-auto text-center space-y-3">
              <h3 className="text-3xl font-black text-white uppercase tracking-wider">Transitions®</h3>
              <p className="text-xs text-[#DFFF00] font-black uppercase tracking-widest">MOVE FREELY IN ANY LIGHT</p>
              <Link
                to="/shop?search=Transitions"
                className="inline-block px-8 py-3 bg-white hover:bg-gray-100 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoDealsGrid;
