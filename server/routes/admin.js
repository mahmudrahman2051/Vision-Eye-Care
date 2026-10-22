const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All routes require authenticated admin
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Users
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

// Orders
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Categories
router.get('/categories', categoryController.getCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Coupons
router.get('/coupons', adminController.getCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Reviews
router.get('/reviews', adminController.getReviews);
router.put('/reviews/:id/visibility', adminController.toggleReviewVisibility);
router.delete('/reviews/:id', adminController.deleteReview);

const tickerController = require('../controllers/tickerController');

// Marquee Ticker
router.get('/ticker', tickerController.getTickerSettings);
router.put('/ticker', tickerController.updateTickerSettings);

module.exports = router;
