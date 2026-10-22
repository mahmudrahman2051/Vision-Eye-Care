const { query, getClient } = require('../db/pool');

/**
 * GET /api/admin/dashboard
 * Aggregated live statistics for admin dashboard
 */
async function getDashboardStats(req, res, next) {
  try {
    const statsQueries = await Promise.all([
      // Total sales
      query(`SELECT COALESCE(SUM(total), 0) AS total_sales FROM orders WHERE payment_status = 'paid' OR order_status = 'delivered'`),
      // Total orders
      query(`SELECT COUNT(*) AS total_orders FROM orders`),
      // Total customers
      query(`SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'`),
      // Total products
      query(`SELECT COUNT(*) AS total_products FROM products`),
      // Low stock count
      query(`SELECT COUNT(*) AS low_stock_count FROM products WHERE stock <= low_stock_threshold`),
      // Pending orders count
      query(`SELECT COUNT(*) AS pending_orders_count FROM orders WHERE order_status = 'pending'`),
    ]);

    const totalSales = parseFloat(statsQueries[0].rows[0].total_sales) || 0;
    const totalOrders = parseInt(statsQueries[1].rows[0].total_orders, 10) || 0;
    const totalCustomers = parseInt(statsQueries[2].rows[0].total_customers, 10) || 0;
    const totalProducts = parseInt(statsQueries[3].rows[0].total_products, 10) || 0;
    const lowStockCount = parseInt(statsQueries[4].rows[0].low_stock_count, 10) || 0;
    const pendingOrdersCount = parseInt(statsQueries[5].rows[0].pending_orders_count, 10) || 0;

    // Recent 10 orders
    const recentOrders = await query(
      `SELECT id, order_number, shipping_name, total, payment_method, payment_status, order_status, created_at
       FROM orders
       ORDER BY created_at DESC
       LIMIT 10`
    );

    // Low stock products alert
    const lowStockItems = await query(
      `SELECT id, name, slug, sku, stock, low_stock_threshold, price, status
       FROM products
       WHERE stock <= low_stock_threshold
       ORDER BY stock ASC
       LIMIT 8`
    );

    // Top selling products
    const bestSellers = await query(
      `SELECT p.id, p.name, p.slug, p.price, COALESCE(SUM(oi.quantity), 0) AS total_sold,
              COALESCE(
                (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1),
                'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
              ) AS image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          total_sales: Math.round(totalSales * 100) / 100,
          total_orders: totalOrders,
          total_customers: totalCustomers,
          total_products: totalProducts,
          low_stock_count: lowStockCount,
          pending_orders_count: pendingOrdersCount,
        },
        recent_orders: recentOrders.rows,
        low_stock_items: lowStockItems.rows,
        best_sellers: bestSellers.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/users
 * List users with pagination and search
 */
async function getUsers(req, res, next) {
  try {
    const { search, role, is_active, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      const idx = params.length;
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx})`);
    }

    if (role) {
      params.push(role);
      conditions.push(`role = $${params.length}`);
    }

    if (is_active !== undefined) {
      params.push(is_active === 'true');
      conditions.push(`is_active = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) FROM users ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].count, 10);

    params.push(limitNum, offset);
    const usersRes = await query(
      `SELECT id, name AS full_name, name, email, phone, role, is_active, created_at,
              (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_count
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.status(200).json({
      status: 'success',
      data: {
        users: usersRes.rows,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          total_pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/users/:id/status
 * Toggle user account status
 */
async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({ status: 'fail', message: 'is_active boolean required.' });
    }

    // Prevent deactivating own account
    if (parseInt(id, 10) === req.user.id && !is_active) {
      return res.status(400).json({ status: 'fail', message: 'You cannot deactivate your own admin account.' });
    }

    const result = await query(
      'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role, is_active',
      [Boolean(is_active), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'User not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: `User account ${is_active ? 'activated' : 'deactivated'} successfully.`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/orders
 * List orders with search, status filters, and pagination
 */
async function getOrders(req, res, next) {
  try {
    const { search, order_status, payment_status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      const idx = params.length;
      conditions.push(`(order_number ILIKE $${idx} OR shipping_name ILIKE $${idx} OR shipping_phone ILIKE $${idx})`);
    }

    if (order_status) {
      params.push(order_status);
      conditions.push(`order_status = $${params.length}`);
    }

    if (payment_status) {
      params.push(payment_status);
      conditions.push(`payment_status = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(`SELECT COUNT(*) FROM orders ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].count, 10);

    params.push(limitNum, offset);
    const ordersRes = await query(
      `SELECT o.*,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS total_items,
              u.email AS customer_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.status(200).json({
      status: 'success',
      data: {
        orders: ordersRes.rows,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          total_pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/orders/:id/status
 * Update order status and payment status, logs to status history
 */
async function updateOrderStatus(req, res, next) {
  const client = await getClient();

  try {
    const { id } = req.params;
    const { order_status, payment_status, note } = req.body;

    await client.query('BEGIN');

    const currentOrder = await client.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (currentOrder.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'fail', message: 'Order not found.' });
    }

    const updates = [];
    const params = [];

    if (order_status) {
      params.push(order_status);
      updates.push(`order_status = $${params.length}`);
    }

    if (payment_status) {
      params.push(payment_status);
      updates.push(`payment_status = $${params.length}`);
    }

    if (updates.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'fail', message: 'No status updates provided.' });
    }

    params.push(id);
    const updatedRes = await client.query(
      `UPDATE orders SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${params.length} RETURNING *`,
      params
    );

    // Record status history if order_status changed
    if (order_status && order_status !== currentOrder.rows[0].order_status) {
      await client.query(
        `INSERT INTO order_status_history (order_id, status, note, changed_by)
         VALUES ($1, $2, $3, $4)`,
        [id, order_status, note || `Status updated to ${order_status} by admin`, req.user.id]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully!',
      data: updatedRes.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

/**
 * GET /api/admin/coupons
 * List all coupons
 */
async function getCoupons(req, res, next) {
  try {
    const result = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/coupons
 * Create a new coupon
 */
async function createCoupon(req, res, next) {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount = 0,
      max_discount,
      usage_limit,
      is_active = true,
      starts_at,
      expires_at,
    } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({
        status: 'fail',
        message: 'Code, discount_type, and discount_value are required.',
      });
    }

    const result = await query(
      `INSERT INTO coupons (
        code, description, discount_type, discount_value, min_order_amount,
        max_discount, usage_limit, is_active, starts_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        code.trim().toUpperCase(),
        description ? description.trim() : null,
        discount_type,
        parseFloat(discount_value),
        parseFloat(min_order_amount) || 0,
        max_discount ? parseFloat(max_discount) : null,
        usage_limit ? parseInt(usage_limit, 10) : null,
        Boolean(is_active),
        starts_at || null,
        expires_at || null,
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Coupon created successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/coupons/:id
 * Update coupon
 */
async function updateCoupon(req, res, next) {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount,
      usage_limit,
      is_active,
      starts_at,
      expires_at,
    } = req.body;

    const result = await query(
      `UPDATE coupons
       SET code = COALESCE($1, code),
           description = COALESCE($2, description),
           discount_type = COALESCE($3, discount_type),
           discount_value = COALESCE($4, discount_value),
           min_order_amount = COALESCE($5, min_order_amount),
           max_discount = COALESCE($6, max_discount),
           usage_limit = COALESCE($7, usage_limit),
           is_active = COALESCE($8, is_active),
           starts_at = COALESCE($9, starts_at),
           expires_at = COALESCE($10, expires_at),
           updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        code ? code.trim().toUpperCase() : null,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        usage_limit,
        is_active,
        starts_at,
        expires_at,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Coupon not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Coupon updated successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/coupons/:id
 * Delete a coupon
 */
async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM coupons WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      message: 'Coupon deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/reviews
 * List all reviews with author & product details
 */
async function getReviews(req, res, next) {
  try {
    const result = await query(
      `SELECT r.*,
              u.name AS user_name, u.email AS user_email,
              p.name AS product_name, p.slug AS product_slug
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN products p ON r.product_id = p.id
       ORDER BY r.created_at DESC`
    );

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/reviews/:id/visibility
 * Toggle review visibility
 */
async function toggleReviewVisibility(req, res, next) {
  try {
    const { id } = req.params;
    const { is_visible } = req.body;

    const result = await query(
      'UPDATE reviews SET is_visible = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [Boolean(is_visible), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Review not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: `Review visibility set to ${is_visible}.`,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/reviews/:id
 * Delete a review
 */
async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    await query('DELETE FROM reviews WHERE id = $1', [id]);
    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getOrders,
  updateOrderStatus,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getReviews,
  toggleReviewVisibility,
  deleteReview,
};
