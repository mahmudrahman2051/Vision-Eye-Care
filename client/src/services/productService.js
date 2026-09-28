import api from './api';

export const productService = {
  /**
   * Fetch paginated & filtered products list
   */
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Fetch top featured & bestseller products
   */
  async getFeaturedProducts() {
    const response = await api.get('/products/featured');
    return response.data;
  },

  /**
   * Fetch single product details by ID or Slug
   */
  async getProductByIdOrSlug(idOrSlug) {
    const response = await api.get(`/products/${idOrSlug}`);
    return response.data;
  },

  /**
   * Fetch all active categories & subcategories
   */
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  /**
   * Admin: Create product
   */
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Admin: Update product
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Admin: Upload product images
   */
  async uploadProductImages(id, formData) {
    const response = await api.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Admin: Delete product image
   */
  async deleteProductImage(productId, imageId) {
    const response = await api.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },
};

export default productService;
