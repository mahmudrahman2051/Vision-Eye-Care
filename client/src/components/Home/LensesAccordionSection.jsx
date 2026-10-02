import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';

const lensItems = [
  {
    id: 'blue-violet',
    title: 'Blue-Cut Screen Protection Lenses',
    content: 'Filters high-energy blue-violet light emitted by laptops, smartphones, and LED TVs. Essential for software engineers, students, and long screen hours.',
    buttonText: 'SHOP BLUE LIGHT LENSES',
    link: '/shop?search=Blue+Light',
    image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'transitions',
    title: 'Transitions® Sun-Adaptive Lenses',
    content: 'Lenses that automatically darken under Bangladesh outdoor sunlight and return to crystal clear transparency indoors.',
    buttonText: 'SHOP TRANSITIONS® LENSES',
    link: '/shop?search=Transitions',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'progressive',
    title: 'Progressive Multi-Focal Lenses',
    content: 'No visible bifocal lines! Seamless transition between distance, computer screen, and reading vision for seniors and professionals.',
    buttonText: 'SHOP PROGRESSIVE LENSES',
    link: '/shop?search=Progressive',
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
];

const LensesAccordionSection = () => {
  const [activeId, setActiveId] = useState('blue-violet');

  const currentLens = lensItems.find((l) => l.id === activeId) || lensItems[0];

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 font-extrabold text-[11px] uppercase tracking-widest rounded-full">
            ADVANCED OPTICAL TECHNOLOGY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Certified Lens Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Engineered with anti-glare, anti-scratch & UV400 protective coatings for optical perfection.
          </p>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Preview Image */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 overflow-hidden flex items-center justify-center min-h-[380px] border border-slate-200/80 shadow-sm">
            <img
              src={currentLens.image}
              alt={currentLens.title}
              className="w-full max-w-[400px] h-[300px] object-cover rounded-2xl shadow-md border border-slate-100 transition-all duration-500"
            />
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-6 space-y-3">
            {lensItems.map((item) => {
              const isOpen = activeId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-xs ${
                    isOpen ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setActiveId(isOpen ? '' : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-extrabold text-sm sm:text-base text-slate-900 hover:text-teal-600 transition-colors"
                  >
                    <span>{item.title}</span>
                    <span className={`p-1.5 rounded-full border ${isOpen ? 'bg-teal-600 border-teal-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                      {isOpen ? <FiMinus className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 space-y-4 animate-fadeIn border-t border-slate-100">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {item.content}
                      </p>
                      <Link
                        to={item.link}
                        className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
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

