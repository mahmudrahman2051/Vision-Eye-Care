import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSliders, FiPackage } from 'react-icons/fi';
import productService from '../../services/productService';
import ProductCard from '../../components/Product/ProductCard';
import ProductFilters from '../../components/Product/ProductFilters';
import Pagination from '../../components/Product/Pagination';
import { realProducts } from '../../data/realProducts';

const fallbackCategories = [
  { id: 1, name: 'Sunglasses', slug: 'sunglasses', product_count: 23 },
  { id: 2, name: 'Prescription Glasses', slug: 'prescription-glasses', product_count: 54 },
  { id: 4, name: 'Men', slug: 'men', product_count: 8 },
  { id: 5, name: 'Women', slug: 'women', product_count: 15 },
  { id: 7, name: 'Kids', slug: 'kids', product_count: 8 },
];

const filterFallbackProducts = (filters) => {
  let list = [...realProducts];

  // Search by code, name, brand, model, size, color
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter((p) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.product_code && p.product_code.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.model_no && p.model_no.toLowerCase().includes(q)) ||
      (p.memo_no && p.memo_no.toLowerCase().includes(q)) ||
      (p.frame_shape && p.frame_shape.toLowerCase().includes(q)) ||
      (p.frame_color && p.frame_color.toLowerCase().includes(q)) ||
      (p.size && p.size.toLowerCase().includes(q))
    );
  }

  // Brand filter
  if (filters.brand) {
    const bVal = filters.brand.toLowerCase().trim();
    list = list.filter((p) => p.brand && p.brand.toLowerCase() === bVal);
  }

  // Category filter
  if (filters.category) {
    const catVal = filters.category.toLowerCase().trim();
    list = list.filter((p) =>
      p.category_id?.toString() === catVal ||
      p.category_slug === catVal ||
      p.category_name?.toLowerCase().includes(catVal)
    );
  }

  // Gender filter
  if (filters.gender) {
    list = list.filter((p) => p.gender === filters.gender.toLowerCase());
  }

  // Frame shape
  if (filters.frame_shape) {
    list = list.filter((p) => p.frame_shape?.toLowerCase() === filters.frame_shape.toLowerCase());
  }

  // Min price
  if (filters.min_price) {
    list = list.filter((p) => p.price >= parseFloat(filters.min_price));
  }

  // Max price
  if (filters.max_price) {
    list = list.filter((p) => p.price <= parseFloat(filters.max_price));
  }

  // Stock
  if (filters.in_stock === 'true') {
    list = list.filter((p) => p.stock > 0);
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'brand_asc') {
    list.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
  } else if (filters.sort === 'brand_desc') {
    list.sort((a, b) => (b.brand || '').localeCompare(a.brand || ''));
  } else if (filters.sort === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === 'popular') {
    list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  } else {
    // Newest / Product Code order (MRM-001 ...)
    list.sort((a, b) => (a.product_code || '').localeCompare(b.product_code || ''));
  }

  const page = Math.max(1, parseInt(filters.page, 10) || 1);
  const limit = Math.max(1, parseInt(filters.limit, 10) || 12);
  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = list.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [pagination, setPagination] = useState({ total: realProducts.length, page: 1, limit: 12, totalPages: Math.ceil(realProducts.length / 12) });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract all unique brands from real products
  const brands = useMemo(() => {
    return Array.from(new Set(realProducts.map((p) => p.brand).filter(Boolean))).sort();
  }, []);

  const currentFilters = {
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
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
          const { products: pList, pagination: pMeta } = filterFallbackProducts(currentFilters);
          setProducts(pList);
          setPagination(pMeta);
        }
      } catch {
        const { products: pList, pagination: pMeta } = filterFallbackProducts(currentFilters);
        setProducts(pList);
        setPagination(pMeta);
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
              <option value="newest">Product Code / Newest</option>
              <option value="brand_asc">Brand: A to Z</option>
              <option value="brand_desc">Brand: Z to A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Main Shop Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-36 sm:top-40">
              <ProductFilters
                categories={categories}
                brands={brands}
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
                    brands={brands}
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

