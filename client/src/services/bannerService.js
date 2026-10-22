import api from './api';

export const bannerService = {
  async getBanners() {
    try {
      const response = await api.get('/banners');
      return response.data?.data || null;
    } catch (error) {
      console.warn('Could not load banners from server, using fallback:', error.message);
      return null;
    }
  },

  async updateBanners(data) {
    const response = await api.put('/admin/banners', data);
    return response.data;
  },
};

export default bannerService;
