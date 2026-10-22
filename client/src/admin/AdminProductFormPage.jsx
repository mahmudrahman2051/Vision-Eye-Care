import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../services/productService';
import { realProducts } from '../data/realProducts';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    brand: 'Vision Eye Care',
    product_code: '',
    sku: '',
    price: '',
    compare_price: '',
    stock: 1,
    low_stock_threshold: 1,
    category_id: '',
    subcategory_id: '',
    frame_material: 'Acetate',
    frame_shape: 'Rectangle',
    frame_color: 'Classic Black',
    size: 'Standard',
    gender: 'unisex',
    status: 'active',
    featured: false,
    bestseller: false,
    new_arrival: true,
    short_description: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    // Fetch categories
    productService.getCategories()
      .then((res) => {
        if (res.status === 'success') {
          setCategories(res.data || []);
          if (!isEdit && res.data.length > 0) {
            setForm((prev) => ({ ...prev, category_id: res.data[0].id }));
          }
        }
      })
      .catch((err) => console.warn(err));

    // If edit mode, load product details
    if (isEdit) {
      productService.getProductByIdOrSlug(id)
        .then((res) => {
          if (res.status === 'success' && res.data) {
            const p = res.data;
            const primaryImg = p.images?.find((img) => img.is_primary)?.image_url || p.images?.[0]?.image_url || p.primary_image || '';
            setForm({
              name: p.name || '',
              brand: p.brand || '',
              product_code: p.product_code || '',
              sku: p.sku || '',
              price: p.price || '',
              compare_price: p.compare_price || '',
              stock: p.stock ?? 1,
              low_stock_threshold: p.low_stock_threshold || 1,
              category_id: p.category_id || '',
              subcategory_id: p.subcategory_id || '',
              frame_material: p.frame_material || '',
              frame_shape: p.frame_shape || '',
              frame_color: p.frame_color || '',
              size: p.size || 'Standard',
              gender: p.gender || 'unisex',
              status: p.status || 'active',
              featured: Boolean(p.featured),
              bestseller: Boolean(p.bestseller),
              new_arrival: Boolean(p.new_arrival),
              short_description: p.short_description || '',
              description: p.description || '',
              image_url: primaryImg,
            });
          } else {
            throw new Error('Not found');
          }
        })
        .catch(() => {
          // Fallback to real local catalog
          const local = realProducts.find(
            (p) => String(p.id) === String(id) || p.slug === id || (p.product_code && p.product_code.toLowerCase() === id.toLowerCase())
          );
          if (local) {
            setForm({
              name: local.name || '',
              brand: local.brand || '',
              product_code: local.product_code || '',
              sku: local.sku || '',
              price: local.price || '',
              compare_price: local.compare_price || '',
              stock: local.stock ?? 1,
              low_stock_threshold: local.low_stock_threshold || 1,
              category_id: local.category_id || '',
              subcategory_id: local.subcategory_id || '',
              frame_material: local.frame_material || '',
              frame_shape: local.frame_shape || '',
              frame_color: local.frame_color || '',
              size: local.size || 'Standard',
              gender: local.gender || 'unisex',
              status: local.status || 'active',
              featured: Boolean(local.featured),
              bestseller: Boolean(local.bestseller),
              new_arrival: Boolean(local.new_arrival),
              short_description: local.short_description || '',
              description: local.description || '',
              image_url: local.primary_image || '',
            });
          } else {
            toast.error('Could not load product details.');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.error('Product title and price are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock: parseInt(form.stock, 10) || 0,
        low_stock_threshold: parseInt(form.low_stock_threshold, 10) || 5,
        category_id: form.category_id ? parseInt(form.category_id, 10) : null,
      };

      if (isEdit) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#777]">Loading product information...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/admin/products"
        className="text-xs font-bold text-[#8B7355] hover:text-[#1A1A1A] flex items-center gap-1.5 transition-colors"
      >
        <FiArrowLeft className="w-3.5 h-3.5" /> Back to Products
      </Link>

      {/* Header */}
      <div className="border-b border-[#E8DFD0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
          {isEdit ? 'Update Entry' : 'New Catalog Item'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
          {isEdit ? `Edit: ${form.name}` : 'Add New Eyewear Frame'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Attributes Card */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#F5EFE3]">
            1. Core Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Product Title *</label>
              <input
                type="text"
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Classic Aviator Titanium"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Brand Name</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. VISION EYE CARE, Vincent Chase"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Product Code</label>
              <input
                type="text"
                name="product_code"
                value={form.product_code}
                onChange={handleChange}
                placeholder="e.g. MRM-001"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] font-mono font-bold text-[#8B7355]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="MRM-001"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Selling Price (৳) *</label>
              <input
                type="number"
                required
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="300.00"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Compare Price (৳)</label>
              <input
                type="number"
                step="0.01"
                name="compare_price"
                value={form.compare_price}
                onChange={handleChange}
                placeholder="390.00"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Stock Units</label>
              <input
                type="number"
                required
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
          </div>
        </div>

        {/* Categories & Styling Attributes */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#F5EFE3]">
            2. Category & Physical Specs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              >
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Catalog Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Frame Shape</label>
              <input
                type="text"
                name="frame_shape"
                value={form.frame_shape}
                onChange={handleChange}
                placeholder="Aviator, Round, Wayfarer, Cat Eye"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Frame Material</label>
              <input
                type="text"
                name="frame_material"
                value={form.frame_material}
                onChange={handleChange}
                placeholder="Titanium, Acetate, Metal"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Frame Color</label>
              <input
                type="text"
                name="frame_color"
                value={form.frame_color}
                onChange={handleChange}
                placeholder="Matte Black, Gold, Tortoise"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#555] mb-1">Size Spec</label>
              <input
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="e.g. 54-19-147"
                className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#555] cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="accent-[#8B7355]"
              />
              Featured Product
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#555] cursor-pointer">
              <input
                type="checkbox"
                name="bestseller"
                checked={form.bestseller}
                onChange={handleChange}
                className="accent-[#8B7355]"
              />
              Bestseller
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#555] cursor-pointer">
              <input
                type="checkbox"
                name="new_arrival"
                checked={form.new_arrival}
                onChange={handleChange}
                className="accent-[#8B7355]"
              />
              New Arrival
            </label>
          </div>
        </div>

        {/* Media & Copy */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] pb-2 border-b border-[#F5EFE3]">
            3. Image & Description
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#555] mb-1">Primary Frame Image URL</label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or Cloudinary URL"
                className="flex-1 text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
              />
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-14 h-14 rounded-xl object-cover border border-[#E8DFD0] flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-dashed border-[#E8DFD0] flex items-center justify-center text-[10px] text-[#999] text-center flex-shrink-0">
                  No Image
                </div>
              )}
            </div>
            <p className="text-[10px] text-[#777] mt-1.5">
              Add image link directly from Cloudinary or an image host. You can add or replace images anytime.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#555] mb-1">Short Summary</label>
            <input
              type="text"
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              placeholder="Brief 1-sentence teaser"
              className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#555] mb-1">Detailed Description</label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Full optical specifications, ergonomics, UV resistance details..."
              className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 bg-white border border-[#E8DFD0] hover:bg-[#FAF7F2] text-[#1A1A1A] text-xs font-bold rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
          >
            <FiSave /> {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
