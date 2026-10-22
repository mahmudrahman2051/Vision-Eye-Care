import api from './api';

export const contactService = {
  /**
   * Submit contact inquiry
   */
  async submitContact(data) {
    const response = await api.post('/contact', data);
    return response.data;
  },

  /**
   * Subscribe to newsletter
   */
  async subscribeNewsletter(email) {
    const response = await api.post('/newsletter', { email });
    return response.data;
  },
};

export default contactService;
