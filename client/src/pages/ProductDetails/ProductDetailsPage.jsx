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
  FiShare2,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import productService from '../../services/productService';
import ProductCard from '../../components/Product/ProductCard';

const defaultImage = `https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80`;

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductByIdOrSlug(id);
        if (res.status === 'success') {
          setProduct(res.data);
          const primary = res.data.images?.find((img) => img.is_primary)?.image_url || res.data.images?.[0]?.image_url || defaultImage;
          setSelectedImage(primary);

          // Fetch related products in same category
          if (res.data.category_id) {
            const relRes = await productService.getProducts({
              category: res.data.category_id,
              limit: 4,
            });
            if (relRes.status === 'success') {
              setRelatedProducts(relRes.data.products.filter((p) => p.id !== res.data.id));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(product?.stock || 10, prev + delta)));
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} x ${product.name} to Cart!`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from Wishlist' : `Added ${product.name} to Wishlist`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#DFFF00]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#DFFF00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold tracking-widest uppercase">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#050505] flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="px-6 py-2.5 bg-[#DFFF00] text-black font-extrabold rounded-xl uppercase text-xs">
          Back to Shop
        </Link>
      </div>
    );
  }

  const numericPrice = parseFloat(product.price) || 0;
  const numericComparePrice = parseFloat(product.compare_price) || 0;
  const hasDiscount = numericComparePrice > numericPrice;

  return (
    <div className="bg-[#050505] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-[#DFFF00] transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3 text-gray-600" />
          <Link to="/shop" className="hover:text-[#DFFF00] transition-colors">Shop</Link>
          <FiChevronRight className="w-3 h-3 text-gray-600" />
          {product.category_name && (
            <>
              <Link to={`/shop?category=${product.category_id}`} className="hover:text-[#DFFF00] transition-colors">
                {product.category_name}
              </Link>
              <FiChevronRight className="w-3 h-3 text-gray-600" />
            </>
          )}
          <span className="text-gray-200 font-semibold truncate">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            {/* Main Display Image */}
            <div className="relative aspect-square bg-[#0B0B0B] border border-[#292929] rounded-2xl overflow-hidden group">
              <img
                src={selectedImage || defaultImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#DFFF00] text-black text-xs font-extrabold uppercase rounded-md shadow-lg">
                  SALE
                </span>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`w-20 h-20 rounded-xl bg-[#0B0B0B] border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === img.image_url
                        ? 'border-[#DFFF00] shadow-md shadow-[#DFFF00]/20'
                        : 'border-[#292929] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Purchase Actions */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="uppercase tracking-widest text-[#DFFF00] font-bold">
                {product.brand || 'Vision Eye Care'}
              </span>
              {product.sku && <span className="font-mono">SKU: {product.sku}</span>}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400 text-sm">
                {[...Array(5)].map((_, idx) => (
                  <FiStar
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < Math.floor(product.average_rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-200">
                {parseFloat(product.average_rating || 5.0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({product.review_count || 0} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 py-2 border-y border-[#292929]">
              <span className="text-3xl font-black text-[#DFFF00]">${numericPrice.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 line-through">${numericComparePrice.toFixed(2)}</span>
              )}
              {product.stock <= 0 ? (
                <span className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full uppercase border border-red-500/30">
                  Out of Stock
                </span>
              ) : (
                <span className="ml-auto px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase border border-emerald-500/30 flex items-center gap-1">
                  <FiCheck className="w-3.5 h-3.5" /> In Stock ({product.stock})
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
              {product.short_description || product.description || 'Elevate your eyewear game with premium frames designed for style, durability, and supreme optical clarity.'}
            </p>

            {/* Specs Quick Pill */}
            <div className="grid grid-cols-2 gap-3 bg-[#0B0B0B] p-4 rounded-xl border border-[#292929] text-xs">
              <div><span className="text-gray-400">Frame Shape:</span> <span className="font-bold text-white ml-1">{product.frame_shape || 'N/A'}</span></div>
              <div><span className="text-gray-400">Material:</span> <span className="font-bold text-white ml-1">{product.frame_material || 'N/A'}</span></div>
              <div><span className="text-gray-400">Color:</span> <span className="font-bold text-white ml-1">{product.frame_color || 'N/A'}</span></div>
              <div><span className="text-gray-400">Gender:</span> <span className="font-bold text-white capitalize ml-1">{product.gender || 'Unisex'}</span></div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-[#292929] bg-[#0B0B0B] rounded-xl p-1 w-full sm:w-auto justify-between">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white text-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white text-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 w-full py-3.5 px-6 bg-[#DFFF00] hover:bg-[#cbe600] text-black font-extrabold rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#DFFF00]/20 disabled:opacity-40"
              >
                <FiShoppingBag className="w-4 h-4" /> Add To Cart
              </button>

              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : 'bg-[#0B0B0B] border-[#292929] text-gray-400 hover:text-white hover:border-[#DFFF00]'
                }`}
                title="Wishlist"
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-[#292929] text-[11px] text-gray-400 text-center">
              <div className="flex flex-col items-center gap-1 p-2 bg-[#0B0B0B] rounded-lg border border-[#1A1A1A]">
                <FiTruck className="w-5 h-5 text-[#DFFF00]" /> Fast Shipping
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-[#0B0B0B] rounded-lg border border-[#1A1A1A]">
                <FiShield className="w-5 h-5 text-[#DFFF00]" /> 100% Authentic
              </div>
              <div className="flex flex-col items-center gap-1 p-2 bg-[#0B0B0B] rounded-lg border border-[#1A1A1A]">
                <FiRotateCcw className="w-5 h-5 text-[#DFFF00]" /> 7-Day Returns
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#292929]">
            <h2 className="text-2xl font-extrabold text-white mb-6">
              You May Also <span className="text-[#DFFF00]">Like</span>
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
