import api from './api';

export const authService = {
  /**
   * Register new user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current user details from server
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default authService;
