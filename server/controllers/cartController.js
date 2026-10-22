const { query } = require('../db/pool');

/**
 * Helper to compute cart totals
 */
function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.price) || 0) * (item.quantity || 1);
  }, 0);
  const delivery_fee = subtotal > 0 ? (subtotal >= 5000 ? 0 : 100) : 0;
  const total = subtotal + delivery_fee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    delivery_fee,
    total: Math.round(total * 100) / 100,
    item_count: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
  };
}

/**
 * GET /api/cart
 * Get user's cart items with computed totals
 */
async function getCart(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT c.id, c.quantity, c.created_at, c.updated_at,
              p.id AS product_id, p.name, p.slug, p.price, p.compare_price, p.stock, p.brand, p.status,
              COALESCE(
                (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1),
                (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.id ASC LIMIT 1),
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
              ) AS primary_image
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    const items = result.rows;
    const totals = calculateTotals(items);

    res.status(200).json({
      status: 'success',
      data: {
        items,
        ...totals,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cart
 * Add a product to cart or increment quantity
 */
async function addToCart(req, res, next) {
  try {
    const userId = req.user.id;
    const rawId = req.body.product_id || req.body.id;
    const product_id = parseInt(String(rawId).replace(/\D/g, ''), 10);
    const quantity = req.body.quantity || 1;

    if (!product_id || isNaN(product_id)) {
      return res.status(400).json({ status: 'fail', message: 'Valid product ID is required.' });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // Verify product exists and is active
    const prodRes = await query(
      'SELECT id, name, price, stock, status FROM products WHERE id = $1',
      [product_id]
    );

    if (prodRes.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    const product = prodRes.rows[0];

    if (product.status !== 'active') {
      return res.status(400).json({ status: 'fail', message: 'Product is currently unavailable.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ status: 'fail', message: 'Product is out of stock.' });
    }

    // Check existing cart item
    const existingRes = await query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, product_id]
    );

    let newQuantity = qty;
    if (existingRes.rows.length > 0) {
      newQuantity = existingRes.rows[0].quantity + qty;
    }

    if (newQuantity > product.stock) {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot add more than available stock (${product.stock} units available).`,
      });
    }

    if (existingRes.rows.length > 0) {
      await query(
        'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2',
        [newQuantity, existingRes.rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [userId, product_id, newQuantity]
      );
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/cart/:id
 * Update quantity of a cart item
 */
async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const rawId = req.params.id;
    const cartItemId = parseInt(String(rawId).replace(/\D/g, ''), 10);
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ status: 'fail', message: 'Quantity must be at least 1.' });
    }

    if (!cartItemId || isNaN(cartItemId)) {
      return res.status(400).json({ status: 'fail', message: 'Valid cart item ID is required.' });
    }

    // Find item and check stock (match by cart item id or product_id)
    const itemRes = await query(
      `SELECT c.id, c.quantity, p.stock, p.name 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE (c.id = $1 OR c.product_id = $1) AND c.user_id = $2`,
      [cartItemId, userId]
    );

    if (itemRes.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Cart item not found.' });
    }

    const item = itemRes.rows[0];

    if (qty > item.stock) {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot set quantity higher than available stock (${item.stock} available).`,
      });
    }

    await query(
      'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2',
      [qty, item.id]
    );

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/cart/:id
 * Remove an item from cart
 */
async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    const rawId = req.params.id;
    const targetId = parseInt(String(rawId).replace(/\D/g, ''), 10);

    if (targetId && !isNaN(targetId)) {
      await query(
        'DELETE FROM cart_items WHERE (id = $1 OR product_id = $1) AND user_id = $2',
        [targetId, userId]
      );
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/cart
 * Clear all items in cart
 */
async function clearCart(req, res, next) {
  try {
    const userId = req.user.id;

    await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully.',
      data: {
        items: [],
        subtotal: 0,
        delivery_fee: 0,
        total: 0,
        item_count: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/cart/merge
 * Merge guest cart items into user's DB cart after login
 */
async function mergeCart(req, res, next) {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return getCart(req, res, next);
    }

    for (const item of items) {
      const rawProductId = item.product_id || item.id;
      const productId = parseInt(String(rawProductId).replace(/\D/g, ''), 10);
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

      if (!productId || isNaN(productId)) continue;

      const prodRes = await query(
        'SELECT id, stock, status FROM products WHERE id = $1',
        [productId]
      );

      if (prodRes.rows.length === 0 || prodRes.rows[0].status !== 'active') {
        continue;
      }

      const availableStock = prodRes.rows[0].stock;
      if (availableStock <= 0) continue;

      const existing = await query(
        'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );

      if (existing.rows.length > 0) {
        const combinedQty = Math.min(availableStock, existing.rows[0].quantity + qty);
        await query(
          'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2',
          [combinedQty, existing.rows[0].id]
        );
      } else {
        const initialQty = Math.min(availableStock, qty);
        await query(
          `INSERT INTO cart_items (user_id, product_id, quantity)
           VALUES ($1, $2, $3)`,
          [userId, productId, initialQty]
        );
      }
    }

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
};
