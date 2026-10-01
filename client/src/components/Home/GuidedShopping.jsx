import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCompass, FiSliders, FiFileText, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const steps = [
  {
    step: '01',
    icon: <FiCompass className="w-6 h-6 text-[#DFFF00]" />,
    title: 'Choose Your Frame',
    description: 'Explore hundreds of prescription frames and luxury designer sunglasses engineered for ergonomics.',
    link: '/shop',
    actionText: 'Browse Frames',
  },
  {
    step: '02',
    icon: <FiSliders className="w-6 h-6 text-[#DFFF00]" />,
    title: 'Customize Your Lenses',
    description: 'Select from Single Vision, Progressive, Blue Light filtering, or light-adaptive Transitions lenses.',
    link: '/shop?search=Blue+Light',
    actionText: 'Explore Lenses',
  },
  {
    step: '03',
    icon: <FiFileText className="w-6 h-6 text-[#DFFF00]" />,
    title: 'Add Your Prescription',
    description: 'Upload your eye doctor doctor prescription or enter values manually. We handle PD measurements.',
    link: '/about',
    actionText: 'Prescription Guide',
  },
  {
    step: '04',
    icon: <FiShoppingBag className="w-6 h-6 text-[#DFFF00]" />,
    title: 'Complete Your Purchase',
    description: 'Enjoy free fast shipping, 30-day hassle-free returns, and full optical warranty protection.',
    link: '/checkout',
    actionText: 'Shop Safely',
  },
];

const GuidedShopping = () => {
  return (
    <section className="bg-[#0B0B0B] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#292929]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#DFFF00]">
            Guided Optical Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            FIND YOUR PERFECT PAIR
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Shopping for prescription eyewear made seamless in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#141414] border border-[#292929] hover:border-[#DFFF00]/50 rounded-2xl p-6 relative group transition-all duration-300 flex flex-col justify-between"
            >
              {/* Step Number Tag */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black text-[#DFFF00]/40 group-hover:text-[#DFFF00] transition-colors">
                  {item.step}
                </span>
                <div className="p-3 bg-[#0B0B0B] border border-[#292929] rounded-xl">
                  {item.icon}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white group-hover:text-[#DFFF00] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#292929]">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-300 group-hover:text-[#DFFF00] transition-colors"
                >
                  {item.actionText} <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidedShopping;
