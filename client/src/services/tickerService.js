import api from './api';

export const tickerService = {
  /**
   * Fetch active marquee ticker settings (public)
   */
  async getSettings() {
    try {
      const response = await api.get('/ticker');
      return response.data?.data || null;
    } catch (error) {
      console.warn('Could not fetch ticker settings, using defaults:', error.message);
      return null;
    }
  },

  /**
   * Update marquee ticker settings (admin only)
   */
  async updateSettings(settings) {
    const response = await api.put('/admin/ticker', settings);
    return response.data;
  },
};

export default tickerService;
