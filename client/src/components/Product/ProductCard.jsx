import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const {
    id, name, slug, price, compare_price, primary_image, product_code, sku,
    stock, bestseller, new_arrival, average_rating, review_count, brand,
  } = product || {};

  const displayCode = product_code || sku || '';
  const isWishlisted = isInWishlist(product?.product_id || id);

  const cardImage =
    primary_image ||
    product?.image_url ||
    (Array.isArray(product?.images) && product.images.length > 0
      ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.image_url || product.images[0]?.url))
      : null);

  const numericPrice = parseFloat(price) || 0;
  const numericComparePrice = parseFloat(compare_price) || 0;
  const hasDiscount = numericComparePrice > numericPrice;
  const discountPercent = hasDiscount
    ? Math.round(((numericComparePrice - numericPrice) / numericComparePrice) * 100)
    : 0;

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Badge text matching reference website: "NEW", "-10%", "BESTSELLER"
  let badgeLabel = null;
  if (hasDiscount) {
    badgeLabel = `-${discountPercent}%`;
  } else if (new_arrival) {
    badgeLabel = 'NEW';
  } else if (bestseller) {
    badgeLabel = 'HOT';
  }

  return (
    <div className="group relative bg-white border border-neutral-200/80 hover:border-black rounded-none transition-all duration-300 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[350px]">
      {/* Editorial Badge (Black sharp rectangle top-left) */}
      {badgeLabel && (
        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-black text-white rounded-none tracking-widest uppercase">
          {badgeLabel}
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full transition-all cursor-pointer ${
          isWishlisted
            ? 'bg-red-50 text-red-500'
            : 'bg-white/90 text-neutral-400 hover:text-black hover:bg-neutral-100 shadow-xs'
        }`}
        aria-label="Wishlist"
      >
        <FiHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image Container */}
      <Link
        to={`/product/${slug || id}`}
        className="relative h-40 sm:h-52 w-full bg-[#FAFAFA] border-b border-neutral-100 overflow-hidden block flex-shrink-0 flex items-center justify-center p-3 group-hover:bg-[#F4F4F5] transition-colors"
      >
        {cardImage ? (
          <img
            src={cardImage}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center select-none">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400 group-hover:text-black transition-colors group-hover:scale-105 duration-300"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="19" cy="34" r="13" />
              <circle cx="45" cy="34" r="13" />
              <path d="M32 32c1-2 3-3 5-3s4 1 5 3" />
              <path d="M6 31l4-1" />
              <path d="M58 31l-4-1" />
            </svg>
            <span className="mt-1 text-[9px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
              {displayCode || 'Optical Frame'}
            </span>
          </div>
        )}
      </Link>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">
              {brand || 'Vision Eye Care'}
            </p>
            {displayCode && (
              <span className="text-[9px] font-mono font-bold text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded-none border border-neutral-200 flex-shrink-0">
                {displayCode}
              </span>
            )}
          </div>
          <Link to={`/product/${slug || id}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 group-hover:text-black transition-colors line-clamp-1 leading-snug tracking-tight">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 sm:mt-1.5">
            <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] sm:text-xs font-semibold text-neutral-800">
              {parseFloat(average_rating || 4.8).toFixed(1)}
            </span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400">
              ({review_count || 12})
            </span>
          </div>
        </div>

        {/* Price + Action Button */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
            <span className="text-sm sm:text-base font-bold text-black tracking-tight">
              Tk {Math.round(numericPrice).toLocaleString()}.00
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                Tk {Math.round(numericComparePrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="p-2 sm:px-3 sm:py-2 bg-black hover:bg-neutral-800 text-white rounded-none transition-colors disabled:opacity-30 cursor-pointer flex items-center justify-center"
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
