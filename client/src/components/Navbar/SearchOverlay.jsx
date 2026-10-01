import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import productService from '../../services/productService';

const popularSearches = ['Aviator', 'Ray-Ban', 'Titanium', 'Blue Light', 'Sunglasses', 'Rectangle'];

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

  // Debounced search API call
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ search: query.trim(), limit: 4 });
        if (res.status === 'success') {
          setResults(res.data.products);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

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
            placeholder="Search eyewear by brand, shape, or material (e.g. Aviator, Titanium)..."
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
              <FiTrendingUp className="text-yellow-600" /> Popular Searches in Bangladesh
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
                {loading ? 'Searching...' : `Results for "${query}"`}
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
                No matching frames found for "{query}". Try another term like "Wayfarer" or "Sunglasses".
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
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-yellow-200">
                      <img
                        src={product.primary_image || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-yellow-800 uppercase truncate">
                        {product.brand || 'Vision Eye Care'}
                      </p>
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
