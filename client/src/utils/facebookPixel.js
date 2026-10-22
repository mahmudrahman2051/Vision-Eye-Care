/**
 * Facebook Pixel / Meta Ads Tracking Utility
 * Supports all standard Meta e-commerce conversion events:
 * - PageView
 * - ViewContent
 * - AddToCart
 * - AddToWishlist
 * - InitiateCheckout
 * - Purchase
 * - Contact / Lead
 * - Search
 */

let isInitialized = false;
let currentPixelId = null;

/**
 * Dynamically inject Meta Pixel base script
 */
export function initFacebookPixel(pixelId) {
  if (!pixelId || typeof window === 'undefined') return;

  if (isInitialized && currentPixelId === pixelId) {
    return;
  }

  try {
    if (!window.fbq) {
      /* eslint-disable */
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
    }

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
    isInitialized = true;
    currentPixelId = pixelId;
    console.log(`[Meta Pixel] Initialized successfully with ID: ${pixelId}`);
  } catch (err) {
    console.warn('[Meta Pixel] Failed to initialize pixel:', err);
  }
}

/**
 * Track route change / PageView
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Track ViewContent (Product Details View)
 */
export function trackViewContent(product) {
  if (typeof window !== 'undefined' && window.fbq && product) {
    const productId = String(product.id || product.product_id || '');
    const price = parseFloat(product.price) || 0;

    window.fbq('track', 'ViewContent', {
      content_name: product.name || 'Eyewear Frame',
      content_category: product.category_name || product.brand || 'Eyewear',
      content_ids: [productId],
      content_type: 'product',
      value: price,
      currency: 'BDT',
    });
  }
}

/**
 * Track AddToCart
 */
export function trackAddToCart(product, quantity = 1) {
  if (typeof window !== 'undefined' && window.fbq && product) {
    const productId = String(product.id || product.product_id || '');
    const price = parseFloat(product.price) || 0;
    const qty = parseInt(quantity, 10) || 1;

    window.fbq('track', 'AddToCart', {
      content_name: product.name || 'Eyewear Frame',
      content_ids: [productId],
      content_type: 'product',
      value: price * qty,
      currency: 'BDT',
    });
  }
}

/**
 * Track AddToWishlist
 */
export function trackAddToWishlist(product) {
  if (typeof window !== 'undefined' && window.fbq && product) {
    const productId = String(product.id || product.product_id || '');
    const price = parseFloat(product.price) || 0;

    window.fbq('track', 'AddToWishlist', {
      content_name: product.name || 'Eyewear Frame',
      content_ids: [productId],
      content_type: 'product',
      value: price,
      currency: 'BDT',
    });
  }
}

/**
 * Track InitiateCheckout
 */
export function trackInitiateCheckout(cartItems = [], totalAmount = 0) {
  if (typeof window !== 'undefined' && window.fbq) {
    const contentIds = cartItems.map((item) => String(item.product_id || item.id));
    const contents = cartItems.map((item) => ({
      id: String(item.product_id || item.id),
      quantity: item.quantity || 1,
      item_price: parseFloat(item.price) || 0,
    }));

    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      contents,
      num_items: cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
      value: parseFloat(totalAmount) || 0,
      currency: 'BDT',
    });
  }
}

/**
 * Track Purchase
 */
export function trackPurchase(order) {
  if (typeof window !== 'undefined' && window.fbq && order) {
    const items = order.items || [];
    const contentIds = items.map((item) => String(item.product_id || item.id));
    const total = parseFloat(order.total_amount || order.total) || 0;

    window.fbq('track', 'Purchase', {
      content_ids: contentIds,
      content_type: 'product',
      value: total,
      currency: 'BDT',
      order_id: String(order.order_number || order.id || Date.now()),
    });
  }
}

/**
 * Track Search
 */
export function trackSearch(query) {
  if (typeof window !== 'undefined' && window.fbq && query) {
    window.fbq('track', 'Search', {
      search_string: query,
    });
  }
}

/**
 * Track Contact / Lead
 */
export function trackContact(leadType = 'General Inquiry') {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact', {
      content_category: leadType,
    });
  }
}
