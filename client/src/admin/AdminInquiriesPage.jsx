import React, { useState, useEffect } from 'react';
import {
  FiMail,
  FiSearch,
  FiCheckCircle,
  FiTrash2,
  FiPhone,
  FiCalendar,
  FiX,
  FiMessageSquare,
  FiEye,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import inquiryService from '../services/inquiryService';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await inquiryService.getInquiries();
      setInquiries(data);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleToggleStatus = async (inquiry) => {
    try {
      const nextStatus = !inquiry.is_read;
      await inquiryService.updateStatus(inquiry.id, nextStatus);
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === inquiry.id ? { ...item, is_read: nextStatus } : item
        )
      );
      if (selectedInquiry?.id === inquiry.id) {
        setSelectedInquiry((prev) => ({ ...prev, is_read: nextStatus }));
      }
      toast.success(nextStatus ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      await inquiryService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      toast.success('Inquiry deleted');
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone || '').includes(searchQuery);

    if (filterStatus === 'unread') return matchesSearch && !item.is_read;
    if (filterStatus === 'read') return matchesSearch && item.is_read;
    return matchesSearch;
  });

  const unreadCount = inquiries.filter((i) => !i.is_read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
              Customer Inquiries
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-[#777] mt-1">
            Read, review, and reply to customer inquiries submitted through the contact page and showroom booking form.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, subject..."
            className="w-full bg-[#FAF7F2] text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#FAF7F2] text-[#666] hover:bg-slate-200'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'unread'
                ? 'bg-rose-700 text-white'
                : 'bg-[#FAF7F2] text-[#666] hover:bg-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('read')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'read'
                ? 'bg-emerald-700 text-white'
                : 'bg-[#FAF7F2] text-[#666] hover:bg-slate-200'
            }`}
          >
            Resolved ({inquiries.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#8B7355] text-xs font-bold">
            Loading inquiries...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-[#888] text-xs font-bold">
            No inquiries matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD0] text-[#777] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD0]/60">
                {filteredInquiries.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedInquiry(item)}
                    className={`hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer ${
                      !item.is_read ? 'bg-amber-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          item.is_read
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}
                      >
                        {item.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#1A1A1A]">{item.name}</p>
                      <p className="text-[11px] text-[#777]">{item.email}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <p className="font-bold text-[#1A1A1A] truncate">{item.subject}</p>
                      <p className="text-[11px] text-[#888] truncate">{item.message}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#777] whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(item)}
                          className="p-1.5 text-[#8B7355] hover:bg-[#FAF7F2] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title={item.is_read ? 'Mark Unread' : 'Mark Read'}
                        >
                          <FiCheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD0]">
              <div className="flex items-center gap-2">
                <FiMail className="w-5 h-5 text-[#8B7355]" />
                <h3 className="font-black text-sm text-[#1A1A1A]">Inquiry Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-[#888] hover:text-[#1A1A1A]"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-[#777] uppercase font-bold tracking-wider">Subject</p>
                <p className="text-sm font-black text-[#1A1A1A] mt-0.5">{selectedInquiry.subject}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD0]">
                <div>
                  <p className="text-[10px] text-[#888] uppercase font-bold">From</p>
                  <p className="font-bold text-[#1A1A1A]">{selectedInquiry.name}</p>
                  <p className="text-[#666]">{selectedInquiry.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#888] uppercase font-bold">Phone</p>
                  <p className="font-bold text-[#1A1A1A]">{selectedInquiry.phone || 'Not provided'}</p>
                  <p className="text-[#888]">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-[#777] uppercase font-bold tracking-wider mb-1">
                  Message Content
                </p>
                <div className="p-3.5 bg-[#FAF7F2]/60 rounded-xl border border-[#E8DFD0] text-[#333] leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-[#E8DFD0] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8B7355] text-white text-xs font-bold hover:bg-[#6B5840] transition-colors"
                >
                  <FiMail className="w-3.5 h-3.5" /> Reply Email
                </a>

                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedInquiry)}
                  className="px-3 py-2 rounded-xl border border-[#E8DFD0] text-xs font-bold text-[#444] hover:bg-[#FAF7F2] transition-colors"
                >
                  {selectedInquiry.is_read ? 'Mark Unread' : 'Mark as Read'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
