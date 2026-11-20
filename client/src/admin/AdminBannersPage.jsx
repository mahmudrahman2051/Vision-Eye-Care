import React, { useState, useEffect } from 'react';
import {
  FiImage,
  FiPlus,
  FiTrash2,
  FiSave,
  FiRotateCcw,
  FiArrowUp,
  FiArrowDown,
  FiClock,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import bannerService from '../services/bannerService';

const DEFAULT_BLOCKS = {
  heroBanners: [
    {
      id: 1,
      src: '/hero_banner_1.png',
      alt: 'Premium Eyewear Collection',
      title: 'Bespoke Titanium & Japanese Acetate',
      subtitle: 'Engineered for uncompromising visual clarity',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
    },
    {
      id: 2,
      src: '/hero_banner_2.png',
      alt: 'Designer Sunglasses',
      title: 'Polarized Architectural Sunglasses',
      subtitle: '100% UV400 Protection with anti-reflective back-coating',
      ctaText: 'Shop Sunglasses',
      ctaLink: '/shop?category=sunglasses',
    },
    {
      id: 3,
      src: '/hero_banner_3.png',
      alt: 'Fashionable Frames',
      title: 'Featherlight Everyday Frames',
      subtitle: 'Custom CNC Lens Milling crafted in Dhaka',
      ctaText: 'Book Home Trial',
      ctaLink: '/contact',
    },
  ],
  heroInterval: 5000,
  promoBanners: [
    {
      id: 'category-promo',
      title: 'Category Promo Banner',
      placement: 'category',
      image: '/promo_banner.png',
      alt: 'Special Eyewear Offer',
      link: '/shop?sort=featured',
      enabled: true,
    },
    {
      id: 'lower-promo',
      title: 'Lower Promo Banner',
      placement: 'lower',
      image: '/promo_banner.png',
      alt: 'Exclusive Seasonal Drop',
      link: '/shop?sort=popular',
      enabled: true,
    },
  ],
  categoryPromoBanner: {
    image: '/promo_banner.png',
    alt: 'Special Eyewear Offer',
    link: '/shop?sort=featured',
    enabled: true,
  },
  lowerPromoBanner: {
    image: '/promo_banner.png',
    alt: 'Exclusive Seasonal Drop',
    link: '/shop?sort=popular',
    enabled: true,
  },
  featuredCollections: [
    {
      id: 'computer-glasses',
      title: 'Computer Glasses',
      tagline: 'Zero Power Blu-Cut',
      badge: 'MUST HAVE',
      dotColor: 'bg-emerald-500',
      link: '/shop?search=computer',
      image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'polarized-shades',
      title: 'Polarized Shades',
      tagline: '100% UV Protection',
      badge: 'POPULAR',
      dotColor: 'bg-amber-500',
      link: '/shop?category=sunglasses',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'progressive-lenses',
      title: 'Progressive Vision',
      tagline: 'Multi-Focal Comfort',
      badge: 'PREMIUM',
      dotColor: 'bg-indigo-500',
      link: '/shop?category=eyeglasses',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'acetate-frames',
      title: 'Acetate Frames',
      tagline: 'Italian Handcrafted',
      badge: 'TRENDING',
      dotColor: 'bg-rose-500',
      link: '/shop?search=acetate',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'contact-lenses',
      title: 'Contact Lenses',
      tagline: 'Daily & Monthly',
      badge: 'ESSENTIAL',
      dotColor: 'bg-sky-500',
      link: '/shop?search=Contact+Lenses',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'kids-eyewear',
      title: 'Kids Eyewear',
      tagline: 'Flexible & Safe',
      badge: 'NEW',
      dotColor: 'bg-violet-500',
      link: '/shop?gender=kids',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80',
    },
  ],
};

const DOT_COLORS = [
  { label: 'Emerald Green', value: 'bg-emerald-500' },
  { label: 'Amber Gold', value: 'bg-amber-500' },
  { label: 'Indigo Blue', value: 'bg-indigo-500' },
  { label: 'Rose Pink', value: 'bg-rose-500' },
  { label: 'Sky Cyan', value: 'bg-sky-500' },
  { label: 'Violet Purple', value: 'bg-violet-500' },
];

export default function AdminBannersPage() {
  const [data, setData] = useState(DEFAULT_BLOCKS);
  const [activeTab, setActiveTab] = useState('promos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await bannerService.getBanners();
        if (res) {
          // Normalize promoBanners list
          const promoList = Array.isArray(res.promoBanners)
            ? res.promoBanners
            : [
                {
                  id: 'category-promo',
                  title: 'Category Promo Banner',
                  placement: 'category',
                  image: res?.categoryPromoBanner?.image || '/promo_banner.png',
                  alt: res?.categoryPromoBanner?.alt || 'Special Eyewear Offer',
                  link: res?.categoryPromoBanner?.link || '/shop?sort=featured',
                  enabled: res?.categoryPromoBanner?.enabled !== false,
                },
                {
                  id: 'lower-promo',
                  title: 'Lower Promo Banner',
                  placement: 'lower',
                  image: res?.lowerPromoBanner?.image || '/promo_banner.png',
                  alt: res?.lowerPromoBanner?.alt || 'Exclusive Seasonal Drop',
                  link: res?.lowerPromoBanner?.link || '/shop?sort=popular',
                  enabled: res?.lowerPromoBanner?.enabled !== false,
                },
              ];

          setData({
            ...DEFAULT_BLOCKS,
            ...res,
            promoBanners: promoList,
          });
        }
      } catch (err) {
        toast.error('Failed loading banner settings, displaying defaults');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      await bannerService.updateBanners(data);
      toast.success('Homepage banners & blocks saved successfully!');
      window.dispatchEvent(new CustomEvent('banners-updated', { detail: data }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed saving banners');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all banners and blocks to default images and copy?')) {
      setData(DEFAULT_BLOCKS);
      toast.success('Reset to defaults. Click Save Changes to publish.');
    }
  };

  // Helper to sync promo banners array with legacy fields
  const syncPromoBanners = (prev, list) => {
    const activeBanners = list.filter((b) => b.enabled !== false && b.image);
    return {
      ...prev,
      promoBanners: list,
      categoryPromoBanner: activeBanners[0] || { image: '', alt: '', link: '', enabled: false },
      lowerPromoBanner: activeBanners[1] || { image: '', alt: '', link: '', enabled: false },
    };
  };

  // ==========================================
  // Promotional Banner Handlers (Add, Remove, Toggle, Reorder, Update)
  // ==========================================
  const handleAddPromoBanner = () => {
    const currentList = data.promoBanners || [];
    const newBanner = {
      id: Date.now(),
      title: `Promotional Banner #${currentList.length + 1}`,
      placement: currentList.length === 0 ? 'category' : (currentList.length === 1 ? 'lower' : 'custom'),
      image: '/promo_banner.png',
      alt: 'Special Eyewear Promotion',
      link: '/shop',
      enabled: true,
    };
    const updatedList = [...currentList, newBanner];
    setData((prev) => syncPromoBanners(prev, updatedList));
    toast.success('New promotional banner added. Remember to Save Changes.');
  };

  const handleRemovePromoBanner = (index) => {
    const currentList = data.promoBanners || [];
    const removedTitle = currentList[index]?.title || `Banner #${index + 1}`;
    const updatedList = currentList.filter((_, i) => i !== index);
    setData((prev) => syncPromoBanners(prev, updatedList));
    toast.success(`Removed "${removedTitle}". Remember to Save Changes.`);
  };

  const handleTogglePromoBanner = (index) => {
    const currentList = data.promoBanners || [];
    const updatedList = currentList.map((banner, i) =>
      i === index ? { ...banner, enabled: banner.enabled === false ? true : false } : banner
    );
    setData((prev) => syncPromoBanners(prev, updatedList));
  };

  const handleUpdatePromoBanner = (index, field, value) => {
    const currentList = data.promoBanners || [];
    const updatedList = currentList.map((banner, i) =>
      i === index ? { ...banner, [field]: value } : banner
    );
    setData((prev) => syncPromoBanners(prev, updatedList));
  };

  const handleMovePromoBanner = (index, direction) => {
    const currentList = data.promoBanners || [];
    const target = index + direction;
    if (target < 0 || target >= currentList.length) return;
    const updatedList = [...currentList];
    const temp = updatedList[index];
    updatedList[index] = updatedList[target];
    updatedList[target] = temp;
    setData((prev) => syncPromoBanners(prev, updatedList));
  };

  // ==========================================
  // Hero slide handlers
  // ==========================================
  const handleAddHeroSlide = () => {
    const newSlide = {
      id: Date.now(),
      src: '/hero_banner_1.png',
      alt: 'Seasonal Eyewear Campaign',
      title: 'New Season Frames',
      subtitle: 'Hand-polished Japanese titanium and lightweight acetate',
      ctaText: 'Shop New Arrivals',
      ctaLink: '/shop?sort=newest',
    };
    setData((prev) => ({
      ...prev,
      heroBanners: [...prev.heroBanners, newSlide],
    }));
  };

  const handleUpdateHeroSlide = (index, field, value) => {
    setData((prev) => {
      const slides = [...prev.heroBanners];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, heroBanners: slides };
    });
  };

  const handleRemoveHeroSlide = (index) => {
    if (data.heroBanners.length <= 1) {
      toast.error('At least one hero banner is required');
      return;
    }
    setData((prev) => ({
      ...prev,
      heroBanners: prev.heroBanners.filter((_, i) => i !== index),
    }));
  };

  const handleMoveHeroSlide = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= data.heroBanners.length) return;
    setData((prev) => {
      const slides = [...prev.heroBanners];
      const temp = slides[index];
      slides[index] = slides[target];
      slides[target] = temp;
      return { ...prev, heroBanners: slides };
    });
  };

  // ==========================================
  // Featured Collection Card handlers
  // ==========================================
  const handleUpdateCollection = (index, field, value) => {
    setData((prev) => {
      const colls = [...prev.featuredCollections];
      colls[index] = { ...colls[index], [field]: value };
      return { ...prev, featuredCollections: colls };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        <span className="ml-3 font-bold text-sm">Loading banner settings...</span>
      </div>
    );
  }

  const promoBannerCount = (data.promoBanners || []).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight uppercase">
            Homepage Banners & Marketing Blocks
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Customize the Hero Slider, Promotional Campaign Banners, and 6-Card Featured Collections Grid.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-none text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-200"
          >
            <FiRotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-none bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
          }`}
        >
          Hero Banner Slider ({data.heroBanners.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'promos'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
          }`}
        >
          Promotional Banners ({promoBannerCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'collections'
              ? 'bg-black text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
          }`}
        >
          Featured Collections Grid ({data.featuredCollections.length})
        </button>
      </div>

      {/* TAB 1: Hero Banner Slider */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5 uppercase tracking-wider">
                <FiClock className="w-3.5 h-3.5 text-black" /> Slide Interval:
              </label>
              <select
                value={data.heroInterval}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, heroInterval: Number(e.target.value) }))
                }
                className="bg-neutral-50 text-xs font-bold px-3 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
              >
                <option value={3000}>3 Seconds</option>
                <option value={5000}>5 Seconds (Recommended)</option>
                <option value={7000}>7 Seconds</option>
                <option value={10000}>10 Seconds</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddHeroSlide}
              className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {data.heroBanners.map((slide, index) => (
              <div
                key={slide.id || index}
                className="bg-white rounded-none border border-neutral-200 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-black text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-black uppercase tracking-wider">
                      Slide #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveHeroSlide(index, -1)}
                      disabled={index === 0}
                      className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <FiArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveHeroSlide(index, 1)}
                      disabled={index === data.heroBanners.length - 1}
                      className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <FiArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroSlide(index)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 cursor-pointer"
                      title="Remove Slide"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Preview Thumbnail */}
                  <div className="relative aspect-[21/9] rounded-none overflow-hidden bg-neutral-100 border border-neutral-200">
                    <img
                      src={slide.src}
                      alt={slide.alt || 'Slide image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/hero_banner_1.png';
                      }}
                    />
                  </div>

                  {/* Form fields */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                          Banner Image URL / Path *
                        </label>
                        <input
                          type="text"
                          value={slide.src}
                          onChange={(e) => handleUpdateHeroSlide(index, 'src', e.target.value)}
                          placeholder="/hero_banner_1.png or https://..."
                          className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                          Image Alt Text
                        </label>
                        <input
                          type="text"
                          value={slide.alt}
                          onChange={(e) => handleUpdateHeroSlide(index, 'alt', e.target.value)}
                          className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                          Slide Headline
                        </label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'title', e.target.value)}
                          placeholder="e.g. Bespoke Titanium & Japanese Acetate"
                          className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                          Sub-headline / Description
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'subtitle', e.target.value)}
                          placeholder="e.g. Engineered for uncompromising visual clarity"
                          className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.ctaText || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'ctaText', e.target.value)}
                          placeholder="e.g. Explore Collection"
                          className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                          CTA Link / Destination
                        </label>
                        <input
                          type="text"
                          value={slide.ctaLink || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'ctaLink', e.target.value)}
                          placeholder="e.g. /shop, /shop?category=sunglasses"
                          className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Promotional Banners (With Full Add & Remove Capabilities) */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h2 className="text-sm font-black text-black uppercase tracking-wider">
                Storefront Promotional Banners
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Add, reorder, remove, or toggle promotional campaign banners shown across the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPromoBanner}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-none text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <FiPlus className="w-4 h-4" /> Add Promotional Banner
            </button>
          </div>

          {promoBannerCount === 0 ? (
            <div className="bg-white border border-neutral-200 p-12 text-center rounded-none space-y-3">
              <FiImage className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                No Promotional Banners Configured
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                All promotional banners have been removed. Click the button below to add a promotional banner to the storefront.
              </p>
              <button
                type="button"
                onClick={handleAddPromoBanner}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer mt-2"
              >
                <FiPlus className="w-3.5 h-3.5" /> Add First Promotional Banner
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {data.promoBanners.map((banner, index) => (
                <div
                  key={banner.id || index}
                  className={`bg-white border transition-all rounded-none p-5 shadow-xs space-y-4 ${
                    banner.enabled !== false
                      ? 'border-neutral-200 hover:border-black'
                      : 'border-neutral-200 opacity-60 bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 bg-black text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-black uppercase tracking-wider">
                        {banner.title || `Banner #${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTogglePromoBanner(index)}
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider cursor-pointer border transition-colors ${
                          banner.enabled !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-neutral-200 text-neutral-600 border-neutral-300 hover:bg-neutral-300'
                        }`}
                        title={banner.enabled !== false ? 'Click to hide banner' : 'Click to display banner'}
                      >
                        {banner.enabled !== false ? '● Active' : '○ Hidden'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMovePromoBanner(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <FiArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePromoBanner(index, 1)}
                        disabled={index === data.promoBanners.length - 1}
                        className="p-1.5 text-neutral-400 hover:text-black disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <FiArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePromoBanner(index)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-none ml-2 transition-colors cursor-pointer"
                        title="Delete this banner"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Preview Thumbnail */}
                    <div className="aspect-[21/9] sm:aspect-video rounded-none overflow-hidden bg-neutral-100 border border-neutral-200 relative flex items-center justify-center">
                      <img
                        src={banner.image}
                        alt={banner.alt || 'Promotional Banner'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/promo_banner.png';
                        }}
                      />
                    </div>

                    {/* Inputs */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                            Banner Label / Title
                          </label>
                          <input
                            type="text"
                            value={banner.title || ''}
                            onChange={(e) => handleUpdatePromoBanner(index, 'title', e.target.value)}
                            placeholder="e.g. Category Promo Banner"
                            className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                            Image Alt Text
                          </label>
                          <input
                            type="text"
                            value={banner.alt || ''}
                            onChange={(e) => handleUpdatePromoBanner(index, 'alt', e.target.value)}
                            placeholder="e.g. Special Eyewear Offer"
                            className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                            Banner Image URL *
                          </label>
                          <input
                            type="text"
                            value={banner.image || ''}
                            onChange={(e) => handleUpdatePromoBanner(index, 'image', e.target.value)}
                            placeholder="/promo_banner.png or https://..."
                            className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:border-black focus:outline-none font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                            Redirect Destination URL
                          </label>
                          <input
                            type="text"
                            value={banner.link || ''}
                            onChange={(e) => handleUpdatePromoBanner(index, 'link', e.target.value)}
                            placeholder="/shop?sort=featured"
                            className="w-full bg-white text-xs px-3 py-2 rounded-none border border-neutral-300 focus:border-black focus:outline-none font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Featured Collections 6-Card Grid */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <p className="text-xs text-neutral-500">
            Customize the 6 prominent square discovery cards displayed directly under categories on the homepage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.featuredCollections.map((card, index) => (
              <div
                key={card.id || index}
                className="bg-white rounded-none border border-neutral-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <span className="text-xs font-black text-black uppercase tracking-wider">
                    Card #{index + 1}: {card.title}
                  </span>
                  <div className="w-8 h-8 rounded-none overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Title *</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCollection(index, 'title', e.target.value)}
                      className="w-full bg-white text-xs font-semibold px-2.5 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={card.tagline}
                      onChange={(e) => handleUpdateCollection(index, 'tagline', e.target.value)}
                      className="w-full bg-white text-xs px-2.5 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={card.badge}
                      onChange={(e) => handleUpdateCollection(index, 'badge', e.target.value.toUpperCase())}
                      className="w-full bg-white text-xs font-bold px-2.5 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black uppercase tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Badge Color</label>
                    <select
                      value={card.dotColor}
                      onChange={(e) => handleUpdateCollection(index, 'dotColor', e.target.value)}
                      className="w-full bg-white text-xs font-bold px-2 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black"
                    >
                      {DOT_COLORS.map((col) => (
                        <option key={col.value} value={col.value}>
                          {col.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Redirect Link</label>
                    <input
                      type="text"
                      value={card.link}
                      onChange={(e) => handleUpdateCollection(index, 'link', e.target.value)}
                      className="w-full bg-white text-xs px-2.5 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={card.image}
                      onChange={(e) => handleUpdateCollection(index, 'image', e.target.value)}
                      className="w-full bg-white text-xs px-2.5 py-1.5 rounded-none border border-neutral-300 focus:outline-none focus:border-black font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button Bar */}
      <div className="flex justify-end pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-none bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <FiSave className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish Marketing Blocks'}</span>
        </button>
      </div>
    </div>
  );
}
