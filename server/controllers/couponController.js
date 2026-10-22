const { query } = require('../db/pool');

/**
 * Helper to validate and calculate coupon discount
 */
function calculateCouponDiscount(coupon, orderAmount) {
  const amount = parseFloat(orderAmount) || 0;
  let discount = 0;

  if (coupon.discount_type === 'percentage') {
    discount = (amount * parseFloat(coupon.discount_value)) / 100;
    if (coupon.max_discount && discount > parseFloat(coupon.max_discount)) {
      discount = parseFloat(coupon.max_discount);
    }
  } else if (coupon.discount_type === 'fixed') {
    discount = Math.min(amount, parseFloat(coupon.discount_value));
  }

  return Math.round(discount * 100) / 100;
}

/**
 * POST /api/coupons/validate
 * Validates a coupon code against current cart/order amount
 */
async function validateCoupon(req, res, next) {
  try {
    const { code, amount } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Coupon code is required.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const orderAmount = parseFloat(amount) || 0;

    const result = await query(
      `SELECT * FROM coupons WHERE UPPER(code) = $1`,
      [cleanCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Invalid coupon code.' });
    }

    const coupon = result.rows[0];

    if (!coupon.is_active) {
      return res.status(400).json({ status: 'fail', message: 'This coupon is no longer active.' });
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return res.status(400).json({ status: 'fail', message: 'This coupon has not started yet.' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return res.status(400).json({ status: 'fail', message: 'This coupon has expired.' });
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ status: 'fail', message: 'This coupon has reached its usage limit.' });
    }

    const minAmount = parseFloat(coupon.min_order_amount) || 0;
    if (orderAmount < minAmount) {
      return res.status(400).json({
        status: 'fail',
        message: `Minimum order amount for this coupon is ৳${minAmount.toLocaleString()}.`,
      });
    }

    const discount = calculateCouponDiscount(coupon, orderAmount);

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied successfully!',
      data: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: parseFloat(coupon.discount_value),
        discount_amount: discount,
        new_total: Math.max(0, orderAmount - discount),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateCoupon,
  calculateCouponDiscount,
};
