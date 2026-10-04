import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const initialWishlistItems = [
  {
    id: 'sp-2',
    name: 'Titanium Round Optical',
    brand: 'JOHN JACOBS',
    price: 3200,
    compare_price: 4000,
    primary_image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sp-4',
    name: 'Blue Light Block Lens',
    brand: 'LENSKART BLU',
    price: 1800,
    compare_price: 2500,
    primary_image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
  },
];

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const removeItem = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (item) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="bg-[#F5EFE3]/20 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[#E8DFD0] pb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            My Wishlist
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Saved Frames ({wishlistItems.length})
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 bg-[#F5EFE3] text-[#8B7355] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#E8DFD0]">
              <FiHeart />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#777] max-w-md mb-6 font-medium">
              Save your favorite eyeglasses and sunglasses by clicking the heart icon on any product.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-[#8B7355] transition-colors text-xs uppercase tracking-wider"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8DFD0] hover:border-[#8B7355]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-44 bg-[#F5EFE3]/30 overflow-hidden">
                  <img
                    src={item.primary_image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-wider mb-1">
                      {item.brand}
                    </p>
                    <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{item.name}</h3>
                    <div className="mt-2 text-base font-extrabold text-[#1A1A1A]">
                      ৳{item.price.toLocaleString()}
                      {item.compare_price > item.price && (
                        <span className="text-xs text-[#999] line-through ml-2 font-normal">
                          ৳{item.compare_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => moveToCart(item)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <FiShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
