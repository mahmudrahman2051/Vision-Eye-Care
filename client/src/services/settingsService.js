import api from './api';

export const settingsService = {
  async getSettings() {
    try {
      const response = await api.get('/settings');
      return response.data?.data || null;
    } catch (error) {
      console.warn('Could not load settings from server, using fallback:', error.message);
      return null;
    }
  },

  async updateSettings(settings) {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },
};

export default settingsService;
