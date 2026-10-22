import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiExternalLink, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../services/productService';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        search: searchTerm,
        page,
        limit: 15,
      });
      if (res.status === 'success') {
        setProducts(res.data.products || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.total_pages || 1);
        }
      }
    } catch (err) {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await productService.deleteProduct(id);
      if (res.status === 'success') {
        toast.success('Product deleted.');
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD0] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
            Manage Products
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add New Frame
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-3.5 text-[#888] w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or brand..."
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

      {/* Table */}
      <div className="bg-white border border-[#E8DFD0] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#777] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF7F2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888]">
                    No optical products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const image =
                    p.primary_image ||
                    p.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80';
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#E8DFD0] flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#1A1A1A] max-w-xs truncate">{p.name}</p>
                            <span className="text-[10px] text-[#8B7355] uppercase font-bold">{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#666] font-mono text-[11px]">{p.sku || '—'}</td>
                      <td className="p-4 text-[#555]">{p.category_name || 'Unassigned'}</td>
                      <td className="p-4 font-extrabold text-[#1A1A1A]">৳{parseFloat(p.price).toLocaleString()}</td>
                      <td className="p-4">
                        <span
                          className={`font-bold ${
                            p.stock <= (p.low_stock_threshold || 5)
                              ? 'text-red-600'
                              : 'text-[#1A1A1A]'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                            p.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/${p.slug || p.id}`}
                            target="_blank"
                            title="View on Storefront"
                            className="p-1.5 text-[#777] hover:text-[#1A1A1A]"
                          >
                            <FiExternalLink />
                          </Link>
                          <Link
                            to={`/admin/products/${p.id}`}
                            title="Edit"
                            className="p-1.5 text-[#8B7355] hover:text-[#7A6348]"
                          >
                            <FiEdit2 />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Delete"
                            className="p-1.5 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
