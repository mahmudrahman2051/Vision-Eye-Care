import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiStar,
  FiShoppingBag,
  FiHeart,
  FiCheck,
  FiShield,
  FiTruck,
  FiRotateCcw,
  FiChevronRight,
  FiSliders,
  FiCheckCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../../services/productService';
import ProductCard from '../../components/Product/ProductCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { trackViewContent } from '../../utils/facebookPixel';
import { realProducts } from '../../data/realProducts';

const defaultImage = '';

const lensTypes = [
  { id: 'frame-only', name: 'Non-Prescription / Frame Only', price: 0, desc: 'Standard demo lenses or optical frame only' },
  { id: 'single-vision', name: 'Single Vision Lenses', price: 500, desc: 'Distance or reading clarity with anti-reflective coating' },
  { id: 'blue-light', name: 'Blue Light Filter Lenses (ব্লু-কাট)', price: 850, desc: 'Blocks digital screen glare and harmful mobile UV blue ray', recommended: true },
  { id: 'progressive', name: 'Progressive Multi-Focal', price: 1800, desc: 'Seamless transition across near, intermediate, and far vision' },
  { id: 'transitions', name: 'Transitions® Adaptive Lenses', price: 1500, desc: 'Adapts from clear indoors to dark sunglasses under BD sunlight' },
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist: toggleWishlistContext } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLens, setSelectedLens] = useState(lensTypes[0]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductByIdOrSlug(id);
        if (res.status === 'success' && res.data) {
          const item = res.data;
          setProduct(item);
          trackViewContent(item);

          const rawImages = (Array.isArray(item.images) && item.images.length > 0)
            ? item.images
            : (item.primary_image || item.image_url
                ? [{ id: 'primary', image_url: item.primary_image || item.image_url, url: item.primary_image || item.image_url, is_primary: true }]
                : []);

          const primary =
            item.images?.find((img) => img.is_primary)?.image_url ||
            item.images?.find((img) => img.is_primary)?.url ||
            rawImages[0]?.image_url ||
            rawImages[0]?.url ||
            (typeof rawImages[0] === 'string' ? rawImages[0] : null) ||
            item.primary_image ||
            item.image_url ||
            null;
          setSelectedImage(primary);

          if (item.category_id) {
            const relRes = await productService.getProducts({
              category: item.category_id,
              limit: 4,
            });
            if (relRes.status === 'success' && relRes.data?.products) {
              setRelatedProducts(relRes.data.products.filter((p) => p.id !== item.id));
            }
          }
        } else {
          throw new Error('Not found in API');
        }
      } catch {
        // Fallback to merged catalog with user-customized/uploaded images
        const catalog = productService.getMergedProducts ? productService.getMergedProducts() : realProducts;
        const query = String(id).toLowerCase().trim();
        const match = catalog.find(
          (p) =>
            String(p.id).toLowerCase() === query ||
            (p.slug && p.slug.toLowerCase() === query) ||
            (p.product_code && p.product_code.toLowerCase() === query) ||
            (p.sku && p.sku.toLowerCase() === query)
        );
        if (match) {
          setProduct(match);
          const rawImages = (Array.isArray(match.images) && match.images.length > 0)
            ? match.images
            : (match.primary_image || match.image_url
                ? [{ id: 'primary', url: match.primary_image || match.image_url, image_url: match.primary_image || match.image_url, is_primary: true }]
                : []);

          const primary =
            match.images?.find((img) => img.is_primary)?.image_url ||
            match.images?.find((img) => img.is_primary)?.url ||
            rawImages[0]?.image_url ||
            rawImages[0]?.url ||
            (typeof rawImages[0] === 'string' ? rawImages[0] : null) ||
            match.primary_image ||
            match.image_url ||
            null;

          setSelectedImage(primary);
          const rel = catalog.filter((p) => p.category_id === match.category_id && p.id !== match.id).slice(0, 4);
          setRelatedProducts(rel);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(product?.stock || 10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        ...product,
        price: (parseFloat(product.price) || 0) + (selectedLens.price || 0),
        name: selectedLens.price > 0 ? `${product.name} (${selectedLens.name})` : product.name,
      },
      quantity
    );
  };

  const isWishlisted = isInWishlist(product?.product_id || product?.id);

  const toggleWishlist = () => {
    if (product) {
      toggleWishlistContext(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black tracking-widest uppercase">Loading Optical Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center text-gray-900 p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="px-6 py-2.5 bg-[#DFFF00] text-gray-900 font-black rounded-xl uppercase text-xs border border-yellow-500">
          Back to Shop
        </Link>
      </div>
    );
  }

  const basePrice = parseFloat(product.price) || 0;
  const totalPrice = (basePrice + selectedLens.price) * quantity;

  // Extract all gallery images cleanly from product
  const galleryImages = (Array.isArray(product?.images) && product.images.length > 0)
    ? product.images.map((img, idx) => {
        const url = typeof img === 'string' ? img : (img.image_url || img.url || img.src);
        return {
          id: img.id || `gallery-thumb-${idx}`,
          url,
          alt: img.alt_text || `${product.name} angle ${idx + 1}`,
        };
      }).filter((item) => Boolean(item.url))
    : (product?.primary_image || product?.image_url
        ? [{ id: 'primary', url: product.primary_image || product.image_url, alt: product.name }]
        : []);

  const activeDisplayImage =
    selectedImage ||
    galleryImages[0]?.url ||
    product?.primary_image ||
    product?.image_url ||
    null;

  const activeIndex = Math.max(0, galleryImages.findIndex((g) => g.url === activeDisplayImage));

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto font-medium">
          <Link to="/" className="hover:text-yellow-700 transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3 text-yellow-500" />
          <Link to="/shop" className="hover:text-yellow-700 transition-colors">Shop</Link>
          <FiChevronRight className="w-3 h-3 text-yellow-500" />
          {product.category_name && (
            <>
              <Link to={`/shop?category=${product.category_id}`} className="hover:text-yellow-700 transition-colors">
                {product.category_name}
              </Link>
              <FiChevronRight className="w-3 h-3 text-yellow-500" />
            </>
          )}
          <span className="text-gray-900 font-extrabold truncate">{product.name}</span>
        </nav>

        {/* Guided Flow Progress Steps Bar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-10 grid grid-cols-4 gap-2 text-center text-xs shadow-xs font-sans">
          <div className="flex items-center justify-center gap-2 text-teal-800 font-black">
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-black shadow-xs">1</span>
            <span className="hidden sm:inline">Frame Selected</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-800 font-bold">
            <span className="w-5 h-5 rounded-full bg-white border border-slate-300 text-slate-800 text-[10px] flex items-center justify-center">2</span>
            <span className="hidden sm:inline">Lens Package</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-400 text-[10px] flex items-center justify-center">3</span>
            <span className="hidden sm:inline">Prescription</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-400 text-[10px] flex items-center justify-center">4</span>
            <span className="hidden sm:inline">Checkout</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Multi-Image Gallery */}
          <div className="space-y-4">
            {/* Main Active Image Display */}
            <div className="relative aspect-square bg-[#FAFAFA] border border-neutral-200 overflow-hidden group shadow-xs p-4 flex items-center justify-center">
              {/* Badge for Current Image Position if multiple images exist */}
              {galleryImages.length > 1 && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {activeIndex + 1} / {galleryImages.length}
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-black hover:text-white rounded-full shadow-xs transition-colors cursor-pointer text-neutral-600"
                aria-label="Wishlist"
              >
                <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Prev / Next navigation arrows if multiple images exist */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const prevIdx = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
                      setSelectedImage(galleryImages[prevIdx].url);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white text-neutral-800 shadow-md flex items-center justify-center transition-all cursor-pointer font-bold text-lg select-none"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextIdx = (activeIndex + 1) % galleryImages.length;
                      setSelectedImage(galleryImages[nextIdx].url);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white text-neutral-800 shadow-md flex items-center justify-center transition-all cursor-pointer font-bold text-lg select-none"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              {activeDisplayImage ? (
                <img
                  src={activeDisplayImage}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center select-none">
                  <svg
                    className="w-24 h-24 text-neutral-300 mb-3"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="19" cy="34" r="13" />
                    <circle cx="45" cy="34" r="13" />
                    <path d="M32 32c1-2 3-3 5-3s4 1 5 3" />
                    <path d="M6 31l4-1" />
                    <path d="M58 31l-4-1" />
                  </svg>
                  <span className="text-sm font-mono font-bold text-neutral-500 tracking-wider uppercase">
                    {product.product_code || 'Optical Frame'}
                  </span>
                  <span className="text-xs text-neutral-400 mt-1">Image can be added from Admin Panel</span>
                </div>
              )}
            </div>

            {/* Multiple Image Thumbnails Gallery */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative w-20 h-20 bg-white border-2 overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                      selectedImage === img.url
                        ? 'border-black ring-2 ring-black/10 scale-100 shadow-sm'
                        : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-1"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-0 right-0 px-1 text-[8px] bg-black text-white font-bold uppercase tracking-tighter">
                        Cover
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Lens Configuration */}
          <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between text-xs text-[#8B7355] font-extrabold uppercase tracking-widest">
              <span>{product.brand || 'Vision Eye Care'}</span>
              <div className="flex items-center gap-2">
                {product.product_code && (
                  <span className="font-mono text-[#8B7355] bg-[#FAF7F2] border border-[#E8DFD0] px-2.5 py-0.5 rounded text-xs font-black">
                    Code: {product.product_code}
                  </span>
                )}
                {product.sku && product.sku !== product.product_code && (
                  <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500 text-sm">
                {[...Array(5)].map((_, idx) => (
                  <FiStar
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < Math.floor(product.average_rating || 5)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-900">
                {parseFloat(product.average_rating || 5.0).toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">({product.review_count || 120} reviews)</span>
            </div>

            {/* Price Display in Taka (৳) */}
            <div className="flex items-baseline gap-4 py-3 border-y border-slate-200/80">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">৳{Math.round(totalPrice).toLocaleString()}</span>
                {selectedLens.price > 0 && (
                  <span className="text-xs text-slate-600 font-semibold">
                    (Frame ৳{Math.round(basePrice).toLocaleString()} + {selectedLens.name} +৳{selectedLens.price})
                  </span>
                )}
              </div>
            </div>

            {/* Lens Type Selection UX */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FiSliders className="text-teal-600" /> Choose Your Lens Package (Bangladesh)
              </label>
              <div className="space-y-2">
                {lensTypes.map((lens) => (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedLens.id === lens.id
                        ? 'bg-teal-50/60 border-2 border-teal-600 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <FiCheckCircle className={selectedLens.id === lens.id ? 'text-teal-600' : 'text-slate-300'} />
                        {lens.name}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {lens.price === 0 ? 'FREE' : `+৳${lens.price}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 pl-6 font-medium">{lens.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="flex items-center border border-slate-200 bg-slate-100 rounded-xl p-1 w-full sm:w-auto justify-between shadow-xs">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-900 hover:text-teal-600 text-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-black text-slate-900">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-9 h-9 flex items-center justify-center text-slate-900 hover:text-teal-600 text-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 w-full py-3.5 px-6 bg-slate-900 hover:bg-teal-600 text-white font-extrabold rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-40"
              >
                <FiShoppingBag className="w-4 h-4" /> Add To Cart (৳{Math.round(totalPrice).toLocaleString()})
              </button>

              <button
                onClick={toggleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-400'
                }`}
                title="Wishlist"
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-200 text-[11px] text-slate-700 font-extrabold text-center">
              <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs">
                <FiTruck className="w-5 h-5 text-teal-600" /> 24-48hr BD Delivery
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs">
                <FiShield className="w-5 h-5 text-teal-600" /> 100% Authentic Brand
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 shadow-xs">
                <FiRotateCcw className="w-5 h-5 text-teal-600" /> bKash/Nagad/COD
              </div>
            </div>
          </div>
        </div>


        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-yellow-200">
            <h2 className="text-2xl font-black uppercase text-gray-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
