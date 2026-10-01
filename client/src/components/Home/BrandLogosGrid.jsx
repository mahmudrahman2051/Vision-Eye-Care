import React from 'react';
import { Link } from 'react-router-dom';

const brands = [
  { name: 'Ray-Ban', style: 'font-serif italic font-black text-2xl', link: '/shop?search=Ray-Ban' },
  { name: 'OAKLEY', style: 'font-mono font-black tracking-tighter text-xl', link: '/shop?search=Oakley' },
  { name: 'MICHAEL KORS', style: 'font-sans font-black tracking-widest text-sm', link: '/shop?search=Michael+Kors' },
  { name: 'A|X ARMANI', style: 'font-serif font-bold tracking-widest text-sm', link: '/shop?search=Armani' },
  { name: 'BURBERRY', style: 'font-sans font-black tracking-widest text-sm', link: '/shop?search=Burberry' },
  { name: 'vogue eyewear', style: 'font-sans font-light tracking-widest text-sm lowercase', link: '/shop?search=Vogue' },
];

const BrandLogosGrid = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto text-center space-y-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Enjoy our premium brands
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
          {brands.map((b, idx) => (
            <Link
              key={idx}
              to={b.link}
              className={`text-gray-900 hover:text-yellow-600 hover:scale-105 transition-all duration-200 ${b.style}`}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogosGrid;
