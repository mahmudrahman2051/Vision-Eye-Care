import React from 'react';
import { FiFilter, FiRotateCcw, FiSearch } from 'react-icons/fi';

const frameShapes = ['Rectangle', 'Round', 'Aviator', 'Cat Eye', 'Square'];
const genders = [
  { value: '', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
];

const ProductFilters = ({
  categories = [],
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const activeSubcategories = categories.find(
    (c) => c.id === parseInt(filters.category) || c.slug === filters.category
  )?.subcategories || [];

  return (
    <div className="bg-[#0B0B0B] border border-[#292929] rounded-2xl p-6 space-y-6 text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#292929]">
        <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FiFilter className="text-[#DFFF00]" /> Filters
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-gray-400 hover:text-[#DFFF00] flex items-center gap-1 transition-colors"
        >
          <FiRotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Search Products
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Name, brand, frame..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-[#171717] border border-[#292929] rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DFFF00] transition-colors"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => {
            onFilterChange('category', e.target.value);
            onFilterChange('subcategory', '');
          }}
          className="w-full bg-[#171717] border border-[#292929] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DFFF00] transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.product_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory (If category selected) */}
      {activeSubcategories.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Subcategory
          </label>
          <select
            value={filters.subcategory || ''}
            onChange={(e) => onFilterChange('subcategory', e.target.value)}
            className="w-full bg-[#171717] border border-[#292929] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DFFF00] transition-colors"
          >
            <option value="">All Subcategories</option>
            {activeSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Gender */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Gender
        </label>
        <div className="grid grid-cols-5 gap-1 bg-[#171717] p-1 rounded-xl border border-[#292929]">
          {genders.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => onFilterChange('gender', g.value)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                (filters.gender || '') === g.value
                  ? 'bg-[#DFFF00] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Shape */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Frame Shape
        </label>
        <select
          value={filters.frame_shape || ''}
          onChange={(e) => onFilterChange('frame_shape', e.target.value)}
          className="w-full bg-[#171717] border border-[#292929] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DFFF00] transition-colors"
        >
          <option value="">All Shapes</option>
          {frameShapes.map((shape) => (
            <option key={shape} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Price Range ($)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-1/2 bg-[#171717] border border-[#292929] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#DFFF00]"
          />
          <span className="text-gray-500 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => onFilterChange('max_price', e.target.value)}
            className="w-1/2 bg-[#171717] border border-[#292929] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#DFFF00]"
          />
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-[#292929] flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300">In Stock Only</span>
        <input
          type="checkbox"
          checked={filters.in_stock === 'true'}
          onChange={(e) => onFilterChange('in_stock', e.target.checked ? 'true' : '')}
          className="h-4 w-4 bg-[#171717] border-[#292929] rounded text-[#DFFF00] focus:ring-[#DFFF00]"
        />
      </div>
    </div>
  );
};

export default ProductFilters;
