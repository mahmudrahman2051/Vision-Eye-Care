import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../Product/ProductCard';
import { realProducts } from '../../data/realProducts';

const ProductCarousel = ({ title = 'Featured Products', fetchParams = {}, viewAllLink = '/shop', productCount = 10 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const getFilteredRealProducts = () => {
    let list = [...realProducts];
    if (fetchParams.featured) {
      list = list.filter((p) => p.featured);
    } else if (fetchParams.bestseller) {
      list = list.filter((p) => p.bestseller);
    } else if (fetchParams.new_arrival) {
      list = list.filter((p) => p.new_arrival);
    }
    return list.slice(0, productCount);
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ limit: productCount, ...fetchParams });
        if (res.status === 'success' && res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else {
          setProducts(getFilteredRealProducts());
        }
      } catch {
        setProducts(getFilteredRealProducts());
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [productCount, JSON.stringify(fetchParams)]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayProducts = products.length > 0 ? products : getFilteredRealProducts();

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
              {title}
            </h2>
            <div className="w-12 h-0.5 bg-[#8B7355] mt-2" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={viewAllLink}
              className="hidden sm:inline-block text-sm font-medium text-[#8B7355] hover:text-[#6B5740] mr-3"
            >
              View All →
            </Link>
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 bg-[#F5EFE3] hover:bg-[#1A1A1A] hover:text-white rounded-full text-[#555] flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 bg-[#F5EFE3] hover:bg-[#1A1A1A] hover:text-white rounded-full text-[#555] flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex gap-5 overflow-hidden">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="w-56 sm:w-64 flex-shrink-0 bg-[#F5EFE3]/40 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2"
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="w-56 sm:w-64 flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;
