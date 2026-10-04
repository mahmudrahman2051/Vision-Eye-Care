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
  isDrawer = false,
}) => {
  const activeSubcategories = categories.find(
    (c) => c.id === parseInt(filters.category) || c.slug === filters.category
  )?.subcategories || [];

  return (
    <div className={`bg-white text-[#1A1A1A] ${isDrawer ? 'space-y-5 p-1' : 'border border-[#E8DFD0] rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm'}`}>
      {/* Header */}
      {!isDrawer && (
        <div className="flex items-center justify-between pb-4 border-b border-[#F5EFE3]">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <FiFilter className="text-[#8B7355]" /> Filters
          </h3>
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-[#888] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
          >
            <FiRotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}

      {/* Search Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-2">
          Search Frames
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-3.5 text-[#8B7355] w-4 h-4" />
          <input
            type="text"
            placeholder="Name, brand, shape..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl pl-10 pr-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all placeholder:text-[#999]"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-2">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => {
            onFilterChange('category', e.target.value);
            onFilterChange('subcategory', '');
          }}
          className="w-full bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all cursor-pointer font-medium"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.product_count || 0})
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      {activeSubcategories.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-2">
            Subcategory
          </label>
          <select
            value={filters.subcategory || ''}
            onChange={(e) => onFilterChange('subcategory', e.target.value)}
            className="w-full bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all cursor-pointer font-medium"
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
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-2">
          Gender
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-[#F5EFE3]/50 p-1.5 rounded-xl border border-[#E8DFD0]">
          {genders.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => onFilterChange('gender', g.value)}
              className={`py-1.5 px-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all text-center truncate ${
                (filters.gender || '') === g.value
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame Shape */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-2">
          Frame Shape
        </label>
        <select
          value={filters.frame_shape || ''}
          onChange={(e) => onFilterChange('frame_shape', e.target.value)}
          className="w-full bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all cursor-pointer font-medium"
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
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-2">
          Price Range (৳ BDT)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min (৳)"
            value={filters.min_price || ''}
            onChange={(e) => onFilterChange('min_price', e.target.value)}
            className="w-1/2 min-w-0 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
          />
          <span className="text-[#888] text-xs flex-shrink-0">-</span>
          <input
            type="number"
            placeholder="Max (৳)"
            value={filters.max_price || ''}
            onChange={(e) => onFilterChange('max_price', e.target.value)}
            className="w-1/2 min-w-0 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
          />
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-3 border-t border-[#F5EFE3] flex items-center justify-between">
        <span className="text-xs font-bold text-[#333]">In Stock Only</span>
        <input
          type="checkbox"
          checked={filters.in_stock === 'true'}
          onChange={(e) => onFilterChange('in_stock', e.target.checked ? 'true' : '')}
          className="h-4 w-4 border-[#E8DFD0] rounded text-[#8B7355] focus:ring-[#8B7355] cursor-pointer"
        />
      </div>

      {/* Mobile Drawer Action Buttons */}
      {isDrawer && (
        <div className="pt-4 flex gap-3">
          <button
            onClick={onResetFilters}
            className="w-1/2 py-2.5 px-3 bg-[#F5EFE3] text-[#1A1A1A] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#E8DFD0] transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
