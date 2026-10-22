import api from './api';

const STORAGE_KEY = 'vec_store_settings';

export const settingsService = {
  async getSettings() {
    try {
      const response = await api.get('/settings');
      if (response.data?.data) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.data));
        } catch {}
        return response.data.data;
      }
    } catch {
      // Backend offline or 405
    }

    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        return JSON.parse(local);
      }
    } catch {}

    return null;
  },

  async updateSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings }));
    } catch {}

    try {
      const response = await api.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Store settings saved successfully',
          data: settings,
        };
      }
      throw error;
    }
  },
};

export default settingsService;
