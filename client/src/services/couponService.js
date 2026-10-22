import api from './api';

export const couponService = {
  /**
   * Validate a coupon code against current amount
   */
  async validateCoupon(code, amount) {
    const response = await api.post('/coupons/validate', { code, amount });
    return response.data;
  },
};

export default couponService;
