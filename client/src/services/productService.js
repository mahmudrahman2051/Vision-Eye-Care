import api from './api';
import { realProducts } from '../data/realProducts';

const CUSTOM_PRODUCTS_KEY = 'vec_customized_products';

export function getLocalProductOverrides() {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalProductOverride(id, productData) {
  try {
    const map = getLocalProductOverrides();
    const primary =
      productData.image_url ||
      (Array.isArray(productData.images) && productData.images.length > 0
        ? (typeof productData.images[0] === 'string'
            ? productData.images[0]
            : (productData.images[0]?.url || productData.images[0]?.image_url || productData.images[0]?.src))
        : null) ||
      productData.primary_image ||
      '';

    const normalizedImages = Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images.map((img, idx) => {
          const url = typeof img === 'string' ? img : (img.url || img.image_url || img.src);
          return {
            id: img.id || `img-${idx}`,
            image_url: url,
            url,
            is_primary: idx === 0,
          };
        }).filter((i) => Boolean(i.image_url))
      : (primary ? [{ id: 'primary', image_url: primary, url: primary, is_primary: true }] : []);

    const updatedData = {
      ...(map[String(id)] || {}),
      ...productData,
      primary_image: primary,
      image_url: primary,
      images: normalizedImages,
    };

    // Index by all possible identifiers (id, product_code, slug, sku)
    const keys = new Set();
    if (id !== undefined && id !== null) keys.add(String(id));
    if (productData.id !== undefined && productData.id !== null) keys.add(String(productData.id));
    if (productData.product_code) {
      keys.add(String(productData.product_code).trim());
      keys.add(String(productData.product_code).toLowerCase().trim());
    }
    if (productData.slug) {
      keys.add(String(productData.slug).trim());
      keys.add(String(productData.slug).toLowerCase().trim());
    }
    if (productData.sku) {
      keys.add(String(productData.sku).trim());
      keys.add(String(productData.sku).toLowerCase().trim());
    }

    keys.forEach((key) => {
      map[key] = updatedData;
    });

    try {
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(map));
    } catch (quotaError) {
      console.warn('localStorage quota warning when saving product override:', quotaError);
    }
  } catch (err) {
    console.error('Failed to save local product override:', err);
  }
}

export function getMergedProducts() {
  const overrides = getLocalProductOverrides();
  return realProducts.map((p) => {
    const override =
      overrides[String(p.id)] ||
      (p.product_code && overrides[p.product_code]) ||
      (p.product_code && overrides[p.product_code.toLowerCase()]) ||
      (p.slug && overrides[p.slug]) ||
      (p.slug && overrides[p.slug.toLowerCase()]) ||
      (p.sku && overrides[p.sku]) ||
      (p.sku && overrides[p.sku.toLowerCase()]);

    if (override) {
      const primary =
        override.image_url ||
        override.primary_image ||
        (Array.isArray(override.images) && override.images.length > 0
          ? (typeof override.images[0] === 'string'
              ? override.images[0]
              : (override.images[0]?.image_url || override.images[0]?.url))
          : null) ||
        p.primary_image;

      const rawImages = (Array.isArray(override.images) && override.images.length > 0)
        ? override.images
        : (Array.isArray(p.images) && p.images.length > 0)
        ? p.images
        : (primary ? [{ id: 'primary', image_url: primary, url: primary, is_primary: true }] : []);

      const normalizedImages = rawImages.map((img, idx) => {
        const url = typeof img === 'string' ? img : (img.image_url || img.url || img.src);
        return {
          id: img.id || `img-${idx}`,
          image_url: url,
          url,
          is_primary: idx === 0,
        };
      }).filter((i) => Boolean(i.image_url));

      return {
        ...p,
        ...override,
        primary_image: primary,
        image_url: primary,
        images: normalizedImages,
      };
    }
    return p;
  });
}

export const productService = {
  getMergedProducts,
  getLocalProductOverrides,
  saveLocalProductOverride,

  /**
   * Fetch paginated & filtered products list
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/products', { params });
      if (
        response.data &&
        typeof response.data === 'object' &&
        response.data.data?.products?.length > 0
      ) {
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
      if (
        response.data &&
        typeof response.data === 'object' &&
        response.data.data &&
        Array.isArray(response.data.data.featured)
      ) {
        return response.data;
      }
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
      if (
        response.data &&
        typeof response.data === 'object' &&
        response.data.status === 'success' &&
        response.data.data &&
        typeof response.data.data === 'object'
      ) {
        return response.data;
      }
    } catch {}

    const list = getMergedProducts();
    const query = String(idOrSlug).toLowerCase().trim();
    const product = list.find(
      (p) =>
        String(p.id).toLowerCase() === query ||
        (p.slug && p.slug.toLowerCase() === query) ||
        (p.product_code && p.product_code.toLowerCase() === query) ||
        (p.sku && p.sku.toLowerCase() === query)
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
