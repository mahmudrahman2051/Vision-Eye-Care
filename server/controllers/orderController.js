const { getClient, query } = require('../db/pool');
const { calculateCouponDiscount } = require('./couponController');

/**
 * Generate unique order number
 */
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `VEC-${dateStr}-${randomStr}`;
}

/**
 * POST /api/orders
 * Create new order with full database transaction
 */
async function createOrder(req, res, next) {
  const client = await getClient();

  try {
    const userId = req.user.id;
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_area,
      shipping_postal_code,
      payment_method = 'cod',
      coupon_code,
      notes,
      items: directItems, // optional: in case placing direct order or cart
    } = req.body;

    // 1. Validation
    if (!shipping_name || !shipping_name.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Recipient name is required.' });
    }
    if (!shipping_phone || !shipping_phone.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Phone number is required.' });
    }
    if (!shipping_address || !shipping_address.trim()) {
      return res.status(400).json({ status: 'fail', message: 'Delivery address is required.' });
    }
    if (!shipping_city || !shipping_city.trim()) {
      return res.status(400).json({ status: 'fail', message: 'City is required.' });
    }

    await client.query('BEGIN');

    // 2. Fetch items (either from user's DB cart or directItems)
    let orderItemsData = [];

    if (Array.isArray(directItems) && directItems.length > 0) {
      // Direct items provided
      for (const it of directItems) {
        const prodRes = await client.query(
          `SELECT p.id, p.name, p.slug, p.sku, p.price, p.stock, p.status,
                  COALESCE(
                    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1),
                    (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.id ASC LIMIT 1),
                    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
                  ) AS image_url
           FROM products p WHERE p.id = $1`,
          [it.product_id || it.id]
        );
        if (prodRes.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ status: 'fail', message: `Product ${it.product_id} not found.` });
        }
        orderItemsData.push({
          ...prodRes.rows[0],
          quantity: Math.max(1, parseInt(it.quantity, 10) || 1),
        });
      }
    } else {
      // Fetch from cart_items table
      const cartRes = await client.query(
        `SELECT c.product_id, c.quantity,
                p.name, p.slug, p.sku, p.price, p.stock, p.status,
                COALESCE(
                  (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = true LIMIT 1),
                  (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.id ASC LIMIT 1),
                  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'
                ) AS image_url
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1`,
        [userId]
      );
      orderItemsData = cartRes.rows;
    }

    if (orderItemsData.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 'fail', message: 'Your cart is empty.' });
    }

    // 3. Stock validation & Backend price recalculation
    let subtotal = 0;
    for (const item of orderItemsData) {
      if (item.status !== 'active') {
        await client.query('ROLLBACK');
        return res.status(400).json({
          status: 'fail',
          message: `Product "${item.name}" is no longer available for purchase.`,
        });
      }
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          status: 'fail',
          message: `Insufficient stock for "${item.name}". Only ${item.stock} available.`,
        });
      }

      const itemPrice = parseFloat(item.price) || 0;
      subtotal += itemPrice * item.quantity;
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const shippingFee = subtotal >= 5000 ? 0 : 100;

    // 4. Validate and apply coupon if provided
    let discount = 0;
    let couponId = null;

    if (coupon_code && coupon_code.trim()) {
      const couponRes = await client.query(
        'SELECT * FROM coupons WHERE UPPER(code) = $1 AND is_active = true',
        [coupon_code.trim().toUpperCase()]
      );

      if (couponRes.rows.length > 0) {
        const coupon = couponRes.rows[0];
        const now = new Date();
        const isValidDate = (!coupon.starts_at || new Date(coupon.starts_at) <= now) &&
                            (!coupon.expires_at || new Date(coupon.expires_at) >= now);
        const hasUsage = !coupon.usage_limit || coupon.used_count < coupon.usage_limit;
        const meetsMin = !coupon.min_order_amount || subtotal >= parseFloat(coupon.min_order_amount);

        if (isValidDate && hasUsage && meetsMin) {
          discount = calculateCouponDiscount(coupon, subtotal);
          couponId = coupon.id;

          // Increment coupon used count
          await client.query(
            'UPDATE coupons SET used_count = used_count + 1 WHERE id = $1',
            [coupon.id]
          );
        }
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);
    const orderNumber = generateOrderNumber();

    // 5. Create Order
    const orderInsertRes = await client.query(
      `INSERT INTO orders (
        user_id, order_number, subtotal, discount, shipping_fee, total,
        coupon_id, payment_method, payment_status, order_status,
        shipping_name, shipping_phone, shipping_address, shipping_city,
        shipping_area, shipping_postal_code, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        userId,
        orderNumber,
        subtotal,
        discount,
        shippingFee,
        total,
        couponId,
        payment_method,
        payment_method === 'cod' ? 'pending' : 'paid',
        'pending',
        shipping_name.trim(),
        shipping_phone.trim(),
        shipping_address.trim(),
        shipping_city.trim(),
        shipping_area ? shipping_area.trim() : null,
        shipping_postal_code ? shipping_postal_code.trim() : null,
        notes ? notes.trim() : null,
      ]
    );

    const order = orderInsertRes.rows[0];

    // 6. Create Order Items & Decrement Product Stock
    for (const item of orderItemsData) {
      const itemSubtotal = parseFloat(item.price) * item.quantity;

      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, product_slug, sku,
          price, quantity, subtotal, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          order.id,
          item.product_id || item.id,
          item.name,
          item.slug,
          item.sku,
          item.price,
          item.quantity,
          itemSubtotal,
          item.image_url,
        ]
      );

      // Decrement stock
      await client.query(
        `UPDATE products 
         SET stock = GREATEST(0, stock - $1),
             status = CASE WHEN stock - $1 <= 0 THEN 'out_of_stock' ELSE status END
         WHERE id = $2`,
        [item.quantity, item.product_id || item.id]
      );
    }

    // 7. Record payment record
    await client.query(
      `INSERT INTO payments (order_id, payment_method, amount, status)
       VALUES ($1, $2, $3, $4)`,
      [
        order.id,
        payment_method,
        total,
        payment_method === 'cod' ? 'pending' : 'completed',
      ]
    );

    // 8. Record coupon usage if applied
    if (couponId) {
      await client.query(
        `INSERT INTO coupon_usages (coupon_id, user_id, order_id)
         VALUES ($1, $2, $3)`,
        [couponId, userId, order.id]
      );
    }

    // 9. Initial order status history
    await client.query(
      `INSERT INTO order_status_history (order_id, status, note, changed_by)
       VALUES ($1, 'pending', 'Order placed by customer', $2)`,
      [order.id, userId]
    );

    // 10. Clear customer's cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully!',
      data: {
        order,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

/**
 * GET /api/orders
 * Get current user's order history
 */
async function getUserOrders(req, res, next) {
  try {
    const userId = req.user.id;

    const ordersRes = await query(
      `SELECT o.*,
              COUNT(oi.id) AS total_items,
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', oi.id,
                  'product_name', oi.product_name,
                  'product_id', oi.product_id,
                  'price', oi.price,
                  'quantity', oi.quantity,
                  'image_url', oi.image_url
                )
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      status: 'success',
      data: ordersRes.rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:id
 * Get single order details for current user
 */
async function getOrderById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if id is number or order_number string
    const isNum = /^\d+$/.test(id);
    const whereClause = isNum ? 'o.id = $1' : 'o.order_number = $1';

    const orderRes = await query(
      `SELECT o.*, c.code AS coupon_code
       FROM orders o
       LEFT JOIN coupons c ON o.coupon_id = c.id
       WHERE ${whereClause} AND (o.user_id = $2 OR $3 = 'admin')`,
      [id, userId, req.user.role]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'Order not found.' });
    }

    const order = orderRes.rows[0];

    // Fetch items
    const itemsRes = await query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [order.id]
    );

    // Fetch status history
    const historyRes = await query(
      `SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY created_at ASC`,
      [order.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...order,
        items: itemsRes.rows,
        history: historyRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/orders/:id/cancel
 * Cancel order if still in pending status
 */
async function cancelOrder(req, res, next) {
  const client = await getClient();

  try {
    const userId = req.user.id;
    const { id } = req.params;

    await client.query('BEGIN');

    const orderRes = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (orderRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'fail', message: 'Order not found.' });
    }

    const order = orderRes.rows[0];

    if (order.order_status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        status: 'fail',
        message: `Order cannot be cancelled because it is already ${order.order_status}.`,
      });
    }

    // Update status
    await client.query(
      `UPDATE orders SET order_status = 'cancelled', updated_at = NOW() WHERE id = $1`,
      [id]
    );

    // Restock items
    const itemsRes = await client.query(
      'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
      [id]
    );

    for (const item of itemsRes.rows) {
      if (item.product_id) {
        await client.query(
          `UPDATE products 
           SET stock = stock + $1,
               status = CASE WHEN status = 'out_of_stock' THEN 'active' ELSE status END
           WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }
    }

    // Record status history
    await client.query(
      `INSERT INTO order_status_history (order_id, status, note, changed_by)
       VALUES ($1, 'cancelled', 'Order cancelled by customer', $2)`,
      [id, userId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
