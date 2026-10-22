import api from './api';

export const cartService = {
  /**
   * Fetch authenticated user's cart
   */
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  /**
   * Add item to cart or increment
   */
  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart', { product_id: productId, quantity });
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartItemId, quantity) {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId) {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },

  /**
   * Clear all items in cart
   */
  async clearCart() {
    const response = await api.delete('/cart');
    return response.data;
  },

  /**
   * Merge guest cart items into user's DB cart
   */
  async mergeCart(items) {
    const response = await api.post('/cart/merge', { items });
    return response.data;
  },
};

export default cartService;
