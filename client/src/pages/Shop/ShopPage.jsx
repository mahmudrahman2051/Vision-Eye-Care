import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiPackage } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../../components/Product/ProductCard';
import ProductFilters from '../../components/Product/ProductFilters';
import Pagination from '../../components/Product/Pagination';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
        if (res.status === 'success') {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts(currentFilters);
        if (res.status === 'success') {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
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
    <div className="bg-[#F5EFE3]/20 min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-[#1A1A1A] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Description */}
        <div className="mb-8 space-y-1 text-center sm:text-left">
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
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-semibold uppercase flex items-center gap-2"
            >
              <FiSliders /> Filters
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
              className="bg-[#F5EFE3]/50 border border-[#E8DFD0] text-[#1A1A1A] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B7355] cursor-pointer"
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setMobileFilterOpen(false)}
              ></div>
              <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto z-10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-base text-[#1A1A1A] uppercase">Filter Options</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-[#999] hover:text-[#1A1A1A] text-xl font-bold"
                  >
                    ✕
                  </button>
                </div>
                <ProductFilters
                  categories={categories}
                  filters={currentFilters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E8DFD0] rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between"
                  >
                    <div className="bg-[#F5EFE3]/50 h-44 rounded-xl"></div>
                    <div className="space-y-2 mt-4">
                      <div className="bg-[#F5EFE3]/60 h-4 rounded w-3/4"></div>
                      <div className="bg-[#F5EFE3]/60 h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center min-h-[400px]">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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

