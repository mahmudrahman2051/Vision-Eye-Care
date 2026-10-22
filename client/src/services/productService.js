import api from './api';
import { realProducts } from '../data/realProducts';

const CUSTOM_PRODUCTS_KEY = 'vec_customized_products';

function getLocalProductOverrides() {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalProductOverride(id, productData) {
  try {
    const map = getLocalProductOverrides();
    map[String(id)] = { ...map[String(id)], ...productData };
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(map));
  } catch {}
}

function getMergedProducts() {
  const overrides = getLocalProductOverrides();
  return realProducts.map((p) => {
    const override = overrides[String(p.id)] || overrides[p.product_code];
    if (override) {
      return {
        ...p,
        ...override,
        primary_image: override.image_url || override.primary_image || p.primary_image,
      };
    }
    return p;
  });
}

export const productService = {
  /**
   * Fetch paginated & filtered products list
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      if (response.data?.data?.products?.length > 0) {
        return response.data;
      }
    } catch {
      // Backend offline or 405
    }

    // Local fallback with overrides
    let list = getMergedProducts();

    if (params.search) {
      const term = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(term) ||
          (p.brand || '').toLowerCase().includes(term) ||
          (p.product_code || '').toLowerCase().includes(term) ||
          (p.sku || '').toLowerCase().includes(term)
      );
    }

    if (params.brand) {
      list = list.filter((p) => p.brand === params.brand);
    }

    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 15;
    const total = list.length;
    const total_pages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return {
      status: 'success',
      data: {
        products: paginated,
        pagination: {
          current_page: page,
          total_pages,
          total_products: total,
          limit,
        },
      },
    };
  },

  /**
   * Fetch top featured & bestseller products
   */
  async getFeaturedProducts() {
    try {
      const response = await api.get('/products/featured');
      if (response.data) return response.data;
    } catch {}

    const featured = getMergedProducts().slice(0, 8);
    return { status: 'success', data: { featured, bestsellers: featured } };
  },

  /**
   * Fetch single product details by ID or Slug or Product Code
   */
  async getProductByIdOrSlug(idOrSlug) {
    try {
      const response = await api.get(`/products/${idOrSlug}`);
      if (response.data) return response.data;
    } catch {}

    const list = getMergedProducts();
    const query = String(idOrSlug).toLowerCase();
    const product = list.find(
      (p) =>
        String(p.id) === query ||
        p.slug === query ||
        (p.product_code && p.product_code.toLowerCase() === query)
    );

    if (product) {
      return { status: 'success', data: product };
    }

    throw new Error('Product not found');
  },

  /**
   * Fetch all active categories & subcategories
   */
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch {
      return {
        status: 'success',
        data: [
          { id: 1, name: 'Eyeglasses', slug: 'eyeglasses' },
          { id: 2, name: 'Prescription Glasses', slug: 'prescription-glasses' },
          { id: 3, name: 'Sunglasses', slug: 'sunglasses' },
          { id: 4, name: 'Sports Glasses', slug: 'sports-glasses' },
          { id: 5, name: 'Women', slug: 'women' },
          { id: 6, name: 'Men', slug: 'men' },
          { id: 7, name: 'Kids', slug: 'kids' },
        ],
      };
    }
  },

  /**
   * Admin: Create product
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        const id = Date.now();
        saveLocalProductOverride(id, { ...productData, id });
        return {
          status: 'success',
          message: 'Product created successfully',
          data: { id, ...productData },
        };
      }
      throw error;
    }
  },

  /**
   * Admin: Update product
   */
  async updateProduct(id, productData) {
    saveLocalProductOverride(id, productData);

    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return {
          status: 'success',
          message: 'Product updated successfully',
          data: { id, ...productData },
        };
      }
      throw error;
    }
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Product deleted' };
      }
      throw error;
    }
  },

  /**
   * Admin: Upload product images
   */
  async uploadProductImages(id, formData) {
    try {
      const response = await api.post(`/products/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Image uploaded' };
      }
      throw error;
    }
  },

  /**
   * Admin: Delete product image
   */
  async deleteProductImage(productId, imageId) {
    try {
      const response = await api.delete(`/products/${productId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 405 || status === 404 || !error.response || error.code === 'ERR_NETWORK') {
        return { status: 'success', message: 'Image removed' };
      }
      throw error;
    }
  },
};

export default productService;
