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
    <section className="bg-[#F8F9FA] py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our lenses
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Explore lens options designed to bring you clear vision and lasting comfort, all tailored to your vision needs.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Preview Image */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] rounded-3xl p-6 overflow-hidden flex items-center justify-center min-h-[380px] shadow-sm">
            <img
              src={currentLens.image}
              alt={currentLens.title}
              className="w-full max-w-[400px] h-[300px] object-cover rounded-2xl shadow-xl transition-all duration-500"
            />
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-6 space-y-4">
            {lensItems.map((item) => {
              const isOpen = activeId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveId(isOpen ? '' : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-base text-gray-900 hover:text-[#5B649E] transition-colors"
                  >
                    <span>{item.title}</span>
                    <span className="p-1 rounded-full border border-gray-300 text-gray-600">
                      {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 space-y-4 animate-fadeIn">
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {item.content}
                      </p>
                      <Link
                        to={item.link}
                        className="inline-block px-6 py-2.5 bg-[#5B649E] hover:bg-[#4A5288] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
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
