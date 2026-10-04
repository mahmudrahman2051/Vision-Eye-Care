import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiPackage } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../../components/Product/ProductCard';
import ProductFilters from '../../components/Product/ProductFilters';
import Pagination from '../../components/Product/Pagination';

const fallbackCategories = [
  { id: 1, name: 'Glasses', slug: 'eyeglasses', product_count: 8 },
  { id: 2, name: 'Sunglasses', slug: 'sunglasses', product_count: 6 },
  { id: 3, name: 'Contact Lenses', slug: 'contact-lenses', product_count: 4 },
  { id: 4, name: 'Eyeglass Cases', slug: 'eyeglass-cases', product_count: 3 },
  { id: 5, name: 'Lens Cleaning Solutions', slug: 'lens-cleaning', product_count: 2 },
];

const fallbackProducts = [
  {
    id: 'sp-1', name: 'Classic Wayfarer Frame', slug: 'classic-wayfarer-frame',
    price: 2450, compare_price: 3200, brand: 'VINCENT CHASE', category_id: 1, category_slug: 'eyeglasses', category_name: 'Glasses',
    gender: 'unisex', frame_shape: 'Wayfarer', stock: 12, bestseller: true, featured: true, average_rating: 4.8, review_count: 124,
    primary_image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-2', name: 'Titanium Round Optical', slug: 'titanium-round-optical',
    price: 3200, compare_price: 4000, brand: 'JOHN JACOBS', category_id: 1, category_slug: 'eyeglasses', category_name: 'Glasses',
    gender: 'men', frame_shape: 'Round', stock: 8, new_arrival: true, average_rating: 4.7, review_count: 87,
    primary_image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-3', name: 'Aviator Polarized Sunglasses', slug: 'aviator-polarized-sunglasses',
    price: 3800, compare_price: 4600, brand: 'RAY-BAN', category_id: 2, category_slug: 'sunglasses', category_name: 'Sunglasses',
    gender: 'men', frame_shape: 'Aviator', stock: 15, bestseller: true, average_rating: 4.9, review_count: 201,
    primary_image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-4', name: 'Blue Light Block Lens', slug: 'blue-light-block-lens',
    price: 1800, compare_price: 2500, brand: 'LENSKART BLU', category_id: 1, category_slug: 'eyeglasses', category_name: 'Glasses',
    gender: 'women', frame_shape: 'Rectangle', stock: 20, bestseller: false, average_rating: 4.6, review_count: 95,
    primary_image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-5', name: 'Retro Cat Eye Frame', slug: 'retro-cat-eye-frame',
    price: 2800, compare_price: 3500, brand: 'VINCENT CHASE', category_id: 1, category_slug: 'eyeglasses', category_name: 'Glasses',
    gender: 'women', frame_shape: 'Cat Eye', stock: 10, new_arrival: true, average_rating: 4.5, review_count: 67,
    primary_image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-6', name: 'Sport Shield UV400 Sunglasses', slug: 'sport-shield-uv400',
    price: 2200, compare_price: 2900, brand: 'OAKLEY', category_id: 2, category_slug: 'sunglasses', category_name: 'Sunglasses',
    gender: 'unisex', frame_shape: 'Square', stock: 14, bestseller: false, average_rating: 4.7, review_count: 45,
    primary_image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-7', name: 'Rimless Elegant Gold Frame', slug: 'rimless-elegant-frame',
    price: 4200, compare_price: 5100, brand: 'JOHN JACOBS', category_id: 1, category_slug: 'eyeglasses', category_name: 'Glasses',
    gender: 'men', frame_shape: 'Rectangle', stock: 5, bestseller: true, average_rating: 4.9, review_count: 150,
    primary_image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-8', name: 'Oversized Fashion Sunglasses', slug: 'oversized-fashion-sunglasses',
    price: 1950, compare_price: 2600, brand: 'VOGUE', category_id: 2, category_slug: 'sunglasses', category_name: 'Sunglasses',
    gender: 'women', frame_shape: 'Round', stock: 18, new_arrival: true, average_rating: 4.4, review_count: 38,
    primary_image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-9', name: 'Premium Computer Glasses', slug: 'premium-computer-glasses',
    price: 2650, compare_price: 3300, brand: 'LENSKART BLU', category_id: 1, category_slug: 'eyeglasses', category_name: 'Glasses',
    gender: 'unisex', frame_shape: 'Square', stock: 22, bestseller: false, average_rating: 4.8, review_count: 112,
    primary_image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-10', name: 'Clubmaster Gradient Sunglasses', slug: 'clubmaster-gradient-lens',
    price: 3450, compare_price: 4200, brand: 'RAY-BAN', category_id: 2, category_slug: 'sunglasses', category_name: 'Sunglasses',
    gender: 'men', frame_shape: 'Wayfarer', stock: 9, bestseller: true, average_rating: 4.9, review_count: 178,
    primary_image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
  },
];

