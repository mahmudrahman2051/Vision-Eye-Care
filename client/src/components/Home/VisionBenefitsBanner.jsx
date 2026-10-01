import React from 'react';
import { Link } from 'react-router-dom';
import { FiCreditCard, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const VisionBenefitsBanner = () => {
  return (
    <section className="bg-gradient-to-r from-[#0B0B0B] via-[#141414] to-[#0B0B0B] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#292929] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center lg:text-left max-w-2xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#171717] text-[#DFFF00] text-xs font-extrabold uppercase tracking-widest rounded-md border border-[#292929]">
            <FiCreditCard className="w-3.5 h-3.5" /> FSA / HSA & Vision Insurance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            USE YOUR VISION BENEFITS
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Did you know prescription glasses, sunglasses, and contact lenses are eligible FSA/HSA expenses? Check your available benefits before choosing your eyewear.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300 font-semibold pt-2">
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#DFFF00]" /> FSA / HSA Accepted</span>
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#DFFF00]" /> Itemized Optical Receipts</span>
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#DFFF00]" /> Out-of-Network Claims</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Link
            to="/about"
            className="px-8 py-4 bg-[#DFFF00] hover:bg-[#cbe600] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl hover:shadow-[#DFFF00]/20 flex items-center gap-2"
          >
            Check Benefits <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VisionBenefitsBanner;
