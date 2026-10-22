import React, { useState, useEffect } from 'react';
import { FiStar, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReviews();
      if (res.status === 'success') {
        setReviews(res.data || []);
      }
    } catch (err) {
      toast.error('Could not load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleVisibility = async (review) => {
    const nextVal = !review.is_visible;
    try {
      const res = await adminService.toggleReviewVisibility(review.id, nextVal);
      if (res.status === 'success') {
        toast.success(`Review visibility set to ${nextVal ? 'Visible' : 'Hidden'}`);
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, is_visible: nextVal } : r))
        );
      }
    } catch (err) {
      toast.error('Failed to change visibility.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await adminService.deleteReview(id);
      toast.success('Review deleted.');
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error('Could not delete review.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E8DFD0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
          Moderation
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
          Customer Product Reviews
        </h1>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#777] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review Comment</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    No product reviews posted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="p-4 font-bold text-[#1A1A1A] max-w-xs truncate">
                      {r.product_name}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#1A1A1A]">{r.user_name}</p>
                      <p className="text-[11px] text-[#777]">{r.user_email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex text-[#8B7355] text-sm">
                        {'★'.repeat(r.rating)}
                        <span className="text-[#DDD]">{'★'.repeat(5 - r.rating)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#555] max-w-sm truncate">{r.comment || '—'}</td>
                    <td className="p-4 text-[#777]">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          r.is_visible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {r.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(r)}
                          className="p-1.5 text-[#555] hover:text-[#1A1A1A] rounded"
                          title={r.is_visible ? 'Hide from store' : 'Make visible'}
                        >
                          {r.is_visible ? <FiEyeOff /> : <FiEye />}
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 rounded"
                          title="Delete review"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
