import api from './api';

export const wishlistService = {
  /**
   * Get user's saved wishlist items
   */
  async getWishlist() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId) {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data;
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(id) {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  },
};

export default wishlistService;