const filterFallbackProducts = (filters) => {
  let list = [...fallbackProducts];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.frame_shape.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    const catVal = filters.category.toLowerCase();
    list = list.filter((p) =>
      p.category_id.toString() === catVal ||
      p.category_slug === catVal ||
      p.category_name.toLowerCase().includes(catVal)
    );
  }

  if (filters.gender) {
    list = list.filter((p) => p.gender === filters.gender.toLowerCase());
  }

  if (filters.frame_shape) {
    list = list.filter((p) => p.frame_shape.toLowerCase() === filters.frame_shape.toLowerCase());
  }

  if (filters.min_price) {
    list = list.filter((p) => p.price >= parseFloat(filters.min_price));
  }

  if (filters.max_price) {
    list = list.filter((p) => p.price <= parseFloat(filters.max_price));
  }

  if (filters.in_stock === 'true') {
    list = list.filter((p) => p.stock > 0);
  }

  if (filters.sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'popular') {
    list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  } else if (filters.sort === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const currentFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    gender: searchParams.get('gender') || '',
    frame_shape: searchParams.get('frame_shape') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    in_stock: searchParams.get('in_stock') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        if (res.status === 'success' && res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(fallbackCategories);
        }
      } catch {
        setCategories(fallbackCategories);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts(currentFilters);
        if (res.status === 'success' && res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        } else {
          const filtered = filterFallbackProducts(currentFilters);
          setProducts(filtered);
          setPagination({ total: filtered.length, page: 1, limit: 12, totalPages: 1 });
        }
      } catch {
        const filtered = filterFallbackProducts(currentFilters);
        setProducts(filtered);
        setPagination({ total: filtered.length, page: 1, limit: 12, totalPages: 1 });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-[#F5EFE3]/20 min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Description */}
        <div className="mb-6 sm:mb-8 space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Bangladesh Optical Collection
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
            Eyewear & Frame Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#666] font-medium max-w-2xl">
            Explore 1,000+ prescription eyeglasses, computer blue-cut frames & designer sunglasses in BDT (৳).
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-3.5 sm:p-4 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white rounded-xl text-xs font-semibold uppercase flex items-center gap-2 transition-colors"
            >
              <FiSliders /> Filter Options
            </button>
            <span className="text-xs text-[#777] font-medium">
              Showing <span className="text-[#1A1A1A] font-bold">{pagination.total}</span> Frames
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-[#777] uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <select
              value={currentFilters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full sm:w-auto bg-[#F5EFE3]/50 border border-[#E8DFD0] text-[#1A1A1A] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B7355] cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Main Shop Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilters
                categories={categories}
                filters={currentFilters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

          {/* Mobile Filter Sidepanel Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
              ></div>
              <div className="relative ml-auto w-full max-w-[85vw] sm:max-w-sm bg-white h-full p-5 sm:p-6 overflow-y-auto z-10 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#F5EFE3]">
                    <h3 className="font-bold text-base text-[#1A1A1A] uppercase tracking-wide flex items-center gap-2">
                      <FiSliders className="text-[#8B7355]" /> Filter Options
                    </h3>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 text-[#888] hover:text-[#1A1A1A] text-xl font-bold transition-colors"
                      aria-label="Close Filter Options"
                    >
                      ✕
                    </button>
                  </div>
                  <ProductFilters
                    categories={categories}
                    filters={currentFilters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    isDrawer={true}
                  />
                </div>

                <div className="pt-4 mt-6 border-t border-[#F5EFE3]">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#1A1A1A] hover:bg-[#8B7355] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
                  >
                    Apply Filters ({pagination.total})
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                {[...Array(10)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E8DFD0] rounded-xl h-72 animate-pulse p-3 flex flex-col justify-between"
                  >
                    <div className="bg-[#F5EFE3]/50 h-36 rounded-lg"></div>
                    <div className="space-y-2 mt-3">
                      <div className="bg-[#F5EFE3]/60 h-3 rounded w-3/4"></div>
                      <div className="bg-[#F5EFE3]/60 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-8 sm:p-12 text-center my-4 flex flex-col items-center justify-center min-h-[360px]">
                <div className="w-16 h-16 bg-[#F5EFE3] text-[#8B7355] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#E8DFD0]">
                  <FiPackage />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">No Frames Found</h3>
                <p className="text-xs text-[#777] max-w-md mb-6 font-medium">
                  We couldn't find any eyewear matching your selected criteria. Try adjusting your search or filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-[#8B7355] transition-colors text-xs uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

