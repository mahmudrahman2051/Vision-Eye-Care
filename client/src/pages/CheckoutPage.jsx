import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiShield, FiTag, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import orderService from '../services/orderService';
import couponService from '../services/couponService';
import userService from '../services/userService';
import { trackInitiateCheckout } from '../utils/facebookPixel';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useSettings();

  // Shipping Form State
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: 'Dhaka',
    shipping_area: '',
    shipping_postal_code: '',
    payment_method: 'cod',
    notes: '',
  });

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  // Autofill user information if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        shipping_name: prev.shipping_name || user.full_name || user.name || '',
        shipping_phone: prev.shipping_phone || user.phone || '',
      }));

      // Fetch saved addresses
      userService.getAddresses()
        .then((res) => {
          if (res.status === 'success' && res.data.length > 0) {
            setSavedAddresses(res.data);
            const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
              applyAddress(defaultAddr);
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Track InitiateCheckout on checkout mount
  useEffect(() => {
    if (cartItems.length > 0) {
      trackInitiateCheckout(cartItems, subtotal);
    }
  }, []);

  const applyAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      shipping_name: addr.full_name || prev.shipping_name,
      shipping_phone: addr.phone || prev.shipping_phone,
      shipping_address: addr.address || prev.shipping_address,
      shipping_city: addr.city || prev.shipping_city,
      shipping_area: addr.area || '',
      shipping_postal_code: addr.postal_code || '',
    }));
  };

  const handleSavedAddressChange = (e) => {
    const addrId = e.target.value;
    setSelectedAddressId(addrId);
    if (addrId) {
      const found = savedAddresses.find((a) => a.id.toString() === addrId.toString());
      if (found) applyAddress(found);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code.');
      return;
    }

    setValidatingCoupon(true);
    try {
      const res = await couponService.validateCoupon(couponCode, subtotal);
      if (res.status === 'success') {
        setAppliedCoupon(res.data);
        toast.success(`Coupon "${res.data.code}" applied! You saved ৳${res.data.discount_amount}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon code.');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed.');
  };

  // Compute dynamic delivery fee based on store settings
  const isDhaka = (formData.shipping_city || '').toLowerCase().includes('dhaka');
  const baseDeliveryFee = isDhaka
    ? (settings?.insideDhakaFee ?? 60)
    : (settings?.outsideDhakaFee ?? 120);
  const isFreeDelivery = subtotal >= (settings?.freeShippingThreshold ?? 5000);
  const deliveryFee = cartItems.length > 0 ? (isFreeDelivery ? 0 : baseDeliveryFee) : 0;

  // Compute final amounts
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!formData.shipping_name.trim()) {
      toast.error('Recipient name is required.');
      return;
    }
    if (!formData.shipping_phone.trim()) {
      toast.error('Contact phone number is required.');
      return;
    }
    if (!formData.shipping_address.trim()) {
      toast.error('Delivery address is required.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        ...formData,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        items: cartItems.map((item) => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.status === 'success') {
        clearCart();
        toast.success('Order placed successfully!');
        const orderId = res.data.order?.id || res.data.order?.order_number;
        navigate(`/order-success/${orderId}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-[#F5EFE3] text-[#8B7355] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#E8DFD0]">
          <FiShoppingBag />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-[#777] max-w-sm mb-6">
          Please add at least one pair of frames to your shopping cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
        >
          Explore Eyewear
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex items-center justify-between border-b border-[#E8DFD0] pb-5">
          <div>
            <Link
              to="/cart"
              className="text-xs font-bold text-[#8B7355] hover:text-[#1A1A1A] flex items-center gap-1.5 mb-1 transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Cart
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Secure Checkout
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#666]">
            <FiShield className="text-[#8B7355] w-4 h-4" /> 256-Bit SSL Encrypted
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE3]">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                  <FiTruck className="text-[#8B7355]" /> 1. Delivery Information
                </h2>
                {!isAuthenticated && (
                  <span className="text-xs text-[#888]">
                    Already have an account? <Link to="/login" className="text-[#8B7355] font-bold underline">Sign In</Link>
                  </span>
                )}
              </div>

              {/* Saved Address Selector */}
              {savedAddresses.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">
                    Select Saved Address
                  </label>
                  <select
                    value={selectedAddressId}
                    onChange={handleSavedAddressChange}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  >
                    <option value="">Custom Address</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} — {addr.full_name}, {addr.address}, {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="shipping_name"
                    required
                    value={formData.shipping_name}
                    onChange={handleChange}
                    placeholder="Recipient's Name"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">
                    Phone Number (BD) *
                  </label>
                  <input
                    type="tel"
                    name="shipping_phone"
                    required
                    value={formData.shipping_phone}
                    onChange={handleChange}
                    placeholder="+880 1700-000000"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555] mb-1">
                  Full Street Address *
                </label>
                <textarea
                  name="shipping_address"
                  required
                  rows={2}
                  value={formData.shipping_address}
                  onChange={handleChange}
                  placeholder="House, Road, Block, Flat / Apartment No."
                  className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">City *</label>
                  <input
                    type="text"
                    name="shipping_city"
                    required
                    value={formData.shipping_city}
                    onChange={handleChange}
                    placeholder="e.g. Dhaka, Chittagong"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">Area / Thana</label>
                  <input
                    type="text"
                    name="shipping_area"
                    value={formData.shipping_area}
                    onChange={handleChange}
                    placeholder="e.g. Banani, Dhanmondi"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                    placeholder="1213"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#555] mb-1">
                  Delivery Notes / Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for the delivery rider"
                  className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3] flex items-center gap-2">
                <FiCheckCircle className="text-[#8B7355]" /> 2. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.payment_method === 'cod'
                      ? 'border-[#8B7355] bg-[#F5EFE3]/40 shadow-sm'
                      : 'border-[#E8DFD0] hover:border-[#8B7355]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A]">Cash on Delivery</span>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={handleChange}
                      className="accent-[#8B7355]"
                    />
                  </div>
                  <p className="text-[10px] text-[#777]">Pay in cash when frames are delivered to your door.</p>
                </label>

                {/* bKash / Nagad */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.payment_method === 'bkash'
                      ? 'border-[#8B7355] bg-[#F5EFE3]/40 shadow-sm'
                      : 'border-[#E8DFD0] hover:border-[#8B7355]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A]">bKash / Nagad</span>
                    <input
                      type="radio"
                      name="payment_method"
                      value="bkash"
                      checked={formData.payment_method === 'bkash'}
                      onChange={handleChange}
                      className="accent-[#8B7355]"
                    />
                  </div>
                  <p className="text-[10px] text-[#777]">Fast mobile wallet checkout (Bangladesh).</p>
                </label>

                {/* Card */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    formData.payment_method === 'card'
                      ? 'border-[#8B7355] bg-[#F5EFE3]/40 shadow-sm'
                      : 'border-[#E8DFD0] hover:border-[#8B7355]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A1A1A]">Debit / Credit Card</span>
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleChange}
                      className="accent-[#8B7355]"
                    />
                  </div>
                  <p className="text-[10px] text-[#777]">Visa, Mastercard, American Express.</p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-5 sticky top-36 sm:top-40">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3]">
                Order Items ({cartItems.reduce((a, b) => a + (b.quantity || 1), 0)})
              </h2>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-1 border-b border-[#FAF7F2] last:border-none">
                    <img
                      src={item.primary_image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg border border-[#E8DFD0] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#8B7355] uppercase font-bold">{item.brand}</p>
                      <p className="text-[11px] text-[#666]">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#1A1A1A]">
                        ৳{((parseFloat(item.price) || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#555] mb-1.5 flex items-center gap-1.5">
                  <FiTag className="text-[#8B7355]" /> Have a Promo Code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-green-800">{appliedCoupon.code}</span>
                      <span className="text-green-600 ml-2">(-৳{appliedCoupon.discount_amount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 font-bold hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10"
                      className="flex-1 text-xs p-2.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] uppercase focus:outline-none focus:border-[#8B7355]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon}
                      className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {validatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-[#F5EFE3] text-xs">
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
                  <span>Delivery ({isDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span className="font-bold text-[#1A1A1A]">
                    {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#F5EFE3] flex justify-between text-base font-extrabold text-[#1A1A1A]">
                  <span>Total Amount</span>
                  <span className="text-[#8B7355]">৳{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 bg-[#1A1A1A] hover:bg-[#8B7355] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Placing Your Order...' : `Confirm & Place Order (৳${finalTotal.toLocaleString()})`}
              </button>

              <p className="text-[10px] text-[#888] text-center">
                📦 24-48 Hours Delivery Across Bangladesh with Hassle-Free Exchange.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
