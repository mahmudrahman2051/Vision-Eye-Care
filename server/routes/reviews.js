const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

// Public: view product reviews
router.get('/product/:productId', reviewController.getProductReviews);

// Protected: submit review (must have purchased)
router.post('/product/:productId', authenticateToken, reviewController.createReview);

module.exports = router;
