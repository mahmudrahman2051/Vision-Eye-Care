import React, { useState, useEffect } from 'react';
import {
  FiImage,
  FiPlus,
  FiTrash2,
  FiSave,
  FiRotateCcw,
  FiArrowUp,
  FiArrowDown,
  FiExternalLink,
  FiLayers,
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
  categoryPromoBanner: {
    image: '/promo_banner.png',
    alt: 'Special Eyewear Offer',
    link: '/shop?sort=featured',
  },
  lowerPromoBanner: {
    image: '/promo_banner.png',
    alt: 'Exclusive Seasonal Drop',
    link: '/shop?sort=popular',
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
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await bannerService.getBanners();
        if (res) setData({ ...DEFAULT_BLOCKS, ...res });
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

  // Hero slide handlers
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

  // Featured Collection Card handlers
  const handleUpdateCollection = (index, field, value) => {
    setData((prev) => {
      const colls = [...prev.featuredCollections];
      colls[index] = { ...colls[index], [field]: value };
      return { ...prev, featuredCollections: colls };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#8B7355]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]" />
        <span className="ml-3 font-bold text-sm">Loading banner settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD0]">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            Homepage Banners & Marketing Blocks
          </h1>
          <p className="text-xs text-[#777] mt-1">
            Customize the Hero Slider, Promotional Campaign Banners, and 6-Card Featured Collections Grid.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#666] hover:text-[#1A1A1A] hover:bg-[#E8DFD0]/50 transition-colors"
          >
            <FiRotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DFD0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hero'
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'text-[#666] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
          }`}
        >
          Hero Banner Slider ({data.heroBanners.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'promos'
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'text-[#666] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
          }`}
        >
          Promotional Banners (2)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'collections'
              ? 'bg-[#1A1A1A] text-white shadow-sm'
              : 'text-[#666] hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
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
              <label className="text-xs font-bold text-[#444] flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5 text-[#8B7355]" /> Slide Transition Interval:
              </label>
              <select
                value={data.heroInterval}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, heroInterval: Number(e.target.value) }))
                }
                className="bg-[#FAF7F2] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8B7355] text-white text-xs font-bold hover:bg-[#6B5840] transition-colors"
            >
              <FiPlus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {data.heroBanners.map((slide, index) => (
              <div
                key={slide.id || index}
                className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-[#1A1A1A]">Slide #{index + 1}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveHeroSlide(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-[#888] hover:text-[#1A1A1A] disabled:opacity-30"
                    >
                      <FiArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveHeroSlide(index, 1)}
                      disabled={index === data.heroBanners.length - 1}
                      className="p-1 text-[#888] hover:text-[#1A1A1A] disabled:opacity-30"
                    >
                      <FiArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveHeroSlide(index)}
                      className="p-1 text-red-500 hover:text-red-700 ml-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Preview Thumbnail */}
                  <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFD0]">
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
                        <label className="text-[10px] font-bold text-[#666] block mb-1">
                          Banner Image URL / Path *
                        </label>
                        <input
                          type="text"
                          value={slide.src}
                          onChange={(e) => handleUpdateHeroSlide(index, 'src', e.target.value)}
                          placeholder="/hero_banner_1.png or https://..."
                          className="w-full bg-[#FAF7F2] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#666] block mb-1">
                          Image Alt Text
                        </label>
                        <input
                          type="text"
                          value={slide.alt}
                          onChange={(e) => handleUpdateHeroSlide(index, 'alt', e.target.value)}
                          className="w-full bg-[#FAF7F2] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#666] block mb-1">
                          Slide Headline
                        </label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'title', e.target.value)}
                          placeholder="e.g. Bespoke Titanium & Japanese Acetate"
                          className="w-full bg-[#FAF7F2] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#666] block mb-1">
                          Sub-headline / Description
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'subtitle', e.target.value)}
                          placeholder="e.g. Engineered for uncompromising visual clarity"
                          className="w-full bg-[#FAF7F2] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#666] block mb-1">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.ctaText || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'ctaText', e.target.value)}
                          placeholder="e.g. Explore Collection"
                          className="w-full bg-[#FAF7F2] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#666] block mb-1">
                          CTA Link / Destination
                        </label>
                        <input
                          type="text"
                          value={slide.ctaLink || ''}
                          onChange={(e) => handleUpdateHeroSlide(index, 'ctaLink', e.target.value)}
                          placeholder="e.g. /shop, /shop?category=sunglasses"
                          className="w-full bg-[#FAF7F2] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
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

      {/* TAB 2: Promotional Banners */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          {/* Category Promo Banner */}
          <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#8B7355]/10 text-[#8B7355]">
                <FiImage className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-black text-[#1A1A1A]">Category Promo Banner</h3>
                <p className="text-[11px] text-[#777]">
                  Appears between Top Categories and Featured Collections grid on the homepage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFD0] max-h-36">
                <img
                  src={data.categoryPromoBanner.image}
                  alt={data.categoryPromoBanner.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-2 space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#444] block mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={data.categoryPromoBanner.image}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        categoryPromoBanner: { ...prev.categoryPromoBanner, image: e.target.value },
                      }))
                    }
                    className="w-full bg-[#FAF7F2] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#444] block mb-1">Redirect Destination URL</label>
                  <input
                    type="text"
                    value={data.categoryPromoBanner.link}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        categoryPromoBanner: { ...prev.categoryPromoBanner, link: e.target.value },
                      }))
                    }
                    className="w-full bg-[#FAF7F2] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lower Promo Banner */}
          <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#8B7355]/10 text-[#8B7355]">
                <FiImage className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-black text-[#1A1A1A]">Lower Promo Banner</h3>
                <p className="text-[11px] text-[#777]">
                  Appears under the Hot Selling Products carousel before the footer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFD0] max-h-36">
                <img
                  src={data.lowerPromoBanner.image}
                  alt={data.lowerPromoBanner.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-2 space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#444] block mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={data.lowerPromoBanner.image}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        lowerPromoBanner: { ...prev.lowerPromoBanner, image: e.target.value },
                      }))
                    }
                    className="w-full bg-[#FAF7F2] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#444] block mb-1">Redirect Destination URL</label>
                  <input
                    type="text"
                    value={data.lowerPromoBanner.link}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        lowerPromoBanner: { ...prev.lowerPromoBanner, link: e.target.value },
                      }))
                    }
                    className="w-full bg-[#FAF7F2] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Featured Collections 6-Card Grid */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <p className="text-xs text-[#777]">
            Customize the 6 prominent square discovery cards displayed directly under categories on the homepage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.featuredCollections.map((card, index) => (
              <div
                key={card.id || index}
                className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD0]">
                  <span className="text-xs font-black text-[#8B7355] uppercase tracking-wider">
                    Card #{index + 1}: {card.title}
                  </span>
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#666] block mb-1">Title *</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateCollection(index, 'title', e.target.value)}
                      className="w-full bg-[#FAF7F2] text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666] block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={card.tagline}
                      onChange={(e) => handleUpdateCollection(index, 'tagline', e.target.value)}
                      className="w-full bg-[#FAF7F2] text-xs px-2.5 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666] block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={card.badge}
                      onChange={(e) => handleUpdateCollection(index, 'badge', e.target.value.toUpperCase())}
                      className="w-full bg-[#FAF7F2] text-xs font-bold px-2.5 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666] block mb-1">Badge Color</label>
                    <select
                      value={card.dotColor}
                      onChange={(e) => handleUpdateCollection(index, 'dotColor', e.target.value)}
                      className="w-full bg-[#FAF7F2] text-xs font-bold px-2 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
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
                    <label className="text-[10px] font-bold text-[#666] block mb-1">Redirect Link</label>
                    <input
                      type="text"
                      value={card.link}
                      onChange={(e) => handleUpdateCollection(index, 'link', e.target.value)}
                      className="w-full bg-[#FAF7F2] text-xs px-2.5 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#666] block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={card.image}
                      onChange={(e) => handleUpdateCollection(index, 'image', e.target.value)}
                      className="w-full bg-[#FAF7F2] text-xs px-2.5 py-1.5 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button Bar */}
      <div className="flex justify-end pt-4 border-t border-[#E8DFD0]">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
        >
          <FiSave className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish Marketing Blocks'}</span>
        </button>
      </div>
    </div>
  );
}
