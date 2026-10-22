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
const settingsController = require('../controllers/settingsController');
const bannerController = require('../controllers/bannerController');
const contactController = require('../controllers/contactController');

// Marquee Ticker
router.get('/ticker', tickerController.getTickerSettings);
router.put('/ticker', tickerController.updateTickerSettings);

// Store Settings
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);

// Homepage Banners & Blocks
router.get('/banners', bannerController.getBanners);
router.put('/banners', bannerController.updateBanners);

// Inquiries / Contact Messages
router.get('/inquiries', contactController.getContactMessages);
router.put('/inquiries/:id/status', contactController.updateMessageStatus);
router.delete('/inquiries/:id', contactController.deleteContactMessage);

// Newsletter Subscribers
router.get('/subscribers', contactController.getSubscribers);
router.delete('/subscribers/:id', contactController.deleteSubscriber);

module.exports = router;
