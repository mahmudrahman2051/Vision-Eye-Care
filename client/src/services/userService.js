import api from './api';

export const userService = {
  /**
   * Get user profile
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Update full_name and phone
   */
  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  async updatePassword(data) {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  /**
   * Get all user saved addresses
   */
  async getAddresses() {
    const response = await api.get('/users/addresses');
    return response.data;
  },

  /**
   * Add a new address
   */
  async addAddress(data) {
    const response = await api.post('/users/addresses', data);
    return response.data;
  },

  /**
   * Update an existing address
   */
  async updateAddress(id, data) {
    const response = await api.put(`/users/addresses/${id}`, data);
    return response.data;
  },

  /**
   * Delete an address
   */
  async deleteAddress(id) {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },

  /**
   * Fetch reviews for product
   */
  async getProductReviews(productId) {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  /**
   * Submit review for purchased product
   */
  async submitReview(productId, reviewData) {
    const response = await api.post(`/reviews/product/${productId}`, reviewData);
    return response.data;
  },
};

export default userService;
