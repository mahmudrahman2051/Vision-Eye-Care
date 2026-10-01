import React from 'react';
import { Link } from 'react-router-dom';
import { FiCompass, FiSliders, FiFileText, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const steps = [
  {
    step: '01',
    icon: <FiCompass className="w-6 h-6 text-black" />,
    title: 'Choose Your Frame',
    description: 'Explore hundreds of prescription frames and luxury designer sunglasses engineered for ergonomics.',
    link: '/shop',
    actionText: 'Browse Frames',
  },
  {
    step: '02',
    icon: <FiSliders className="w-6 h-6 text-black" />,
    title: 'Customize Your Lenses',
    description: 'Select from Single Vision, Progressive, Blue Light filtering, or light-adaptive Transitions lenses.',
    link: '/shop?search=Blue+Light',
    actionText: 'Explore Lenses',
  },
  {
    step: '03',
    icon: <FiFileText className="w-6 h-6 text-black" />,
    title: 'Add Your Prescription',
    description: 'Upload your eye doctor prescription or enter values manually. We handle PD measurements.',
    link: '/about',
    actionText: 'Prescription Guide',
  },
  {
    step: '04',
    icon: <FiShoppingBag className="w-6 h-6 text-black" />,
    title: 'Complete Your Order',
    description: 'Enjoy free fast shipping, 30-day hassle-free returns, and full optical warranty protection.',
    link: '/checkout',
    actionText: 'Shop Safely',
  },
];

const GuidedShopping = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#DFFF00] px-3 py-1 rounded">
            Guided Optical Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight pt-2">
            FIND YOUR PERFECT PAIR
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Shopping for prescription eyewear made seamless in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F8F9FA] border border-gray-200 hover:border-black rounded-2xl p-6 relative group transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black text-gray-300 group-hover:text-black transition-colors">
                  {item.step}
                </span>
                <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  {item.icon}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-black group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-200">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:underline"
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
