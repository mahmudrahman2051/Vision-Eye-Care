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
  } = product;

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

  // Image fallback SVG generator
  const defaultImage = `https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80`;

  return (
    <div className="group relative bg-[#0B0B0B] border border-[#292929] hover:border-[#DFFF00]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#DFFF00]/5 flex flex-col h-full">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-[#DFFF00] text-black rounded-md shadow-md">
            -{discountPercent}% OFF
          </span>
        )}
        {bestseller && !hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-amber-400 text-black rounded-md shadow-md">
            🔥 Best Seller
          </span>
        )}
        {new_arrival && !bestseller && !hasDiscount && (
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-blue-500 text-white rounded-md shadow-md">
            NEW
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-full border transition-all duration-200 ${
          isWishlisted
            ? 'bg-red-500/20 border-red-500 text-red-500'
            : 'bg-[#050505]/70 border-[#292929] text-gray-400 hover:text-white hover:border-[#DFFF00]'
        }`}
        aria-label="Wishlist"
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
      </button>

      {/* Product Image Area */}
      <Link to={`/product/${slug || id}`} className="relative aspect-[4/3] bg-[#141414] overflow-hidden block">
        <img
          src={primary_image || defaultImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-4 py-2 bg-[#050505]/90 text-[#DFFF00] border border-[#DFFF00]/40 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <FiEye className="w-4 h-4" /> Quick View
          </span>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-[#0B0B0B]">
        <div>
          {/* Category & Frame shape tags */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 uppercase tracking-wider mb-2 font-medium">
            <span className="text-[#DFFF00] font-semibold">{category_name || 'Eyewear'}</span>
            {frame_shape && <span>• {frame_shape}</span>}
          </div>

          {/* Product Title */}
          <Link to={`/product/${slug || id}`} className="block">
            <h3 className="text-base font-bold text-white group-hover:text-[#DFFF00] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center text-amber-400 text-xs">
              <FiStar className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-gray-200">
              {parseFloat(average_rating || 5.0).toFixed(1)}
            </span>
            <span className="text-[11px] text-gray-500">({review_count || 0})</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="mt-4 pt-3 border-t border-[#1C1C1C] flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white">
                ${numericPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">
                  ${numericComparePrice.toFixed(2)}
                </span>
              )}
            </div>
            {stock <= 0 ? (
              <span className="text-[10px] text-red-400 font-semibold uppercase">Out of Stock</span>
            ) : stock <= 5 ? (
              <span className="text-[10px] text-amber-400 font-semibold uppercase">Only {stock} Left</span>
            ) : (
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">In Stock</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="p-3 bg-[#171717] hover:bg-[#DFFF00] text-white hover:text-black rounded-xl border border-[#292929] hover:border-[#DFFF00] active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:hover:bg-[#171717] disabled:hover:text-white"
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
