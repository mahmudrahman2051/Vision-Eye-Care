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
    <section className="bg-[#F9FAFB] py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title with Yellow Accent */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-5xl font-black text-[#050505] tracking-tight uppercase">
            {title}
          </h2>
          <div className="w-20 h-1.5 bg-[#DFFF00] mx-auto rounded-full border border-black/10"></div>
        </div>

        {/* Carousel Area */}
        <div className="relative group px-2">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border-2 border-black hover:bg-[#DFFF00] rounded-full text-black flex items-center justify-center shadow-lg transition-all"
            aria-label="Previous"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border-2 border-black hover:bg-[#DFFF00] rounded-full text-black flex items-center justify-center shadow-lg transition-all"
            aria-label="Next"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="w-64 sm:w-72 flex-shrink-0 bg-white border border-gray-200 rounded-2xl h-72 animate-pulse p-4" />
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

        {/* VIEW ALL Button - Safely spaced below carousel */}
        <div className="text-center pt-4">
          <Link
            to={viewAllLink}
            className="inline-block px-8 py-3 bg-[#050505] hover:bg-gray-800 text-[#DFFF00] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
