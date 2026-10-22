import api from './api';

export const adminService = {
  /**
   * Get dashboard metrics and recent activity
   */
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Get users list
   */
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Toggle user active status
   */
  async updateUserStatus(userId, isActive) {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },

  /**
   * Get orders list
   */
  async getOrders(params = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, data) {
    const response = await api.put(`/admin/orders/${orderId}/status`, data);
    return response.data;
  },

  /**
   * Categories CRUD
   */
  async getCategories() {
    const response = await api.get('/admin/categories');
    return response.data;
  },
  async createCategory(data) {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },
  async updateCategory(id, data) {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },
  async deleteCategory(id) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  /**
   * Coupons CRUD
   */
  async getCoupons() {
    const response = await api.get('/admin/coupons');
    return response.data;
  },
  async createCoupon(data) {
    const response = await api.post('/admin/coupons', data);
    return response.data;
  },
  async updateCoupon(id, data) {
    const response = await api.put(`/admin/coupons/${id}`, data);
    return response.data;
  },
  async deleteCoupon(id) {
    const response = await api.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  /**
   * Reviews Moderation
   */
  async getReviews() {
    const response = await api.get('/admin/reviews');
    return response.data;
  },
  async toggleReviewVisibility(id, isVisible) {
    const response = await api.put(`/admin/reviews/${id}/visibility`, { is_visible: isVisible });
    return response.data;
  },
  async deleteReview(id) {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },
};

export default adminService;
