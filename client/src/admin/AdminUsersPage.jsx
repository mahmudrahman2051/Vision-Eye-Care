import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search: searchTerm,
        role: roleFilter,
        page,
        limit: 15,
      });
      if (res.status === 'success') {
        setUsers(res.data.users || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.total_pages || 1);
        }
      }
    } catch (err) {
      toast.error('Could not fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = !user.is_active;
    try {
      const res = await adminService.updateUserStatus(user.id, nextStatus);
      if (res.status === 'success') {
        toast.success(`User ${user.name} is now ${nextStatus ? 'Active' : 'Deactivated'}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: nextStatus } : u))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update user status.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E8DFD0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
          User Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
          Manage Users & Customers
        </h1>
      </div>

      {/* Search and Role Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-3.5 text-[#888] w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DFD0] bg-white focus:outline-none focus:border-[#8B7355]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#777] font-bold">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs p-2.5 rounded-xl border border-[#E8DFD0] bg-white text-[#1A1A1A]"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#777] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="p-4 font-bold text-[#1A1A1A]">{u.full_name || u.name}</td>
                    <td className="p-4 text-[#555]">{u.email}</td>
                    <td className="p-4 text-[#777]">{u.phone || '—'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#1A1A1A]">{u.order_count || 0}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                          u.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          u.is_active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
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
