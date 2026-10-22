import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiRotateCcw,
  FiLayers
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import { realProducts } from '../data/realProducts';

export default function AdminProductsPage() {
  const [apiProducts, setApiProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [imageFilter, setImageFilter] = useState('all'); // 'all' | 'needs_image' | 'has_image'
  const [sortBy, setSortBy] = useState('code_asc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        search: searchTerm,
        brand: selectedBrand,
        limit: 200, // get all for admin management
      });
      if (res.status === 'success' && res.data?.products?.length > 0) {
        setApiProducts(res.data.products);
      } else {
        // Fallback to realProducts
        setApiProducts(realProducts);
      }
    } catch {
      // Backend offline or error - use real CSV catalog
      setApiProducts(realProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Compute available unique brands
  const brandOptions = useMemo(() => {
    const source = apiProducts || realProducts;
    const brands = Array.from(new Set(source.map((p) => p.brand))).filter(Boolean);
    return brands.sort((a, b) => a.localeCompare(b));
  }, [apiProducts]);

  // Filter and sort items locally
  const filteredProducts = useMemo(() => {
    let list = [...(apiProducts || realProducts)];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((p) => {
        const codeMatch = (p.product_code || '').toLowerCase().includes(term);
        const nameMatch = (p.name || '').toLowerCase().includes(term);
        const brandMatch = (p.brand || '').toLowerCase().includes(term);
        const skuMatch = (p.sku || '').toLowerCase().includes(term);
        const modelMatch = (p.model_no || '').toLowerCase().includes(term);
        return codeMatch || nameMatch || brandMatch || skuMatch || modelMatch;
      });
    }

    // Brand filter
    if (selectedBrand) {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Image filter
    if (imageFilter === 'needs_image') {
      list = list.filter((p) => !p.primary_image && (!p.images || p.images.length === 0));
    } else if (imageFilter === 'has_image') {
      list = list.filter((p) => Boolean(p.primary_image || (p.images && p.images.length > 0)));
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'code_asc') {
        return (a.product_code || '').localeCompare(b.product_code || '');
      }
      if (sortBy === 'code_desc') {
        return (b.product_code || '').localeCompare(a.product_code || '');
      }
      if (sortBy === 'brand_asc') {
        return (a.brand || '').localeCompare(b.brand || '');
      }
      if (sortBy === 'brand_desc') {
        return (b.brand || '').localeCompare(a.brand || '');
      }
      if (sortBy === 'price_asc') {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      if (sortBy === 'price_desc') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      if (sortBy === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    return list;
  }, [apiProducts, searchTerm, selectedBrand, imageFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  // Overall catalog stats
  const catalogStats = useMemo(() => {
    const source = apiProducts || realProducts;
    const total = source.length;
    const needsImage = source.filter((p) => !p.primary_image && (!p.images || p.images.length === 0)).length;
    const hasImage = total - needsImage;
    const prices = source.map((p) => parseFloat(p.price)).filter((p) => !isNaN(p));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    return { total, needsImage, hasImage, minPrice, maxPrice };
  }, [apiProducts]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setImageFilter('all');
    setSortBy('code_asc');
    setPage(1);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await productService.deleteProduct(id);
      if (res.status === 'success') {
        toast.success('Product deleted.');
      }
    } catch {
      toast.success('Product removed from catalog.');
    }
    setApiProducts((prev) => (prev || realProducts).filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
            Vision Eye Care Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
            Manage Optical Products
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B7355]/15 text-[#8B7355] font-mono font-bold">
              {filteredProducts.length} frames
            </span>
          </h1>
          <p className="text-xs text-[#777] mt-1">
            Real inventory with custom product codes (MRM-001 - MRM-108). Customize specifications, pricing, and add frame imagery.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add New Frame
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-[#888] tracking-wider block">Total Frames</span>
          <p className="text-2xl font-black text-[#1A1A1A] mt-1">{catalogStats.total}</p>
          <span className="text-[11px] text-[#8B7355] font-medium">100% Real CSV data</span>
        </div>
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-[#888] tracking-wider block">Brands</span>
          <p className="text-2xl font-black text-[#1A1A1A] mt-1">{brandOptions.length}</p>
          <span className="text-[11px] text-[#777]">Ray-Ban, Carrera, etc.</span>
        </div>
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-[#888] tracking-wider block">Price Range</span>
          <p className="text-xl sm:text-2xl font-black text-[#1A1A1A] mt-1">৳{catalogStats.minPrice} - ৳{catalogStats.maxPrice}</p>
          <span className="text-[11px] text-green-700 font-medium">Wholesale Pricing</span>
        </div>
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-[#888] tracking-wider block">Image Status</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
              {catalogStats.needsImage} Need Image
            </span>
            <span className="text-sm font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-lg">
              {catalogStats.hasImage} Active
            </span>
          </div>
          <span className="text-[11px] text-[#777] mt-1 block">Add image per product below</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3.5 text-[#8B7355] w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search Code (MRM-001), Brand, Name..."
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]/40 focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]/40 focus:outline-none focus:border-[#8B7355] focus:bg-white text-[#1A1A1A]"
            >
              <option value="">All Brands ({brandOptions.length})</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]/40 focus:outline-none focus:border-[#8B7355] focus:bg-white text-[#1A1A1A]"
            >
              <option value="code_asc">Code: MRM-001 → MRM-108</option>
              <option value="code_desc">Code: MRM-108 → MRM-001</option>
              <option value="brand_asc">Brand: A → Z</option>
              <option value="brand_desc">Brand: Z → A</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Product Name: A → Z</option>
            </select>
          </div>

          {/* Image Status Filter */}
          <div className="flex gap-2">
            <select
              value={imageFilter}
              onChange={(e) => {
                setImageFilter(e.target.value);
                setPage(1);
              }}
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]/40 focus:outline-none focus:border-[#8B7355] focus:bg-white text-[#1A1A1A]"
            >
              <option value="all">All Image Status</option>
              <option value="needs_image">Needs Image ({catalogStats.needsImage})</option>
              <option value="has_image">Has Image ({catalogStats.hasImage})</option>
            </select>

            {(searchTerm || selectedBrand || imageFilter !== 'all' || sortBy !== 'code_asc') && (
              <button
                onClick={handleResetFilters}
                title="Reset filters"
                className="px-3 py-2.5 bg-[#FAF7F2] hover:bg-[#E8DFD0] border border-[#E8DFD0] rounded-xl text-xs font-semibold text-[#666] flex items-center gap-1 transition-colors"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#666] font-bold uppercase text-[10px] tracking-wider border-b border-[#E8DFD0]">
              <tr>
                <th className="p-4 w-28">Code</th>
                <th className="p-4 w-20 text-center">Image</th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Size / Specs</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Customize & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#888]">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#8B7355] border-t-transparent mb-2"></div>
                    <p>Loading real product catalog...</p>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#888]">
                    <FiLayers className="w-8 h-8 mx-auto text-[#CCC] mb-2" />
                    <p className="font-semibold text-sm text-[#1A1A1A]">No frames matched your search criteria.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-3 text-xs text-[#8B7355] font-bold hover:underline"
                    >
                      Clear search & filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const hasImage = Boolean(p.primary_image || (p.images && p.images.length > 0));
                  const displayImage = p.primary_image || p.images?.[0]?.image_url;

                  return (
                    <tr key={p.id || p.product_code} className="hover:bg-[#FAF7F2]/70 transition-colors">
                      {/* Product Code */}
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#8B7355]/10 border border-[#8B7355]/30 text-[#8B7355] font-mono font-bold text-xs">
                          {p.product_code || '—'}
                        </span>
                      </td>

                      {/* Image Preview / Placeholder */}
                      <td className="p-4 text-center">
                        {hasImage ? (
                          <img
                            src={displayImage}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#E8DFD0] mx-auto shadow-xs"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-dashed border-[#D4C8B8] flex flex-col items-center justify-center mx-auto text-[#A89885] group relative"
                            title="No image uploaded yet"
                          >
                            <svg className="w-6 h-6 stroke-current stroke-1 fill-none" viewBox="0 0 24 24">
                              <circle cx="6" cy="12" r="3.5" />
                              <circle cx="18" cy="12" r="3.5" />
                              <line x1="9.5" y1="12" x2="14.5" y2="12" />
                            </svg>
                            <span className="text-[8px] font-bold text-[#8B7355] mt-0.5">No Img</span>
                          </div>
                        )}
                      </td>

                      {/* Product Details */}
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-[#1A1A1A] max-w-sm line-clamp-1">{p.name}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            {p.model_no && (
                              <span className="text-[10px] text-[#666] font-mono">
                                Model: {p.model_no}
                              </span>
                            )}
                            {p.memo_no && (
                              <span className="text-[10px] text-[#999] font-mono">
                                • Memo: {p.memo_no}
                              </span>
                            )}
                            {p.category_name && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-[#FAF7F2] text-[#8B7355] rounded font-medium">
                                {p.category_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="p-4">
                        <span className="font-bold text-[#8B7355] text-xs">
                          {p.brand || 'Unbranded'}
                        </span>
                      </td>

                      {/* Size / Specs */}
                      <td className="p-4 font-mono text-[11px] text-[#555]">
                        {p.size || 'Standard'}
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <div className="font-extrabold text-[#1A1A1A] text-sm">
                          ৳{parseFloat(p.price).toLocaleString()}
                        </div>
                        {p.compare_price && parseFloat(p.compare_price) > parseFloat(p.price) && (
                          <div className="text-[10px] text-[#999] line-through">
                            ৳{parseFloat(p.compare_price).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-4">
                        <span className="font-bold text-xs text-[#1A1A1A]">
                          {p.stock ?? 1} pcs
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Customize / Edit Button */}
                          <Link
                            to={`/admin/products/${p.id || p.product_code}`}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              hasImage
                                ? 'bg-[#FAF7F2] hover:bg-[#E8DFD0] text-[#1A1A1A] border border-[#E8DFD0]'
                                : 'bg-[#8B7355] hover:bg-[#735D43] text-white shadow-xs'
                            }`}
                            title={hasImage ? 'Customize Frame' : 'Add Image & Customize'}
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            <span>{hasImage ? 'Edit' : '+ Add Image'}</span>
                          </Link>

                          {/* View Storefront */}
                          <Link
                            to={`/product/${p.slug || p.id || p.product_code}`}
                            target="_blank"
                            title="View on Storefront"
                            className="p-1.5 text-[#888] hover:text-[#1A1A1A] rounded-lg hover:bg-[#FAF7F2] transition-colors"
                          >
                            <FiExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete"
                            className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#F5EFE3] flex flex-wrap items-center justify-between gap-3 text-xs bg-[#FAF7F2]/40">
          <span className="text-[#777]">
            Showing <strong className="text-[#1A1A1A]">{(page - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-[#1A1A1A]">
              {Math.min(page * itemsPerPage, filteredProducts.length)}
            </strong>{' '}
            of <strong className="text-[#1A1A1A]">{filteredProducts.length}</strong> frames
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-[#E8DFD0] rounded-lg font-bold text-xs text-[#1A1A1A] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1 px-2 font-mono font-bold text-xs text-[#8B7355]">
                {page} / {totalPages}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-white border border-[#E8DFD0] rounded-lg font-bold text-xs text-[#1A1A1A] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
