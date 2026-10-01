import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const lensOptions = [
  {
    title: 'Blue Light Filtering',
    desc: 'Reduces digital eye strain from smartphones, laptops, and LED screens while improving visual comfort.',
    features: ['Reduces glare', 'Blocks 420nm blue spectrum', 'Ideal for computer work'],
    link: '/shop?search=Blue+Light',
    tag: 'DIGITAL WORK',
  },
  {
    title: 'Transitions® Lenses',
    desc: 'Seamlessly adapt from clear indoors to dark sunglasses outdoors depending on UV light intensity.',
    features: ['Auto light adjustment', '100% UVA/UVB protection', 'All-day versatility'],
    link: '/shop?search=Transitions',
    tag: 'ADAPTIVE OPTICS',
  },
  {
    title: 'Prescription Sun Lenses',
    desc: 'Combines your custom optical prescription with polarized sun filters for maximum outdoor clarity.',
    features: ['Polarized contrast', 'Eliminates blinding glare', 'UV400 max shield'],
    link: '/shop?search=Prescription+Sun',
    tag: 'OUTDOOR SHIELD',
  },
  {
    title: 'Anti-Reflective Premium',
    desc: 'Ultra-thin high-index lenses coated with hydrophobic and anti-scratch protective layers.',
    features: ['Super hydrophobic', 'Anti-smudge coating', 'Crystal clear photo look'],
    link: '/shop?search=Anti+Reflective',
    tag: 'ESSENTIAL CLARITY',
  },
];

const LensEducation = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#111827] bg-[#DFFF00] px-3 py-1 rounded">
            Advanced Lens Technology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight pt-2">
            LENSES FOR YOUR LIFESTYLE
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Tailor your optical lenses to your daily vision habits and screen time needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lensOptions.map((lens, idx) => (
            <div
              key={idx}
              className="bg-[#F8F9FA] border border-gray-200 hover:border-black rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm"
            >
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded border border-gray-200 shadow-sm">
                  {lens.tag}
                </span>

                <h3 className="text-xl font-extrabold text-black">{lens.title}</h3>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">{lens.desc}</p>

                <ul className="space-y-2 pt-2 border-t border-gray-200">
                  {lens.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-gray-800 font-medium">
                      <FiCheck className="text-emerald-600 w-3.5 h-3.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <Link
                  to={lens.link}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black hover:underline"
                >
                  Learn More <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LensEducation;
