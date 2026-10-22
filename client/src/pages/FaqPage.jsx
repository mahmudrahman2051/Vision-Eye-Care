import React, { useState } from 'react';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    category: 'Prescription & Lenses',
    items: [
      {
        q: 'How do I submit my prescription for customized glasses?',
        a: 'You can upload a photo of your doctor’s prescription directly on the product detail page, or enter your Sphere (SPH), Cylinder (CYL), Axis, and Pupillary Distance (PD) values manually during customization.',
      },
      {
        q: 'What is Blue-Light blocking technology and do I need it?',
        a: 'Our Blue-Light filters block up to 95% of harmful 400-450nm wavelength digital radiation emitted by smartphone and computer monitors, reducing eye fatigue, dryness, and sleep disruptions.',
      },
      {
        q: 'Can you fit progressive or bifocal lenses in all frames?',
        a: 'Most of our optical and sunglasses frames support single-vision, bifocal, and progressive lenses. A minimum lens vertical height of 28mm is recommended for progressive clarity.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'How fast is delivery inside Bangladesh?',
        a: 'For orders within Dhaka city, delivery takes 24 to 48 hours. For nationwide delivery across all other districts, delivery typically takes 2 to 4 business days via registered express courier.',
      },
      {
        q: 'Is Cash on Delivery (COD) available everywhere in Bangladesh?',
        a: 'Yes, we provide Cash on Delivery across all 64 districts of Bangladesh. You can inspect the package upon arrival and hand payment directly to the delivery rider.',
      },
      {
        q: 'What are the delivery charges?',
        a: 'We offer FREE delivery nationwide on orders of ৳5,000 or above. For orders under ৳5,000, a flat nominal delivery fee of ৳100 is applied.',
      },
    ],
  },
  {
    category: 'Returns, Warranty & Fitting',
    items: [
      {
        q: 'What if the frames do not fit my face comfortably?',
        a: 'We offer a 7-day hassle-free exchange policy. If the frame size or bridge width does not suit your face contours, return it in original condition and we will exchange it for any other frame of your choice.',
      },
      {
        q: 'Do you offer a warranty on frames and lenses?',
        a: 'Yes, all Drishti frames come with a 1-year manufacturing defect warranty covering hinges, metal plating, and structural joints. Lenses feature a 6-month anti-scratch and anti-reflective coating warranty.',
      },
    ],
  },
];

export default function FaqPage() {
  const [openItem, setOpenItem] = useState('0-0');

  const toggleItem = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#666] leading-relaxed">
            Everything you need to know about ordering glasses, optical lens prescriptions, delivery across Bangladesh, and warranty guarantees.
          </p>
        </div>

        {/* FAQ Accordion Groups */}
        <div className="space-y-8">
          {FAQ_DATA.map((group, groupIdx) => (
            <div key={group.category} className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#8B7355] px-1">
                {group.category}
              </h2>

              <div className="space-y-2.5">
                {group.items.map((item, itemIdx) => {
                  const key = `${groupIdx}-${itemIdx}`;
                  const isOpen = openItem === key;

                  return (
                    <div
                      key={item.q}
                      className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-xs transition-all"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#1A1A1A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <FiHelpCircle className="text-[#8B7355] flex-shrink-0" />
                          {item.q}
                        </span>
                        <FiChevronDown
                          className={`w-4 h-4 text-[#8B7355] transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-[#666] leading-relaxed border-t border-[#F5EFE3]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="bg-white border border-[#E8DFD0] rounded-3xl p-8 text-center space-y-3">
          <h3 className="text-base font-extrabold text-[#1A1A1A]">Still have questions?</h3>
          <p className="text-xs text-[#666] max-w-sm mx-auto">
            Our optical customer support team is available 7 days a week to guide you through your frame selection.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-block px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
            >
              Contact Our Specialists
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
