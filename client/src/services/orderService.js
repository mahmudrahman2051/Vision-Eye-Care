import api from './api';

export const orderService = {
  /**
   * Place a new order
   */
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  /**
   * Fetch current user's order history
   */
  async getUserOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  /**
   * Fetch single order details
   */
  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Cancel order if still pending
   */
  async cancelOrder(id) {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;
