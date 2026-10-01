import React from 'react';
import { Link } from 'react-router-dom';

const InsuranceBanner = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Glasses Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#D4F1F4] via-[#E8F8F5] to-[#D0E8F2] rounded-3xl p-8 flex items-center justify-center min-h-[340px] shadow-sm border border-teal-100">
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
              alt="Prescription Glasses with Insurance"
              className="w-full max-w-[340px] h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right Text Content & Insurance Logos */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Purchasing with insurance, made easy.
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                This is our promise to you. We accept most vision insurance plans, both in and out-of-network.
              </p>
            </div>

            {/* Insurance Provider Logos */}
            <div className="flex flex-wrap items-center gap-6 py-3 border-y border-gray-100">
              <span className="font-extrabold text-lg tracking-tighter text-gray-900">eyeMed</span>
              <span className="font-bold text-sm tracking-tight text-gray-800">SuperiorVision™</span>
              <span className="font-bold text-sm tracking-tight text-gray-800">DavisVision™</span>
              <span className="font-extrabold text-base tracking-widest text-gray-900 bg-gray-100 px-2 py-0.5 rounded">NVA®</span>
            </div>

            {/* Dual Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop?sort=popular"
                className="px-8 py-3.5 bg-[#5B649E] hover:bg-[#4A5288] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
              >
                SHOP WITH INSURANCE
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white hover:bg-gray-50 text-[#5B649E] border-2 border-[#5B649E] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
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
