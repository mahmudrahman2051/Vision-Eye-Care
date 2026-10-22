import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import productService from '../../services/productService';
import { realProducts } from '../../data/realProducts';

const popularSearches = ['MRM-001', 'Ray-Ban', 'Moscot', 'Tom Ford', 'Oakley', 'Dior', 'Titan', 'Kids'];

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.trim().toLowerCase();
      try {
        const res = await productService.getProducts({ search: query.trim(), limit: 6 });
        if (res.status === 'success' && res.data.products && res.data.products.length > 0) {
          setResults(res.data.products);
        } else {
          // Fallback to local real catalog
          const localResults = realProducts.filter((p) =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.product_code && p.product_code.toLowerCase().includes(q)) ||
            (p.sku && p.sku.toLowerCase().includes(q)) ||
            (p.model_no && p.model_no.toLowerCase().includes(q))
          ).slice(0, 6);
          setResults(localResults);
        }
      } catch {
        const localResults = realProducts.filter((p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.product_code && p.product_code.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.model_no && p.model_no.toLowerCase().includes(q))
        ).slice(0, 6);
        setResults(localResults);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleChipClick = (term) => {
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center pt-20 px-4 animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-gray-700 hover:text-gray-900 p-2 text-2xl transition-colors"
        aria-label="Close search"
      >
        <FiX />
      </button>

      <div className="w-full max-w-3xl space-y-8">
        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="relative">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-yellow-600 w-6 h-6" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product code, name, or brand (e.g. MRM-001, Ray-Ban, Moscot)..."
            className="w-full bg-[#FEFCE8] border-2 border-[#DFFF00] focus:border-yellow-400 rounded-2xl pl-14 pr-16 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none transition-colors shadow-xl"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 text-sm uppercase font-bold"
            >
              Clear
            </button>
          )}
        </form>

        {/* Popular Searches */}
        {!query && (
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-700 flex items-center gap-2">
              <FiTrendingUp className="text-yellow-600" /> Popular Searches in Vision Eye Care
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleChipClick(term)}
                  className="px-4 py-2 bg-[#FEFCE8] hover:bg-[#DFFF00] text-gray-900 border border-yellow-300 rounded-xl text-xs font-bold transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="bg-white border-2 border-yellow-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-yellow-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                {loading ? 'Searching...' : `Results for "${query}" (${results.length})`}
              </span>
              {results.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="text-xs font-extrabold text-yellow-800 hover:underline flex items-center gap-1"
                >
                  View All Results <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-500 animate-pulse">
                Fetching frames matching "{query}"...
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No matching optical frames found for "{query}". Try a Product Code like "MRM-001" or brand like "Ray-Ban".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug || product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 bg-yellow-50/50 hover:bg-[#FEFCE8] border border-yellow-200 hover:border-[#DFFF00] rounded-xl transition-all group"
                  >
                    <div className="w-16 h-16 bg-[#FAF7F2] rounded-lg overflow-hidden flex-shrink-0 border border-yellow-200 flex items-center justify-center">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 text-[#8B7355]/40"
                          viewBox="0 0 64 64"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="19" cy="34" r="13" />
                          <circle cx="45" cy="34" r="13" />
                          <path d="M32 32c1-2 3-3 5-3s4 1 5 3" />
                          <path d="M6 31l4-1" />
                          <path d="M58 31l-4-1" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-yellow-800 uppercase truncate">
                          {product.brand || 'Vision Eye Care'}
                        </p>
                        {(product.product_code || product.sku) && (
                          <span className="font-mono text-[10px] font-bold text-gray-700 bg-white border border-yellow-300 px-1.5 py-0.2 rounded">
                            {product.product_code || product.sku}
                          </span>
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-gray-900 truncate group-hover:text-yellow-700 transition-colors">
                        {product.name}
                      </h5>
                      <p className="text-xs font-extrabold text-gray-900 mt-0.5">৳{Math.round(parseFloat(product.price)).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
