import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../Product/ProductCard';

const sampleProducts = [
  {
    id: 'ai-1',
    name: 'Ray-Ban Meta Wayfarer AI',
    slug: 'ray-ban-meta-wayfarer-ai',
    price: 3450.0,
    compare_price: 4200.0,
    primary_image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    brand: 'RAY-BAN',
    category_name: 'AI Eyewear',
    frame_shape: 'Wayfarer',
    stock: 12,
    bestseller: true,
    average_rating: 4.9,
    review_count: 142,
  },
  {
    id: 'ai-2',
    name: 'Oakley Radar Smart AI',
    slug: 'oakley-radar-smart-ai',
    price: 3800.0,
    compare_price: 4500.0,
    primary_image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    brand: 'OAKLEY',
    category_name: 'AI Eyewear',
    frame_shape: 'Sport',
    stock: 8,
    bestseller: false,
    new_arrival: true,
    average_rating: 4.8,
    review_count: 89,
  },
  {
    id: 'ai-3',
    name: 'Persol 714 Transitions AI',
    slug: 'persol-714-transitions-ai',
    price: 4200.0,
    compare_price: 5000.0,
    primary_image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    brand: 'PERSOL',
    category_name: 'AI Eyewear',
    frame_shape: 'Pilot',
    stock: 15,
    bestseller: true,
    average_rating: 5.0,
    review_count: 64,
  },
  {
    id: 'ai-4',
    name: 'Burberry Square Optical AI',
    slug: 'burberry-square-optical-ai',
    price: 2950.0,
    compare_price: 3600.0,
    primary_image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    brand: 'BURBERRY',
    category_name: 'AI Eyewear',
    frame_shape: 'Square',
    stock: 6,
    bestseller: false,
    average_rating: 4.7,
    review_count: 53,
  },
];

const ProductCarousel = ({ title = 'AI Glasses', fetchParams = {}, viewAllLink = '/shop' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ limit: 8, ...fetchParams });
        if (res.status === 'success' && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else {
          setProducts(sampleProducts);
        }
      } catch (err) {
        console.error('Carousel products fetch error:', err);
        setProducts(sampleProducts);
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

  const displayProducts = products.length > 0 ? products : sampleProducts;

  return (
    <section className="bg-[#FEFCE8] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#FEF08A]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Title with Yellow Accent */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
            {title}
          </h2>
          <div className="w-16 h-1 bg-[#DFFF00] mx-auto rounded-full border border-[#CBE600]"></div>
        </div>

        {/* Carousel Area */}
        <div className="relative group px-4 min-h-[380px]">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white border-2 border-[#DFFF00] hover:bg-[#DFFF00] rounded-full text-gray-700 hover:text-gray-900 flex items-center justify-center shadow-lg transition-all"
            aria-label="Previous"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white border-2 border-[#DFFF00] hover:bg-[#DFFF00] rounded-full text-gray-700 hover:text-gray-900 flex items-center justify-center shadow-lg transition-all"
            aria-label="Next"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="w-64 sm:w-72 flex-shrink-0 bg-white border border-gray-200 rounded-2xl h-80 animate-pulse p-4" />
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth py-3 px-2"
            >
              {displayProducts.map((product) => (
                <div key={product.id} className="w-64 sm:w-72 flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VIEW ALL Button */}
        <div className="text-center pt-6">
          <Link
            to={viewAllLink}
            className="inline-block px-10 py-3.5 bg-[#DFFF00] hover:bg-[#CBE600] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md border border-[#CBE600]"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
