import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiSliders,
  FiPlus,
  FiTrash2,
  FiSave,
  FiRotateCcw,
  FiEye,
  FiCheck,
  FiArrowUp,
  FiArrowDown,
  FiExternalLink,
  FiTag,
  FiVolume2,
  FiCopy,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import tickerService, {
  DEFAULT_TICKER_SETTINGS,
  DEFAULT_COUPON_TICKER_SETTINGS,
} from '../services/tickerService';
import couponService from '../services/couponService';

const PRESET_THEMES = [
  {
    name: 'Obsidian & Gold',
    desc: 'Signature luxury palette',
    bg: '#1A1A1A',
    text: '#FAF7F2',
    accent: '#8B7355',
  },
  {
    name: 'Champagne Cream',
    desc: 'Soft warm aesthetic',
    bg: '#F5EFE3',
    text: '#1A1A1A',
    accent: '#8B7355',
  },
  {
    name: 'Midnight Azure',
    desc: 'Modern tech contrast',
    bg: '#0F172A',
    text: '#F8FAFC',
    accent: '#38BDF8',
  },
  {
    name: 'Imperial Emerald',
    desc: 'Subtle prestige look',
    bg: '#142820',
    text: '#F2F7F4',
    accent: '#10B981',
  },
  {
    name: 'Atelier Burgundy',
    desc: 'Boutique premium finish',
    bg: '#2C0F17',
    text: '#FFF5F7',
    accent: '#E0A96D',
  },
];

const COUPON_PRESET_THEMES = [
  {
    name: 'Obsidian Noir',
    desc: 'Deep black & warm gold badge',
    bg: '#121212',
    text: '#FAF7F2',
    accent: '#8B7355',
  },
  {
    name: 'Deep Crimson Promo',
    desc: 'High-urgency promotional red',
    bg: '#240A10',
    text: '#FFF5F5',
    accent: '#E05A6D',
  },
  {
    name: 'Imperial Emerald',
    desc: 'Prestige forest green & mint',
    bg: '#0E261E',
    text: '#F2FDF8',
    accent: '#10B981',
  },
  {
    name: 'Champagne Atelier',
    desc: 'Warm cream & bronze typography',
    bg: '#F5EFE3',
    text: '#1A1A1A',
    accent: '#8B7355',
  },
  {
    name: 'Midnight Azure',
    desc: 'Deep navy with electric cyan',
    bg: '#0B132B',
    text: '#F0F4F8',
    accent: '#38BDF8',
  },
  {
    name: 'Atelier Burgundy',
    desc: 'Boutique berry & warm honey',
    bg: '#2C0F17',
    text: '#FFF5F7',
    accent: '#E0A96D',
  },
];

const SEPARATORS = ['✦', '●', '★', '❖', '◈', '|', '•'];

