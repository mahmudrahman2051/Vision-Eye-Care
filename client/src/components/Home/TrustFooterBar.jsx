import React from 'react';
import { FiTruck, FiRotateCcw, FiShield, FiPackage, FiHeadphones } from 'react-icons/fi';

const trustItems = [
  { icon: <FiPackage className="w-6 h-6 text-gray-800" />, title: 'Free shipping & returns' },
  { icon: <FiTruck className="w-6 h-6 text-gray-800" />, title: 'Fast delivery available' },
  { icon: <FiRotateCcw className="w-6 h-6 text-gray-800" />, title: '30-day money back' },
  { icon: <FiShield className="w-6 h-6 text-gray-800" />, title: '2-year optical warranty' },
  { icon: <FiHeadphones className="w-6 h-6 text-gray-800" />, title: 'Licensed support' },
];

const TrustFooterBar = () => {
  return (
    <section className="bg-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {trustItems.map((item, idx) => (
            <div key={idx} className="bg-[#FFF8F6] border border-orange-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-gray-900">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustFooterBar;
