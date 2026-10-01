import React from 'react';
import HeroSection from '../../components/Home/HeroSection';
import PromoCampaignCards from '../../components/Home/PromoCampaignCards';
import ProductCarousel from '../../components/Home/ProductCarousel';
import GuidedShopping from '../../components/Home/GuidedShopping';
import CategoryDiscoveryGrid from '../../components/Home/CategoryDiscoveryGrid';
import BrandDiscovery from '../../components/Home/BrandDiscovery';
import LensEducation from '../../components/Home/LensEducation';
import VisionBenefitsBanner from '../../components/Home/VisionBenefitsBanner';
import TrustBar from '../../components/Home/TrustBar';

export default function Home() {
  return (
    <div className="home-page bg-[#050505] min-h-screen text-white">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Promotional Campaign Cards */}
      <PromoCampaignCards />

      {/* 3. Product Carousel: Best Sellers */}
      <ProductCarousel
        title="Trending Best Sellers"
        subtitle="Our most popular optical frames and designer sunglasses"
        fetchParams={{ bestseller: 'true' }}
        viewAllLink="/shop?sort=popular"
      />

      {/* 4. Guided Shopping Flow */}
      <GuidedShopping />

      {/* 5. Category Discovery Grid */}
      <CategoryDiscoveryGrid />

      {/* 6. Product Carousel: New Arrivals */}
      <ProductCarousel
        title="New Season Arrivals"
        subtitle="Freshly crafted styles engineered for modern aesthetics"
        fetchParams={{ new_arrival: 'true' }}
        viewAllLink="/shop?sort=newest"
      />

      {/* 7. Brand Discovery Bar */}
      <BrandDiscovery />

      {/* 8. Lens Education */}
      <LensEducation />

      {/* 9. Vision Benefits Banner */}
      <VisionBenefitsBanner />

      {/* 10. Trust & Service Bar */}
      <TrustBar />
    </div>
  );
}
