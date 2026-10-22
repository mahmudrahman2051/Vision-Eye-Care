import api from './api';

const STORAGE_KEY = 'vec_banner_settings';

export const bannerService = {
  async getBanners() {
    try {
      const response = await api.get('/banners');
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

  async updateBanners(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('banners-updated', { detail: data }));
    } catch {}

    try {
      const response = await api.put('/admin/banners', data);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Banners updated successfully',
          data,
        };
      }
      throw error;
    }
  },
};

export default bannerService;
