import React from 'react';
import HeroSection from '../../components/Home/HeroSection';
import TopCategorySection from '../../components/Home/TopCategorySection';
import ProductCarousel from '../../components/Home/ProductCarousel';

export default function Home() {
  return (
    <div className="home-page bg-white min-h-screen">
      {/* 1. Hero Banner (Image Only) */}
      <HeroSection />

      {/* 2. Product Categories */}
      <TopCategorySection />

      {/* 3. Featured Products (10 items) */}
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

      {/* 4. Hot Selling Products (10 items) */}
      <ProductCarousel
        title="Hot Selling Products"
        fetchParams={{ bestseller: 'true' }}
        viewAllLink="/shop?sort=popular"
        productCount={10}
      />
    </div>
  );
}
