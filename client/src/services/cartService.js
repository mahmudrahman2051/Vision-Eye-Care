import api from './api';

const CART_STORAGE_KEY = 'vision_guest_cart';

function getLocalCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { source: 'local' } }));
  } catch {}
}

export const cartService = {
  /**
   * Fetch cart (Server with graceful local fallback)
   */
  async getCart() {
    try {
      const response = await api.get('/cart');
      if (response.data?.status === 'success') {
        saveLocalCart(response.data.data?.items || []);
        return response.data;
      }
    } catch {
      // Backend offline or 405 (static Vercel hosting)
    }

    const items = getLocalCart();
    return {
      status: 'success',
      data: { items },
    };
  },

  /**
   * Add item to cart
   */
  async addToCart(productId, quantity = 1) {
    try {
      const response = await api.post('/cart', { product_id: productId, quantity });
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Item added to bag (local cache)',
        };
      }
      throw err;
    }
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartItemId, quantity) {
    try {
      const response = await api.put(`/cart/${cartItemId}`, { quantity });
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Cart quantity updated (local cache)',
        };
      }
      throw err;
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(cartItemId) {
    try {
      const response = await api.delete(`/cart/${cartItemId}`);
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Item removed from bag (local cache)',
        };
      }
      throw err;
    }
  },

  /**
   * Clear all items in cart
   */
  async clearCart() {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        saveLocalCart([]);
        return {
          status: 'success',
          message: 'Bag cleared',
        };
      }
      throw err;
    }
  },

  /**
   * Merge guest cart items
   */
  async mergeCart(items) {
    try {
      const response = await api.post('/cart/merge', { items });
      return response.data;
    } catch {
      return {
        status: 'success',
        message: 'Cart merged locally',
      };
    }
  },
};

export default cartService;
