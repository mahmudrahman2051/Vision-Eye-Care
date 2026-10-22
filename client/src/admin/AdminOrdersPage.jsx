import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiFilter, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({
        search: searchTerm,
        order_status: statusFilter,
        page,
        limit: 15,
      });
      if (res.status === 'success') {
        setOrders(res.data.orders || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.total_pages || 1);
        }
      }
    } catch (err) {
      toast.error('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, { order_status: newStatus });
      if (res.status === 'success') {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status.');
    }
  };

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, { payment_status: newStatus });
      if (res.status === 'success') {
        toast.success(`Payment status set to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, payment_status: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error('Could not update payment status.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E8DFD0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
          Fulfillment
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
          Manage Customer Orders
        </h1>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-3.5 text-[#888] w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order # or Customer..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD0] bg-white focus:outline-none focus:border-[#8B7355]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Filter
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#777] font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs p-2.5 rounded-xl border border-[#E8DFD0] bg-white text-[#1A1A1A]"
          >
            <option value="">All Orders</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#777] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Placed Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="p-4 font-mono font-bold text-[#1A1A1A]">
                      {ord.order_number}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[#1A1A1A]">{ord.shipping_name}</p>
                      <p className="text-[11px] text-[#777]">{ord.shipping_phone} • {ord.shipping_city}</p>
                    </td>
                    <td className="p-4 text-[#666]">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-extrabold text-[#1A1A1A]">
                      ৳{parseFloat(ord.total).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.payment_status}
                        onChange={(e) => handlePaymentStatusChange(ord.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase p-1.5 rounded-lg border cursor-pointer ${
                          ord.payment_status === 'paid'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        {PAYMENT_STATUSES.map((ps) => (
                          <option key={ps} value={ps}>
                            {ps}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase p-1.5 rounded-lg border cursor-pointer ${
                          ord.order_status === 'delivered'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : ord.order_status === 'cancelled'
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/account/orders/${ord.id}`}
                        target="_blank"
                        className="text-[#8B7355] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        View <FiExternalLink />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#F5EFE3] flex items-center justify-between text-xs">
            <span className="text-[#777]">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8DFD0] rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8DFD0] rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
