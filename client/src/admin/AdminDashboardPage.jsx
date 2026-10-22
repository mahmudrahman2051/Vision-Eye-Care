import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiAlertTriangle,
  FiClock,
  FiPackage,
  FiArrowRight,
  FiTrendingUp,
} from 'react-icons/fi';
import adminService from '../services/adminService';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard()
      .then((res) => {
        if (res.status === 'success') {
          setData(res.data);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs text-[#777]">
        Loading dashboard metrics...
      </div>
    );
  }

  const summary = data?.summary || {
    total_sales: 0,
    total_orders: 0,
    total_customers: 0,
    total_products: 0,
    low_stock_count: 0,
    pending_orders_count: 0,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
            Executive Dashboard
          </h1>
        </div>

        <div className="flex gap-2">
          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* 6 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#8B7355]">
            <span className="text-[10px] uppercase font-bold text-[#888]">Revenue</span>
            <FiDollarSign className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#1A1A1A]">৳{summary.total_sales.toLocaleString()}</p>
          <span className="text-[10px] text-green-600 font-bold">Paid / Delivered</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#8B7355]">
            <span className="text-[10px] uppercase font-bold text-[#888]">Orders</span>
            <FiPackage className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#1A1A1A]">{summary.total_orders}</p>
          <span className="text-[10px] text-[#666]">Total placed</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] uppercase font-bold text-[#888]">Pending</span>
            <FiClock className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-amber-700">{summary.pending_orders_count}</p>
          <span className="text-[10px] text-amber-600 font-bold">Requires Action</span>
        </div>

        {/* Customers */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#8B7355]">
            <span className="text-[10px] uppercase font-bold text-[#888]">Customers</span>
            <FiUsers className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#1A1A1A]">{summary.total_customers}</p>
          <span className="text-[10px] text-[#666]">Registered users</span>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#8B7355]">
            <span className="text-[10px] uppercase font-bold text-[#888]">Inventory</span>
            <FiShoppingBag className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-[#1A1A1A]">{summary.total_products}</p>
          <span className="text-[10px] text-[#666]">Optical catalog</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-500">
            <span className="text-[10px] uppercase font-bold text-[#888]">Low Stock</span>
            <FiAlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-red-600">{summary.low_stock_count}</p>
          <span className="text-[10px] text-red-600 font-bold">Under threshold</span>
        </div>
      </div>

      {/* Grid: Recent Orders & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE3]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              Latest Orders (10 Most Recent)
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#8B7355] hover:underline flex items-center gap-1"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#777] font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-lg">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF7F2]">
                {data?.recent_orders?.length > 0 ? (
                  data.recent_orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="p-3 font-bold text-[#1A1A1A]">{ord.order_number}</td>
                      <td className="p-3 text-[#555]">{ord.shipping_name}</td>
                      <td className="p-3 text-[#777]">{new Date(ord.created_at).toLocaleDateString()}</td>
                      <td className="p-3 font-extrabold text-[#1A1A1A]">৳{parseFloat(ord.total).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          ord.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          ord.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.order_status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          to={`/account/orders/${ord.id}`}
                          className="text-[#8B7355] hover:underline font-bold"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-[#888]">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Best Sellers (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3] flex items-center gap-2">
            <FiTrendingUp className="text-[#8B7355]" /> Best Selling Frames
          </h2>

          <div className="space-y-3">
            {data?.best_sellers?.length > 0 ? (
              data.best_sellers.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#E8DFD0] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A1A1A] truncate">{p.name}</p>
                    <p className="text-[11px] text-[#8B7355] font-bold">৳{parseFloat(p.price).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#1A1A1A] block">{p.total_sold}</span>
                    <span className="text-[9px] text-[#888] uppercase">sold</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#777] text-center py-6">No sales recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert Table */}
      {data?.low_stock_items?.length > 0 && (
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-2">
              <FiAlertTriangle /> Low Stock Critical Warning ({data.low_stock_items.length} items)
            </h2>
            <Link to="/admin/products" className="text-xs font-bold text-[#8B7355] hover:underline">
              Manage Inventory
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.low_stock_items.map((item) => (
              <div key={item.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                <span className="text-[10px] text-[#888] font-bold block">{item.sku || 'SKU-N/A'}</span>
                <p className="text-xs font-bold text-[#1A1A1A] truncate">{item.name}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-red-600">Stock: {item.stock}</span>
                  <Link
                    to={`/admin/products/${item.id}`}
                    className="text-[10px] font-bold text-[#8B7355] uppercase underline"
                  >
                    Restock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
