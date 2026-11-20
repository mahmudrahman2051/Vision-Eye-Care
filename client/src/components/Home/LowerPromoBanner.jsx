import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerService from '../../services/bannerService';

const DEFAULT_BANNER = {
  image: '/lower_banner.png',
  alt: 'Vision Eye Care Special Bangladesh Offer',
  link: '/shop?sort=popular',
  enabled: true,
};

const LowerPromoBanner = () => {
  const [banners, setBanners] = useState([DEFAULT_BANNER]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await bannerService.getBanners();
        if (isMounted && data) {
          if (Array.isArray(data.promoBanners)) {
            const active = data.promoBanners.filter((b) => b.enabled !== false && b.image);
            // CategoryPromoBanner renders active[0], LowerPromoBanner renders subsequent active promo banners (active.slice(1))
            setBanners(active.slice(1));
          } else if (data.lowerPromoBanner && data.lowerPromoBanner.enabled !== false && data.lowerPromoBanner.image) {
            setBanners([data.lowerPromoBanner]);
          } else {
            setBanners([]);
          }
        }
      } catch (err) {}
    }
    load();

    const handleUpdate = (e) => {
      if (e.detail) {
        if (Array.isArray(e.detail.promoBanners)) {
          const active = e.detail.promoBanners.filter((b) => b.enabled !== false && b.image);
          setBanners(active.slice(1));
        } else if (e.detail.lowerPromoBanner && e.detail.lowerPromoBanner.enabled !== false && e.detail.lowerPromoBanner.image) {
          setBanners([e.detail.lowerPromoBanner]);
        } else {
          setBanners([]);
        }
      }
    };
    window.addEventListener('banners-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('banners-updated', handleUpdate);
    };
  }, []);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-white space-y-6" id="lower-promo-section">
      {banners.map((banner, idx) => (
        <div key={banner.id || idx} className="max-w-7xl mx-auto overflow-hidden border border-neutral-200 hover:border-black transition-colors duration-300">
          <Link to={banner.link || '/shop'} className="block relative group overflow-hidden">
            <img
              src={banner.image}
              alt={banner.alt || 'Exclusive Offer Banner'}
              loading="lazy"
              decoding="async"
              className="w-full h-auto max-h-[360px] object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/hero_banner_2.png';
              }}
            />
          </Link>
        </div>
      ))}
    </section>
  );
};

export default LowerPromoBanner;
