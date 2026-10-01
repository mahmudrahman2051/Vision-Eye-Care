import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';

const lensItems = [
  {
    id: 'transitions',
    title: 'Transitions®',
    content: 'They quickly darken in sunlight and fade back to clear indoors: protecting you from UV rays and filtering blue-violet light. Available in prescription and non-prescription glasses.',
    buttonText: 'SHOP TRANSITIONS® LENSES',
    link: '/shop?search=Transitions',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'blue-violet',
    title: 'Blue-violet light lenses',
    content: 'Filter harmful high-energy blue-violet light emitted by digital screens and smartphones while maximizing visual sharpness.',
    buttonText: 'SHOP BLUE LIGHT LENSES',
    link: '/shop?search=Blue+Light',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'prescription-sun',
    title: 'Prescription sun',
    content: 'Custom optical prescription combined with polarized UV400 sun protection to eliminate outdoor glare and reflections.',
    buttonText: 'SHOP PRESCRIPTION SUN',
    link: '/shop?search=Prescription+Sun',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
];

const LensesAccordionSection = () => {
  const [activeId, setActiveId] = useState('transitions');

  const currentLens = lensItems.find((l) => l.id === activeId) || lensItems[0];

  return (
    <section className="bg-[#F9FAFB] py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 bg-[#DFFF00] text-black font-black text-xs uppercase tracking-widest rounded border border-black/10">
            ADVANCED OPTICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#050505] uppercase tracking-tight">
            Our lenses
          </h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Explore lens options designed to bring you clear vision and lasting comfort, all tailored to your vision needs.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Preview Image */}
          <div className="lg:col-span-6 bg-[#FEFCE8] rounded-3xl p-6 overflow-hidden flex items-center justify-center min-h-[380px] border-2 border-[#FEF08A] shadow-sm">
            <img
              src={currentLens.image}
              alt={currentLens.title}
              className="w-full max-w-[400px] h-[300px] object-cover rounded-2xl shadow-xl border-4 border-white transition-all duration-500"
            />
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-6 space-y-4">
            {lensItems.map((item) => {
              const isOpen = activeId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${
                    isOpen ? 'border-black ring-2 ring-black/5' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setActiveId(isOpen ? '' : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-black text-base text-black hover:text-gray-700 transition-colors"
                  >
                    <span>{item.title}</span>
                    <span className={`p-1.5 rounded-full border text-black ${isOpen ? 'bg-[#DFFF00] border-black' : 'bg-gray-100 border-gray-300'}`}>
                      {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 space-y-4 animate-fadeIn border-t border-gray-100">
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        {item.content}
                      </p>
                      <Link
                        to={item.link}
                        className="inline-block px-6 py-3 bg-[#050505] hover:bg-gray-800 text-[#DFFF00] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow"
                      >
                        {item.buttonText}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LensesAccordionSection;
