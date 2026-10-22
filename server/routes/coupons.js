const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Validate coupon (public or customer)
router.post('/validate', couponController.validateCoupon);

module.exports = router;
