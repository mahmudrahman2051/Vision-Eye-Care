import api from './api';

const ORDERS_STORAGE_KEY = 'vec_orders_catalog';

export function getLocalOrders() {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: orders }));
  } catch {}
}

export const orderService = {
  /**
   * Place a new order (with resilient local storage fallback for static hosting/Vercel)
   */
  async createOrder(orderData) {
    // 1. Attempt API call to backend server
    try {
      const response = await api.post('/orders', orderData);
      if (response.data?.status === 'success') {
        const order = response.data.data?.order;
        if (order) {
          const current = getLocalOrders();
          saveLocalOrders([order, ...current]);
        }
        return response.data;
      }
    } catch (err) {
      const status = err.response?.status;
      // If 405 (static Vercel without backend), 404, or network offline, create and save locally
      if (status !== 405 && status !== 404 && err.response && err.code !== 'ERR_NETWORK') {
        throw err;
      }
    }

    // 2. Resilient local order placement
    const orderId = Date.now().toString();
    const orderNumber = 'VEC-' + Math.floor(100000 + Math.random() * 900000);
    const items = Array.isArray(orderData.items) ? orderData.items : [];

    const subtotal = items.reduce(
      (sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 1),
      0
    );
    const isDhaka = (orderData.shipping_city || '').toLowerCase().includes('dhaka');
    const deliveryFee = subtotal >= 5000 ? 0 : (isDhaka ? 60 : 120);
    const discountAmount = orderData.coupon_code ? 200 : 0;
    const total = Math.max(0, subtotal - discountAmount + deliveryFee);

    const newOrder = {
      id: orderId,
      order_number: orderNumber,
      user_id: 1,
      shipping_name: (orderData.shipping_name || '').trim(),
      shipping_phone: (orderData.shipping_phone || '').trim(),
      shipping_address: (orderData.shipping_address || '').trim(),
      shipping_city: (orderData.shipping_city || 'Dhaka').trim(),
      shipping_area: (orderData.shipping_area || '').trim(),
      shipping_postal_code: (orderData.shipping_postal_code || '').trim(),
      payment_method: orderData.payment_method || 'cod',
      payment_status: orderData.payment_method === 'cod' ? 'pending' : 'completed',
      order_status: 'pending',
      subtotal: subtotal.toFixed(2),
      delivery_fee: deliveryFee.toFixed(2),
      discount_amount: discountAmount.toFixed(2),
      total: total.toFixed(2),
      coupon_code: orderData.coupon_code || null,
      notes: (orderData.notes || '').trim(),
      items: items.map((it, idx) => ({
        id: `${orderId}-${idx}`,
        product_id: it.product_id || it.id,
        product_name: it.name || it.product_name || `Designer Eyewear Item #${idx + 1}`,
        product_slug: it.slug || '',
        sku: it.sku || `VEC-SKU-${it.product_id || idx + 1}`,
        price: parseFloat(it.price) || 0,
        quantity: parseInt(it.quantity, 10) || 1,
        subtotal: (parseFloat(it.price) || 0) * (parseInt(it.quantity, 10) || 1),
        image_url:
          it.primary_image ||
          it.image_url ||
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const current = getLocalOrders();
    const updated = [newOrder, ...current];
    saveLocalOrders(updated);

    return {
      status: 'success',
      message: 'Order placed successfully!',
      data: {
        order: newOrder,
      },
    };
  },

  /**
   * Fetch current user's order history
   */
  async getUserOrders() {
    try {
      const response = await api.get('/orders');
      if (response.data?.status === 'success') {
        return response.data;
      }
    } catch {
      // 405/offline fallback
    }

    return {
      status: 'success',
      data: getLocalOrders(),
    };
  },

  /**
   * Fetch single order details
   */
  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`);
      if (response.data?.status === 'success') {
        return response.data;
      }
    } catch {
      // 405/offline fallback
    }

    const allOrders = getLocalOrders();
    const cleanId = String(id).trim().toUpperCase();
    const match = allOrders.find(
      (o) =>
        String(o.id) === String(id) ||
        (o.order_number && o.order_number.toUpperCase() === cleanId)
    );

    if (match) {
      return {
        status: 'success',
        data: match,
      };
    }

    return {
      status: 'fail',
      message: 'Order not found',
    };
  },

  /**
   * Cancel order if still pending
   */
  async cancelOrder(id) {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 405 || status === 404 || !err.response || err.code === 'ERR_NETWORK') {
        const allOrders = getLocalOrders();
        let cancelled = null;
        const updated = allOrders.map((o) => {
          if (String(o.id) === String(id) || o.order_number === String(id)) {
            cancelled = { ...o, order_status: 'cancelled', updated_at: new Date().toISOString() };
            return cancelled;
          }
          return o;
        });
        saveLocalOrders(updated);
        return {
          status: 'success',
          message: 'Order cancelled successfully',
          data: cancelled,
        };
      }
      throw err;
    }
  },
};

export default orderService;
