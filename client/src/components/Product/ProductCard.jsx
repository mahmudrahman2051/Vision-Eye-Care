import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    id, name, slug, price, compare_price, primary_image,
    stock, bestseller, new_arrival, average_rating, review_count, brand,
  } = product || {};

  const numericPrice = parseFloat(price) || 0;
  const numericComparePrice = parseFloat(compare_price) || 0;
  const hasDiscount = numericComparePrice > numericPrice;
  const discountPercent = hasDiscount
    ? Math.round(((numericComparePrice - numericPrice) / numericComparePrice) * 100)
    : 0;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(!isWishlisted ? 'Added to Wishlist' : 'Removed from Wishlist');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to Cart');
  };

  const defaultImage = 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white border border-[#E8DFD0] hover:border-[#8B7355]/40 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-[340px]">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[10px] font-bold bg-[#1A1A1A] text-white rounded">
          -{discountPercent}%
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full transition-all ${
          isWishlisted
            ? 'bg-red-50 text-red-500'
            : 'bg-white/90 text-[#999] hover:text-red-500'
        }`}
        aria-label="Wishlist"
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
      </button>

      {/* Image */}
      <Link
        to={`/product/${slug || id}`}
        className="relative h-40 w-full bg-[#F5EFE3]/30 overflow-hidden block flex-shrink-0"
      >
        <img
          src={primary_image || defaultImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
        />
      </Link>

      {/* Info */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-[11px] font-medium text-[#8B7355] uppercase tracking-wide mb-0.5">
            {brand || 'Vision Care'}
          </p>
          <Link to={`/product/${slug || id}`}>
            <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#8B7355] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-[#333]">
              {parseFloat(average_rating || 4.5).toFixed(1)}
            </span>
            <span className="text-[11px] text-[#999]">
              ({review_count || 0})
            </span>
          </div>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F5EFE3]">
          <div>
            <span className="text-base font-bold text-[#1A1A1A]">
              ৳{Math.round(numericPrice).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#999] line-through ml-1.5">
                ৳{Math.round(numericComparePrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="p-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white rounded-lg transition-colors disabled:opacity-30"
            title="Add to Cart"
          >
            <FiShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
