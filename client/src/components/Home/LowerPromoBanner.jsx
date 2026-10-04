import React from 'react';
import { Link } from 'react-router-dom';

const LowerPromoBanner = () => {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <Link to="/shop?sort=popular" className="block relative group overflow-hidden">
          <img
            src="/lower_banner.png"
            alt="Vision Eye Care Special Bangladesh Offer"
            className="w-full h-auto max-h-[360px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/hero_banner_2.png';
            }}
          />
        </Link>
      </div>
    </section>
  );
};

export default LowerPromoBanner;
