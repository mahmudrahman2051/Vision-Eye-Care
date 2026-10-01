import React from 'react';
import HeroSection from '../../components/Home/HeroSection';
import ProductCarousel from '../../components/Home/ProductCarousel';
import PromoDealsGrid from '../../components/Home/PromoDealsGrid';
import SpeedyDeliveryBanner from '../../components/Home/SpeedyDeliveryBanner';
import BrandLogosGrid from '../../components/Home/BrandLogosGrid';
import InsuranceBanner from '../../components/Home/InsuranceBanner';
import LensesAccordionSection from '../../components/Home/LensesAccordionSection';
import TrustFooterBar from '../../components/Home/TrustFooterBar';

export default function Home() {
  return (
    <div className="home-page bg-white min-h-screen text-gray-900">
      {/* Screenshot 1: Cognac Gradient Hero */}
      <HeroSection />

      {/* Screenshot 2: AI Glasses Carousel */}
      <ProductCarousel
        title="AI Glasses"
        fetchParams={{ bestseller: 'true' }}
        viewAllLink="/shop?search=AI+Glasses"
      />

      {/* Screenshot 2: Top Deals 3 Cards Grid */}
      <PromoDealsGrid />

      {/* Screenshot 3: Speedy Delivery Banner + 4-Step Cards */}
      <SpeedyDeliveryBanner />

      {/* Screenshot 4: Premium Brands Logo Row */}
      <BrandLogosGrid />

      {/* Screenshot 4: Insurance Purchasing Banner */}
      <InsuranceBanner />

      {/* Screenshot 5: Our Lenses Accordion */}
      <LensesAccordionSection />

      {/* Screenshot 5: Trust Bar */}
      <TrustFooterBar />
    </div>
  );
}
