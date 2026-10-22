import api from './api';

export const inquiryService = {
  async getInquiries() {
    const response = await api.get('/admin/inquiries');
    return response.data?.data || [];
  },

  async updateStatus(id, is_read) {
    const response = await api.put(`/admin/inquiries/${id}/status`, { is_read });
    return response.data;
  },

  async deleteInquiry(id) {
    const response = await api.delete(`/admin/inquiries/${id}`);
    return response.data;
  },

  async getSubscribers() {
    const response = await api.get('/admin/subscribers');
    return response.data?.data || [];
  },

  async deleteSubscriber(id) {
    const response = await api.delete(`/admin/subscribers/${id}`);
    return response.data;
  },
};

export default inquiryService;
