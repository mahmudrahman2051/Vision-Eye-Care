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
      {/* 1. Hero Banner (Image Only) */}
      <HeroSection />

      {/* 2. Product Categories (1 Row) */}
      <TopCategorySection />

      {/* 3. Featured Square Collections Grid (2 cols mobile / 6 cols desktop) */}
      <FeaturedCollectionsGrid />

      {/* 4. Secondary Promo Banner */}
      <CategoryPromoBanner />

      {/* 5. Featured Products (10 items) */}
      <ProductCarousel
        title="Featured Products"
        fetchParams={{ featured: 'true' }}
        viewAllLink="/shop?sort=featured"
        productCount={10}
      />

      {/* Subtle divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-slate-100" />
      </div>

      {/* 6. Hot Selling Products (10 items) */}
      <ProductCarousel
        title="Hot Selling Products"
        fetchParams={{ bestseller: 'true' }}
        viewAllLink="/shop?sort=popular"
        productCount={10}
      />

      {/* 7. Lower Promo Banner (Under Hot Selling Products) */}
      <LowerPromoBanner />
    </div>
  );
}
