import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiUploadCloud } from 'react-icons/fi';
import { HiOutlineHome } from 'react-icons/hi2';

const InsuranceBanner = () => {
  return (
    <section className="bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Frame Visual Showcase */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-slate-800 to-slate-700/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[340px] shadow-2xl border border-slate-700/80 relative">
            <span className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
              <HiOutlineHome className="w-3.5 h-3.5" /> DHAKA DOORSTEP VISIT
            </span>

            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80"
              alt="Home Eye Checkup in Dhaka"
              className="w-full max-w-[320px] h-auto object-contain rounded-2xl shadow-lg border border-slate-600/50"
            />

            <div className="mt-4 text-center">
              <p className="text-xs font-bold text-amber-300">100+ Frames Brought to Your Doorstep</p>
              <p className="text-[11px] text-slate-400">Available across all areas in Dhaka City</p>
            </div>
          </div>

          {/* Right Text Content & Booking Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 font-extrabold text-xs uppercase tracking-widest rounded-full border border-teal-500/30">
                BANGLADESH SPECIAL SERVICE 🇧🇩
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
                FREE HOME EYE TEST & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                  FRAME TRY-ON IN DHAKA
                </span>
              </h2>
              <p className="text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
                Why step out in traffic? Our certified optometrist visits your home or office with computerized eye test equipment and 100+ top frames to try on!
              </p>
            </div>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-teal-400 w-4 h-4 flex-shrink-0" />
                <span>Certified Optometrist Home Visit</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-teal-400 w-4 h-4 flex-shrink-0" />
                <span>Computerized 12-Point Eye Checkup</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-teal-400 w-4 h-4 flex-shrink-0" />
                <span>Try 100+ Best-selling Optical Frames</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-teal-400 w-4 h-4 flex-shrink-0" />
                <span>Instant Doctor Prescription & Order</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/about"
                className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <FiCalendar className="w-4 h-4" /> BOOK HOME EYE TEST
              </Link>
              <Link
                to="/about"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all backdrop-blur flex items-center gap-2"
              >
                <FiUploadCloud className="w-4 h-4 text-amber-400" /> UPLOAD PRESCRIPTION
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InsuranceBanner;

