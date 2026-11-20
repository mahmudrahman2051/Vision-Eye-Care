import React from 'react';
import HeroSection from '../../components/Home/HeroSection';
import TopCategorySection from '../../components/Home/TopCategorySection';
import FeaturedCollectionsGrid from '../../components/Home/FeaturedCollectionsGrid';
import CategoryPromoBanner from '../../components/Home/CategoryPromoBanner';
import ProductCarousel from '../../components/Home/ProductCarousel';
import LowerPromoBanner from '../../components/Home/LowerPromoBanner';

export default function Home() {
  return (
    <div className="home-page bg-white min-h-screen">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. New Arrivals Carousel (Matches Reference Site Header) */}
      <ProductCarousel
        title="New Arrivals"
        fetchParams={{ new_arrival: 'true' }}
        viewAllLink="/shop?sort=new"
        productCount={10}
      />

      {/* 3. Product Categories Editorial Lifestyle Grid */}
      <TopCategorySection />

      {/* 4. Best Sellers Carousel */}
      <ProductCarousel
        title="Best Sellers"
        fetchParams={{ bestseller: 'true' }}
        viewAllLink="/shop?sort=popular"
        productCount={10}
      />

      {/* 5. Featured Square Collections Grid */}
      <FeaturedCollectionsGrid />

      {/* 6. Secondary Promo Banner */}
      <CategoryPromoBanner />

      {/* 7. Lower Promo Banner */}
      <LowerPromoBanner />
    </div>
  );
}
