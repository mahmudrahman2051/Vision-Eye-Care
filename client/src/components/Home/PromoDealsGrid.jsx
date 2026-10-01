import React from 'react';
import { Link } from 'react-router-dom';

const PromoDealsGrid = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-black tracking-tight">
          Discover top deals and extra ways to save
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Meta AI Glasses */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-6 relative group min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80"
              alt="Meta AI Glasses"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="relative z-10 mt-auto text-center space-y-3">
              <h3 className="text-xl font-bold text-white">RAY-BAN & OAKLEY META AI</h3>
              <p className="text-xs text-gray-200 font-medium">Iconic styles with smart audio and camera technology.</p>
              <Link
                to="/shop?search=AI+Glasses"
                className="inline-block px-6 py-2.5 bg-white hover:bg-gray-100 text-black border border-gray-300 font-bold text-xs uppercase rounded-full transition-all shadow"
              >
                SHOP META AI GLASSES
              </Link>
            </div>
          </div>

          {/* Card 2: Insurance Deal (Mint Cyan) */}
          <div className="bg-gradient-to-b from-[#E2F5F4] to-[#C8ECEB] border border-teal-200 rounded-3xl p-6 flex flex-col justify-between relative group min-h-[420px] shadow-sm">
            <div className="relative z-10 text-center space-y-2 pt-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800">Vision Benefits</span>
              <h3 className="text-xl font-extrabold text-teal-950">ALL SAVINGS: UP TO 50% OFF</h3>
              <p className="text-xs text-teal-800 font-medium">Use insurance or FSA/HSA on prescription lenses with promo code NEWVISION at checkout.</p>
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
                className="inline-block px-6 py-2.5 bg-white hover:bg-gray-50 text-teal-900 border border-teal-300 font-bold text-xs uppercase rounded-full transition-all shadow"
              >
                SHOP WITH INSURANCE
              </Link>
            </div>
          </div>

          {/* Card 3: Transitions Lenses Model */}
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-6 relative group min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
              alt="Transitions Lenses"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="relative z-10 mt-auto text-center space-y-3">
              <h3 className="text-2xl font-black text-white italic tracking-wider">Transitions®</h3>
              <p className="text-xs text-gray-200 font-medium uppercase tracking-widest">MOVE FREELY IN ANY LIGHT</p>
              <Link
                to="/shop?search=Transitions"
                className="inline-block px-8 py-2.5 bg-white hover:bg-gray-100 text-black font-bold text-xs uppercase rounded-full transition-all shadow"
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
