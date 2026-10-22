import api from './api';

const STORAGE_KEY = 'vec_ticker_settings';

export const tickerService = {
  /**
   * Fetch active marquee ticker settings (public)
   */
  async getSettings() {
    // 1. Try backend API first
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

    // 2. Check localStorage cache
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch {}

    return null;
  },

  /**
   * Update marquee ticker settings (admin only)
   */
  async updateSettings(settings) {
    // 1. Always persist to localStorage so it works immediately offline or on static Vercel
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('ticker-updated', { detail: settings }));
    } catch {}

    // 2. Attempt sync with backend API
    try {
      const response = await api.put('/admin/ticker', settings);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      // If 405 (static host like Vercel), 404, or network offline, gracefully succeed with local cache
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
};

export default tickerService;
