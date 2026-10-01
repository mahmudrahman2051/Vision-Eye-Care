import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../Product/ProductCard';

const ProductCarousel = ({ title, subtitle, fetchParams = {}, viewAllLink = '/shop' }) => {
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
    <section className="bg-[#050505] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#292929]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={viewAllLink}
              className="text-xs font-bold uppercase tracking-wider text-[#DFFF00] hover:underline flex items-center gap-1 mr-2"
            >
              View All <FiArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => scroll('left')}
              className="p-2.5 bg-[#0B0B0B] border border-[#292929] rounded-xl text-gray-300 hover:text-[#DFFF00] hover:border-[#DFFF00] transition-colors"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="p-2.5 bg-[#0B0B0B] border border-[#292929] rounded-xl text-gray-300 hover:text-[#DFFF00] hover:border-[#DFFF00] transition-colors"
              aria-label="Scroll right"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="w-72 sm:w-80 flex-shrink-0 bg-[#0B0B0B] border border-[#292929] rounded-2xl h-80 animate-pulse p-4"
              >
                <div className="bg-[#171717] h-44 rounded-xl mb-4"></div>
                <div className="bg-[#171717] h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-[#171717] h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">No frames available in this collection.</div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1"
          >
            {products.map((product) => (
              <div key={product.id} className="w-72 sm:w-80 flex-shrink-0">
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
