import React from 'react';
import { Link } from 'react-router-dom';

const InsuranceBanner = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Glasses Card */}
          <div className="lg:col-span-5 bg-[#FEFCE8] rounded-3xl p-8 flex items-center justify-center min-h-[340px] shadow-sm border-2 border-[#DFFF00]">
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
              alt="Prescription Glasses with Insurance"
              className="w-full max-w-[340px] h-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Right Text Content & Insurance Logos */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-[#DFFF00] text-gray-900 font-black text-xs uppercase tracking-widest rounded border border-yellow-400">
                FSA / HSA & INSURANCE ELIGIBLE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                Purchasing with insurance, made easy.
              </h2>
              <p className="text-sm text-gray-700 font-bold">
                This is our promise to you. We accept most vision insurance plans, both in and out-of-network.
              </p>
            </div>

            {/* Insurance Provider Logos */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-yellow-200">
              <span className="font-black text-xl tracking-tighter text-gray-900">eyeMed</span>
              <span className="font-extrabold text-sm tracking-tight text-gray-800">SuperiorVision™</span>
              <span className="font-extrabold text-sm tracking-tight text-gray-800">DavisVision™</span>
              <span className="font-black text-xs tracking-widest text-gray-900 bg-[#DFFF00] border border-yellow-400 px-3 py-1 rounded">NVA®</span>
            </div>

            {/* Dual Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop?sort=popular"
                className="px-8 py-3.5 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md border border-yellow-500"
              >
                SHOP WITH INSURANCE
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-yellow-50 hover:bg-yellow-100 text-gray-900 border-2 border-[#DFFF00] font-black text-xs uppercase tracking-wider rounded-xl transition-all"
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
