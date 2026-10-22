import React, { useState, useEffect } from 'react';
import {
  FiSend,
  FiSearch,
  FiDownload,
  FiTrash2,
  FiCheckCircle,
  FiUsers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import inquiryService from '../services/inquiryService';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await inquiryService.getSubscribers();
      setSubscribers(data);
    } catch (err) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this email from the subscriber list?')) return;
    try {
      await inquiryService.deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success('Subscriber removed');
    } catch (err) {
      toast.error('Failed to remove subscriber');
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error('No subscribers to export');
      return;
    }

    const headers = ['ID', 'Email', 'Status', 'Subscribed Date'];
    const rows = subscribers.map((s) => [
      s.id,
      s.email,
      s.is_subscribed ? 'Active' : 'Unsubscribed',
      s.subscribed_at ? new Date(s.subscribed_at).toISOString() : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vision_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subscriber list exported as CSV');
  };

  const filteredSubscribers = subscribers.filter((s) =>
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
              Newsletter Subscribers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8B7355]/15 text-[#8B7355] text-xs font-black">
              {subscribers.length} Emails
            </span>
          </div>
          <p className="text-xs text-[#777] mt-1">
            Audience subscribed through the storefront footer to receive private previews and seasonal promotions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#2D2D2D] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-40"
        >
          <FiDownload className="w-4 h-4 text-[#8B7355]" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] p-4 shadow-sm">
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscribers by email..."
            className="w-full bg-[#FAF7F2] text-xs pl-9 pr-3 py-2 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#8B7355] text-xs font-bold">
            Loading subscriber list...
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center text-[#888] text-xs font-bold">
            No subscribers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8DFD0] text-[#777] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Subscribed Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD0]/60">
                {filteredSubscribers.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-4 text-[#888] font-mono">{index + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-[#1A1A1A]">{item.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <FiCheckCircle className="w-3 h-3" /> Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#777]">
                      {item.subscribed_at ? new Date(item.subscribed_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
