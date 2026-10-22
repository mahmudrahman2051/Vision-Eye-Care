import api from './api';

const STORAGE_KEY = 'vec_coupons_catalog';

export const DEFAULT_COUPONS = [];

const MOCK_CODES = new Set(['VISION20', 'WELCOME10', 'EID1000', 'FREETRIAL']);

function sanitizeCoupons(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((c) => {
    const code = (c.code || '').trim().toUpperCase();
    return !MOCK_CODES.has(code);
  });
}

export const couponService = {
  /**
   * Fetch all coupons (Admin)
   */
  async getCoupons() {
    try {
      const response = await api.get('/admin/coupons');
      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        const sanitized = sanitizeCoupons(response.data.data);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } catch {}
        return { status: 'success', data: sanitized };
      }
    } catch {
      // Backend offline or 405 (static Vercel hosting)
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sanitized = sanitizeCoupons(parsed);
          // If mock items were stripped out, sync the clean array back to storage immediately
          if (sanitized.length !== parsed.length) {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
              window.dispatchEvent(new CustomEvent('coupons-updated', { detail: sanitized }));
            } catch {}
          }
          return { status: 'success', data: sanitized };
        }
      }
    } catch {}

    // Default to clean empty list (never auto-seed mock coupons)
    return { status: 'success', data: [] };
  },

  /**
   * Fetch active coupons for public tickers and cart/checkout banners
   */
  async getActiveCoupons() {
    const res = await this.getCoupons();
    const list = res.data || [];
    return list.filter((c) => Boolean(c.is_active));
  },

  /**
   * Create a new coupon (Admin)
   */
  async createCoupon(data) {
    const newCoupon = {
      id: Date.now().toString(),
      code: data.code.trim().toUpperCase(),
      description: data.description || '',
      discount_type: data.discount_type || 'percentage',
      discount_value: String(data.discount_value || '10'),
      min_order_amount: String(data.min_order_amount || '0'),
      max_discount: data.max_discount ? String(data.max_discount) : '',
      usage_limit: data.usage_limit ? parseInt(data.usage_limit, 10) : null,
      used_count: 0,
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString(),
    };

    // 1. Immediately persist locally
    try {
      const res = await this.getCoupons();
      const current = res.data || [];
      const updated = [newCoupon, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('coupons-updated', { detail: updated }));
    } catch {}

    // 2. Attempt sync with backend API
    try {
      const response = await api.post('/admin/coupons', data);
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Coupon created successfully (Saved to browser storage)',
          data: newCoupon,
        };
      }
      throw err;
    }
  },

  /**
   * Update an existing coupon (Admin)
   */
  async updateCoupon(id, data) {
    let updatedCoupon = null;
    try {
      const res = await this.getCoupons();
      const current = res.data || [];
      const updated = current.map((c) => {
        if (String(c.id) === String(id)) {
          updatedCoupon = { ...c, ...data };
          return updatedCoupon;
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('coupons-updated', { detail: updated }));
    } catch {}

    try {
      const response = await api.put(`/admin/coupons/${id}`, data);
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Coupon updated successfully',
          data: updatedCoupon,
        };
      }
      throw err;
    }
  },

  /**
   * Delete a coupon (Admin)
   */
  async deleteCoupon(id) {
    try {
      const res = await this.getCoupons();
      const current = res.data || [];
      const updated = current.filter((c) => String(c.id) !== String(id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('coupons-updated', { detail: updated }));
    } catch {}

    try {
      const response = await api.delete(`/admin/coupons/${id}`);
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Coupon deleted',
        };
      }
      throw err;
    }
  },

  /**
   * Validate a coupon code against an order subtotal
   */
  async validateCoupon(code, amount) {
    // 1. Try backend API first
    try {
      const response = await api.post('/coupons/validate', { code, amount });
      if (response.data?.status === 'success') {
        return response.data;
      }
    } catch (err) {
      const status = err.response?.status;
      // If server explicitly rejected with 400, pass through the rejection message
      if (status === 400 && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      // If 405/404/offline, proceed to local validation
    }

    // 2. Resilient local validation
    const res = await this.getCoupons();
    const list = res.data || [];
    const cleanCode = (code || '').trim().toUpperCase();
    const coupon = list.find((c) => (c.code || '').toUpperCase() === cleanCode);

    if (!coupon) {
      throw new Error(`Coupon code "${code}" is invalid or does not exist.`);
    }

    if (!coupon.is_active) {
      throw new Error(`Coupon code "${code}" is currently inactive.`);
    }

    const numAmount = parseFloat(amount) || 0;
    const minOrder = parseFloat(coupon.min_order_amount) || 0;
    if (minOrder > 0 && numAmount < minOrder) {
      throw new Error(
        `Minimum order amount of ৳${minOrder.toLocaleString()} required for code "${coupon.code}". (Cart total: ৳${numAmount.toLocaleString()})`
      );
    }

    let discount_amount = 0;
    const val = parseFloat(coupon.discount_value) || 0;
    if (coupon.discount_type === 'percentage') {
      discount_amount = Math.round((numAmount * val) / 100);
      const maxDiscount = parseFloat(coupon.max_discount);
      if (!isNaN(maxDiscount) && maxDiscount > 0 && discount_amount > maxDiscount) {
        discount_amount = maxDiscount;
      }
    } else {
      discount_amount = Math.min(val, numAmount);
    }

    return {
      status: 'success',
      data: {
        code: coupon.code,
        discount_amount,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        description: coupon.description,
        min_order_amount: coupon.min_order_amount,
      },
    };
  },
};

export default couponService;
