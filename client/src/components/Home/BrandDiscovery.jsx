import React from 'react';
import { Link } from 'react-router-dom';

const brands = [
  { name: 'RAY-BAN', link: '/shop?search=Ray-Ban' },
  { name: 'OAKLEY', link: '/shop?search=Oakley' },
  { name: 'PRADA', link: '/shop?search=Prada' },
  { name: 'MICHAEL KORS', link: '/shop?search=Michael+Kors' },
  { name: 'VOGUE', link: '/shop?search=Vogue' },
  { name: 'PERSOL', link: '/shop?search=Persol' },
  { name: 'GUCCI', link: '/shop?search=Gucci' },
  { name: 'TOM FORD', link: '/shop?search=Tom+Ford' },
];

const BrandDiscovery = () => {
  return (
    <section className="bg-[#F8F9FA] py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-gray-500">
            Authorized Retailer
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1">
            SHOP PREMIUM BRANDS
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {brands.map((b, idx) => (
            <Link
              key={idx}
              to={b.link}
              className="py-5 px-3 bg-white border border-gray-200 hover:border-black rounded-xl flex items-center justify-center font-black tracking-widest text-gray-800 hover:text-black hover:bg-[#F4F4F4] transition-all text-xs uppercase shadow-sm"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandDiscovery;
