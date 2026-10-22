import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiArrowLeft, FiStar, FiMapPin, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import userService from '../services/userService';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalProduct, setReviewModalProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Cancel order state
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrderById(id);
      if (res.status === 'success') {
        setOrder(res.data);
      }
    } catch (err) {
      toast.error('Could not load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await orderService.cancelOrder(order.id);
      if (res.status === 'success') {
        toast.success('Order cancelled successfully.');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalProduct) return;
    setSubmittingReview(true);
    try {
      const res = await userService.submitReview(reviewModalProduct.product_id, {
        rating,
        comment,
      });
      if (res.status === 'success') {
        toast.success('Thank you! Your review was submitted.');
        setReviewModalProduct(null);
        setComment('');
        setRating(5);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center p-6 text-xs text-[#777]">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#FAF7F2] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Order Not Found</h2>
        <Link to="/account" className="text-xs font-bold text-[#8B7355] underline">
          Back to Account
        </Link>
      </div>
    );
  }

  const currentStepIdx = STATUS_STEPS.indexOf(order.order_status);
  const isCancelled = order.order_status === 'cancelled';

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/account"
          className="text-xs font-bold text-[#8B7355] hover:text-[#1A1A1A] flex items-center gap-1.5 transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to My Account
        </Link>

        {/* Header */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider block">Order Details</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">{order.order_number}</h1>
            <p className="text-xs text-[#777]">
              Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
              order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {order.order_status}
            </span>

            {order.order_status === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-3.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-6">
            Delivery Tracking Timeline
          </h2>

          {isCancelled ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center text-xs text-red-800 font-bold flex items-center justify-center gap-2">
              <FiXCircle className="w-5 h-5 text-red-600" /> This order has been cancelled.
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2 text-center">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all ${
                        isPassed
                          ? 'bg-[#8B7355] text-white shadow-sm'
                          : 'bg-[#F5EFE3] text-[#AAA]'
                      } ${isCurrent ? 'ring-4 ring-[#8B7355]/20' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isPassed ? 'text-[#1A1A1A]' : 'text-[#AAA]'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Ordered Items List */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3]">
            Items in Order ({order.items?.length || 0})
          </h2>

          <div className="space-y-4">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-[#FAF7F2] last:border-none"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-xl border border-[#E8DFD0] flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-[#1A1A1A]">{item.product_name}</h3>
                    <p className="text-[11px] text-[#777]">
                      ৳{parseFloat(item.price).toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-extrabold text-[#1A1A1A]">
                    ৳{parseFloat(item.subtotal || item.price * item.quantity).toLocaleString()}
                  </span>

                  {/* Review Button if delivered */}
                  <button
                    onClick={() => setReviewModalProduct(item)}
                    className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#8B7355] text-[#1A1A1A] hover:text-white border border-[#E8DFD0] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <FiStar className="w-3.5 h-3.5" /> Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 pb-2 border-b border-[#F5EFE3]">
              <FiMapPin className="text-[#8B7355]" /> Delivery Destination
            </h3>
            <p className="text-xs font-bold text-[#1A1A1A]">{order.shipping_name}</p>
            <p className="text-xs text-[#666]">{order.shipping_phone}</p>
            <p className="text-xs text-[#666]">{order.shipping_address}, {order.shipping_city}</p>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white border border-[#E8DFD0] rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 pb-2 border-b border-[#F5EFE3]">
              <FiCreditCard className="text-[#8B7355]" /> Payment Breakdown
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#666]">
                <span>Subtotal</span>
                <span className="font-bold text-[#1A1A1A]">৳{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Discount</span>
                  <span>-৳{parseFloat(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#666]">
                <span>Delivery</span>
                <span className="font-bold text-[#1A1A1A]">
                  {parseFloat(order.shipping_fee) === 0 ? 'FREE' : `৳${parseFloat(order.shipping_fee)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#F5EFE3] flex justify-between text-sm font-extrabold text-[#1A1A1A]">
                <span>Total Amount</span>
                <span className="text-[#8B7355]">৳{parseFloat(order.total).toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-[#777] uppercase font-bold pt-1">
                Method: {order.payment_method} • Status: {order.payment_status}
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {reviewModalProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E8DFD0] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
                Review Frame: {reviewModalProduct.product_name}
              </h3>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1.5">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-xl p-1 transition-colors ${
                          star <= rating ? 'text-[#8B7355]' : 'text-[#DDD]'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">Your Feedback / Review</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe frame fit, lens clarity, build quality, and comfort..."
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalProduct(null)}
                    className="px-4 py-2 bg-white border border-[#E8DFD0] text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
