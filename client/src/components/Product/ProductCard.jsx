import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    id,
    name,
    slug,
    price,
    compare_price,
    primary_image,
    category_name,
    frame_shape,
    stock,
    new_arrival,
    bestseller,
    average_rating,
    review_count,
    brand,
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
    if (!isWishlisted) {
      toast.success(`Added ${name} to Wishlist!`);
    } else {
      toast.success(`Removed from Wishlist`);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`Added ${name} to Cart!`);
  };

  const defaultImage = `https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80`;

  return (
    <div className="group relative bg-white border border-yellow-200 hover:border-[#DFFF00] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-[390px] justify-between">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase bg-[#DFFF00] text-gray-900 border border-yellow-400 rounded shadow-xs">
            -{discountPercent}% OFF
          </span>
        )}
        {bestseller && !hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase bg-[#DFFF00] text-gray-900 border border-yellow-400 rounded shadow-xs">
            Best Seller
          </span>
        )}
        {new_arrival && !bestseller && !hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-black uppercase bg-yellow-100 text-gray-900 border border-yellow-300 rounded shadow-xs">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-full border transition-all duration-200 ${
          isWishlisted
            ? 'bg-red-50 border-red-200 text-red-500'
            : 'bg-white/90 backdrop-blur border-yellow-200 text-gray-400 hover:text-yellow-600 hover:border-[#DFFF00]'
        }`}
        aria-label="Wishlist"
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
      </button>

      {/* Product Image Area - Fixed 176px (h-44) */}
      <Link to={`/product/${slug || id}`} className="relative h-44 w-full bg-yellow-50/50 overflow-hidden block flex-shrink-0">
        <img
          src={primary_image || defaultImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-yellow-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-4 py-2 bg-[#DFFF00] text-gray-900 border border-yellow-400 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <FiEye className="w-4 h-4" /> Quick View
          </span>
        </div>
      </Link>

      {/* Product Details Area - Remaining Height */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-white">
        <div>
          {/* Brand & Shape */}
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-yellow-700 mb-1">
            <span>{brand || 'RAY-BAN'}</span>
            {frame_shape && <span className="text-gray-400 font-normal">• {frame_shape}</span>}
          </div>

          {/* Product Title */}
          <Link to={`/product/${slug || id}`} className="block">
            <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-amber-500 text-xs">
              <FiStar className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-gray-900">
              {parseFloat(average_rating || 5.0).toFixed(1)}
            </span>
            <span className="text-[11px] text-gray-400">({review_count || 0})</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-2 pt-2 border-t border-yellow-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-gray-900">
                ${numericPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ${numericComparePrice.toFixed(2)}
                </span>
              )}
            </div>
            {stock <= 0 ? (
              <span className="text-[10px] text-red-600 font-semibold uppercase">Out of Stock</span>
            ) : stock <= 5 ? (
              <span className="text-[10px] text-amber-600 font-semibold uppercase">Only {stock} Left</span>
            ) : (
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">In Stock</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="p-2.5 bg-[#DFFF00] hover:bg-yellow-400 text-gray-900 border border-yellow-500 rounded-xl font-bold active:scale-95 transition-all shadow disabled:opacity-30"
            title="Add to Cart"
          >
            <FiShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
