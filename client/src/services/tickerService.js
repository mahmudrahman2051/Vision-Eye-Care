import api from './api';

const STORAGE_KEY = 'vec_ticker_settings';
const COUPON_STORAGE_KEY = 'vec_coupon_ticker_settings';

export const DEFAULT_TICKER_SETTINGS = {
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

export const DEFAULT_COUPON_TICKER_SETTINGS = {
  enabled: true,
  speed: 24,
  direction: 'left',
  pauseOnHover: true,
  backgroundColor: '#121212',
  textColor: '#FAF7F2',
  accentColor: '#8B7355',
  separator: '✦',
  promptText: '[Click to Copy]',
};

export const tickerService = {
  /**
   * Fetch active main marquee ticker settings (public)
   */
  async getSettings() {
    try {
      const response = await api.get('/ticker');
      if (response.data?.data) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.data));
        } catch {}
        return response.data.data;
      }
    } catch {
      // Backend offline or 405 (static Vercel hosting)
    }

    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch {}

    return DEFAULT_TICKER_SETTINGS;
  },

  /**
   * Update main marquee ticker settings (admin only)
   */
  async updateSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('ticker-updated', { detail: settings }));
    } catch {}

    try {
      const response = await api.put('/admin/ticker', settings);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Ticker settings saved successfully (Stored in local cache)',
          data: settings,
        };
      }
      throw error;
    }
  },

  /**
   * Fetch active coupon marquee ticker settings (over navbar)
   */
  async getCouponTickerSettings() {
    try {
      const response = await api.get('/ticker/coupon');
      if (response.data?.data) {
        try {
          localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(response.data.data));
        } catch {}
        return response.data.data;
      }
    } catch {
      // Backend offline or 405
    }

    try {
      const local = localStorage.getItem(COUPON_STORAGE_KEY);
      if (local) {
        return { ...DEFAULT_COUPON_TICKER_SETTINGS, ...JSON.parse(local) };
      }
    } catch {}

    return DEFAULT_COUPON_TICKER_SETTINGS;
  },

  /**
   * Update coupon marquee ticker settings (admin only)
   */
  async updateCouponTickerSettings(settings) {
    try {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('coupon-ticker-updated', { detail: settings }));
    } catch {}

    try {
      const response = await api.put('/admin/coupon-ticker', settings);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Coupon ticker settings saved successfully (Stored in local cache)',
          data: settings,
        };
      }
      throw error;
    }
  },
};

export default tickerService;
