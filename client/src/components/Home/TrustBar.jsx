import React from 'react';
import { FiTruck, FiRotateCcw, FiShield, FiHeadphones } from 'react-icons/fi';

const trustItems = [
  {
    icon: <FiTruck className="w-6 h-6 text-black" />,
    title: 'Fast Delivery',
    desc: 'Nationwide expedited shipping on all prescription orders.',
  },
  {
    icon: <FiRotateCcw className="w-6 h-6 text-black" />,
    title: '30-Day Easy Returns',
    desc: 'Hassle-free optical fit trial & money-back guarantee.',
  },
  {
    icon: <FiShield className="w-6 h-6 text-black" />,
    title: '100% Authentic Guarantee',
    desc: 'Original designer frames & genuine optical materials.',
  },
  {
    icon: <FiHeadphones className="w-6 h-6 text-black" />,
    title: 'Licensed Support',
    desc: 'Chat directly with expert opticians for prescription guidance.',
  },
];

const TrustBar = () => {
  return (
    <section className="bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
              <div className="p-3 bg-[#DFFF00] rounded-xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-black uppercase tracking-tight">{item.title}</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