export default function AdminTickerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'coupon' ? 'coupon' : 'main';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Main Ticker State
  const [mainSettings, setMainSettings] = useState(DEFAULT_TICKER_SETTINGS);
  const [savingMain, setSavingMain] = useState(false);

  // Coupon Ticker State
  const [couponSettings, setCouponSettings] = useState(DEFAULT_COUPON_TICKER_SETTINGS);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [previewCopiedCode, setPreviewCopiedCode] = useState(null);

  const [loading, setLoading] = useState(true);

  // Keep URL query param in sync with tab
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'coupon' ? { tab: 'coupon' } : {});
  };

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const [mainData, couponTickerData, couponsData] = await Promise.all([
          tickerService.getSettings(),
          tickerService.getCouponTickerSettings(),
          couponService.getCoupons(),
        ]);

        if (mainData) {
          setMainSettings({ ...DEFAULT_TICKER_SETTINGS, ...mainData });
        }
        if (couponTickerData) {
          setCouponSettings({ ...DEFAULT_COUPON_TICKER_SETTINGS, ...couponTickerData });
        }
        if (couponsData?.data) {
          setAvailableCoupons(couponsData.data);
        }
      } catch (err) {
        toast.error('Failed to load settings from storage');
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // --- Main Ticker Handlers ---
  const handleSaveMain = async (e) => {
    e?.preventDefault();
    if (mainSettings.messages.length === 0) {
      toast.error('Please keep at least one announcement message.');
      return;
    }

    try {
      setSavingMain(true);
      await tickerService.updateSettings(mainSettings);
      toast.success('Main announcement ticker saved and published!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save ticker settings');
    } finally {
      setSavingMain(false);
    }
  };

  const handleResetMain = () => {
    if (window.confirm('Reset main marquee ticker to factory defaults?')) {
      setMainSettings(DEFAULT_TICKER_SETTINGS);
      toast.success('Main ticker reset to defaults. Click Save to publish.');
    }
  };

  const handleApplyMainTheme = (theme) => {
    setMainSettings((prev) => ({
      ...prev,
      backgroundColor: theme.bg,
      textColor: theme.text,
      accentColor: theme.accent,
    }));
    toast.success(`Theme "${theme.name}" applied`);
  };

  const handleAddMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      text: 'Special Eid Offer: Buy 1 Frame & Get 1 Free Anti-Glare Lens',
      badge: 'PROMO',
      link: '/shop',
    };
    setMainSettings((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const handleUpdateMessage = (index, field, value) => {
    setMainSettings((prev) => {
      const updated = [...prev.messages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, messages: updated };
    });
  };

  const handleRemoveMessage = (index) => {
    if (mainSettings.messages.length <= 1) {
      toast.error('At least one announcement is required');
      return;
    }
    setMainSettings((prev) => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index),
    }));
  };

  const handleMoveMessage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= mainSettings.messages.length) return;

    setMainSettings((prev) => {
      const updated = [...prev.messages];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, messages: updated };
    });
  };

  // --- Coupon Ticker Handlers ---
  const handleSaveCoupon = async (e) => {
    e?.preventDefault();
    try {
      setSavingCoupon(true);
      await tickerService.updateCouponTickerSettings(couponSettings);
      toast.success('Coupon promo ticker saved and published!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon ticker settings');
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleResetCoupon = () => {
    if (window.confirm('Reset coupon promo ticker to factory defaults?')) {
      setCouponSettings(DEFAULT_COUPON_TICKER_SETTINGS);
      toast.success('Coupon ticker reset to defaults. Click Save to publish.');
    }
  };

  const handleApplyCouponTheme = (theme) => {
    setCouponSettings((prev) => ({
      ...prev,
      backgroundColor: theme.bg,
      textColor: theme.text,
      accentColor: theme.accent,
    }));
    toast.success(`Theme "${theme.name}" applied`);
  };

  const handlePreviewCopy = (code) => {
    setPreviewCopiedCode(code);
    toast.success(`Coupon "${code}" copied! (Interactive preview test)`, {
      icon: '🏷️',
      style: {
        borderRadius: '12px',
        background: '#1A1A1A',
        color: '#FAF7F2',
        border: `1px solid ${couponSettings.accentColor}`,
      },
    });
    setTimeout(() => setPreviewCopiedCode(null), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#8B7355]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]" />
        <span className="ml-3 font-bold text-sm">Loading ticker settings...</span>
      </div>
    );
  }

  const activeCouponsList = availableCoupons.filter((c) => Boolean(c.is_active));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD0]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">
            Storefront Tickers & Banners
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
            Marquee Ticker Customization
          </h1>
          <p className="text-xs text-[#777] mt-1">
            Configure dynamic scrolling announcement bars and promo coupon tickers displayed across your storefront.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-[#F5EFE3] border border-[#E8DFD0]">
          <button
            type="button"
            onClick={() => handleTabSwitch('main')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'main'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-[#666] hover:text-[#1A1A1A]'
            }`}
          >
            <FiVolume2 className="w-3.5 h-3.5 text-[#8B7355]" />
            <span>Main Announcement Ticker</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('coupon')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coupon'
                ? 'bg-white text-[#1A1A1A] shadow-sm'
                : 'text-[#666] hover:text-[#1A1A1A]'
            }`}
          >
            <FiTag className="w-3.5 h-3.5 text-[#8B7355]" />
            <span>Coupon Promo Ticker</span>
            {activeCouponsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#8B7355] text-white">
                {activeCouponsList.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MAIN ANNOUNCEMENT TICKER (UNDER NAVBAR)           */}
      {/* ========================================================= */}
      {activeTab === 'main' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Subheader & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  mainSettings.enabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {mainSettings.enabled ? 'Live on Store' : 'Disabled'}
              </span>
              <span className="text-xs text-[#777]">
                Positioned <strong>directly beneath</strong> the main header navbar.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetMain}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#666] hover:text-[#1A1A1A] hover:bg-[#E8DFD0]/50 transition-colors"
              >
                <FiRotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={handleSaveMain}
                disabled={savingMain}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{savingMain ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
                <FiEye className="w-4 h-4 text-[#8B7355]" />
                <span>Live Interactive Preview (Under Navbar Ticker)</span>
                <span className="text-[10px] text-[#888] font-normal">
                  (Hover to pause, preview exact styling)
                </span>
              </div>
              <div className="text-[11px] text-[#666]">
                Speed: <span className="font-bold text-[#1A1A1A]">{mainSettings.speed}s</span> • Direction:{' '}
                <span className="font-bold uppercase text-[#1A1A1A]">{mainSettings.direction}</span>
              </div>
            </div>

            {/* Ticker Box */}
            <div className="rounded-xl overflow-hidden border border-[#E8DFD0] shadow-inner">
              {mainSettings.enabled ? (
                <div
                  className={`relative w-full overflow-hidden select-none py-2 px-3 text-xs font-medium ${
                    mainSettings.pauseOnHover ? 'pause-hover' : ''
                  }`}
                  style={{
                    backgroundColor: mainSettings.backgroundColor,
                    color: mainSettings.textColor,
                    '--marquee-duration': `${Math.max(10, mainSettings.speed)}s`,
                  }}
                >
                  <div className="flex w-max marquee-track">
                    <div
                      className={`flex items-center shrink-0 ${
                        mainSettings.direction === 'right'
                          ? 'animate-marquee-right'
                          : 'animate-marquee-left'
                      } marquee-track`}
                      style={{ '--marquee-duration': `${Math.max(10, mainSettings.speed)}s` }}
                    >
                      {[...mainSettings.messages, ...mainSettings.messages, ...mainSettings.messages].map(
                        (item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 px-5 whitespace-nowrap"
                          >
                            {item.badge && (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                                style={{
                                  backgroundColor: mainSettings.accentColor,
                                  color: '#FFFFFF',
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                            <span className="font-medium">{item.text}</span>
                            <span
                              className="opacity-60 text-[10px] ml-3"
                              style={{ color: mainSettings.accentColor }}
                            >
                              {mainSettings.separator}
                            </span>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs font-semibold text-[#888] bg-[#FAF7F2]">
                  Ticker is currently disabled. Toggle &quot;Enable Marquee Ticker&quot; below to display.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Visual Appearance & Animation Controls */}
            <div className="space-y-6">
              {/* General Toggles */}
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
                  <FiSliders className="w-4 h-4 text-[#8B7355]" />
                  Display & Controls
                </h2>

                {/* Enable Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0]/60">
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Enable Announcement Ticker</p>
                    <p className="text-[10px] text-[#777]">Render beneath the storefront navbar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mainSettings.enabled}
                      onChange={(e) =>
                        setMainSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B7355]"></div>
                  </label>
                </div>

                {/* Pause on Hover */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0]/60">
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Pause On Hover</p>
                    <p className="text-[10px] text-[#777]">Freeze animation when hovered</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mainSettings.pauseOnHover}
                      onChange={(e) =>
                        setMainSettings((prev) => ({ ...prev, pauseOnHover: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B7355]"></div>
                  </label>
                </div>

                {/* Animation Speed Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#1A1A1A]">Animation Speed</label>
                    <span className="font-mono font-bold text-[#8B7355] text-xs">
                      {mainSettings.speed}s loop
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="2"
                    value={mainSettings.speed}
                    onChange={(e) =>
                      setMainSettings((prev) => ({ ...prev, speed: Number(e.target.value) }))
                    }
                    className="w-full accent-[#8B7355] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#888]">
                    <span>Faster (12s)</span>
                    <span>Normal (28s)</span>
                    <span>Gentle (60s)</span>
                  </div>
                </div>

                {/* Scroll Direction */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-[#1A1A1A]">Scroll Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMainSettings((prev) => ({ ...prev, direction: 'left' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        mainSettings.direction === 'left'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#444] border-[#E8DFD0] hover:bg-white'
                      }`}
                    >
                      ← Left (Classic)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainSettings((prev) => ({ ...prev, direction: 'right' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        mainSettings.direction === 'right'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#444] border-[#E8DFD0] hover:bg-white'
                      }`}
                    >
                      Right →
                    </button>
                  </div>
                </div>

                {/* Separator Symbol */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-[#1A1A1A]">Divider Symbol</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SEPARATORS.map((sep) => (
                      <button
                        key={sep}
                        type="button"
                        onClick={() => setMainSettings((prev) => ({ ...prev, separator: sep }))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all border ${
                          mainSettings.separator === sep
                            ? 'bg-[#8B7355] text-white border-[#8B7355]'
                            : 'bg-[#FAF7F2] text-[#555] border-[#E8DFD0] hover:bg-white'
                        }`}
                      >
                        {sep}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preset Color Themes */}
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-[#1A1A1A]">Curated Luxury Themes</h2>
                <div className="space-y-2">
                  {PRESET_THEMES.map((theme) => {
                    const isActive =
                      mainSettings.backgroundColor.toLowerCase() === theme.bg.toLowerCase() &&
                      mainSettings.accentColor.toLowerCase() === theme.accent.toLowerCase();
                    return (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => handleApplyMainTheme(theme)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isActive
                            ? 'border-[#8B7355] bg-[#FAF7F2] ring-1 ring-[#8B7355]'
                            : 'border-[#E8DFD0] hover:border-[#8B7355]/40 hover:bg-[#FAF7F2]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: theme.bg, color: theme.accent }}
                          >
                            ✦
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1A1A1A]">{theme.name}</p>
                            <p className="text-[10px] text-[#777]">{theme.desc}</p>
                          </div>
                        </div>
                        {isActive && <FiCheck className="w-4 h-4 text-[#8B7355]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Pickers */}
                <div className="pt-3 border-t border-[#E8DFD0] space-y-3">
                  <p className="text-xs font-bold text-[#1A1A1A]">Custom Colors</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#666] block mb-1">Background</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E8DFD0] bg-[#FAF7F2]">
                        <input
                          type="color"
                          value={mainSettings.backgroundColor}
                          onChange={(e) =>
                            setMainSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={mainSettings.backgroundColor}
                          onChange={(e) =>
                            setMainSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))
                          }
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#666] block mb-1">Text Color</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E8DFD0] bg-[#FAF7F2]">
                        <input
                          type="color"
                          value={mainSettings.textColor}
                          onChange={(e) =>
                            setMainSettings((prev) => ({ ...prev, textColor: e.target.value }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={mainSettings.textColor}
                          onChange={(e) =>
                            setMainSettings((prev) => ({ ...prev, textColor: e.target.value }))
                          }
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#666] block mb-1">Badge Accent</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E8DFD0] bg-[#FAF7F2]">
                        <input
                          type="color"
                          value={mainSettings.accentColor}
                          onChange={(e) =>
                            setMainSettings((prev) => ({ ...prev, accentColor: e.target.value }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={mainSettings.accentColor}
                          onChange={(e) =>
                            setMainSettings((prev) => ({ ...prev, accentColor: e.target.value }))
                          }
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Columns: Announcements & Messages Manager */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-[#1A1A1A]">
                      Announcement Items ({mainSettings.messages.length})
                    </h2>
                    <p className="text-[11px] text-[#777]">
                      These announcements loop endlessly in the marquee bar under the navbar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMessage}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#8B7355] text-[#8B7355] hover:text-white border border-[#8B7355]/40 text-xs font-bold transition-all"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Add Announcement
                  </button>
                </div>

                <div className="space-y-3.5">
                  {mainSettings.messages.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-4 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-[#8B7355] uppercase tracking-wider">
                          Item #{index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveMessage(index, -1)}
                            disabled={index === 0}
                            className="p-1 text-[#888] hover:text-[#1A1A1A] disabled:opacity-30"
                            title="Move Up"
                          >
                            <FiArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMessage(index, 1)}
                            disabled={index === mainSettings.messages.length - 1}
                            className="p-1 text-[#888] hover:text-[#1A1A1A] disabled:opacity-30"
                            title="Move Down"
                          >
                            <FiArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMessage(index)}
                            className="p-1 text-red-500 hover:text-red-700 ml-1"
                            title="Remove Item"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-1">
                          <label className="text-[10px] font-bold text-[#666] block mb-1">
                            Badge (Optional)
                          </label>
                          <input
                            type="text"
                            value={item.badge || ''}
                            onChange={(e) =>
                              handleUpdateMessage(index, 'badge', e.target.value.toUpperCase())
                            }
                            placeholder="e.g. OFFER"
                            className="w-full bg-white text-[#1A1A1A] text-xs font-semibold px-2.5 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="text-[10px] font-bold text-[#666] block mb-1">
                            Announcement Text *
                          </label>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) =>
                              handleUpdateMessage(index, 'text', e.target.value)
                            }
                            placeholder="Enter announcement text..."
                            className="w-full bg-white text-[#1A1A1A] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#666] flex items-center gap-1 mb-1">
                          <FiExternalLink className="w-3 h-3 text-[#8B7355]" />
                          Link / Destination (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.link || ''}
                          onChange={(e) =>
                            handleUpdateMessage(index, 'link', e.target.value)
                          }
                          placeholder="e.g. /shop, /about, or https://wa.me/..."
                          className="w-full bg-white text-[#1A1A1A] text-xs px-3 py-2 rounded-lg border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Add & Save buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-[#E8DFD0]">
                  <button
                    type="button"
                    onClick={handleAddMessage}
                    className="flex items-center gap-1 text-xs font-bold text-[#8B7355] hover:text-[#6B5840]"
                  >
                    <FiPlus className="w-4 h-4" /> Add Another Item
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveMain}
                    disabled={savingMain}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{savingMain ? 'Saving...' : 'Save & Publish Main Ticker'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COUPON PROMO TICKER (OVER NAVBAR)                 */}
      {/* ========================================================= */}
      {activeTab === 'coupon' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Subheader & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  couponSettings.enabled && activeCouponsList.length > 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {!couponSettings.enabled
                  ? 'Disabled'
                  : activeCouponsList.length > 0
                  ? 'Live on Store'
                  : 'Pending Coupons'}
              </span>
              <span className="text-xs text-[#777]">
                Positioned <strong>directly above</strong> the storefront header navbar.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/coupons"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#8B7355] hover:text-[#6B5840] hover:bg-[#FAF7F2] transition-colors border border-[#8B7355]/30"
              >
                <FiTag className="w-3.5 h-3.5" /> Manage Promo Coupons
              </Link>
              <button
                type="button"
                onClick={handleResetCoupon}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#666] hover:text-[#1A1A1A] hover:bg-[#E8DFD0]/50 transition-colors"
              >
                <FiRotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={handleSaveCoupon}
                disabled={savingCoupon}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{savingCoupon ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
                <FiEye className="w-4 h-4 text-[#8B7355]" />
                <span>Live Interactive Preview (Over Navbar Coupon Ticker)</span>
                <span className="text-[10px] text-[#888] font-normal">
                  (Click any coupon code in the preview to test copy action)
                </span>
              </div>
              <div className="text-[11px] text-[#666]">
                Speed: <span className="font-bold text-[#1A1A1A]">{couponSettings.speed}s</span> • Direction:{' '}
                <span className="font-bold uppercase text-[#1A1A1A]">{couponSettings.direction}</span>
              </div>
            </div>

            {/* Coupon Ticker Box */}
            <div className="rounded-xl overflow-hidden border border-[#E8DFD0] shadow-inner">
              {!couponSettings.enabled ? (
                <div className="py-4 text-center text-xs font-semibold text-[#888] bg-[#FAF7F2]">
                  Coupon Ticker is currently disabled. Toggle &quot;Enable Coupon Ticker&quot; below to display.
                </div>
              ) : activeCouponsList.length === 0 ? (
                <div className="py-6 px-4 text-center space-y-2 bg-[#FAF7F2]">
                  <p className="text-xs font-bold text-[#1A1A1A]">No active coupons available to display.</p>
                  <p className="text-[11px] text-[#777]">
                    Create a coupon code in Promo Coupons (e.g. WELCOME101) to feature it in this top ticker.
                  </p>
                  <Link
                    to="/admin/coupons"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-wider"
                  >
                    <FiPlus className="w-3 h-3" /> Create Your First Coupon
                  </Link>
                </div>
              ) : (
                <div
                  className={`relative w-full overflow-hidden select-none py-2 text-xs font-medium ${
                    couponSettings.pauseOnHover ? 'pause-hover' : ''
                  }`}
                  style={{
                    backgroundColor: couponSettings.backgroundColor,
                    color: couponSettings.textColor,
                    '--marquee-duration': `${Math.max(10, couponSettings.speed)}s`,
                  }}
                >
                  <div className="flex w-max marquee-track">
                    <div
                      className={`flex items-center shrink-0 ${
                        couponSettings.direction === 'right'
                          ? 'animate-marquee-right'
                          : 'animate-marquee-left'
                      } marquee-track`}
                      style={{ '--marquee-duration': `${Math.max(10, couponSettings.speed)}s` }}
                    >
                      {/* Repeat active coupons */}
                      {[
                        ...activeCouponsList,
                        ...activeCouponsList,
                        ...activeCouponsList,
                        ...activeCouponsList,
                      ].map((coupon, idx) => {
                        const isPercentage = coupon.discount_type === 'percentage';
                        const badgeLabel = isPercentage
                          ? `${coupon.discount_value}% OFF`
                          : `৳${coupon.discount_value} OFF`;
                        const isCopied = previewCopiedCode === coupon.code;

                        return (
                          <span
                            key={idx}
                            onClick={() => handlePreviewCopy(coupon.code)}
                            title={`Click to test copy: ${coupon.code}`}
                            className="inline-flex items-center gap-2.5 px-6 whitespace-nowrap cursor-pointer group"
                          >
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white shadow-xs group-hover:scale-105 transition-transform"
                              style={{
                                backgroundColor: couponSettings.accentColor,
                                color: '#FFFFFF',
                              }}
                            >
                              {badgeLabel}
                            </span>

                            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-black px-2 py-0.5 rounded bg-white/10 border border-white/20 text-current group-hover:bg-white/20 transition-colors">
                              <span>CODE: {coupon.code}</span>
                              {isCopied ? (
                                <FiCheck className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <FiCopy className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                              )}
                            </span>

                            <span className="text-[11px] font-medium tracking-wide opacity-90">
                              {coupon.description || 'Special storewide discount available today'}
                            </span>

                            {couponSettings.promptText && (
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider group-hover:underline"
                                style={{ color: couponSettings.accentColor }}
                              >
                                {couponSettings.promptText}
                              </span>
                            )}

                            <span
                              className="opacity-60 text-[10px] ml-4 font-bold"
                              style={{ color: couponSettings.accentColor }}
                            >
                              {couponSettings.separator || '✦'}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Visual Appearance & Animation Controls */}
            <div className="space-y-6">
              {/* Display & Behavior */}
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
                  <FiSliders className="w-4 h-4 text-[#8B7355]" />
                  Display & Behavior
                </h2>

                {/* Enable Coupon Ticker */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0]/60">
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Enable Coupon Ticker</p>
                    <p className="text-[10px] text-[#777]">Render at very top of storefront over navbar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={couponSettings.enabled}
                      onChange={(e) =>
                        setCouponSettings((prev) => ({ ...prev, enabled: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B7355]"></div>
                  </label>
                </div>

                {/* Pause on Hover */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0]/60">
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Pause On Hover</p>
                    <p className="text-[10px] text-[#777]">Freeze ticker when customer hovers to read or copy</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={couponSettings.pauseOnHover}
                      onChange={(e) =>
                        setCouponSettings((prev) => ({ ...prev, pauseOnHover: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B7355]"></div>
                  </label>
                </div>

                {/* Animation Speed Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#1A1A1A]">Animation Speed</label>
                    <span className="font-mono font-bold text-[#8B7355] text-xs">
                      {couponSettings.speed}s loop
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="2"
                    value={couponSettings.speed}
                    onChange={(e) =>
                      setCouponSettings((prev) => ({ ...prev, speed: Number(e.target.value) }))
                    }
                    className="w-full accent-[#8B7355] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#888]">
                    <span>Faster (10s)</span>
                    <span>Balanced (24s)</span>
                    <span>Gentle (60s)</span>
                  </div>
                </div>

                {/* Scroll Direction */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-[#1A1A1A]">Scroll Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCouponSettings((prev) => ({ ...prev, direction: 'left' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        couponSettings.direction === 'left'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#444] border-[#E8DFD0] hover:bg-white'
                      }`}
                    >
                      ← Left (Standard)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponSettings((prev) => ({ ...prev, direction: 'right' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        couponSettings.direction === 'right'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#444] border-[#E8DFD0] hover:bg-white'
                      }`}
                    >
                      Right →
                    </button>
                  </div>
                </div>

                {/* Divider Symbol */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-[#1A1A1A]">Divider Symbol</label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {SEPARATORS.map((sep) => (
                      <button
                        key={sep}
                        type="button"
                        onClick={() => setCouponSettings((prev) => ({ ...prev, separator: sep }))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all border ${
                          couponSettings.separator === sep
                            ? 'bg-[#8B7355] text-white border-[#8B7355]'
                            : 'bg-[#FAF7F2] text-[#555] border-[#E8DFD0] hover:bg-white'
                        }`}
                      >
                        {sep}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Action Text */}
                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-[#1A1A1A]">
                    Click-to-Copy Action Label
                  </label>
                  <input
                    type="text"
                    value={couponSettings.promptText || ''}
                    onChange={(e) =>
                      setCouponSettings((prev) => ({ ...prev, promptText: e.target.value }))
                    }
                    placeholder="e.g. [Click to Copy] or [Tap to Copy]"
                    className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
                  />
                  <p className="text-[10px] text-[#888]">
                    Appears next to the promo code to prompt customers to copy. Leave empty to hide.
                  </p>
                </div>
              </div>

              {/* Preset Color Themes */}
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-[#1A1A1A]">Curated Promo Color Palettes</h2>
                <div className="space-y-2">
                  {COUPON_PRESET_THEMES.map((theme) => {
                    const isActive =
                      couponSettings.backgroundColor.toLowerCase() === theme.bg.toLowerCase() &&
                      couponSettings.accentColor.toLowerCase() === theme.accent.toLowerCase();
                    return (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => handleApplyCouponTheme(theme)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isActive
                            ? 'border-[#8B7355] bg-[#FAF7F2] ring-1 ring-[#8B7355]'
                            : 'border-[#E8DFD0] hover:border-[#8B7355]/40 hover:bg-[#FAF7F2]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-xs font-bold shadow-xs"
                            style={{ backgroundColor: theme.bg, color: theme.accent }}
                          >
                            🏷️
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#1A1A1A]">{theme.name}</p>
                            <p className="text-[10px] text-[#777]">{theme.desc}</p>
                          </div>
                        </div>
                        {isActive && <FiCheck className="w-4 h-4 text-[#8B7355]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Pickers */}
                <div className="pt-3 border-t border-[#E8DFD0] space-y-3">
                  <p className="text-xs font-bold text-[#1A1A1A]">Custom Colors</p>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-[#666] block mb-1">Bar Background</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E8DFD0] bg-[#FAF7F2]">
                        <input
                          type="color"
                          value={couponSettings.backgroundColor}
                          onChange={(e) =>
                            setCouponSettings((prev) => ({
                              ...prev,
                              backgroundColor: e.target.value,
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={couponSettings.backgroundColor}
                          onChange={(e) =>
                            setCouponSettings((prev) => ({
                              ...prev,
                              backgroundColor: e.target.value,
                            }))
                          }
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#666] block mb-1">Text Color</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E8DFD0] bg-[#FAF7F2]">
                        <input
                          type="color"
                          value={couponSettings.textColor}
                          onChange={(e) =>
                            setCouponSettings((prev) => ({ ...prev, textColor: e.target.value }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={couponSettings.textColor}
                          onChange={(e) =>
                            setCouponSettings((prev) => ({ ...prev, textColor: e.target.value }))
                          }
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#666] block mb-1">Badge Accent</label>
                      <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E8DFD0] bg-[#FAF7F2]">
                        <input
                          type="color"
                          value={couponSettings.accentColor}
                          onChange={(e) =>
                            setCouponSettings((prev) => ({
                              ...prev,
                              accentColor: e.target.value,
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={couponSettings.accentColor}
                          onChange={(e) =>
                            setCouponSettings((prev) => ({
                              ...prev,
                              accentColor: e.target.value,
                            }))
                          }
                          className="w-full text-[10px] font-mono uppercase bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Coupon Codes in Ticker */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-[#1A1A1A]">
                      Featured Coupon Codes ({availableCoupons.length} total, {activeCouponsList.length} active)
                    </h2>
                    <p className="text-[11px] text-[#777]">
                      These real coupons automatically loop inside the top ticker. Active coupons allow customers to click and copy.
                    </p>
                  </div>
                  <Link
                    to="/admin/coupons"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <FiPlus className="w-3.5 h-3.5" /> Manage / Create Coupons
                  </Link>
                </div>

                {availableCoupons.length === 0 ? (
                  <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8DFD0] space-y-2">
                    <FiTag className="w-8 h-8 text-[#8B7355] mx-auto opacity-60" />
                    <p className="text-xs font-bold text-[#1A1A1A]">No coupons created yet</p>
                    <p className="text-[11px] text-[#777] max-w-sm mx-auto">
                      Create promotional coupon codes like WELCOME101 or FESTIVE15 to offer special discounts to your shoppers.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/admin/coupons"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B7355] text-white text-xs font-bold shadow-sm"
                      >
                        <FiPlus className="w-3.5 h-3.5" /> Go to Promo Coupons
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableCoupons.map((coupon, idx) => {
                      const isPercentage = coupon.discount_type === 'percentage';
                      const badgeText = isPercentage
                        ? `${parseFloat(coupon.discount_value)}% OFF`
                        : `৳${parseFloat(coupon.discount_value)} OFF`;

                      return (
                        <div
                          key={coupon.id || idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-white"
                              style={{ backgroundColor: couponSettings.accentColor }}
                            >
                              {badgeText}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-[#1A1A1A]">
                                  {coupon.code}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                    coupon.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {coupon.is_active ? 'Active in Ticker' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#666] line-clamp-1 mt-0.5">
                                {coupon.description || 'Special store discount'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-right">
                              <span className="text-[10px] text-[#888] block">Min Order:</span>
                              <span className="font-bold text-[#1A1A1A]">
                                ৳{parseFloat(coupon.min_order_amount || 0).toLocaleString()}
                              </span>
                            </div>
                            <Link
                              to="/admin/coupons"
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-[#E8DFD0] bg-white hover:bg-[#FAF7F2] text-[#555] hover:text-[#1A1A1A]"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanatory Info Box */}
                <div className="p-4 rounded-xl bg-[#F5EFE3]/50 border border-[#E8DFD0] text-xs text-[#666] space-y-1.5">
                  <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    💡 How the Coupon Ticker works on the storefront:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-[#666]">
                    <li>
                      The ticker sits cleanly atop the page and announces all your active coupons in an infinite luxury marquee.
                    </li>
                    <li>
                      When customers click on any coupon code, it instantly copies to their clipboard and shows a confirmation toast.
                    </li>
                    <li>
                      Active coupons are also featured in the shopping cart and checkout order summary for 1-click application.
                    </li>
                  </ul>
                </div>

                {/* Bottom Save Button */}
                <div className="pt-4 flex items-center justify-end border-t border-[#E8DFD0]">
                  <button
                    type="button"
                    onClick={handleSaveCoupon}
                    disabled={savingCoupon}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{savingCoupon ? 'Saving...' : 'Save & Publish Coupon Ticker'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
