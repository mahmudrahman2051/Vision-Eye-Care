import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../Product/ProductCard';

const sampleProducts = [
  {
    id: 'sp-1', name: 'Classic Wayfarer Frame', slug: 'classic-wayfarer-frame',
    price: 2450, compare_price: 3200, brand: 'VINCENT CHASE', category_name: 'Eyeglasses', frame_shape: 'Wayfarer',
    primary_image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    stock: 12, bestseller: true, average_rating: 4.8, review_count: 124,
  },
  {
    id: 'sp-2', name: 'Titanium Round Optical', slug: 'titanium-round-optical',
    price: 3200, compare_price: 4000, brand: 'JOHN JACOBS', category_name: 'Eyeglasses', frame_shape: 'Round',
    primary_image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    stock: 8, new_arrival: true, average_rating: 4.7, review_count: 87,
  },
  {
    id: 'sp-3', name: 'Aviator Polarized Sunglasses', slug: 'aviator-polarized-sunglasses',
    price: 3800, compare_price: 4600, brand: 'RAY-BAN', category_name: 'Sunglasses', frame_shape: 'Aviator',
    primary_image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    stock: 15, bestseller: true, average_rating: 4.9, review_count: 201,
  },
  {
    id: 'sp-4', name: 'Blue Light Block Lens', slug: 'blue-light-block-lens',
    price: 1800, compare_price: 2500, brand: 'LENSKART BLU', category_name: 'Eyeglasses', frame_shape: 'Rectangle',
    primary_image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    stock: 20, bestseller: false, average_rating: 4.6, review_count: 95,
  },
  {
    id: 'sp-5', name: 'Retro Cat Eye Frame', slug: 'retro-cat-eye-frame',
    price: 2800, compare_price: 3500, brand: 'VINCENT CHASE', category_name: 'Eyeglasses', frame_shape: 'Cat Eye',
    primary_image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    stock: 10, new_arrival: true, average_rating: 4.5, review_count: 67,
  },
  {
    id: 'sp-6', name: 'Sport Shield UV400', slug: 'sport-shield-uv400',
    price: 2200, compare_price: 2900, brand: 'OAKLEY', category_name: 'Sunglasses', frame_shape: 'Sport',
    primary_image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    stock: 14, bestseller: false, average_rating: 4.7, review_count: 45,
  },
  {
    id: 'sp-7', name: 'Rimless Elegant Frame', slug: 'rimless-elegant-frame',
    price: 4200, compare_price: 5100, brand: 'JOHN JACOBS', category_name: 'Eyeglasses', frame_shape: 'Rimless',
    primary_image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    stock: 5, bestseller: true, average_rating: 4.9, review_count: 150,
  },
  {
    id: 'sp-8', name: 'Oversized Fashion Sunglasses', slug: 'oversized-fashion-sunglasses',
    price: 1950, compare_price: 2600, brand: 'VOGUE', category_name: 'Sunglasses', frame_shape: 'Oversized',
    primary_image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    stock: 18, new_arrival: true, average_rating: 4.4, review_count: 38,
  },
  {
    id: 'sp-9', name: 'Premium Computer Glasses', slug: 'premium-computer-glasses',
    price: 2650, compare_price: 3300, brand: 'LENSKART BLU', category_name: 'Eyeglasses', frame_shape: 'Square',
    primary_image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    stock: 22, bestseller: false, average_rating: 4.8, review_count: 112,
  },
  {
    id: 'sp-10', name: 'Clubmaster Gradient Lens', slug: 'clubmaster-gradient-lens',
    price: 3450, compare_price: 4200, brand: 'RAY-BAN', category_name: 'Sunglasses', frame_shape: 'Clubmaster',
    primary_image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    stock: 9, bestseller: true, average_rating: 4.9, review_count: 178,
  },
];

const ProductCarousel = ({ title = 'Featured Products', fetchParams = {}, viewAllLink = '/shop', productCount = 10 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ limit: productCount, ...fetchParams });
        if (res.status === 'success' && res.data.products.length > 0) {
          setProducts(res.data.products);
        } else {
          setProducts(sampleProducts.slice(0, productCount));
        }
      } catch {
        setProducts(sampleProducts.slice(0, productCount));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayProducts = products.length > 0 ? products : sampleProducts.slice(0, productCount);

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
