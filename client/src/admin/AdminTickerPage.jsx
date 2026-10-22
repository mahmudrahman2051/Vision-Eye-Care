import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import tickerService from '../services/tickerService';

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

const SEPARATORS = ['✦', '●', '★', '❖', '◈', '|', '•'];

const DEFAULT_SETTINGS = {
  enabled: true,
  speed: 28,
  direction: 'left',
  backgroundColor: '#1A1A1A',
  textColor: '#FAF7F2',
  accentColor: '#8B7355',
  pauseOnHover: true,
  separator: '✦',
  messages: [
    {
      id: '1',
      text: 'Complimentary Nationwide Express Delivery on all orders over ৳5,000',
      badge: 'FREE SHIPPING',
      link: '/shop',
    },
    {
      id: '2',
      text: 'Custom Japanese CNC Lens Milling & Precision Anti-Reflective Coating in Dhaka',
      badge: 'PRECISION LAB',
      link: '/about',
    },
    {
      id: '3',
      text: 'Experience 100+ Designer Frames in the comfort of your home across Dhaka',
      badge: 'HOME TRIAL',
      link: '/contact',
    },
    {
      id: '4',
      text: '1-Year International Warranty on All Titanium & Handcrafted Acetate Frames',
      badge: 'WARRANTY',
      link: '/faq',
    },
  ],
};

export default function AdminTickerPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const data = await tickerService.getSettings();
        if (data) {
          setSettings({ ...DEFAULT_SETTINGS, ...data });
        }
      } catch (err) {
        toast.error('Failed to load current settings, displaying defaults');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (settings.messages.length === 0) {
      toast.error('Please keep at least one announcement message.');
      return;
    }

    try {
      setSaving(true);
      await tickerService.updateSettings(settings);
      toast.success('Marquee ticker updated successfully!');

      // Broadcast update event so local tabs and storefront update instantly
      window.dispatchEvent(
        new CustomEvent('ticker-updated', { detail: settings })
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save ticker settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all ticker settings to factory default?')) {
      setSettings(DEFAULT_SETTINGS);
      toast.success('Settings reset to defaults. Click Save to publish.');
    }
  };

  const handleApplyTheme = (theme) => {
    setSettings((prev) => ({
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
    setSettings((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  };

  const handleUpdateMessage = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...prev.messages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, messages: updated };
    });
  };

  const handleRemoveMessage = (index) => {
    if (settings.messages.length <= 1) {
      toast.error('At least one announcement is required');
      return;
    }
    setSettings((prev) => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index),
    }));
  };

  const handleMoveMessage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= settings.messages.length) return;

    setSettings((prev) => {
      const updated = [...prev.messages];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, messages: updated };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#8B7355]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]" />
        <span className="ml-3 font-bold text-sm">Loading ticker settings...</span>
      </div>
    );
  }

  const animationClass =
    settings.direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left';
  const previewItems = [
    ...settings.messages,
    ...settings.messages,
    ...settings.messages,
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
              Marquee Ticker Settings
            </h1>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                settings.enabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {settings.enabled ? 'Live on Store' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-[#777] mt-1">
            Customize the smooth animated announcement bar displayed directly beneath the storefront navbar.
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

      {/* Live Preview Card */}
      <div className="bg-white rounded-2xl border border-[#E8DFD0] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
            <FiEye className="w-4 h-4 text-[#8B7355]" />
            <span>Live Interactive Preview</span>
            <span className="text-[10px] text-[#888] font-normal">
              (Hover to pause, preview exact styling)
            </span>
          </div>
          <div className="text-[11px] text-[#666]">
            Speed: <span className="font-bold text-[#1A1A1A]">{settings.speed}s</span> • Direction:{' '}
            <span className="font-bold uppercase text-[#1A1A1A]">{settings.direction}</span>
          </div>
        </div>

        {/* Ticker Box */}
        <div className="rounded-xl overflow-hidden border border-[#E8DFD0] shadow-inner">
          {settings.enabled ? (
            <div
              className={`relative w-full overflow-hidden select-none py-2 px-3 text-xs font-medium ${
                settings.pauseOnHover ? 'pause-hover' : ''
              }`}
              style={{
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
                '--marquee-duration': `${Math.max(10, settings.speed)}s`,
              }}
            >
              <div className="flex w-max marquee-track">
                <div
                  className={`flex items-center shrink-0 ${animationClass} marquee-track`}
                  style={{ '--marquee-duration': `${Math.max(10, settings.speed)}s` }}
                >
                  {previewItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-5 whitespace-nowrap"
                    >
                      {item.badge && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                          style={{
                            backgroundColor: settings.accentColor,
                            color: '#FFFFFF',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span className="font-medium">{item.text}</span>
                      <span
                        className="opacity-60 text-[10px] ml-3"
                        style={{ color: settings.accentColor }}
                      >
                        {settings.separator}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs font-semibold text-[#888] bg-[#FAF7F2]">
              Ticker is currently disabled. Toggle &quot;Enable Ticker&quot; below to display.
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
                <p className="text-xs font-bold text-[#1A1A1A]">Enable Marquee Ticker</p>
                <p className="text-[10px] text-[#777]">Render on top of storefront pages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, enabled: e.target.checked }))
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
                  checked={settings.pauseOnHover}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, pauseOnHover: e.target.checked }))
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
                  {settings.speed}s loop
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                step="2"
                value={settings.speed}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, speed: Number(e.target.value) }))
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
                  onClick={() => setSettings((prev) => ({ ...prev, direction: 'left' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    settings.direction === 'left'
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#444] border-[#E8DFD0] hover:bg-white'
                  }`}
                >
                  ← Left (Classic)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, direction: 'right' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    settings.direction === 'right'
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
                    onClick={() => setSettings((prev) => ({ ...prev, separator: sep }))}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all border ${
                      settings.separator === sep
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
                  settings.backgroundColor.toLowerCase() === theme.bg.toLowerCase() &&
                  settings.accentColor.toLowerCase() === theme.accent.toLowerCase();
                return (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => handleApplyTheme(theme)}
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
                      value={settings.backgroundColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.backgroundColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))
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
                      value={settings.textColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, textColor: e.target.value }))
                      }
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.textColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, textColor: e.target.value }))
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
                      value={settings.accentColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, accentColor: e.target.value }))
                      }
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, accentColor: e.target.value }))
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
                  Announcement Items ({settings.messages.length})
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
              {settings.messages.map((item, index) => (
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
                        disabled={index === settings.messages.length - 1}
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
                    {/* Badge input */}
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

                    {/* Announcement text */}
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

                  {/* Destination Link */}
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
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save & Publish Ticker'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
