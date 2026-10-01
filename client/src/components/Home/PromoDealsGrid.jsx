import React from 'react';
import { Link } from 'react-router-dom';

const PromoDealsGrid = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-2xl sm:text-4xl font-black text-center text-gray-900 uppercase tracking-tight">
          Discover top deals and extra ways to save
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Meta AI Glasses */}
          <div className="bg-[#FEFCE8] border-2 border-[#DFFF00] rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between p-8 relative group min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
              alt="Meta AI Glasses"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FEFCE8] via-[#FEFCE8]/60 to-transparent"></div>

            <div className="relative z-10 mt-auto text-center space-y-3">
              <span className="inline-block px-3 py-1 bg-[#DFFF00] text-gray-900 font-black text-[10px] uppercase tracking-widest rounded border border-yellow-400">
                AI SMART EYEWEAR
              </span>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">RAY-BAN & OAKLEY META AI</h3>
              <p className="text-xs text-gray-700 font-bold">Iconic styles with smart audio and camera technology.</p>
              <Link
                to="/shop?search=AI+Glasses"
                className="inline-block px-6 py-3 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-yellow-500"
              >
                SHOP META AI GLASSES
              </Link>
            </div>
          </div>

          {/* Card 2: Insurance Deal */}
          <div className="bg-yellow-50 border-2 border-[#DFFF00] rounded-3xl p-8 flex flex-col justify-between relative group min-h-[420px] shadow-sm">
            <div className="relative z-10 text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-widest bg-[#DFFF00] text-gray-900 px-3 py-1 rounded border border-yellow-400">
                Vision Benefits
              </span>
              <h3 className="text-2xl font-black text-gray-900 uppercase pt-2">ALL SAVINGS: UP TO 50% OFF</h3>
              <p className="text-xs text-gray-700 font-bold leading-relaxed">
                Use insurance or FSA/HSA on prescription lenses with promo code NEWVISION at checkout.
              </p>
            </div>

            <div className="my-auto py-6 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80"
                alt="Floating Glasses"
                className="w-48 h-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 text-center">
              <Link
                to="/shop?sort=popular"
                className="inline-block px-8 py-3 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-yellow-500"
              >
                SHOP WITH INSURANCE
              </Link>
            </div>
          </div>

          {/* Card 3: Transitions Lenses Model */}
          <div className="bg-[#FEFCE8] rounded-3xl border-2 border-[#DFFF00] overflow-hidden shadow-lg flex flex-col justify-between p-8 relative group min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
              alt="Transitions Lenses"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FEFCE8] via-[#FEFCE8]/60 to-transparent"></div>

            <div className="relative z-10 mt-auto text-center space-y-3">
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-wider">Transitions®</h3>
              <p className="text-xs text-yellow-800 font-black uppercase tracking-widest">MOVE FREELY IN ANY LIGHT</p>
              <Link
                to="/shop?search=Transitions"
                className="inline-block px-8 py-3 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-yellow-500"
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
