import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../Product/ProductCard';

const ProductCarousel = ({ title = 'AI Glasses', fetchParams = {}, viewAllLink = '/shop' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ limit: 8, ...fetchParams });
        if (res.status === 'success') {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Carousel products fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Large Peach Header Title (Screenshot 2) */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-6xl font-black text-[#F4D9C5] tracking-tight uppercase">
            {title}
          </h2>
        </div>

        {/* Carousel Area with Side Navigation Arrows */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 hover:bg-[#EEF0F8] rounded-full text-gray-700 flex items-center justify-center shadow-lg transition-all"
            aria-label="Previous"
          >
            <FiChevronLeft className="w-5 h-5 text-[#5B649E]" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 hover:bg-[#EEF0F8] rounded-full text-gray-700 flex items-center justify-center shadow-lg transition-all"
            aria-label="Next"
          >
            <FiChevronRight className="w-5 h-5 text-[#5B649E]" />
          </button>

          {/* Scrollable Container */}
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="w-64 sm:w-72 flex-shrink-0 bg-gray-50 border border-gray-100 rounded-2xl h-72 animate-pulse p-4" />
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth py-2 px-1"
            >
              {products.map((product) => (
                <div key={product.id} className="w-64 sm:w-72 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Pill Button (Screenshot 2) */}
        <div className="text-center pt-2">
          <Link
            to={viewAllLink}
            className="inline-block px-8 py-3 bg-[#5B649E] hover:bg-[#4A5288] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
