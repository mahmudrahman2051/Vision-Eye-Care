import React from 'react';
import { Link } from 'react-router-dom';

const InsuranceBanner = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Glasses Card */}
          <div className="lg:col-span-5 bg-[#FEFCE8] rounded-3xl p-8 flex items-center justify-center min-h-[340px] shadow-sm border-2 border-[#FEF08A]">
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
              alt="Prescription Glasses with Insurance"
              className="w-full max-w-[340px] h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right Text Content & Insurance Logos */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#DFFF00] text-black font-black text-xs uppercase tracking-widest rounded border border-black/10">
                FSA / HSA & INSURANCE ELIGIBLE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
                Purchasing with insurance, made easy.
              </h2>
              <p className="text-sm text-gray-700 font-medium">
                This is our promise to you. We accept most vision insurance plans, both in and out-of-network.
              </p>
            </div>

            {/* Insurance Provider Logos */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-200">
              <span className="font-black text-xl tracking-tighter text-black">eyeMed</span>
              <span className="font-extrabold text-sm tracking-tight text-gray-900">SuperiorVision™</span>
              <span className="font-extrabold text-sm tracking-tight text-gray-900">DavisVision™</span>
              <span className="font-black text-xs tracking-widest text-black bg-[#FEF9C3] border border-amber-300 px-3 py-1 rounded">NVA®</span>
            </div>

            {/* Dual Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop?sort=popular"
                className="px-8 py-3.5 bg-[#050505] hover:bg-gray-800 text-[#DFFF00] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                SHOP WITH INSURANCE
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white hover:bg-gray-50 text-black border-2 border-black font-black text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceBanner;
