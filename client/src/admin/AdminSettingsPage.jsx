import React, { useState, useEffect } from 'react';
import {
  FiSettings,
  FiPhone,
  FiMail,
  FiMapPin,
  FiTruck,
  FiShare2,
  FiSave,
  FiRotateCcw,
  FiDollarSign,
  FiClock,
  FiTarget,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import settingsService from '../services/settingsService';

const DEFAULT_SETTINGS = {
  storeName: 'Vision Eye Care',
  tagline: 'VISION EYE CARE Atelier Bangladesh',
  hotlinePhone: '+880 9612-888999',
  whatsappNumber: '+880 1711-000000',
  supportEmail: 'care@VISION EYE CARE.com.bd',
  showroomAddress: 'House 45, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  businessHours: 'Sat - Thu: 10:00 AM - 9:00 PM | Fri: 3:00 PM - 9:00 PM',
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeShippingThreshold: 5000,
  currency: 'BDT',
  currencySymbol: '৳',
  facebookPixelId: '',
  pixelEnabled: true,
  metaDomainVerification: '',
  googleAnalyticsId: '',
  socialLinks: {
    facebook: 'https://facebook.com/visioneyecare',
    instagram: 'https://instagram.com/visioneyecare',
    whatsapp: 'https://wa.me/8801711000000',
    youtube: 'https://youtube.com/@visioneyecare',
    tiktok: 'https://tiktok.com/@visioneyecare',
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await settingsService.getSettings();
        if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
      } catch (err) {
        toast.error('Failed to load store settings, using defaults');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      toast.success('Store settings saved successfully!');
      window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset store settings to factory defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      toast.success('Settings reset. Click Save Changes to publish.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#8B7355]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]" />
        <span className="ml-3 font-bold text-sm">Loading store settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD0]">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
            Store & Business Settings
          </h1>
          <p className="text-xs text-[#777] mt-1">
            Configure global contact information, delivery fees, free shipping thresholds, and social media channels.
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
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Brand & Identity */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
            <FiSettings className="w-4 h-4 text-[#8B7355]" />
            Brand & General Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Customer Care */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
            <FiPhone className="w-4 h-4 text-[#8B7355]" />
            Customer Support & Showroom
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Hotline / Phone</label>
              <input
                type="text"
                value={settings.hotlinePhone}
                onChange={(e) => handleChange('hotlinePhone', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Business Hours</label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => handleChange('businessHours', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#444] block mb-1">Showroom Address</label>
              <textarea
                rows={2}
                value={settings.showroomAddress}
                onChange={(e) => handleChange('showroomAddress', e.target.value)}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Shipping & Delivery Rules */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
            <FiTruck className="w-4 h-4 text-[#8B7355]" />
            Shipping Rates & Free Delivery Threshold
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">
                Inside Dhaka Fee (৳)
              </label>
              <input
                type="number"
                min="0"
                value={settings.insideDhakaFee}
                onChange={(e) => handleChange('insideDhakaFee', Number(e.target.value))}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
              <span className="text-[10px] text-[#888] mt-1 block">Default: ৳60</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">
                Outside Dhaka Fee (৳)
              </label>
              <input
                type="number"
                min="0"
                value={settings.outsideDhakaFee}
                onChange={(e) => handleChange('outsideDhakaFee', Number(e.target.value))}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
              <span className="text-[10px] text-[#888] mt-1 block">Default: ৳120</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">
                Free Delivery Above (৳)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
              <span className="text-[10px] text-[#888] mt-1 block">Orders equal or above qualify for ৳0 delivery</span>
            </div>
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
            <FiShare2 className="w-4 h-4 text-[#8B7355]" />
            Social Media Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">WhatsApp Chat Link</label>
              <input
                type="text"
                value={settings.socialLinks?.whatsapp || ''}
                onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                placeholder="https://wa.me/..."
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">YouTube URL</label>
              <input
                type="text"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">TikTok URL</label>
              <input
                type="text"
                value={settings.socialLinks?.tiktok || ''}
                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                placeholder="https://tiktok.com/@..."
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Marketing, Meta Ads & Facebook Pixel */}
        <div className="bg-white rounded-2xl border border-[#E8DFD0] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5EFE3] pb-3">
            <div>
              <h2 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
                <FiTarget className="w-4 h-4 text-[#8B7355]" />
                Meta Ads, Facebook Pixel & Domain Verification
              </h2>
              <p className="text-[11px] text-[#777] mt-0.5">
                Connect your Facebook Ads Manager to run conversion campaigns, dynamic retargeting, and track ROAS.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pixelEnabled !== false}
                onChange={(e) => handleChange('pixelEnabled', e.target.checked)}
                className="w-4 h-4 accent-[#8B7355] rounded"
              />
              Enable Meta Pixel
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={settings.facebookPixelId || ''}
                onChange={(e) => handleChange('facebookPixelId', e.target.value.trim())}
                placeholder="e.g. 123456789012345"
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
              <span className="text-[10px] text-[#888] mt-1 block">
                Found in Meta Events Manager &gt; Data Sources &gt; Pixel ID
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#444] block mb-1">
                Meta Domain Verification Code
              </label>
              <input
                type="text"
                value={settings.metaDomainVerification || ''}
                onChange={(e) => handleChange('metaDomainVerification', e.target.value.trim())}
                placeholder="e.g. abcdef1234567890xyz"
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
              <span className="text-[10px] text-[#888] mt-1 block">
                For Meta Business Suite domain verification tag
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#444] block mb-1">
                Google Analytics 4 Measurement ID (Optional)
              </label>
              <input
                type="text"
                value={settings.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value.trim())}
                placeholder="e.g. G-XXXXXXXXXX"
                className="w-full bg-[#FAF7F2] text-[#1A1A1A] font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#E8DFD0] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>

          {/* Pixel Event Helper Info Box */}
          <div className="bg-[#FAF7F2] rounded-xl p-3.5 border border-[#E8DFD0] text-xs space-y-1.5 text-[#555]">
            <p className="font-bold text-[#1A1A1A] flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              ⚡ Standard Conversion Events Automatically Tracked:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <span className="flex items-center gap-1">✅ <strong>PageView</strong> (All pages)</span>
              <span className="flex items-center gap-1">✅ <strong>ViewContent</strong> (Frames)</span>
              <span className="flex items-center gap-1">✅ <strong>AddToCart</strong> (Bag)</span>
              <span className="flex items-center gap-1">✅ <strong>AddToWishlist</strong> (Favorites)</span>
              <span className="flex items-center gap-1">✅ <strong>InitiateCheckout</strong> (Checkout)</span>
              <span className="flex items-center gap-1">✅ <strong>Purchase</strong> (Confirmed orders)</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#8B7355] hover:bg-[#6B5840] text-white text-xs font-bold transition-all shadow-md shadow-[#8B7355]/20 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Store Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
