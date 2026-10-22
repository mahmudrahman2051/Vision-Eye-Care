import api from './api';
import couponService from './couponService';

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
   * Coupons CRUD (Delegated to resilient couponService)
   */
  getCoupons() {
    return couponService.getCoupons();
  },
  createCoupon(data) {
    return couponService.createCoupon(data);
  },
  updateCoupon(id, data) {
    return couponService.updateCoupon(id, data);
  },
  deleteCoupon(id) {
    return couponService.deleteCoupon(id);
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
