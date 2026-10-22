import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../services/bannerService';

const DEFAULT_BANNER = {
  image: '/promo_banner.png',
  alt: 'Vision Eye Care Special Eyewear Offer',
  link: '/shop?sort=featured',
};

const CategoryPromoBanner = () => {
  const [banner, setBanner] = useState(DEFAULT_BANNER);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await bannerService.getBanners();
        if (data?.categoryPromoBanner && isMounted) {
          setBanner(data.categoryPromoBanner);
        }
      } catch (err) {}
    }
    load();

    const handleUpdate = (e) => {
      if (e.detail?.categoryPromoBanner) {
        setBanner(e.detail.categoryPromoBanner);
      }
    };
    window.addEventListener('banners-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('banners-updated', handleUpdate);
    };
  }, []);

  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <Link to={banner.link || '/shop'} className="block relative group overflow-hidden">
          <img
            src={banner.image}
            alt={banner.alt || 'Promotional Banner'}
            className="w-full h-auto max-h-[360px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/hero_banner_1.png';
            }}
          />
        </Link>
      </div>
    </section>
  );
};

export default CategoryPromoBanner;
