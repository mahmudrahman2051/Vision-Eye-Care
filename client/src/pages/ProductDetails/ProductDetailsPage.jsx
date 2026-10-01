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

const defaultImage = `https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80`;

const lensTypes = [
  { id: 'frame-only', name: 'Non-Prescription / Frame Only', price: 0, desc: 'Standard clear demo lenses or frame only' },
  { id: 'single-vision', name: 'Single Vision Lenses', price: 25, desc: 'Distance or reading clarity with anti-reflective coating' },
  { id: 'blue-light', name: 'Blue Light Filter Lenses', price: 35, desc: 'Blocks digital screen glare and 420nm UV blue spectrum', recommended: true },
  { id: 'progressive', name: 'Progressive Multi-Focal', price: 80, desc: 'Seamless transition across near, intermediate, and far vision' },
  { id: 'transitions', name: 'Transitions® Adaptive', price: 70, desc: 'Adapts from clear indoors to dark sunglasses in UV sunlight' },
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLens, setSelectedLens] = useState(lensTypes[0]);
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
    toast.success(`Added ${quantity} x ${product.name} (${selectedLens.name}) to Cart!`);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from Wishlist' : `Added ${product.name} to Wishlist`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center text-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black tracking-widest uppercase">Loading Optical Product Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#F8F9FA] flex flex-col items-center justify-center text-black p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="px-6 py-2.5 bg-black text-[#DFFF00] font-black rounded-xl uppercase text-xs">
          Back to Shop
        </Link>
      </div>
    );
  }

  const basePrice = parseFloat(product.price) || 0;
  const totalPrice = (basePrice + selectedLens.price) * quantity;

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto font-medium">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <FiChevronRight className="w-3 h-3 text-gray-400" />
          {product.category_name && (
            <>
              <Link to={`/shop?category=${product.category_id}`} className="hover:text-black transition-colors">
                {product.category_name}
              </Link>
              <FiChevronRight className="w-3 h-3 text-gray-400" />
            </>
          )}
          <span className="text-black font-extrabold truncate">{product.name}</span>
        </nav>

        {/* Guided Flow Progress Steps Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-10 grid grid-cols-4 gap-2 text-center text-xs shadow-sm">
          <div className="flex items-center justify-center gap-2 text-black font-black">
            <span className="w-5 h-5 rounded-full bg-black text-[#DFFF00] text-[10px] flex items-center justify-center font-black">1</span>
            <span className="hidden sm:inline">Frame Selected</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-700 font-bold">
            <span className="w-5 h-5 rounded-full bg-gray-100 border border-gray-300 text-gray-700 text-[10px] flex items-center justify-center">2</span>
            <span className="hidden sm:inline">Lens Package</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 text-gray-400 text-[10px] flex items-center justify-center">3</span>
            <span className="hidden sm:inline">Prescription</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 text-gray-400 text-[10px] flex items-center justify-center">4</span>
            <span className="hidden sm:inline">Checkout</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white border border-gray-200 rounded-2xl overflow-hidden group shadow-sm">
              <img
                src={selectedImage || defaultImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`w-20 h-20 rounded-xl bg-white border-2 overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === img.image_url
                        ? 'border-black shadow'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Lens Configuration */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-500 font-extrabold uppercase tracking-widest">
              <span>{product.brand || 'VISION EYE CARE'}</span>
              {product.sku && <span className="font-mono text-gray-400">SKU: {product.sku}</span>}
            </div>

            <h1 className="text-3xl font-black text-black tracking-tight uppercase">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500 text-sm">
                {[...Array(5)].map((_, idx) => (
                  <FiStar
                    key={idx}
                    className={`w-4 h-4 ${
                      idx < Math.floor(product.average_rating || 5)
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-extrabold text-gray-900">
                {parseFloat(product.average_rating || 5.0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">({product.review_count || 0} reviews)</span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-4 py-3 border-y border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-black">${totalPrice.toFixed(2)}</span>
                {selectedLens.price > 0 && (
                  <span className="text-xs text-gray-500 font-semibold">
                    (Frame ${basePrice} + {selectedLens.name} +${selectedLens.price})
                  </span>
                )}
              </div>
            </div>

            {/* Lens Type Selection UX */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <FiSliders /> Choose Your Lens Package
              </label>
              <div className="space-y-2">
                {lensTypes.map((lens) => (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedLens.id === lens.id
                        ? 'bg-white border-black shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-black flex items-center gap-2">
                        <FiCheckCircle className={selectedLens.id === lens.id ? 'text-black fill-[#DFFF00]' : 'text-gray-300'} />
                        {lens.name}
                      </span>
                      <span className="text-xs font-black text-black">
                        {lens.price === 0 ? 'FREE' : `+$${lens.price}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 pl-6 font-medium">{lens.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="flex items-center border border-gray-200 bg-white rounded-xl p-1 w-full sm:w-auto justify-between shadow-sm">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-black text-lg font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-black text-black">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-black text-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 w-full py-3.5 px-6 bg-black hover:bg-gray-900 text-[#DFFF00] font-black rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-40"
              >
                <FiShoppingBag className="w-4 h-4" /> Add To Cart (${totalPrice.toFixed(2)})
              </button>

              <button
                onClick={toggleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:border-black'
                }`}
                title="Wishlist"
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-200 text-[11px] text-gray-600 font-medium text-center">
              <div className="flex flex-col items-center gap-1 p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <FiTruck className="w-5 h-5 text-black" /> Fast Shipping
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <FiShield className="w-5 h-5 text-black" /> 100% Authentic
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                <FiRotateCcw className="w-5 h-5 text-black" /> 7-Day Returns
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-black uppercase text-black mb-6">
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
