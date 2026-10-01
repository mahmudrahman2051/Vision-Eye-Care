import React from 'react';
import { FiTruck, FiRotateCcw, FiShield, FiHeadphones } from 'react-icons/fi';

const trustItems = [
  {
    icon: <FiTruck className="w-6 h-6 text-[#DFFF00]" />,
    title: 'Fast Delivery',
    desc: 'Nationwide expedited shipping on all prescription orders.',
  },
  {
    icon: <FiRotateCcw className="w-6 h-6 text-[#DFFF00]" />,
    title: '30-Day Easy Returns',
    desc: 'Hassle-free optical fit trial & money-back guarantee.',
  },
  {
    icon: <FiShield className="w-6 h-6 text-[#DFFF00]" />,
    title: '100% Authentic Guarantee',
    desc: 'Original designer frames & genuine optical materials.',
  },
  {
    icon: <FiHeadphones className="w-6 h-6 text-[#DFFF00]" />,
    title: 'Licensed Support',
    desc: 'Chat directly with expert opticians for prescription guidance.',
  },
];

const TrustBar = () => {
  return (
    <section className="bg-[#0B0B0B] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#292929]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-[#141414] border border-[#292929]">
              <div className="p-3 bg-[#050505] rounded-xl border border-[#292929] flex-shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
