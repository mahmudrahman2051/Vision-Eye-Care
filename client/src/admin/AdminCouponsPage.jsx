import React, { useState, useEffect } from 'react';
import { FiPlus, FiTag, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '10',
    min_order_amount: '0',
    max_discount: '',
    usage_limit: '',
    is_active: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCoupons();
      if (res.status === 'success') {
        setCoupons(res.data || []);
      }
    } catch (err) {
      toast.error('Could not load coupons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    setSubmitting(true);
    try {
      const res = await adminService.createCoupon(form);
      if (res.status === 'success') {
        toast.success(`Coupon ${res.data.code} created!`);
        setShowModal(false);
        setForm({
          code: '',
          description: '',
          discount_type: 'percentage',
          discount_value: '10',
          min_order_amount: '0',
          max_discount: '',
          usage_limit: '',
          is_active: true,
        });
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    const nextStatus = !coupon.is_active;
    try {
      const res = await adminService.updateCoupon(coupon.id, { is_active: nextStatus });
      if (res.status === 'success') {
        toast.success(`Coupon is now ${nextStatus ? 'Active' : 'Inactive'}`);
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, is_active: nextStatus } : c))
        );
      }
    } catch (err) {
      toast.error('Could not toggle coupon status.');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      await adminService.deleteCoupon(id);
      toast.success('Coupon deleted.');
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error('Could not delete coupon.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
            Promotions & Discounts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
            Manage Promo Coupons
          </h1>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Add Modal */}
      {showModal && (
        <form onSubmit={handleCreate} className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#F5EFE3]">
            Create Discount Coupon
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. WELCOME10"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] uppercase font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Discount Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">
                Value ({form.discount_type === 'percentage' ? '%' : '৳'}) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                placeholder="10"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Min Order Amount (৳)</label>
              <input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                placeholder="0"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Max Discount Cap (৳)</label>
              <input
                type="number"
                value={form.max_discount}
                onChange={(e) => setForm({ ...form, max_discount: e.target.value })}
                placeholder="Optional max cap"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Usage Limit (Times)</label>
              <input
                type="number"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                placeholder="Unlimited if empty"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-white border border-[#E8DFD0] text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#777] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Value</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Used Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    No coupons created yet.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="p-4 font-mono font-bold text-[#1A1A1A]">{c.code}</td>
                    <td className="p-4 text-[#555] uppercase text-[10px] font-bold">{c.discount_type}</td>
                    <td className="p-4 font-bold text-[#8B7355]">
                      {c.discount_type === 'percentage'
                        ? `${parseFloat(c.discount_value)}%`
                        : `৳${parseFloat(c.discount_value)}`}
                    </td>
                    <td className="p-4 text-[#666]">৳{parseFloat(c.min_order_amount || 0).toLocaleString()}</td>
                    <td className="p-4 text-[#666]">
                      {c.used_count} {c.usage_limit ? `/ ${c.usage_limit}` : ''}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          c.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className="px-2.5 py-1 text-xs font-bold rounded border border-[#E8DFD0] hover:bg-[#FAF7F2]"
                        >
                          {c.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="p-1 text-red-500 hover:text-red-700"
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
