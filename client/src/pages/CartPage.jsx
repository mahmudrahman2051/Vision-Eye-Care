import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiPlus, FiMinus, FiTag, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import couponService from '../services/couponService';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, deliveryFee, total, cartCount } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    couponService.getActiveCoupons().then((list) => {
      if (Array.isArray(list)) setAvailableCoupons(list);
    });

    const handleUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        setAvailableCoupons(e.detail.filter((c) => Boolean(c.is_active)));
      }
    };
    window.addEventListener('coupons-updated', handleUpdate);
    return () => window.removeEventListener('coupons-updated', handleUpdate);
  }, []);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault?.();
    const targetCode = (couponCode || '').trim();
    if (!targetCode) {
      toast.error('Enter a coupon code.');
      return;
    }
    setCheckingCoupon(true);
    try {
      const res = await couponService.validateCoupon(targetCode, subtotal);
      if (res.status === 'success') {
        setAppliedCoupon(res.data);
        toast.success(`Coupon "${res.data.code}" applied! You saved ৳${res.data.discount_amount}`);
      }
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || 'Invalid coupon.');
      setAppliedCoupon(null);
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleQuickApply = async (code) => {
    setCouponCode(code);
    setCheckingCoupon(true);
    try {
      const res = await couponService.validateCoupon(code, subtotal);
      if (res.status === 'success') {
        setAppliedCoupon(res.data);
        toast.success(`Coupon "${res.data.code}" applied! You saved ৳${res.data.discount_amount}`);
      }
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || 'Could not apply coupon.');
      setAppliedCoupon(null);
    } finally {
      setCheckingCoupon(false);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[#E8DFD0] pb-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Shopping Bag
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Your Selected Frames ({cartCount})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-12 text-center my-6 flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 bg-[#F5EFE3] text-[#8B7355] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#E8DFD0]">
              <FiShoppingBag />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">Your Cart is Empty</h3>
            <p className="text-xs text-[#777] max-w-md mb-6 font-medium">
              Explore our wide collection of glasses, sunglasses, and contact lenses to add items to your cart.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-[#1A1A1A] text-white font-bold rounded-xl hover:bg-[#8B7355] transition-colors text-xs uppercase tracking-wider"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E8DFD0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:border-[#8B7355]/40 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 bg-[#F5EFE3]/40 rounded-xl overflow-hidden flex-shrink-0 border border-[#E8DFD0]">
                    <img
                      src={
                        item.primary_image ||
                        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <p className="text-[10px] font-bold text-[#8B7355] uppercase tracking-wider">
                      {item.brand || 'VISION EYE CARE'}
                    </p>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{item.name}</h3>
                    <div className="text-sm font-extrabold text-[#1A1A1A]">
                      ৳{parseFloat(item.price).toLocaleString()}
                      {item.compare_price && parseFloat(item.compare_price) > parseFloat(item.price) && (
                        <span className="text-xs text-[#999] line-through ml-2 font-normal">
                          ৳{parseFloat(item.compare_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center border border-[#E8DFD0] rounded-xl bg-[#F5EFE3]/30 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-[#555] hover:text-[#1A1A1A] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1A1A1A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-[#555] hover:text-[#1A1A1A] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 space-y-5 shadow-sm sticky top-36 sm:top-40">
                <h2 className="text-base font-bold text-[#1A1A1A] pb-3 border-b border-[#F5EFE3]">
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1.5 flex items-center gap-1.5">
                    <FiTag className="text-[#8B7355]" /> Promo Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-xl text-xs">
                      <span className="font-bold text-green-800">{appliedCoupon.code} (-৳{discountAmount})</span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-red-500 font-bold hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. WELCOME10"
                        className="flex-1 text-xs p-2 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] uppercase focus:outline-none focus:border-[#8B7355]"
                      />
                      <button
                        type="submit"
                        disabled={checkingCoupon}
                        className="px-3 py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold hover:bg-[#8B7355] transition-colors disabled:opacity-50"
                      >
                        {checkingCoupon ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}

                  {/* Available Coupons Quick-Select List */}
                  {availableCoupons.length > 0 && (
                    <div className="space-y-2 pt-2.5 border-t border-[#F5EFE3] mt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1A1A1A]">
                        <span className="flex items-center gap-1.5 text-[#8B7355]">
                          <FiTag className="w-3.5 h-3.5" /> Available Offers
                        </span>
                        <span className="text-[10px] text-[#777] font-semibold">{availableCoupons.length} Active</span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {availableCoupons.map((c) => {
                          const isApplied = appliedCoupon?.code === c.code;
                          const minOrder = parseFloat(c.min_order_amount) || 0;
                          const isEligible = minOrder === 0 || subtotal >= minOrder;

                          return (
                            <div
                              key={c.code}
                              className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                                isApplied
                                  ? 'bg-green-50/80 border-green-300'
                                  : 'bg-[#FAF7F2] border-[#E8DFD0] hover:border-[#8B7355]/40'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-black text-xs text-[#8B7355]">{c.code}</span>
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#8B7355]/15 text-[#8B7355]">
                                    {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `৳${c.discount_value} OFF`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#666] truncate mt-0.5">{c.description}</p>
                                {minOrder > 0 && (
                                  <span className="text-[9px] text-[#999] block">
                                    Min. Order: ৳{minOrder.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => (isApplied ? setAppliedCoupon(null) : handleQuickApply(c.code))}
                                disabled={checkingCoupon || (!isEligible && !isApplied)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                                  isApplied
                                    ? 'bg-green-600 text-white'
                                    : isEligible
                                    ? 'bg-[#1A1A1A] hover:bg-[#8B7355] text-white shadow-xs'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed text-[10px]'
                                }`}
                              >
                                {isApplied ? 'Applied ✓' : isEligible ? 'Apply' : `৳${minOrder - subtotal} more`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs border-t border-[#F5EFE3] pt-3">
                  <div className="flex justify-between text-[#666]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1A1A1A]">৳{subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-bold">
                      <span>Discount</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#666]">
                    <span>Estimated Delivery (Inside BD)</span>
                    <span className="font-bold text-[#1A1A1A]">
                      {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#F5EFE3] flex justify-between text-sm font-bold text-[#1A1A1A]">
                    <span>Total Amount</span>
                    <span className="text-[#8B7355] text-base">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1A1A1A] hover:bg-[#8B7355] text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider shadow-md"
                >
                  Proceed to Checkout <FiArrowRight className="w-4 h-4" />
                </Link>

                <div className="text-[11px] text-[#888] text-center pt-2">
                  🔒 Safe & Secure Checkout with bKash, Nagad, Visa, Mastercard or Cash on Delivery.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
