import React, { useState, useEffect } from 'react';
import { FiPlus, FiFolder, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../services/adminService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.status === 'success') {
        setCategories(res.data || []);
      }
    } catch (err) {
      toast.error('Could not load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setForm({ ...form, name, slug });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await adminService.createCategory(form);
      if (res.status === 'success') {
        toast.success('Category created successfully!');
        setShowModal(false);
        setForm({ name: '', slug: '', description: '' });
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await adminService.deleteCategory(id);
      if (res.status === 'success') {
        toast.success('Category deleted.');
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete category containing products.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
            Taxonomy
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
            Manage Categories
          </h1>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Add Category Form Modal */}
      {showModal && (
        <form onSubmit={handleCreate} className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#F5EFE3]">
            New Optical Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={handleNameChange}
                placeholder="e.g. Computer Eyewear"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="computer-eyewear"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#555] mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description for catalog filters"
              className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
            />
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
              {submitting ? 'Creating...' : 'Save Category'}
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
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Subcategories</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#888]">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#888]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="p-4 text-[#777] font-mono text-[11px]">#{c.id}</td>
                    <td className="p-4 font-bold text-[#1A1A1A]">{c.name}</td>
                    <td className="p-4 text-[#666] font-mono text-[11px]">{c.slug}</td>
                    <td className="p-4 text-[#555]">
                      {c.subcategories && c.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.subcategories.map((sc) => (
                            <span key={sc.id} className="px-1.5 py-0.5 bg-[#F5EFE3] text-[#8B7355] rounded text-[10px] font-bold">
                              {sc.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#999]">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-green-100 text-green-800 rounded uppercase">
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="text-red-500 hover:text-red-700 font-bold p-1"
                        title="Delete category"
                      >
                        <FiTrash2 />
                      </button>
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
