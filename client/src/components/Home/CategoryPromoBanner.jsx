import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../services/bannerService';

const DEFAULT_BANNER = {
  image: '/promo_banner.png',
  alt: 'Vision Eye Care Special Eyewear Offer',
  link: '/shop?sort=featured',
  enabled: true,
};

const CategoryPromoBanner = () => {
  const [banner, setBanner] = useState(DEFAULT_BANNER);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await bannerService.getBanners();
        if (isMounted && data) {
          if (Array.isArray(data.promoBanners)) {
            const active = data.promoBanners.filter((b) => b.enabled !== false && b.image);
            setBanner(active.length > 0 ? active[0] : null);
          } else if (data.categoryPromoBanner) {
            setBanner(data.categoryPromoBanner.enabled !== false && data.categoryPromoBanner.image ? data.categoryPromoBanner : null);
          }
        }
      } catch (err) {}
    }
    load();

    const handleUpdate = (e) => {
      if (e.detail) {
        if (Array.isArray(e.detail.promoBanners)) {
          const active = e.detail.promoBanners.filter((b) => b.enabled !== false && b.image);
          setBanner(active.length > 0 ? active[0] : null);
        } else if (e.detail.categoryPromoBanner) {
          setBanner(e.detail.categoryPromoBanner.enabled !== false && e.detail.categoryPromoBanner.image ? e.detail.categoryPromoBanner : null);
        }
      }
    };
    window.addEventListener('banners-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('banners-updated', handleUpdate);
    };
  }, []);

  if (!banner || banner.enabled === false || !banner.image) {
    return null;
  }

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-white" id="category-promo-section">
      <div className="max-w-7xl mx-auto overflow-hidden border border-neutral-200 hover:border-black transition-colors duration-300">
        <Link to={banner.link || '/shop'} className="block relative group overflow-hidden">
          <img
            src={banner.image}
            alt={banner.alt || 'Promotional Banner'}
            className="w-full h-auto max-h-[360px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
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
