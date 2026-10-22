const { query } = require('../db/pool');

/**
 * GET /api/wishlist
 * Get all wishlist items for current user
 */
async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT w.id, w.product_id, w.created_at,
              p.name, p.slug, p.price, p.compare_price, p.brand, p.stock, p.status,
              COALESCE(
                (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1),
                (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.id ASC LIMIT 1),
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
              ) AS primary_image
       FROM wishlist_items w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/wishlist
 * Add a product to user's wishlist
 */
async function addToWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const rawId = req.body.product_id || req.body.id;
    const product_id = parseInt(String(rawId).replace(/\D/g, ''), 10);

    if (!product_id || isNaN(product_id)) {
      return res.status(400).json({ status: 'fail', message: 'Valid product ID is required.' });
    }

    // Verify product exists
    const prodRes = await query(
      'SELECT id, name FROM products WHERE id = $1',
      [product_id]
    );

    if (prodRes.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    // Insert or ignore if duplicate
    await query(
      `INSERT INTO wishlist_items (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [userId, product_id]
    );

    return getWishlist(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/wishlist/:id
 * Remove product from wishlist
 */
async function removeFromWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const rawId = req.params.id;
    const targetId = parseInt(String(rawId).replace(/\D/g, ''), 10);

    if (targetId && !isNaN(targetId)) {
      await query(
        'DELETE FROM wishlist_items WHERE (id = $1 OR product_id = $1) AND user_id = $2',
        [targetId, userId]
      );
    }

    return getWishlist(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/wishlist/merge
 * Merge guest wishlist items into user's DB wishlist upon login
 */
async function mergeWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return getWishlist(req, res, next);
    }

    for (const item of items) {
      const rawProductId = item.product_id || item.id;
      const productId = parseInt(String(rawProductId).replace(/\D/g, ''), 10);

      if (!productId || isNaN(productId)) continue;

      // Verify product exists
      const prodRes = await query(
        'SELECT id FROM products WHERE id = $1',
        [productId]
      );

      if (prodRes.rows.length === 0) continue;

      await query(
        `INSERT INTO wishlist_items (user_id, product_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, product_id) DO NOTHING`,
        [userId, productId]
      );
    }

    return getWishlist(req, res, next);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  mergeWishlist,
};
