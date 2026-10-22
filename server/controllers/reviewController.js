const { query } = require('../db/pool');

/**
 * GET /api/reviews/product/:productId
 * Fetch visible reviews for a product with author name
 */
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;

    const result = await query(
      `SELECT r.id, r.product_id, r.rating, r.comment, r.created_at,
              u.name AS author_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1 AND r.is_visible = true
       ORDER BY r.created_at DESC`,
      [productId]
    );

    const statsRes = await query(
      `SELECT COUNT(*) AS total_reviews,
              COALESCE(AVG(rating), 5.0) AS average_rating
       FROM reviews
       WHERE product_id = $1 AND is_visible = true`,
      [productId]
    );

    res.status(200).json({
      status: 'success',
      data: {
        reviews: result.rows,
        total_reviews: parseInt(statsRes.rows[0].total_reviews, 10),
        average_rating: parseFloat(statsRes.rows[0].average_rating).toFixed(1),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/reviews/product/:productId
 * Submit a review. Only customers who have ordered this product can submit.
 */
async function createReview(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        status: 'fail',
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    // Verify user has purchased this product
    const orderCheck = await query(
      `SELECT oi.order_id 
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.product_id = $1 AND o.user_id = $2
       LIMIT 1`,
      [productId, userId]
    );

    if (orderCheck.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only review products you have purchased.',
      });
    }

    const orderId = orderCheck.rows[0]?.order_id || null;

    // Insert or update existing review
    const result = await query(
      `INSERT INTO reviews (user_id, product_id, order_id, rating, comment, is_visible)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET rating = $4, comment = $5, updated_at = NOW()
       RETURNING *`,
      [userId, productId, orderId, ratingNum, comment ? comment.trim() : '']
    );

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProductReviews,
  createReview,
};
