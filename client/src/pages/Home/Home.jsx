import React from 'react';
import HeroSection from '../../components/Home/HeroSection';
import TopCategorySection from '../../components/Home/TopCategorySection';
import ProductCarousel from '../../components/Home/ProductCarousel';
import PromoDealsGrid from '../../components/Home/PromoDealsGrid';
import FeatureSliderBannerOne from '../../components/Home/FeatureSliderBannerOne';
import SpeedyDeliveryBanner from '../../components/Home/SpeedyDeliveryBanner';
import BrandLogosGrid from '../../components/Home/BrandLogosGrid';
import InsuranceBanner from '../../components/Home/InsuranceBanner';
import FeatureSliderBannerTwo from '../../components/Home/FeatureSliderBannerTwo';
import LensesAccordionSection from '../../components/Home/LensesAccordionSection';
import TrustFooterBar from '../../components/Home/TrustFooterBar';

export default function Home() {
  return (
    <div className="home-page bg-white min-h-screen text-gray-900">
      {/* 1. Main Hero Section */}
      <HeroSection />

      {/* 2. Top Category Section (New Section #1) */}
      <TopCategorySection />

      {/* 3. Product Carousel */}
      <ProductCarousel
        title="Trending Eyewear in BD"
        fetchParams={{ bestseller: 'true' }}
        viewAllLink="/shop?sort=popular"
      />

      {/* 4. Top Deals Grid */}
      <PromoDealsGrid />

      {/* 5. Feature Slider Banner #1 (New Section #2) */}
      <FeatureSliderBannerOne />

      {/* 6. Speedy Delivery Banner */}
      <SpeedyDeliveryBanner />

      {/* 7. Premium Brands Logo Row */}
      <BrandLogosGrid />

      {/* 8. Insurance & Payment Options Banner */}
      <InsuranceBanner />

      {/* 9. Feature Slider Banner #2 (New Section #3) */}
      <FeatureSliderBannerTwo />

      {/* 10. Our Lenses Accordion */}
      <LensesAccordionSection />

      {/* 11. Trust & Customer Guarantee Bar */}
      <TrustFooterBar />
    </div>
  );
};
