import React from 'react';
import { FiTruck, FiRotateCcw, FiShield, FiPackage, FiHeadphones } from 'react-icons/fi';

const trustItems = [
  { icon: <FiPackage className="w-5 h-5 text-teal-600" />, title: 'Free shipping over ৳2,000' },
  { icon: <FiTruck className="w-5 h-5 text-teal-600" />, title: '24hr Dhaka Express Delivery' },
  { icon: <FiRotateCcw className="w-5 h-5 text-teal-600" />, title: '14-Day Free Exchange' },
  { icon: <FiShield className="w-5 h-5 text-teal-600" />, title: '1-Year Frame Warranty' },
  { icon: <FiHeadphones className="w-5 h-5 text-teal-600" />, title: 'Doctor Optical Support' },
];

const TrustFooterBar = () => {
  return (
    <section className="bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {trustItems.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-xs hover:border-teal-400 transition-colors">
              <div className="p-2.5 bg-teal-50 rounded-full border border-teal-100">
                {item.icon}
              </div>
              <span className="text-xs font-extrabold text-slate-900">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustFooterBar;

