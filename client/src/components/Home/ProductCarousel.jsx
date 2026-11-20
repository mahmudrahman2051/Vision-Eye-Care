import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../Product/ProductCard';
import { realProducts } from '../../data/realProducts';

const ProductCarousel = ({ title = 'Featured Products', fetchParams = {}, viewAllLink = '/shop', productCount = 10 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  const getFilteredRealProducts = () => {
    let list = productService.getMergedProducts ? productService.getMergedProducts() : [...realProducts];
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

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = scrollLeft / (scrollWidth - clientWidth || 1);
      const dotIndex = Math.min(3, Math.floor(progress * 4));
      setActiveDot(dotIndex);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayProducts = products.length > 0 ? products : getFilteredRealProducts();

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header - Editorial Centered Title */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold text-black tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-400 font-medium tracking-widest uppercase mt-1.5">
            HANDCRAFTED PRECISION & MINIMALIST DESIGN
          </p>
        </div>

        {/* Carousel Container with Left/Right Arrows */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-full text-neutral-700 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Previous"
          >
            <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white border border-neutral-300 hover:border-black hover:bg-black hover:text-white rounded-full text-neutral-700 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            aria-label="Next"
          >
            <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Products List */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="w-56 sm:w-64 flex-shrink-0 bg-neutral-100 rounded-none h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              onScroll={handleScrollEvent}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
            >
              {displayProducts.map((product) => (
                <div key={product.id || product.product_id} className="w-56 sm:w-64 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              onClick={() => {
                if (scrollRef.current) {
                  const { scrollWidth, clientWidth } = scrollRef.current;
                  const targetLeft = ((scrollWidth - clientWidth) / 3) * dot;
                  scrollRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
                  setActiveDot(dot);
                }
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeDot === dot
                  ? 'w-2 h-2 bg-black'
                  : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-500'
              }`}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>

        {/* Minimalist Solid Black "View all" Button */}
        <div className="text-center mt-6">
          <Link
            to={viewAllLink}
            className="inline-block bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-none transition-colors"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
