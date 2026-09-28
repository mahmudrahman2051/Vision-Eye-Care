import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSliders, FiGrid, FiPackage } from 'react-icons/fi';
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

  // Extract filter parameters from URL
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

  // Fetch Categories on mount
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

  // Fetch Products whenever URL filters change
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
    // Reset page to 1 when filter changes
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
    <div className="bg-[#050505] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Eyewear Shop <span className="text-[#DFFF00]">Collection</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Discover premium glasses, sunglasses, and optical frames engineered for style and clarity.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-[#0B0B0B] border border-[#292929] rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-[#171717] border border-[#292929] rounded-xl text-xs font-bold text-gray-200 flex items-center gap-2 hover:border-[#DFFF00]"
            >
              <FiSliders className="text-[#DFFF00]" /> Filters
            </button>
            <span className="text-xs text-gray-400">
              Showing <span className="text-white font-bold">{pagination.total}</span> Results
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </span>
            <select
              value={currentFilters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-[#171717] border border-[#292929] text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#DFFF00] transition-colors cursor-pointer"
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
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMobileFilterOpen(false)}
              ></div>
              <div className="relative ml-auto w-full max-w-xs bg-[#0B0B0B] h-full p-6 overflow-y-auto z-10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-white">Filter Options</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-gray-400 hover:text-white text-xl"
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
              // Loading Skeletons
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B0B0B] border border-[#292929] rounded-2xl h-80 animate-pulse p-4 flex flex-col justify-between"
                  >
                    <div className="bg-[#171717] h-44 rounded-xl"></div>
                    <div className="space-y-2 mt-4">
                      <div className="bg-[#171717] h-4 rounded w-3/4"></div>
                      <div className="bg-[#171717] h-3 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              // Empty State
              <div className="bg-[#0B0B0B] border border-[#292929] rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-[#171717] text-[#DFFF00] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#292929]">
                  <FiPackage />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
                <p className="text-sm text-gray-400 max-w-md mb-6">
                  We couldn't find any eyewear matching your selected search or filter criteria. Try adjusting or clearing filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#DFFF00] text-black font-extrabold rounded-xl hover:bg-[#cbe600] transition-colors text-xs uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              // Product Cards Grid
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
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
