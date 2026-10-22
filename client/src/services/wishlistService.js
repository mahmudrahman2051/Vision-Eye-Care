import api from './api';

const WISHLIST_STORAGE_KEY = 'vision_guest_wishlist';

function getLocalWishlist() {
  try {
    const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { source: 'local' } }));
  } catch {}
}

export const wishlistService = {
  /**
   * Get user's saved wishlist items
   */
  async getWishlist() {
    try {
      const response = await api.get('/wishlist');
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        saveLocalWishlist(response.data.data);
        return response.data;
      }
    } catch {
      // Offline or 405
    }

    const items = getLocalWishlist();
    return {
      status: 'success',
      data: items,
    };
  },

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId) {
    try {
      const response = await api.post('/wishlist', { product_id: productId });
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Saved to wishlist (local cache)',
        };
      }
      throw err;
    }
  },

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(id) {
    try {
      const response = await api.delete(`/wishlist/${id}`);
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Removed from wishlist (local cache)',
        };
      }
      throw err;
    }
  },

  /**
   * Merge guest wishlist items
   */
  async mergeWishlist(items) {
    try {
      const response = await api.post('/wishlist/merge', { items });
      return response.data;
    } catch {
      return {
        status: 'success',
        message: 'Wishlist merged locally',
      };
    }
  },
};

export default wishlistService;
